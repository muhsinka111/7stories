"use client";

import { useEffect, useMemo, useState } from "react";
import { PLOTS } from "@/lib/plots";
import { AUDIENCES } from "@/lib/audiences";
import type { AudienceKey } from "@/lib/audiences";
import type { PlotKey } from "@/lib/plots";
import type { GeneratedStory } from "@/lib/story";
import type { AssetMode, MediaAsset } from "@/lib/media";
import { newId, SavedStory, StoryStatus } from "@/lib/library";
import { isAuthed, loadStories, saveStory, updateStory, deleteStory } from "@/lib/storiesClient";
import { useToast } from "@/components/Toast";
import AccountPanel from "./AccountPanel";
import SettingsPanel from "./SettingsPanel";
import StatsPanel from "./StatsPanel";

const TONES = [
  { key: "professional", label: "Professional" },
  { key: "warm", label: "Warm" },
  { key: "bold", label: "Bold" },
  { key: "empathetic", label: "Empathetic" },
] as const;

const ASSET_MODES: { key: AssetMode; label: string; icon: string; desc: string }[] = [
  { key: "text", label: "Text", icon: "✍️", desc: "Story only" },
  { key: "image", label: "Image", icon: "🖼️", desc: "+ cover image" },
  { key: "video", label: "Video", icon: "🎬", desc: "+ story video" },
  { key: "both", label: "Both", icon: "🎥", desc: "image + video" },
];

