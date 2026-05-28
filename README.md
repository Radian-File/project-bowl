# ProjectBowl

ProjectBowl is an AI-powered developer portfolio CMS and project management dashboard.

It includes:

- **Public portfolio** built with Next.js App Router, Tailwind CSS, and shared UI tokens.
- **Private dashboard** for projects, tech stacks, tasks, milestones, and AI tools.
- **NestJS REST API** with Prisma/PostgreSQL, JWT auth, role guards, OpenRouter-powered AI helpers, activity logs, and Swagger/OpenAPI docs.
- **pnpm + Turborepo monorepo** with shared `@projectbowl/types`, `@projectbowl/ui`, and `@projectbowl/config` packages.

## Repository Structure

```txt
apps/
  api/                 NestJS API, Prisma schema, seed script, Swagger setup
  web/                 Next.js portfolio and dashboard
packages/
  config/              Shared TypeScript config
  types/               Shared API/domain types
  ui/                  Shared UI primitives/design tokens
.github/workflows/ci.yml
.env.example
docker-compose.yml
```

> Note: root `docs/**/*.md` is intentionally gitignored for local planning notes. Use this tracked `README.md` and tracked config files for GitHub-facing documentation.

## Prerequisites

- Node.js 22 LTS recommended
- pnpm 9.15.4 (`corepack enable` is recommended)
- PostgreSQL 16+ locally or via Docker
- Optional: Docker Desktop for containerized local services

## Environment Setup

Copy the example file and replace all placeholders before running the full stack:

```bash
cp .env.example .env
```

Important variables:

| Variable | Used by | Description |
| --- | --- | --- |
| `DATABASE_URL` | API/Prisma | PostgreSQL connection string. Local Docker default is `postgresql://projectbowl:projectbowl@localhost:5432/projectbowl?schema=public`. |
| `API_PORT` | API | API port, default `4000`. |
| `WEB_PORT` | Web | Web port, default `3000`. |
| `WEB_ORIGIN` | API | Allowed CORS origin, usually `http://localhost:3000`. |
| `NEXT_PUBLIC_API_URL` | Web | Browser-facing API URL, usually `http://localhost:4000`. |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | API | Strong random secrets for JWT signing. Do not commit real values. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seed | Admin account created by the seed script when not set to placeholders. |
| `OPENROUTER_API_KEY` | API | Server-side OpenRouter API key for AI features. |
| `OPENROUTER_MODEL` | API | Default model, e.g. `openai/gpt-4o-mini`. |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Future uploads | Production-ready placeholders for Cloudinary integration. Upload endpoints are not implemented yet. |

Never commit `.env` or production secrets.

## Installation

```bash
pnpm install
```

Generate Prisma Client after dependency or schema changes:

```bash
pnpm --filter @projectbowl/api prisma:generate
```

## Database, Migrations, and Seed

Start local PostgreSQL only:

```bash
docker compose up -d postgres
```

Apply development migrations:

```bash
pnpm --filter @projectbowl/api prisma:migrate
```

Seed the admin user:

```bash
pnpm --filter @projectbowl/api prisma:seed
```

Open Prisma Studio:

```bash
pnpm --filter @projectbowl/api prisma:studio
```

The seed script skips admin creation when `ADMIN_EMAIL` or `ADMIN_PASSWORD` are missing or still set to `replace-me`.

## Development

Run the whole monorepo:

```bash
pnpm dev
```

Run apps individually:

```bash
pnpm --filter @projectbowl/api dev
pnpm --filter @projectbowl/web dev
```

Default URLs:

- Web: <http://localhost:3000>
- API: <http://localhost:4000>
- API health: <http://localhost:4000/health>
- Swagger UI: <http://localhost:4000/docs>
- OpenAPI JSON: <http://localhost:4000/docs-json>

## API Usage

The API uses JSON request/response bodies. Protected endpoints require:

```txt
Authorization: Bearer <access-token>
```

Common endpoints:

