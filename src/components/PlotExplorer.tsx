"use client";

import { useState } from "react";
import { PLOTS } from "@/lib/plots";

/**
 * Interactive explorer on the landing page.
 * Lets a visitor click each of the seven plots to see its story structure —
 * demonstrating the core value ("the framework is the product") before they even sign up.
 */
export default function PlotExplorer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const plot = PLOTS[activeIdx];

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      {/* Arc selector */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto">
        {PLOTS.map((p, i) => (
          <button
            key={p.key}
            onClick={() => setActiveIdx(i)}
            className={`text-left shrink-0 px-4 py-3 rounded-xl border transition-all ${
              i === activeIdx
                ? "border-amber-400/60 bg-amber-400/10"
                : "border-[--border] hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{p.emoji}</span>
              <span className="text-sm font-semibold">{p.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div className="card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{plot.emoji}</span>
          <h3 className="text-xl font-bold">{plot.title}</h3>
        </div>
        <p className="text-sm text-[--muted] mb-1 mono">{plot.tagline}</p>
        <p className="mt-3 text-[--ink]/90 leading-relaxed">{plot.oneLiner}</p>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-widest text-[--muted] mb-3">
            The beats
          </p>
          <ol className="space-y-2">
            {plot.beats.map((beat, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mono text-[--accent] text-sm mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-[--ink]/85">{beat}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-[--panel-2] border border-[--border]">
          <p className="text-xs uppercase tracking-widest text-[--muted] mb-1">
            How a brand uses it
          </p>
          <p className="text-sm text-[--ink]/85">{plot.brandUse}</p>
        </div>
      </div>
    </div>
  );
}
