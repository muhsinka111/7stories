import { NextResponse } from "next/server";

/**
 * POST /api/enhance — expand a short user idea into a rich, detailed
 * generation prompt that the story engine can work from.
 * Body: { idea, category?, style?, format?, model? }
 */
export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const idea = String(body?.idea ?? "").trim();
  if (!idea) {
    return NextResponse.json({ error: "idea_required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = "gpt-4o-mini"; // enhance always uses OpenAI (lightweight helper)
  if (!apiKey) {
    return NextResponse.json({ error: "config_missing" }, { status: 500 });
  }

  const system = [
    "You are a prompt engineer for 7stories, an AI cinematic storytelling studio.",
    "Your job: take a user's short, rough idea and turn it into a rich, detailed 'raw material' prompt.",
    "Expand it into vivid specifics the story engine can use: subject, who's involved, the emotional arc, key moments, sensory details, and what feeling the final story/image/video should carry.",
    "Do NOT write the story itself. Write the raw material and creative direction only.",
    "Keep it under ~220 words. Use concrete, sensory language. No filler, no cliches.",
  ].join("\n");

  const user = [
    `CATEGORY: ${body?.category ?? "general"}`,
    `STYLE: ${body?.style ?? "cinematic"}`,
    `FORMAT: ${body?.format ?? "story"}`,
    "",
    `THE USER'S IDEA:`,
    idea,
    "",
    "Now expand this into a rich raw-material prompt for the story engine.",
  ].join("\n");

  try {
    const res = await fetch(`${baseURL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return NextResponse.json({ error: `Enhance failed (${res.status})`, detail: t.slice(0, 200) }, { status: 502 });
    }
    const data = await res.json();
    const prompt = data?.choices?.[0]?.message?.content?.trim();
    if (!prompt) return NextResponse.json({ error: "empty" }, { status: 502 });
    return NextResponse.json({ ok: true, prompt });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "enhance_error" }, { status: 500 });
  }
}
