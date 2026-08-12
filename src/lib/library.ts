// Story library — a saved 7stories creation.
// Persisted to localStorage in the browser for now (no auth yet). When
// Supabase auth + tables are wired up, this same shape maps 1:1 to a
// `stories` table so users can access their library from any device.

import { AudienceKey } from "./audiences";
import { PlotKey } from "./plots";
import { GeneratedStory } from "./story";
import { AssetMode } from "./media";

export type StoryStatus = "draft" | "published";

export interface SavedStory {
  id: string;
  createdAt: string;
  updatedAt: string;
  audience: AudienceKey;
  plotKey: PlotKey;
  title: string;
  facts: string;
  tone?: "professional" | "warm" | "bold" | "empathetic";
  assetMode?: AssetMode;
  status?: StoryStatus;
  story: GeneratedStory;
}

const KEY = "7stories.library.v1";

export function loadLibrary(): SavedStory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStory(
  story: SavedStory
): SavedStory[] {
  const library = loadLibrary();
  const idx = library.findIndex((s) => s.id === story.id);
  if (idx >= 0) library[idx] = story;
  else library.unshift(story);
  persist(library);
  return library;
}

export function deleteStory(id: string): SavedStory[] {
  const library = loadLibrary().filter((s) => s.id !== id);
  persist(library);
  return library;
}

export function updateStory(id: string, patch: Partial<SavedStory>): SavedStory[] {
  const library = loadLibrary().map((s) =>
    s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s
  );
  persist(library);
  return library;
}

function persist(library: SavedStory[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(library));
  } catch {
    // storage full or unavailable — fail silently
  }
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
