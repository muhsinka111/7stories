// Credit packages & subscription plans for 7stories.

export interface Plan {
  key: string;
  name: string;
  tagline: string;
  creditsPerMonth: number;
  usd: number;
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  { key: "free", name: "Free", tagline: "Try the studio", creditsPerMonth: 50, usd: 0 },
  { key: "pro", name: "Pro", tagline: "For creators & founders", creditsPerMonth: 1000, usd: 19, highlight: true },
  { key: "studio", name: "Studio", tagline: "For agencies & teams", creditsPerMonth: 5000, usd: 49 },
];

export interface CreditPack {
  key: string;
  name: string;
  credits: number;
  usd: number;
  per?: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  { key: "pack_small", name: "Starter pack", credits: 100, usd: 5 },
  { key: "pack_medium", name: "Creator pack", credits: 500, usd: 20, per: "best value" },
  { key: "pack_large", name: "Studio pack", credits: 2000, usd: 60 },
];

export function getCreditPack(key: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.key === key);
}
