-- ============================================================
-- Budget ni Pot — Supabase schema
-- Stores category budgets + income/expense transactions per user.
-- No wallet/account table.
--
-- Paste into Supabase Dashboard → SQL Editor → New query → Run.
-- If the app has no login screen, enable anonymous sign-ins under
-- Authentication → Providers → Anonymous, then sign in anonymously.
-- ============================================================

-- Only run this cleanup block if you already ran the earlier schema
-- that included public.accounts:
--
-- drop table if exists public.transactions cascade;
-- drop table if exists public.categories cascade;
-- drop table if exists public.accounts cascade;

create extension if not exists pgcrypto;

-- 1. Shared updated_at trigger ---------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Categories + monthly budgets -------------------------------
create table if not exists public.categories (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  emoji text not null default '🌿',
  color text not null default '#bfe3c8',
  kind text not null check (kind in ('expense', 'income')),
  monthly_budget numeric(12, 2) not null default 0
    check (monthly_budget >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id)
);

create unique index if not exists categories_user_name_idx
  on public.categories (user_id, lower(name));

-- 3. Income and expenses --------------------------------------
create table if not exists public.transactions (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  kind text not null check (kind in ('expense', 'income')),
  amount numeric(12, 2) not null check (amount > 0),
  category_id text not null,
  note text not null default '',
  date date not null,
  created_at timestamptz not null default now(),
  constraint transactions_category_fk
    foreign key (user_id, category_id)
    references public.categories (user_id, id) on delete cascade
);

-- 4. Indexes ---------------------------------------------------
create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc);

create index if not exists transactions_user_category_idx
  on public.transactions (user_id, category_id);

create index if not exists transactions_user_kind_idx
  on public.transactions (user_id, kind);

-- 5. updated_at trigger ---------------------------------------
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- 6. Row Level Security ----------------------------------------
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

drop policy if exists categories_own on public.categories;
create policy categories_own on public.categories
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists transactions_own on public.transactions;
create policy transactions_own on public.transactions
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
