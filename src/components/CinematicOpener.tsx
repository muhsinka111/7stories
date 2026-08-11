"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The 7stories cinematic opener.
 *
 * A scroll-driven 3D "fly-through": the visitor travels down a tunnel of
 * floating plates, each carrying one of the world's many sevens. Every plate
 * sweeps from deep in the distance (far Z) toward the viewer (near Z) and past
 * the camera — the ancient-scroll "from back to front" reveal.
 *
 * Chapters resolve from "seven is everywhere" into "and every story is one of
 * seven" → the 7stories hook and CTA.
 */

interface Plate {
  kicker: string;
  title: string;
  line: string;
  detail: string;
}

const CHAPTERS: Plate[] = [
  {
    kicker: "A number older than memory",
    title: "7",
    line: "The most common number in the world.",
    detail: "It appears in every culture, every era, every field. Why? Because the world keeps counting by seven.",
  },
  {
    kicker: "The lands",
    title: "7 Continents",
    line: "Africa · Antarctica · Asia · Australia · Europe · North America · South America",
    detail: "Seven great landmasses hold every civilization that ever was.",
  },
  {
    kicker: "The waters",
    title: "7 Seas",
    line: "The ancient mariners' seven bodies of water",
    detail: "Before maps had borders, sailors navigated a world divided into seven seas.",
  },
  {
    kicker: "The light",
    title: "7 Colors",
    line: "Red · Orange · Yellow · Green · Blue · Indigo · Violet",
    detail: "A single beam of light, bent through a prism, reveals itself as seven.",
  },
  {
    kicker: "The time",
    title: "7 Days",
    line: "Monday through Sunday",
    detail: "Our entire sense of a week — rhythm, rest, ritual — turns on the number seven.",
  },
  {
    kicker: "The sound",
    title: "7 Notes",
    line: "Do · Re · Mi · Fa · Sol · La · Si",
    detail: "Almost every melody you have ever loved is built on seven notes.",
  },
  {
    kicker: "The marvels",
    title: "7 Wonders",
    line: "Seven wonders of the ancient world",
    detail: "Humanity crowned its greatest creations — seven of them.",
  },
  {
    kicker: "The mysteries",
    title: "7 Everywhere",
    line: "Seven chakras · seven dwarfs · seventh heaven · lucky seven",
    detail: "Myth, faith, games, and luck all orbit the same sacred number.",
  },
  {
    kicker: "The reveal",
    title: "And every story?",
    line: "There are exactly seven.",
    detail: "Overcoming the Monster · Rags to Riches · The Quest · Voyage & Return · Comedy · Tragedy · Rebirth.",
  },
  {
    kicker: "The brand",
    title: "7stories",
    line: "Every brand has a story. Tell the right one.",
    detail: "The AI storytelling workspace that turns your raw facts into an on-brand story built on one of the seven timeless arcs.",
  },
];

// How deep each plate starts (negative Z = far away). Plates are laid out
// along the Z axis; scroll pushes them forward past the camera one by one.
const START_Z = -2600;
const TRAVEL = 3400;
const SPACING = 520;
const FOCAL = 1100;

export default function CinematicOpener() {
  const stageRef = useRef<HTMLDivElement>(null);
  const platesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const plates = platesRef.current;
    if (!plates.length) return;

    const ctx = gsap.context(() => {
      // Master scroll progress drives every plate. We position each plate
      // manually from one normalized value so the stagger is exact and nothing
      // fights GSAP's internal transform bookkeeping.
      ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress; // 0 → 1
          plates.forEach((plate, i) => {
            const z = START_Z + i * SPACING + p * TRAVEL;
            const dist = Math.abs(z);
            const near = dist < FOCAL;
            const opacity = near ? 1 : Math.max(0, 1 - dist / (FOCAL * 2.2));
            const scale = near ? 1 : 1.3;
            const rotX = near ? 0 : -8;
            plate.style.opacity = String(opacity);
            plate.style.transform = `translateZ(${z}px) scale(${scale}) rotateX(${rotX}deg)`;
          });
        },
      });
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative w-full"
      style={{ height: `${CHAPTERS.length * 100}vh`, perspective: 1400 }}
    >
      {/* Sticky stage holding the fly-through tunnel */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_70%_-10%,#1c2030_0%,#0a0b0f_55%)]" />
        {/* faint scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[--muted] text-sm mono tracking-widest animate-bounce">
          scroll ↓
        </div>

        <div className="relative w-full max-w-3xl px-6" style={{ perspective: 1400 }}>
          {CHAPTERS.map((c, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) platesRef.current[i] = el;
              }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: 0.05 }}
            >
              <div className="card glow w-full p-8 md:p-12 text-center">
                <p className="mono text-xs uppercase tracking-[0.3em] text-[--muted] mb-4">
                  {c.kicker}
                </p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-3 amber-grad">
                  {c.title}
                </h2>
                <p className="text-lg md:text-2xl font-semibold text-[--ink] mb-4">
                  {c.line}
                </p>
                <p className="text-[--muted] max-w-xl mx-auto">{c.detail}</p>
                {i === 0 && (
                  <p className="mono text-xs text-[--accent]/70 mt-4">
                    it is everywhere
                  </p>
                )}
                {i === CHAPTERS.length - 1 && (
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <a href="#get-started" className="btn btn-primary">
                      Tell my story →
                    </a>
                    <a href="#plots" className="btn btn-ghost">
                      See the 7 plots
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
