-- Homepage Tech Stack Manager
-- Run after apps/web/supabase/schema.sql because this uses public.set_updated_at() and public.is_admin_or_editor().

create table if not exists public.site_tech_stack_items (
  id uuid primary key default gen_random_uuid(),
  tech_stack_id uuid references public.tech_stacks(id) on delete set null,
  name text not null,
  group_name text not null check (group_name in ('Frontend', 'Backend', 'Data & AI', 'Cloud & DevX')),
  category text not null default 'OTHER' check (category in ('FRONTEND', 'BACKEND', 'DATABASE', 'AI', 'DEVOPS', 'DESIGN', 'OTHER')),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_name, name)
);

create index if not exists site_tech_stack_items_visible_idx on public.site_tech_stack_items(is_visible, group_name, sort_order);
create index if not exists site_tech_stack_items_group_idx on public.site_tech_stack_items(group_name, sort_order);
create index if not exists site_tech_stack_items_stack_idx on public.site_tech_stack_items(tech_stack_id);

drop trigger if exists set_site_tech_stack_items_updated_at on public.site_tech_stack_items;
create trigger set_site_tech_stack_items_updated_at before update on public.site_tech_stack_items for each row execute function public.set_updated_at();

alter table public.site_tech_stack_items enable row level security;

drop policy if exists "public read visible site tech stacks" on public.site_tech_stack_items;
drop policy if exists "dashboard manage site tech stacks" on public.site_tech_stack_items;

create policy "public read visible site tech stacks" on public.site_tech_stack_items for select using (is_visible = true);
create policy "dashboard manage site tech stacks" on public.site_tech_stack_items for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());

insert into public.site_tech_stack_items (name, group_name, category, sort_order, is_visible)
values
  ('React', 'Frontend', 'FRONTEND', 0, true),
  ('Next.js', 'Frontend', 'FRONTEND', 1, true),
  ('TypeScript', 'Frontend', 'FRONTEND', 2, true),
  ('Tailwind', 'Frontend', 'FRONTEND', 3, true),
  ('Motion', 'Frontend', 'FRONTEND', 4, true),
  ('Remix', 'Frontend', 'FRONTEND', 5, true),
  ('Node.js', 'Backend', 'BACKEND', 0, true),
  ('tRPC', 'Backend', 'BACKEND', 1, true),
  ('FastAPI', 'Backend', 'BACKEND', 2, true),
  ('Go', 'Backend', 'BACKEND', 3, true),
  ('GraphQL', 'Backend', 'BACKEND', 4, true),
  ('Postgres', 'Backend', 'DATABASE', 5, true),
  ('OpenRouter', 'Data & AI', 'AI', 0, true),
  ('Claude', 'Data & AI', 'AI', 1, true),
  ('pgvector', 'Data & AI', 'DATABASE', 2, true),
  ('Drizzle', 'Data & AI', 'DATABASE', 3, true),
  ('Prisma', 'Data & AI', 'DATABASE', 4, true),
  ('ClickHouse', 'Data & AI', 'DATABASE', 5, true),
  ('Vercel', 'Cloud & DevX', 'DEVOPS', 0, true),
  ('Supabase', 'Cloud & DevX', 'DATABASE', 1, true),
  ('Docker', 'Cloud & DevX', 'DEVOPS', 2, true),
  ('GitHub Actions', 'Cloud & DevX', 'DEVOPS', 3, true),
  ('Cloudflare', 'Cloud & DevX', 'DEVOPS', 4, true),
  ('Sentry', 'Cloud & DevX', 'DEVOPS', 5, true)
on conflict (group_name, name) do nothing;
