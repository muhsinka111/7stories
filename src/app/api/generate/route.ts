import { NextResponse } from "next/server";
import { generateStory } from "@/lib/story";
import { MediaConfigError } from "@/lib/media";
import { getSupabaseAdmin, getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";

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

  const { plotKey, facts, company, tone, audience, category, style, format, videoModel, imageModel, model, referenceImages, language, aspectRatio, resolution, seed, assetMode, docIds } = body ?? {};

  if (typeof plotKey !== "string" || typeof facts !== "string") {
    return NextResponse.json(
      { error: "plotKey and facts are required" },
      { status: 400 }
    );
  }
  if (!facts.trim()) {
    return NextResponse.json({ error: "facts_required" }, { status: 400 });
  }

  // Attach uploaded document text as story context when the user supplies docIds.
  let mergedFacts: string = facts;
  if (Array.isArray(docIds) && docIds.length) {
    const token = await getSessionToken();
    const user = await getUserFromToken(token);
    if (user) {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from("documents")
        .select("name,text_content")
        .in("id", docIds)
        .eq("user_id", user.id);
      const context = (data || [])
        .map((d) => `[${d.name}]\n${(d.text_content || "").slice(0, 8000)}`)
        .join("\n\n");
      if (context) mergedFacts = `CONTEXT DOCUMENTS:\n${context}\n\n${facts}`;
    }
  }

  try {
    const story = await generateStory({
      plotKey,
      facts: mergedFacts,
      company: typeof company === "string" ? company : "",
      tone,
      audience,
      category: typeof category === "string" ? category : undefined,
      style: typeof style === "string" ? style : undefined,
      format: ["story", "book", "poem", "letter"].includes(format) ? format : undefined,
      videoModel: typeof videoModel === "string" ? videoModel : undefined,
      imageModel: typeof imageModel === "string" ? imageModel : undefined,
      referenceImages: Array.isArray(referenceImages) ? referenceImages.filter((x) => typeof x === "string") : undefined,
      model: typeof model === "string" ? model : undefined,
      language: typeof language === "string" ? language : undefined,
      aspectRatio: typeof aspectRatio === "string" ? aspectRatio : undefined,
      resolution: typeof resolution === "string" ? resolution : undefined,
      seed: typeof seed === "number" ? seed : undefined,
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
