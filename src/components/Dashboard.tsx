"use client";

import { useEffect, useState } from "react";
import { PLOTS } from "@/lib/plots";
import { AUDIENCES } from "@/lib/audiences";
import type { AudienceKey } from "@/lib/audiences";
import type { PlotKey } from "@/lib/plots";
import type { GeneratedStory } from "@/lib/story";
import {
  loadLibrary,
  saveStory,
  deleteStory,
  newId,
  SavedStory,
} from "@/lib/library";

type View =
  | { name: "library" }
  | { name: "new" }
  | { name: "view"; id: string };

export default function Dashboard() {
  const [library, setLibrary] = useState<SavedStory[]>([]);
  const [view, setView] = useState<View>({ name: "library" });
  const [filters, setFilters] = useState<{ audience?: AudienceKey }>({});

  useEffect(() => {
    setLibrary(loadLibrary());
  }, []);

  const shown = filters.audience
    ? library.filter((s) => s.audience === filters.audience)
    : library;

  const activeStory =
    view.name === "view"
      ? library.find((s) => s.id === view.id)
      : undefined;

  return (
    <div className="flex min-h-screen bg-[--bg]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-[--border] flex flex-col sticky top-0 h-screen p-4">
        <button
          onClick={() => setView({ name: "library" })}
          className="text-xl font-black tracking-tight mb-6 text-left"
        >
          7stories<span className="amber-grad">.</span>
        </button>

        <nav className="space-y-1 flex-1">
          <button
            onClick={() => {
              setFilters({});
              setView({ name: "library" });
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              view.name === "library" && !filters.audience
                ? "bg-white/10 text-[--ink]"
                : "text-[--muted] hover:bg-white/5"
            }`}
          >
            🗂️ All stories
          </button>

          <p className="text-xs uppercase tracking-widest text-[--muted] px-3 pt-4 pb-1">
            Audiences
          </p>
          {AUDIENCES.map((a) => (
            <button
              key={a.key}
              onClick={() => {
                setFilters({ audience: a.key });
                setView({ name: "library" });
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                filters.audience === a.key
                  ? "bg-white/10 text-[--ink]"
                  : "text-[--muted] hover:bg-white/5"
              }`}
            >
              <span>{a.emoji}</span> {a.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setView({ name: "new" })}
          className="btn btn-primary w-full justify-center"
        >
          ✨ New story
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-10">
        {view.name === "new" && (
          <CreateStory
            onSaved={(s) => {
              setLibrary(saveStory(s));
              setView({ name: "view", id: s.id });
            }}
          />
        )}

        {view.name === "view" && activeStory && (
          <StoryViewer
            story={activeStory}
            onBack={() => setView({ name: "library" })}
            onDelete={(id) => {
              setLibrary(deleteStory(id));
              setView({ name: "library" });
            }}
          />
        )}

        {view.name === "library" && (
          <Library
            stories={shown}
            filters={filters}
            onOpen={(id) => setView({ name: "view", id })}
            onNew={() => setView({ name: "new" })}
          />
        )}
      </main>
    </div>
  );
}

/* ───────────── Library ───────────── */

