import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — 7stories" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-[--muted] hover:text-[--ink]">← Back to 7stories</Link>
        <h1 className="text-3xl font-black tracking-tight mt-8 mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-sm text-[--muted] leading-relaxed">
          <p><strong className="text-[--ink]">1. What we collect.</strong> Account details (email), stories you create, documents and photos you upload for generation, and basic usage data.</p>
          <p><strong className="text-[--ink]">2. How we use it.</strong> To provide generation features, save your library, improve the product, and (with your consent) send product updates.</p>
          <p><strong className="text-[--ink]">3. Third parties.</strong> Story generation uses OpenAI; image/video generation uses FAL.ai (and providers they support). Your inputs are sent to these providers solely to generate output.</p>
          <p><strong className="text-[--ink]">4. Data storage.</strong> Data is stored securely (Supabase/Postgres). We keep your content only as long as your account exists.</p>
          <p><strong className="text-[--ink]">5. Analytics.</strong> We may use privacy-respecting analytics (e.g. Plausible) to understand usage. You can opt out via browser settings.</p>
          <p><strong className="text-[--ink]">6. Your rights.</strong> You can access, correct, export, or delete your data by contacting us or deleting your account.</p>
          <p><strong className="text-[--ink]">7. Contact.</strong> For privacy questions, contact support at the email listed on the site.</p>
          <p className="text-[--muted]/70">Last updated: August 2026.</p>
        </div>
      </div>
    </main>
  );
}
