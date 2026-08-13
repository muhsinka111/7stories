import type { Metadata } from "next";
import { Page, Meta, H2, P, Ul, Li, Ol, Callout, A, Step } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "Wedding story walkthrough — 7stories",
  description: "Follow a full 7stories wedding story from category to finished film. A complete, step-by-step example.",
};

export default function WeddingStory() {
  return (
    <Page>
      <Meta
        kicker="Tutorial · Example"
        title="Wedding story walkthrough"
        lede="A complete example — from picking the category to a finished cinematic film. Follow along in the studio."
      />
      <H2>The brief</H2>
      <P>
        Let's turn a real moment into a wedding story: "Elif and Emre met in Istanbul in 2019.
        He proposed at sunrise on the Bosphorus. They got married by the sea."
      </P>
      <Ol>
        <li><strong>Category:</strong> Wedding. The style presets switch to wedding-recommended ones.</li>
        <li><strong>Visual style:</strong> Cinematic.</li>
        <li><strong>Format:</strong> Story.</li>
        <li><strong>Subject:</strong> "Elif & Emre — a sunrise proposal".</li>
        <li><strong>What happened:</strong> paste the brief, or click <em>Enhance prompt</em>.</li>
        <li><strong>Reference photos:</strong> upload a photo of the couple if you have one.</li>
        <li><strong>Output:</strong> Both (image + video).</li>
        <li><strong>Image engine:</strong> ChatGPT Image (or Nano Banana for consistent faces).</li>
        <li><strong>Video engine:</strong> Veo 3 or Sora for cinematic motion.</li>
        <li><strong>Language model:</strong> GPT-4.1.</li>
        <li><strong>Tone:</strong> Warm.</li>
        <li><strong>Language:</strong> English (or Turkish for a Turkish audience).</li>
        <li><strong>Size:</strong> 16:9, 1080p.</li>
      </Ol>
      <Callout type="tip" title="Then refine">
        Generate, then use <strong>Edit</strong> to polish the words, <strong>🎲 Regenerate</strong>{" "}
        for a new take, or <strong>🎨 Redesign</strong> to try Vintage or Dreamy.
      </Callout>
      <H2>What you'll get</H2>
      <Ul>
        <Li>A warm, 5-section wedding story.</Li>
        <Li>A cinematic cover image of the couple.</Li>
        <Li>A short film with the sunrise-proposal scene.</Li>
      </Ul>
      <Callout type="info" title="Related">
        Perfect the image with <A href="/tutorials/best-ai-images">best AI images</A> and the
        film with <A href="/tutorials/best-ai-videos">best AI videos</A>.
      </Callout>
    </Page>
  );
}
