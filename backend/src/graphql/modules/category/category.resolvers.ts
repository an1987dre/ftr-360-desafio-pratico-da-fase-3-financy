import type { Category } from "@prisma/client";
import { type Context, requireUser } from "../../../context.js";
import { parse } from "../../../lib/validation.js";
import { categoryInputSchema } from "./category.schema.js";
import {
  type CategoryWithStats,
  findOwnedCategory,
  statsByCategory,
  withStats,
} from "./category.service.js";

type IdArgs = { id: string };

/** Resolve estatísticas sob demanda quando a categoria não veio de `categories`. */
async function resolveStat(
  category: Category | CategoryWithStats,
  key: "transactionsCount" | "totalAmount",
  ctx: Context,
) {
  if (key in category) return (category as CategoryWithStats)[key];
  const stats = await statsByCategory(ctx.prisma, category.userId, [category.id]);
  return withStats(category, stats.get(category.id))[key];
}

export const categoryResolvers = {
  Query: {
    categories: async (_: unknown, __: unknown, ctx: Context) => {
      const userId = requireUser(ctx);
      const [categories, stats] = await Promise.all([
        ctx.prisma.category.findMany({ where: { userId }, orderBy: { title: "asc" } }),
        statsByCategory(ctx.prisma, userId),
      ]);
      return categories.map((category) => withStats(category, stats.get(category.id)));
    },

    category: (_: unknown, { id }: IdArgs, ctx: Context) =>
      findOwnedCategory(ctx.prisma, id, requireUser(ctx)),
  },

  Mutation: {
    createCategory: (_: unknown, { input }: { input: unknown }, ctx: Context) => {
      const userId = requireUser(ctx);
      const data = parse(categoryInputSchema, input);
      return ctx.prisma.category.create({ data: { ...data, userId } });
    },

    updateCategory: async (_: unknown, { id, input }: IdArgs & { input: unknown }, ctx: Context) => {
      const userId = requireUser(ctx);
      const data = parse(categoryInputSchema, input);
      await findOwnedCategory(ctx.prisma, id, userId);
      return ctx.prisma.category.update({ where: { id }, data });
    },

    deleteCategory: async (_: unknown, { id }: IdArgs, ctx: Context) => {
      const userId = requireUser(ctx);
      await findOwnedCategory(ctx.prisma, id, userId);
      await ctx.prisma.category.delete({ where: { id } }); // transações ficam sem categoria (RN-07)
      return true;
    },
  },

  Category: {
    transactionsCount: (category: Category, _: unknown, ctx: Context) =>
      resolveStat(category, "transactionsCount", ctx),
    totalAmount: (category: Category, _: unknown, ctx: Context) =>
      resolveStat(category, "totalAmount", ctx),
  },
};
