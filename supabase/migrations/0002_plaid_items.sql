-- Bảng plaid_items: mỗi dòng là 1 kết nối ngân hàng ("Item" theo thuật ngữ Plaid) của 1 user
create table if not exists plaid_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  item_id text not null unique,
  access_token text not null,
  institution_name text,
  created_at timestamptz not null default now()
);

alter table plaid_items enable row level security;

create policy "Users can view own plaid items"
  on plaid_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own plaid items"
  on plaid_items for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own plaid items"
  on plaid_items for delete
  using (auth.uid() = user_id);
