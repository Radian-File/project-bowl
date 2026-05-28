# ProjectBowl

ProjectBowl is an AI-powered project management and portfolio CMS.

It combines:

- A public developer portfolio website.
- A private dashboard for managing projects.
- Future AI tools for generating descriptions, README files, and case studies through OpenRouter.

## Phase 2 Status

This repository is currently in **Phase 2 — Setup Monorepo**.

Implemented foundation:

- pnpm workspace
- Turborepo
- Next.js web app with TypeScript, Tailwind CSS, and App Router
- NestJS API app with TypeScript
- Shared packages:
  - `@projectbowl/config`
  - `@projectbowl/types`
  - `@projectbowl/ui`
- Environment example file
- Figma-aligned design tokens for the initial web foundation

## Apps

### Web

Location: `apps/web`

```bash
pnpm --filter @projectbowl/web dev
```

Default URL: `http://localhost:3000`

### API

Location: `apps/api`

```bash
pnpm --filter @projectbowl/api dev
```

Default URL: `http://localhost:4000`

Health check:

```txt
GET http://localhost:4000/health
```

## Monorepo Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
```

## Design Direction

The web foundation follows the active Figma direction:

- Dark background: `#080A0F`
- Glassmorphism cards
- Purple accent: `#7C3AED`
- Cyan accent: `#06B6D4`
- Rounded UI
- Premium developer portfolio feel

Known Figma frames:

- Home page: `6:3259`
- Contact page: `6:2964`

## Next Phase

Proceed to **Phase 3 — Design System & UI Foundation** after confirming this monorepo setup runs locally.
