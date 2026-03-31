import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are Circe, an expert Arctic intelligence assistant for Circumpolar.ai. You provide clear, data-backed answers about any Arctic location.

When given a location (lat/lon), you draw on your knowledge of:
- **Permafrost**: distribution maps, active layer depth, ground ice content, thaw risk, subsidence potential
- **Sea ice**: seasonal extent, historical trends, navigation windows, breakup/freeze dates
- **Weather & Climate**: temperature ranges, precipitation, wind, polar night/day, extreme events
- **Cellular Coverage**: tower density, carrier presence, coverage gaps, satellite fallbacks (Iridium, Starlink)
- **Terrain & Elevation**: topography, slope stability, flood risk, coastal erosion
- **Infrastructure Risk**: bearing capacity, frost heave potential, slope stability
- **Ecology**: protected areas, migratory routes, environmental permitting considerations
- **Logistics**: nearest port, runway, road access, resupply windows

Format your responses with **bold** for key terms and data points. Be direct and specific — give actual numbers, ranges, and risk ratings where possible. Keep answers under 200 words unless the user asks for more detail.

If asked about real-time data you don't have live access to, explain what data sources exist (NSIDC, MET Norway, Copernicus) and what they typically show.`;

export async function POST(req: NextRequest) {
  const { messages, location } = await req.json();

  const locationContext = location
    ? `\n\n[Active location pin: ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E${
        location.name ? ` — ${location.name}` : ""
      }]`
    : "";

  const systemWithLocation = SYSTEM + locationContext;

  const formattedMessages = messages
    .filter((m: { role: string; content: string }) => m.content.trim())
    .map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 512,
          system: systemWithLocation,
          messages: formattedMessages,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data =
              JSON.stringify({ delta: { text: event.delta.text } }) + "\n";
            controller.enqueue(encoder.encode(`data: ${data}\n`));
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
