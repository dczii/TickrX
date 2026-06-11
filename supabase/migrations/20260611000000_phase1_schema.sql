-- Phase 1: core schema, RLS, and auto-portfolio trigger

create extension if not exists "pgcrypto";

-- profiles -------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- portfolios -----------------------------------------------------------
create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cash_balance numeric(14, 2) not null default 100000.00,
  starting_balance numeric(14, 2) not null default 100000.00,
  created_at timestamptz not null default now()
);

create unique index portfolios_user_id_key on public.portfolios (user_id);

alter table public.portfolios enable row level security;

create policy "portfolios_select_own" on public.portfolios
  for select using (auth.uid() = user_id);

create policy "portfolios_update_own" on public.portfolios
  for update using (auth.uid() = user_id);

-- holdings -------------------------------------------------------------
create table public.holdings (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios (id) on delete cascade,
  symbol text not null,
  quantity numeric(18, 6) not null check (quantity >= 0),
  avg_cost numeric(14, 4) not null check (avg_cost >= 0),
  updated_at timestamptz not null default now(),
  unique (portfolio_id, symbol)
);

alter table public.holdings enable row level security;

create policy "holdings_select_own" on public.holdings
  for select using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

-- trades ---------------------------------------------------------------
create table public.trades (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios (id) on delete cascade,
  symbol text not null,
  side text not null check (side in ('buy', 'sell')),
  order_type text not null default 'market' check (order_type in ('market', 'limit')),
  quantity numeric(18, 6) not null check (quantity > 0),
  price numeric(14, 4) not null check (price > 0),
  executed_at timestamptz not null default now()
);

alter table public.trades enable row level security;

create policy "trades_select_own" on public.trades
  for select using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

-- watchlists -----------------------------------------------------------
create table public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  symbol text not null,
  added_at timestamptz not null default now(),
  unique (user_id, symbol)
);

alter table public.watchlists enable row level security;

create policy "watchlists_select_own" on public.watchlists
  for select using (auth.uid() = user_id);

create policy "watchlists_insert_own" on public.watchlists
  for insert with check (auth.uid() = user_id);

create policy "watchlists_delete_own" on public.watchlists
  for delete using (auth.uid() = user_id);

-- signup trigger: profile + $100,000 portfolio --------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.portfolios (user_id, cash_balance, starting_balance)
  values (new.id, 100000.00, 100000.00);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
