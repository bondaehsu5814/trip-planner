-- inspiration_items: add sort_order, cost, currency, paid_by
alter table inspiration_items
  add column if not exists sort_order integer default 0,
  add column if not exists cost numeric,
  add column if not exists currency text default 'TWD',
  add column if not exists paid_by text;

-- trip_configs already stores flights/hotels/transports/members as JSONB
-- members array and cost fields are added at app level inside the JSON
-- no schema change needed for trip_configs
