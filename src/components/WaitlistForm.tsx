"use client";

import { useState } from "react";

/**
 * Waitlist capture form. In the MVP this posts to the app's own API route
 * (which persists to Supabase once configured). Until then it's wired to the
 * server route so we can attach real storage + email later.
 */
export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center py-4">
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-semibold">You&apos;re on the list.</p>
        <p className="text-sm text-[--muted]">
          We&apos;ll email you when the beta opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="flex-1 px-4 py-3"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary justify-center disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Join the beta"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400 sm:col-span-2">
          Something went wrong. Try again or email us directly.
        </p>
      )}
    </form>
  );
}
