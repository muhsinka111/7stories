import type { Metadata } from "next";
import { Page, Meta, H2, H3, P, Ul, Li, Callout, A } from "@/components/DocUI";

export const metadata: Metadata = {
  title: "Account & library — 7stories",
  description: "Manage your 7stories account: sign in, save stories to your library, upload documents, and view your plan.",
};

export default function Account() {
  return (
    <Page>
      <Meta
        kicker="Account"
        title="Account & library"
        lede="Your account is where everything you create is saved and managed."
      />
      <H2>Sign in</H2>
      <P>
        Create a free account at <A href="/login">/login</A> with an email and password. You
        need an account to generate and save stories.
      </P>
      <H2>Your library</H2>
      <P>
        Every story you generate can be saved to your library in the dashboard. From there you
        can open, edit the status (draft / published), or delete any story.
      </P>
      <H2>Documents</H2>
      <P>
        Upload source documents (briefs, articles, notes) in the <strong>Account &amp; Files</strong>{" "}
        section. When you reference them while generating, 7stories uses their content as context
        for a more accurate story.
      </P>
      <H2>Plan & credits</H2>
      <P>
        Your plan and credit balance show in <strong>Settings</strong>. You can buy credit packs or
        upgrade to a plan on the <A href="/credits">pricing page</A>.
      </P>
      <H2>Analytics</H2>
      <P>
        Open <strong>Stats</strong> in the dashboard to see your totals, top categories, output
        types, and activity over the last 14 days.
      </P>
      <Callout type="tip" title="Getting started">
        New here? Start with the <A href="/docs/getting-started">getting-started guide</A>.
      </Callout>
    </Page>
  );
}
