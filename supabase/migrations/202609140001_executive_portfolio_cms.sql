-- Founder / business / finance portfolio CMS expansion.
-- Additive only: existing records and columns remain untouched.

create extension if not exists pgcrypto;

alter table if exists public.projects
  add column if not exists slug text,
  add column if not exists category text,
  add column if not exists summary text,
  add column if not exists problem text,
  add column if not exists objective text,
  add column if not exists role text,
  add column if not exists approach text,
  add column if not exists "businessImpact" text,
  add column if not exists results text,
  add column if not exists featured boolean not null default false,
  add column if not exists visible boolean not null default true;

create unique index if not exists projects_slug_unique
  on public.projects (slug) where slug is not null;

alter table if exists public.settings
  add column if not exists "nowText" text,
  add column if not exists "academicProofUrl" text,
  add column if not exists "companyUrl" text;

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  value text not null check (length(trim(value)) > 0),
  label text not null check (length(trim(label)) > 0),
  description text,
  "order" integer not null default 0,
  visible boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.finance_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  category text not null,
  content text,
  "externalUrl" text,
  "documentUrl" text,
  featured boolean not null default false,
  "publishedAt" date,
  visible boolean not null default false,
  "order" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.research_publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  authors text,
  publication text,
  year text,
  summary text,
  "researchArea" text,
  "publicationUrl" text,
  "documentUrl" text,
  featured boolean not null default false,
  visible boolean not null default false,
  "order" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text,
  category text not null,
  "coverImage" text,
  "publishedAt" date,
  featured boolean not null default false,
  visible boolean not null default false,
  "seoTitle" text,
  "seoDescription" text,
  "order" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists metrics_public_order on public.metrics (visible, "order");
create index if not exists finance_items_public_order on public.finance_items (visible, featured desc, "order");
create index if not exists research_publications_public_order on public.research_publications (visible, featured desc, "order");
create index if not exists articles_public_date on public.articles (visible, "publishedAt" desc);

alter table public.metrics enable row level security;
alter table public.finance_items enable row level security;
alter table public.research_publications enable row level security;
alter table public.articles enable row level security;

do $$
declare table_name text;
begin
  foreach table_name in array array['metrics', 'finance_items', 'research_publications', 'articles'] loop
    execute format('drop policy if exists "Public reads visible content" on public.%I', table_name);
    execute format('create policy "Public reads visible content" on public.%I for select using (visible = true)', table_name);
    execute format('drop policy if exists "Authenticated admins read all content" on public.%I', table_name);
    execute format('create policy "Authenticated admins read all content" on public.%I for select to authenticated using (true)', table_name);
    execute format('drop policy if exists "Authenticated admins create content" on public.%I', table_name);
    execute format('create policy "Authenticated admins create content" on public.%I for insert to authenticated with check (true)', table_name);
    execute format('drop policy if exists "Authenticated admins update content" on public.%I', table_name);
    execute format('create policy "Authenticated admins update content" on public.%I for update to authenticated using (true) with check (true)', table_name);
    execute format('drop policy if exists "Authenticated admins delete content" on public.%I', table_name);
    execute format('create policy "Authenticated admins delete content" on public.%I for delete to authenticated using (true)', table_name);
  end loop;
end $$;

-- Existing projects/settings policies remain authoritative. Review those policies
-- in the target project before applying stricter role/allow-list checks.
