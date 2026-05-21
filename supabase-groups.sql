-- ─────────────────────────────────────────
-- Money Buddy — Shared Groups Schema
-- Run this in Supabase → SQL Editor
-- ─────────────────────────────────────────

-- 1. Groups
create table if not exists groups (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  created_by  uuid references auth.users not null,
  created_at  timestamp with time zone default now()
);

-- 2. Group members (display name per user per group)
create table if not exists group_members (
  id           uuid default gen_random_uuid() primary key,
  group_id     uuid references groups on delete cascade not null,
  user_id      uuid references auth.users not null,
  display_name text not null,
  joined_at    timestamp with time zone default now(),
  unique(group_id, user_id)
);

-- 3. Group expenses
create table if not exists group_expenses (
  id               uuid default gen_random_uuid() primary key,
  group_id         uuid references groups on delete cascade not null,
  paid_by_user_id  uuid references auth.users not null,
  paid_by_name     text not null,
  description      text not null,
  category         text not null,
  sgd_amount       numeric not null,
  date             date not null,
  split_with       text[] not null default '{}',
  is_fcy           boolean default false,
  fcy_amt          numeric,
  fcy_cur          text,
  fcy_rate         numeric,
  notes            text,
  created_at       timestamp with time zone default now()
);

-- 4. Invite tokens
create table if not exists group_invites (
  id          uuid default gen_random_uuid() primary key,
  group_id    uuid references groups on delete cascade not null,
  token       text unique not null default encode(gen_random_bytes(16), 'hex'),
  created_by  uuid references auth.users not null,
  created_at  timestamp with time zone default now()
);

-- ── Row Level Security ──────────────────

alter table groups         enable row level security;
alter table group_members  enable row level security;
alter table group_expenses enable row level security;
alter table group_invites  enable row level security;

-- Groups
create policy "Members can view their groups" on groups for select
  using (exists (
    select 1 from group_members where group_id = id and user_id = auth.uid()
  ));
create policy "Auth users can create groups" on groups for insert
  with check (auth.uid() = created_by);
create policy "Creator can delete group" on groups for delete
  using (auth.uid() = created_by);

-- Group members
create policy "Members can view group members" on group_members for select
  using (exists (
    select 1 from group_members gm where gm.group_id = group_id and gm.user_id = auth.uid()
  ));
create policy "Users can join groups" on group_members for insert
  with check (auth.uid() = user_id);
create policy "Members can leave groups" on group_members for delete
  using (auth.uid() = user_id);

-- Group expenses
create policy "Members can view expenses" on group_expenses for select
  using (exists (
    select 1 from group_members where group_id = group_expenses.group_id and user_id = auth.uid()
  ));
create policy "Members can add expenses" on group_expenses for insert
  with check (
    auth.uid() = paid_by_user_id and
    exists (select 1 from group_members where group_id = group_expenses.group_id and user_id = auth.uid())
  );
create policy "Members can delete own expenses" on group_expenses for delete
  using (auth.uid() = paid_by_user_id);

-- Invites (anyone authed can read to join; only members can create)
create policy "Anyone authed can view invites" on group_invites for select
  using (auth.uid() is not null);
create policy "Members can create invites" on group_invites for insert
  with check (
    auth.uid() = created_by and
    exists (select 1 from group_members where group_id = group_invites.group_id and user_id = auth.uid())
  );
