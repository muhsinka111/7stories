import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const patch: Record<string, any> = {};
  if (typeof body.status === "string") patch.status = body.status;
  if (typeof body.title === "string") patch.title = body.title;
  if (typeof body.story === "object" && body.story) patch.story = body.story;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("stories")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
