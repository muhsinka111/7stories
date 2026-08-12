// Auth-aware story persistence: uses Supabase (cloud) when logged in,
// falls back to browser-local storage otherwise.
import { loadLibrary, saveStory as localSave, updateStory as localUpdate, deleteStory as localDelete, SavedStory } from "./library";

interface DbStory {
  id: string;
  audience?: string;
  plot_key?: string;
  title: string;
  facts?: string;
  tone?: string | null;
  asset_mode?: string;
  status?: string;
  story: any;
  created_at?: string;
  updated_at?: string;
}

function dbToSaved(d: DbStory): SavedStory {
  return {
    id: d.id,
    createdAt: d.created_at ?? new Date().toISOString(),
    updatedAt: d.updated_at ?? d.created_at ?? new Date().toISOString(),
    audience: (d.audience as any) ?? "brand",
    plotKey: d.plot_key as any,
    title: d.title,
    facts: d.facts ?? "",
    tone: d.tone as any,
    assetMode: (d.asset_mode as any) ?? "text",
    status: (d.status as any) ?? "draft",
    story: d.story,
  };
}

export function savedToDb(s: SavedStory) {
  return {
    audience: s.audience,
    plotKey: s.plotKey,
    title: s.title,
    facts: s.facts,
    tone: s.tone,
    assetMode: s.assetMode,
    status: s.status ?? "draft",
    story: s.story,
  };
}

export async function isAuthed(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    return !!data?.user;
  } catch {
    return false;
  }
}

export async function loadStories(authed: boolean): Promise<SavedStory[]> {
  if (!authed) return loadLibrary();
  const res = await fetch("/api/stories");
  const data = await res.json();
  return (data.stories ?? []).map(dbToSaved);
}

export async function saveStory(authed: boolean, s: SavedStory): Promise<SavedStory[]> {
  if (!authed) return localSave(s);
  const res = await fetch("/api/stories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(savedToDb(s)),
  });
  if (!res.ok) return localSave(s);
  return loadStories(true);
}

export async function updateStory(authed: boolean, id: string, patch: Partial<SavedStory>): Promise<SavedStory[]> {
  if (!authed) return localUpdate(id, patch);
  const body: Record<string, any> = {};
  if (patch.status) body.status = patch.status;
  if (patch.title) body.title = patch.title;
  if (patch.story) body.story = patch.story;
  await fetch(`/api/stories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return loadStories(true);
}

export async function deleteStory(authed: boolean, id: string): Promise<SavedStory[]> {
  if (!authed) return localDelete(id);
  await fetch(`/api/stories/${id}`, { method: "DELETE" });
  return loadStories(true);
}
