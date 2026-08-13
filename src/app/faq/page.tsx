import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ — 7stories" };

const FAQS = [
  { q: "What is 7stories?", a: "7stories turns a moment, brand, product, or life event into a cinematic story. You pick a category, add details and optional photos, choose your AI models, and get a story plus a cinematic image or film." },
  { q: "What can I create?", a: "Stories, books, poems, letters, and story videos. Categories include wedding, newborn, baby, family, elders, books, pets, brand, product, events, travel, anniversary, and memorial." },
  { q: "Can I choose the AI model?", a: "Yes. You pick the language model (GPT-4.1, GPT-4o, o3-mini, GPT-4o mini), the image model (Flux, Nano Banana, Seedream and more), and the video model (Veo 3, Kling, Seedance, Wan, MiniMax and more)." },
  { q: "Can I upload reference photos?", a: "Yes. Add up to 6 photos that 7stories uses as visual reference for image and video generation." },
  { q: "Where are my stories saved?", a: "Signed-in users get a cloud library. Anonymous users can still generate and save locally in the browser." },
  { q: "How long does generation take?", a: "Writing is a few seconds. Images take ~5-10 seconds. Video films take a few minutes depending on the model and queue." },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-[--muted] hover:text-[--ink]">← Back to 7stories</Link>
        <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mt-8 mb-3">FAQ</p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">Frequently asked questions</h1>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="card p-5 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                {f.q}
                <span className="text-[--muted] group-open:rotate-45 transition-transform">＋</span>
              </summary>
              <p className="mt-3 text-sm text-[--muted] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
