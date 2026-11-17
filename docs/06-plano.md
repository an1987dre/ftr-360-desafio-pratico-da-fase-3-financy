# 06 — Plano de implementação

Cada tarefa tem ID (`T-xx`), requisitos cobertos e **critério de aceite** verificável. Uma branch/PR por fase (`feature/<fase>`), com a spec atualizada no mesmo PR quando algo mudar.

## Fase 0 — Especificação (esta branch: `feature/docs`)

| ID | Tarefa | Aceite |
|---|---|---|
| T-00 | Specs em `docs/` (visão, requisitos, arquitetura, dados, contrato, front-end, plano, ADRs) | Revisadas e mergeadas na `main` |
| T-01 | README raiz com visão geral e passo a passo para rodar | Pessoa nova roda o projeto só com o README |

## Fase 1 — Back-end base (`feature/backend-setup`)

| ID | Tarefa | Req. | Aceite |
|---|---|---|---|
| T-10 | Scaffold `backend/` (TS, tsx, scripts, tsconfig, `.gitignore`) | RNF-01 | `npm run dev` sobe sem erro |
| T-11 | `.env.example` + `env.ts` validando variáveis com Zod | RNF-05 | Faltando `JWT_SECRET` → processo falha com mensagem clara |
| T-12 | Prisma + schema de [03](03-modelo-de-dados.md) + migration inicial | RNF-03 | `npx prisma migrate dev` cria `dev.db` |
| T-13 | Express + Apollo Server + CORS + `context` com JWT | RNF-02, RNF-04 | `POST /graphql` responde; requisição de outra origem permitida |
| T-14 | Helpers de erro (`UNAUTHENTICATED`, `BAD_USER_INPUT`, `NOT_FOUND`, `CONFLICT`) | — | Erros com `extensions.code` corretos |

## Fase 2 — Back-end features (`feature/backend-features`)

| ID | Tarefa | Req. | Aceite |
|---|---|---|---|
| T-20 | `signUp`, `signIn`, `me`, `updateProfile` | RF-B01, B02, B12, B13 | Senha salva como hash; login retorna token; e-mail duplicado → `CONFLICT` |
| T-21 | CRUD de categorias + `transactionsCount`/`totalAmount` | RF-B08–B11, B15 | Operações funcionam; outro usuário recebe `NOT_FOUND` |
| T-22 | CRUD de transações + filtros + paginação | RF-B04–B07 | Ordenação por data desc; filtros combináveis; categoria de outro usuário → `NOT_FOUND` |
| T-23 | `summary` e `recentTransactions` | RF-B14 | Valores batem com soma manual no seed |
| T-24 | Seed com usuário demo | RNF-08 | `npm run db:seed` popula dados |
| T-25 | Smoke test end-to-end (`npm run smoke`), incluindo isolamento: B não lê/edita/deleta dados de A | RF-B03 | Script termina sem falhas |

## Fase 3 — Front-end base (`feature/frontend-setup`)

