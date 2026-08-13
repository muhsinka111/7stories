import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";

/**
 * /api/characters — save and reuse AI characters (a reference face) across stories.
 * GET: list the signed-in user's saved characters.
 * POST: save a new character { name, imageUrl }.
 * DELETE ?id=: remove a character.
 */
export async function GET() {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("characters")
    .select("id,name,image_url,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, characters: data ?? [] });
}

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

  const name = String(body?.name ?? "").trim();
  const imageUrl = String(body?.imageUrl ?? "").trim();
  if (!name || !imageUrl) return NextResponse.json({ error: "name_and_image_required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("characters")
    .insert({ user_id: user.id, name, image_url: imageUrl })
    .select("id,name,image_url")
    .single();
  if (error) return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, character: data });
}

export async function DELETE(request: Request) {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("characters").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