function AssetModeSelector({
  value,
  onChange,
}: {
  value: AssetMode;
  onChange: (m: AssetMode) => void;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
        Output type
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ASSET_MODES.map((m) => (
          <button
            type="button"
            key={m.key}
            onClick={() => onChange(m.key)}
            className={`px-3 py-3 rounded-lg border text-center transition-all ${
              m.key === value ? "border-[--accent] bg-[--accent]/25 ring-1 ring-[--accent] text-[--ink]" : "border-[--border] hover:bg-white/5"
            }`}
          >
            <div className="text-xl mb-1">{m.icon}</div>
            <div className="font-semibold text-sm">{m.label}</div>
            <div className="text-[11px] text-[--muted]">{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MediaBlock({ assets, alt }: { assets: MediaAsset[]; alt: string }) {
  return (
    <div className="space-y-3">
      {assets.map((a, i) =>
        a.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={a.url} alt={alt} className="w-full rounded-xl object-cover border border-[--border]" />
        ) : (
          <video key={i} src={a.url} controls className="w-full rounded-xl border border-[--border]" />
        )
      )}
      <p className="text-[11px] text-[--muted]">
        Generated with {assets.map((a) => a.provider).join(" · ")}
      </p>
    </div>
  );
}

type View =
  | { name: "library" }
  | { name: "new" }
  | { name: "account" }
  | { name: "settings" }
  | { name: "stats" }
  | { name: "view"; id: string };

type DisplayMode = "grid" | "table";

interface Filters {
  search: string;
  audience?: AudienceKey;
  plotKey?: PlotKey;
  tone?: string;
  status?: StoryStatus;
  sort: "newest" | "oldest" | "az";
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  sort: "newest",
};

export default function Dashboard() {
  const [library, setLibrary] = useState<SavedStory[]>([]);
  const [authed, setAuthed] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [view, setView] = useState<View>({ name: "library" });
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [mode, setMode] = useState<DisplayMode>("grid");
  const [mobileNav, setMobileNav] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const a = await isAuthed();
      setAuthed(a);
      setLibrary(await loadStories(a));
      if (a) {
        try {
          const me = await fetch("/api/me").then((r) => r.json());
          setCredits(me.credits ?? null);
        } catch {
          setCredits(null);
        }
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const byAudience: Record<string, number> = {};
    AUDIENCES.forEach((a) => (byAudience[a.key] = 0));
    library.forEach((s) => {
      byAudience[s.audience] = (byAudience[s.audience] ?? 0) + 1;
    });
    return {
      total: library.length,
      published: library.filter((s) => s.status === "published").length,
      drafts: library.filter((s) => s.status !== "published").length,
      byAudience,
    };
  }, [library]);

  const shown = useMemo(() => {
    let list = [...library];
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.story.title.toLowerCase().includes(q) ||
          s.story.hook.toLowerCase().includes(q) ||
          s.facts.toLowerCase().includes(q)
      );
    }
    if (filters.audience) list = list.filter((s) => s.audience === filters.audience);
    if (filters.plotKey) list = list.filter((s) => s.plotKey === filters.plotKey);
    if (filters.tone) list = list.filter((s) => (s.tone ?? "professional") === filters.tone);
    if (filters.status) list = list.filter((s) => (s.status ?? "draft") === filters.status);

    switch (filters.sort) {
      case "oldest":
        list.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        break;
      case "az":
        list.sort((a, b) => a.story.title.localeCompare(b.story.title));
        break;
      default:
        list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return list;
  }, [library, filters]);

  const activeStory =
    view.name === "view" ? library.find((s) => s.id === view.id) : undefined;

  return (
    <div className="flex min-h-screen bg-[--bg]">
      {/* Sidebar */}
      <aside className={`${mobileNav ? "flex" : "hidden"} md:flex flex-col fixed md:static inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-[--border] bg-[--bg] md:bg-[--panel]/40 md:backdrop-blur-xl px-5 pt-5 pb-6 overflow-y-auto`}>
        <button
          onClick={() => setView({ name: "library" })}
          className="flex items-center gap-2.5 mb-6 text-left"
        >
          <img src="/logo-icon.svg" alt="7stories" className="w-9 h-9" />
          <span className="text-lg font-bold tracking-tight">7stories</span>
        </button>

        <button
          onClick={() => setView({ name: "new" })}
          className="btn btn-primary w-full justify-center mb-7"
        >
          ✨ New story
        </button>

        <nav className="flex-1 space-y-6 overflow-y-auto" onClick={() => setMobileNav(false)}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[--muted] px-3 mb-2">Library</p>
            <button
              onClick={() => { setFilters((f) => ({ ...f, status: undefined })); setView({ name: "library" }); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                view.name === "library" && !filters.status
                  ? "bg-white/10 text-[--ink]" : "text-[--muted] hover:bg-white/5"
              }`}
            >
              <span className="opacity-80">▦</span> All stories
            </button>
            <button
              onClick={() => { setFilters((f) => ({ ...f, status: "published" })); setView({ name: "library" }); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                filters.status === "published" ? "bg-white/10 text-[--ink]" : "text-[--muted] hover:bg-white/5"
              }`}
            >
              <span className="opacity-80">✓</span> Published
            </button>
            <button
              onClick={() => { setFilters((f) => ({ ...f, status: "draft" })); setView({ name: "library" }); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                filters.status === "draft" ? "bg-white/10 text-[--ink]" : "text-[--muted] hover:bg-white/5"
              }`}
            >
              <span className="opacity-80">✎</span> Drafts
            </button>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[--muted] px-3 mb-2">Audiences</p>
            {AUDIENCES.map((a) => (
              <button
                key={a.key}
                onClick={() => { setFilters((f) => ({ ...f, audience: a.key })); setView({ name: "library" }); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  filters.audience === a.key ? "bg-white/10 text-[--ink]" : "text-[--muted] hover:bg-white/5"
                }`}
              >
                <span>{a.emoji}</span> {a.label}
                <span className="ml-auto text-xs text-[--muted]/60">{stats.byAudience[a.key] ?? 0}</span>
              </button>
            ))}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[--muted] px-3 mb-2">Account</p>
            <button
              onClick={() => setView({ name: "account" })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                view.name === "account" ? "bg-white/10 text-[--ink]" : "text-[--muted] hover:bg-white/5"
              }`}
            >
              🔐 Account & Files
            </button>
            <button
              onClick={() => setView({ name: "settings" })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                view.name === "settings" ? "bg-white/10 text-[--ink]" : "text-[--muted] hover:bg-white/5"
              }`}
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => setView({ name: "stats" })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                view.name === "stats" ? "bg-white/10 text-[--ink]" : "text-[--muted] hover:bg-white/5"
              }`}
            >
              📊 Stats
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileNav && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileNav(false)} aria-hidden />
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-10 py-4 border-b border-[--border] bg-[--bg]/80 backdrop-blur-xl">
          <button onClick={() => setMobileNav((v) => !v)} className="md:hidden w-9 h-9 grid place-items-center rounded-lg border border-[--border] text-lg" aria-label="Menu">☰</button>
          <div className="text-sm font-semibold text-[--ink]">
            {view.name === "library" ? "Your library" : view.name === "new" ? "Create" : view.name === "account" ? "Account & Files" : view.name === "settings" ? "Settings" : view.name === "stats" ? "Analytics" : "Story"}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <a href="/credits" className="chip hover:border-[--accent]/50 hover:text-[--ink]" title="Your credit balance — click to buy more">
              ⚡ {credits ?? "—"} credits
            </a>
            <a href="/credits" className="btn btn-primary text-xs px-3 py-1.5">Buy credits</a>
            <button
              onClick={() => setView({ name: "account" })}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[--accent] to-[--accent-2] grid place-items-center text-xs font-bold text-white"
              title="Account"
            >
              👤
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10">
        {view.name === "new" && (
          <CreateStory
            onSaved={async (s) => {
              setLibrary(await saveStory(authed, s));
              setView({ name: "view", id: s.id });
              toast("Saved to your library!");
            }}
          />
        )}

        {view.name === "account" && <AccountPanel />}

        {view.name === "settings" && <SettingsPanel />}
        {view.name === "stats" && <StatsPanel />}

        {view.name === "view" && activeStory && (
          <StoryViewer
            story={activeStory}
            onBack={() => setView({ name: "library" })}
            onStatus={async (id, status) => setLibrary(await updateStory(authed, id, { status }))}
            onDelete={async (id) => {
              if (!confirm("Delete this story? This can't be undone.")) return;
              setLibrary(await deleteStory(authed, id));
              setView({ name: "library" });
              toast("Story deleted.", "info");
            }}
          />
        )}

        {view.name === "library" && (
          <Library
            stories={shown}
            filters={filters}
            stats={stats}
            mode={mode}
            onFilters={setFilters}
            onMode={setMode}
            onOpen={(id) => setView({ name: "view", id })}
            onNew={() => setView({ name: "new" })}
          />
        )}
        </div>
      </main>
    </div>
  );
}

/* ───────────── KPI + Library ───────────── */

function Library({
  stories,
  filters,
  stats,
  mode,
  onFilters,
  onMode,
  onOpen,
  onNew,
}: {
  stories: SavedStory[];
  filters: Filters;
  stats: { total: number; published: number; drafts: number; byAudience: Record<string, number> };
  mode: DisplayMode;
  onFilters: (f: Filters) => void;
  onMode: (m: DisplayMode) => void;
  onOpen: (id: string) => void;
  onNew: () => void;
}) {
  const activeFilters =
    filters.audience || filters.plotKey || filters.tone || filters.status || filters.search;

  return (
    <div className="max-w-6xl">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Kpi label="Total stories" value={stats.total} />
        <Kpi label="Published" value={stats.published} />
        <Kpi label="Drafts" value={stats.drafts} />
        <Kpi label="Active arcs" value={new Set(stories.map((s) => s.plotKey)).size} />
      </div>

      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Story library
          </h1>
          <p className="text-[--muted] mt-1">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
            {activeFilters ? " · filtered" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onMode("grid")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              mode === "grid" ? "border-[--accent] bg-[--accent]/10" : "border-[--border]"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => onMode("table")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              mode === "table" ? "border-[--accent] bg-[--accent]/10" : "border-[--border]"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar filters={filters} onChange={onFilters} />

      {stories.length === 0 ? (
        <EmptyState hasFilter={!!activeFilters} onNew={onNew} onClear={() => onFilters(DEFAULT_FILTERS)} />
      ) : mode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((s) => (
            <StoryCard key={s.id} s={s} onOpen={() => onOpen(s.id)} />
          ))}
        </div>
      ) : (
        <StoryTable stories={stories} onOpen={onOpen} />
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-widest text-[--muted]">{label}</p>
      <p className="text-3xl font-black mt-2 text-[--ink]">{value}</p>
    </div>
  );
}

function FilterBar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const clear = () => onChange(DEFAULT_FILTERS);
  const active =
    filters.audience || filters.plotKey || filters.tone || filters.status || filters.search;

  return (
    <div className="card p-4 mb-6 space-y-3">
      {/* Search (own row so dropdowns stay aligned) */}
      <input
        value={filters.search}
        onChange={(e) => set({ search: e.target.value })}
        placeholder="🔍 Search stories…"
        className="w-full px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap items-center gap-2">
        {/* Audience */}
        <Select
          value={filters.audience ?? ""}
          onChange={(v) => set({ audience: v ? (v as AudienceKey) : undefined })}
          placeholder="All audiences"
          options={AUDIENCES.map((a) => ({ value: a.key, label: `${a.emoji} ${a.label}` }))}
        />

        {/* Arc */}
        <Select
          value={filters.plotKey ?? ""}
          onChange={(v) => set({ plotKey: v ? (v as PlotKey) : undefined })}
          placeholder="All arcs"
          options={PLOTS.map((p) => ({ value: p.key, label: p.title }))}
        />

        {/* Tone */}
        <Select
          value={filters.tone ?? ""}
          onChange={(v) => set({ tone: v || undefined })}
          placeholder="All tones"
          options={TONES.map((t) => ({ value: t.key, label: t.label }))}
        />

        {/* Status */}
        <Select
          value={filters.status ?? ""}
          onChange={(v) => set({ status: v ? (v as StoryStatus) : undefined })}
          placeholder="All statuses"
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
          ]}
        />

        {/* Sort */}
        <Select
          value={filters.sort}
          onChange={(v) => set({ sort: v as Filters["sort"] })}
          options={[
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "az", label: "A–Z" },
          ]}
        />

        {active && (
          <button onClick={clear} className="text-sm text-[--accent] hover:underline">
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[--panel-2] border border-[--border] text-sm px-3 py-2 rounded-lg cursor-pointer outline-none focus:border-[--accent]"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function StoryCard({ s, onOpen }: { s: SavedStory; onOpen: () => void }) {
  const a = AUDIENCES.find((x) => x.key === s.audience);
  const p = PLOTS.find((x) => x.key === s.plotKey);
  const published = s.status === "published";
  return (
    <button
      onClick={onOpen}
      className="card p-6 text-left hover:border-[--accent]/60 transition-colors group flex flex-col"
    >
      {s.story.assets && s.story.assets.length > 0 && (
        <div className="relative mb-3">
          {s.story.assets.some((a) => a.kind === "image") && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.story.assets.find((a) => a.kind === "image")!.url}
              alt={s.story.title}
              className="w-full h-36 object-cover rounded-lg border border-[--border]"
            />
          )}
          {s.story.assets.some((a) => a.kind === "video") && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white">
              🎬 Video
            </span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-[--muted] mb-3">
        <span>{a?.emoji}</span>
        <span className="uppercase tracking-wider">{a?.label}</span>
        <span
          className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            published ? "bg-emerald-500/15 text-emerald-400" : "bg-[--panel-2] text-[--muted]"
          }`}
        >
          {published ? "Published" : "Draft"}
        </span>
      </div>
      <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-[--accent] transition-colors">
        {s.story.title}
      </h3>
      <p className="text-sm text-[--muted] line-clamp-2 mb-4">{s.story.hook}</p>
      <div className="mt-auto flex items-center gap-2">
        <span className="chip">{p?.emoji} {p?.title}</span>
        {s.tone && s.tone !== "professional" && (
          <span className="chip">{s.tone}</span>
        )}
        <span className="text-xs text-[--muted] ml-auto">
          {new Date(s.createdAt).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}

