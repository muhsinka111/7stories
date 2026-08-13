import Link from "next/link";
import type { Metadata } from "next";
import { PLANS, CREDIT_PACKS } from "@/lib/credits";
import BuyButton from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "Credits & pricing — 7stories",
  description: "Buy credits or pick a plan to generate AI stories, images, and films.",
};

export default function CreditsPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-sm text-[--muted] hover:text-[--ink]">← Back to 7stories</Link>
        <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mt-8 mb-3">Pricing</p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">Credits & plans</h1>
        <p className="text-[--muted] max-w-xl mb-12">
          Every generation uses credits. Pick a plan for monthly credits, or buy a pack
          of credits to top up anytime. Each credit covers a text story; images and films
          cost more.
        </p>

        {/* Plans */}
        <h2 className="text-sm uppercase tracking-widest text-[--muted] mb-4">Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {PLANS.map((p) => (
            <div
              key={p.key}
              className={`card p-7 flex flex-col ${p.highlight ? "border-[--accent]/60 shadow-[0_0_0_1px_var(--accent),0_0_30px_rgba(139,124,255,0.25)]" : ""}`}
            >
              {p.highlight && (
                <span className="self-start text-[10px] uppercase tracking-widest mono px-2 py-0.5 rounded-full bg-[--accent]/20 text-[--accent] mb-3">Most popular</span>
              )}
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-sm text-[--muted] mb-4">{p.tagline}</p>
              <div className="text-3xl font-black mb-1">
                ${p.usd}
                <span className="text-sm font-normal text-[--muted]">/month</span>
              </div>
              <p className="text-sm text-[--muted] mb-6">{p.creditsPerMonth.toLocaleString()} credits / mo</p>
              <div className="mt-auto">
                <BuyButton packageKey={`plan_${p.key}`} credits={p.creditsPerMonth} usd={p.usd} variant={p.highlight ? "primary" : "ghost"} />
              </div>
            </div>
          ))}
        </div>

        {/* A-la-carte packs */}
        <h2 className="text-sm uppercase tracking-widest text-[--muted] mb-4">Credit packs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <div key={pack.key} className="card p-7 flex flex-col">
              {pack.per && (
                <span className="self-start text-[10px] uppercase tracking-widest mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 mb-3">{pack.per}</span>
              )}
              <h3 className="text-lg font-bold">{pack.name}</h3>
              <div className="text-3xl font-black mt-1">
                {pack.credits.toLocaleString()}
                <span className="text-sm font-normal text-[--muted]"> credits</span>
              </div>
              <p className="text-sm text-[--muted] mb-6 mt-1">
                ${pack.usd} · {pack.per === "best value" ? `${Math.round(pack.usd / (pack.credits / 100) * 100) / 100}c / credit` : `${Math.round(pack.usd / pack.credits * 100) / 100}c / credit`}
              </p>
              <div className="mt-auto">
                <BuyButton packageKey={pack.key} credits={pack.credits} usd={pack.usd} />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[--muted] mt-10 max-w-xl">
          Payments are being set up. Orders are recorded and will be credited once checkout is live
          (or contact us to top up). Stripe checkout is coming soon.
        </p>
      </div>
    </main>
  );
}
