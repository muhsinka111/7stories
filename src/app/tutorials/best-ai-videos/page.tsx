import type { Metadata } from "next";
import { Page, Meta, H2, P, Ul, Li, Callout, A } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "How to make the best AI videos — 7stories",
  description: "A guide to cinematic AI films in 7stories: start from an image, describe motion, pick the video engine, and choose the right resolution.",
};

export default function BestAiVideos() {
  return (
    <Page>
      <Meta
        kicker="Tutorial · Video"
        title="How to make the best AI videos"
        lede="The difference between a forgettable clip and a cinematic film comes down to four choices. Here they are."
      />
      <H2>1. Start from a strong image</H2>
      <P>
        The best AI videos are <em>image-to-video</em>. Upload a great reference photo or
        generate a cover image first, then use it as the opening frame. A clear, well-composed
        start frame gives the video direction.
      </P>
      <Callout type="tip" title="How in 7stories">
        In the studio, upload a photo (step 6) and pick <strong>+ Video</strong> or{" "}
        <strong>Both</strong> (step 7). The first photo becomes the video's opening frame.
      </Callout>
      <H2>2. Describe motion, not just the scene</H2>
      <P>
        Tell the video engine what moves and how. "The camera slowly pushes in… the flag
        waves… the couple turns toward the light." Motion words (pan, zoom, drift, fade, turn)
        matter more than adjectives.
      </P>
      <H2>3. Pick the video engine</H2>
      <Ul>
        <Li><strong>Sora 2</strong> (default) — strong, expressive motion.</Li>
        <Li><strong>Veo 3</strong> — premium cinematic realism.</Li>
        <Li><strong>Seedance 2.5</strong> — advanced control and quality.</Li>
        <Li><strong>Kling 1.6</strong> — great motion and character detail.</Li>
      </Ul>
      <P>
        Want the <em>same person</em> across multiple scenes? That's the{" "}
        <A href="/tutorials/consistent-characters">consistent-characters workflow</A>.
      </P>
      <H2>4. Choose resolution</H2>
      <P>
        In step 13, pick <strong>720p</strong> for speed (cheaper, good for drafts),{" "}
        <strong>1080p</strong> for final social posts, or <strong>4K</strong> for large screens
        and advertising. Higher resolution costs more credits.
      </P>
      <H2>5. Regenerate until it moves right</H2>
      <P>
        Video is stochastic — the first take isn't always perfect. Use{" "}
        <strong>🎲 Regenerate</strong> to get fresh takes on the same prompt until one matches
        your vision.
      </P>
      <Callout type="info" title="Related">
        See <A href="/docs/models">AI models</A> for engine details, or the{" "}
        <A href="/tutorials/prompt-guide">prompt guide</A>.
      </Callout>
    </Page>
  );
}
