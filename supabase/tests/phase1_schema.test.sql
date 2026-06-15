-- Run with: supabase test db
begin;

create extension if not exists pgtap with schema extensions;

select plan(8);

-- seed two users; the trigger should fire for each
insert into auth.users (id, email, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000001', 'alice@example.com', '{"name": "Alice"}'::jsonb),
  ('00000000-0000-0000-0000-000000000002', 'bob@example.com', '{"name": "Bob"}'::jsonb);

-- trigger: profile created
select is(
  (select count(*)::int from public.profiles where id = '00000000-0000-0000-0000-000000000001'),
  1,
  'signup trigger creates a profile row'
);

-- trigger: portfolio created with $100,000
select is(
  (select count(*)::int from public.portfolios where user_id = '00000000-0000-0000-0000-000000000001'),
  1,
  'signup trigger creates a portfolio row'
);

select is(
  (select cash_balance from public.portfolios where user_id = '00000000-0000-0000-0000-000000000001'),
  100000.00::numeric(14,2),
  'portfolio starts with $100,000 cash'
);

select is(
  (select starting_balance from public.portfolios where user_id = '00000000-0000-0000-0000-000000000001'),
  100000.00::numeric(14,2),
  'portfolio records $100,000 starting balance'
);

-- RLS: alice sees only her own portfolio
set local role authenticated;
set local request.jwt.claims to '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}';

select is(
  (select count(*)::int from public.portfolios),
  1,
  'authenticated user sees exactly one portfolio'
);

select is(
  (select count(*)::int from public.portfolios where user_id = '00000000-0000-0000-0000-000000000002'),
  0,
  'user cannot read another user''s portfolio'
);

select is(
  (select count(*)::int from public.profiles where id = '00000000-0000-0000-0000-000000000002'),
  0,
  'user cannot read another user''s profile'
);

-- RLS: watchlist inserts are scoped to the caller
select throws_ok(
  $$insert into public.watchlists (user_id, symbol)
    values ('00000000-0000-0000-0000-000000000002', 'AAPL')$$,
  '42501',
  'new row violates row-level security policy for table "watchlists"',
  'user cannot insert a watchlist row for another user'
);

select * from finish();

rollback;
