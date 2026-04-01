export type LocationContext = {
  lat: number;
  lng: number;
  name?: string;
};

function permafrostZone(lat: number): string {
  if (lat >= 75) return "continuous permafrost extending 400–600m depth";
  if (lat >= 68) return "continuous permafrost extending 200–400m depth";
  if (lat >= 62) return "discontinuous permafrost, 50–200m depth in cold spots";
  return "sporadic permafrost with significant taliks";
}

function activeLayerDepth(lat: number): string {
  if (lat >= 75) return "0.3–0.8m active layer";
  if (lat >= 68) return "0.5–1.2m active layer";
  if (lat >= 62) return "0.8–2.0m active layer";
  return "1.5–3.0m active layer in permafrost areas";
}

function groundTemp(lat: number): string {
  if (lat >= 75) return "–8°C to –14°C at 10m depth";
  if (lat >= 68) return "–4°C to –9°C at 10m depth";
  if (lat >= 62) return "–1°C to –5°C at 10m depth";
  return "–0.5°C to –2°C at 10m depth";
}

function airTempRange(lat: number): string {
  if (lat >= 75) return "–20°C to –35°C in winter, +2°C to +6°C in summer";
  if (lat >= 68) return "–15°C to –28°C in winter, +5°C to +12°C in summer";
  if (lat >= 62) return "–10°C to –22°C in winter, +8°C to +16°C in summer";
  return "–5°C to –15°C in winter, +12°C to +18°C in summer";
}

