import { CategoryIcon } from "@/components/ui/category-icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/graphql/types";

/** Radix Select não aceita valor vazio; usamos uma sentinela. */
export const NONE = "__none__";

type CategorySelectProps = {
  id: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  categories: Pick<Category, "id" | "title" | "icon" | "color">[];
  /** Texto da opção "sem valor" (ex.: "Sem categoria" ou "Todas"). */
  noneLabel: string;
  /** Se informado, mostra o placeholder quando não há categoria (em vez de `noneLabel`). */
  placeholder?: string;
  disabled?: boolean;
};

export function CategorySelect({ id, value, onChange, categories, noneLabel, placeholder, disabled }: CategorySelectProps) {
  // Valor "" faz o Radix exibir o placeholder.
  const current = value ?? (placeholder ? "" : NONE);
  return (
    <Select value={current} onValueChange={(v) => onChange(v === NONE ? null : v)} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>{noneLabel}</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <span className="flex items-center gap-2">
              <CategoryIcon icon={category.icon} color={category.color} className="size-6 [&_svg]:size-3" />
              {category.title}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
