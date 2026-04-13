export type Rating = "go" | "caution" | "risky";

export const MAX_FORECAST_WINDOW_DAYS = 8;

export const RATING_COLORS = {
  go: { bg: "rgba(0,196,113,0.12)", border: "rgba(0,196,113,0.3)", text: "#00c471", label: "Go" },
  caution: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)", text: "#fbbf24", label: "Caution" },
  risky: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#ef4444", label: "Risky" },
} as const;

export const RATING_ICONS = { go: "✅", caution: "⚠️", risky: "🛑" } as const;

export interface DayRating {
  windRating: Rating;
  tempRating: Rating;
  snowRating: Rating;
  overall: Rating;
}

export interface DayFactors {
  windMph: number;
  tempMinF: number;
  snowIn: number;
}

export interface DayForecast extends DayRating {
  date: string;
  windMph: number;
  tempMinF: number;
  tempMaxF: number;
  snowIn: number;
  description: string;
}

export function rateWind(mph: number): Rating {
  if (mph < 15) return "go";
  if (mph < 25) return "caution";
  return "risky";
}

export function rateTemp(f: number): Rating {
  if (f > 0) return "go";
  if (f > -10) return "caution";
  return "risky";
}

export function rateSnow(inches: number): Rating {
  if (inches < 0.5) return "go";
  if (inches < 2) return "caution";
  return "risky";
}

export function worstRating(ratings: Rating[]): Rating {
  if (ratings.includes("risky")) return "risky";
  if (ratings.includes("caution")) return "caution";
  return "go";
}

export function rateDay(factors: DayFactors): DayRating {
  const windRating = rateWind(factors.windMph);
  const tempRating = rateTemp(factors.tempMinF);
  const snowRating = rateSnow(factors.snowIn);
  return {
    windRating,
    tempRating,
    snowRating,
    overall: worstRating([windRating, tempRating, snowRating]),
  };
}

export function mmToInches(mm: number): number {
  return mm / 25.4;
}

export function validateRequest(req: Record<string, unknown>): string | null {
  const { lat, lng, startDate, endDate } = req;

  if (lat === undefined || lat === null) return "lat is required";
  if (lng === undefined || lng === null) return "lng is required";
  if (!startDate) return "startDate is required";
  if (!endDate) return "endDate is required";

  const latNum = Number(lat);
  const lngNum = Number(lng);

  if (isNaN(latNum) || latNum < -90 || latNum > 90) return "lat must be between -90 and 90";
  if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) return "lng must be between -180 and 180";

  const start = new Date(String(startDate));
  const end = new Date(String(endDate));

  if (isNaN(start.getTime())) return "startDate is not a valid date";
  if (isNaN(end.getTime())) return "endDate is not a valid date";
  if (end < start) return "endDate cannot be before startDate";

  const windowDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  if (windowDays > MAX_FORECAST_WINDOW_DAYS) return `Window exceeds ${MAX_FORECAST_WINDOW_DAYS} days (One Call API 3.0 forecast limit)`;

  return null;
}

export function buildSummary(
  days: Pick<DayForecast, "date" | "overall">[],
  siteName: string | null
): string {
  const name = siteName ?? "this location";

  if (days.length === 0) {
    return `No forecast data found for ${name}. The forecast may not reach this far out — check back closer to your install date.`;
  }

  const goDays = days.filter((d) => d.overall === "go").map((d) => d.date);
  const cautionDays = days.filter((d) => d.overall === "caution").map((d) => d.date);
  const riskyDays = days.filter((d) => d.overall === "risky").map((d) => d.date);

  const lines: string[] = [];

  if (goDays.length > 0) {
    lines.push(`✅ Best days for ${name}: ${goDays.join(", ")}`);
  } else {
    lines.push(`No clear go-days found for ${name} in this window.`);
  }

  if (cautionDays.length > 0) {
    lines.push(`⚠️ Proceed with caution: ${cautionDays.join(", ")}`);
  }

  if (riskyDays.length > 0) {
    lines.push(`🛑 Risky — avoid: ${riskyDays.join(", ")}`);
  }

  return lines.join("\n");
}
