# ProjectBowl — Phase 2: Setup Monorepo

> Status: Completed  
> Date: 2026-05-28  
> Phase focus: repository foundation only.

## Goals

- Setup pnpm workspace.
- Setup Turborepo.
- Create `apps/web` with Next.js, TypeScript, Tailwind CSS, and App Router.
- Create `apps/api` with NestJS and TypeScript.
- Create shared packages for config, types, and UI.
- Prepare environment example file for future stack.
- Keep Prisma, database, auth, AI, uploads, deployment, and full app features for later phases.

## Implemented Structure

```txt
project-bowl/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── config/
│   ├── types/
│   └── ui/
├── docs/
│   ├── phase-1-project-planning.md
│   └── phase-2-monorepo-setup.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
├── .env.example
└── README.md
```

## Figma Design Usage

The initial web app uses the active Figma direction as foundation:

- Dark mode background.
- Purple/cyan neon accents.
- Glassmorphism cards.
- Rounded UI.
- Developer portfolio positioning.

Known Figma frames:

- Home: `6:3259`
- Contact: `6:2964`

## Apps

### Web

- Path: `apps/web`
- Framework: Next.js App Router
- Styling: Tailwind CSS
- Shared UI: `@projectbowl/ui`

### API

- Path: `apps/api`
- Framework: NestJS
- Endpoint: `GET /health`

## Shared Packages

### `@projectbowl/config`

Shared TypeScript config presets for Next.js and NestJS.

### `@projectbowl/types`

Shared TypeScript contracts and project enums.

### `@projectbowl/ui`

Initial shared UI package with a reusable button component.

## Validation Commands

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

## Final Validation Result

Completed on 2026-05-28:

- `pnpm install` succeeded.
- `pnpm typecheck` succeeded across 5 workspace packages.
- `pnpm build` succeeded across 5 workspace packages.
- API local smoke test succeeded: `GET /health` returned `{"status":"ok","service":"projectbowl-api"}`.
- Web local smoke test succeeded: `http://localhost:3000` returned `200 OK` and rendered the Figma-inspired starter homepage.
- Local Git repository initialized on branch `main` with initial monorepo commit.

## Not Implemented Yet

These are intentionally deferred:

- Prisma
- PostgreSQL connection
- Auth/JWT
- OpenRouter API calls
- Cloudinary uploads
- Swagger
- Docker
- GitHub Actions
- Full public portfolio sections
- Full dashboard features
