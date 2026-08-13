import type { Metadata } from "next";
import { Page, Meta, H2, H3, P, Ul, Li, Callout, A, Table } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "The art of the AI prompt — 7stories",
  description: "How to describe a moment so the AI gets it right the first time. A practical prompt-writing guide for 7stories.",
};

export default function PromptGuide() {
  return (
    <Page>
      <Meta
        kicker="Tutorial · Foundation"
        title="The art of the AI prompt"
        lede="Everything in 7stories starts with how you describe the moment. These patterns make the AI get it right the first time."
      />
      <H2>The formula</H2>
      <P>
        A strong prompt answers: <strong>Who + What + Where + When + Feeling</strong>.
      </P>
      <Table
        head={["Part", "Ask yourself", "Example"]}
        rows={[
          ["Who", "Who is in the scene?", "a father and daughter"],
          ["What", "What's happening?", "sharing a homemade lemonade stand"],
          ["Where", "Where is it?", "in their garden at golden hour"],
          ["When", "Light & time?", "warm late-afternoon sun"],
          ["Feeling", "The mood?", "joyful, nostalgic, candid"],
        ]}
      />
      <Callout type="tip" title="Let Enhance do it">
        In step 5, type a rough idea and click <em>✨ Enhance prompt</em>. 7stories expands it
        into this full structure automatically.
      </Callout>
      <H2>Word choices that work</H2>
      <Ul>
        <Li>Use <strong>sensory</strong> words: golden light, soft focus, crisp detail, gentle motion.</Li>
        <Li>Name the <strong>style</strong>: cinematic, photoreal, editorial, dreamy, vintage.</Li>
        <Li>For video, describe <strong>motion</strong>: push in, pan left, drift, zoom, fade.</Li>
        <Li>Avoid negatives like "no text" — instead say "clean background, no text".</Li>
      </Ul>
      <H2>Set the tone & language</H2>
      <P>
        Use step 11 (tone) to steer the writing — <strong>Warm</strong> for family,{" "}
        <strong>Bold</strong> for brands — and step 12 (language) to write in English, Turkish,
        or another language.
      </P>
      <H2>Iterate</H2>
      <P>
        Don't chase perfection in one prompt. Generate, see what's off, then{" "}
        <strong>🎨 Redesign</strong> with a tweak. Fast iteration beats a perfect first draft.
      </P>
      <Callout type="info" title="Related">
        Apply this in the <A href="/tutorials/best-ai-images">images</A> and{" "}
        <A href="/tutorials/best-ai-videos">videos</A> tutorials.
      </Callout>
    </Page>
  );
}
