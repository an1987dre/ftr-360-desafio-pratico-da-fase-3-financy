import type { Prisma } from "@prisma/client";
import { type Context, requireUser } from "../../../context.js";
import { currentPeriod, monthRange, periodSchema } from "../../../lib/period.js";
import { parse } from "../../../lib/validation.js";

async function totalsByType(ctx: Context, where: Prisma.TransactionWhereInput) {
  const groups = await ctx.prisma.transaction.groupBy({
    by: ["type"],
    where,
    _sum: { amount: true },
  });
  const sumOf = (type: string) => groups.find((group) => group.type === type)?._sum.amount ?? 0;
  return { income: sumOf("INCOME"), expense: sumOf("EXPENSE") };
}

export const summaryResolvers = {
  Query: {
    summary: async (_: unknown, args: { month?: string | null }, ctx: Context) => {
      const userId = requireUser(ctx);
      const month = parse(periodSchema, args.month ?? currentPeriod());

      const [allTime, inMonth] = await Promise.all([
        totalsByType(ctx, { userId }),
        totalsByType(ctx, { userId, date: monthRange(month) }),
      ]);

      return {
        balance: allTime.income - allTime.expense,
        monthIncome: inMonth.income,
        monthExpense: inMonth.expense,
      };
    },
  },
};
