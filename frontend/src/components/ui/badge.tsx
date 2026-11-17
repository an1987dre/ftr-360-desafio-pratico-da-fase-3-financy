import type { ReactNode } from "react";
import { categoryColor } from "@/lib/categories";
import { cn } from "@/lib/utils";

type BadgeProps = { color: string; children: ReactNode; className?: string };

/** Etiqueta arredondada com a cor da categoria. */
export function Badge({ color, children, className }: BadgeProps) {
  const palette = categoryColor(color);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap",
        palette.bg,
        palette.text,
        className,
      )}
    >
      {children}
    </span>
  );
}
