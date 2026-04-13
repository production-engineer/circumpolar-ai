import { describe, it, expect } from "vitest";
import {
  rateWind,
  rateTemp,
  rateSnow,
  worstRating,
  rateDay,
  validateRequest,
  buildSummary,
  mmToInches,
} from "./field-plan";

// ─── Rating thresholds ────────────────────────────────────────────────────────

describe("rateWind", () => {
  it("returns go below 15 mph", () => expect(rateWind(0)).toBe("go"));
  it("returns go at 14.9 mph", () => expect(rateWind(14.9)).toBe("go"));
  it("returns caution at 15 mph", () => expect(rateWind(15)).toBe("caution"));
  it("returns caution at 24.9 mph", () => expect(rateWind(24.9)).toBe("caution"));
  it("returns risky at 25 mph", () => expect(rateWind(25)).toBe("risky"));
  it("returns risky at 60 mph", () => expect(rateWind(60)).toBe("risky"));
});

describe("rateTemp", () => {
  it("returns go above 0°F", () => expect(rateTemp(1)).toBe("go"));
  it("returns go at 32°F", () => expect(rateTemp(32)).toBe("go"));
  it("returns caution at 0°F", () => expect(rateTemp(0)).toBe("caution"));
  it("returns caution at -9.9°F", () => expect(rateTemp(-9.9)).toBe("caution"));
  it("returns risky at -10°F", () => expect(rateTemp(-10)).toBe("risky"));
  it("returns risky at -40°F", () => expect(rateTemp(-40)).toBe("risky"));
});

describe("rateSnow", () => {
  it("returns go at 0 inches", () => expect(rateSnow(0)).toBe("go"));
  it("returns go at 0.49 inches", () => expect(rateSnow(0.49)).toBe("go"));
  it("returns caution at 0.5 inches", () => expect(rateSnow(0.5)).toBe("caution"));
  it("returns caution at 1.99 inches", () => expect(rateSnow(1.99)).toBe("caution"));
  it("returns risky at 2 inches", () => expect(rateSnow(2)).toBe("risky"));
  it("returns risky at 10 inches", () => expect(rateSnow(10)).toBe("risky"));
});

describe("worstRating", () => {
  it("returns go when all go", () => expect(worstRating(["go", "go", "go"])).toBe("go"));
  it("returns caution when one caution", () => expect(worstRating(["go", "caution", "go"])).toBe("caution"));
  it("returns risky when one risky", () => expect(worstRating(["go", "caution", "risky"])).toBe("risky"));
  it("returns risky even when others are go", () => expect(worstRating(["go", "go", "risky"])).toBe("risky"));
  it("risky beats caution", () => expect(worstRating(["caution", "risky"])).toBe("risky"));
});

// ─── rateDay composite ────────────────────────────────────────────────────────

describe("rateDay", () => {
  it("returns go when all factors are green", () => {
    const result = rateDay({ windMph: 10, tempMinF: 5, snowIn: 0 });
    expect(result.overall).toBe("go");
    expect(result.windRating).toBe("go");
    expect(result.tempRating).toBe("go");
    expect(result.snowRating).toBe("go");
  });

  it("returns risky when wind is over 25 mph even if others are fine", () => {
    const result = rateDay({ windMph: 30, tempMinF: 10, snowIn: 0 });
    expect(result.overall).toBe("risky");
    expect(result.windRating).toBe("risky");
  });

  it("returns risky when temp is below -10°F", () => {
    const result = rateDay({ windMph: 5, tempMinF: -15, snowIn: 0 });
    expect(result.overall).toBe("risky");
    expect(result.tempRating).toBe("risky");
  });

  it("returns caution when wind is borderline but temp and snow are fine", () => {
    const result = rateDay({ windMph: 20, tempMinF: 10, snowIn: 0.2 });
    expect(result.overall).toBe("caution");
  });

  it("the Rabbit Lake storm scenario rates risky", () => {
    // Wind described as 'brutal' — representative value
    const result = rateDay({ windMph: 35, tempMinF: -5, snowIn: 1 });
    expect(result.overall).toBe("risky");
  });
});

// ─── Unit conversion ──────────────────────────────────────────────────────────

describe("mmToInches", () => {
  it("converts 25.4mm to 1 inch", () => expect(mmToInches(25.4)).toBeCloseTo(1));
  it("converts 0mm to 0 inches", () => expect(mmToInches(0)).toBe(0));
  it("converts 12.7mm to 0.5 inches", () => expect(mmToInches(12.7)).toBeCloseTo(0.5));
});

// ─── Input validation ─────────────────────────────────────────────────────────

describe("validateRequest", () => {
  const valid = {
    lat: 61.2,
    lng: -149.5,
    startDate: "2026-04-14",
    endDate: "2026-04-18",
  };

  it("accepts a valid request", () => {
    expect(validateRequest(valid)).toBeNull();
  });

  it("rejects missing lat", () => {
    expect(validateRequest({ ...valid, lat: undefined })).toMatch(/lat/);
  });

  it("rejects missing lng", () => {
    expect(validateRequest({ ...valid, lng: undefined })).toMatch(/lng/);
  });

  it("rejects missing startDate", () => {
    expect(validateRequest({ ...valid, startDate: undefined })).toMatch(/date/i);
  });

  it("rejects missing endDate", () => {
    expect(validateRequest({ ...valid, endDate: undefined })).toMatch(/date/i);
  });

  it("rejects lat below -90", () => {
    expect(validateRequest({ ...valid, lat: -91 })).toMatch(/lat/);
  });

  it("rejects lat above 90", () => {
    expect(validateRequest({ ...valid, lat: 91 })).toMatch(/lat/);
  });

  it("rejects lng below -180", () => {
    expect(validateRequest({ ...valid, lng: -181 })).toMatch(/lng/);
  });

  it("rejects lng above 180", () => {
    expect(validateRequest({ ...valid, lng: 181 })).toMatch(/lng/);
  });

  it("rejects endDate before startDate", () => {
    expect(validateRequest({ ...valid, startDate: "2026-04-18", endDate: "2026-04-14" })).toMatch(/end.*before|before.*start/i);
  });

  it("rejects invalid date format", () => {
    expect(validateRequest({ ...valid, startDate: "not-a-date" })).toMatch(/date/i);
  });

  it("rejects window longer than 8 days", () => {
    expect(validateRequest({ ...valid, startDate: "2026-04-01", endDate: "2026-04-30" })).toMatch(/8 days/i);
  });
});

// ─── Summary text ─────────────────────────────────────────────────────────────

describe("buildSummary", () => {
  it("highlights go days", () => {
    const days = [
      { date: "Mon, Apr 14", overall: "go" as const },
      { date: "Tue, Apr 15", overall: "risky" as const },
    ];
    const summary = buildSummary(days, "Rabbit Lake");
    expect(summary).toContain("Mon, Apr 14");
    expect(summary).toContain("Rabbit Lake");
  });

  it("calls out risky days explicitly", () => {
    const days = [{ date: "Wed, Apr 16", overall: "risky" as const }];
    const summary = buildSummary(days, null);
    expect(summary).toContain("Wed, Apr 16");
    expect(summary.toLowerCase()).toContain("risky");
  });

  it("handles an empty window gracefully", () => {
    const summary = buildSummary([], "Test Site");
    expect(summary).toBeTruthy();
    expect(summary.length).toBeGreaterThan(0);
  });

  it("works without a site name", () => {
    const days = [{ date: "Thu, Apr 17", overall: "go" as const }];
    expect(() => buildSummary(days, null)).not.toThrow();
  });
});
