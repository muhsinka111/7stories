import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  await setSessionCookie(data.session.access_token);
  return NextResponse.json({ ok: true, user: data.user });
}
