/**
 * Smoke test end-to-end da API (T-25). Requer a API rodando.
 *   npm run smoke                       # usa http://localhost:4000/graphql
 *   API_URL=http://host/graphql npm run smoke
 * Cria dois usuários descartáveis (A e B) e verifica CRUD, regras e isolamento.
 */
const API_URL = process.env.API_URL ?? "http://localhost:4000/graphql";

type GqlError = { message: string; extensions?: { code?: string } };
type GqlResult<T> = { data?: T; errors?: GqlError[] };

let passed = 0;
const failures: string[] = [];

async function gql<T = any>(query: string, variables: object = {}, token?: string): Promise<GqlResult<T>> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "content-type": "application/json", ...(token && { authorization: `Bearer ${token}` }) },
    body: JSON.stringify({ query, variables }),
  });
  return res.json() as Promise<GqlResult<T>>;
}

function check(name: string, condition: boolean, detail?: unknown) {
  if (condition) {
    passed++;
    console.log(`  ✔ ${name}`);
  } else {
    failures.push(name);
    console.log(`  ✘ ${name}`, detail !== undefined ? JSON.stringify(detail) : "");
  }
}

function errorCode(result: GqlResult<unknown>) {
  return result.errors?.[0]?.extensions?.code;
}

async function expectData<T>(name: string, promise: Promise<GqlResult<T>>): Promise<T> {
  const result = await promise;
  check(name, !result.errors && !!result.data, result.errors);
  return result.data as T;
}

async function expectError(name: string, promise: Promise<GqlResult<unknown>>, code: string) {
  const result = await promise;
  check(`${name} → ${code}`, errorCode(result) === code, result.errors ?? result.data);
}

const SIGN_UP = `mutation($input: SignUpInput!) { signUp(input: $input) { token user { id name email } } }`;
const SIGN_IN = `mutation($input: SignInInput!) { signIn(input: $input) { token user { id } } }`;
const CREATE_CATEGORY = `mutation($input: CategoryInput!) { createCategory(input: $input) { id title icon color transactionsCount totalAmount } }`;
const UPDATE_CATEGORY = `mutation($id: ID!, $input: CategoryInput!) { updateCategory(id: $id, input: $input) { id title } }`;
const DELETE_CATEGORY = `mutation($id: ID!) { deleteCategory(id: $id) }`;
const CATEGORIES = `{ categories { id title transactionsCount totalAmount } }`;
const CATEGORY = `query($id: ID!) { category(id: $id) { id transactionsCount totalAmount } }`;
const CREATE_TX = `mutation($input: TransactionInput!) { createTransaction(input: $input) { id amount type date category { id } } }`;
const UPDATE_TX = `mutation($id: ID!, $input: TransactionInput!) { updateTransaction(id: $id, input: $input) { id description amount } }`;
const DELETE_TX = `mutation($id: ID!) { deleteTransaction(id: $id) }`;
const TX = `query($id: ID!) { transaction(id: $id) { id category { id } } }`;
const TXS = `query($filter: TransactionFilter, $page: Int, $perPage: Int) {
  transactions(filter: $filter, page: $page, perPage: $perPage) { total page perPage totalPages items { id description date } }
}`;
const SUMMARY = `query($month: String) { summary(month: $month) { balance monthIncome monthExpense } }`;

async function main() {
  console.log(`Smoke test → ${API_URL}\n`);
  const suffix = Date.now();
  const emailA = `smoke-a-${suffix}@financy.test`;
  const emailB = `smoke-b-${suffix}@financy.test`;
  const category = { title: "Mercado", description: "Compras", icon: "shopping-cart", color: "orange" };

  console.log("Autenticação (RF-B01, RF-B02, RF-B12, RF-B13)");
  const a = await expectData<any>("signUp A", gql(SIGN_UP, { input: { name: "Smoke A", email: emailA.toUpperCase(), password: "12345678" } }));
  check("e-mail salvo em minúsculas (RN-01)", a?.signUp.user.email === emailA);
  const b = await expectData<any>("signUp B", gql(SIGN_UP, { input: { name: "Smoke B", email: emailB, password: "12345678" } }));
  const tokenA: string = a.signUp.token;
  const tokenB: string = b.signUp.token;
  await expectError("signUp com e-mail repetido", gql(SIGN_UP, { input: { name: "Smoke X", email: emailA, password: "12345678" } }), "CONFLICT");
  await expectError("signUp com senha curta", gql(SIGN_UP, { input: { name: "Xx", email: `x-${suffix}@financy.test`, password: "123" } }), "BAD_USER_INPUT");
  await expectError("signIn com senha errada", gql(SIGN_IN, { input: { email: emailA, password: "errada123" } }), "UNAUTHENTICATED");
  await expectData("signIn válido", gql(SIGN_IN, { input: { email: emailA, password: "12345678" } }));
  await expectError("me sem token", gql(`{ me { id } }`), "UNAUTHENTICATED");
  await expectError("me com token inválido", gql(`{ me { id } }`, {}, "abc.def.ghi"), "UNAUTHENTICATED");
  const profile = await expectData<any>("updateProfile", gql(`mutation { updateProfile(input: { name: "Smoke A2" }) { name } }`, {}, tokenA));
  check("nome atualizado", profile?.updateProfile.name === "Smoke A2");

  console.log("\nCategorias (RF-B08–B11)");
  const cat = (await expectData<any>("createCategory", gql(CREATE_CATEGORY, { input: category }, tokenA))).createCategory;
  check("categoria nova sem transações", cat.transactionsCount === 0 && cat.totalAmount === 0);
  await expectError("createCategory com ícone inválido", gql(CREATE_CATEGORY, { input: { ...category, icon: "foo" } }, tokenA), "BAD_USER_INPUT");
  await expectError("createCategory sem token", gql(CREATE_CATEGORY, { input: category }), "UNAUTHENTICATED");
  const updatedCat = await expectData<any>("updateCategory", gql(UPDATE_CATEGORY, { id: cat.id, input: { ...category, title: "Supermercado" } }, tokenA));
  check("título atualizado", updatedCat?.updateCategory.title === "Supermercado");

  console.log("\nTransações (RF-B04–B07, RN-05, RN-06, RN-09)");
  const month = new Date().toISOString().slice(0, 7);
  const income = (await expectData<any>("createTransaction receita", gql(CREATE_TX, { input: { description: "Salário", amount: 100000, type: "INCOME", date: `${month}-01T00:00:00.000Z` } }, tokenA))).createTransaction;
  const expense = (await expectData<any>("createTransaction despesa com categoria", gql(CREATE_TX, { input: { description: "Compra no mercado", amount: 30050, type: "EXPENSE", date: `${month}-02T00:00:00.000Z`, categoryId: cat.id } }, tokenA))).createTransaction;
  check("despesa vinculada à categoria", expense.category?.id === cat.id);
  await expectError("createTransaction com valor zero", gql(CREATE_TX, { input: { description: "X", amount: 0, type: "EXPENSE", date: `${month}-02T00:00:00.000Z` } }, tokenA), "BAD_USER_INPUT");
  await expectError("createTransaction com data inválida", gql(CREATE_TX, { input: { description: "X", amount: 10, type: "EXPENSE", date: "ontem" } }, tokenA), "BAD_USER_INPUT");
  await gql(CREATE_TX, { input: { description: "Antiga", amount: 500, type: "EXPENSE", date: "2020-01-15T00:00:00.000Z" } }, tokenA);

  const all = (await expectData<any>("transactions (todas)", gql(TXS, {}, tokenA))).transactions;
  check("total = 3", all.total === 3, all.total);
  check("ordenadas por data desc", all.items.map((t: any) => t.description).join(",") === "Compra no mercado,Salário,Antiga", all.items);
  const byType = (await gql<any>(TXS, { filter: { type: "INCOME" } }, tokenA)).data?.transactions;
  check("filtro por tipo", byType?.total === 1 && byType.items[0].id === income.id);
  const bySearch = (await gql<any>(TXS, { filter: { search: "MERCADO" } }, tokenA)).data?.transactions;
  check("busca sem diferenciar maiúsculas", bySearch?.total === 1 && bySearch.items[0].id === expense.id);
  const byCategory = (await gql<any>(TXS, { filter: { categoryId: cat.id } }, tokenA)).data?.transactions;
  check("filtro por categoria", byCategory?.total === 1);
  const byPeriod = (await gql<any>(TXS, { filter: { period: month } }, tokenA)).data?.transactions;
  check("filtro por período", byPeriod?.total === 2);
  const paged = (await gql<any>(TXS, { page: 2, perPage: 2 }, tokenA)).data?.transactions;
  check("paginação", paged?.items.length === 1 && paged.totalPages === 2 && paged.page === 2, paged);
  await expectError("período inválido", gql(TXS, { filter: { period: "2026-13" } }, tokenA), "BAD_USER_INPUT");

  const updated = await expectData<any>("updateTransaction", gql(UPDATE_TX, { id: expense.id, input: { description: "Feira", amount: 20000, type: "EXPENSE", date: `${month}-02T00:00:00.000Z`, categoryId: cat.id } }, tokenA));
  check("transação atualizada", updated?.updateTransaction.description === "Feira" && updated.updateTransaction.amount === 20000);

  console.log("\nAgregados (RF-B14, RF-B15)");
  const cats = (await expectData<any>("categories", gql(CATEGORIES, {}, tokenA))).categories;
  check("categoria com 1 transação e total -20000", cats[0]?.transactionsCount === 1 && cats[0]?.totalAmount === -20000, cats);
  const single = (await gql<any>(CATEGORY, { id: cat.id }, tokenA)).data?.category;
  check("category(id) com estatísticas", single?.transactionsCount === 1 && single?.totalAmount === -20000, single);
  const summary = (await expectData<any>("summary", gql(SUMMARY, {}, tokenA))).summary;
  check("saldo = 100000 − 20000 − 500", summary.balance === 79500, summary);
  check("receitas/despesas do mês", summary.monthIncome === 100000 && summary.monthExpense === 20000, summary);
  const recent = await expectData<any>("recentTransactions", gql(`{ recentTransactions(limit: 2) { id } }`, {}, tokenA));
  check("recentTransactions respeita limit", recent?.recentTransactions.length === 2);

  console.log("\nIsolamento entre usuários (RF-B03, RN-04)");
  const catsB = (await gql<any>(CATEGORIES, {}, tokenB)).data?.categories;
  check("B não vê categorias de A", Array.isArray(catsB) && catsB.length === 0, catsB);
  const txsB = (await gql<any>(TXS, {}, tokenB)).data?.transactions;
  check("B não vê transações de A", txsB?.total === 0, txsB);
  const summaryB = (await gql<any>(SUMMARY, {}, tokenB)).data?.summary;
  check("summary de B zerado", summaryB?.balance === 0, summaryB);
  await expectError("B lê categoria de A", gql(CATEGORY, { id: cat.id }, tokenB), "NOT_FOUND");
  await expectError("B edita categoria de A", gql(UPDATE_CATEGORY, { id: cat.id, input: category }, tokenB), "NOT_FOUND");
  await expectError("B deleta categoria de A", gql(DELETE_CATEGORY, { id: cat.id }, tokenB), "NOT_FOUND");
  await expectError("B lê transação de A", gql(TX, { id: income.id }, tokenB), "NOT_FOUND");
  await expectError("B edita transação de A", gql(UPDATE_TX, { id: income.id, input: { description: "Hack", amount: 1, type: "INCOME", date: `${month}-01T00:00:00.000Z` } }, tokenB), "NOT_FOUND");
  await expectError("B deleta transação de A", gql(DELETE_TX, { id: income.id }, tokenB), "NOT_FOUND");
  await expectError("B usa categoria de A na própria transação", gql(CREATE_TX, { input: { description: "X", amount: 1, type: "EXPENSE", date: `${month}-01T00:00:00.000Z`, categoryId: cat.id } }, tokenB), "NOT_FOUND");

  console.log("\nExclusões (RF-B05, RF-B09, RN-07)");
  await expectData("deleteCategory", gql(DELETE_CATEGORY, { id: cat.id }, tokenA));
  const orphan = (await gql<any>(TX, { id: expense.id }, tokenA)).data?.transaction;
  check("transação permanece sem categoria", orphan?.id === expense.id && orphan.category === null, orphan);
  await expectData("deleteTransaction", gql(DELETE_TX, { id: income.id }, tokenA));
  await expectError("transação deletada", gql(TX, { id: income.id }, tokenA), "NOT_FOUND");

  console.log(`\n${passed} verificações ok, ${failures.length} falha(s).`);
  if (failures.length) {
    console.log(failures.map((f) => `  - ${f}`).join("\n"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
