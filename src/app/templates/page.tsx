import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Story templates — 13 categories",
  description:
    "Pick a story template: wedding, newborn, baby, family, elders, books, pets, brand, product, events, travel, anniversary, or memorial. Each comes with tailored prompts and cinematic styles.",
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-sm text-[--muted] hover:text-[--ink]">← Back to 7stories</Link>
        <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mt-8 mb-3">Templates</p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Every kind of story</h1>
        <p className="text-[--muted] max-w-2xl mb-12">
          Choose a template, add your details and photos, and 7stories generates a cinematic story —
          as writing, a book, a poem, a letter, or a film with your choice of AI models.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/templates/${c.key}`}
              className="card p-6 hover:border-[--accent]/50 transition-colors group"
            >
              <div className="text-3xl mb-3">{c.emoji}</div>
              <h2 className="text-lg font-bold mb-1 group-hover:text-[--accent] transition-colors">
                {c.label}
              </h2>
              <p className="text-sm text-[--muted]">{c.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