| ID | Tarefa | Req. | Aceite |
|---|---|---|---|
| T-30 | Scaffold Vite React TS + Tailwind 4 + alias `@/` + `.env.example` | RNF-06, RNF-07 | `npm run dev` abre em :5173 |
| T-31 | Extrair tokens do Style Guide do [Figma](https://www.figma.com/design/iWfw0Mlm3ejpDxpiYsKJ9S/Financy--Community-?node-id=3101-371) para o `@theme` + fonte; ajustar listas de ícones/cores de categoria | RF-F13 | Cores/fontes idênticas ao Figma; listas sincronizadas com o back (I-7) ✅ (tokens, ícones e logo do export do Style Guide) |
| T-32 | Componentes `ui/` (Button, Input, Label, Select, Dialog, Badge, Card, Avatar, Pagination) | RF-F13 | Página interna de preview com todos os estados |
| T-33 | Apollo Client (authLink, errorLink) + `AuthContext` + rotas públicas/privadas | RF-F02, F03, F12 | Sem token, `/transactions` → `/`; 401 desloga |

## Fase 4 — Front-end páginas (`feature/frontend-pages`)

| ID | Tarefa | Req. | Aceite |
|---|---|---|---|
| T-40 | Login e Cadastro | RF-F01 | Fluxo completo com validação e erros do servidor |
| T-41 | `AppLayout` (header + nav + avatar) | RF-F13 | Item ativo destacado; avatar leva a `/profile` |
| T-42 | Dialog de Categoria + página Categorias | RF-F08–F11 | CRUD completo refletido sem reload |
| T-43 | Dialog de Transação + página Transações (filtros, paginação) | RF-F04–F07 | CRUD completo; filtros e paginação funcionam |
| T-44 | Dashboard | RF-F02 | Cards, recentes e categorias com dados reais |
| T-45 | Perfil + logout | RF-F14 | Nome atualizado reflete no header; logout limpa cache |
| T-46 | Estados loading/erro/vazio em todas as páginas | — | Verificado com usuário sem dados e com filtros sem resultado |

## Fase 5 — Entrega (`feature/release`)

| ID | Tarefa | Aceite |
|---|---|---|
| T-50 | Revisão pixel a pixel contra o Figma (screenshot lado a lado de cada tela) | Divergências anotadas e corrigidas ✅ (8 telas do export; única divergência consciente: data padrão no dialog) |
| T-51 | Conferir os 24 itens do checklist (tabela abaixo) | Todos ✅ |
| T-52 | Clonar do zero em outra pasta e seguir o README | Sobe back + front e loga com usuário demo ✅ |
| T-53 | Repositório público, `main` atualizada | Link enviado na plataforma. **Pendente:** o repositório atual é privado numa conta corporativa gerenciada (EMU), que não permite repositórios públicos |

## Checklist de entrega

| # | Item | Requisito | Tarefa | ✅ |
|---|---|---|---|---|
| BE-1 | Criar conta e fazer login | RF-B01, B02 | T-20 | ✅ |
| BE-2 | Ver/gerenciar só os próprios dados | RF-B03 | T-21, T-22, T-25 | ✅ |
| BE-3 | Criar transação | RF-B04 | T-22 | ✅ |
| BE-4 | Deletar transação | RF-B05 | T-22 | ✅ |
| BE-5 | Editar transação | RF-B06 | T-22 | ✅ |
| BE-6 | Listar transações | RF-B07 | T-22 | ✅ |
| BE-7 | Criar categoria | RF-B08 | T-21 | ✅ |
| BE-8 | Deletar categoria | RF-B09 | T-21 | ✅ |
| BE-9 | Editar categoria | RF-B10 | T-21 | ✅ |
| BE-10 | Listar categorias | RF-B11 | T-21 | ✅ |
| FE-1 | Criar conta e fazer login | RF-F01, F02 | T-40 | ✅ |
| FE-2 | Ver/gerenciar só os próprios dados | RF-F03 | T-33, T-45 | ✅ |
| FE-3 | Criar transação | RF-F04 | T-43 | ✅ |
| FE-4 | Deletar transação | RF-F05 | T-43 | ✅ |
| FE-5 | Editar transação | RF-F06 | T-43 | ✅ |
| FE-6 | Listar transações | RF-F07 | T-43 | ✅ |
| FE-7 | Criar categoria | RF-F08 | T-42 | ✅ |
| FE-8 | Deletar categoria | RF-F09 | T-42 | ✅ |
| FE-9 | Editar categoria | RF-F10 | T-42 | ✅ |
| FE-10 | Listar categorias | RF-F11 | T-42 | ✅ |
| FE-11 | React + GraphQL + Vite | RF-F12 | T-30, T-33 | ✅ |
| FE-12 | Fiel ao Figma | RF-F13 | T-31, T-32, T-50 | ✅ |

(O checklist da plataforma mostra 24 itens porque conta os títulos "[Back-end]" e "[Front-end]".)

**Evidências (Fase 5):**
- **BE-1 a BE-10:** `npm run smoke`, 55/55 verificações, incluindo o bloco de isolamento entre usuários.
- **FE-1 a FE-11:** E2E em Chrome headless, 42/42, e teste de rotas, 15/15. Ambos rodaram também contra um **clone limpo** configurado só pelos READMEs (T-52).
- **FE-12:** tokens, ícones e logo do Style Guide (T-31, PR #7) e as 8 telas comparadas lado a lado com o export do Figma (T-50, PR #8). Única divergência consciente: a data do dialog de transação vem preenchida com hoje.

**Requisitos não funcionais conferidos:** TypeScript em todo `src/`; GraphQL no back e no front, sem nenhum `fetch` manual; Prisma + SQLite; CORS habilitado; Vite sem framework; `.env.example` com `JWT_SECRET`, `DATABASE_URL` e `VITE_BACKEND_URL`.

## Pós-entrega (branch separada, opcional)

Upload de avatar, Docker Compose, testes automatizados (Vitest) e CI no GitHub Actions — nunca na `main` antes da correção.
