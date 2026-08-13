// The 7stories generation engine.
// Takes a plot arc + raw facts and returns a structured, on-brand story built
// on that arc's beats. Provider-agnostic (OpenAI-compatible chat endpoint).

import { getPlot, Plot } from "./plots";
import { getAudience } from "./audiences";
import {
  AssetMode,
  MediaAsset,
  generateStoryAssets,
  mediaProviders,
} from "./media";
import { getLlmModel, LlmProvider } from "./models";

export interface GenerateInput {
  plotKey: string;
  /** Raw material: product, case study, quotes, metrics. Free text. */
  facts: string;
  /** Company / brand the story is about. */
  company: string;
  /** Storytelling audience: brand, company, or family. */
  audience?: "brand" | "company" | "family";
  /** Tone preference. */
  tone?: "professional" | "warm" | "bold" | "empathetic";
  /** Output language. Defaults to English. */
  language?: string;
  /** Image aspect ratio (16:9, 1:1, 9:16, 4:3). */
  aspectRatio?: string;
  /** Video resolution (720p, 1080p, 4K). */
  resolution?: string;
  /** Random seed for variation (regenerate/redesign). */
  seed?: number;
  /** Category (wedding, newborn, family, brand, …). Defaults to brand. */
  category?: string;
  /** Visual style (cinematic, photoreal, anime, …). Defaults to cinematic. */
  style?: string;
  /** Output format. Defaults to story. */
  format?: "story" | "book" | "poem" | "letter";
  /** Video model key (FAL). Defaults to Veo 3. */
  videoModel?: string;
  /** LLM model key (OpenAI-compatible). Defaults to gpt-4o-mini. */
  model?: string;
  /** Image model key (FAL). */
  imageModel?: string;
  /** Reference image URLs/data URLs used as visual input for generation. */
  referenceImages?: string[];
  /** Asset mode: text, image, video, or both. Defaults to text. */
  assetMode?: AssetMode;
}

export interface GeneratedStory {
  title: string;
  /** One short hook line. */
  hook: string;
  /** Ordered sections matching the arc's beats. */
  sections: { heading: string; body: string }[];
  /** Optional pull-quote. */
  pullQuote?: string;
  /** Suggested CTA. */
  cta: string;
  /** Generated media assets (image / video), when assetMode asks for them. */
  assets?: MediaAsset[];
  /** Which media providers were configured for this run. */
  _providers?: { image?: string; video?: string };
}

function toneLine(tone: GenerateInput["tone"]): string {
  switch (tone) {
    case "warm":
      return "A warm, human, conversational tone. Plain language, no jargon.";
    case "bold":
      return "A bold, confident, punchy tone with short sentences and strong verbs.";
    case "empathetic":
      return "An empathetic tone that validates the customer's struggle before showing the fix.";
    default:
      return "A clear, professional B2B tone — credible, specific, and concise.";
  }
}

function buildSystemPrompt(plot: Plot, input: GenerateInput): string {
  const audience = getAudience(input.audience ?? "brand");
  const fmt = input.format ?? "story";
  const formatLine: Record<string, string> = {
    story: "Write a flowing narrative story.",
    book: "Write this as a book — title, hook, and sections that read like chapters.",
    poem: "Write this as a poem — each section is a stanza, with rhythm and imagery.",
    letter: "Write this as a heartfelt letter, addressed warmly to the subject.",
  };
  return [
    "You are 7stories, a professional storytelling assistant.",
    `You write a story for the "${audience.label}" audience about "${input.company}" using the "${plot.title}" narrative archetype.`,
    "",
    `FORMAT: ${formatLine[fmt] ?? formatLine.story}`,
    "",
    `AUDIENCE — ${audience.label} storytelling:`,
    `- What to tell: ${audience.whatToTell}`,
    ...audience.guidance.map((g) => `- ${g}`),
    "",
    "RULES — FACTUAL DISCIPLINE:",
    "- Follow the beats of the chosen archetype EXACTLY, in order.",
    "- ONLY use facts provided in the raw material. NEVER invent metrics, quotes, names, roles, or results.",
    "- If a needed fact is missing, write around it generically. Do NOT fabricate.",
    "",
    "RULES — CRAFT (this is what separates great stories from AI slop):",
    "- Write like a human storyteller, not a marketing generator.",
    "- Show, don't tell: use concrete scenes and specifics, not adjective stacks.",
    "- Open with substance and momentum. No 'In today's world' or 'At its core' filler.",
    "- Vary sentence length aggressively. Use short sentences for impact.",
    "- Prefer strong verbs and concrete nouns over abstractions and adverbs.",
    "- State outcomes as facts ('Support time fell 40%'), never as hype ('revolutionary' / 'game-changing').",
    "- Ban em-dashes, 'It's not X, it's Y' reversals, and therapeutic/validating language.",
    "- No meta commentary, no 'this story explores', no three-part symmetry padding.",
    "- The subject is the hero; the product or context is the instrument, not the protagonist.",
    `- Tone: ${toneLine(input.tone)}`,
    `- Write the story in ${input.language ?? "English"}.`,
    "- Keep the whole story under ~450 words.",
  ].join("\n");
}

