import { z } from "zod";
import { periodSchema } from "../../../lib/period.js";

export const transactionTypeSchema = z.enum(["INCOME", "EXPENSE"]);

export const transactionInputSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Informe a descrição")
    .max(100, "A descrição deve ter no máximo 100 caracteres"),
  amount: z
    .number({ invalid_type_error: "Informe um valor maior que zero" })
    .int("O valor deve estar em centavos")
    .positive("Informe um valor maior que zero"), // RN-06
  type: transactionTypeSchema,
  date: z.date({ invalid_type_error: "Data inválida" }),
  categoryId: z.string().min(1).nullish().transform((value) => value ?? null),
});

export const transactionFilterSchema = z
  .object({
    search: z.string().trim().max(100).nullish(),
    type: transactionTypeSchema.nullish(),
    categoryId: z.string().min(1).nullish(),
    period: periodSchema.nullish(),
  })
  .nullish();

export const paginationSchema = z.object({
  page: z.number().int().min(1, "Página inválida"),
  perPage: z.number().int().min(1).max(50, "Máximo de 50 itens por página"),
});
