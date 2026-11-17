import { gql, type TypedDocumentNode } from "@apollo/client";
import { CATEGORY_FIELDS } from "./categories";
import { TRANSACTION_FIELDS } from "./transactions";
import type { Category, Summary, Transaction } from "./types";

export const DASHBOARD: TypedDocumentNode<{
  summary: Summary;
  recentTransactions: Transaction[];
  categories: Category[];
}> = gql`
  query Dashboard {
    summary {
      balance
      monthIncome
      monthExpense
    }
    recentTransactions(limit: 5) {
      ...TransactionFields
    }
    categories {
      ...CategoryFields
    }
  }
  ${TRANSACTION_FIELDS}
  ${CATEGORY_FIELDS}
`;

/**
 * Queries ativas a recarregar após qualquer mutation de transação/categoria.
 * Recarregar tudo é simples e correto para o volume do desafio (docs/05-frontend.md).
 */
export const DATA_QUERIES = ["Dashboard", "Transactions", "Categories"];
