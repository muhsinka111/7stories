// The Seven Basic Plots (Christopher Booker) — the narrative engine behind 7stories.
// Each arc is mapped to the classic story beat structure so the AI can build a
// narrative that actually feels like a story, not a paragraph of adjectives.

export type PlotKey =
  | "overcoming-the-monster"
  | "rags-to-riches"
  | "the-quest"
  | "voyage-and-return"
  | "comedy"
  | "tragedy"
  | "rebirth";

export interface Plot {
  key: PlotKey;
  title: string;
  emoji: string;
  oneLiner: string;
  tagline: string;
  /** The emotional arc of this plot, in order. */
  beats: string[];
  /** The B2B marketing angle — how a brand would use this arc. */
  brandUse: string;
}

export const PLOTS: Plot[] = [
  {
    key: "overcoming-the-monster",
    title: "Overcoming the Monster",
    emoji: "🐉",
    tagline: "The underdog defeats the threat.",
    oneLiner:
      "Your customer faced a brutal problem and, against the odds, defeated it — with your product as the weapon.",
    beats: [
      "Show the monster (the problem) in terrifying detail",
      "Introduce the hero (your customer) and what's at stake",
      "The hero prepares — the moment they choose to fight",
      "The confrontation — the product goes to work",
      "Victory + the relief and reward that follow",
    ],
    brandUse: "Competitive wins, security/business-continuity stories, 'we beat the chaos' case studies.",
  },
  {
    key: "rags-to-riches",
    title: "Rags to Riches",
    emoji: "📈",
    tagline: "From struggling to thriving.",
    oneLiner:
      "Your customer started small or stuck, then transformed into something far better — and your product was the turning point.",
    beats: [
      "The humble, stuck beginning",
      "A glimpse of a better life — the goal",
      "The catalyst — adoption of the product",
      "Rapid upward transformation",
      "The achieved, improved state",
    ],
    brandUse: "Growth stories, ROI lifts, startup journeys, 'from X to Y' before/after narratives.",
  },
  {
    key: "the-quest",
    title: "The Quest",
    emoji: "🧭",
    tagline: "A mission with a destination.",
    oneLiner:
      "Your customer set out on a big mission, faced trials along the way, and reached the goal with your product guiding the journey.",
    beats: [
      "The call to a bold mission",
      "Assembling the companions & tools",
      "A series of trials and tests",
      "The final, hardest challenge",
      "Arrival — the goal achieved, lessons learned",
    ],
    brandUse: "Product launches, multi-phase projects, long sales journeys, 'how we got there' narratives.",
  },
  {
    key: "voyage-and-return",
    title: "Voyage & Return",
    emoji: "🌍",
    tagline: "Into the unknown, back transformed.",
    oneLiner:
      "Your customer stepped into an unfamiliar world (new market, new problem), navigated it, and returned with hard-won insight — your product was the compass.",
    beats: [
      "Departure into the unknown",
      "Disorientation — the unfamiliar problem",
      "Adaptation — learning the new terrain",
      "The near-miss or turning point",
      "Return, transformed, with a new edge",
    ],
    brandUse: "Expanding to new markets, digital transformation, adopting new tech, internationalization.",
  },
  {
    key: "comedy",
    title: "Comedy",
    emoji: "😄",
    tagline: "Confusion, then clarity.",
    oneLiner:
      "Misunderstandings and messy, chaotic workflows finally snap into place — and your product is what cleared the air.",
    beats: [
      "A tangle of confusion and missteps",
      "The chaos escalates",
      "A moment of revelation",
      "The big misunderstanding resolved",
      "Harmony restored — everyone on the same page",
    ],
    brandUse: "Team collaboration wins, process fixes, onboarding that used to be a mess, misaligned teams.",
  },
  {
    key: "tragedy",
    title: "Tragedy",
    emoji: "⚠️",
    tagline: "The cost of doing nothing.",
    oneLiner:
      "This is the story of the business that ignored the problem — the cautionary tale your prospect needs to hear before it's their story.",
    beats: [
      "The protagonist (a company like yours)",
      "A flaw — ignoring the warning signs",
      "The pressure builds",
      "The fall — the cost becomes real",
      "The hard lesson + the path that avoids it",
    ],
    brandUse: "ROI/risk thought-leadership, 'don't be like them' content, churn/attrition warnings, educational bait.",
  },
  {
    key: "rebirth",
    title: "Rebirth",
    emoji: "🕊️",
    tagline: "A second chance, transformed.",
    oneLiner:
      "A business on the edge of failure got a second life — and your product was the reason it came back stronger.",
    beats: [
      "Stagnation — the familiar rut",
      "A crisis that forces change",
      "The descent — everything looks lost",
      "The transformation — the product as lifeline",
      "Rebirth — a fundamentally better company",
    ],
    brandUse: "Turnaround stories, rebrands, business rescues, 'second act' founder narratives.",
  },
];

export function getPlot(key: string): Plot {
  return PLOTS.find((p) => p.key === key) ?? PLOTS[0];
}
