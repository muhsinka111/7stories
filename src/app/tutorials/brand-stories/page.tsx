import type { Metadata } from "next";
import { Page, Meta, H2, P, Ul, Li, Ol, Callout, A } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "Brand & customer stories that sell — 7stories",
  description: "Turn happy customers and product wins into compelling, on-brand story assets with 7stories. A recipe for founders and marketers.",
};

export default function BrandStories() {
  return (
    <Page>
      <Meta
        kicker="Tutorial · Business"
        title="Brand & customer stories that sell"
        lede="People buy stories, not features. Here's how to turn a customer win or product milestone into a cinematic asset."
      />
      <H2>What makes a brand story work</H2>
      <Ul>
        <Li>A <strong>real customer</strong> with a real before → after.</Li>
        <Li>A specific <strong>moment</strong>, not a vague claim.</Li>
        <Li>A <strong>feeling</strong> (relief, joy, pride) more than features.</Li>
      </Ul>
      <H2>The recipe in 7stories</H2>
      <Ol>
        <li>Choose the <strong>Brand</strong> or <strong>Product</strong> category.</li>
        <li>Set tone to <strong>Bold</strong> or <strong>Warm</strong> in step 11.</li>
        <li>In "What happened?", write the customer's real journey — where they started, the obstacle, and the outcome.</li>
        <li>Pick <strong>Cinematic</strong> style + <strong>Both</strong> output for an image and a shareable film.</li>
        <li>Upload a product photo or brand visual as a reference in step 6.</li>
      </Ol>
      <Callout type="tip" title="Before → after beats features">
        "A bakery that used to bake 200 loaves now handles 2,000 orders — here's how." beats
        "We offer scalable production." Real numbers and real people win.
      </Callout>
      <H2>Where to use them</H2>
      <Ul>
        <Li><strong>Landing pages</strong> — a customer story under your hero builds trust.</Li>
        <Li><strong>Social</strong> — the video film is ready for Reels/TikTok/Shorts.</Li>
        <Li><strong>Pitch decks</strong> — a cinematic case study beats a bullet list.</Li>
      </Ul>
      <Callout type="info" title="Related">
        Get the words right with the <A href="/tutorials/prompt-guide">prompt guide</A>, then
        make it a film with <A href="/tutorials/best-ai-videos">best AI videos</A>.
      </Callout>
    </Page>
  );
}
