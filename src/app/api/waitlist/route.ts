import { NextResponse } from "next/server";

/**
 * POST /api/waitlist
 * Captures a beta waitlist signup.
 *
 * Currently validates + acknowledges and logs. When Supabase env vars are set,
 * this persists the row to the `waitlist` table and (optionally) fires a
 * Resend welcome email. See src/lib/waitlist.ts.
 */
export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const { recordWaitlist } = await import("@/lib/waitlist");
  const saved = await recordWaitlist(email);

  if (!saved) {
    // Storage not configured yet — still treat as accepted for the waitlist UI.
    console.log("[waitlist] (storage unconfigured) email:", email);
  }

  return NextResponse.json({ ok: true });
}
