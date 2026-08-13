"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function BuyButton({
  packageKey,
  credits,
  usd,
  variant = "primary",
}: {
  packageKey: string;
  credits: number;
  usd: number;
  variant?: "primary" | "ghost";
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function buy() {
    setBusy(true);
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageKey }),
      });
      const data = await res.json();
      if (res.status === 401) {
        toast("Please sign in to buy credits.", "info");
        router.push("/login");
        return;
      }
      if (!res.ok) {
        toast(data.message || "Purchase failed.", "error");
        return;
      }
      toast(data.message || "Order recorded.");
    } catch {
      toast("Purchase failed. Try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={buy}
      disabled={busy}
      className={`w-full justify-center disabled:opacity-60 ${variant === "primary" ? "btn btn-primary" : "btn btn-ghost"}`}
    >
      {busy ? "Processing…" : `Buy ${credits} credits · $${usd}`}
    </button>
  );
}
