-- Optional verification links for claims made on the public portfolio.
alter table if exists public.settings
  add column if not exists "academicProofUrl" text,
  add column if not exists "companyUrl" text;
