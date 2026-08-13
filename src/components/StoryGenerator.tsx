"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, VISUAL_STYLES, FORMATS, categoryToPlot, recommendedStyles } from "@/lib/categories";
import { AssetMode, VIDEO_MODELS, IMAGE_MODELS } from "@/lib/media";
import { LLM_MODELS } from "@/lib/models";
import { useToast } from "@/components/Toast";
import { isAuthed } from "@/lib/storiesClient";

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
  const [imageModel, setImageModel] = useState(IMAGE_MODELS[0].key);
  const [llmModel, setLlmModel] = useState(LLM_MODELS[0].key);
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("English");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("1080p");
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceMsg, setEnhanceMsg] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [facts, setFacts] = useState("");
  const [refImages, setRefImages] = useState<string[]>([]);
  const [refUrl, setRefUrl] = useState("");
  const [output, setOutput] = useState<AssetMode>("text");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("");
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GeneratedStory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const lastRef = useRef<any>(null);

  async function submit(body: any) {
    const authed = await isAuthed();
    if (!authed) {
      toast("Please sign in to generate stories.", "info");
      router.push("/login");
      return false;
    }
    setLoading(true);
    setError(null);
    setStory(null);
    setEditing(false);
    setPhase("Writing your story…");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "unauthorized") {
          toast("Please sign in to generate stories.", "info");
          router.push("/login");
        } else if (data.error === "insufficient_credits") {
          setError(data.message || "Not enough credits.");
          toast(data.message || "Not enough credits.", "error");
        } else if (data.error === "config_missing") {
          setError("Story engine isn't configured yet (OPENAI_API_KEY missing).");
          toast("Story engine isn't configured yet.", "error");
        } else if (data.error === "media_config_missing") {
          setError(data.message || "Image/video needs FAL_KEY.");
          toast(data.message || "Image/video needs FAL_KEY.", "error");
        } else {
          setError(data.message || "Generation failed.");
          toast(data.message || "Generation failed.", "error");
        }
        return false;
      }
      setStory(data.story);
      toast(data.cost ? `Your story is ready! (used ${data.cost} credits)` : "Your story is ready!");
      return true;
    } catch (err) {
      const m = err instanceof Error ? err.message : "Something went wrong.";
      setError(m);
      toast(m, "error");
      return false;
    } finally {
      setLoading(false);
      setPhase("");
    }
  }

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      plotKey: categoryToPlot(category),
      category,
      style,
      format,
      videoModel,
      imageModel,
      model: llmModel,
      company,
      facts,
      referenceImages: refImages,
      tone,
      language,
      aspectRatio,
      resolution,
      assetMode: output,
    };
    lastRef.current = body;
    await submit(body);
  }

  // Re-run the same story with a new random seed → a fresh variation.
  async function regenerate() {
    if (!lastRef.current) return;
    await submit({ ...lastRef.current, seed: Math.floor(Math.random() * 1e6) });
  }

  // Re-run with a new seed AND the current model/style/aspect/resolution choices
  // (change the style or engine in the form first, then Redesign for a new look).
  async function redesign() {
    if (!lastRef.current) return;
    await submit({
      ...lastRef.current,
      style,
      imageModel,
      videoModel,
      aspectRatio,
      resolution,
      seed: Math.floor(Math.random() * 1e6),
    });
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

  function addRefFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.slice(0, 6).forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setRefImages((p) => [...p, reader.result as string]);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  }
  function addRefUrl() {
    const u = refUrl.trim();
    if (u && /^https?:\/\//.test(u)) setRefImages((p) => [...p, u]);
    setRefUrl("");
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
                className={`relative px-3 py-2.5 rounded-lg border text-left transition-all ${
                  c.key === category
                    ? "border-2 border-[--accent] bg-[--accent]/25 ring-2 ring-[--accent]/60 shadow-[0_0_0_1px_var(--accent),0_0_22px_rgba(139,124,255,0.45)] text-[--ink]"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                {c.key === category && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[--accent] text-white text-xs grid place-items-center font-bold">✓</span>
                )}
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
                    ? "border-2 border-[--accent] bg-[--accent]/25 ring-2 ring-[--accent]/60 shadow-[0_0_0_1px_var(--accent),0_0_22px_rgba(139,124,255,0.45)] text-[--ink]"
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
                    ? "border-2 border-[--accent] bg-[--accent]/25 ring-2 ring-[--accent]/60 shadow-[0_0_0_1px_var(--accent),0_0_22px_rgba(139,124,255,0.45)] text-[--ink]"
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
            6 · Reference images <span className="normal-case text-[--muted]/70">(optional — add photos)</span>
          </label>
          <div className="flex items-center gap-2 mb-3">
            <label className="btn btn-ghost text-sm px-4 py-2 cursor-pointer shrink-0">
              📷 Upload photos
              <input type="file" accept="image/*" multiple onChange={addRefFiles} className="hidden" />
            </label>
            <input
              value={refUrl}
              onChange={(e) => setRefUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRefUrl(); } }}
              placeholder="…or paste an image URL"
              className="flex-1 px-3 py-2 text-sm"
            />
            <button type="button" onClick={addRefUrl} className="btn btn-ghost text-sm px-3 py-2 shrink-0">Add</button>
          </div>
          {refImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {refImages.map((src, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[--border]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`reference ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setRefImages((p) => p.filter((_, j) => j !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black/80 text-white text-xs grid place-items-center"
                  >×</button>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-[--muted] mt-2">
            Used as visual reference for image & video generation.
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            7 · Output
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {OUTPUTS.map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setOutput(m.key)}
                className={`px-3 py-3 rounded-lg border text-center transition-all ${
                  m.key === output
                    ? "border-2 border-[--accent] bg-[--accent]/25 ring-2 ring-[--accent]/60 shadow-[0_0_0_1px_var(--accent),0_0_22px_rgba(139,124,255,0.45)] text-[--ink]"
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
            8 · Image engine
          </label>
          <select
            value={imageModel}
            onChange={(e) => setImageModel(e.target.value)}
            className="w-full px-4 py-3 appearance-none cursor-pointer"
          >
            {IMAGE_MODELS.map((m) => (
              <option key={m.key} value={m.key}>{m.label} — {m.vendor} ({m.hint})</option>
            ))}
          </select>
          <p className="text-[11px] text-[--muted] mt-1">
            Used when output includes an image.
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            9 · Video engine
          </label>
          <select
            value={videoModel}
            onChange={(e) => setVideoModel(e.target.value)}
            className="w-full px-4 py-3 appearance-none cursor-pointer"
          >
            {VIDEO_MODELS.map((v) => (
              <option key={v.key} value={v.key}>{v.label} — {v.vendor} ({v.hint})</option>
            ))}
          </select>
          <p className="text-[11px] text-[--muted] mt-1">
            Used when output includes video. Veo 3 is the most cinematic.
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">
            10 · Language model
          </label>
          <select
            value={llmModel}
            onChange={(e) => setLlmModel(e.target.value)}
            className="w-full px-4 py-3 appearance-none cursor-pointer"
          >
            {LLM_MODELS.map((m) => (
              <option key={m.key} value={m.key}>{m.label} — {m.vendor} ({m.hint})</option>
            ))}
          </select>
          <p className="text-[11px] text-[--muted] mt-1">
            Powers the writing. GPT-4.1 gives the best prose.
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">11 · Tone</label>
          <div className="flex flex-wrap gap-2">
            {[
              { k: "professional", l: "Professional" },
              { k: "warm", l: "Warm" },
              { k: "bold", l: "Bold" },
              { k: "empathetic", l: "Empathetic" },
            ].map((t) => (
              <button
                type="button"
                key={t.k}
                onClick={() => setTone(t.k)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                  t.k === tone
                    ? "border-2 border-[--accent] bg-[--accent]/25 ring-2 ring-[--accent]/60 text-[--ink]"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">12 · Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 appearance-none cursor-pointer">
            {["English", "Turkish", "Spanish", "French", "German", "Arabic", "Italian", "Portuguese"].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <p className="text-[11px] text-[--muted] mt-1">The story is written in this language.</p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[--muted] mb-2">13 · Size & quality</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {["16:9", "1:1", "9:16", "4:3"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`px-3 py-2 rounded-lg border text-center text-sm transition-all ${
                  r === aspectRatio
                    ? "border-2 border-[--accent] bg-[--accent]/25 ring-2 ring-[--accent]/60 text-[--ink]"
                    : "border-[--border] hover:bg-white/5"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full px-4 py-3 appearance-none cursor-pointer">
            {["720p", "1080p", "4K"].map((s) => (
              <option key={s} value={s}>{s === "4K" ? "4K Ultra HD" : s === "1080p" ? "1080p Full HD" : "720p HD"}</option>
            ))}
          </select>
          <p className="text-[11px] text-[--muted] mt-1">Aspect ratio for images; resolution for video.</p>
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
            {/* Edit / Copy / Regenerate / Redesign toolbar */}
            <div className="flex items-center flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={regenerate}
                disabled={loading}
                className="btn btn-ghost text-sm px-3 py-1.5 disabled:opacity-60"
                title="Re-run with a new seed for a fresh variation"
              >🎲 Regenerate</button>
              <button
                type="button"
                onClick={redesign}
                disabled={loading}
                className="btn btn-ghost text-sm px-3 py-1.5 disabled:opacity-60"
                title="Change the style or engine in the form, then apply a new look"
              >🎨 Redesign</button>
              <button
                type="button"
                onClick={() => {
                  const text = [
                    story.title,
                    story.hook,
                    ...story.sections.map((x) => `${x.heading}\n${x.body}`),
                    story.cta,
                  ].join("\n\n");
                  navigator.clipboard?.writeText(text).then(() => toast("Story copied!")).catch(() => toast("Couldn't copy.", "error"));
                }}
                className="btn btn-ghost text-sm px-3 py-1.5"
              >⤴ Copy</button>
              {editing ? (
                <button
                  type="button"
                  onClick={() => { setStory(draft); setEditing(false); toast("Changes saved!"); }}
                  className="btn btn-primary text-sm px-3 py-1.5"
                >✓ Done editing</button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setDraft(JSON.parse(JSON.stringify(story))); setEditing(true); }}
                  className="btn btn-ghost text-sm px-3 py-1.5"
                >✏️ Edit story</button>
              )}
            </div>

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
                <p className="text-[11px] text-[--muted]">
                  Generated with {story.assets.map((a) => a.provider).join(" · ")}
                </p>
              </div>
            )}

            {editing && draft ? (
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-widest text-[--muted]">Title</label>
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full px-3 py-2" />
                <label className="block text-xs uppercase tracking-widest text-[--muted]">Hook</label>
                <textarea rows={2} value={draft.hook} onChange={(e) => setDraft({ ...draft, hook: e.target.value })} className="w-full px-3 py-2" />
                {draft.sections.map((s, i) => (
                  <div key={i} className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-[--muted]">Section {i + 1} — heading</label>
                    <input
                      value={s.heading}
                      onChange={(e) => {
                        const sections = [...draft.sections];
                        sections[i] = { ...sections[i], heading: e.target.value };
                        setDraft({ ...draft, sections });
                      }}
                      className="w-full px-3 py-2"
                    />
                    <label className="block text-xs uppercase tracking-widest text-[--muted]">Body</label>
                    <textarea
                      rows={4}
                      value={s.body}
                      onChange={(e) => {
                        const sections = [...draft.sections];
                        sections[i] = { ...sections[i], body: e.target.value };
                        setDraft({ ...draft, sections });
                      }}
                      className="w-full px-3 py-2"
                    />
                  </div>
                ))}
                <label className="block text-xs uppercase tracking-widest text-[--muted]">CTA</label>
                <input value={draft.cta} onChange={(e) => setDraft({ ...draft, cta: e.target.value })} className="w-full px-3 py-2" />
              </div>
            ) : (
              <>
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
              </>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
