# ProjectBowl

ProjectBowl is an AI-powered developer portfolio CMS and project management dashboard.

Current target architecture:

```txt
Vercel
└─ apps/web — Next.js fullstack app
   ├─ Public portfolio
   ├─ Dashboard
   ├─ Internal route handlers
   ├─ Supabase Auth/session
   ├─ Supabase Postgres data access
   └─ OpenRouter AI helpers

Supabase
├─ Auth
├─ Postgres
└─ Storage optional later
```

The project no longer requires a separately deployed backend for production. `apps/api` is kept as a **legacy/reference NestJS implementation** and is excluded from the active pnpm workspace pipeline.

## Repository Structure

```txt
apps/
  web/                  Active Next.js fullstack app for Vercel
    app/api/            Internal backend route handlers
    lib/supabase/       Supabase browser/server clients
    lib/data/           Supabase data access layer
    supabase/           Manual schema/seed docs
  api/                  Legacy NestJS API reference, not used for Vercel deploy
packages/
  config/               Shared TypeScript config
  types/                Shared domain/API types
  ui/                   Shared UI primitives/design tokens
```

## Prerequisites

- Node.js 22 LTS recommended
- pnpm 9.15.4
- Supabase project
- Vercel project
- Optional OpenRouter API key for AI Studio

## Environment Variables

Copy the example locally:

```bash
cp .env.example .env
```

Required for live Supabase dashboard/auth:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional AI:

```txt
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o-mini
```

Never commit `.env` or production secrets.

## Installation

```bash
pnpm install
```

## Development

Run the active Next.js app:

```bash
pnpm --filter @projectbowl/web dev
```

Default URL:

- Web: <http://localhost:3000>

Without Supabase env, public portfolio fallback data still renders. Dashboard login/live CRUD requires Supabase env and a Supabase Auth user.

## Supabase Manual Setup

Manual files are in:

```txt
apps/web/supabase/schema.sql
apps/web/supabase/seed.sql
apps/web/supabase/README.md
```

High-level steps:

1. Create Supabase project.
2. Run `schema.sql` in Supabase SQL Editor.
3. Optionally run `seed.sql`.
4. Create admin user in Supabase Auth.
5. Insert a matching `profiles` row with role `ADMIN`.
6. Add Supabase env vars to Vercel.

See [apps/web/supabase/README.md](apps/web/supabase/README.md) for the full manual process.

## Active App Commands

```bash
pnpm --filter @projectbowl/web typecheck
pnpm --filter @projectbowl/web test
pnpm --filter @projectbowl/web build
```

Root commands run the active workspace packages only:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Internal API Routes

The Next.js app exposes internal route handlers under `/api`:

| Area | Routes |
| --- | --- |
| Public portfolio | `GET /api/public/projects`, `GET /api/public/projects/:slug` |
| Projects | `GET /api/projects`, `POST /api/projects`, `GET/PATCH/DELETE /api/projects/:id` |
| Tech stacks | `GET /api/tech-stacks`, `POST /api/tech-stacks` |
| Tasks | `GET/POST /api/projects/:id/tasks` |
| Milestones | `GET /api/projects/:id/milestones` |
| Activity logs | `GET /api/activity-logs`, `GET /api/projects/:id/activity-logs` |
| AI | `POST /api/ai/generate/description`, `POST /api/ai/generate/readme`, `POST /api/ai/generate/case-study`, `POST /api/ai/rewrite` |

These routes are designed for Vercel serverless runtime and Supabase.

## Deployment: Vercel + Supabase

### Vercel

Recommended settings:

```txt
Root Directory: .
Install Command: pnpm install --frozen-lockfile
Build Command: pnpm --filter @projectbowl/web build
Framework Preset: Next.js
```

Keep the Vercel project at repository root so pnpm can resolve workspace packages in `packages/*`.

Set env vars from `.env.example` in Vercel Project Settings.

### Supabase

Use manual SQL setup from `apps/web/supabase`.

### No Railway/Render Required

A separate NestJS deployment is no longer required. `apps/api` remains only as legacy reference until it is safe to delete after production verification.

## Design Direction

The UI follows the active Figma direction:

- Dark background: `#080A0F`
- Glassmorphism cards
- Purple accent: `#7C3AED`
- Cyan accent: `#06B6D4`
- Rounded premium developer portfolio feel

Known Figma frames:

- Home page: `6:3259`
- Contact page: `6:2964`
