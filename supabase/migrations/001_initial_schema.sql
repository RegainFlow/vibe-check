-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  stripe_customer_id text,
  stripe_subscription_id text,
  audits_used_this_month integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Audits table
create table public.audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  repo_url text not null,
  status text not null default 'pending' check (status in ('pending', 'cloning', 'analyzing', 'generating', 'completed', 'failed')),
  overall_score integer,
  scores jsonb,
  metadata jsonb,
  share_token text unique default encode(gen_random_bytes(16), 'hex'),
  total_files integer not null default 0,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Findings table
create table public.findings (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references public.audits(id) on delete cascade not null,
  category text not null,
  severity text not null check (severity in ('critical', 'warning', 'info')),
  title text not null,
  description text not null default '',
  file_path text not null,
  line_start integer,
  code_snippet text,
  fix_prompt text not null default '',
  deduction integer not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_audits_user_id on public.audits(user_id);
create index idx_audits_share_token on public.audits(share_token);
create index idx_audits_status on public.audits(status);
create index idx_findings_audit_id on public.findings(audit_id);
create index idx_findings_category on public.findings(category);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.audits enable row level security;
alter table public.findings enable row level security;

-- Profiles: users can read and update their own
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Audits: users can read own audits, insert with their user_id or null
create policy "Users can view own audits" on public.audits
  for select using (auth.uid() = user_id);

create policy "Users can insert audits" on public.audits
  for insert with check (user_id = auth.uid() or user_id is null);

-- Findings: users can read findings of own audits
create policy "Users can view findings of own audits" on public.findings
  for select using (
    exists (
      select 1 from public.audits
      where audits.id = findings.audit_id
      and audits.user_id = auth.uid()
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger audits_updated_at
  before update on public.audits
  for each row execute procedure public.update_updated_at();
