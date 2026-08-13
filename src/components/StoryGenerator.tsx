"use client";

import { useState } from "react";
import { CATEGORIES, VISUAL_STYLES, FORMATS, categoryToPlot, recommendedStyles } from "@/lib/categories";
import { AssetMode, VIDEO_MODELS } from "@/lib/media";
import { LLM_MODELS } from "@/lib/models";

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

const OUTPUTS: { key: AssetMode; label: string; icon: string; desc: string }[] = [
  { key: "text", label: "Story", icon: "✍️", desc: "Written only" },
  { key: "image", label: "+ Image", icon: "🖼️", desc: "cinematic cover" },
  { key: "video", label: "+ Video", icon: "🎬", desc: "cinematic film" },
  { key: "both", label: "Both", icon: "🎥", desc: "image + video" },
];

export default function StoryGenerator() {
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [style, setStyle] = useState("cinematic");
  const [format, setFormat] = useState("story");
  const [videoModel, setVideoModel] = useState(VIDEO_MODELS[0].key);
  const [llmModel, setLlmModel] = useState(LLM_MODELS[0].key);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceMsg, setEnhanceMsg] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [facts, setFacts] = useState("");
  const [output, setOutput] = useState<AssetMode>("text");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("");
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
        body: JSON.stringify({
          plotKey: categoryToPlot(category),
          category,
          style,
          format,
          videoModel,
          model: llmModel,
          company,
          facts,
          tone: "professional",
          assetMode: output,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "config_missing") {
          setError("Story engine isn't configured yet (OPENAI_API_KEY missing).");
        } else if (data.error === "media_config_missing") {
          setError(data.message || "Image/video needs FAL_KEY.");
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

  async function enhance() {
    if (!facts.trim()) {
      setEnhanceMsg("Write a short idea in the box, then enhance it.");
      return;
    }
    setEnhancing(true);
    setEnhanceMsg(null);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: facts, category, style, format, model: llmModel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEnhanceMsg(data.error === "config_missing" ? "Enhancer needs OPENAI_API_KEY." : data.error || "Enhance failed.");
        return;
      }
      setFacts(data.prompt);
      setEnhanceMsg("✨ Enhanced — review and tweak, then generate.");
    } catch {
      setEnhanceMsg("Enhance failed. Try again.");
    } finally {
      setEnhancing(false);
    }
  }

  const cat = CATEGORIES.find((c) => c.key === category)!;
  const styleOptions = recommendedStyles(category).map((s) => VISUAL_STYLES.find((v) => v.key === s)!);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <form onSubmit={generate} className="card p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            1 · What kind of story?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.key}
                onClick={() => {
                  setCategory(c.key);
                  setStyle(recommendedStyles(c.key)[0]);
                }}
                title={c.description}
                className={`px-3 py-2.5 rounded-lg border text-left transition-all ${
                  c.key === category
                    ? "border-[--accent]/60 bg-[--accent]/10"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                <div className="text-lg mb-1">{c.emoji}</div>
                <div className="font-semibold text-sm truncate">{c.label}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-[--muted] mt-2">{cat.tagline}</p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            2 · Visual style
          </label>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map((s) => (
              <button
                type="button"
                key={s.key}
                onClick={() => setStyle(s.key)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                  s.key === style
                    ? "border-[--accent]/60 bg-[--accent]/10"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[--muted] mt-1">
            Recommended for {cat.label} — changes with your category.
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            3 · Format
          </label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                type="button"
                key={f.key}
                onClick={() => setFormat(f.key)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                  f.key === format
                    ? "border-[--accent]/60 bg-[--accent]/10"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            4 · Subject / title
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Grandma Rosa's journey"
            className="w-full px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            5 · What happened?
          </label>
          <textarea
            required
            rows={6}
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            placeholder={cat.starterPrompt}
            className="w-full px-4 py-3 resize-none"
          />
          <div className="flex items-center justify-between gap-3 mt-2">
            <p className="text-[11px] text-[--muted]">
              Optional: type a rough idea, then let the AI expand it into a full prompt.
            </p>
            <button
              type="button"
              onClick={enhance}
              disabled={enhancing}
              className="btn btn-ghost text-sm px-4 py-2 shrink-0 disabled:opacity-60"
            >
              {enhancing ? "Enhancing…" : "✨ Enhance prompt"}
            </button>
          </div>
          {enhanceMsg && <p className="mt-2 text-xs text-[--accent]">{enhanceMsg}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            6 · Output
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {OUTPUTS.map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setOutput(m.key)}
                className={`px-3 py-3 rounded-lg border text-center transition-all ${
                  m.key === output
                    ? "border-[--accent]/60 bg-[--accent]/10"
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

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            7 · Video engine
          </label>
          <div className="flex flex-wrap gap-2">
            {VIDEO_MODELS.map((v) => (
              <button
                type="button"
                key={v.key}
                onClick={() => setVideoModel(v.key)}
                title={v.hint}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                  v.key === videoModel
                    ? "border-[--accent]/60 bg-[--accent]/10"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                {v.label} <span className="text-[10px] text-[--muted]">· {v.vendor}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[--muted] mt-1">
            Used when output includes video. Veo 3 is the most cinematic.
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            8 · Language model
          </label>
          <div className="flex flex-wrap gap-2">
            {LLM_MODELS.map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setLlmModel(m.key)}
                title={m.hint}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                  m.key === llmModel
                    ? "border-[--accent]/60 bg-[--accent]/10"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                {m.label} <span className="text-[10px] text-[--muted]">· {m.vendor}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[--muted] mt-1">
            Powers the writing. GPT-4.1 gives the best prose.
          </p>
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
              Your {cat.label.toLowerCase()} story will appear here — cinematic, on-brand, and built to
              move people.
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
                    <img key={i} src={a.url} alt={story.title} className="w-full rounded-xl object-cover border border-[--border]" />
                  ) : (
                    <video key={i} src={a.url} controls className="w-full rounded-xl border border-[--border]" />
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
                <span className="font-semibold text-[--ink]">Next step:</span> {story.cta}
              </p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
