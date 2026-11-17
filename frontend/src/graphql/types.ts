/** Tipos do contrato GraphQL (docs/04-contrato-graphql.md). Valores monetários em centavos. */

export type TransactionType = "INCOME" | "EXPENSE";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthPayload = { token: string; user: User };

export type Category = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  transactionsCount: number;
  totalAmount: number;
};

export type CategoryInput = {
  title: string;
  description?: string | null;
  icon: string;
  color: string;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: Pick<Category, "id" | "title" | "icon" | "color"> | null;
};

export type TransactionInput = {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId?: string | null;
};

export type TransactionFilter = {
  search?: string | null;
  type?: TransactionType | null;
  categoryId?: string | null;
  period?: string | null;
};

export type TransactionPage = {
  items: Transaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type Summary = { balance: number; monthIncome: number; monthExpense: number };