function Library({
  stories,
  filters,
  onOpen,
  onNew,
}: {
  stories: SavedStory[];
  filters: { audience?: AudienceKey };
  onOpen: (id: string) => void;
  onNew: () => void;
}) {
  const aud = AUDIENCES.find((a) => a.key === filters.audience);
  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {aud ? `${aud.emoji} ${aud.label} stories` : "Your stories"}
          </h1>
          <p className="text-[--muted] mt-1">
            {stories.length} saved {stories.length === 1 ? "story" : "stories"}
          </p>
        </div>
      </div>

      {stories.length === 0 ? (
        <EmptyState hasFilter={!!aud} onNew={onNew} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((s) => {
            const a = AUDIENCES.find((x) => x.key === s.audience);
            const p = PLOTS.find((x) => x.key === s.plotKey);
            return (
              <button
                key={s.id}
                onClick={() => onOpen(s.id)}
                className="card p-6 text-left hover:border-[--accent]/60 transition-colors group"
              >
                <div className="flex items-center gap-2 text-xs text-[--muted] mb-3">
                  <span>{a?.emoji}</span>
                  <span className="uppercase tracking-wider">{a?.label}</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    open →
                  </span>
                </div>
                <h3 className="font-bold text-lg leading-snug mb-2">
                  {s.story.title}
                </h3>
                <p className="text-sm text-[--muted] line-clamp-3">
                  {s.story.hook}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="chip">{p?.emoji} {p?.title}</span>
                  <span className="text-xs text-[--muted] ml-auto">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  hasFilter,
  onNew,
}: {
  hasFilter: boolean;
  onNew: () => void;
}) {
  return (
    <div className="card p-14 text-center">
      <div className="text-5xl mb-4">📖</div>
      <h2 className="text-xl font-bold mb-2">
        {hasFilter ? "No stories in this audience yet" : "Welcome to your studio"}
      </h2>
      <p className="text-[--muted] mb-6 max-w-md mx-auto">
        {hasFilter
          ? "Create your first story and it will appear here."
          : "Create your first story — for your brand, your company, or your family."}
      </p>
      <button onClick={onNew} className="btn btn-primary">
        ✨ Create your first story
      </button>
    </div>
  );
}

/* ───────────── Story viewer ───────────── */

function StoryViewer({
  story,
  onBack,
  onDelete,
}: {
  story: SavedStory;
  onBack: () => void;
  onDelete: (id: string) => void;
}) {
  const a = AUDIENCES.find((x) => x.key === story.audience);
  const p = PLOTS.find((x) => x.key === story.plotKey);
  const s = story.story;
  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="text-sm text-[--muted] hover:text-[--ink] mb-6"
      >
        ← Back to library
      </button>

      <div className="flex items-center gap-2 text-xs text-[--muted] mb-3">
        <span className="chip">{a?.emoji} {a?.label}</span>
        <span className="chip">{p?.emoji} {p?.title}</span>
      </div>

      <article className="card p-8 md:p-12 space-y-5">
        <p className="text-[--muted] text-sm italic">{s.hook}</p>
        <h1 className="text-3xl md:text-4xl font-black amber-grad">
          {s.title}
        </h1>
        {s.sections.map((sec, i) => (
          <section key={i}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[--accent] mb-1">
              {sec.heading}
            </h2>
            <p className="text-[--ink]/85 leading-relaxed">{sec.body}</p>
          </section>
        ))}
        {s.pullQuote && (
          <blockquote className="border-l-2 border-[--accent] pl-4 italic text-[--ink]/90">
            “{s.pullQuote}”
          </blockquote>
        )}
        <div className="pt-5 border-t border-[--border] flex items-center justify-between">
          <p className="text-sm text-[--muted]">
            <span className="font-semibold text-[--ink]">Next step:</span>{" "}
            {s.cta}
          </p>
        </div>
      </article>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onDelete(story.id)}
          className="text-sm text-red-400/80 hover:text-red-400"
        >
          Delete story
        </button>
      </div>
    </div>
  );
}

/* ───────────── Create story ───────────── */

function CreateStory({ onSaved }: { onSaved: (s: SavedStory) => void }) {
  const [audience, setAudience] = useState<AudienceKey>("brand");
  const [plotKey, setPlotKey] = useState<PlotKey>(PLOTS[0].key);
  const [company, setCompany] = useState("");
  const [facts, setFacts] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aud = AUDIENCES.find((a) => a.key === audience)!;
  const plot = PLOTS.find((p) => p.key === plotKey)!;

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plotKey, company, facts, audience, tone: "professional" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error === "config_missing"
            ? "Story engine isn't configured yet (OPENAI_API_KEY missing)."
            : data.message || "Generation failed."
        );
      }
      const story: GeneratedStory = data.story;
      const now = new Date().toISOString();
      onSaved({
        id: newId(),
        createdAt: now,
        updatedAt: now,
        audience,
        plotKey,
        title: story.title,
        facts,
        story,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight mb-2">
        Create a new story
      </h1>
      <p className="text-[--muted] mb-8">
        Choose who you're telling it for, pick an arc, and paste your material.
      </p>

      {/* Audience selector */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {AUDIENCES.map((a) => (
          <button
            key={a.key}
            onClick={() => setAudience(a.key)}
            className={`card p-5 text-left transition-all ${
              a.key === audience
                ? "border-[--accent]/60 ring-1 ring-[--accent]/40"
                : "hover:border-[--border]"
            }`}
          >
            <div className="text-2xl mb-2">{a.emoji}</div>
            <div className="font-bold">{a.label}</div>
            <p className="text-xs text-[--muted] mt-1">{a.tagline}</p>
          </button>
        ))}
      </div>

      {/* Audience guidance */}
      <div className="card p-5 mb-8 bg-[--panel-2]">
        <p className="text-sm text-[--muted]">
          <span className="text-[--accent] font-semibold">What to tell:</span>{" "}
          {aud.whatToTell}
        </p>
      </div>

      <form onSubmit={generate} className="card p-6 md:p-8 space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            1 · Choose your story arc
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PLOTS.map((p) => (
              <button
                type="button"
                key={p.key}
                onClick={() => setPlotKey(p.key)}
                className={`px-2 py-2 rounded-lg border text-left text-xs transition-all ${
                  p.key === plotKey
                    ? "border-amber-400/60 bg-amber-400/10"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                <div className="font-semibold leading-tight">{p.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            2 · Title / subject
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={
              audience === "family"
                ? "e.g. Grandmother Rosa's journey"
                : "e.g. Northwind Analytics"
            }
            className="w-full px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            3 · Raw material
          </label>
          <textarea
            required
            rows={6}
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            placeholder={aud.starterPrompt}
            className="w-full px-4 py-3 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? "Writing your story…" : "✨ Generate story"}
        </button>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
