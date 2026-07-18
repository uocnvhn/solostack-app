-- Bảng profiles: 1 dòng cho mỗi user, tự tạo khi họ đăng ký (xem trigger cuối file)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Bảng subscriptions: mỗi dòng là 1 SaaS subscription phát hiện được của 1 user
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  category text not null,
  monthly_cost numeric(10, 2) not null,
  renewal_date date not null,
  trial_ends_at date,
  duplicate_group text,
  created_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on subscriptions for delete
  using (auth.uid() = user_id);

-- Trigger: tự động thêm 1 dòng vào profiles ngay khi có user mới đăng ký qua Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
