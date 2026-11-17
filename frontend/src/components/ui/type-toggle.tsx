import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import type { TransactionType } from "@/graphql/types";
import { cn } from "@/lib/utils";

type TypeToggleProps = {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  disabled?: boolean;
};

const OPTIONS = [
  { value: "EXPENSE", label: "Despesa", Icon: CircleArrowDown, border: "border-danger", icon: "text-danger" },
  { value: "INCOME", label: "Receita", Icon: CircleArrowUp, border: "border-success", icon: "text-success" },
] as const;

/** Seletor segmentado Despesa/Receita (radiogroup acessível). */
export function TypeToggle({ value, onChange, disabled }: TypeToggleProps) {
  return (
    <div role="radiogroup" aria-label="Tipo da transação" className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 p-2">
      {OPTIONS.map(({ value: option, label, Icon, border, icon }) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option)}
            className={cn(
              "flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-base focus-visible:outline-none",
              selected ? cn("bg-gray-100 text-gray-800", border) : "border-transparent text-gray-600 hover:bg-gray-100",
            )}
          >
            <Icon className={cn("size-4", selected ? icon : "text-gray-400")} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
