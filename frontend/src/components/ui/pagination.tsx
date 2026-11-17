import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/** Até 5 números visíveis, centrados na página atual. */
function visiblePages(page: number, totalPages: number): number[] {
  const size = Math.min(5, totalPages);
  const start = Math.min(Math.max(1, page - 2), Math.max(1, totalPages - size + 1));
  return Array.from({ length: size }, (_, i) => start + i);
}

export function Pagination({ page, perPage, total, totalPages, onPageChange }: PaginationProps) {
  if (total === 0) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const navButton =
    "flex size-8 items-center justify-center rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-200 disabled:pointer-events-none disabled:border-gray-200 disabled:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-base focus-visible:outline-none";

  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
      <p>
        <span className="font-medium text-gray-800">{from}</span> a <span className="font-medium text-gray-800">{to}</span> |{" "}
        <span className="font-medium text-gray-800">{total}</span> resultados
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className={navButton} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Página anterior">
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        {visiblePages(page, totalPages).map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onPageChange(number)}
            aria-current={number === page ? "page" : undefined}
            className={cn(navButton, number === page && "border-brand-base bg-brand-base text-white hover:bg-brand-dark")}
          >
            {number}
          </button>
        ))}
        <button type="button" className={navButton} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Próxima página">
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
