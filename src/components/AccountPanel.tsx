"use client";

import { useCallback, useEffect, useState } from "react";

interface Doc {
  id: string;
  name: string;
  content_type?: string;
  size_bytes?: number;
  created_at: string;
}

export default function AccountPanel() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [selDoc, setSelDoc] = useState<string>("");

  const refresh = useCallback(async () => {
    const me = await fetch("/api/auth/me").then((r) => r.json());
    if (me?.user) {
      setUser(me.user);
      const res = await fetch("/api/files").then((r) => r.json());
      setDocs(res.documents ?? []);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthMsg(null);
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthMsg(data.error || "Something went wrong.");
      return;
    }
    if (data.needsConfirmation) {
      setAuthMsg("Check your email to confirm your account, then log in.");
      return;
    }
    setAuthMsg("Logged in ✓");
    await refresh();
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/files", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) setUploadMsg(data.error || "Upload failed.");
    else setUploadMsg("Uploaded ✓");
    await refresh();
    e.target.value = "";
  }

  async function deleteDoc(id: string) {
    await fetch(`/api/files/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDocs([]);
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto card p-8 mt-10">
        <h2 className="text-2xl font-black mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-sm text-[--muted] mb-6">
          {mode === "login"
            ? "Log in to keep your files and generations in the cloud."
            : "Sign up to save your work and upload context documents."}
        </p>
        <form onSubmit={submitAuth} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email" className="w-full px-4 py-3" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} placeholder="Password (min 6)" className="w-full px-4 py-3" />
          <button className="btn btn-primary w-full justify-center" type="submit">
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
        {authMsg && <p className="mt-4 text-sm text-[--accent]">{authMsg}</p>}
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-5 text-sm text-[--muted] hover:text-[--ink]">
          {mode === "login" ? "No account? Create one" : "Have an account? Log in"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Account & Files</h2>
          <p className="text-[--muted] mt-1">{user.email}</p>
        </div>
        <button onClick={logout} className="btn btn-ghost">Log out</button>
      </div>

      {/* Upload */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold mb-1">Upload context documents</h3>
        <p className="text-sm text-[--muted] mb-4">
          Add PDFs, notes, or text — 7stories reads them and uses them as the context for your stories.
        </p>
        <label className="btn btn-primary cursor-pointer inline-flex">
          {uploading ? "Uploading…" : "📄 Choose a file"}
          <input type="file" accept=".pdf,.txt,.md,.csv,.json" onChange={uploadFile} className="hidden" />
        </label>
        {uploadMsg && <p className="mt-3 text-sm text-[--accent]">{uploadMsg}</p>}
      </div>

      {/* My documents */}
      <div className="card p-6">
        <h3 className="font-bold mb-4">My files ({docs.length})</h3>
        {docs.length === 0 ? (
          <p className="text-sm text-[--muted]">No files yet. Upload one above.</p>
        ) : (
          <ul className="space-y-2">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center gap-3 border border-[--border] rounded-lg px-4 py-3">
                <span>📄</span>
                <span className="font-medium truncate flex-1">{d.name}</span>
                <button
                  onClick={() => setSelDoc(selDoc === d.id ? "" : d.id)}
                  className="text-xs text-[--accent] hover:underline"
                >
                  {selDoc === d.id ? "Using ✓" : "Use as context"}
                </button>
                <button onClick={() => deleteDoc(d.id)} className="text-xs text-red-400/80 hover:text-red-400">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        {selDoc && (
          <p className="mt-4 text-xs text-[--muted] border border-[--accent]/30 bg-[--accent]/10 rounded-lg px-4 py-3">
            Selected as context. In the studio, paste your story prompt and this document will be read to ground your generation.
          </p>
        )}
      </div>
    </div>
  );
}