/* ───────────── Table view ───────────── */

function StoryTable({
  stories,
  onOpen,
}: {
  stories: SavedStory[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[--border] text-left text-xs uppercase tracking-wider text-[--muted]">
            <th className="px-4 py-3">Story</th>
            <th className="px-4 py-3 hidden sm:table-cell">Media</th>
            <th className="px-4 py-3">Audience</th>
            <th className="px-4 py-3 hidden md:table-cell">Arc</th>
            <th className="px-4 py-3 hidden lg:table-cell">Tone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Created</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((s) => {
            const a = AUDIENCES.find((x) => x.key === s.audience);
            const p = PLOTS.find((x) => x.key === s.plotKey);
            return (
              <tr
                key={s.id}
                onClick={() => onOpen(s.id)}
                className="border-b border-[--border]/50 cursor-pointer hover:bg-white/5"
              >
                <td className="px-4 py-3 font-semibold">{s.story.title}</td>
                <td className="px-4 py-3 text-[--muted] hidden sm:table-cell">
                  {s.story.assets?.length ? (
                    <span className="text-xs">
                      {s.story.assets.some((a) => a.kind === "image") ? "🖼️ " : ""}
                      {s.story.assets.some((a) => a.kind === "video") ? "🎬" : ""}
                    </span>
                  ) : (
                    <span className="text-[--muted]/50">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[--muted]">
                  {a?.emoji} {a?.label}
                </td>
                <td className="px-4 py-3 text-[--muted] hidden md:table-cell">
                  {p?.title}
                </td>
                <td className="px-4 py-3 text-[--muted] hidden lg:table-cell capitalize">
                  {s.tone ?? "professional"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      s.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-[--panel-2] text-[--muted]"
                    }`}
                  >
                    {s.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[--muted] mono">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────── Empty state ───────────── */

function EmptyState({
  hasFilter,
  onNew,
  onClear,
}: {
  hasFilter: boolean;
  onNew: () => void;
  onClear: () => void;
}) {
  return (
    <div className="card p-10 md:p-14 text-center">
      <div className="text-5xl mb-4">📖</div>
      <h2 className="text-xl font-bold mb-2">
        {hasFilter ? "No stories match your filters" : "Welcome to your studio"}
      </h2>
      <p className="text-[--muted] mb-8 max-w-md mx-auto">
        {hasFilter
          ? "Try adjusting or clearing your filters."
          : "Three steps from idea to a cinematic story."}
      </p>

      {!hasFilter && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          {[
            { n: "1", t: "Pick a category", b: "Wedding, brand, product, family — 13 to choose from." },
            { n: "2", t: "Add your story & photos", b: "Paste what happened, upload reference images, choose your models." },
            { n: "3", t: "Generate & share", b: "Get a cinematic story with image or film, saved to your library." },
          ].map((s) => (
            <div key={s.n} className="p-5 rounded-xl border border-[--border] bg-white/[0.02]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[--accent] to-[--accent-2] grid place-items-center text-xs font-bold text-white mx-auto mb-3">{s.n}</div>
              <h3 className="font-semibold text-sm mb-1">{s.t}</h3>
              <p className="text-xs text-[--muted]">{s.b}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 justify-center">
        {hasFilter && (
          <button onClick={onClear} className="btn btn-ghost">
            Clear filters
          </button>
        )}
        <button onClick={onNew} className="btn btn-primary">
          ✨ Create your first story
        </button>
      </div>
    </div>
  );
}

/* ───────────── Story viewer ───────────── */

function StoryViewer({
  story,
  onBack,
  onStatus,
  onDelete,
}: {
  story: SavedStory;
  onBack: () => void;
  onStatus: (id: string, status: StoryStatus) => void;
  onDelete: (id: string) => void;
}) {
  const a = AUDIENCES.find((x) => x.key === story.audience);
  const p = PLOTS.find((x) => x.key === story.plotKey);
  const s = story.story;
  const published = story.status === "published";
  const { toast } = useToast();
  async function share() {
    const text = [s.title, s.hook, ...s.sections.map((x) => `${x.heading}\n${x.body}`), s.cta].join("\n\n");
    try {
      await navigator.clipboard.writeText(`“${s.title}” — ${text}`);
      toast("Story copied — paste it anywhere to share!");
    } catch {
      toast("Couldn't copy automatically.", "error");
    }
  }
  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="text-sm text-[--muted] hover:text-[--ink] mb-6">
        ← Back to library
      </button>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-[--muted]">
          <span className="chip">{a?.emoji} {a?.label}</span>
          <span className="chip">{p?.emoji} {p?.title}</span>
          {story.tone && story.tone !== "professional" && (
            <span className="chip capitalize">{story.tone}</span>
          )}
        </div>
        <button
          onClick={share}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[--border] text-[--muted] hover:text-[--ink] hover:border-[--accent]/50"
        >
          ⤴ Share
        </button>
        <button
          onClick={() => onStatus(story.id, published ? "draft" : "published")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            published
              ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
              : "border-[--accent] text-[--accent] bg-[--accent]/10"
          }`}
        >
          {published ? "✓ Published — set to draft" : "Publish"}
        </button>
      </div>

      <article className="card p-8 md:p-12 space-y-5">
        {s.assets && s.assets.length > 0 && <MediaBlock assets={s.assets} alt={s.title} />}
        <p className="text-[--muted] text-sm italic">{s.hook}</p>
        <h1 className="text-3xl md:text-4xl font-black amber-grad">{s.title}</h1>
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
        <div className="pt-5 border-t border-[--border]">
          <p className="text-sm text-[--muted]">
            <span className="font-semibold text-[--ink]">Next step:</span> {s.cta}
          </p>
        </div>
      </article>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            if (confirm("Delete this story? This can't be undone.")) onDelete(story.id);
          }}
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
  const [tone, setTone] = useState<(typeof TONES)[number]["key"]>("professional");
  const [assetMode, setAssetMode] = useState<AssetMode>("text");
  const [company, setCompany] = useState("");
  const [facts, setFacts] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aud = AUDIENCES.find((a) => a.key === audience)!;

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plotKey, company, facts, audience, tone, assetMode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error === "config_missing"
            ? "Story engine isn't configured yet (OPENAI_API_KEY missing)."
            : data.error === "media_config_missing"
              ? data.message || "Image/video needs FAL_KEY in .env.local."
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
        tone,
        assetMode,
        status: "draft",
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
      <h1 className="text-3xl font-black tracking-tight mb-2">Create a new story</h1>
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
              a.key === audience ? "border-[--accent]/60 ring-1 ring-[--accent]/40" : "hover:border-[--border]"
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
          <span className="text-[--accent] font-semibold">What to tell:</span> {aud.whatToTell}
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
                  p.key === plotKey ? "border-[--accent] bg-[--accent]/25 ring-1 ring-[--accent] text-[--ink]" : "border-[--border] hover:bg-white/5"
                }`}
              >
                <div className="font-semibold leading-tight">{p.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            2 · Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                type="button"
                key={t.key}
                onClick={() => setTone(t.key)}
                className={`px-3 py-1.5 rounded-lg border text-sm capitalize ${
                  t.key === tone ? "border-[--accent] bg-[--accent]/25 ring-1 ring-[--accent] text-[--ink]" : "border-[--border] hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            3 · Title / subject
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={
              audience === "family" ? "e.g. Grandmother Rosa's journey" : "e.g. Northwind Analytics"
            }
            className="w-full px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            4 · Raw material
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

        <AssetModeSelector value={assetMode} onChange={setAssetMode} />

        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
          {loading ? "Writing your story…" : "✨ Generate story"}
        </button>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
        )}
      </form>
    </div>
  );
}
