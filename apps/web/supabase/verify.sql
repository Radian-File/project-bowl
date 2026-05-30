-- ProjectBowl Supabase verification queries
-- Run after schema.sql, optional seed.sql, and admin profile insert.

-- 1. Check core tables exist and estimate row counts.
select
  schemaname,
  relname as table_name,
  n_live_tup as estimated_rows
from pg_stat_user_tables
where schemaname = 'public'
  and relname in (
    'profiles',
    'projects',
    'tech_stacks',
    'project_tech_stacks',
    'project_images',
    'tasks',
    'project_milestones',
    'activity_logs',
    'ai_generation_logs',
    'site_tech_stack_items'
  )
order by relname;

-- 2. Check RLS is enabled on all ProjectBowl tables.
select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles',
    'projects',
    'tech_stacks',
    'project_tech_stacks',
    'project_images',
    'tasks',
    'project_milestones',
    'activity_logs',
    'ai_generation_logs',
    'site_tech_stack_items'
  )
order by tablename;

-- 3. Check policies are installed.
select
  schemaname,
  tablename,
  policyname,
  cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4. Check public projects ready for portfolio.
select
  id,
  title,
  slug,
  visibility,
  published_at,
  is_featured
from public.projects
order by created_at desc;

-- 5. Check homepage tech stack items.
select
  id,
  name,
  group_name,
  category,
  sort_order,
  is_visible
from public.site_tech_stack_items
order by group_name, sort_order, name;

-- 6. Check admin/editor profiles.
select
  id,
  email,
  name,
  role,
  created_at
from public.profiles
order by created_at desc;
