// 7stories categories — the new product focus (life events + formats), replacing
// the seven-arc framing as the primary user choice. Each category carries a
// tailored story angle, visual style, and video concept so generation feels
// specific and cinematic instead of generic.

export type CategoryKey =
  | "wedding"
  | "newborn"
  | "baby"
  | "family"
  | "elders"
  | "books"
  | "pets"
  | "brand"
  | "product"
  | "events"
  | "travel"
  | "anniversary"
  | "memorial";

export type StoryFormat = "story" | "video" | "book" | "poem" | "letter";
export type VisualStyle =
  | "cinematic"
  | "photoreal"
  | "anime"
  | "illustration"
  | "vintage"
  | "dreamy"
  | "documentary";

export interface Category {
  key: CategoryKey;
  label: string;
  emoji: string;
  tagline: string;
  description: string;
  /** What the storyteller should capture. */
  whatToTell: string;
  /** Default visual / cinematic style suggestion. */
  visualStyle: VisualStyle;
  /** Video-concept ideas for this category (e.g. "baby dancing" style motion). */
  videoConcepts: string[];
  /** Sample starting prompt to help the user begin. */
  starterPrompt: string;
}

export const CATEGORIES: Category[] = [
  {
    key: "wedding",
    label: "Wedding",
    emoji: "🥂",
    tagline: "Vows, love, and the day it all began.",
    description: "Proposal stories, vow rewrites, thank-you films, and wedding-day keepsakes.",
    whatToTell: "The couple's journey — how they met, the proposal, the day, and what it means.",
    visualStyle: "cinematic",
    videoConcepts: [
      "Slow-motion golden-hour couple moments",
      "Cinematic rings-and-florals macro",
      "A cinematic highlight-reel edit",
    ],
    starterPrompt: "They met in Istanbul in 2019. He proposed at sunrise on the Bosphorus…",
  },
  {
    key: "newborn",
    label: "Newborn",
    emoji: "👶",
    tagline: "The first breaths of a new story.",
    description: "Birth announcements and first-week milestones, told tenderly.",
    whatToTell: "The arrival, the first moments, and the love that welcomed the baby.",
    visualStyle: "dreamy",
    videoConcepts: [
      "Soft, dreamy newborn close-ups",
      "Gentle parent-and-baby cradle motion",
      "A warm first-milestones montage",
    ],
    starterPrompt: "Our daughter arrived on a rainy Tuesday, weighing 3.1 kg, at 6:02 am…",
  },
  {
    key: "baby",
    label: "Baby",
    emoji: "🧸",
    tagline: "First steps, first words, first giggles.",
    description: "Milestone stories and playful keepsakes for the first years.",
    whatToTell: "The milestones, personalities, and funny moments that make this year special.",
    visualStyle: "cinematic",
    videoConcepts: [
      "Playful, upbeat milestone montages",
      "A cute 'baby dancing' animated moment",
      "First-steps slow-motion close-up",
    ],
    starterPrompt: "She took her first steps at 11 months, straight toward the dog…",
  },
  {
    key: "family",
    label: "Family",
    emoji: "👨‍👩‍👧",
    tagline: "History, legacy, and the ties that bind.",
    description: "Family histories, reunions, and the stories that become heirlooms.",
    whatToTell: "Origins, migrations, struggles, joys, and the lessons passed down.",
    visualStyle: "vintage",
    videoConcepts: [
      "Vintage photo-album Ken Burns motion",
      "Generational montage with warm grain",
      "A family-tree cinematic story",
    ],
    starterPrompt: "Grandma left her village in 1962 with one suitcase and a dream…",
  },
  {
    key: "elders",
    label: "Elders",
    emoji: "👴",
    tagline: "A lifetime, honored beautifully.",
    description: "Life stories, tributes, and memory keepers for grandparents and elders.",
    whatToTell: "A full life told with dignity — the moments, the people, the wisdom.",
    visualStyle: "documentary",
    videoConcepts: [
      "Documentary-style interview montage",
      "A gentle lifetime-milestone tribute",
      "Cinematic celebration-of-life film",
    ],
    starterPrompt: "He fought in three wars, built a bakery, and raised seven children…",
  },
  {
    key: "books",
    label: "Books",
    emoji: "📚",
    tagline: "Stories told as books.",
    description: "Autobiographies, children's books, and novels from your life and imagination.",
    whatToTell: "A narrative worth binding — chapters, scenes, and a voice.",
    visualStyle: "illustration",
    videoConcepts: [
      "Animated storybook illustration style",
      "Page-turning cinematic book trailer",
      "Whimsical children's-book animation",
    ],
    starterPrompt: "Chapter one: the lighthouse keeper who never left…",
  },
  {
    key: "pets",
    label: "Pets",
    emoji: "🐾",
    tagline: "The loyal companions of our stories.",
    description: "Pet tributes, adoption stories, and everyday heroics of furry family.",
    whatToTell: "The bond, the quirks, and the unconditional love of a companion.",
    visualStyle: "cinematic",
    videoConcepts: [
      "Playful slow-motion pet moments",
      "A heartwarming adoption-to-home arc",
      "Cinematic pet adventure montage",
    ],
    starterPrompt: "We adopted Milo from a shelter in 2021. He repaid us with 4,000 tail wags…",
  },
  {
    key: "brand",
    label: "Brand",
    emoji: "🚀",
    tagline: "Customer stories that sell.",
    description: "Customer success stories, launches, and brand narratives built to convert.",
    whatToTell: "The customer's journey — problem, change, and measurable result.",
    visualStyle: "cinematic",
    videoConcepts: [
      "Bold cinematic brand commercial",
      "A high-energy product-launch film",
      "Founder-story documentary style",
    ],
    starterPrompt: "We help e-commerce brands cut cart abandonment. One client cut theirs 38%…",
  },
  {
    key: "product",
    label: "Product",
    emoji: "📦",
    tagline: "Your product, told cinematically.",
    description: "Product stories, feature films, and launch narratives with real impact.",
    whatToTell: "The problem it solves, the moment of use, and the outcome.",
    visualStyle: "photoreal",
    videoConcepts: [
      "Sleek photoreal product hero shots",
      "Feature-reveal cinematic edit",
      "Before/after transformation montage",
    ],
    starterPrompt: "A $40 tool that replaces a $4,000 workflow — here's how…",
  },
  {
    key: "events",
    label: "Events",
    emoji: "🎉",
    tagline: "Birthdays, anniversaries, and milestones.",
    description: "Celebration stories for birthdays, graduations, and life's big days.",
    whatToTell: "The day, the people, and the moment worth remembering.",
    visualStyle: "cinematic",
    videoConcepts: [
      "Party recap with upbeat energy",
      "Cinematic milestone retrospective",
      "A surprise-moment slow-motion film",
    ],
    starterPrompt: "A surprise 50th birthday — 40 guests, one tearful toast…",
  },
  {
    key: "travel",
    label: "Travel",
    emoji: "✈️",
    tagline: "Journeys worth retelling.",
    description: "Trip stories, wanderlust films, and the places that changed you.",
    whatToTell: "The journey, the discoveries, and the transformation of travel.",
    visualStyle: "cinematic",
    videoConcepts: [
      "Cinematic travel montage with sweeping vistas",
      "Drone-style landscape reveal",
      "A journey-of-discovery story film",
    ],
    starterPrompt: "Three weeks, four countries, one borrowed backpack…",
  },
  {
    key: "anniversary",
    label: "Anniversary",
    emoji: "💍",
    tagline: "Years of love, celebrated.",
    description: "Anniversary tributes and relationship milestone stories.",
    whatToTell: "The years together — the moments and the growth of a bond.",
    visualStyle: "vintage",
    videoConcepts: [
      "A decade-by-decade love montage",
      "Golden-anniversary cinematic tribute",
      "Old-photos-to-now transformation",
    ],
    starterPrompt: "Twenty-five years ago they said 'I do' in a tiny chapel…",
  },
  {
    key: "memorial",
    label: "Memorial",
    emoji: "🕯️",
    tagline: "Remembered, beautifully.",
    description: "Tributes and remembrance films for loved ones we've lost.",
    whatToTell: "A life honored with warmth and dignity — who they were, what they gave.",
    visualStyle: "documentary",
    videoConcepts: [
      "Gentle cinematic remembrance film",
      "A life-in-moments tribute",
      "Soft candlelight and memory montage",
    ],
    starterPrompt: "She taught piano for 40 years and every student remembered her…",
  },
];

