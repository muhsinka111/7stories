import { StoryGenerator, Gallery, Hero3D } from "@/components/Lazy";
import { CATEGORIES } from "@/lib/categories";
import gallery from "../../public/data/gallery.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI cinematic storytelling studio — turn any moment into a story",
  description:
    "Turn a wedding, brand, product, or life moment into a cinematic story with an AI-generated cover image or film. 13 story categories, 25+ AI video models, prompt enhancement, and photo references — all in one studio.",
  openGraph: {
    title: "7stories — AI cinematic storytelling studio",
    description:
      "Pick a category, add photos, choose your AI models, and get a cinematic story with image or film.",
    url: "https://www.7stories.com/",
  },
};

const RING_CARDS = (gallery as any[]).slice(0, 12).map((g) => ({
  label: g.label,
  emoji: ({ wedding: "🥂", newborn: "👶", baby: "🧸", family: "👨‍👩‍👧", travel: "✈️", brand: "🚀", elders: "👴", anniversary: "💍", product: "📦", memorial: "🕯️", pet: "🐾" } as any)[g.cat] || "✨",
  img: g.image,
}));

export default function Home() {
  return (
    <main className="flex-1">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[--border] bg-[--bg]/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
          <a href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[--accent] to-[--accent-2] grid place-items-center font-black text-white">7</span>
            <span className="font-bold tracking-tight">7stories</span>
          </a>
          <nav className="flex items-center gap-3">
            <a href="#examples" className="text-sm text-[--muted] hover:text-[--ink] hidden sm:block">Examples</a>
            <a href="/templates" className="text-sm text-[--muted] hover:text-[--ink] hidden sm:block">Templates</a>
            <a href="#make" className="text-sm text-[--muted] hover:text-[--ink] hidden sm:block">Studio</a>
            <a href="/tutorials" className="text-sm text-[--muted] hover:text-[--ink] hidden sm:block">Tutorials</a>
            <a href="/docs" className="text-sm text-[--muted] hover:text-[--ink] hidden sm:block">Docs</a>
            <a href="/dashboard" className="btn btn-ghost text-sm">Dashboard</a>
            <a href="/login" className="btn btn-primary text-sm">Sign in</a>
          </nav>
        </div>
      </header>

      {/* Hero — clean, high-contrast */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_70%_-10%,#1c2030_0%,var(--bg)_55%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mb-5">
            the cinematic storytelling studio
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6 text-[--ink]">
            Tell the stories
            <br />
            that <span className="amber-grad">move people.</span>
          </h1>
          <p className="text-lg text-[--muted] max-w-2xl mx-auto mb-10">
            Turn a wedding, a newborn, a life, or a brand into a beautiful
            written story — with a cinematic image or film to match. Pick a
            category, share what happened, and 7stories crafts it.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <a href="#make" className="btn btn-primary text-base">
              ✨ Create your story
            </a>
            <a href="#examples" className="btn btn-ghost text-base">
              See what you can make
            </a>
          </div>
          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {CATEGORIES.slice(0, 10).map((c) => (
              <span key={c.key} className="chip text-sm">
                {c.emoji} {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* 3D rotating ring of cinematic creations */}
        <Hero3D cards={RING_CARDS} />
      </section>

      {/* Categories */}
      <section className="py-24 px-6 bg-[--panel] border-y border-[--border]">
        <div className="max-w-6xl mx-auto">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mb-3 text-center">
            for every chapter of life
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-center mb-12">
            One studio, every kind of story
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((c) => (
              <a key={c.key} href="#make" className="card p-6 hover:border-[--accent]/50 transition-colors">
                <div className="text-3xl mb-3">{c.emoji}</div>
                <h3 className="font-bold mb-1">{c.label}</h3>
                <p className="text-xs text-[--muted]">{c.tagline}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <Gallery />

      {/* Make a story */}
      <section id="make" className="py-24 px-6 bg-[--bg] border-t border-[--border]">
        <div className="max-w-5xl mx-auto">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mb-3 text-center">
            the studio
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-center mb-3">
            Make your story now
          </h2>
          <p className="text-center text-[--muted] max-w-xl mx-auto mb-12">
            Pick a category and style, paste what happened, choose an output —
            get a story with a cinematic image or film.
          </p>
          <StoryGenerator />
        </div>
      </section>

      {/* Why it works */}
      <section className="py-24 px-6 bg-[--panel] border-t border-[--border]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { emoji: "🎬", title: "Cinematic by default", body: "A real story with beats and payoff, paired with a film-quality image or video." },
            { emoji: "🎨", title: "Your style, your tone", body: "Cinematic, photoreal, anime, vintage — the mood you want, every time." },
            { emoji: "💾", title: "Kept in your library", body: "Every generation saved to your dashboard, ready to share or download." },
          ].map((f) => (
            <div key={f.title} className="card p-8">
              <div className="text-3xl mb-4">{f.emoji}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-[--muted]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="py-28 px-6 bg-[--bg] border-t border-[--border] text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">📖</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-[--ink]">
            Every life has a story.
            <br />
            <span className="amber-grad">Tell it beautifully.</span>
          </h2>
          <p className="text-[--muted] mb-10">
            Start free — sign in and create your first cinematic story in minutes.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/login" className="btn btn-primary">✨ Start creating free</a>
            <a href="/dashboard" className="btn btn-ghost">Go to dashboard</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[--border] px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[--accent] to-[--accent-2] grid place-items-center font-black text-white">7</span>
            <span className="font-bold tracking-tight">7stories</span>
          </a>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[--muted]">
            <a href="/templates" className="hover:text-[--ink]">Templates</a>
            <a href="/tutorials" className="hover:text-[--ink]">Tutorials</a>
            <a href="/docs" className="hover:text-[--ink]">Docs</a>
            <a href="/credits" className="hover:text-[--ink]">Credits</a>
            <a href="/faq" className="hover:text-[--ink]">FAQ</a>
            <a href="/terms" className="hover:text-[--ink]">Terms</a>
            <a href="/privacy" className="hover:text-[--ink]">Privacy</a>
            <a href="/login" className="hover:text-[--ink]">Sign in</a>
          </nav>
        </div>
        <p className="max-w-6xl mx-auto mt-6 text-xs text-[--muted]/60">
          © {new Date().getFullYear()} 7stories. Cinematic AI storytelling.
        </p>
      </footer>
    </main>
  );
}
