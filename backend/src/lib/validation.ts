import type { z } from "zod";
import { fromZodError } from "./errors.js";

/** Valida `data` com o schema; em caso de erro lança BAD_USER_INPUT (RNF-09). */
export function parse<T extends z.ZodTypeAny>(schema: T, data: unknown): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) throw fromZodError(result.error);
  return result.data;
}
