import StoryGenerator from "@/components/StoryGenerator";
import WaitlistForm from "@/components/WaitlistForm";
import Gallery from "@/components/Gallery";
import { CATEGORIES } from "@/lib/categories";

export default function Home() {
  return (
    <main className="flex-1">
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
            Join the waitlist for early access to the 7stories studio.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </main>
  );
}
