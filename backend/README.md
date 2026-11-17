# Financy — Back-end

API GraphQL do Financy: Node.js + TypeScript, Express, Apollo Server 4, Prisma 6 e SQLite.
Especificação: [`../docs`](../docs/00-visao-geral.md) · Contrato: [`04-contrato-graphql`](../docs/04-contrato-graphql.md).

## Rodando localmente

Pré-requisito: Node.js 22+.

```bash
cp .env.example .env              # preencha JWT_SECRET (openssl rand -hex 32)
npm install                       # também gera o Prisma Client
npx prisma migrate dev            # cria prisma/dev.db
npm run db:seed                   # opcional: demo@financy.com / 12345678
npm run dev                       # http://localhost:4000/graphql
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor com hot reload (`tsx watch`) |
| `npm run build` | Compila para `dist/` |
| `npm start` | Executa o build |
| `npm run typecheck` | Checagem de tipos |
| `npm run db:migrate` | Cria/aplica migrations em desenvolvimento |
| `npm run db:deploy` | Aplica migrations existentes |
| `npm run db:seed` | Recria o usuário demo com categorias e transações dos últimos 3 meses |
| `npm run db:studio` | Abre o Prisma Studio |
| `npm run smoke` | Teste end-to-end contra a API rodando (`API_URL` opcional) |

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `JWT_SECRET` | sim | — | Segredo dos tokens JWT (mín. 16 caracteres) |
| `DATABASE_URL` | sim | — | Banco SQLite, relativo a `prisma/` (ex.: `file:./dev.db`) |
| `PORT` | não | `4000` | Porta HTTP |
| `CORS_ORIGIN` | não | `*` | Origens permitidas, separadas por vírgula |
| `NODE_ENV` | não | `development` | Ambiente de execução |

Se alguma variável obrigatória faltar, o processo encerra com código 1 e lista o problema.

## Endpoints

| Rota | Descrição |
|---|---|
| `POST /graphql` | API GraphQL (Apollo Sandbox em `GET /graphql` no navegador) |
| `GET /health` | Verificação de disponibilidade → `{"status":"ok"}` |

## Estrutura

```
src/
├── server.ts            # Express + Apollo + CORS + /health
├── env.ts               # validação das variáveis (Zod)
├── context.ts           # JWT → { userId, prisma }; requireUser()
├── lib/
│   ├── auth.ts          # hash/compare de senha, sign/verify de token
│   ├── errors.ts        # GraphQLError com códigos padronizados
│   ├── period.ts        # meses YYYY-MM → intervalo UTC
│   ├── validation.ts    # parse() com Zod → BAD_USER_INPUT
│   └── prisma.ts
└── graphql/
    ├── schema.graphql   # contrato SDL
    ├── scalars.ts       # DateTime
    ├── index.ts         # typeDefs + junção dos resolvers
    └── modules/
        ├── auth/        # signUp, signIn, me, updateProfile
        ├── category/    # CRUD + estatísticas por categoria
        ├── transaction/ # CRUD + filtros + paginação + recentes
        └── summary/     # saldo e totais do mês
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
scripts/
└── smoke.ts             # teste end-to-end (inclui isolamento entre usuários)
```

## Smoke test

Com a API rodando (`npm run dev`), em outro terminal:

```bash
npm run smoke
```

Cria dois usuários descartáveis e executa 55 verificações: autenticação, CRUD de categorias e transações, filtros, paginação, agregados, regras de negócio e **isolamento entre usuários** (B não lê, edita nem deleta dados de A). Encerra com código 1 se algo falhar.

## Erros

Erros esperados saem com `extensions.code` (`UNAUTHENTICATED`, `BAD_USER_INPUT`, `CONFLICT`, `NOT_FOUND`). Qualquer outro erro é registrado no log e devolvido como `INTERNAL_SERVER_ERROR` com mensagem genérica.
