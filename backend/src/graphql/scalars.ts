import { GraphQLError, GraphQLScalarType, Kind } from "graphql";

function toDate(value: unknown): Date {
  const date = value instanceof Date ? value : new Date(value as string);
  if (typeof value !== "string" && !(value instanceof Date)) {
    throw new GraphQLError("Data inválida", { extensions: { code: "BAD_USER_INPUT" } });
  }
  if (Number.isNaN(date.getTime())) {
    throw new GraphQLError("Data inválida", { extensions: { code: "BAD_USER_INPUT" } });
  }
  return date;
}

/** Data/hora em ISO-8601. */
export const DateTime = new GraphQLScalarType<Date, string>({
  name: "DateTime",
  description: "Data/hora em ISO-8601 (ex.: 2026-11-06T00:00:00.000Z)",
  serialize: (value) => toDate(value).toISOString(),
  parseValue: (value) => toDate(value),
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError("Data inválida", { extensions: { code: "BAD_USER_INPUT" } });
    }
    return toDate(ast.value);
  },
});
