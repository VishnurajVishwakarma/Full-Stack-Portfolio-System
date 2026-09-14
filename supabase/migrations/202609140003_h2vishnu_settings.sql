-- H2VISHNU brand links and structured Now dashboard fields.
alter table if exists public.settings
  add column if not exists "cielUrl" text,
  add column if not exists "nowBuilding" text,
  add column if not exists "nowOperating" text,
  add column if not exists "nowLearning" text,
  add column if not exists "nowResearching" text,
  add column if not exists "nowExploring" text;
