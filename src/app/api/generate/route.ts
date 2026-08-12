import { NextResponse } from "next/server";
import { generateStory } from "@/lib/story";
import { MediaConfigError } from "@/lib/media";

/**
 * POST /api/generate
 * The core feature: build a brand story from a plot arc + raw facts.
 */
export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { plotKey, facts, company, tone, audience, category, style, assetMode } = body ?? {};

  if (typeof plotKey !== "string" || typeof facts !== "string") {
    return NextResponse.json(
      { error: "plotKey and facts are required" },
      { status: 400 }
    );
  }
  if (!facts.trim()) {
    return NextResponse.json({ error: "facts_required" }, { status: 400 });
  }

  try {
    const story = await generateStory({
      plotKey,
      facts,
      company: typeof company === "string" ? company : "",
      tone,
      audience,
      category: typeof category === "string" ? category : undefined,
      style: typeof style === "string" ? style : undefined,
      assetMode: ["text", "image", "video", "both"].includes(assetMode)
        ? assetMode
        : "text",
    });
    return NextResponse.json({ ok: true, story });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    const isConfig = msg.includes("OPENAI_API_KEY");
    const isMediaConfig = err instanceof MediaConfigError;
    return NextResponse.json(
      {
        error: isConfig ? "config_missing" : isMediaConfig ? "media_config_missing" : "generation_failed",
        message: msg,
      },
      { status: isConfig ? 503 : isMediaConfig ? 503 : 502 }
    );
  }
}
