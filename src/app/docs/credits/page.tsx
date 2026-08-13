import type { Metadata } from "next";
import { Page, Meta, H2, P, Ul, Li, Callout, A, Table } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "Credits & pricing — 7stories",
  description: "How credits work in 7stories, what each generation costs, and how to buy credit packs or plans.",
};

export default function Credits() {
  return (
    <Page>
      <Meta
        kicker="Billing"
        title="Credits & pricing"
        lede="Every generation uses credits. Here’s how they work and what things cost."
      />
      <H2>What costs what</H2>
      <Table
        head={["Output", "Credits used"]}
        rows={[
          ["Text story", "2–10 (depends on language model)"],
          ["Add a cover image", "+5"],
          ["Add a video film", "+25"],
          ["Both image + video", "+30 or more"],
        ]}
      />
      <P>
        You always see your remaining balance in the top bar of the dashboard. Generation
        requires enough credits — if you run out, you’ll be prompted to buy more.
      </P>
      <H2>Starting balance & plans</H2>
      <Ul>
        <Li>New accounts start with <strong>50 free credits</strong>.</Li>
        <Li>Plans add monthly credits: <strong>Pro</strong> (1,000/mo) and <strong>Studio</strong> (5,000/mo).</Li>
        <Li>Need a top-up? Buy a <strong>credit pack</strong>: 100, 500, or 2,000 credits.</Li>
      </Ul>
      <Callout type="info" title="Buy credits">
        Head to the <A href="/credits">pricing page</A> to see plans and packs. Payments are
        being set up — orders are recorded and credited once checkout is live.
      </Callout>
      <H2>Why credits?</H2>
      <P>
        Credits keep generation fair and sustainable — every AI image and film costs real money
        on the model APIs. Credits simply map your usage to what it actually costs to create.
      </P>
    </Page>
  );
}
