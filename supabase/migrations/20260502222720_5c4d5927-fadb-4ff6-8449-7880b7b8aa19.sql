
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null unique,
  full_name text not null,
  company text,
  phone text not null,
  email text not null,
  service text not null,
  meeting_type text not null,
  preferred_date date not null,
  preferred_time text not null,
  notes text,
  status text not null default 'Pending',
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
create policy "bookings_select_own" on public.bookings for select using (auth.uid() = user_id);
create policy "bookings_insert_own" on public.bookings for insert with check (auth.uid() = user_id);

-- inquiries
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null unique,
  full_name text not null,
  company text,
  phone text not null,
  email text not null,
  service text not null,
  origin text,
  destination text,
  cargo_type text,
  weight text,
  budget text,
  urgency text,
  description text,
  file_url text,
  status text not null default 'Received',
  created_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;
create policy "inquiries_select_own" on public.inquiries for select using (auth.uid() = user_id);
create policy "inquiries_insert_own" on public.inquiries for insert with check (auth.uid() = user_id);

-- Public lookup of booking/inquiry by reference + email (for tracking)
create or replace function public.track_inquiry(_reference text, _email text)
returns table(reference text, service text, status text, created_at timestamptz, kind text)
language sql
stable
security definer
set search_path = public
as $$
  select reference, service, status, created_at, 'booking'::text as kind from public.bookings where reference = _reference and email = _email
  union all
  select reference, service, status, created_at, 'inquiry'::text as kind from public.inquiries where reference = _reference and email = _email
$$;

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
