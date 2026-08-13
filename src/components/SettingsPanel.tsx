"use client";

import { useEffect, useState } from "react";

export default function SettingsPanel() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user ?? null);
        setCredits(d.credits ?? null);
        setPlan(d.plan ?? "free");
      })
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto card p-8 mt-10 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-2xl font-black mb-2">Log in to manage your settings</h2>
        <p className="text-[--muted]">
          Create a free account to save your work, upload documents, and unlock your plan.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-black tracking-tight mb-1">Settings</h2>
      <p className="text-[--muted] mb-8">Manage your account and plan.</p>

      {/* Account */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold mb-4">Account</h3>
        <div className="flex items-center justify-between border-b border-[--border] pb-3 mb-3">
          <span className="text-[--muted]">Email</span>
          <span className="font-medium">{user.email}</span>
        </div>
        <div className="flex items-center justify-between border-b border-[--border] pb-3 mb-3">
          <span className="text-[--muted]">Plan</span>
          <span className="chip capitalize">{plan}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[--muted]">Credits remaining</span>
          <span className="font-semibold">⚡ {credits ?? "—"}</span>
        </div>
      </div>

      {/* Credits & plan */}
      <div className="card p-6">
        <h3 className="font-bold mb-2">Credits & plan</h3>
        <p className="text-sm text-[--muted] mb-4">
          Every generation uses credits — text costs a few, images and films cost more.
          Buy a pack or upgrade to a plan for monthly credits.
        </p>
        <a href="/credits" className="btn btn-primary justify-center w-full md:w-auto">
          ⚡ Buy credits & view plans
        </a>
      </div>
    </div>
  );
}
