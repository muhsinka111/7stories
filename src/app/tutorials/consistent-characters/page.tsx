import type { Metadata } from "next";
import { Page, Meta, H2, P, Ul, Li, Ol, Callout, A, Step } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "Consistent characters across scenes — 7stories",
  description: "Keep the same person looking identical across every AI scene. The Nano Banana → video-engine workflow, built into 7stories.",
};

export default function ConsistentCharacters() {
  return (
    <Page>
      <Meta
        kicker="Tutorial · Pro"
        title="Consistent characters across scenes"
        lede="The #1 question in AI video: keep the same person looking identical in every shot. Here's the workflow — built into 7stories."
      />
      <P>
        Generic text-to-video changes the subject between shots. The fix is a two-step pipeline:
        create a <strong>consistent character image</strong> first, then turn it into video. Two
        image engines are specifically great at character consistency: <strong>Nano Banana</strong>{" "}
        (Gemini 2.5 Flash) and <strong>Seedream 4.5</strong>.
      </P>
      <H2>The workflow</H2>
      <Ol>
        <li>
          <strong>Upload one clear photo</strong> of your subject in step 6. Face the camera,
          good light, full head and shoulders.
        </li>
        <li>
          <strong>Pick Nano Banana or Seedream</strong> as the image engine (step 8).
        </li>
        <li>
          <strong>Choose + Video or Both</strong> in step 7, and a video engine (step 9) —
          Veo, Kling, or Sora all work well.
        </li>
        <li>
          <strong>Describe the scene</strong> in step 5, keeping the same person's identity in
          the words ("the same young woman…").
        </li>
        <li>
          <strong>Generate.</strong> Because the reference photo anchors the subject, the image
          and the video's opening frame share the same face.
        </li>
      </Ol>
      <Callout type="tip" title="Why this works">
        Nano Banana and Seedream are trained to hold a subject's identity when given a reference.
        Using that image as the video's start frame carries the identity into the film.
      </Callout>
      <H2>Tips for consistency</H2>
      <Ul>
        <Li>Use one <strong>clear, high-resolution</strong> reference photo — not a group shot.</Li>
        <Li>Keep <strong>hair, clothing, and setting</strong> described the same way across scenes.</Li>
        <Li>For a multi-scene reel, generate one image per scene from the same reference, then animate each.</Li>
      </Ul>
      <Callout type="info" title="Related">
        New to prompts? Read the <A href="/tutorials/prompt-guide">prompt guide</A>. Picking an
        engine? See <A href="/docs/models">AI models</A>.
      </Callout>
    </Page>
  );
}
