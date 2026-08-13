// Selectable LLM models for story generation. All are OpenAI-compatible and
// work with the configured OPENAI_API_KEY. Add new providers here later by
// giving each option a provider + apiKeyEnv so the engine can route by key.

export interface LlmModelOption {
  key: string;
  label: string;
  vendor: string;
  hint: string;
  /** Approximate relative cost (for the credit meter). */
  cost: number;
}

export const LLM_MODELS: LlmModelOption[] = [
  { key: "gpt-4.1", label: "GPT-4.1", vendor: "OpenAI", hint: "Latest — best quality", cost: 2 },
  { key: "gpt-4o", label: "GPT-4o", vendor: "OpenAI", hint: "Smart & balanced", cost: 1 },
  { key: "o3-mini", label: "o3-mini", vendor: "OpenAI", hint: "Fast reasoning", cost: 1 },
  { key: "gpt-4o-mini", label: "GPT-4o mini", vendor: "OpenAI", hint: "Fast & cheap", cost: 0.2 },
];

export function getLlmModel(key?: string): LlmModelOption {
  return LLM_MODELS.find((m) => m.key === key) ?? LLM_MODELS[0];
}

/** Estimate story-generation credit cost from a model. */
export function creditCost(modelKey?: string): number {
  const m = getLlmModel(modelKey);
  return Math.round(m.cost * 2);
}
