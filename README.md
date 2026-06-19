# 🚗 goTogetherApp

> Plataforma de **caronas universitárias compartilhadas** — conecta peesoas com trajetos parecidos para dividirem caronas com segurança. 🎓

Aplicação full-stack em monorepo TypeScript:

- 🛠️ **Backend** — Express + Drizzle + PostgreSQL + Better-Auth
- 🎨 **Frontend** — React Router 7 + Tailwind 4 + shadcn/ui

---

## 📚 Sobre o projeto

Trabalho acadêmico desenvolvido na **PUCPR**.

|                         |                                                       |
| ----------------------- | ----------------------------------------------------- |
| 📖 **Disciplina**       | Experiência Criativa: Inovando Colaborativamente      |
| 🗓️ **Semestre/Período** | 5º semestre/Turno: Noite                              |
| 👩‍🏫 **Professor(a)**     | Mateus Nunes da Silva e Glauco Vinicius Furstenberger |

A ideia: um app onde estudantes cadastram suas rotas habituais, criam ou entram em **"hubs" de carona** (grupos de viagem para o mesmo trajeto/horário), conversam por chat e se avaliam após a viagem. 🤝

---

## 👥 Autores

| Nome              | GitHub                                               |
| ----------------- | ---------------------------------------------------- |
| Larissa Alves     | [@larissa04alves](https://github.com/larissa04alves) |
| Breno P.          | [@brenop2](https://github.com/brenop2)               |
| Vinícius H. B. C. | [@viniciushbc](https://github.com/viniciushbc)       |

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — cadastro, login e sessão via Better-Auth (e-mail/senha).
- 👤 **Perfil** — dados do estudante, verificação de identidade e upload de documentos.
- 🚙 **Veículos** — cadastro e gestão dos veículos do usuário.
- 🗺️ **Rotas** — cadastro de trajetos habituais (origem/destino) com mapa interativo (MapLibre GL).
- 🧭 **Hubs de carona** — criar, listar, entrar/sair, gerenciar membros e solicitações; inclui hubs exclusivos para mulheres.
- 💬 **Chat em tempo real** — conversa entre participantes de um hub (Stream Chat).
- ⭐ **Avaliações** — avaliação mútua entre participantes após a carona.
- 📜 **Histórico** — caronas oferecidas e tomadas.

---

## 🧩 Tecnologias

### 🛠️ Backend (`backend/`)

| Ferramenta       | Para quê                             |
| ---------------- | ------------------------------------ |
| Express 5        | Servidor HTTP / API REST             |
| Drizzle ORM      | Schema, migrations e queries tipadas |
| PostgreSQL 16    | Banco de dados (via Docker)          |
| Better-Auth      | Autenticação e sessões               |
| Zod              | Validação de entrada (boundary)      |
| Multer           | Upload de arquivos (documentos)      |
| Stream Chat      | Backend do chat em tempo real        |
| @t3-oss/env-core | Validação de variáveis de ambiente   |

### 🎨 Frontend (`frontend/`)

| Ferramenta           | Para quê                          |
| -------------------- | --------------------------------- |
| React 19             | Biblioteca de UI                  |
| React Router 7       | Roteamento file-based em modo SPA |
| Tailwind CSS 4       | Estilização                       |
| shadcn/ui            | Componentes de UI                 |
| MapLibre GL          | Mapas interativos                 |
| Stream Chat React    | UI do chat em tempo real          |
| @tanstack/react-form | Formulários                       |
| Better-Auth (client) | Cliente de autenticação           |

---

## ✅ Pré-requisitos

- 🟢 **Node.js 20+**
- 🐳 **Docker** (para o PostgreSQL via Docker Compose)
- 🔧 **Git**

> 💡 O projeto usa **npm workspaces**. Os comandos abaixo usam `npm` — basta tê-lo (já vem com o Node).

---

## 🚀 Como rodar (passo a passo)

A partir da raiz do projeto:

```bash
# 1️⃣  Instalar as dependências dos dois workspaces (backend + frontend)
npm install

# 2️⃣  Criar os arquivos de ambiente a partir dos exemplos
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
#    No backend/.env, defina BETTER_AUTH_SECRET com uma string aleatória de 32+ caracteres.

# 3️⃣  Subir o PostgreSQL (Docker)
npm run db:start

# 4️⃣  Aplicar o schema no banco (primeira vez)
npm run db:push

# 5️⃣  (Opcional) Popular o banco com dados de demonstração
npm run db:seed --workspace backend

# 6️⃣  Subir backend + frontend em modo desenvolvimento
npm run dev
```

Depois que tudo iniciar: 🎉

|                      | URL                   |
| -------------------- | --------------------- |
| 🎨 **Frontend**      | http://localhost:5173 |
| 🛠️ **API (backend)** | http://localhost:3000 |
| 🐘 **PostgreSQL**    | `localhost:5432`      |

> ⚡ **Atalho:** `npm run dev` sobe o Docker e o dev de uma vez (passos 3 + 6). Nas primeiras execuções, ainda é preciso fazer os passos 2 e 4 manualmente.

### 🧪 Usuários de demonstração

Se você rodou o seed (passo 5), há usuários prontos para login. Exemplo:

- 📧 **E-mail:** `demo@gotogether.com`
- 🔑 **Senha:** `demo1234`

---

## 🔑 Variáveis de ambiente

Os arquivos `.env` são git-ignored; use os `.env.example` como base.

**`backend/.env`:**

| Variável             | Descrição                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `DATABASE_URL`       | Conexão Postgres (padrão local: `postgresql://postgres:admin@localhost:5432/goTogetherDb`) |
| `BETTER_AUTH_SECRET` | Secret do Better-Auth (mín. 32 caracteres)                                                 |
| `BETTER_AUTH_URL`    | URL base do backend (`http://localhost:3000`)                                              |
| `CORS_ORIGIN`        | Origem permitida para CORS (`http://localhost:5173`)                                       |

**`frontend/.env`:**

| Variável          | Descrição                            |
| ----------------- | ------------------------------------ |
| `VITE_SERVER_URL` | URL da API (`http://localhost:3000`) |

---

## 📜 Scripts

Rodados a partir da raiz:

| Script                                | O que faz                                   |
| ------------------------------------- | ------------------------------------------- |
| `npm install`                         | 📦 Instala dependências dos dois workspaces |
| `npm start`                           | 🚀 Sobe Docker + backend + frontend         |
| `npm run dev`                         | 💻 Sobe backend e frontend (sem Docker)     |
| `npm run dev:backend`                 | 🛠️ Sobe apenas a API (porta 3000)           |
| `npm run dev:frontend`                | 🎨 Sobe apenas o frontend (porta 5173)      |
| `npm run build`                       | 🏗️ Build de produção dos dois workspaces    |
| `npm run check-types`                 | ✅ Checagem TypeScript nos dois workspaces  |
| `npm run db:start`                    | 🐳 Sobe o PostgreSQL em background          |
| `npm run db:watch`                    | 👀 Sobe o PostgreSQL mostrando logs         |
| `npm run db:stop`                     | ⏸️ Para o container (mantém os dados)       |
| `npm run db:down`                     | 🗑️ Remove o container                       |
| `npm run db:push`                     | ⬆️ Aplica o schema no banco (dev)           |
| `npm run db:generate`                 | 🧬 Gera uma migration a partir do schema    |
| `npm run db:migrate`                  | 🔁 Aplica migrations pendentes              |
| `npm run db:studio`                   | 🔍 Abre o Drizzle Studio                    |
| `npm run db:seed --workspace backend` | 🌱 Popula o banco com dados de demonstração |

---

## 🗂️ Estrutura do projeto

```text
goTogetherApp/
├── 🛠️ backend/                 # API Express
│   ├── src/
│   │   ├── index.ts            # bootstrap da API
│   │   ├── env.ts              # variáveis de ambiente validadas
│   │   ├── routes/             # declaração das rotas HTTP
│   │   ├── controllers/        # parse de request / resposta
│   │   ├── services/           # regras de negócio
│   │   ├── validators/         # schemas Zod de entrada
│   │   ├── middlewares/        # auth e tratamento de erro
│   │   ├── utils/              # helpers compartilhados
│   │   ├── auth/               # configuração do Better-Auth
│   │   └── db/
│   │       ├── client.ts       # conexão Drizzle
│   │       ├── schema/         # tabelas, agrupadas por domínio
│   │       └── seeds/          # dados de demonstração
│   ├── drizzle.config.ts
│   └── .env
├── 🎨 frontend/                # App React (SPA)
│   ├── src/
│   │   ├── root.tsx            # shell da aplicação
│   │   ├── routes.ts           # configuração de rotas (file-based)
│   │   ├── pages/              # telas organizadas por feature
│   │   ├── api/                # clientes HTTP + auth-client
│   │   ├── components/
│   │   │   ├── ui/             # primitives shadcn/ui
│   │   │   └── *.tsx           # componentes compartilhados
│   │   ├── lib/                # utilitários puros
│   │   ├── styles/             # CSS global (Tailwind)
│   │   └── env.ts              # variáveis de ambiente do client
│   ├── components.json         # config shadcn
│   ├── vite.config.ts
│   ├── react-router.config.ts
│   └── .env
├── 🐳 docker-compose.yml       # PostgreSQL local
├── ⚙️ tsconfig.base.json       # TypeScript compartilhado
└── 📦 package.json             # npm workspaces
```

> O alias `@/*` aponta para `src/*` tanto no backend quanto no frontend.

---

## 🧭 Convenções de código

- 🔒 **TypeScript strict** em todo o stack, ESM, apenas named exports.
- 🌐 **Backend** com nomes de domínio em português; **frontend** em inglês.
- 🧱 Validação de entrada com **Zod** apenas no boundary (controllers); internamente, confia-se nos tipos.
- 🔑 Variáveis de ambiente só são lidas via `env.ts` (nunca `process.env` / `import.meta.env` diretos).

---

## ⚠️ Observações

- 🐘 O **PostgreSQL precisa estar no ar** antes de qualquer comando `db:*` (`npm run db:start`).
