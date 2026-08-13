import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service — 7stories" };

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-[--muted] hover:text-[--ink]">← Back to 7stories</Link>
        <h1 className="text-3xl font-black tracking-tight mt-8 mb-6">Terms of Service</h1>
        <div className="space-y-4 text-sm text-[--muted] leading-relaxed">
          <p><strong className="text-[--ink]">1. Service.</strong> 7stories provides AI-assisted story, image, and video generation. You are responsible for the content you generate and how you use it.</p>
          <p><strong className="text-[--ink]">2. Accounts.</strong> You must keep your login credentials secure. You are responsible for activity under your account.</p>
          <p><strong className="text-[--ink]">3. Acceptable use.</strong> Do not generate content that is illegal, harmful, or infringing. You must have rights to any material you upload as reference.</p>
          <p><strong className="text-[--ink]">4. Credits & payment.</strong> Features may be gated by credits or subscription plans. Credits and plans are non-transferable.</p>
          <p><strong className="text-[--ink]">5. AI output.</strong> AI-generated output may vary in quality and accuracy. 7stories is provided "as is" without warranties.</p>
          <p><strong className="text-[--ink]">6. Liability.</strong> To the maximum extent permitted by law, 7stories is not liable for indirect, incidental, or consequential damages.</p>
          <p><strong className="text-[--ink]">7. Changes.</strong> We may update these terms. Continued use after changes means you accept them.</p>
          <p className="text-[--muted]/70">Last updated: August 2026.</p>
        </div>
      </div>
    </main>
  );
}
