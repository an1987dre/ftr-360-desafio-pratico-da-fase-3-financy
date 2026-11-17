import type { Category, PrismaClient } from "@prisma/client";
import { notFound } from "../../../lib/errors.js";

export type CategoryStats = { transactionsCount: number; totalAmount: number };
export type CategoryWithStats = Category & CategoryStats;

/** Busca uma categoria do usuário ou lança NOT_FOUND (RN-04). */
export async function findOwnedCategory(prisma: PrismaClient, id: string, userId: string) {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) throw notFound("Categoria não encontrada");
  return category;
}

/** Quantidade e saldo (receitas − despesas, em centavos) por categoria, em uma única consulta. */
export async function statsByCategory(
  prisma: PrismaClient,
  userId: string,
  categoryIds?: string[],
): Promise<Map<string, CategoryStats>> {
  const groups = await prisma.transaction.groupBy({
    by: ["categoryId", "type"],
    where: {
      userId,
      categoryId: categoryIds ? { in: categoryIds } : { not: null },
    },
    _count: { _all: true },
    _sum: { amount: true },
  });

  const stats = new Map<string, CategoryStats>();
  for (const group of groups) {
    if (!group.categoryId) continue;
    const current = stats.get(group.categoryId) ?? { transactionsCount: 0, totalAmount: 0 };
    const sum = group._sum.amount ?? 0;
    current.transactionsCount += group._count._all;
    current.totalAmount += group.type === "INCOME" ? sum : -sum;
    stats.set(group.categoryId, current);
  }
  return stats;
}

export function withStats(category: Category, stats?: CategoryStats): CategoryWithStats {
  return { ...category, transactionsCount: stats?.transactionsCount ?? 0, totalAmount: stats?.totalAmount ?? 0 };
}
