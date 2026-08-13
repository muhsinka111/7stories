"use client";

import { useEffect, useState } from "react";

interface Stats {
  total: number;
  mediaCount: number;
  topCategory: string | null;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  last14: { date: string; count: number }[];
  recent: { id: string; title: string; category: string; assetMode: string; createdAt: string }[];
  documents: number;
  credits: number;
}

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => d.ok && setStats(d))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="h-10 w-64 skeleton mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 card skeleton" />)}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-4xl card p-8 mt-10 text-center text-[--muted]">
        Couldn't load your stats. Please try again.
      </div>
    );
  }

  const thisWeek = stats.last14.slice(-7).reduce((a, d) => a + d.count, 0);
  const maxCategory = Math.max(1, ...Object.values(stats.byCategory));
  const maxDay = Math.max(1, ...stats.last14.map((d) => d.count));
  const typeLabels: Record<string, string> = { text: "Text", image: "Image", video: "Video", both: "Both" };

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-black tracking-tight mb-1">Analytics</h2>
      <p className="text-[--muted] mb-8">Your creation activity and usage.</p>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total stories", value: stats.total, icon: "📚" },
          { label: "Images & films", value: stats.mediaCount, icon: "🎬" },
          { label: "This week", value: thisWeek, icon: "🗓️" },
          { label: "Credits left", value: stats.credits, icon: "⚡" },
          { label: "Documents", value: stats.documents, icon: "📄" },
        ].map((k) => (
          <div key={k.label} className="card p-5">
            <div className="text-xl mb-2">{k.icon}</div>
            <div className="text-2xl font-black">{k.value.toLocaleString()}</div>
            <div className="text-[11px] uppercase tracking-wider text-[--muted] mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity last 14 days */}
        <div className="card p-6">
          <h3 className="font-bold mb-4">Activity — last 14 days</h3>
          <div className="flex items-end gap-1 h-32">
            {stats.last14.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group" title={`${d.date}: ${d.count}`}>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[--accent]/60 to-[--accent] transition-all"
                  style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }}
                />
                <span className="text-[9px] text-[--muted]">{d.date.slice(8)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By category */}
        <div className="card p-6">
          <h3 className="font-bold mb-4">Top categories</h3>
          {Object.entries(stats.byCategory).length === 0 ? (
            <p className="text-sm text-[--muted]">No stories yet — create your first one!</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(stats.byCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([cat, n]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-sm w-24 truncate capitalize">{cat}</span>
                    <div className="flex-1 h-3 rounded bg-[--bg] overflow-hidden">
                      <div className="h-full rounded bg-[--accent]" style={{ width: `${(n / maxCategory) * 100}%` }} />
                    </div>
                    <span className="text-xs text-[--muted] w-6 text-right">{n}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* By output type */}
        <div className="card p-6">
          <h3 className="font-bold mb-4">Output types</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(stats.byType).map(([type, n]) => (
              <div key={type} className="rounded-lg border border-[--border] p-4">
                <div className="text-2xl font-black">{n}</div>
                <div className="text-xs text-[--muted] mt-1">{typeLabels[type] ?? type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="card p-6">
          <h3 className="font-bold mb-4">Recent stories</h3>
          {stats.recent.length === 0 ? (
            <p className="text-sm text-[--muted]">Nothing yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recent.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{s.title}</div>
                    <div className="text-[11px] text-[--muted] capitalize">
                      {s.category} · {typeLabels[s.assetMode] ?? s.assetMode}
                    </div>
                  </div>
                  <span className="text-[10px] text-[--muted] shrink-0">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
