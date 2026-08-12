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
  return [
    "You are 7stories, a professional storytelling assistant.",
    `You write a story for the "${audience.label}" audience about "${input.company}" using the "${plot.title}" narrative archetype.`,
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

export async function generateStory(
  input: GenerateInput
): Promise<GeneratedStory> {
  const plot = getPlot(input.plotKey);

  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add it to .env.local to enable story generation."
    );
  }

  const res = await fetch(`${baseURL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(plot, input) },
        { role: "user", content: buildUserPrompt(plot, input) },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Generation failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Empty response from model");

  const story = normalize(extractJSON(content));

  // Generate media assets when the user asked for image / video / both.
  const mode: AssetMode = input.assetMode ?? "text";
  if (mode !== "text") {
    const { assets } = await generateStoryAssets(mode, {
      audience: input.audience ?? "brand",
      title: story.title,
      hook: story.hook,
    });
    story.assets = assets;
  }
  story._providers = mediaProviders();
  return story;
}
