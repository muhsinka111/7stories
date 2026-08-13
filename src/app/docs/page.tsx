import type { Metadata } from "next";
import { Page, Meta, CardGrid, DocCard, H2, P, A } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "Help & documentation — 7stories",
  description: "Guides and docs for 7stories: how to create your first story, use the studio, choose AI models, manage credits, and more.",
};

export default function DocsHome() {
  return (
    <Page>
      <Meta
        kicker="Documentation"
        title="Help & docs"
        lede="Everything you need to get the most out of 7stories — from your first story to advanced image and video techniques."
      />
      <CardGrid>
        <DocCard href="/docs/getting-started" tag="Start here" title="Getting started" desc="Create your first AI story in under 5 minutes." />
        <DocCard href="/docs/studio" tag="Guide" title="The studio" desc="Every step explained — categories, styles, formats, reference photos, and engines." />
        <DocCard href="/docs/models" tag="Reference" title="AI models" desc="Which image, video, and language models to pick — and what they cost in credits." />
        <DocCard href="/docs/credits" tag="Billing" title="Credits & pricing" desc="How credits work, what each generation costs, and how to buy more." />
        <DocCard href="/docs/account" tag="Account" title="Account & library" desc="Signing in, saving stories, uploading documents, and managing your plan." />
        <DocCard href="/docs/faq" tag="Answers" title="FAQ" desc="Quick answers to the most common questions." />
      </CardGrid>
      <div>
        <H2>Level up</H2>
        <P>
          Want to make genuinely great images and films? Browse the{" "}
          <A href="/tutorials">tutorials</A> — practical, step-by-step guides for the best
          AI images, cinematic videos, consistent characters, and more.
        </P>
      </div>
    </Page>
  );
}
