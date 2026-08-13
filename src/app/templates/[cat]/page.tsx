import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES, recommendedStyles } from "@/lib/categories";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params;
  const c = CATEGORIES.find((x) => x.key === cat);
  if (!c) return { title: "Template not found" };
  return {
    title: `${c.label} story template — 7stories`,
    description: c.description,
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  const c = CATEGORIES.find((x) => x.key === cat);

  if (!c) {
    return (
      <main className="min-h-screen px-6 py-24 text-center">
        <h1 className="text-2xl font-black">Template not found</h1>
        <Link href="/templates" className="text-sm text-[--accent] mt-4 inline-block">← All templates</Link>
      </main>
    );
  }

  const styles = recommendedStyles(c.key);

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/templates" className="text-sm text-[--muted] hover:text-[--ink]">← All templates</Link>

        <div className="text-5xl mt-8 mb-4">{c.emoji}</div>
        <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mb-3">Story template</p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{c.label} stories</h1>
        <p className="text-lg text-[--muted] mb-6">{c.description}</p>

        <div className="card p-6 mb-6">
          <h2 className="text-sm uppercase tracking-widest text-[--muted] mb-3">Recommended styles</h2>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <span key={s} className="chip capitalize">{s}</span>
            ))}
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="text-sm uppercase tracking-widest text-[--muted] mb-3">Starter prompt</h2>
          <p className="text-[--ink] leading-relaxed">{c.starterPrompt}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="/#make" className="btn btn-primary">✨ Create a {c.label.toLowerCase()} story</a>
          <a href="/dashboard" className="btn btn-ghost">Go to dashboard</a>
        </div>
      </div>
    </main>
  );
}
