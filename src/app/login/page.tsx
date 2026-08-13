import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Sign in — 7stories" };

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[--accent] to-[--accent-2] grid place-items-center font-black text-white text-lg">
          7
        </span>
        <span className="text-lg font-bold tracking-tight">7stories</span>
      </Link>
      <AuthForm />
      <Link href="/" className="mt-8 text-sm text-[--muted] hover:text-[--ink]">
        ← Back to home
      </Link>
    </main>
  );
}
