"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(data.error || "Something went wrong.");
      return;
    }
    if (data.needsConfirmation) {
      setMsg("Check your email to confirm your account, then log in.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="max-w-sm w-full mx-auto card p-8">
      <h1 className="text-2xl font-black mb-1">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="text-sm text-[--muted] mb-6">
        {mode === "login"
          ? "Log in to your 7stories studio."
          : "Sign up free — save stories, upload documents, and generate."}
      </p>

      <form onSubmit={submit} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="Email"
          className="w-full px-4 py-3"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6)"
          className="w-full px-4 py-3"
        />
        <button disabled={busy} className="btn btn-primary w-full justify-center disabled:opacity-60">
          {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      {msg && <p className="mt-4 text-sm text-[--accent]">{msg}</p>}

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-5 text-sm text-[--muted] hover:text-[--ink]"
      >
        {mode === "login" ? "No account? Create one" : "Have an account? Log in"}
      </button>
    </div>
  );
}
