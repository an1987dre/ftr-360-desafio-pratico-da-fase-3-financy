import { CircleAlert, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type Props = { className?: string };

export function LoadingState({ className, label = "Carregando" }: Props & { label?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Spinner label={label} />
    </div>
  );
}

export function ErrorState({ className, onRetry }: Props & { onRetry?: () => void }) {
  return (
    <div role="alert" className={cn("flex flex-col items-center gap-3 py-12 text-center", className)}>
      <CircleAlert className="size-8 text-danger" aria-hidden />
      <p className="text-gray-600">Não foi possível carregar os dados.</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({ className, message, action }: Props & { message: string; action?: ReactNode }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-12 text-center", className)}>
      <Inbox className="size-8 text-gray-400" aria-hidden />
      <p className="text-gray-600">{message}</p>
      {action}
    </div>
  );
}
