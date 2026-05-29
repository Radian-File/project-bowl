-- ProjectBowl Supabase schema
-- Run manually in Supabase SQL Editor after creating the Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  avatar_url text,
  role text not null default 'EDITOR' check (role in ('ADMIN', 'EDITOR', 'VIEWER')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description text,
  problem text,
  solution text,
  status text not null default 'IDEA' check (status in ('IDEA', 'PLANNING', 'IN_PROGRESS', 'SHIPPED', 'ARCHIVED')),
  visibility text not null default 'PRIVATE' check (visibility in ('PRIVATE', 'PUBLIC', 'UNLISTED')),
  is_featured boolean not null default false,
  repository_url text,
  live_url text,
  case_study_url text,
  published_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tech_stacks (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  category text not null default 'OTHER' check (category in ('FRONTEND', 'BACKEND', 'DATABASE', 'AI', 'DEVOPS', 'DESIGN', 'OTHER')),
  icon_url text,
  website_url text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tech_stacks (
  project_id uuid not null references public.projects(id) on delete cascade,
  tech_stack_id uuid not null references public.tech_stacks(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (project_id, tech_stack_id)
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null default 'GALLERY' check (type in ('COVER', 'GALLERY', 'LOGO', 'SCREENSHOT')),
  url text not null,
  alt_text text,
  width integer,
  height integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'TODO' check (status in ('TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'CANCELED')),
  priority integer not null default 0,
  due_date timestamptz,
  completed_at timestamptz,
  created_by_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'PLANNED' check (status in ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  target_date timestamptz,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  message text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_generation_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  type text not null default 'OTHER' check (type in ('PROJECT_BRIEF', 'CASE_STUDY', 'README', 'IMAGE_PROMPT', 'OTHER')),
  status text not null default 'QUEUED' check (status in ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED')),
  provider text,
  model text,
  prompt text not null,
  response text,
  input_tokens integer,
  output_tokens integer,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_visibility_published_idx on public.projects(visibility, published_at);
create index if not exists projects_status_idx on public.projects(status);
create index if not exists projects_featured_idx on public.projects(is_featured);
create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists tech_stacks_category_idx on public.tech_stacks(category);
create index if not exists project_tech_stacks_tech_idx on public.project_tech_stacks(tech_stack_id);
create index if not exists project_images_project_type_idx on public.project_images(project_id, type);
create index if not exists tasks_project_status_idx on public.tasks(project_id, status);
create index if not exists tasks_created_by_idx on public.tasks(created_by_id);
create index if not exists milestones_project_status_idx on public.project_milestones(project_id, status);
create index if not exists activity_logs_project_created_idx on public.activity_logs(project_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

drop trigger if exists set_tech_stacks_updated_at on public.tech_stacks;
create trigger set_tech_stacks_updated_at before update on public.tech_stacks for each row execute function public.set_updated_at();

drop trigger if exists set_project_images_updated_at on public.project_images;
create trigger set_project_images_updated_at before update on public.project_images for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();

drop trigger if exists set_project_milestones_updated_at on public.project_milestones;
create trigger set_project_milestones_updated_at before update on public.project_milestones for each row execute function public.set_updated_at();

drop trigger if exists set_ai_generation_logs_updated_at on public.ai_generation_logs;
create trigger set_ai_generation_logs_updated_at before update on public.ai_generation_logs for each row execute function public.set_updated_at();

create or replace function public.is_admin_or_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('ADMIN', 'EDITOR')
  );
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tech_stacks enable row level security;
alter table public.project_tech_stacks enable row level security;
alter table public.project_images enable row level security;
alter table public.tasks enable row level security;
alter table public.project_milestones enable row level security;
alter table public.activity_logs enable row level security;
alter table public.ai_generation_logs enable row level security;

drop policy if exists "profiles read own" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
drop policy if exists "public read published projects" on public.projects;
drop policy if exists "public read published project images" on public.project_images;
drop policy if exists "public read published project stacks" on public.project_tech_stacks;
drop policy if exists "public read tech stacks" on public.tech_stacks;
drop policy if exists "dashboard manage projects" on public.projects;
drop policy if exists "dashboard manage project images" on public.project_images;
drop policy if exists "dashboard manage project stacks" on public.project_tech_stacks;
drop policy if exists "dashboard manage tech stacks" on public.tech_stacks;
drop policy if exists "dashboard manage tasks" on public.tasks;
drop policy if exists "dashboard manage milestones" on public.project_milestones;
drop policy if exists "dashboard manage activity" on public.activity_logs;
drop policy if exists "dashboard manage ai logs" on public.ai_generation_logs;

-- Profiles
create policy "profiles read own" on public.profiles for select using (id = auth.uid() or public.is_admin_or_editor());
create policy "profiles update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- Public portfolio read
create policy "public read published projects" on public.projects for select using (visibility = 'PUBLIC' and published_at is not null);
create policy "public read published project images" on public.project_images for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.visibility = 'PUBLIC' and p.published_at is not null)
);
create policy "public read published project stacks" on public.project_tech_stacks for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.visibility = 'PUBLIC' and p.published_at is not null)
);
create policy "public read tech stacks" on public.tech_stacks for select using (true);

-- Dashboard admin/editor access
create policy "dashboard manage projects" on public.projects for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "dashboard manage project images" on public.project_images for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "dashboard manage project stacks" on public.project_tech_stacks for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "dashboard manage tech stacks" on public.tech_stacks for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "dashboard manage tasks" on public.tasks for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "dashboard manage milestones" on public.project_milestones for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "dashboard manage activity" on public.activity_logs for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "dashboard manage ai logs" on public.ai_generation_logs for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
