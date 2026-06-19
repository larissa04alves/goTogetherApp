# Frontend — React Router 7 + Tailwind 4 + shadcn

App React em modo SPA (SSR off). Stack: React, React Router 7 (file-based routing via `flatRoutes()`), Tailwind 4, shadcn/ui, Better-Auth client.

Para convenções globais (TS, naming, workflow, AskUserQuestion), veja [`../CLAUDE.md`](../CLAUDE.md).

## Arquitetura de pastas

```
frontend/src/
├── root.tsx              # shell do app (providers, layout global)
├── routes.ts             # flatRoutes() — gera o routing tree
├── routes/               # arquivos finos que SÓ reexportam de pages/
├── pages/                # organização por feature (UM lugar de lógica de página)
│   ├── home/
│   ├── login/
│   │   ├── index.tsx     # a página
│   │   └── components/   # componentes locais da feature
│   └── dashboard/
├── api/                  # auth-client + clients HTTP (1 arquivo por domínio)
├── components/
│   ├── ui/               # primitives shadcn — NÃO editar manualmente
│   └── *.tsx             # componentes compartilhados (header, theme-provider, etc.)
├── lib/                  # utils puros (cn, formatters, ...)
├── styles/
│   └── globals.css       # entry do Tailwind 4
├── assets/               # imagens, ícones estáticos
└── env.ts                # env client (VITE_*) — única porta para import.meta.env
```

**Regra de separação:** `routes/<x>.tsx` é só `export { default } from "@/pages/<x>"` (3 linhas). Toda lógica de página, hooks, fetch, layout interno fica em `pages/<feature>/`. Componentes que só essa feature usa: `pages/<feature>/components/`. Componentes compartilhados entre features: `components/`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev:frontend` | Vite dev server (porta 5173) |
| `npm run build` | Build de produção |
| `npm run check-types` | `tsc --noEmit` (inclui types do React Router gerados em `.react-router/`) |
| `cd frontend && npx shadcn@latest add <comp>` | Adiciona componente shadcn em `components/ui/` |

## React Router 7

- **Modo SPA** (SSR off) — configurado em `react-router.config.ts`.
- **File-based routing** via `flatRoutes()` em `src/routes.ts`. Para adicionar nova rota:
  1. Criar `pages/<feature>/index.tsx` com a página.
  2. Criar `routes/<feature>.tsx` que reexporta: `export { default } from "@/pages/<feature>";`
  3. Router pega automaticamente.
- **Types gerados:** `.react-router/types/` (auto-gerado, não editar, não versionar).
- **Loaders/actions:** definir junto à página em `pages/<feature>/index.tsx`, exportar `loader`/`action` nomeados. O `routes/<feature>.tsx` reexporta tudo.
- Dúvidas sobre APIs (`useLoaderData`, `redirect`, `defer`, etc.): usar MCP `context7` com `react-router`.

## Tailwind 4

- **Não é Tailwind v3** — config inline em CSS (sem `tailwind.config.js`).
- Entry: `src/styles/globals.css`.
- Tokens/theme em `@theme { ... }` dentro do CSS.
- Para dúvidas de migração v3→v4 ou nova sintaxe: MCP `context7` com `tailwindcss/v4`.

## shadcn/ui

- **Primitives em `components/ui/`** — geradas pelo CLI, **não editar manualmente** (perde update do upstream). Se precisar customizar: copiar para `components/` e adaptar.
- `components.json` já configurado com `aliases.ui = @/components/ui` — o CLI escreve nos caminhos certos.
- Adicionar componente:
  ```bash
  cd frontend && npx shadcn@latest add accordion dialog popover
  ```
- Descobrir o que existe no registry: MCP `shadcn` (`list_items_in_registries`, `search_items_in_registries`).
- Import padrão: `import { Button } from "@/components/ui/button"`.

## Better-Auth client

- Cliente em `src/api/auth-client.ts`.
- Hooks comuns: `useSession`, `signIn`, `signOut`, `signUp`.
- Padrão de uso em página protegida: `useSession()` → loading/erro/data → render condicional ou `redirect` em loader.
- Dúvidas: MCP `better-auth` ou skill `better-auth-best-practices`.

## Env vars

- Validadas em `src/env.ts` via `@t3-oss/env-core` + Zod. **Nunca** `import.meta.env.X` direto fora desse arquivo.
- Vars precisam prefixo `VITE_` para serem expostas ao client (regra do Vite).
- `frontend/.env` é git-ignored. Adicionar var nova = atualizar `env.ts` também.

## Gotchas

- **Cold reload do Vite** após mudar `routes.ts` ou adicionar arquivo em `routes/` — às vezes precisa reiniciar `dev:frontend`.
- **Types do RR7** vivem em `.react-router/types/` — se `check-types` reclamar de type ausente em loader, rodar `npm run dev:frontend` uma vez (gera types) e re-rodar `check-types`.
- **shadcn primitives editadas manualmente** = perde update do CLI. Se for customizar muito, copie para `components/` e renomeie.
