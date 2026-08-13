import type { Metadata } from "next";
import { Page, Meta, CardGrid, DocCard, H2, P, A } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "Tutorials — 7stories",
  description: "Step-by-step tutorials for making the best AI images and videos with 7stories — prompts, models, character consistency, and more.",
};

export default function TutorialsHome() {
  return (
    <Page>
      <Meta
        kicker="Learn"
        title="Tutorials"
        lede="Practical, step-by-step guides to making genuinely great images and films with 7stories."
      />
      <CardGrid>
        <DocCard href="/tutorials/best-ai-images" tag="Images" title="How to make the best AI images" desc="Prompts, styles, reference photos, and model picks for stunning images." />
        <DocCard href="/tutorials/best-ai-videos" tag="Video" title="How to make the best AI videos" desc="Cinematic films: image-to-video, motion, resolution, and the right engine." />
        <DocCard href="/tutorials/consistent-characters" tag="Pro" title="Consistent characters across scenes" desc="The Nano Banana → Veo/Kling workflow for the same person in every shot." />
        <DocCard href="/tutorials/prompt-guide" tag="Foundation" title="The art of the AI prompt" desc="How to describe a moment so the AI gets it right the first time." />
        <DocCard href="/tutorials/brand-stories" tag="Business" title="Brand & customer stories that sell" desc="Turn happy customers into compelling, on-brand story assets." />
        <DocCard href="/tutorials/wedding-story" tag="Example" title="Wedding story walkthrough" desc="Follow a full example from category to finished film." />
      </CardGrid>
      <div>
        <H2>New here?</H2>
        <P>
          Start with <A href="/docs/getting-started">getting started</A> if you haven't made your
          first story yet, then come back here to level up.
        </P>
      </div>
    </Page>
  );
}
