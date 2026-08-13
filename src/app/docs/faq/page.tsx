import type { Metadata } from "next";
import { Page, Meta, H2, P, A, Callout } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "FAQ — 7stories",
  description: "Frequently asked questions about 7stories: accounts, credits, models, images, videos, and more.",
};

const FAQS: { q: string; a: string }[] = [
  { q: "Is 7stories free?", a: "New accounts start with 50 free credits. After that, you buy credit packs or a monthly plan. A text story costs a few credits; adding an image or video costs more." },
  { q: "Do I need an account to generate?", a: "Yes. You must sign in to generate and save stories. This protects your work and tracks your credits." },
  { q: "Can I use my own photos?", a: "Yes — upload up to 6 reference photos in the studio. They're used as a visual reference, and the first photo becomes the start frame for video." },
  { q: "Which image or video model should I pick?", a: "Defaults are excellent (ChatGPT Image + Sora). For consistent characters across scenes, use Nano Banana or Seedream for images. See the models guide." },
  { q: "How do I make the AI write in Turkish (or another language)?", a: "Set the Language step (step 12) to Turkish, Spanish, French, etc. The story is written in that language." },
  { q: "Why did my generation fail?", a: "Most failures are because a provider account is out of credits (e.g. FAL balance or Anthropic credits) or a model needs its own setup. Check the error message, which usually says which provider." },
  { q: "Can I edit the result after generating?", a: "Yes. After generation, use Edit story to change text, Regenerate for a new variation, or Redesign to apply a different style or engine." },
  { q: "How many stories can I save?", a: "As many as you like. Your saved stories live in your library in the dashboard." },
  { q: "What are credits and why do I need them?", a: "Credits map to the real cost of AI generation. Each image and film costs the underlying model API money, so credits keep usage fair and sustainable." },
];

export default function Faq() {
  return (
    <Page>
      <Meta
        kicker="Answers"
        title="Frequently asked questions"
        lede="Quick answers to the most common questions."
      />
      {FAQS.map((f, i) => (
        <div key={i} className="card p-5">
          <H2>{f.q}</H2>
          <P>{f.a}</P>
        </div>
      ))}
      <Callout type="info" title="Still stuck?">
        Browse the <A href="/docs">docs</A>, read the <A href="/tutorials">tutorials</A>, or
        open the studio and try the defaults.
      </Callout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </Page>
  );
}
