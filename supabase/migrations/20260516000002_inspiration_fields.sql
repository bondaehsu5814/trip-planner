-- Migration 003: Enhance inspiration_items
-- Adds trip_date (for day-by-day view), url, comment, and shopping category

alter table inspiration_items add column trip_date date;
alter table inspiration_items add column url text;
alter table inspiration_items add column comment text;

alter table inspiration_items
  drop constraint inspiration_items_category_check;

alter table inspiration_items
  add constraint inspiration_items_category_check
  check (category in ('food', 'activity', 'place', 'shopping', 'other'));
