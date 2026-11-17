import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import type { TransactionType } from "@/graphql/types";
import { cn } from "@/lib/utils";

/** "Entrada" (verde) / "Saída" (vermelho) com ícone. */
export function TypeTag({ type, className }: { type: TransactionType; className?: string }) {
  const income = type === "INCOME";
  const Icon = income ? CircleArrowUp : CircleArrowDown;
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-medium", income ? "text-green-dark" : "text-red-dark", className)}>
      <Icon className="size-4" aria-hidden />
      {income ? "Entrada" : "Saída"}
    </span>
  );
}
