import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { PUBLIC_OPERATIONS } from "@/graphql/auth";
import { session } from "./session";

let handleUnauthenticated: () => void = () => {};

/** O AuthProvider registra aqui o que fazer quando a sessão expira (RN-10). */
export function onUnauthenticated(handler: () => void) {
  handleUnauthenticated = handler;
}

const httpLink = new HttpLink({ uri: import.meta.env.VITE_BACKEND_URL });

const authLink = setContext((_, { headers }) => {
  const token = session.getToken();
  return { headers: { ...headers, ...(token && { authorization: `Bearer ${token}` }) } };
});

const errorLink = onError(({ graphQLErrors, operation }) => {
  const expired = graphQLErrors?.some((error) => error.extensions?.code === "UNAUTHENTICATED");
  if (expired && !PUBLIC_OPERATIONS.has(operation.operationName)) handleUnauthenticated();
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      // Resultado paginado depende dos argumentos; não mesclar páginas.
      Query: { fields: { transactions: { keyArgs: ["filter", "page", "perPage"] } } },
    },
  }),
});
