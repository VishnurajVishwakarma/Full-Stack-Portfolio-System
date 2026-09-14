-- Add a separately managed CIEL contribution to the public Now dashboard.
alter table public.settings
  add column if not exists "nowContributing" text;
