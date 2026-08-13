import Link from "next/link";

const NAV = [
  { href: "/docs", label: "Docs home", exact: true },
  { href: "/docs/getting-started", label: "Getting started" },
  { href: "/docs/studio", label: "The studio" },
  { href: "/docs/models", label: "AI models" },
  { href: "/docs/credits", label: "Credits & pricing" },
  { href: "/docs/account", label: "Account & library" },
  { href: "/docs/faq", label: "FAQ" },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[--border] bg-[--panel]/30 px-4 py-8 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[--accent] to-[--accent-2] grid place-items-center font-black text-white text-sm">7</span>
          <span className="font-bold tracking-tight">7stories Docs</span>
        </Link>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[--muted] px-2 mb-2">Guides</p>
        <nav className="space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block px-3 py-2 rounded-lg text-sm text-[--muted] hover:bg-white/5 hover:text-[--ink]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 px-6 py-10 md:px-12">
        {/* Mobile nav */}
        <div className="md:hidden mb-6 flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="shrink-0 px-3 py-1.5 rounded-full border border-[--border] text-xs text-[--muted] hover:text-[--ink]">
              {n.label}
            </Link>
          ))}
        </div>
        <div className="max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
