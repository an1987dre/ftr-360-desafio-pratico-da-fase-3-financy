import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Transaction, TransactionFilter, TransactionInput, TransactionPage } from "./types";

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    description
    amount
    type
    date
    category {
      id
      title
      icon
      color
    }
  }
`;

export const TRANSACTIONS: TypedDocumentNode<
  { transactions: TransactionPage },
  { filter?: TransactionFilter; page?: number; perPage?: number }
> = gql`
  query Transactions($filter: TransactionFilter, $page: Int, $perPage: Int) {
    transactions(filter: $filter, page: $page, perPage: $perPage) {
      total
      page
      perPage
      totalPages
      items {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const CREATE_TRANSACTION: TypedDocumentNode<{ createTransaction: Transaction }, { input: TransactionInput }> = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const UPDATE_TRANSACTION: TypedDocumentNode<
  { updateTransaction: Transaction },
  { id: string; input: TransactionInput }
> = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const DELETE_TRANSACTION: TypedDocumentNode<{ deleteTransaction: boolean }, { id: string }> = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;
