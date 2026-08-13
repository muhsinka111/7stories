import type { Metadata } from "next";
import { Page, Meta, H2, H3, P, Ul, Li, Ol, Callout, A, Step } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "How to make the best AI images — 7stories",
  description: "A practical guide to stunning AI images in 7stories: describe a moment, pick the right style and image model, and use reference photos.",
};

export default function BestAiImages() {
  return (
    <Page>
      <Meta
        kicker="Tutorial · Images"
        title="How to make the best AI images"
        lede="Most AI images fall flat because the description is vague. Here's how to get a cover image people actually pause on."
      />
      <H2>1. Describe the moment, not just the subject</H2>
      <P>
        Instead of "a wedding photo", write what's happening, the light, and the feeling:
      </P>
      <Ul>
        <Li><strong>Weak:</strong> "A wedding."</Li>
        <Li><strong>Strong:</strong> "A couple sharing a quiet smile at sunset on a rooftop overlooking Istanbul, warm golden light, soft bokeh, cinematic."</Li>
      </Ul>
      <Callout type="tip" title="Use Enhance">
        Type a rough idea in step 5 and click <em>✨ Enhance prompt</em> — 7stories writes the
        rich description for you.
      </Callout>
      <H2>2. Pick the right style</H2>
      <P>
        The visual style (step 2) changes everything:
      </P>
      <Ul>
        <Li><strong>Photoreal</strong> — lifelike people and places.</Li>
        <Li><strong>Cinematic</strong> — film-like, dramatic, editorial.</Li>
        <Li><strong>Dreamy</strong> — soft, ethereal, ideal for newborn or memorial.</Li>
        <Li><strong>Vintage</strong> — timeless, nostalgic.</Li>
      </Ul>
      <H2>3. Choose the image model for the job</H2>
      <Ul>
        <Li><strong>ChatGPT Image</strong> (default) — great all-rounder for people and scenes.</Li>
        <Li><strong>Flux Pro Ultra</strong> — highest quality for artistic/cinematic shots.</Li>
        <Li><strong>Nano Banana</strong> / <strong>Seedream</strong> — if the same person must look consistent across several images.</Li>
        <Li><strong>Ideogram</strong> — if the image needs text (signs, posters, covers).</Li>
      </Ul>
      <H2>4. Add a reference photo</H2>
      <P>
        Upload a photo of the real person, place, or product (step 6). The model uses it as a
        visual reference, so the result matches reality far better.
      </P>
      <H2>5. Set the size, then generate</H2>
      <P>
        Pick an aspect ratio in step 13 (16:9 is best for social and covers). Generate, then
        <strong> 🎲 Regenerate</strong> if you want more options or <strong>🎨 Redesign</strong> to
        try a different style or model.
      </P>
      <Callout type="info" title="Related">
        Level up further with the <A href="/tutorials/consistent-characters">consistent-characters</A>{" "}
        and <A href="/tutorials/prompt-guide">prompt guide</A>.
      </Callout>
    </Page>
  );
}
