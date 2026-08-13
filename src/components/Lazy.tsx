"use client";

import dynamic from "next/dynamic";

// Client-only dynamic imports (ssr:false is only allowed in Client Components).
// This keeps GSAP/hero and the heavy gallery/studio out of the initial server bundle.
export const StoryGenerator = dynamic(() => import("./StoryGenerator"), {
  ssr: false,
  loading: () => (
    <div className="card p-8 space-y-4">
      <div className="skeleton h-6 w-40" />
      <div className="skeleton h-10 w-full" />
      <div className="skeleton h-24 w-full" />
      <div className="skeleton h-10 w-full" />
    </div>
  ),
});

export const Gallery = dynamic(() => import("./Gallery"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card aspect-[4/3] skeleton" />
      ))}
    </div>
  ),
});

export const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });
