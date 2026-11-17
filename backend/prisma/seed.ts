/**
 * Popula o banco com um usuário demo (T-24). Idempotente: recria o usuário a cada execução.
 *   demo@financy.com / 12345678
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO = { name: "Usuário Demo", email: "demo@financy.com", password: "12345678" };

const CATEGORIES = [
  { key: "salario", title: "Salário", description: "Renda mensal", icon: "briefcase-business", color: "green" },
  { key: "alimentacao", title: "Alimentação", description: "Restaurantes e delivery", icon: "utensils", color: "blue" },
  { key: "mercado", title: "Mercado", description: "Compras do mês", icon: "shopping-cart", color: "orange" },
  { key: "transporte", title: "Transporte", description: "Combustível e aplicativos", icon: "car-front", color: "purple" },
  { key: "saude", title: "Saúde", description: "Farmácia e consultas", icon: "heart-pulse", color: "red" },
  { key: "lazer", title: "Lazer", description: "Cinema, shows e passeios", icon: "ticket", color: "pink" },
  { key: "investimento", title: "Investimento", description: "Aplicações financeiras", icon: "piggy-bank", color: "yellow" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

/** [dia do mês, descrição, valor em centavos, tipo, categoria] — repetido nos 3 últimos meses. */
const MONTHLY: Array<[number, string, number, "INCOME" | "EXPENSE", CategoryKey | null]> = [
  [5, "Salário", 850000, "INCOME", "salario"],
  [6, "Aluguel", 220000, "EXPENSE", null],
  [8, "Supermercado", 64390, "EXPENSE", "mercado"],
  [10, "Combustível", 25000, "EXPENSE", "transporte"],
  [12, "Jantar fora", 18750, "EXPENSE", "alimentacao"],
  [15, "Aplicação CDB", 100000, "EXPENSE", "investimento"],
  [18, "Farmácia", 8920, "EXPENSE", "saude"],
  [20, "Freelance", 120000, "INCOME", "salario"],
  [22, "Cinema", 6400, "EXPENSE", "lazer"],
  [25, "Delivery", 7590, "EXPENSE", "alimentacao"],
];

function utcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day));
}

async function main() {
  await prisma.user.deleteMany({ where: { email: DEMO.email } }); // cascade limpa os dados

  const user = await prisma.user.create({
    data: { ...DEMO, password: await bcrypt.hash(DEMO.password, 10) },
  });

  const categoryIds = new Map<CategoryKey, string>();
  for (const { key, ...data } of CATEGORIES) {
    const category = await prisma.category.create({ data: { ...data, userId: user.id } });
    categoryIds.set(key, category.id);
  }

  const today = new Date();
  const transactions = [];
  for (let offset = 2; offset >= 0; offset--) {
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth() - offset;
    for (const [day, description, amount, type, key] of MONTHLY) {
      const date = utcDate(year, month, day);
      if (date > today) continue; // sem lançamentos futuros
      transactions.push({
        description,
        amount,
        type,
        date,
        categoryId: key ? categoryIds.get(key)! : null,
        userId: user.id,
      });
    }
  }
  await prisma.transaction.createMany({ data: transactions });

  console.log(`✅ Seed: ${DEMO.email} / ${DEMO.password} — ${CATEGORIES.length} categorias, ${transactions.length} transações`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
