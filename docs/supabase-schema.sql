-- ============================================================
-- Budget ni Pot — Supabase schema
-- Paste into Supabase Dashboard → SQL Editor → New query → Run.
--
-- Data is scoped per Supabase Auth user. If the app has no login yet,
-- enable anonymous sign-ins under Authentication → Providers → Anonymous.
-- ============================================================

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

-- 2. Wallets ---------------------------------------------------
create table if not exists public.accounts (
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  account_id text not null check (account_id in ('gcash', 'cash')),
  name text not null,
  starting_balance numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, account_id)
);

-- 3. Categories ------------------------------------------------
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

-- 4. Transactions ----------------------------------------------
create table if not exists public.transactions (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  kind text not null check (kind in ('expense', 'income')),
  account_id text not null check (account_id in ('gcash', 'cash')),
  amount numeric(12, 2) not null check (amount > 0),
  category_id text not null,
  note text not null default '',
  date date not null,
  created_at timestamptz not null default now(),
  constraint transactions_category_fk
    foreign key (user_id, category_id)
    references public.categories (user_id, id) on delete cascade
);

-- 5. Indexes ---------------------------------------------------
create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc);

create index if not exists transactions_user_category_idx
  on public.transactions (user_id, category_id);

-- 6. updated_at triggers ---------------------------------------
drop trigger if exists accounts_set_updated_at on public.accounts;
create trigger accounts_set_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- 7. Row Level Security ----------------------------------------
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

drop policy if exists accounts_own on public.accounts;
create policy accounts_own on public.accounts
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

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

-- 8. Create the two wallets for every new user -----------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.accounts (user_id, account_id, name, starting_balance)
  values
    (new.id, 'gcash', 'GCash', 0),
    (new.id, 'cash', 'Cash', 0)
  on conflict (user_id, account_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill wallets for users that already exist.
insert into public.accounts (user_id, account_id, name, starting_balance)
select id, 'gcash', 'GCash', 0 from auth.users
union all
select id, 'cash', 'Cash', 0 from auth.users
on conflict (user_id, account_id) do nothing;
