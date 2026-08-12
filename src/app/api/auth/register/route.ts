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
  if (!email || password.length < 6) {
    return NextResponse.json({ error: "email and password (min 6 chars) required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  // signUp may return a session immediately, or only after email confirmation.
  if (data.session) {
    await setSessionCookie(data.session.access_token);
  }
  return NextResponse.json({ ok: true, user: data.user, needsConfirmation: !data.session });
}
