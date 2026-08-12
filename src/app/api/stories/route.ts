import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";

export async function GET() {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ stories: data });
}

export async function POST(request: Request) {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { audience, plotKey, title, facts, tone, assetMode, status, story } = body ?? {};
  if (!plotKey || !title || !story) {
    return NextResponse.json({ error: "plotKey, title, story required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("stories")
    .insert({
      user_id: user.id,
      audience: audience ?? "brand",
      plot_key: plotKey,
      title,
      facts: facts ?? "",
      tone: tone ?? null,
      asset_mode: assetMode ?? "text",
      status: status ?? "draft",
      story,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, story: data });
}
