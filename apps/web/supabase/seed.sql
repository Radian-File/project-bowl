-- Optional ProjectBowl seed data for Supabase.
-- Run after schema.sql. Admin profile must be inserted manually after creating a Supabase Auth user.

insert into public.tech_stacks (name, slug, category) values
  ('Next.js', 'next-js', 'FRONTEND'),
  ('Supabase', 'supabase', 'DATABASE'),
  ('Vercel', 'vercel', 'DEVOPS'),
  ('TypeScript', 'typescript', 'FRONTEND'),
  ('OpenRouter', 'openrouter', 'AI')
on conflict (slug) do nothing;

insert into public.projects (
  title,
  slug,
  summary,
  description,
  status,
  visibility,
  is_featured,
  live_url,
  published_at
) values (
  'ProjectBowl',
  'projectbowl',
  'AI-powered developer portfolio CMS and project management dashboard.',
  'ProjectBowl centralizes project planning, AI-generated documentation, case studies, and portfolio publishing in a single Vercel + Supabase workspace.',
  'IN_PROGRESS',
  'PUBLIC',
  true,
  'https://projectbowl.app',
  now()
)
on conflict (slug) do nothing;

insert into public.project_tech_stacks (project_id, tech_stack_id, sort_order)
select p.id, t.id, row_number() over (order by t.name)
from public.projects p
cross join public.tech_stacks t
where p.slug = 'projectbowl'
  and t.slug in ('next-js', 'supabase', 'vercel', 'typescript', 'openrouter')
on conflict do nothing;