function buildUserPrompt(plot: Plot, input: GenerateInput): string {
  return [
    `RAW MATERIAL (only use this):`,
    input.facts.trim() || "(no raw material provided)",
    "",
    "Write the story now. Return it as STRICT JSON matching this exact shape:",
    `{
      "title": "a compelling story title (max 9 words)",
      "hook": "one punchy opening line",
      "sections": [
        { "heading": "Heading for beat 1", "body": "3-5 sentences" },
        { "heading": "...", "body": "..." }
      ],
      "pullQuote": "one 1-2 sentence quote you can attribute to the customer, or null",
      "cta": "a single clear next-step call to action"
    }`,
    "",
    `The sections must map to these beats: ${plot.beats.map((b, i) => `${i + 1}. ${b}`).join(" | ")}`,
  ].join("\n");
}

function extractJSON(text: string): any {
  const trimmed = text.trim();
  // Try direct parse, else strip code fences / leading prose.
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) {
      return JSON.parse(fenced[1].trim());
    }
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Could not parse JSON from model output");
  }
}

function normalize(story: any): GeneratedStory {
  const sections = Array.isArray(story.sections)
    ? story.sections.map((s: any) => ({
        heading: String(s.heading ?? ""),
        body: String(s.body ?? ""),
      }))
    : [];
  return {
    title: String(story.title ?? "A customer story"),
    hook: String(story.hook ?? ""),
    sections,
    pullQuote: story.pullQuote ? String(story.pullQuote) : undefined,
    cta: String(story.cta ?? ""),
  };
}

/** Provider-aware chat call: routes to OpenAI, Anthropic, or Google by model. */
async function chatLLM(provider: LlmProvider, model: string, system: string, user: string, seed?: number): Promise<string> {
  if (provider === "anthropic") {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY is not configured for Claude models.");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 4096, system, messages: [{ role: "user", content: user }], temperature: 0.8 }),
    });
    if (!res.ok) throw new Error(`Claude generation failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    const content = data?.content?.[0]?.text ?? "";
    if (!content) throw new Error("Empty response from Claude");
    return content;
  }

  if (provider === "google") {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) throw new Error("GOOGLE_API_KEY is not configured for Gemini models.");
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${system}\n\n${user}` }] }],
          generationConfig: { temperature: 0.8 },
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini generation failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    const content = (data?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.text).join("");
    if (!content) throw new Error("Empty response from Gemini");
    return content;
  }

  // default: openai
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured for OpenAI models.");
  const baseURL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const res = await fetch(`${baseURL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      ...(seed ? { seed } : {}),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Generation failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Empty response from model");
  return content;
}

export async function generateStory(
  input: GenerateInput
): Promise<GeneratedStory> {
  const plot = getPlot(input.plotKey);

  const llm = getLlmModel(input.model ?? process.env.OPENAI_MODEL);
  const content = await chatLLM(llm.provider, llm.key, buildSystemPrompt(plot, input), buildUserPrompt(plot, input), input.seed);
  const story = normalize(extractJSON(content));

  // Generate media assets when the user asked for image / video / both.
  const mode: AssetMode = input.assetMode ?? "text";
  if (mode !== "text") {
    const { assets } = await generateStoryAssets(mode, {
      category: input.category ?? "brand",
      style: input.style ?? "cinematic",
      title: story.title,
      hook: story.hook,
      videoModel: input.videoModel,
      imageModel: input.imageModel,
      referenceImages: input.referenceImages,
      aspectRatio: input.aspectRatio,
      resolution: input.resolution,
      seed: input.seed,
    });
    story.assets = assets;
  }
  story._providers = mediaProviders();
  return story;
}
