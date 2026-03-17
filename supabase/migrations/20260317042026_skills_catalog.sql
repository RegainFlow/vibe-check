-- Skills catalog for agent skill recommendations

-- Skills table
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  provider text not null,
  source text not null default 'awesome-agent-skills',
  source_repo_url text,
  source_skill_url text,
  description text,
  official boolean not null default false,
  is_active boolean not null default true,
  trust_status text not null default 'unknown'
    check (trust_status in ('safe', 'low-risk', 'blocked', 'unknown')),
  trust_severity text,
  trust_last_scanned_at timestamptz,
  cached_skill_markdown text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Skill-to-category mappings
create table if not exists public.skill_category_mappings (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid references public.skills(id) on delete cascade not null,
  category text not null
    check (category in ('security','architecture','maintainability','error-handling','scalability','tech-debt','prompt-architecture')),
  compatibility text not null default 'good-fit'
    check (compatibility in ('best-fit', 'good-fit', 'possible-fit')),
  priority integer not null default 0,
  why_this_fits text,
  created_at timestamptz not null default now(),
  unique (skill_id, category)
);

-- Indexes
create index idx_skill_category_mappings_category on public.skill_category_mappings(category);
create index idx_skills_trust_status on public.skills(trust_status);

-- RLS
alter table public.skills enable row level security;
alter table public.skill_category_mappings enable row level security;

-- Public read for active + safe/low-risk skills
create policy "Public can read active safe skills" on public.skills
  for select using (is_active = true and trust_status in ('safe', 'low-risk'));

create policy "Public can read skill mappings" on public.skill_category_mappings
  for select using (
    exists (
      select 1 from public.skills
      where skills.id = skill_category_mappings.skill_id
      and skills.is_active = true
      and skills.trust_status in ('safe', 'low-risk')
    )
  );

-- Reuse existing update_updated_at trigger function from migration 001
create trigger skills_updated_at
  before update on public.skills
  for each row execute procedure public.update_updated_at();
