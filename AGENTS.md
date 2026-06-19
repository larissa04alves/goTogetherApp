# goTogheterApp

Monorepo TypeScript com **backend/** (Express + Drizzle + Postgres + Better-Auth) e **frontend/** (React Router 7 SPA + Tailwind 4 + shadcn/ui). Para visão geral e setup, veja [README.md](./README.md).

## Navegação

| Trabalho em | Leia também |
|---|---|
| API, banco, auth server, controllers | [`backend/AGENTS.md`](./backend/AGENTS.md) |
| UI, rotas, componentes | [`frontend/AGENTS.md`](./frontend/AGENTS.md) |
| Tooling, deps cruzadas, docker, scripts top-level | este arquivo |

Codex auto-carrega o AGENTS.md do diretório em que está trabalhando — você não precisa importar manualmente os filhos.

## Comandos essenciais

| Comando | O que faz |
|---|---|
| `npm install` | Instala deps em ambos workspaces |
| `npm run dev` | Sobe backend (3000) + frontend (5173) em paralelo |
| `npm run db:start` | Sobe Postgres via Docker Compose |
| `npm run db:push` | Aplica schema no banco (dev) |
| `npm run db:generate` | Gera nova migration a partir do schema |
| `npm run db:migrate` | Aplica migrations pendentes |
| `npm run check-types` | `tsc` em ambos workspaces |
| `npm run build` | Build de produção de ambos workspaces |

Lista completa no [README.md#scripts](./README.md#scripts).

## Workflow de desenvolvimento

Toda feature, refactor e bugfix segue o ciclo do plugin **superpowers** (skills instaladas em `.agents/skills/`):

1. `superpowers:brainstorming` — explora ideia, gera spec em `docs/superpowers/specs/YYYY-MM-DD-<topico>-design.md`.
2. `superpowers:writing-plans` — converte spec em plano executável em `docs/superpowers/plans/`.
3. `superpowers:subagent-driven-development` — executa o plano com subagentes (inclui code-quality-reviewer embutido — não rodar `/simplify` aqui).
4. `superpowers:verification-before-completion` — obrigatório antes de afirmar "feito".
5. `superpowers:requesting-code-review` — antes de merge.
6. `superpowers:finishing-a-development-branch` — fecha o ciclo.

Para bugs: `superpowers:systematic-debugging` **antes** de propor fix. Para 2+ tarefas independentes: `superpowers:dispatching-parallel-agents`.

## Skills locais (triggers de invocação)

Skills são **versionadas no git** (não git-ignored). Clone fresh já tem tudo — zero comandos pra rodar.

| Path | Papel |
|---|---|
| `.agents/skills/<name>/SKILL.md` | **Canonical store** — arquivos reais |
| `.Codex/skills/<name>` | Symlink → `../../.agents/skills/<name>` (lido por Codex) |
| `.codex/skills/<name>` | Symlink → `../../.agents/skills/<name>` (lido por Codex CLI) |
| `skills-lock.json` | Manifesto: fontes upstream + hashes (alimenta `npx skills update`) |

Codex não lê `.agents/skills/` direto (issue #22902) — por isso os symlinks em `.Codex/skills/` existem. Git versiona symlinks (modo 120000), então tudo viaja junto no clone.

**Adicionar/atualizar/remover skill via upstream:**

```bash
npx skills add <source> --agent Codex            # baixa do GitHub para .agents/skills/ + linka .Codex/skills/
ln -sf "../../.agents/skills/<name>" ".codex/skills/<name>"  # cria symlink para Codex (CLI não faz)
npx skills update                                       # atualiza versões dos upstreams (diff revisável em PR)
npx skills remove <name>                                # remove do lock + dirs
git add .agents/skills/ .Codex/skills/ .codex/skills/ skills-lock.json
```

**Editar skill localmente:** edite `.agents/skills/<name>/SKILL.md` direto e commit. Mudanças sobrevivem porque versionadas (mas serão sobrescritas se a skill for atualizada via `npx skills update`).

| Skill | Quando invocar |
|---|---|
| `superpowers:brainstorming` | Feature ou comportamento novo (encadeia o resto). |
| `superpowers:writing-plans` | Spec pronto → plano de execução. |
| `superpowers:subagent-driven-development` | Executar plano com tasks independentes. |
| `superpowers:test-driven-development` | Toda escrita de código de produção (quando tivermos testes). |
| `superpowers:systematic-debugging` | Qualquer bug, falha ou comportamento inesperado. |
| `superpowers:verification-before-completion` | Antes de afirmar "feito", "passa", "OK pra commit". |
| `better-auth-best-practices` | Mudanças em auth (server ou client). |
| `shadcn` | Adicionar/customizar componente shadcn. |

Demais skills (`vercel-*`, `web-design-guidelines`, `writing-skills`, etc) — invocar sob demanda quando o domínio bater.

## MCPs disponíveis (`.mcp.json`)

| MCP | Quando usar |
|---|---|
| `context7` | Pergunta sobre API/SDK/lib de terceiros (React Router 7, Drizzle, Express, Tailwind 4, etc). Prefira sobre web search e training data. |
| `shadcn` | Descobrir, listar ou adicionar componentes do registry shadcn. |
| `better-auth` | Pergunta sobre configuração, providers, endpoints do Better-Auth. |
| `better-t-stack` | Adicionar/remover addons do scaffolding (`bts add`). Raro fora do setup. |

## Quando usar `AskUserQuestion`

Obrigatório quando há:

- **2+ hipóteses plausíveis** sobre a intenção do usuário.
- **2+ implementações válidas** com trade-offs reais (perf vs simplicidade, lib A vs B, refactor agora vs depois).
- **Causa raiz incerta** entre 2+ hipóteses (durante debugging).
- **Requisito ambíguo** durante exploração em plan mode.

Como chamar: 1 a 4 perguntas por chamada, máximo 4 opções por pergunta. Cada opção com `label` curta + `description` com trade-off real. Primeira opção é a recomendação, sufixo "(Recomendado)".

**Não use** para confirmações triviais ("posso prosseguir?", "fica bom?") — só para decisões reais.

## Convenções TypeScript globais

Reforçadas pelo `tsconfig.base.json` (`strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, ESM). Adicionais por convenção:

- **`@/*` aponta para `src/*`** em ambos workspaces. Use o alias, nunca `../../../`.
- **Nunca `any`** — use `unknown` + narrowing, ou `type`/`interface` explícito.
- **Nunca `!` (non-null assertion)** — narrowing real com `if`/`assert` ou refator o tipo.
- **Named exports apenas** — proibido `export default` (alinha com `verbatimModuleSyntax` e melhora tree-shaking/IDE refactor).
- **Naming:** `kebab-case` para arquivos (`user-card.tsx`), `PascalCase` para componentes React e tipos, `camelCase` para funções e variáveis, `SCREAMING_SNAKE` para constantes top-level.
- **Imports ordenados:** node built-ins → libs externas → `@/*` interno → relativo. Linha em branco entre grupos.
- **Errors propagam** — não engolir com `try/catch` silencioso. Validação só em boundary (req body com Zod, env com t3-oss). Internamente: confie nos tipos.

## Env vars

- **Backend:** validadas em `backend/src/env.ts` via `@t3-oss/env-core`. Nunca usar `process.env.*` direto fora desse arquivo.
- **Frontend:** validadas em `frontend/src/env.ts` (`VITE_*`). Nunca usar `import.meta.env.*` direto fora desse arquivo.
- `backend/.env` e `frontend/.env` são git-ignored. Sempre que adicionar uma var, atualize também o `env.ts` correspondente.

## Especificações e planos

| Pasta | Conteúdo |
|---|---|
| `docs/superpowers/specs/` | Design docs (saída do `brainstorming`). Nome: `YYYY-MM-DD-<topico>-design.md`. |
| `docs/superpowers/plans/` | Planos de implementação (saída do `writing-plans`). |

Ambas versionadas no git. Spec é a fonte de verdade da **decisão**; plan é a fonte de verdade da **execução**.

## Gotchas globais

- **Skills são versionadas no git** (não git-ignored). Clone fresh já tem tudo. Atualizações via `npx skills update` viram diff revisável em PR.
- **Lock não persiste `agents`** — sempre passe `--agent Codex` em qualquer `npx skills add` para criar o symlink em `.Codex/skills/`. Para Codex, adicionar manualmente: `ln -sf "../../.agents/skills/<name>" ".codex/skills/<name>"`.
- **Editar skill diretamente:** OK editar `.agents/skills/<name>/SKILL.md` para customizar. Mudanças commitadas sobrevivem — mas serão sobrescritas se essa skill for atualizada via `npx skills update` no futuro.
- **Postgres precisa estar UP** antes de qualquer `db:*` command — sempre `npm run db:start` antes.

## Não fazer

- **Commit ou push sem aprovação explícita** — a regra está no settings global da Larissa. Se for ambíguo, pergunte.
- **`--no-verify`, `--no-gpg-sign`** — não pular hooks sem pedido explícito.
- **`try/catch` que engole erro, fallback que esconde falha, override local de config global** — workaround do sintoma em vez da causa.
- **Adicionar feature/abstração além do pedido** (YAGNI). Bug fix não precisa de refactor circunjacente.
- **Re-`Read` arquivo logo após `Edit`/`Write`** — o harness rastreia state. Retorna `Wasted call`.
- **`process.env.*` ou `import.meta.env.*` direto** — sempre via `env.ts`.
- **`export default`** — sempre named export.
- **`any` ou `!`** — use `unknown` + narrowing real.
