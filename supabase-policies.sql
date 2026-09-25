-- Run this once in Supabase Dashboard -> SQL Editor.
-- This app currently uses the public anon key and does not require sign-in.

alter table public.questions enable row level security;

drop policy if exists "Public can read questions" on public.questions;
create policy "Public can read questions"
on public.questions
for select
to anon, authenticated
using (true);

drop policy if exists "Public can create questions" on public.questions;
create policy "Public can create questions"
on public.questions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can vote on questions" on public.questions;
create policy "Public can vote on questions"
on public.questions
for update
to anon, authenticated
using (true)
with check (true);