export function getCategory(key: string): Category {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

/** Curated visual styles recommended for each category (first = default). */
export const CATEGORY_STYLES: Record<CategoryKey, VisualStyle[]> = {
  wedding: ["cinematic", "vintage", "dreamy", "photoreal"],
  newborn: ["dreamy", "cinematic", "photoreal", "illustration"],
  baby: ["cinematic", "anime", "dreamy", "photoreal"],
  family: ["vintage", "cinematic", "documentary", "photoreal"],
  elders: ["documentary", "cinematic", "vintage"],
  books: ["illustration", "anime", "cinematic", "vintage"],
  pets: ["cinematic", "photoreal", "anime", "illustration"],
  brand: ["cinematic", "photoreal", "documentary"],
  product: ["photoreal", "cinematic", "documentary"],
  events: ["cinematic", "photoreal", "vintage", "anime"],
  travel: ["cinematic", "documentary", "photoreal", "illustration"],
  anniversary: ["vintage", "cinematic", "dreamy", "photoreal"],
  memorial: ["documentary", "cinematic", "dreamy"],
};

/** Styles to show for a category (its curated set, default first, deduped). */
export function recommendedStyles(key: string): VisualStyle[] {
  const cat = getCategory(key);
  const curated = CATEGORY_STYLES[key as CategoryKey] ?? [cat.visualStyle];
  return Array.from(new Set([cat.visualStyle, ...curated]));
}

/** Map a category to a Booker plot archetype for the internal narrative engine. */
export function categoryToPlot(key: string): string {
  const map: Record<string, string> = {
    wedding: "voyage-and-return",
    newborn: "rebirth",
    baby: "comedy",
    family: "the-quest",
    elders: "voyage-and-return",
    books: "overcoming-the-monster",
    pets: "comedy",
    brand: "rags-to-riches",
    product: "overcoming-the-monster",
    events: "comedy",
    travel: "voyage-and-return",
    anniversary: "rebirth",
    memorial: "tragedy",
  };
  return map[key] ?? "rags-to-riches";
}

export const VISUAL_STYLES: { key: VisualStyle; label: string }[] = [
  { key: "cinematic", label: "🎬 Cinematic" },
  { key: "photoreal", label: "📷 Photoreal" },
  { key: "anime", label: "🌸 Anime" },
  { key: "illustration", label: "🎨 Illustration" },
  { key: "vintage", label: "🕰️ Vintage" },
  { key: "dreamy", label: "🌫️ Dreamy" },
  { key: "documentary", label: "🎞️ Documentary" },
];

export const FORMATS: { key: StoryFormat; label: string; icon: string }[] = [
  { key: "story", label: "Story", icon: "✍️" },
  { key: "video", label: "Story video", icon: "🎬" },
  { key: "book", label: "Book", icon: "📚" },
  { key: "poem", label: "Poem", icon: "🪶" },
  { key: "letter", label: "Letter", icon: "💌" },
];
