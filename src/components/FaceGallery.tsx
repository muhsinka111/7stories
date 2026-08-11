"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * "Stories turning real" — a 3D ring of faces.
 *
 * Seven (and more) portraits orbit in a rotating carousel ring. Scrolling spins
 * the ring in 3D perspective and slowly pushes the whole formation toward the
 * viewer, so faces "turn real" as they come forward. Each face is a customer
 * story waiting to be told.
 */

interface Face {
  img: string;
  name: string;
  role: string;
  story: string;
}

const FACES: Face[] = [
  { img: "/faces/1.png", name: "Amara O.", role: "Founder", story: "Overcame a brutal launch to scale past 10k users." },
  { img: "/faces/2.png", name: "Dmitri V.", role: "Small business owner", story: "Went from barely breaking even to a second location." },
  { img: "/faces/3.png", name: "Keisha B.", role: "Startup founder", story: "Raised her first round after years of chasing it." },
  { img: "/faces/4.png", name: "Arjun P.", role: "Software engineer", story: "Cut deployment time from days to minutes." },
  { img: "/faces/5.png", name: "Elena M.", role: "Restaurant owner", story: "Took her family kitchen from local to regional." },
  { img: "/faces/6.png", name: "Mateo R.", role: "Creative director", story: "Rebuilt his agency after losing its biggest client." },
  { img: "/faces/7.png", name: "Nia W.", role: "Boutique owner", story: "Turned a side hustle into a flagship store." },
];

// Duplicate so the ring fills more evenly around the circle.
const RING: Face[] = [...FACES, ...FACES];
const N = RING.length;

export default function FaceGallery() {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stage = stageRef.current;
      const ring = ringRef.current;
      if (!stage || !ring || !cardsRef.current.length) return;

      // Position cards in a 3D circle facing outward, then tilt up toward camera.
      cardsRef.current.forEach((card, i) => {
        const angle = (i / N) * Math.PI * 2;
        const radius = 460;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const rotY = angle * (180 / Math.PI) + 90;

        gsap.set(card, {
          x,
          z,
          rotationY: rotY,
          transformOrigin: "center center",
        });
      });

      // Scroll spins the ring + pushes the whole formation forward (turning real).
      gsap.to(ring, {
        rotationY: 360,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      gsap.to(ring, {
        z: 420,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      ScrollTrigger.refresh();
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative w-full"
      style={{ height: "220vh", perspective: 1400 }}
    >
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_30%_-10%,#1c2030_0%,#0a0b0f_60%)]" />

        <div className="text-center absolute top-16 inset-x-0 px-6">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[--accent] mb-3">
            stories turning real
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Real people. Real arcs. <span className="amber-grad">Real stories.</span>
          </h2>
        </div>

        <div
          ref={ringRef}
          className="relative h-[360px] w-[360px] md:h-[460px] md:w-[460px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {RING.map((f, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-[--border] shadow-xl hover:border-[--accent] transition-colors group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.img}
                  alt={f.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] md:text-xs font-semibold leading-tight text-white">
                    {f.name} · {f.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 inset-x-0 text-center text-[--muted] text-sm mono tracking-widest animate-bounce">
          scroll to turn them real ↓
        </div>
      </div>
    </div>
  );
}
