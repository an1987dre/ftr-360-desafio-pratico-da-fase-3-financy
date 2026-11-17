import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import type { TransactionType } from "@/graphql/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type TransactionAmountProps = {
  amount: number;
  type: TransactionType;
  /** Ícone ↑/↓ colorido após o valor (Figma › Dashboard). */
  withIcon?: boolean;
  className?: string;
};

/** "+ R$ 10,00" / "- R$ 10,00" em gray-800; a cor fica só no ícone. */
export function TransactionAmount({ amount, type, withIcon, className }: TransactionAmountProps) {
  const income = type === "INCOME";
  const Icon = income ? CircleArrowUp : CircleArrowDown;
  return (
    <span className={cn("inline-flex items-center justify-end gap-2 font-semibold whitespace-nowrap text-gray-800", className)}>
      {income ? "+" : "-"} {formatCurrency(amount)}
      {withIcon ? (
        <Icon className={cn("size-4 shrink-0", income ? "text-success" : "text-danger")} aria-label={income ? "Receita" : "Despesa"} />
      ) : null}
    </span>
  );
}
