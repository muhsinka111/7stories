import type { Metadata } from "next";
import { Page, Meta, H2, H3, P, Ul, Li, Callout, A, Table } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "The studio — 7stories",
  description: "Every option in the 7stories studio explained: categories, styles, formats, reference photos, output, image/video/language engines, tone, language, and size.",
};

export default function Studio() {
  return (
    <Page>
      <Meta
        kicker="Guide"
        title="The studio"
        lede="The studio is a 13-step form that turns your moment into a finished story. Here’s what every step does."
      />
      <Table
        head={["Step", "What it does"]}
        rows={[
          ["1 · Category", "The type of story (Wedding, Brand, Product, Memorial…). Sets the style presets and prompt."],
          ["2 · Visual style", "Cinematic, Vintage, Dreamy, Photoreal — applied to image and video."],
          ["3 · Format", "Story, Story video, Book, Poem, or Letter — how the text is structured."],
          ["4 · Subject / title", "A short name for the story or its subject."],
          ["5 · What happened?", "Your raw facts and details. The core of the story."],
          ["6 · Reference photos", "Optional photos used as visual reference for image & video."],
          ["7 · Output", "Story (text), + Image, + Video, or Both."],
          ["8 · Image engine", "Which AI model draws the cover image."],
          ["9 · Video engine", "Which AI model generates the film."],
          ["10 · Language model", "Which AI writes the text."],
          ["11 · Tone", "Professional, Warm, Bold, or Empathetic."],
          ["12 · Language", "The language the story is written in."],
          ["13 · Size & quality", "Aspect ratio (image) + resolution: 720p, 1080p, or 4K (video)."],
        ]}
      />
      <H2>Reference photos (step 6)</H2>
      <P>
        Upload up to 6 photos (or paste image URLs). These are used as a visual reference —
        the first photo becomes the start frame for video, which gives you scenes that match
        real people and places.
      </P>
      <Callout type="tip" title="Make your characters consistent">
        Upload a clear photo of your subject, pick <strong>Nano Banana</strong> or{" "}
        <strong>Seedream</strong> as the image engine, then a video engine. See the{" "}
        <A href="/tutorials/consistent-characters">consistent-characters tutorial</A>.
      </Callout>
      <H2>After generation</H2>
      <Ul>
        <Li><strong>✏️ Edit story</strong> — change any heading or section text, then save.</Li>
        <Li><strong>🎲 Regenerate</strong> — a fresh variation with a new random seed.</Li>
        <Li><strong>🎨 Redesign</strong> — change the style or engine, then apply a new look.</Li>
        <Li><strong>⤴ Copy</strong> — copy the full story to the clipboard.</Li>
      </Ul>
      <H2>Enhance prompt (step 5)</H2>
      <P>
        Type a rough idea and click <em>✨ Enhance prompt</em>. 7stories expands it into a
        detailed, high-quality generation prompt using the category, style, and format you chose.
      </P>
      <Callout type="info" title="Related">
        See <A href="/docs/models">AI models</A> for engine details, or the{" "}
        <A href="/tutorials/prompt-guide">prompt guide</A> for better results.
      </Callout>
    </Page>
  );
}
