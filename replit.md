# PortfolioOS

A portfolio builder SaaS where users sign up, create their own public portfolio, and visitors experience it through a cinematic retro computer interface — a 3D desk with a vintage CRT monitor running a Windows 95-era OS.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/portfolio run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + Clerk Express middleware
- DB: PostgreSQL + Drizzle ORM
- Auth: Clerk (Replit-managed)
- Frontend: React + Vite + Tailwind v4 + framer-motion + wouter
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/portfolios.ts` — portfolios + portfolioItems tables + relations
- `artifacts/api-server/src/routes/portfolio.ts` — portfolio CRUD routes
- `artifacts/api-server/src/routes/items.ts` — portfolio item CRUD routes
- `artifacts/portfolio/src/` — React frontend (landing, dashboard, public portfolio view)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not edit)

## Architecture decisions

- Contract-first: OpenAPI spec gates codegen which gates frontend hooks — no hand-written types
- Public portfolio at `/p/:username` is fully unauthenticated — accessible to anyone
- Clerk auth is cookie-based on web — no Bearer token handling needed in browser API calls
- Clerk proxy middleware on the Express server handles prod auth routing automatically
- DB relations defined with Drizzle `relations()` so Drizzle queries can use `with: { items: true }`

## Product

- **Landing page** (`/`) — explains the product, previews the retro computer experience
- **Sign up / Sign in** (`/sign-up`, `/sign-in`) — Clerk-powered auth with branded UI
- **Dashboard** (`/dashboard`) — create/edit portfolio, manage experience/education/projects
- **Public portfolio** (`/p/:username`) — cinematic retro OS experience for visitors

## User preferences

- Keep token/API keys out of chat — always use Replit secrets system
- Prefer Replit Deploy over Vercel for this monorepo + Express backend setup

## Gotchas

- Always run codegen after changing openapi.yaml: `pnpm --filter @workspace/api-spec run codegen`
- Drizzle `with:` queries require relations defined in schema — both portfoliosRelations and portfolioItemsRelations must be exported
- Clerk: `proxyUrl` must be unconditional (empty string in dev is intentional)
- Clerk: route paths must be exactly `/sign-in/*?` and `/sign-up/*?` in wouter
- Tailwind v4 + Clerk themes: requires `tailwindcss({ optimize: false })` in vite.config.ts

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
