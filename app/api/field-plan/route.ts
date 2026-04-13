import { NextRequest, NextResponse } from "next/server";
import {
  validateRequest,
  rateDay,
  buildSummary,
  mmToInches,
  type DayForecast,
} from "@/lib/field-plan";

// In-memory rate limiter — per IP, 5 requests per 10 minutes
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  if (rateLimiter.size > 1000) {
    for (const [key, val] of rateLimiter) {
      if (now > val.resetAt) rateLimiter.delete(key);
    }
  }

  const entry = rateLimiter.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before submitting again." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const validationError = validateRequest(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { lat, lng, startDate, endDate, siteName } = body;

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather service not configured" },
      { status: 500 }
    );
  }

  const owUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
  const owRes = await fetch(owUrl);

  if (!owRes.ok) {
    return NextResponse.json(
      { error: "Weather data unavailable. Try again shortly." },
      { status: 502 }
    );
  }

  const owData = await owRes.json();

  const start = new Date(startDate + "T00:00:00Z");
  const end = new Date(endDate + "T23:59:59Z");

  const days: DayForecast[] = (owData.daily ?? [])
    .map(
      (entry: {
        dt: number;
        temp: { min: number; max: number };
        wind_speed: number;
        snow?: number;
        weather: { description: string }[];
      }) => {
        const date = new Date(entry.dt * 1000);
        if (date < start || date > end) return null;

        const windMph = entry.wind_speed;
        const tempMinF = entry.temp.min;
        const tempMaxF = entry.temp.max;
        const snowIn = entry.snow ? mmToInches(entry.snow) : 0;
        const description = entry.weather?.[0]?.description ?? "";

        const ratings = rateDay({ windMph, tempMinF, snowIn });

        return {
          date: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          }),
          windMph: Math.round(windMph),
          tempMinF: Math.round(tempMinF),
          tempMaxF: Math.round(tempMaxF),
          snowIn: Math.round(snowIn * 10) / 10,
          description,
          ...ratings,
        };
      }
    )
    .filter(Boolean) as DayForecast[];

  const summary = buildSummary(days, siteName ?? null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://circumpolar.ai";
  const siteUrl = new URL("/site", baseUrl);
  siteUrl.searchParams.set("lat", String(lat));
  siteUrl.searchParams.set("lng", String(lng));
  siteUrl.searchParams.set("start", startDate);
  siteUrl.searchParams.set("end", endDate);
  if (siteName) siteUrl.searchParams.set("name", siteName);

  return NextResponse.json(
    { days, summary, siteUrl: siteUrl.toString() },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" } },
  );
}
