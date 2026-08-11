import CinematicOpener from "@/components/CinematicOpener";
import FaceGallery from "@/components/FaceGallery";
import PlotExplorer from "@/components/PlotExplorer";
import StoryGenerator from "@/components/StoryGenerator";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Cinematic 3D fly-through */}
      <CinematicOpener />

      {/* Stories turning real — 3D face gallery */}
      <FaceGallery />

      {/* The seven plots — the heart of the product */}
      <section id="plots" className="py-24 px-6 bg-[--bg] border-t border-[--border]">
        <div className="max-w-5xl mx-auto">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mb-3 text-center">
            the seven basic plots
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-center mb-4">
            Every story you love is one of seven
          </h2>
          <p className="text-center text-[--muted] max-w-2xl mx-auto mb-14">
            Booker&apos;s seven archetypes underpin almost every narrative —
            books, films, ads, and the case studies that actually get read.
            Pick an arc, paste your facts, and 7stories builds your brand story
            on the right one.
          </p>

          <StoryGenerator />
        </div>
      </section>

      {/* Explore the arcs */}
      <section className="py-24 px-6 bg-[--panel] border-y border-[--border]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-center mb-3">
            Explore the seven arcs
          </h2>
          <p className="text-center text-[--muted] max-w-xl mx-auto mb-14">
            The framework behind every story — and the structure your brand
            story is built on.
          </p>
          <PlotExplorer />
        </div>
      </section>

      {/* Why it works */}
      <section className="py-24 px-6 bg-[--panel] border-y border-[--border]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🎬",
              title: "The framework is the product",
              body: "Not a generic AI paragraph — a story with real beats, arc, and a payoff that lands.",
            },
            {
              emoji: "🎨",
              title: "On-brand, every time",
              body: "Train it on your voice once. Every story that leaves 7stories sounds like you.",
            },
            {
              emoji: "⚡",
              title: "From facts to story in minutes",
              body: "Paste your case study, product, or quote. Get a narrative you can publish today.",
            },
          ].map((f) => (
            <div key={f.title} className="card p-8">
              <div className="text-3xl mb-4">{f.emoji}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-[--muted]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist CTA */}
      <section
        id="get-started"
        className="py-28 px-6 bg-[--bg] relative overflow-hidden"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">📖</div>
          <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mb-3">
            beta opening soon
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Every brand has a story.
            <br />
            <span className="amber-grad">Tell the right one.</span>
          </h2>
          <p className="text-[--muted] mb-10">
            Join the waitlist for early access to the 7stories storytelling
            workspace.
          </p>
          <WaitlistForm />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/dashboard" className="btn btn-ghost">
              🧭 Open the studio dashboard
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
