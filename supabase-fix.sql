-- Drop the recursive policy and replace with a simpler one
drop policy if exists "Members can view group members" on group_members;

-- Simple fix: a user can see group_members rows if they share that group_id
-- Use a security definer function to avoid recursion
create or replace function public.is_group_member(gid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from group_members
    where group_id = gid and user_id = auth.uid()
  );
$$;

create policy "Members can view group members" on group_members for select
  using (public.is_group_member(group_id));