const SETTLEMENTS: { name: string; lat: number; lng: number; coverage: string }[] = [
  { name: "Anchorage", lat: 61.22, lng: -149.90, coverage: "Full LTE/5G — multiple carriers" },
  { name: "Fairbanks", lat: 64.84, lng: -147.72, coverage: "Full LTE — AT&T and GCI" },
  { name: "Juneau", lat: 58.30, lng: -134.42, coverage: "Full LTE in the core" },
  { name: "Nome", lat: 64.50, lng: -165.41, coverage: "GCI LTE in town, drops off sharply outside" },
  { name: "Kotzebue", lat: 66.90, lng: -162.60, coverage: "GCI LTE in town center" },
  { name: "Utqiaġvik", lat: 71.29, lng: -156.79, coverage: "GCI LTE in town — no signal outside" },
  { name: "Bethel", lat: 60.79, lng: -161.76, coverage: "GCI LTE in town, surrounding tundra has none" },
  { name: "Kodiak", lat: 57.79, lng: -152.41, coverage: "Full LTE in town" },
  { name: "Yellowknife", lat: 62.45, lng: -114.37, coverage: "Full LTE — Bell, Rogers, Telus" },
  { name: "Whitehorse", lat: 60.72, lng: -135.05, coverage: "Full LTE in city" },
  { name: "Iqaluit", lat: 63.75, lng: -68.52, coverage: "Bell LTE in town — no coverage outside" },
  { name: "Inuvik", lat: 68.36, lng: -133.72, coverage: "Bell LTE in town" },
  { name: "Churchill", lat: 58.77, lng: -94.17, coverage: "Bell LTE in town" },
  { name: "Tromsø", lat: 69.65, lng: 18.96, coverage: "Full 4G/5G — Telenor and Telia" },
  { name: "Longyearbyen", lat: 78.22, lng: 15.65, coverage: "Telenor 4G in settlement only" },
  { name: "Hammerfest", lat: 70.66, lng: 23.68, coverage: "Full 4G — Telenor" },
  { name: "Murmansk", lat: 68.97, lng: 33.07, coverage: "Full LTE — MTS, Beeline, MegaFon" },
  { name: "Norilsk", lat: 69.35, lng: 88.20, coverage: "LTE in city — dead zone beyond" },
  { name: "Yakutsk", lat: 62.03, lng: 129.73, coverage: "Full LTE — MTS, Beeline, MegaFon" },
  { name: "Nuuk", lat: 64.18, lng: -51.74, coverage: "TUSASS 4G in city" },
  { name: "Reykjavik", lat: 64.13, lng: -21.82, coverage: "Full 4G/5G — Síminn, Vodafone IS" },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestSettlement(lat: number, lng: number): { name: string; distKm: number; coverage: string } | null {
  let nearest = null;
  let minDist = Infinity;
  for (const s of SETTLEMENTS) {
    const d = haversineKm(lat, lng, s.lat, s.lng);
    if (d < minDist) { minDist = d; nearest = s; }
  }
  if (!nearest) return null;
  return { name: nearest.name, distKm: minDist, coverage: nearest.coverage };
}

function cellular(lat: number, lng: number): string {
  const ocLink = `https://opencellid.org/#zoom=10&lat=${lat.toFixed(4)}&lon=${lng.toFixed(4)}`;
  const near = nearestSettlement(lat, lng);
  if (near && near.distKm < 15)
    return `You're within ${near.distKm.toFixed(1)} km of ${near.name}. ${near.coverage}. Signal strength will depend on which side of town you're on — check OpenCelliD for exact tower locations: ${ocLink}`;
  if (near && near.distKm < 50)
    return `You're ${near.distKm.toFixed(0)} km from ${near.name}. ${near.coverage}, but at this distance you're likely outside reliable range. Fringe signal possible on high ground. OpenCelliD: ${ocLink}`;
  if (lat >= 75)
    return `Almost certainly no terrestrial towers here. At this latitude, confirmed GSM infrastructure is 400+ km away. Iridium Certus or Starlink are your only options. Verify at OpenCelliD: ${ocLink}`;
  if (lat >= 68)
    return `Unlikely. Coverage exists only near coastal settlements and you're ${near ? `${near.distKm.toFixed(0)} km from ${near.name}` : "far from any known settlement"}. Check OpenCelliD: ${ocLink}`;
  if (lat >= 62)
    return `Unlikely at this distance from settlements. LTE towers exist near communities but coverage drops to zero within a few km. OpenCelliD: ${ocLink}`;
  return `No signal expected here. Check OpenCelliD for confirmed tower locations: ${ocLink}`;
}

function cellularRadius(lat: number, lng: number, miles: number): string {
  const km = (miles * 1.609).toFixed(0);
  const ocLink = `https://opencellid.org/#zoom=11&lat=${lat.toFixed(4)}&lon=${lng.toFixed(4)}`;
  const near = nearestSettlement(lat, lng);
  if (near && near.distKm < miles * 1.609)
    return `${near.name} is ${near.distKm.toFixed(1)} km away — well within your ${miles}-mile (${km} km) radius. ${near.coverage}. See exact tower locations: ${ocLink}`;
  if (near && near.distKm < miles * 1.609 * 2)
    return `${near.name} (${near.distKm.toFixed(0)} km away) is just outside your ${miles}-mile radius. ${near.coverage}, but fringe signal may reach your pin on clear terrain. OpenCelliD: ${ocLink}`;
  if (lat >= 75)
    return `No towers within ${miles} miles (${km} km). Nearest infrastructure is 400+ km away. Satellite only — Starlink or Iridium Certus. OpenCelliD: ${ocLink}`;
  if (lat >= 68)
    return `Unlikely. Towers at this latitude exist only in settlements and you're ${near ? `${near.distKm.toFixed(0)} km from ${near.name}` : "isolated"}. Verify on OpenCelliD: ${ocLink}`;
  return `Possibly, but check OpenCelliD to confirm: ${ocLink} — each dot is a registered tower with carrier and technology (2G/3G/LTE).`;
}

function constructionSuitability(lat: number): string {
  if (lat >= 75)
    return "Extremely challenging. Continuous permafrost requires thermosyphon-cooled pile foundations at 8–12m depth. Load-bearing capacity is high when frozen but degrades rapidly with warming. A site-specific geotechnical survey is non-negotiable before any foundation design.";
  if (lat >= 68)
    return "Difficult. Permafrost is reliable but warming trends are increasing thaw settlement risk. Pile foundations with thermosyphons are standard. Avoid south-facing slopes where active layer depths exceed 1.5m.";
  if (lat >= 62)
    return "Moderate complexity. Discontinuous permafrost means bearing capacity is highly variable across a single site. Ground ice mapping via resistivity survey should precede any design. Frost heave during shoulder seasons is the primary concern.";
  return "Manageable with standard subarctic engineering. Seasonal frost to 2–3m depth, no reliable permafrost. Insulated foundations and drainage design are the main requirements.";
}

function seaIce(lat: number, lng: number): string {
  const inBeaufort = lng < -100 && lng > -160;
  const inBarents = lng > 15 && lng < 60;
  const inChukchi = lng > 160 || lng < -160;

  let region = "this region";
  if (inBeaufort) region = "the Beaufort Sea";
  else if (inBarents) region = "the Barents Sea";
  else if (inChukchi) region = "the Chukchi Sea";

  if (lat >= 75)
    return `Multi-year ice dominates ${region} at this latitude. Typical concentration is 70–90% year-round, with a narrow navigation window of 4–8 weeks in late August to September. Check NSIDC MASIE for current extent.`;
  if (lat >= 68)
    return `Seasonal ice in ${region}, forming December–January and breaking up June–July depending on year. Ice-free windows are expanding — now averaging 10–14 weeks. NSIDC publishes daily extent data at nsidc.org/data/G02186.`;
  return `${region} is seasonally ice-free at this latitude. Ice forms in sheltered bays and coastal areas December through April. Open-water shipping season runs May–November in most years.`;
}

const RESPONSES: Record<string, (loc: LocationContext) => string> = {
  "What's the permafrost risk here?": (loc) =>
    `This location sits in ${permafrostZone(loc.lat)}, with a ${activeLayerDepth(loc.lat)} and ground temperatures of ${groundTemp(loc.lat)}. Thaw settlement is the primary infrastructure risk as permafrost warms 0.3–0.7°C per decade in this zone. Any foundation design should account for projected active layer deepening over a 20-year horizon.`,

  "Is there cellular coverage?": (loc) => cellular(loc.lat, loc.lng),

  "Current weather conditions?": (loc) =>
    `I don't have real-time access, but MET Norway's Arome Arctic model covers this location — check api.met.no for current data. Typical for the season: ${airTempRange(loc.lat)}, prevailing winds from the northwest at 5–15 m/s, and possible drifting snow reducing visibility below 500m.`,

  "Sea ice data for this area?": (loc) => seaIce(loc.lat, loc.lng),

  "Suitable for construction?": (loc) => constructionSuitability(loc.lat),
};

const FALLBACK = (loc: LocationContext) =>
  `At ${loc.lat.toFixed(2)}°N, ${loc.lng.toFixed(2)}°E — ${loc.name ?? "this location"} — you're working in ${loc.lat >= 66.5 ? "the Arctic Circle" : "subarctic terrain"}. The full Circumpolar API connects this to real-time NSIDC, MET Norway, and ArcticDEM data. Request access to unlock live queries.`;

export function getDemoResponse(question: string, loc: LocationContext): string {
  const exact = RESPONSES[question];
  if (exact) return exact(loc);

  const lower = question.toLowerCase();
  if (lower.includes("permafrost") || lower.includes("ground") || lower.includes("freeze") || lower.includes("thaw"))
    return RESPONSES["What's the permafrost risk here?"](loc);
  if (lower.includes("cell") || lower.includes("coverage") || lower.includes("signal") || lower.includes("starlink") || lower.includes("internet") || lower.includes("tower")) {
    const milesMatch = lower.match(/(\d+)\s*mile/);
    const miles = milesMatch ? parseInt(milesMatch[1]) : null;
    if (miles) return cellularRadius(loc.lat, loc.lng, miles);
    return RESPONSES["Is there cellular coverage?"](loc);
  }
  if (lower.includes("weather") || lower.includes("temperature") || lower.includes("wind") || lower.includes("snow"))
    return RESPONSES["Current weather conditions?"](loc);
  if (lower.includes("ice") || lower.includes("sea") || lower.includes("navigation") || lower.includes("shipping"))
    return RESPONSES["Sea ice data for this area?"](loc);
  if (lower.includes("construct") || lower.includes("build") || lower.includes("foundation") || lower.includes("suitable"))
    return RESPONSES["Suitable for construction?"](loc);

  return FALLBACK(loc);
}
