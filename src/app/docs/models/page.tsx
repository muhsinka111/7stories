import type { Metadata } from "next";
import { Page, Meta, H2, P, Ul, Li, Callout, A, Table } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "AI models — 7stories",
  description: "Choose the right AI image, video, and language model in 7stories. What each engine does and what it costs in credits.",
};

export default function Models() {
  return (
    <Page>
      <Meta
        kicker="Reference"
        title="AI models"
        lede="7stories lets you pick the engine for each job — image, video, and writing. Here’s how to choose."
      />
      <H2>Image engines</H2>
      <P>Used for the cover image. Good defaults, and a few special-purpose picks:</P>
      <Ul>
        <Li><strong>ChatGPT Image (GPT-4o)</strong> — default. Versatile, great for people and scenes.</Li>
        <Li><strong>Nano Banana (Gemini 2.5 Flash)</strong> — best for <strong>consistent characters</strong> across scenes.</Li>
        <Li><strong>Seedream 4.5</strong> — also excellent for character consistency and realism.</Li>
        <Li><strong>Flux Pro Ultra</strong> — highest quality cinematic/artistic images.</Li>
        <Li><strong>Ideogram V3</strong> — best at text/typography in the image.</Li>
        <Li><strong>Recraft V3</strong> — great for illustration and brand assets.</Li>
      </Ul>
      <H2>Video engines</H2>
      <P>Used for the film. Most give cinematic motion — the main differences are speed, realism, and style:</P>
      <Ul>
        <Li><strong>Sora 2 (OpenAI)</strong> — default. Strong, expressive motion.</Li>
        <Li><strong>Veo 3 (Google)</strong> — premium, cinematic realism.</Li>
        <Li><strong>Seedance 2.5 / 2.0</strong> — advanced, controllable motion.</Li>
        <Li><strong>Kling 1.6</strong> — great motion and realism.</Li>
        <Li><strong>Wan, MiniMax, LTX, Hunyuan, Runway, Pika</strong> — more styles and speeds.</Li>
      </Ul>
      <H2>Language models</H2>
      <P>Used for the writing. Pick by quality or speed:</P>
      <Ul>
        <Li><strong>GPT-4.1</strong> — default, best prose.</Li>
        <Li><strong>Claude Sonnet 4 / Opus 4</strong> — strong reasoning and writing.</Li>
        <Li><strong>Gemini 2.0 Flash</strong> — fast and reliable.</Li>
        <Li><strong>o3-mini / GPT-4o mini</strong> — fastest and cheapest.</Li>
      </Ul>
      <H2>Cost in credits</H2>
      <Table
        head={["Output", "Credits"]}
        rows={[
          ["Text story", "2–10 (by model)"],
          ["+ Image", "+5"],
          ["+ Video", "+25"],
        ]}
      />
      <Callout type="info" title="Your model is always used">
        The engine you pick in the dropdown is sent to the API exactly as chosen — 7stories
        never swaps in a default behind your back.
      </Callout>
      <Callout type="tip" title="Related">
        See the <A href="/docs/credits">credits guide</A>, or learn{" "}
        <A href="/tutorials/best-ai-images">how to pick an image model</A> for your goal.
      </Callout>
    </Page>
  );
}
