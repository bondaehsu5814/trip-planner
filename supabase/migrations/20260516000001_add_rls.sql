-- Migration 002: Row Level Security
-- This app has no auth system (Ben/Kelly private use).
-- Policies explicitly grant anon role full access.
-- To add user-based auth later: replace `true` with `auth.uid() = ...`

alter table trips              enable row level security;
alter table trip_configs       enable row level security;
alter table bookings           enable row level security;
alter table inspiration_items  enable row level security;

-- trips
create policy "anon_select_trips"  on trips for select using (true);
create policy "anon_insert_trips"  on trips for insert with check (true);
create policy "anon_update_trips"  on trips for update using (true);
create policy "anon_delete_trips"  on trips for delete using (true);

-- trip_configs
create policy "anon_select_configs"  on trip_configs for select using (true);
create policy "anon_insert_configs"  on trip_configs for insert with check (true);
create policy "anon_update_configs"  on trip_configs for update using (true);
create policy "anon_delete_configs"  on trip_configs for delete using (true);

-- bookings
create policy "anon_select_bookings"  on bookings for select using (true);
create policy "anon_insert_bookings"  on bookings for insert with check (true);
create policy "anon_update_bookings"  on bookings for update using (true);
create policy "anon_delete_bookings"  on bookings for delete using (true);

-- inspiration_items
create policy "anon_select_inspiration"  on inspiration_items for select using (true);
create policy "anon_insert_inspiration"  on inspiration_items for insert with check (true);
create policy "anon_update_inspiration"  on inspiration_items for update using (true);
create policy "anon_delete_inspiration"  on inspiration_items for delete using (true);
