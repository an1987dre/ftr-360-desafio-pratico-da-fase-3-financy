import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
};

/** Confirmação de ações destrutivas (exclusões). */
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Excluir", loading, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={title} description={description}>
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={loading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button size="sm" className="bg-danger hover:bg-danger/90" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
