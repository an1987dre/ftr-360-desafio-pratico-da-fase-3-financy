import { useQuery } from "@apollo/client";
import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/states";
import { TransactionAmount } from "@/components/transaction-amount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { DASHBOARD } from "@/graphql/dashboard";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TransactionDialog } from "@/pages/transactions/transaction-dialog";

function SummaryCard({ icon, label, value, className }: { icon: ReactNode; label: string; value: number; className?: string }) {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <span className={cn("flex items-center gap-3 text-xs font-medium tracking-wide text-gray-500 uppercase [&_svg]:size-5", className)}>
        {icon}
        {label}
      </span>
      <strong className="text-[28px] leading-tight font-bold text-gray-800">{formatCurrency(value)}</strong>
    </Card>
  );
}

function SectionHeader({ title, to, linkLabel }: { title: string; to: string; linkLabel: string }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
      <h2 className="text-xs font-medium tracking-wide text-gray-500 uppercase">{title}</h2>
      <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-brand-base hover:underline">
        {linkLabel} <ChevronRight className="size-4" aria-hidden />
      </Link>
    </header>
  );
}

export function DashboardPage() {
  const { data, loading, error, refetch } = useQuery(DASHBOARD);
  const [creating, setCreating] = useState(false);

  if (loading && !data) return <LoadingState label="Carregando dashboard" />;
  if (error && !data) return <ErrorState onRetry={() => void refetch()} />;
  if (!data) return null;

  const { summary, recentTransactions, categories } = data;
  const usedCategories = [...categories]
    .filter((c) => c.transactionsCount > 0)
    .sort((a, b) => b.transactionsCount - a.transactionsCount)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">Dashboard</h1>

      <section aria-label="Resumo" className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={<Wallet className="text-purple-base" aria-hidden />} label="Saldo total" value={summary.balance} />
        <SummaryCard icon={<CircleArrowUp className="text-success" aria-hidden />} label="Receitas do mês" value={summary.monthIncome} />
        <SummaryCard icon={<CircleArrowDown className="text-danger" aria-hidden />} label="Despesas do mês" value={summary.monthExpense} />
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <SectionHeader title="Transações recentes" to="/transactions" linkLabel="Ver todas" />
          {recentTransactions.length === 0 ? (
            <EmptyState message="Nenhuma transação registrada ainda." />
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <li key={transaction.id} className="flex items-center gap-4 px-6 py-4">
                  <CategoryIcon icon={transaction.category?.icon} color={transaction.category?.color} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-medium text-gray-800">{transaction.description}</span>
                    <span className="text-sm text-gray-600">{formatDate(transaction.date)}</span>
                  </div>
                  {transaction.category ? (
                    <Badge color={transaction.category.color} className="hidden sm:inline-flex">
                      {transaction.category.title}
                    </Badge>
                  ) : null}
                  <TransactionAmount amount={transaction.amount} type={transaction.type} withIcon className="w-36" />
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-center border-t border-gray-200 px-6 py-4">
            <Button variant="link" size="sm" onClick={() => setCreating(true)}>
              <Plus /> Nova transação
            </Button>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Categorias" to="/categories" linkLabel="Gerenciar" />
          {usedCategories.length === 0 ? (
            <EmptyState message="Suas categorias mais usadas aparecem aqui." />
          ) : (
            <ul className="flex flex-col gap-5 px-6 py-5">
              {usedCategories.map((category) => (
                <li key={category.id} className="flex items-center justify-between gap-3 text-sm">
                  <Badge color={category.color}>{category.title}</Badge>
                  <span className="ml-auto text-gray-600">
                    {category.transactionsCount} {category.transactionsCount === 1 ? "item" : "itens"}
                  </span>
                  <span className="w-28 text-right font-semibold text-gray-800">{formatCurrency(Math.abs(category.totalAmount))}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <TransactionDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}
