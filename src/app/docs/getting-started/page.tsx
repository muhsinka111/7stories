import type { Metadata } from "next";
import { Page, Meta, Step, P, Ol, Li, Callout, A, H2 } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "Getting started — 7stories",
  description: "Create your first AI story with 7stories in under 5 minutes. A step-by-step guide from category to finished image or film.",
};

export default function GettingStarted() {
  return (
    <Page>
      <Meta
        kicker="Guide · Start here"
        title="Getting started"
        lede="Create your first AI story in under 5 minutes — a cinematic image, film, or written story from your own moment."
      />
      <Ol>
        <Li>
          <strong>Sign in.</strong> Head to <A href="/login">/login</A> and create a free account. New accounts start with 50 credits.
        </Li>
        <Li>
          <strong>Open the studio.</strong> Go to <A href="/#make">the studio</A> on the homepage (or the dashboard → New story).
        </Li>
        <Li>
          <strong>Pick a category.</strong> Wedding, Newborn, Family, Brand, Product — choose the one that fits your moment. This sets the style presets and prompt.
        </Li>
        <Li>
          <strong>Describe what happened.</strong> In “What happened?”, write a few sentences or bullets. Don’t overthink it — you can click <em>✨ Enhance prompt</em> to expand a rough idea into a rich prompt.
        </Li>
        <Li>
          <strong>Choose an output.</strong> Story (text only), + Image, + Video, or Both.
        </Li>
        <Li>
          <strong>Pick your engines</strong> (image, video, and language model) — or keep the defaults, which are already great.
        </Li>
        <Li>
          <strong>Generate.</strong> Click <em>✨ Generate my story</em>. In about 30 seconds you’ll get your story with a cover image or film.
        </Li>
      </Ol>
      <Callout type="tip" title="Try the defaults first">
        The default image engine (ChatGPT Image) and language model (GPT-4.1) produce excellent results out of the box. Tweak models and styles later.
      </Callout>
      <H2>What happens next</H2>
      <P>
        Once generated, you can <strong>Edit</strong> the text, <strong>🎲 Regenerate</strong> for a
        new variation, or <strong>🎨 Redesign</strong> with a different style or engine. Save it to
        your library, copy it, or upload reference photos for an even more personal result.
      </P>
      <Callout type="info" title="Ready to go deeper">
        Read <A href="/docs/studio">the studio</A> for every option, or jump to{" "}
        <A href="/tutorials/best-ai-images">making the best AI images</A>.
      </Callout>
    </Page>
  );
}
