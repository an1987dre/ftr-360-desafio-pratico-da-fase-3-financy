import { GraphQLError } from "graphql";
import type { ZodError } from "zod";

export const ErrorCode = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  BAD_USER_INPUT: "BAD_USER_INPUT",
  CONFLICT: "CONFLICT",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Códigos cuja mensagem pode ser exposta ao cliente. */
export const PUBLIC_ERROR_CODES: ReadonlySet<string> = new Set([
  ErrorCode.UNAUTHENTICATED,
  ErrorCode.BAD_USER_INPUT,
  ErrorCode.CONFLICT,
  ErrorCode.NOT_FOUND,
  "GRAPHQL_PARSE_FAILED",
  "GRAPHQL_VALIDATION_FAILED",
  "BAD_REQUEST",
  "PERSISTED_QUERY_NOT_FOUND",
  "PERSISTED_QUERY_NOT_SUPPORTED",
  "OPERATION_RESOLUTION_FAILURE",
]);

function appError(code: ErrorCode, message: string, extra: Record<string, unknown> = {}) {
  return new GraphQLError(message, { extensions: { code, ...extra } });
}

export function unauthenticated(message = "Não autenticado") {
  return appError(ErrorCode.UNAUTHENTICATED, message);
}

export function notFound(message = "Registro não encontrado") {
  return appError(ErrorCode.NOT_FOUND, message);
}

export function conflict(message: string) {
  return appError(ErrorCode.CONFLICT, message);
}

export function badUserInput(message: string, fields?: Record<string, string>) {
  return appError(ErrorCode.BAD_USER_INPUT, message, fields ? { fields } : {});
}

/** Converte um ZodError em BAD_USER_INPUT com a 1ª mensagem e o mapa campo → mensagem. */
export function fromZodError(error: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    fields[key] ??= issue.message;
  }
  return badUserInput(error.issues[0]?.message ?? "Dados inválidos", fields);
}
