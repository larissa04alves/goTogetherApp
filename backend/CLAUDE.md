# Backend — Express + Drizzle + Better-Auth

API HTTP do goTogheterApp. Stack: Express 5, Drizzle ORM, PostgreSQL 16, Better-Auth (email/password), Zod para validação de boundary, t3-env para env vars.

Para convenções globais (TS, naming, workflow, AskUserQuestion), veja [`../CLAUDE.md`](../CLAUDE.md).

## Arquitetura de pastas

```
backend/src/
├── index.ts            # bootstrap do servidor Express
├── env.ts              # env validadas via @t3-oss/env-core (única porta de entrada para process.env)
├── routes/             # APENAS wiring — declara rotas e delega para controllers
├── controllers/        # lógica de request/response (parse, validate, chama camada de dados, responde)
├── db/
│   ├── client.ts       # cliente Drizzle (singleton)
│   ├── schema/         # 1 arquivo por tabela, agrupado por domínio (ver "Schema")
│   ├── migrations/     # geradas por drizzle-kit, VERSIONADAS no git
│   └── seeds/          # scripts SQL ou TS para popular dados de dev
└── auth/               # config do Better-Auth server (handler, plugins, adapter Drizzle)
```

**Regra de separação:** `routes/` é fino (só `router.get('/x', controller.x)`); toda lógica vive em `controllers/`. Se um controller crescer demais, extraia para `services/` (criar a pasta quando precisar — não antes).

## Comandos

| Comando               | O que faz                                                        |
| --------------------- | ---------------------------------------------------------------- |
| `npm run dev:backend` | `tsx watch src/index.ts` (porta 3000)                            |
| `npm run build`       | Build via `tsdown`                                               |
| `npm run check-types` | `tsc --noEmit`                                                   |
| `npm run db:push`     | Aplica schema no banco (dev — diff-apply, destrutivo em renames) |
| `npm run db:generate` | Gera nova migration a partir do schema (versionar no git)        |
| `npm run db:migrate`  | Aplica migrations pendentes (usar em prod e CI)                  |
| `npm run db:studio`   | Abre Drizzle Studio (UI web)                                     |

## Schema (Drizzle)

**Regra de ouro: 1 arquivo por tabela, agrupado por domínio em subpasta.**

```
db/schema/
├── index.ts                    # re-exporta cada domínio: export * from "./auth";
└── auth/
    ├── index.ts                # re-exporta cada tabela do domínio: export * from "./user"; ...
    ├── user.ts                 # tabela `user` + relations onde user é dona
    ├── session.ts              # tabela `session` (FK para user) + relations
    ├── account.ts              # tabela `account` (FK para user) + relations
    └── verification.ts         # tabela `verification` (sem relations)
```

**Onde colocar `relations`:** no arquivo da tabela **dona** da chave estrangeira (ou da tabela "raiz" da relação). Ex: `userRelations` (que descreve `user` ter `many sessions, many accounts`) vai em `user.ts`. `sessionRelations` (que descreve `session` ter `one user`) vai em `session.ts`.

**Adicionar nova feature com tabelas próprias:** criar `schema/<feature>/` com `index.ts` + 1 arquivo por tabela, e adicionar `export * from "./<feature>";` em `schema/index.ts`. Exemplo futuro: grupos de viagem ficariam em `schema/groups/{group,member,invite}.ts`.

**Nunca** coloque mais de uma tabela no mesmo arquivo, nem agrupe schemas de domínios diferentes (não misturar `auth/` com `groups/`).

## Workflow de migrations

**Migrations são versionadas no git.** O schema é a fonte de verdade do **estado desejado**; as migrations são a fonte de verdade das **transformações** que levam o banco de um estado ao outro. Sem migrations versionadas, prod ficaria refém de `db:push`, que é destrutivo em renames/restructures.

### Ciclo padrão (em dev, fluxo de equipe)

1. **Antes de mexer no schema:** `git pull` para sincronizar migrations existentes.
2. Editar/criar arquivos em `db/schema/<domain>/<table>.ts`.
3. Em dev local rápido: `npm run db:push` para diff-apply direto (sem gerar arquivo).
4. **Quando a mudança estiver estável e for entrar em PR:** `npm run db:generate` para gerar a migration versionada.
5. Commit do schema **e** da migration gerada **juntos** no mesmo commit.
6. **CI/prod aplicam com `npm run db:migrate`** (nunca `db:push`).

### Conflito de migrations em equipe

Drizzle nomeia migrations com timestamp/hash, então conflito de **arquivo** é raro. Quando acontecer, significa que **duas pessoas alteraram o mesmo objeto do schema** — o conflito é real e precisa ser resolvido **no schema também**, não só na migration:

1. `git pull --rebase` para trazer a migration do outro dev.
2. Resolver conflito no schema (decidir qual versão prevalece ou mergear ambas).
3. **Apagar a migration local** (a que você gerou antes do rebase).
4. `npm run db:generate` novamente, agora em cima do estado mergeado.
5. `npm run db:migrate` para aplicar localmente.
6. Commit do schema atualizado + nova migration.

### Quando usar `db:push` vs `db:generate`

| Cenário                                                   | Comando                |
| --------------------------------------------------------- | ---------------------- |
| Iterar rápido em dev local antes de finalizar uma mudança | `db:push`              |
| Mudança vai entrar em PR / branch compartilhada / prod    | `db:generate` + commit |
| Aplicar migrations em CI ou prod                          | `db:migrate`           |

## Better-Auth

- Config server: `src/auth/` (handler + adapter Drizzle + providers).
- Hoje: **email/password** apenas. Tabelas geradas: `user`, `session`, `account`, `verification` (em `schema/auth/`).
- Endpoints expostos via Express middleware em `/api/auth/*`.
- Para adicionar provider (Google, GitHub, etc.): editar `src/auth/index.ts` + adicionar env vars correspondentes em `src/env.ts`.
- Dúvidas de configuração: usar MCP `better-auth` ou skill `better-auth-best-practices`.

## Validação

- **Boundary (request body, query, params):** Zod schema explícito em cada controller. Nunca confiar em `req.body` direto.
- **Env vars:** `@t3-oss/env-core` em `src/env.ts`. Nunca `process.env.X` fora dele.
- **Internamente:** confie nos tipos. Não revalidar o que já foi validado no boundary.

## Error handling

Errors **propagam** para um middleware central de erros (a ser implementado — TBD quando a primeira rota não-trivial nascer). Controllers não devem `try/catch` para esconder erro — apenas para transformar (ex: erro de Drizzle em erro HTTP semântico).

## Env vars necessárias

Em `backend/.env` (git-ignored). Validadas em `src/env.ts`:

- `DATABASE_URL` — string de conexão Postgres (default local: `postgres://postgres:admin@localhost:5432/goTogetherDb`). **Required.**
- `BETTER_AUTH_SECRET` — secret para JWT/cookies do Better-Auth (mín. 32 chars). **Required.**
- `BETTER_AUTH_URL` — base URL do backend (ex: `http://localhost:3000`). **Required.**
- `CORS_ORIGIN` — origem permitida para CORS (ex: `http://localhost:5173` em dev). **Required.**
- `NODE_ENV` — `development` | `production` | `test`. Default: `development`.

## Gotchas

- **Postgres precisa estar UP** antes de `db:*` — `npm run db:start` na raiz.
- **`db:push` é destrutivo em renames** — Drizzle vê drop+create. Use `db:generate` quando renomear coluna/tabela com dados.
- **Drizzle `relations` não são automáticas** — precisam ser declaradas explicitamente em cada arquivo de tabela envolvido.
