// Selectable LLM models for story generation, across providers.
// Each option carries a provider so the engine routes to the right API + key.
// Provider keys (optional, added via env): OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY.

export type LlmProvider = "openai" | "anthropic" | "google";

export interface LlmModelOption {
  key: string;
  label: string;
  vendor: string;
  hint: string;
  /** Approximate relative cost (for the credit meter). */
  cost: number;
  provider: LlmProvider;
}

export const LLM_MODELS: LlmModelOption[] = [
  // OpenAI / ChatGPT
  { key: "gpt-4.1", label: "GPT-4.1", vendor: "OpenAI", hint: "Latest — best quality", cost: 2, provider: "openai" },
  { key: "gpt-4o", label: "GPT-4o", vendor: "OpenAI", hint: "Smart & balanced", cost: 1, provider: "openai" },
  { key: "o3-mini", label: "o3-mini", vendor: "OpenAI", hint: "Fast reasoning", cost: 1, provider: "openai" },
  { key: "gpt-4o-mini", label: "GPT-4o mini", vendor: "OpenAI", hint: "Fast & cheap", cost: 0.2, provider: "openai" },
  // Anthropic / Claude
  { key: "claude-sonnet-4-20250514", label: "Claude Sonnet 4", vendor: "Anthropic", hint: "Strong reasoning & writing", cost: 3, provider: "anthropic" },
  { key: "claude-opus-4-20250514", label: "Claude Opus 4", vendor: "Anthropic", hint: "Highest capability", cost: 5, provider: "anthropic" },
  { key: "claude-3-5-haiku-20241022", label: "Claude Haiku 3.5", vendor: "Anthropic", hint: "Fast & efficient", cost: 0.3, provider: "anthropic" },
  // Google / Gemini
  { key: "gemini-2.5-pro", label: "Gemini 2.5 Pro", vendor: "Google", hint: "Deep reasoning", cost: 2, provider: "google" },
  { key: "gemini-2.5-flash", label: "Gemini 2.5 Flash", vendor: "Google", hint: "Fast & cheap", cost: 0.2, provider: "google" },
];

export function getLlmModel(key?: string): LlmModelOption {
  return LLM_MODELS.find((m) => m.key === key) ?? LLM_MODELS[0];
}

/** Estimate story-generation credit cost from a model. */
export function creditCost(modelKey?: string): number {
  return Math.round(getLlmModel(modelKey).cost * 2);
}
