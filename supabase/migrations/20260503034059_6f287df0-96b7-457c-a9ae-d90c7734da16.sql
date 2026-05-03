
-- Roles enum
create type public.app_role as enum ('admin', 'moderator', 'user');

-- user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- has_role security definer function
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- RLS on user_roles
create policy "Users can view their own roles"
on public.user_roles for select
using (auth.uid() = user_id);

create policy "Admins can view all roles"
on public.user_roles for select
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
on public.user_roles for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Extend bookings policies for admins
create policy "Admins can view all bookings"
on public.bookings for select
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update bookings"
on public.bookings for update
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete bookings"
on public.bookings for delete
using (public.has_role(auth.uid(), 'admin'));

-- Extend inquiries policies for admins
create policy "Admins can view all inquiries"
on public.inquiries for select
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update inquiries"
on public.inquiries for update
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete inquiries"
on public.inquiries for delete
using (public.has_role(auth.uid(), 'admin'));

-- Admins can view all profiles
create policy "Admins can view all profiles"
on public.profiles for select
using (public.has_role(auth.uid(), 'admin'));
