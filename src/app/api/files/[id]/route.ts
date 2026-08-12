import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