| Area | Endpoints |
| --- | --- |
| Health | `GET /health` |
| Auth | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` |
| Public portfolio | `GET /public/projects`, `GET /public/projects/:slug` |
| Projects | `GET /projects`, `GET /projects/:id`, `GET /projects/:id/progress`, `POST /projects`, `PATCH /projects/:id`, `DELETE /projects/:id` |
| Tech stacks | `GET /tech-stacks`, `GET /tech-stacks/:id`, `POST /tech-stacks`, `PATCH /tech-stacks/:id`, `DELETE /tech-stacks/:id` |
| Tasks | `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id` |
| Milestones | `GET /milestones`, `GET /milestones/:id`, `POST /milestones`, `PATCH /milestones/:id`, `DELETE /milestones/:id` |
| AI | `POST /ai/generate/description`, `POST /ai/generate/readme`, `POST /ai/generate/case-study`, `POST /ai/rewrite`, `POST /ai/translate` |
| Activity logs | `GET /activity-logs`, `POST /activity-logs` |
| Users | `GET /users/me`, `GET /users` |

Use Swagger UI for request schemas and interactive calls once the API is running.

## Testing and Validation

Root scripts are Turborepo-powered:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Current test coverage is intentionally lightweight and reliable:

- API unit test for health service metadata.
- API Supertest smoke test for `GET /health` without booting the full database-backed app module.
- Web smoke test for App Router home page and API client configuration without adding heavy browser test dependencies.

Database integration tests are not enabled by default. Add them later behind explicit test database setup to avoid accidental local data writes.

## Docker

DB-only local usage remains the default:

```bash
docker compose up -d postgres
```

Optional app containers are behind the `app` profile:

```bash
docker compose --profile app up --build
```

This starts:

- `postgres` on port `5432`
- `api` on port `4000`
- `web` on port `3000`

For the app profile, keep `.env` populated locally. The API container points `DATABASE_URL` at the compose `postgres` service. Run migrations before using a fresh database:

```bash
pnpm --filter @projectbowl/api prisma:migrate
pnpm --filter @projectbowl/api prisma:seed
```

Individual Dockerfiles are available at:

- `apps/api/Dockerfile`
- `apps/web/Dockerfile`

## OpenRouter Setup

1. Create an OpenRouter account and API key.
2. Set `OPENROUTER_API_KEY` in the API runtime environment.
3. Set `OPENROUTER_MODEL` to the preferred model.
4. Restart the API after changing model or key values.

The key must remain server-side only. Do not expose it through `NEXT_PUBLIC_*` variables.

## Cloudinary Setup Notes

Cloudinary env variables are included for production readiness:

```txt
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Upload backend endpoints are future-ready rather than implemented in this phase. When uploads are added, keep API secrets server-side and return only safe public asset URLs to the web app.

## Deployment Guide

### Web: Vercel

1. Create a Vercel project from this repository.
2. Set the project root or build settings for the monorepo web app:
   - Install command: `pnpm install --frozen-lockfile`
   - Build command: `pnpm --filter @projectbowl/web... build`
   - Output handled by Next.js/Vercel.
3. Add `NEXT_PUBLIC_API_URL` pointing to the deployed API origin.
4. Deploy after the API and database are available.

### API: Railway or Render

1. Create a Node.js service from this repository.
2. Use Node.js 22 and pnpm.
3. Set build command:

   ```bash
   pnpm install --frozen-lockfile && pnpm --filter @projectbowl/api build
   ```

4. Set start command:

   ```bash
   pnpm --filter @projectbowl/api start
   ```

5. Configure runtime env vars: `DATABASE_URL`, JWT secrets, `WEB_ORIGIN`, `API_PORT`, OpenRouter values, and future Cloudinary values if needed.
6. Run Prisma migrations against production before serving traffic:

   ```bash
   pnpm --filter @projectbowl/api prisma:deploy
   ```

   If your platform does not expose a shell, run this from CI/CD or a one-off job with the same production `DATABASE_URL`.

### Database: Neon or Supabase Postgres

1. Create a PostgreSQL project.
2. Copy the pooled or direct connection string into `DATABASE_URL`.
3. Ensure SSL settings match the provider requirements.
4. Run production migrations with `prisma migrate deploy`.
5. Optionally run the seed script once to create the initial admin user.

### Cloudinary

1. Create a Cloudinary account.
2. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to the API host.
3. Do not add Cloudinary secrets to the web host unless an explicitly public unsigned upload flow is implemented.

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

The workflow runs on pushes to `main` and pull requests:

- lint + typecheck
- tests
- build

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
