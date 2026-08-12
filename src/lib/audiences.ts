// Storytelling audiences / workflows for 7stories.
// Each audience gets a professionally tailored framing so a family heirloom,
// a product launch, a fundraiser, or a wedding film each read like they should.

export type AudienceKey =
  | "brand"
  | "company"
  | "family"
  | "creator"
  | "marketer"
  | "educator"
  | "nonprofit"
  | "personal"
  | "celebrations"
  | "product";

export interface Audience {
  key: AudienceKey;
  label: string;
  emoji: string;
  tagline: string;
  description: string;
  /** What the storyteller should capture / emphasize. */
  whatToTell: string;
  /** Professional storytelling rules specific to this audience. */
  guidance: string[];
  /** Sample starting prompt to help the user begin. */
  starterPrompt: string;
}

export const AUDIENCES: Audience[] = [
  {
    key: "brand",
    label: "Brand",
    emoji: "🚀",
    tagline: "Marketing stories that sell.",
    description: "Customer success, launches, and brand narratives built to persuade and convert.",
    whatToTell: "The customer's journey with the product — the problem, the moment of change, and the measurable result.",
    guidance: ["Lead with the customer as hero; the product is the instrument.", "Use concrete results over adjectives.", "End with a clear call to action."],
    starterPrompt: "We help e-commerce brands cut cart abandonment. A customer cut theirs 38% in two months.",
  },
  {
    key: "company",
    label: "Company",
    emoji: "🏢",
    tagline: "Culture, origin & team stories.",
    description: "Founding narratives, mission, and team stories that build identity and trust.",
    whatToTell: "Who you are, why you started, what you stand for — told as a story people remember.",
    guidance: ["Ground the story in real founding moments.", "Let values show through action, not slogans.", "Give the team and customers a role in the narrative."],
    starterPrompt: "We started in a garage in 2019 with three people and a belief that shipping should be simpler.",
  },
  {
    key: "family",
    label: "Family",
    emoji: "👨‍👩‍👧",
    tagline: "Heirlooms told beautifully.",
    description: "Personal and family stories — memories, journeys, and legacies — preserved as keepsakes.",
    whatToTell: "The moments and people that shaped a family: origins, struggles, joys, and lessons passed down.",
    guidance: ["Write with warmth and intimacy.", "Preserve real details — places, names, sensory specifics.", "Honor the emotional truth; this is a legacy, not marketing."],
    starterPrompt: "My grandmother left her village in 1962 with one suitcase and a dream of a better life for her children.",
  },
  {
    key: "creator",
    label: "Creator",
    emoji: "🎬",
    tagline: "Content, channels & personal brands.",
    description: "Origin stories, channel launches, and audience moments for creators and influencers.",
    whatToTell: "The journey of the creator — the spark, the grind, the breakthrough — and what the audience means to them.",
    guidance: ["Open with a raw, honest hook.", "Make the audience the co-star.", "End on a moment the viewer can share."],
    starterPrompt: "I posted my first video to 14 viewers in 2021. Last month, one video passed a million.",
  },
  {
    key: "marketer",
    label: "Marketer",
    emoji: "📣",
    tagline: "Campaigns & launch narratives.",
    description: "Campaign backstories, launch narratives, and campaign case studies for marketing teams.",
    whatToTell: "The strategy and the human outcome — what the campaign set out to do and the result it delivered.",
    guidance: ["Frame the campaign as a narrative with a clear arc.", "Quantify the outcome.", "Make it reusable across channels."],
    starterPrompt: "Our Q4 campaign needed to stand out in a crowded market. Here's the story of how we did it.",
  },
  {
    key: "educator",
    label: "Educator",
    emoji: "🎓",
    tagline: "Learning, programs & student journeys.",
    description: "Student journeys, program outcomes, and the story behind teaching and courses.",
    whatToTell: "A learner's transformation — where they started, the struggle, and how the program changed their path.",
    guidance: ["Center the learner, not the institution.", "Show the transformation concretely.", "Inspire the next learner to begin."],
    starterPrompt: "A first-generation student who nearly dropped out is now a mentor to fifty others.",
  },
  {
    key: "nonprofit",
    label: "Nonprofit",
    emoji: "🤝",
    tagline: "Mission stories that move donors.",
    description: "Impact stories, donor journeys, and mission narratives for nonprofits and NGOs.",
    whatToTell: "The real person changed by the work — their before, the turning point, and the ripple effect.",
    guidance: ["Lead with a single, concrete human story.", "Show the before and after.", "Make the ask feel like part of the story."],
    starterPrompt: "In 2023 we fed 200 families a month. Here's the story of one of them.",
  },
  {
    key: "personal",
    label: "Personal",
    emoji: "🧍",
    tagline: "Your own story, your way.",
    description: "Personal growth, milestones, and life chapters told as compelling narratives.",
    whatToTell: "A defining chapter of your life — the challenge, the turning point, and who you became.",
    guidance: ["Be honest and specific.", "Find the universal in the personal.", "End with what you learned or carry forward."],
    starterPrompt: "At 40 I changed everything — left the career I'd built and started over.",
  },
  {
    key: "celebrations",
    label: "Celebrations",
    emoji: "🎉",
    tagline: "Weddings, birthdays & milestones.",
    description: "Weddings, birthdays, anniversaries, and milestones captured as cinematic keepsakes.",
    whatToTell: "The emotional heart of the celebration — the people, the moment, and what it means.",
    guidance: ["Set the scene and the feeling.", "Weave in the people who matter.", "End on a wish or a toast."],
    starterPrompt: "They met at a bookstore in spring, married in autumn, and every year since has been a chapter.",
  },
  {
    key: "product",
    label: "Product",
    emoji: "📦",
    tagline: "Your product, told cinematically.",
    description: "Product origin, build stories, and launch narratives for product teams and startups.",
    whatToTell: "The problem that demanded a solution, the build, and the moment it reached people.",
    guidance: ["Start from the user's pain, not the feature.", "Show the craft behind the build.", "End on the impact in the real world."],
    starterPrompt: "For two years we asked one question nobody else would: why is this still so hard?",
  },
];

export function getAudience(key: string): Audience {
  return AUDIENCES.find((a) => a.key === key) ?? AUDIENCES[0];
}
