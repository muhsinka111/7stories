"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RingCard {
  label: string;
  emoji: string;
  img?: string;
}

/**
 * A scroll-driven 3D ring of cinematic cards. The ring orbits and drifts
 * toward the camera as you scroll (CSS 3D transforms + GSAP — no WebGL).
 * Pure transform/opacity animation = GPU cheap, mobile-safe.
 */
export default function Hero3D({ cards }: { cards: RingCard[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cards = cardRefs.current;
    const ring = ringRef.current;
    if (!cards.length || !ring) return;

    const ctx = gsap.context(() => {
      const N = cards.length;
      const radius = Math.min(360, window.innerWidth < 640 ? 210 : 360);
      cards.forEach((card, i) => {
        const angle = (i / N) * Math.PI * 2;
        gsap.set(card, {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          rotationY: angle * (180 / Math.PI) + 90,
          transformOrigin: "center center",
        });
      });

      const st = {
        trigger: stageRef.current,
        start: "top 75%",
        end: "bottom top",
        scrub: 1,
      };
      gsap.to(ring, { rotationY: 360, ease: "none", scrollTrigger: st });
      gsap.to(ring, { z: 520, ease: "none", scrollTrigger: st });
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={stageRef} className="relative w-full" style={{ height: "62vh", perspective: 1200, overflow: "visible" }}>
      <div className="sticky top-[10vh] h-[42vh] flex items-center justify-center" style={{ perspective: 1200 }}>
        <div
          ref={ringRef}
          className="relative"
          style={{ transformStyle: "preserve-3d", width: 0, height: 0 }}
        >
          {cards.map((c, i) => (
            <div
              key={i}
              ref={(el) => { if (el) cardRefs.current[i] = el; }}
              className="absolute"
              style={{ width: 150, height: 210, left: -75, top: -105, transformStyle: "preserve-3d" }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden border border-[--border] bg-[--panel] shadow-2xl relative" style={{ transformStyle: "preserve-3d" }}>
                {c.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-5xl">{c.emoji}</div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[11px] font-semibold text-white text-center">{c.emoji} {c.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
