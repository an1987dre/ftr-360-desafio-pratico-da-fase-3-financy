import { categoryColor, categoryIcon } from "@/lib/categories";
import { cn } from "@/lib/utils";

type CategoryIconProps = { icon?: string | null; color?: string | null; className?: string };

/** Quadrado colorido com o ícone da categoria; neutro quando não há categoria. */
export function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  const Icon = categoryIcon(icon ?? "");
  const palette = categoryColor(color ?? "");
  return (
    <span
      className={cn("flex size-10 shrink-0 items-center justify-center rounded-md", palette.bg, palette.icon, className)}
      aria-hidden
    >
      <Icon className="size-4" />
    </span>
  );
}
