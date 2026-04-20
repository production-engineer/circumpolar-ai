import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const WIND_GO = 15;
const WIND_RISKY = 25;
const TEMP_GO = 0;
const TEMP_RISKY = -10;
const SNOW_GO = 0.5;
const SNOW_RISKY = 2;

type Rating = "go" | "caution" | "risky";

interface DayForecast {
  date: string;
  windMph: number;
  tempMinF: number;
  tempMaxF: number;
  snowIn: number;
  description: string;
  windRating: Rating;
  tempRating: Rating;
  snowRating: Rating;
  overall: Rating;
}

function rateWind(mph: number): Rating {
  if (mph < WIND_GO) return "go";
  if (mph < WIND_RISKY) return "caution";
  return "risky";
}

function rateTemp(f: number): Rating {
  if (f > TEMP_GO) return "go";
  if (f > TEMP_RISKY) return "caution";
  return "risky";
}

function rateSnow(inches: number): Rating {
  if (inches < SNOW_GO) return "go";
  if (inches < SNOW_RISKY) return "caution";
  return "risky";
}

function worstRating(ratings: Rating[]): Rating {
  if (ratings.includes("risky")) return "risky";
  if (ratings.includes("caution")) return "caution";
  return "go";
}

function mmToInches(mm: number): number {
  return mm / 25.4;
}

function buildSummary(days: DayForecast[], siteName: string | null): string {
  const goDays = days.filter((d) => d.overall === "go");
  const cautionDays = days.filter((d) => d.overall === "caution");
  const riskyDays = days.filter((d) => d.overall === "risky");

  const name = siteName ?? "this location";
  const lines: string[] = [];

  if (goDays.length > 0) {
    lines.push(
      `✅ Best days for ${name}: ${goDays.map((d) => d.date).join(", ")}`
    );
  }
  if (cautionDays.length > 0) {
    lines.push(`⚠️ Proceed with caution: ${cautionDays.map((d) => d.date).join(", ")}`);
  }
  if (riskyDays.length > 0) {
    lines.push(`🛑 Risky — avoid: ${riskyDays.map((d) => d.date).join(", ")}`);
  }
  if (goDays.length === 0 && cautionDays.length === 0) {
    lines.push(`All days in this window are risky. Consider rescheduling.`);
  }

  return lines.join("\n");
}

export async function POST(request: NextRequest) {
  const { lat, lng, startDate, endDate, siteName, techName, techEmail } =
    await request.json();

  if (!lat || !lng || !startDate || !endDate) {
    return NextResponse.json(
      { error: "lat, lng, startDate, endDate required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenWeather API key not configured" },
      { status: 500 }
    );
  }

  // One Call API 3.0 — 8-day daily forecast (base plan)
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
  const owRes = await fetch(url);
  if (!owRes.ok) {
    return NextResponse.json(
      { error: "OpenWeather request failed", details: await owRes.text() },
      { status: 502 }
    );
  }

  const owData = await owRes.json();
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  const days: DayForecast[] = (owData.daily ?? [])
    .map((entry: {
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
      // One Call 3.0 returns snow in mm even with imperial units
      const snowIn = entry.snow ? mmToInches(entry.snow) : 0;
      const description = entry.weather?.[0]?.description ?? "";

      const windRating = rateWind(windMph);
      const tempRating = rateTemp(tempMinF);
      const snowRating = rateSnow(snowIn);
      const overall = worstRating([windRating, tempRating, snowRating]);

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
        windRating,
        tempRating,
        snowRating,
        overall,
      };
    })
    .filter(Boolean) as DayForecast[];

  const summary = buildSummary(days, siteName ?? null);

  const siteUrl = new URL("/site", process.env.NEXT_PUBLIC_BASE_URL ?? "https://circumpolar.ai");
  siteUrl.searchParams.set("lat", String(lat));
  siteUrl.searchParams.set("lng", String(lng));
  siteUrl.searchParams.set("start", startDate);
  siteUrl.searchParams.set("end", endDate);
  if (siteName) siteUrl.searchParams.set("name", siteName);

  if (process.env.RESEND_API_KEY && techName && techEmail) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const displayName = siteName ?? `${Number(lat).toFixed(4)}°N, ${Number(lng).toFixed(4)}°W`;

    await resend.emails.send({
      from: "erik@beaded.cloud",
      to: ["erik@beaded.cloud"],
      subject: `🏔️ Field install request: ${displayName}`,
      text: [
        `Field install planning request from ${techName} (${techEmail})`,
        "",
        `Site: ${displayName}`,
        `Coordinates: ${lat}, ${lng}`,
        `Window: ${startDate} → ${endDate}`,
        "",
        summary,
        "",
        `Full site forecast: ${siteUrl.toString()}`,
        "",
        `Days analyzed: ${days.length}`,
      ].join("\n"),
    });
  }

  return NextResponse.json({ days, summary, siteUrl: siteUrl.toString() });
}
