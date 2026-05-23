# goTogheterApp

Monorepo TypeScript com **backend/** (Express + Drizzle + Postgres) e **frontend/** (React + React Router 7 + Tailwind 4 + shadcn/ui), autenticação via Better-Auth.

## Features

- **TypeScript** — type safety em todo o stack
- **React Router 7** — file-based routing, SSR off (SPA mode)
- **Tailwind CSS 4** — utility-first styling
- **shadcn/ui** — primitives em `frontend/src/components/ui/`
- **Express 5** — backend HTTP
- **Drizzle ORM + PostgreSQL** — database layer
- **Better-Auth** — autenticação email/password
- **PWA** — Progressive Web App via `vite-plugin-pwa`

## Getting Started

Instalar deps:

```bash
npm install
```

## Database Setup

Postgres roda via Docker Compose.

1. Subir o container:

```bash
npm run db:start
```

2. Conferir/ajustar `backend/.env` (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.).

3. Aplicar schema:

```bash
npm run db:push
```

Rodar tudo em dev:

```bash
npm run dev
```

- Front: [http://localhost:5173](http://localhost:5173)
- Back: [http://localhost:3000](http://localhost:3000)

## UI / shadcn

Primitives ficam em `frontend/src/components/ui/`. Para adicionar mais componentes shadcn:

```bash
cd frontend && npx shadcn@latest add accordion dialog popover sheet
```

`frontend/components.json` já está configurado com `aliases.ui = @/components/ui`, então o CLI escreve nos caminhos corretos.

Imports:

```tsx
import { Button } from "@/components/ui/button";
```

## PWA + React Router 7

Há um issue conhecido de compatibilidade entre VitePWA e React Router v7:
https://github.com/vite-pwa/vite-plugin-pwa/issues/809

## Project Structure

```
goTogheterApp/
├── backend/                       # API Express
│   ├── src/
│   │   ├── index.ts            # bootstrap
│   │   ├── routes/             # wiring de rotas (auth.routes.ts...)
│   │   ├── controllers/        # lógica de request/response
│   │   ├── db/
│   │   │   ├── client.ts       # conexão Drizzle
│   │   │   ├── schema/         # tabelas Drizzle
│   │   │   ├── migrations/     # geradas pelo drizzle-kit
│   │   │   └── seeds/          # scripts SQL de seed
│   │   ├── auth/               # config better-auth (server)
│   │   └── env.ts              # env vars validadas (t3-oss)
│   ├── drizzle.config.ts
│   └── .env
├── frontend/                      # React app
│   ├── src/
│   │   ├── root.tsx            # shell
│   │   ├── routes.ts           # flatRoutes()
│   │   ├── routes/             # finas, só reexportam de pages/
│   │   ├── pages/              # organização por feature
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/
│   │   │   └── dashboard/
│   │   ├── api/                # auth-client e clients HTTP
│   │   ├── components/
│   │   │   ├── ui/             # shadcn primitives
│   │   │   └── *.tsx           # compartilhados (header, theme...)
│   │   ├── lib/                # utils (cn)
│   │   ├── styles/             # globals.css
│   │   ├── assets/
│   │   └── env.ts              # env client (VITE_*)
│   ├── components.json         # shadcn config
│   ├── vite.config.ts
│   ├── react-router.config.ts
│   └── .env
├── docker-compose.yml          # Postgres
├── tsconfig.base.json          # config compartilhado
└── package.json                # npm workspaces: [backend, frontend]
```

Path alias `@/*` aponta para `src/*` em ambos workspaces.

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Sobe backend e frontend em paralelo |
| `npm run dev:backend` | Só Express (porta 3000) |
| `npm run dev:frontend` | Só Vite + React Router (porta 5173) |
| `npm run build` | Build de ambos workspaces |
| `npm run check-types` | tsc em ambos workspaces |
| `npm run db:start` | Sobe Postgres via Docker |
| `npm run db:stop` | Para Postgres (mantém volume) |
| `npm run db:down` | Remove container Postgres |
| `npm run db:push` | Aplica schema no banco |
| `npm run db:generate` | Gera migrations |
| `npm run db:migrate` | Roda migrations |
| `npm run db:studio` | Abre Drizzle Studio |
| `cd frontend && npm run generate-pwa-assets` | Gera assets PWA |
