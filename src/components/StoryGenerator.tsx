"use client";

import { useState } from "react";
import { PLOTS } from "@/lib/plots";
import { AssetMode } from "@/lib/media";

interface StorySection {
  heading: string;
  body: string;
}
interface MediaAsset {
  kind: "image" | "video";
  url: string;
  provider: string;
}
interface GeneratedStory {
  title: string;
  hook: string;
  sections: StorySection[];
  pullQuote?: string;
  cta: string;
  assets?: MediaAsset[];
}

const ASSET_MODES: { key: AssetMode; label: string; icon: string; desc: string }[] = [
  { key: "text", label: "Text", icon: "✍️", desc: "Story only" },
  { key: "image", label: "Image", icon: "🖼️", desc: "+ cover image" },
  { key: "video", label: "Video", icon: "🎬", desc: "+ story video" },
  { key: "both", label: "Both", icon: "🎥", desc: "image + video" },
];

export default function StoryGenerator() {
  const [plotKey, setPlotKey] = useState(PLOTS[0].key);
  const [company, setCompany] = useState("");
  const [facts, setFacts] = useState("");
  const [assetMode, setAssetMode] = useState<AssetMode>("text");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<string>("");
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStory(null);
    setPhase("Writing your story…");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plotKey, company, facts, tone: "professional", assetMode }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "config_missing") {
          setError(
            "Story engine isn't configured yet. Add OPENAI_API_KEY (text) and FAL_KEY (image/video) to .env.local."
          );
        } else if (data.error === "media_config_missing") {
          setError(data.message || "Image/video needs FAL_KEY in .env.local.");
        } else {
          setError(data.message || "Generation failed.");
        }
        return;
      }
      setStory(data.story);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      setPhase("");
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <form onSubmit={generate} className="card p-6 md:p-8 space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            1 · Choose your story arc
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PLOTS.map((p) => (
              <button
                type="button"
                key={p.key}
                onClick={() => setPlotKey(p.key)}
                className={`px-3 py-2.5 rounded-lg border text-left text-sm transition-all ${
                  p.key === plotKey
                    ? "border-amber-400/60 bg-amber-400/10"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                <div className="font-semibold truncate">
                  {p.emoji} {p.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            2 · Brand / company
          </label>
          <input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Northwind Analytics"
            className="w-full px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            3 · Paste your raw material
          </label>
          <textarea
            id="facts"
            required
            rows={6}
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            placeholder="Customer challenge, solution, results, metrics, quotes…"
            className="w-full px-4 py-3 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            4 · Output type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ASSET_MODES.map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setAssetMode(m.key)}
                className={`px-3 py-3 rounded-lg border text-center transition-all ${
                  m.key === assetMode
                    ? "border-amber-400/60 bg-amber-400/10"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                <div className="text-xl mb-1">{m.icon}</div>
                <div className="font-semibold text-sm">{m.label}</div>
                <div className="text-[11px] text-[--muted]">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? phase || "Working…" : "✨ Generate my story"}
        </button>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}
      </form>

      {/* Output */}
      <div className="card p-6 md:p-8 min-h-[400px]">
        {!story && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center text-[--muted]">
            <div className="text-4xl mb-4">🪄</div>
            <p className="max-w-xs">
              Your story will appear here — built on the{" "}
              <span className="text-[--accent] font-semibold">
                {PLOTS.find((p) => p.key === plotKey)?.title}
              </span>{" "}
              arc.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4 animate-pulse">✍️</div>
            <p className="text-[--muted]">{phase || "Structuring your narrative…"}</p>
          </div>
        )}

        {story && (
          <article className="space-y-5">
            {story.assets && story.assets.length > 0 && (
              <div className="space-y-3">
                {story.assets.map((a, i) =>
                  a.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={a.url}
                      alt={story.title}
                      className="w-full rounded-xl object-cover border border-[--border]"
                    />
                  ) : (
                    <video
                      key={i}
                      src={a.url}
                      controls
                      className="w-full rounded-xl border border-[--border]"
                    />
                  )
                )}
                {story.assets.length > 0 && (
                  <p className="text-[11px] text-[--muted]">
                    Generated with {story.assets.map((a) => a.provider).join(" · ")}
                  </p>
                )}
              </div>
            )}

            <p className="text-[--muted] text-sm italic">{story.hook}</p>
            <h3 className="text-2xl font-black amber-grad">{story.title}</h3>
            {story.sections.map((s, i) => (
              <section key={i}>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[--accent] mb-1">
                  {s.heading}
                </h4>
                <p className="text-[--ink]/85 leading-relaxed">{s.body}</p>
              </section>
            ))}
            {story.pullQuote && (
              <blockquote className="border-l-2 border-[--accent] pl-4 italic text-[--ink]/90">
                “{story.pullQuote}”
              </blockquote>
            )}
            <div className="pt-4 border-t border-[--border]">
              <p className="text-sm text-[--muted]">
                <span className="font-semibold text-[--ink]">Next step:</span>{" "}
                {story.cta}
              </p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
