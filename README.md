# 🚗 goTogetherApp

Aplicação full-stack em monorepo TypeScript, com **backend/** em Express + Drizzle + PostgreSQL + Better-Auth e **frontend/** em React Router 7 + Tailwind 4 + shadcn/ui + PWA.

## 🚀 Subindo o projeto local

Para iniciar o ambiente local completo, rode na raiz do projeto:

```bash
npm start
```

Esse comando faz duas coisas:

- 🐳 sobe o PostgreSQL pelo Docker Compose;
- ⚡ inicia backend e frontend em modo desenvolvimento.

Depois que os serviços iniciarem:

- 🌐 Frontend: [http://localhost:5173](http://localhost:5173)
- 🔌 Backend: [http://localhost:3000](http://localhost:3000)

## 🧩 O que tem no projeto

- 🟦 **TypeScript** em todo o stack
- ⚛️ **React Router 7** no frontend em modo SPA
- 🎨 **Tailwind CSS 4** para estilos
- 🧱 **shadcn/ui** em `frontend/src/components/ui/`
- 🚀 **Express 5** no backend
- 🐘 **PostgreSQL** com Docker Compose
- 🌿 **Drizzle ORM** para schema, migrations e queries
- 🔐 **Better-Auth** para autenticação
- 📱 **PWA** com `vite-plugin-pwa`

## 🐳 Banco de dados

O PostgreSQL local roda via Docker Compose.

Scripts úteis:

| Script | O que faz |
|---|---|
| `npm run db:start` | Sobe o PostgreSQL em background |
| `npm run db:watch` | Sobe o PostgreSQL mostrando logs no terminal |
| `npm run db:stop` | Para o container, mantendo os dados |
| `npm run db:down` | Remove o container |
| `npm run db:push` | Aplica o schema atual no banco de dev |
| `npm run db:generate` | Gera uma migration a partir do schema |
| `npm run db:migrate` | Aplica migrations pendentes |
| `npm run db:studio` | Abre o Drizzle Studio |

Variáveis do backend ficam em `backend/.env`. Para desenvolvimento local, confira principalmente:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

Variáveis do frontend ficam em `frontend/.env`, sempre com prefixo `VITE_`.

## 🛠️ Scripts principais

| Script | O que faz |
|---|---|
| `npm start` | Sobe Docker, backend e frontend |
| `npm run dev` | Sobe backend e frontend, sem mexer no Docker |
| `npm run dev:backend` | Sobe apenas a API Express na porta 3000 |
| `npm run dev:frontend` | Sobe apenas o frontend na porta 5173 |
| `npm run build` | Gera build de produção dos dois workspaces |
| `npm run check-types` | Roda checagem TypeScript nos dois workspaces |
| `cd frontend && npm run generate-pwa-assets` | Gera os assets da PWA |

## 📁 Estrutura do projeto

```text
goTogetherApp/
├── backend/                    # API Express
│   ├── src/
│   │   ├── index.ts            # bootstrap da API
│   │   ├── routes/             # rotas HTTP
│   │   ├── controllers/        # request/response
│   │   ├── db/
│   │   │   ├── client.ts       # conexão Drizzle
│   │   │   ├── schema/         # tabelas Drizzle
│   │   │   ├── migrations/     # migrations geradas
│   │   │   └── seeds/          # seeds SQL
│   │   ├── auth/               # Better-Auth no servidor
│   │   └── env.ts              # env vars validadas
│   ├── drizzle.config.ts
│   └── .env
├── frontend/                   # App React
│   ├── src/
│   │   ├── root.tsx            # shell da aplicação
│   │   ├── routes.ts           # configuração de rotas
│   │   ├── routes/             # arquivos de rota
│   │   ├── pages/              # telas por feature
│   │   ├── api/                # clientes HTTP e auth-client
│   │   ├── components/
│   │   │   ├── ui/             # primitives shadcn/ui
│   │   │   └── *.tsx           # componentes compartilhados
│   │   ├── lib/                # utilitários
│   │   ├── styles/             # CSS global
│   │   ├── assets/
│   │   └── env.ts              # env vars do client
│   ├── components.json         # config shadcn
│   ├── vite.config.ts
│   ├── react-router.config.ts
│   └── .env
├── docker-compose.yml          # PostgreSQL local
├── tsconfig.base.json          # TypeScript compartilhado
└── package.json                # npm workspaces
```

O alias `@/*` aponta para `src/*` tanto no backend quanto no frontend.

## 🎨 UI e shadcn

Os componentes shadcn ficam em `frontend/src/components/ui/`.

Para adicionar novos componentes:

```bash
cd frontend && npx shadcn@latest add accordion dialog popover sheet
```

Exemplo de import:

```tsx
import { Button } from "@/components/ui/button";
```

## 📱 PWA + React Router 7

Existe um issue conhecido de compatibilidade entre VitePWA e React Router 7:

https://github.com/vite-pwa/vite-plugin-pwa/issues/809

## 🧯 Problemas comuns

Se `npm start` falhar porque a porta do banco já está ocupada, verifique se outro PostgreSQL está rodando localmente na porta `5432`.

Se o backend reclamar de env vars, confira `backend/.env`.

Se o frontend não conseguir falar com a API, confira `frontend/.env` e o valor de `VITE_SERVER_URL`.
