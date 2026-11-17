# Financy

Aplicação FullStack de gestão de finanças pessoais: transações (receitas e despesas) organizadas por categorias. Desafio final da Fase 3 da Pós FTR-360 (Rocketseat).

## Funcionalidades

- Criar conta e fazer login (JWT)
- Cada pessoa vê e gerencia **apenas os próprios dados**
- Criar, listar, editar e excluir **transações**, com busca, filtros por tipo, categoria e mês, e paginação
- Criar, listar, editar e excluir **categorias**, com ícone e cor
- Dashboard com saldo total, receitas e despesas do mês, transações recentes e categorias mais usadas
- Perfil com edição de nome e logout

## Stack

| | Tecnologias |
|---|---|
| **Back-end** ([`backend/`](backend/README.md)) | Node.js · TypeScript · Express · Apollo Server 4 (GraphQL) · Prisma 6 · SQLite · JWT · Zod |
| **Front-end** ([`frontend/`](frontend/README.md)) | React 19 · Vite · TypeScript · Apollo Client · React Router · Tailwind CSS 4 · Radix · React Hook Form · Zod |

## Como rodar

Pré-requisitos: Node.js 22+ e npm.

### 1. Back-end

```bash
cd backend
cp .env.example .env        # preencha JWT_SECRET (ex.: openssl rand -hex 32)
npm install
npx prisma migrate dev
npm run db:seed             # opcional: cria o usuário demo
npm run dev                 # http://localhost:4000/graphql
```

### 2. Front-end (em outro terminal)

```bash
cd frontend
cp .env.example .env        # VITE_BACKEND_URL=http://localhost:4000/graphql
npm install
npm run dev                 # http://localhost:5173
```

### Usuário demo

Depois do `npm run db:seed`: **demo@financy.com** / **12345678**, com 7 categorias e lançamentos dos últimos 3 meses.

## Verificação

Com a API rodando, `npm run smoke` (em `backend/`) executa 55 verificações de ponta a ponta. Elas cobrem autenticação, CRUD, filtros, paginação, agregados e **isolamento entre usuários**.

## Documentação

O projeto foi especificado antes de implementado (SDD leve). As specs ficam em [`docs/`](docs/00-visao-geral.md):

| | |
|---|---|
| [Visão geral](docs/00-visao-geral.md) | Objetivo, escopo, glossário |
| [Requisitos](docs/01-requisitos.md) | RF, RN, RNF |
| [Arquitetura](docs/02-arquitetura.md) | Stack, pastas, autenticação, erros |
| [Modelo de dados](docs/03-modelo-de-dados.md) | Entidades e invariantes |
| [Contrato GraphQL](docs/04-contrato-graphql.md) | Schema SDL e exemplos |
| [Front-end](docs/05-frontend.md) | Páginas, dialogs, design system |
| [Plano](docs/06-plano.md) | Tarefas, critérios de aceite e checklist de entrega |
| [ADRs](docs/adr/) | Decisões arquiteturais |

## Layout

[Figma: Financy (Community)](https://www.figma.com/design/iWfw0Mlm3ejpDxpiYsKJ9S/Financy--Community-?node-id=3101-371)
