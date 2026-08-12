-- 7stories database schema — run this in your Supabase SQL editor.
-- Provides authenticated persistence for stories (replaces browser-local storage).

-- ── Profiles (one row per authenticated user) ────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free',           -- free | pro
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Stories ──────────────────────────────────────────────────
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  audience text not null default 'brand',
  plot_key text not null,
  title text not null,
  facts text,
  tone text,
  asset_mode text not null default 'text',      -- text | image | video | both
  status text not null default 'draft',         -- draft | published
  story jsonb not null default '{}'::jsonb,     -- full GeneratedStory incl. assets
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.stories enable row level security;

create index if not exists stories_user_id_idx on public.stories (user_id);
create index if not exists stories_created_idx on public.stories (created_at desc);

create policy "Users can read own stories"
  on public.stories for select using (auth.uid() = user_id);
create policy "Users can insert own stories"
  on public.stories for insert with check (auth.uid() = user_id);
create policy "Users can update own stories"
  on public.stories for update using (auth.uid() = user_id);
create policy "Users can delete own stories"
  on public.stories for delete using (auth.uid() = user_id);

-- Auto-update updated_at on edit.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists stories_touch_updated on public.stories;
create trigger stories_touch_updated
  before update on public.stories
  for each row execute procedure public.touch_updated_at();
