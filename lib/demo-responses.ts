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

function cellular(lat: number, lng: number): string {
  const ocLink = `https://opencellid.org/#zoom=10&lat=${lat.toFixed(4)}&lon=${lng.toFixed(4)}`;
  if (lat >= 75)
    return `Almost certainly no terrestrial towers within 10 miles. At this latitude, confirmed GSM infrastructure is 400+ km away. Iridium Certus or Starlink are the only reliable options. Verify at OpenCelliD: ${ocLink}`;
  if (lat >= 68)
    return `Unlikely to find towers within 10 miles unless you're near a coastal settlement. Coverage drops to zero within a few km of most communities. Check actual tower locations for these exact coordinates on OpenCelliD: ${ocLink}`;
  if (lat >= 62)
    return `Possible but not guaranteed. LTE towers exist near communities but rural areas have large gaps. Check the OpenCelliD map for your exact pin: ${ocLink} — zoom in to see confirmed tower locations and their reported range.`;
  return `Coverage depends heavily on proximity to roads and settlements. Check OpenCelliD for confirmed tower locations within 10 miles of this pin: ${ocLink}`;
}

function cellularRadius(lat: number, lng: number, miles: number): string {
  const km = (miles * 1.609).toFixed(0);
  const ocLink = `https://opencellid.org/#zoom=11&lat=${lat.toFixed(4)}&lon=${lng.toFixed(4)}`;
  if (lat >= 75)
    return `No towers within ${miles} miles (${km} km) at ${lat.toFixed(2)}°N. The nearest confirmed cellular infrastructure is typically 400+ km away at this latitude. Satellite is your only option — Starlink or Iridium Certus. See OpenCelliD: ${ocLink}`;
  if (lat >= 68)
    return `Unlikely. At ${lat.toFixed(2)}°N, towers exist only near coastal settlements. A ${miles}-mile radius in wilderness terrain will almost certainly return zero results. Verify on OpenCelliD: ${ocLink} — if there's nothing on that map, there's nothing on the ground.`;
  if (lat >= 62)
    return `Possibly. LTE infrastructure exists at this latitude but is concentrated near communities. Open OpenCelliD and check the ${miles}-mile circle around your pin: ${ocLink} — each dot is a registered tower with reported carrier and technology (2G/3G/LTE).`;
  return `Check OpenCelliD for confirmed towers within ${miles} miles of ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E: ${ocLink} — zoom to your pin and look for tower dots within the radius you need.`;
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
