import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Circe, an AI assistant built into Circumpolar.ai — an Arctic intelligence platform. You give direct, data-backed answers about Arctic and sub-Arctic locations.

When a location is provided, use it as context for all answers. Give specific numbers, risk ratings, and ranges. Name your data sources. Keep answers under 200 words unless asked for more. Do not hedge with disclaimers about being an AI.

You have knowledge of:
- Permafrost risk and active layer dynamics
- Sea ice conditions and forecasts
- Arctic weather patterns (temperature, wind, precipitation)
- Cellular and satellite connectivity in remote areas
- Terrain and elevation
- Infrastructure suitability for Arctic construction

When asked about field installation planning or "when should I plan my install", guide the user through collecting: site name (optional), and target date window. Then provide weather-based go/no-go recommendations using these thresholds:
- Wind: Go <15 mph | Caution 15–25 mph | Risky >25 mph
- Temperature: Go >0°F | Caution −10 to 0°F | Risky <−10°F
- Snow: Go <0.5 in/day | Caution 0.5–2 in | Risky >2 in

Be direct, warm, and specific. You work with field teams who need actionable information, not hedged uncertainty.`;

export async function POST(request: NextRequest) {
  const { messages, location } = await request.json();

  const locationContext = location
    ? `\n\nCurrent pinned location: ${location.name ?? `${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E`} (lat: ${location.lat}, lng: ${location.lng})`
    : "";

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT + locationContext,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          const data = JSON.stringify({ delta: { text: event.delta.text } });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
