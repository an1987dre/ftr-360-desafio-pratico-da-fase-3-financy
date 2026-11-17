# 04 — Contrato GraphQL

Endpoint único: `POST {VITE_BACKEND_URL}` (padrão `http://localhost:4000/graphql`).
Autenticação: header `Authorization: Bearer <token>` em todas as operações exceto `signUp` e `signIn`.

## Schema (SDL)

```graphql
scalar DateTime   # ISO-8601 (ex.: "2026-11-06T00:00:00.000Z")

enum TransactionType {
  INCOME
  EXPENSE
}

type User {
  id: ID!
  name: String!
  email: String!
  createdAt: DateTime!
}

type AuthPayload {
  token: String!
  user: User!
}

type Category {
  id: ID!
  title: String!
  description: String
  icon: String!
  color: String!
  "Quantidade de transações nesta categoria"
  transactionsCount: Int!
  "Soma em centavos (receitas − despesas) das transações da categoria"
  totalAmount: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Transaction {
  id: ID!
  description: String!
  "Centavos, sempre positivo"
  amount: Int!
  type: TransactionType!
  date: DateTime!
  category: Category
  createdAt: DateTime!
  updatedAt: DateTime!
}

type TransactionPage {
  items: [Transaction!]!
  total: Int!
  page: Int!
  perPage: Int!
  totalPages: Int!
}

type Summary {
  "Saldo de todas as transações (centavos)"
  balance: Int!
  "Receitas no mês de referência (centavos)"
  monthIncome: Int!
  "Despesas no mês de referência (centavos)"
  monthExpense: Int!
}

input SignUpInput {
  name: String!
  email: String!
  password: String!
}

input SignInInput {
  email: String!
  password: String!
}

input UpdateProfileInput {
  name: String!
}

input CategoryInput {
  title: String!
  description: String
  icon: String!
  color: String!
}

input TransactionInput {
  description: String!
  amount: Int!
  type: TransactionType!
  date: DateTime!
  categoryId: ID
}

input TransactionFilter {
  "Busca por descrição (contém, sem diferenciar maiúsculas)"
  search: String
  type: TransactionType
  categoryId: ID
  "Mês no formato YYYY-MM"
  period: String
}

type Query {
  me: User!
  categories: [Category!]!
  category(id: ID!): Category!
  transactions(filter: TransactionFilter, page: Int = 1, perPage: Int = 10): TransactionPage!
  transaction(id: ID!): Transaction!
  "Últimas N transações para o Dashboard"
  recentTransactions(limit: Int = 5): [Transaction!]!
  "month no formato YYYY-MM; padrão: mês atual"
  summary(month: String): Summary!
}

type Mutation {
  signUp(input: SignUpInput!): AuthPayload!
  signIn(input: SignInInput!): AuthPayload!
  updateProfile(input: UpdateProfileInput!): User!

  createCategory(input: CategoryInput!): Category!
  updateCategory(id: ID!, input: CategoryInput!): Category!
  deleteCategory(id: ID!): Boolean!

  createTransaction(input: TransactionInput!): Transaction!
  updateTransaction(id: ID!, input: TransactionInput!): Transaction!
  deleteTransaction(id: ID!): Boolean!
}
```

> `updateX` recebe o objeto completo (`input` igual ao de criação): o dialog de edição sempre envia todos os campos, o que simplifica validação e evita estados parciais.

## Rastreabilidade

| Operação | Requisito |
|---|---|
| `signUp` | RF-B01 |
| `signIn` | RF-B02 |
| `me`, `updateProfile` | RF-B12, RF-B13 |
| `createTransaction` / `updateTransaction` / `deleteTransaction` / `transactions` | RF-B04 / B06 / B05 / B07 |
| `createCategory` / `updateCategory` / `deleteCategory` / `categories` | RF-B08 / B10 / B09 / B11 |
| `summary`, `recentTransactions`, `Category.transactionsCount/totalAmount` | RF-B14, RF-B15 |
| Filtro `userId` em todos os resolvers | RF-B03 |

## Validações (Zod, no servidor)

| Campo | Regra | Mensagem |
|---|---|---|
| `name` | 2–100 chars após trim | "Informe seu nome" |
| `email` | e-mail válido | "E-mail inválido" |
| `password` | ≥ 8 chars | "A senha deve ter no mínimo 8 caracteres" |
| `title` (categoria) | 1–100 chars | "Informe o título" |
| `description` (categoria) | ≤ 255 chars, opcional | — |
| `icon` / `color` | enum fixo | "Ícone inválido" / "Cor inválida" |
| `description` (transação) | 1–100 chars | "Informe a descrição" |
| `amount` | inteiro > 0 | "Informe um valor maior que zero" |
| `date` | data válida | "Data inválida" |
| `categoryId` | pertence ao usuário | `NOT_FOUND` "Categoria não encontrada" |
| `period` / `month` | `/^\d{4}-(0[1-9]|1[0-2])$/` | "Período inválido" |
| `perPage` | 1–50 | — |

## Exemplos

```graphql
mutation {
  signIn(input: { email: "demo@financy.com", password: "12345678" }) {
    token
    user { id name email }
  }
}
```

```graphql
query Dashboard {
  summary { balance monthIncome monthExpense }
  recentTransactions(limit: 5) { id description amount type date category { id title icon color } }
  categories { id title icon color transactionsCount totalAmount }
}
```

```graphql
mutation {
  createTransaction(input: {
    description: "Supermercado"
    amount: 15990
    type: EXPENSE
    date: "2026-11-05T00:00:00.000Z"
    categoryId: "ckx..."
  }) { id }
}
```

## Erros

Formato padrão GraphQL; o front usa `extensions.code`:

```json
{
  "errors": [{
    "message": "Categoria não encontrada",
    "extensions": { "code": "NOT_FOUND" }
  }],
  "data": null
}
```

Códigos: ver [02-arquitetura › Tratamento de erros](02-arquitetura.md#tratamento-de-erros).
