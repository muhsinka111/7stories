// Storytelling audiences for 7stories.
// The same seven-arc engine, but each audience gets a professionally tailored
// framing so a family heirloom and a B2B case study each read like they should.

export type AudienceKey = "brand" | "company" | "family";

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
    description:
      "Customer success stories, product launches, and brand narratives built to persuade and convert.",
    whatToTell:
      "The customer's journey with the product — their problem, the moment of change, and the measurable result.",
    guidance: [
      "Lead with the customer as hero; the product is the instrument.",
      "Use concrete results and specifics over adjectives.",
      "End with a clear call to action.",
    ],
    starterPrompt:
      "We help e-commerce brands cut cart abandonment. A customer cut theirs 38% in two months.",
  },
  {
    key: "company",
    label: "Company",
    emoji: "🏢",
    tagline: "Culture, origin & team stories.",
    description:
      "Founding narratives, mission, values, and team stories that build identity, trust, and belonging.",
    whatToTell:
      "Who you are, why you started, what you stand for — told as a story people remember.",
    guidance: [
      "Ground the story in real founding moments and decisions.",
      "Let values show through action, not slogans.",
      "Give the team and customers a role in the narrative.",
    ],
    starterPrompt:
      "We started in a garage in 2019 with three people and a belief that shipping should be simpler.",
  },
  {
    key: "family",
    label: "Family",
    emoji: "🏡",
    tagline: "Heirlooms told beautifully.",
    description:
      "Personal and family stories — memories, journeys, and legacies — preserved as keepsakes for generations.",
    whatToTell:
      "The moments and people that shaped a family: origins, struggles, joys, and the lessons passed down.",
    guidance: [
      "Write with warmth and intimacy, as if telling it at the dinner table.",
      "Preserve real details — places, names, sensory specifics.",
      "Honor the emotional truth; this is a legacy, not marketing.",
    ],
    starterPrompt:
      "My grandmother left her village in 1962 with one suitcase and a dream of a better life for her children.",
  },
];

export function getAudience(key: string): Audience {
  return AUDIENCES.find((a) => a.key === key) ?? AUDIENCES[0];
}
