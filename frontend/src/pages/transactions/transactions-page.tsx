import { useMutation, useQuery } from "@apollo/client";
import { SquarePen, Plus, Search, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/states";
import { PageHeader } from "@/components/layout/page-header";
import { TransactionAmount } from "@/components/transaction-amount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TypeTag } from "@/components/ui/type-tag";
import { CATEGORIES } from "@/graphql/categories";
import { DATA_QUERIES } from "@/graphql/dashboard";
import { DELETE_TRANSACTION, TRANSACTIONS } from "@/graphql/transactions";
import type { Transaction, TransactionType } from "@/graphql/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { errorMessage } from "@/lib/errors";
import { formatDate, formatPeriod } from "@/lib/format";
import { recentPeriods } from "@/lib/periods";
import { CategorySelect, NONE } from "./category-select";
import { TransactionDialog } from "./transaction-dialog";

const PER_PAGE = 10;
const PERIODS = recentPeriods(12);
const DEFAULT_PERIOD = PERIODS[0] ?? null;

export function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TransactionType | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [period, setPeriod] = useState<string | null>(DEFAULT_PERIOD);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim());

  const [dialog, setDialog] = useState<{ open: boolean; transaction: Transaction | null }>({ open: false, transaction: null });
  const [toDelete, setToDelete] = useState<Transaction | null>(null);

  const filter = { search: debouncedSearch || null, type, categoryId, period };
  const { data, previousData, loading, error, refetch } = useQuery(TRANSACTIONS, {
    variables: { filter, page, perPage: PER_PAGE },
  });
  const { data: categoriesData } = useQuery(CATEGORIES);
  const [remove, { loading: deleting }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: DATA_QUERIES,
    awaitRefetchQueries: true,
  });

  // Mantém a tabela anterior visível enquanto o filtro/página novo carrega.
  const result = (data ?? previousData)?.transactions;
  // O mês atual é o padrão do Figma, não um filtro escolhido pela pessoa.
  const hasUserFilters = !!(debouncedSearch || type || categoryId || period !== DEFAULT_PERIOD);

  /** Alterar filtro sempre volta para a página 1. */
  function changeFilter<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await remove({ variables: { id: toDelete.id } });
      toast.success("Transação excluída");
      setToDelete(null);
      // Se a página ficou vazia, volta uma.
      if (result && result.items.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  const newButton = (
    <Button size="sm" onClick={() => setDialog({ open: true, transaction: null })}>
      <Plus /> Nova transação
    </Button>
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Transações" description="Gerencie todas as suas transações financeiras" action={newButton} />

      <Card className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Buscar" htmlFor="filter-search">
          <Input
            id="filter-search"
            type="search"
            placeholder="Buscar por descrição"
            icon={<Search />}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </Field>
        <Field label="Tipo" htmlFor="filter-type">
          <Select value={type ?? NONE} onValueChange={(v) => changeFilter(setType)(v === NONE ? null : (v as TransactionType))}>
            <SelectTrigger id="filter-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Todos</SelectItem>
              <SelectItem value="INCOME">Entrada</SelectItem>
              <SelectItem value="EXPENSE">Saída</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Categoria" htmlFor="filter-category">
          <CategorySelect
            id="filter-category"
            value={categoryId}
            onChange={changeFilter(setCategoryId)}
            categories={categoriesData?.categories ?? []}
            noneLabel="Todas"
          />
        </Field>
        <Field label="Período" htmlFor="filter-period">
          <Select value={period ?? NONE} onValueChange={(v) => changeFilter(setPeriod)(v === NONE ? null : v)}>
            <SelectTrigger id="filter-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Todos</SelectItem>
              {PERIODS.map((p) => (
                <SelectItem key={p} value={p}>
                  {formatPeriod(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Card>

      <Card className="overflow-hidden">
        {loading && !result ? (
          <LoadingState label="Carregando transações" />
        ) : error && !result ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : !result || result.total === 0 ? (
          <EmptyState
            message={
              hasUserFilters
                ? "Nenhuma transação encontrada para os filtros selecionados."
                : `Nenhuma transação em ${period ? formatPeriod(period) : "nenhum período"}.`
            }
            action={hasUserFilters ? undefined : newButton}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm" aria-busy={loading}>
                <thead className="border-b border-gray-200 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-4">Descrição</th>
                    <th scope="col" className="px-6 py-4 text-center">Data</th>
                    <th scope="col" className="px-6 py-4 text-center">Categoria</th>
                    <th scope="col" className="px-6 py-4 text-center">Tipo</th>
                    <th scope="col" className="px-6 py-4 text-right">Valor</th>
                    <th scope="col" className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {result.items.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <CategoryIcon icon={transaction.category?.icon} color={transaction.category?.color} />
                          <span className="font-medium text-gray-800">{transaction.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-gray-600">{formatDate(transaction.date)}</td>
                      <td className="px-6 py-4 text-center">
                        {transaction.category ? (
                          <Badge color={transaction.category.color}>{transaction.category.title}</Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <TypeTag type={transaction.type} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <TransactionAmount amount={transaction.amount} type={transaction.type} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="danger"
                            size="icon"
                            aria-label={`Excluir transação ${transaction.description}`}
                            onClick={() => setToDelete(transaction)}
                          >
                            <Trash />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Editar transação ${transaction.description}`}
                            onClick={() => setDialog({ open: true, transaction })}
                          >
                            <SquarePen />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <Pagination
                page={result.page}
                perPage={result.perPage}
                total={result.total}
                totalPages={result.totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>

      <TransactionDialog
        open={dialog.open}
        transaction={dialog.transaction}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir transação"
        description={`"${toDelete?.description ?? ""}" será excluída permanentemente.`}
        loading={deleting}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
