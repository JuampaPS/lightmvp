import { NextRequest } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are Bunker, the virtual assistant for Bunker Productions — a creative production studio based in Malmö, Sweden.

Respond in English by default. If the user writes in Spanish, respond in Spanish. If the user writes in Swedish, respond in Swedish.

## About Bunker Productions
Bunker Productions is a creative force rooted in the NGBG cultural zone in Malmö. We design immersive light and sound experiences for events, clubs, festivals, and commercial spaces — from concept and pre-visualization to installation, live operation, and on-site support.

We work to strengthen Malmö's cultural landscape by creating a space where technology, art, and community meet. We build bridges between the underground scene and established institutions, supporting a vibrant cultural ecosystem.

## Services
1. Design & Previsualization: concept, moodboard, CAD and 3D renders, technical plan (lighting, audio, rigging), technical rider.
2. Rental & Installation: intelligent lighting, LED, laser, fog machines, PA line array, microphones, mixing consoles, full setup and rigging.
3. Operation & Programming: live show operators, timecode, DMX programming, d3/Resolume, GrandMA/Onyx, PA calibration with Smaart.

## Technologies
DMX, Timecode, Resolume, GrandMA / Onyx, Line Array, Pixel Mapping, LED pixel mapping, PA systems & tuning, DMX lighting design.

## Coverage
Skåne region, Copenhagen (Denmark), and broader Sweden/Denmark. Liability insurance and electrical certifications included.

## Community Hub
Bunker Productions also runs a Community Hub in the NGBG cultural zone — a space where artists, technicians, and creatives collaborate, experiment, and build projects together.

## Contact & Booking
Email: contact@bunkerproducti0ns.com
Instagram / TikTok / Facebook: @bunker.producti0ns
Website: bunkerproducti0ns.com
To get a quote: share event date, city/venue, estimated capacity, and type of show. We respond within 24 hours.

## Instructions
- Keep answers short and sharp. Max 3 sentences.
- If someone asks about pricing or a quote, ask 1-2 quick questions (date, venue, capacity, type of show) before guiding them to contact.
- Always end by pointing to contact@bunkerproducti0ns.com for bookings and quotes.
- Never use markdown: no asterisks, no bullet dashes, plain text only.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        stream: true,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      return new Response("Something went wrong", { status: 500 });
    }

    // Parse SSE stream and forward only text deltas
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (
                parsed.type === "content_block_delta" &&
                parsed.delta?.type === "text_delta"
              ) {
                controller.enqueue(encoder.encode(parsed.delta.text));
              }
            } catch {
              // skip malformed lines
            }
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
