import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";

export async function GET() {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ user: null });

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("profiles")
    .select("credits, plan")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    credits: data?.credits ?? 50,
    plan: data?.plan ?? "free",
  });
}
