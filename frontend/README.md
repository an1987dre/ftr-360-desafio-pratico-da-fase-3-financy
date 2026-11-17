# Financy — Front-end

Aplicação React do Financy: Vite + React 19 + TypeScript, Apollo Client (GraphQL), React Router, Tailwind CSS 4 e componentes no padrão shadcn/ui (Radix).
Especificação: [`../docs/05-frontend.md`](../docs/05-frontend.md) · Layout: [Figma](https://www.figma.com/design/iWfw0Mlm3ejpDxpiYsKJ9S/Financy--Community-?node-id=3101-371).

## Rodando localmente

Pré-requisitos: Node.js 22+ e a [API](../backend/README.md) rodando.

```bash
cp .env.example .env   # VITE_BACKEND_URL=http://localhost:4000/graphql
npm install
npm run dev            # http://localhost:5173
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos + build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run typecheck` | Checagem de tipos |

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_BACKEND_URL` | URL do endpoint GraphQL da API |

## Rotas

| Rota | Acesso | Conteúdo |
|---|---|---|
| `/` | todos | Login (deslogado) ou Dashboard (logado) |
| `/signup` | só deslogado | Cadastro |
| `/transactions` | privada | Transações |
| `/categories` | privada | Categorias |
| `/profile` | privada | Perfil |
| `/dev/ui` | só em `npm run dev` | Vitrine dos componentes e tokens (fora do build de produção) |

## Estrutura

```
src/
├── main.tsx / app.tsx       # providers (Apollo, Auth, Toaster) + rotas
├── styles/globals.css       # Tailwind + design tokens (@theme)
├── lib/
│   ├── apollo.ts            # client, authLink (Bearer), errorLink (sessão expirada)
│   ├── session.ts           # token no localStorage
│   ├── errors.ts            # extensions.code → mensagem amigável
│   ├── format.ts            # moeda (centavos), datas UTC, períodos
│   ├── categories.tsx       # ícones/cores de categoria (espelho do back-end)
│   └── utils.ts             # cn(), initials()
├── graphql/                 # tipos do contrato + documentos gql
├── contexts/auth.tsx        # status da sessão, user, signIn/signOut
├── routes/                  # router + guards (Home, Private, PublicOnly)
├── hooks/                   # useDebouncedValue
├── components/
│   ├── ui/                  # button, input, field, select, dialog, badge, ...
│   ├── layout/              # AppLayout, Header, PageHeader, loaders
│   └── feedback/            # estados (loading/erro/vazio) e ConfirmDialog
└── pages/
    ├── auth/                # login, cadastro, layout e campo de senha
    ├── dashboard/           # resumo, recentes e categorias mais usadas
    ├── transactions/        # página (filtros, tabela, paginação) + TransactionDialog
    ├── categories/          # página (resumo, grid) + CategoryDialog
    ├── profile/             # nome, e-mail, sair
    └── dev/                 # /dev/ui
```

## Dados e cache

- Cada mutation de transação/categoria recarrega as queries ativas `Dashboard`, `Transactions` e `Categories` (`DATA_QUERIES`): simples e sempre consistente.
- A listagem de transações mantém o resultado anterior visível enquanto o novo filtro ou página carrega.
- A sessão é remontada a cada troca de token (`key` no provider), para que nada da conta anterior apareça na nova.

## Sessão

- `signIn`/`signUp` devolvem `{ token, user }`; o token vai para o `localStorage` ([ADR-0004](../docs/adr/0004-token-em-localstorage.md)) e o usuário entra direto no cache do Apollo.
- Ao carregar a página com token, a query `me` valida a sessão.
- Qualquer `UNAUTHENTICATED` (fora de login/cadastro) encerra a sessão: limpa o token e o cache, e volta para o Login.

## Design tokens

Todos os valores visuais vêm do Style Guide do Figma e ficam em `src/styles/globals.css`. A paleta padrão do Tailwind é zerada, então uma cor fora do design system simplesmente não existe. Tabela completa e regras de uso: [`docs/05-frontend.md`](../docs/05-frontend.md#design-system-style-guide-do-figma).
