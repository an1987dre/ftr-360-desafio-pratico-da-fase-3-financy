import { ApolloError } from "@apollo/client";

/** Primeiro código de erro GraphQL (`extensions.code`), se houver. */
export function errorCode(error: unknown): string | undefined {
  if (error instanceof ApolloError) {
    return error.graphQLErrors[0]?.extensions?.code as string | undefined;
  }
  return undefined;
}

/** Mensagem amigável para exibir em toast. */
export function errorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente."): string {
  if (error instanceof ApolloError) {
    if (error.networkError) return "Não foi possível conectar ao servidor.";
    const first = error.graphQLErrors[0];
    if (first && first.extensions?.code !== "INTERNAL_SERVER_ERROR") return first.message;
  }
  return fallback;
}
