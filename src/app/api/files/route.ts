import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromToken } from "@/lib/supabase";
import { getSessionToken } from "@/lib/session";

async function extractText(name: string, buffer: Buffer): Promise<string> {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) {
    try {
      // pdf-parse export shape varies by version — handle both.
      const mod: any = await import("pdf-parse");
      const pdfParse = mod.default ?? mod;
      const data = await pdfParse(buffer);
      return data.text || "";
    } catch {
      return "";
    }
  }
  // text, markdown, csv, etc.
  return buffer.toString("utf-8").slice(0, 200_000);
}

export async function POST(request: Request) {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const textContent = await extractText(file.name, buffer);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      name: file.name,
      content_type: file.type || "application/octet-stream",
      size_bytes: buffer.length,
      text_content: textContent,
    })
    .select("id,name,content_type,size_bytes,created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, document: data });
}

export async function GET() {
  const token = await getSessionToken();
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("documents")
    .select("id,name,content_type,size_bytes,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ documents: data });
}
