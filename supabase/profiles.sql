-- OBRIGATÓRIO: execute este SQL no Supabase (SQL Editor → New query → Run)
-- Sem isso, o onboarding não salva e o login não reconhece perfis existentes.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  username text not null,
  birth_date date not null,
  gender text not null,
  referral_code text,
  created_at timestamptz not null default now(),
  constraint profiles_username_unique unique (username),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,30}$')
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.is_username_available(check_username text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.profiles
    where lower(username) = lower(trim(both '@' from check_username))
  );
$$;

revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;
