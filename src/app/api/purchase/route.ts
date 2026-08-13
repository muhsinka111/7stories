import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";
import { getCreditPack } from "@/lib/credits";

/**
 * POST /api/purchase — record a credit-pack purchase intent.
 * Stripe checkout is wired in later; for now it stores a pending order that
 * an admin approves to grant credits. Auth required.
 */
export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const pack = getCreditPack(String(body?.packageKey ?? ""));
  if (!pack) return NextResponse.json({ error: "invalid_package" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("purchases").insert({
    user_id: user.id,
    package_key: pack.key,
    credits: pack.credits,
    amount_usd: pack.usd,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: "purchase_failed", message: error.message }, { status: 500 });
  }

  // No Stripe yet → tell the client payments are being set up, order recorded.
  return NextResponse.json({
    ok: true,
    credits: pack.credits,
    amountUsd: pack.usd,
    checkout: "stripe_coming_soon",
    message: `Order for ${pack.credits} credits recorded ($${pack.usd}). Payments are being set up — we'll credit your account shortly.`,
  });
}
