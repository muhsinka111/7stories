// Lightweight presentational helpers for docs & tutorial pages.
// Keeps prose consistent with the dark-SaaS theme.

export function Page({ children }: { children: React.ReactNode }) {
  return <article className="space-y-6">{children}</article>;
}

export function Meta({ kicker, title, lede }: { kicker: string; title: string; lede?: string }) {
  return (
    <header className="pb-4 border-b border-[--border]">
      <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mb-3">{kicker}</p>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{title}</h1>
      {lede && <p className="text-[--muted] max-w-2xl">{lede}</p>}
    </header>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold tracking-tight mt-8 mb-2">{children}</h2>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold tracking-tight mt-6 mb-1">{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[--ink]/85 leading-relaxed">{children}</p>;
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-[--accent] underline underline-offset-2 hover:brightness-125">
      {children}
    </a>
  );
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 space-y-1.5 text-[--ink]/85 leading-relaxed">{children}</ul>;
}

export function Ol({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal pl-5 space-y-2 text-[--ink]/85 leading-relaxed">{children}</ol>;
}

export function Li({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

export function Callout({
  type = "tip",
  title,
  children,
}: {
  type?: "tip" | "info" | "warning";
  title: string;
  children: React.ReactNode;
}) {
  const color = type === "warning" ? "border-amber-400/50 text-amber-200" : type === "info" ? "border-sky-400/40 text-sky-200" : "border-[--accent]/50 text-[--ink]";
  const icon = type === "warning" ? "⚠️" : type === "info" ? "ℹ️" : "💡";
  return (
    <div className={`border-l-2 ${color.split(" ")[0]} bg-white/[0.02] px-4 py-3 rounded-r-lg`}>
      <p className={`text-sm font-semibold ${color.split(" ")[1] ?? "text-[--ink]"} mb-1`}>{icon} {title}</p>
      <div className="text-sm text-[--ink]/80">{children}</div>
    </div>
  );
}

export function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[--accent] to-[--accent-2] grid place-items-center text-white text-sm font-bold">
        {n}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold mb-1">{title}</h3>
        <div className="text-[--ink]/85 leading-relaxed space-y-2">{children}</div>
      </div>
    </div>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

export function DocCard({ href, title, desc, tag }: { href: string; title: string; desc: string; tag?: string }) {
  return (
    <a href={href} className="card p-5 hover:border-[--accent]/50 transition-colors group block">
      {tag && <span className="mono text-[10px] uppercase tracking-widest text-[--accent] mb-2 block">{tag}</span>}
      <h3 className="font-bold mb-1 group-hover:text-[--accent]">{title} →</h3>
      <p className="text-sm text-[--muted]">{desc}</p>
    </a>
  );
}

export function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[--border]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/[0.03] text-left">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold text-[--muted]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-[--border]">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 text-[--ink]/85">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
