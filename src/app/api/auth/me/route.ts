import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";

export async function GET() {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: user.id, email: user.email } });
}
