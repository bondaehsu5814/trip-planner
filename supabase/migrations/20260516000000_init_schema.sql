-- Migration 001: Initial schema
-- Creates the 4 core tables for trip-planner

create table trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

create table trip_configs (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  config jsonb not null default '{}',
  updated_by text,
  updated_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  item_type text not null check (item_type in ('flight', 'hotel', 'transport')),
  item_key text not null,
  status text not null default 'pending' check (status in ('pending', 'booked')),
  notes text,
  updated_by text,
  updated_at timestamptz default now(),
  unique(trip_id, item_type, item_key)
);

create table inspiration_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  content text not null,
  category text not null default 'other' check (category in ('food', 'activity', 'place', 'other')),
  added_by text,
  created_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_bookings_updated_at
  before update on bookings
  for each row execute function update_updated_at();

create trigger set_trip_configs_updated_at
  before update on trip_configs
  for each row execute function update_updated_at();
