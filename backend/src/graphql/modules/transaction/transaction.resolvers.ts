import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { type Context, requireUser } from "../../../context.js";
import { notFound } from "../../../lib/errors.js";
import { monthRange } from "../../../lib/period.js";
import { parse } from "../../../lib/validation.js";
import { findOwnedCategory } from "../category/category.service.js";
import {
  paginationSchema,
  transactionFilterSchema,
  transactionInputSchema,
} from "./transaction.schema.js";

type IdArgs = { id: string };
type ListArgs = { filter?: unknown; page: number; perPage: number };

const include = { category: true } satisfies Prisma.TransactionInclude;
const orderBy = [{ date: "desc" }, { createdAt: "desc" }] satisfies Prisma.TransactionOrderByWithRelationInput[]; // RN-09

async function findOwnedTransaction(ctx: Context, id: string, userId: string) {
  const transaction = await ctx.prisma.transaction.findFirst({ where: { id, userId }, include });
  if (!transaction) throw notFound("Transação não encontrada");
  return transaction;
}

/** Valida input e garante que a categoria pertence ao usuário (RN-05). */
async function parseInput(ctx: Context, input: unknown, userId: string) {
  const data = parse(transactionInputSchema, input);
  if (data.categoryId) await findOwnedCategory(ctx.prisma, data.categoryId, userId);
  return data;
}

export const transactionResolvers = {
  Query: {
    transactions: async (_: unknown, args: ListArgs, ctx: Context) => {
      const userId = requireUser(ctx);
      const filter = parse(transactionFilterSchema, args.filter);
      const { page, perPage } = parse(paginationSchema, { page: args.page, perPage: args.perPage });

      const where: Prisma.TransactionWhereInput = {
        userId,
        ...(filter?.search && { description: { contains: filter.search } }),
        ...(filter?.type && { type: filter.type }),
        ...(filter?.categoryId && { categoryId: filter.categoryId }),
        ...(filter?.period && { date: monthRange(filter.period) }),
      };

      const [items, total] = await Promise.all([
        ctx.prisma.transaction.findMany({
          where,
          include,
          orderBy,
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        ctx.prisma.transaction.count({ where }),
      ]);

      return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) };
    },

    transaction: (_: unknown, { id }: IdArgs, ctx: Context) =>
      findOwnedTransaction(ctx, id, requireUser(ctx)),

    recentTransactions: (_: unknown, args: { limit: number }, ctx: Context) => {
      const userId = requireUser(ctx);
      const limit = parse(z.number().int().min(1).max(20, "Máximo de 20 transações"), args.limit);
      return ctx.prisma.transaction.findMany({ where: { userId }, include, orderBy, take: limit });
    },
  },

  Mutation: {
    createTransaction: async (_: unknown, { input }: { input: unknown }, ctx: Context) => {
      const userId = requireUser(ctx);
      const data = await parseInput(ctx, input, userId);
      return ctx.prisma.transaction.create({ data: { ...data, userId }, include });
    },

    updateTransaction: async (_: unknown, { id, input }: IdArgs & { input: unknown }, ctx: Context) => {
      const userId = requireUser(ctx);
      await findOwnedTransaction(ctx, id, userId);
      const data = await parseInput(ctx, input, userId);
      return ctx.prisma.transaction.update({ where: { id }, data, include });
    },

    deleteTransaction: async (_: unknown, { id }: IdArgs, ctx: Context) => {
      const userId = requireUser(ctx);
      await findOwnedTransaction(ctx, id, userId);
      await ctx.prisma.transaction.delete({ where: { id } });
      return true;
    },
  },
};
