import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";

/**
 * GET /api/stats — aggregate the signed-in user's usage analytics.
 * Returns totals, breakdowns by category/output, activity over 14 days,
 * recent stories, documents count, and credit balance.
 */
export async function GET() {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data: rawStories } = await supabase
    .from("stories")
    .select("id,title,category,asset_mode,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const stories = rawStories ?? [];

  const { count: documents = 0 } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: prof } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .maybeSingle();

  const total = stories.length;
  const byCategory: Record<string, number> = {};
  const byType: Record<string, number> = { text: 0, image: 0, video: 0, both: 0 };
  const byDay: Record<string, number> = {};
  const now = new Date();

  for (const s of stories) {
    byCategory[s.category || "other"] = (byCategory[s.category || "other"] || 0) + 1;
    const t = (s.asset_mode || "text") as string;
    if (t in byType) byType[t]++;
    const d = new Date(s.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    byDay[key] = (byDay[key] || 0) + 1;
  }

  // Last 14 days, most recent first.
  const last14: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    last14.push({ date: key, count: byDay[key] || 0 });
  }

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const mediaCount = byType.image + byType.video + byType.both;

  return NextResponse.json({
    ok: true,
    total,
    mediaCount,
    topCategory,
    byCategory,
    byType,
    last14,
    recent: (stories.slice(0, 6) || []).map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      assetMode: s.asset_mode,
      createdAt: s.created_at,
    })),
    documents,
    credits: prof?.credits ?? 0,
  });
}
