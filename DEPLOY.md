# Deploying 7stories to Railway

## Prerequisites
1. A Railway account + a paid/supported plan with **Private Networking** (so the Next.js app can read the service's own domain).
2. The repo pushed to GitHub (Railway deploys from a git repo, not a zip).
3. The three keys below, added as **service variables** in Railway.

## Required variables (Railway → your service → Variables)
| Variable | Why |
|----------|-----|
| `OPENAI_API_KEY` | Required. Any OpenAI-compatible key (OpenAI, OpenRouter, Together, Groq…). Powers `/api/generate`. |
| `OPENAI_BASE_URL` | Optional. Defaults to OpenAI. Set `https://openrouter.ai/api/v1` to use OpenRouter. |
| `OPENAI_MODEL` | Optional. Defaults to `gpt-4o-mini`. |
| `SUPABASE_URL` | Optional. Enables waitlist persistence. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional. Enables waitlist persistence (keep private, server-side only). |

> ⚠️ `NEXT_PUBLIC_*` vars are baked in at build time. Keep secrets (service role key, Stripe) **non-public**.

## One-time Supabase setup (waitlist)
Run this SQL in the Supabase SQL editor, then set the two `SUPABASE_*` vars:
```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
-- allow server-side inserts only (service role bypasses RLS)
```

## Deploy steps
```bash
cd /opt/data/7stories
git add -A && git commit -m "7stories MVP: 3D opener + 7-plot story generator + waitlist"
git remote add origin <your-github-repo-url>
git push -u origin main

# then in Railway dashboard:
# 1. New Project → Deploy from GitHub repo → pick it
# 2. Nixpacks auto-detects Next.js (railway.json included)
# 3. Add the Variables above
# 4. Railway assigns a public *.up.railway.app domain automatically
```

## Verify after deploy
- `GET /` → 200, cinematic opener loads
- `POST /api/generate` with a plotKey + facts → returns `{ ok: true, story }`
- `POST /api/waitlist` with an email → `{ ok: true }` (and a row in Supabase)

## Connect a custom domain
Railway → your service → **Settings → Networking** → add `7stories.com` as a custom domain. Point the DNS `CNAME` to the Railway domain Railway shows you.
