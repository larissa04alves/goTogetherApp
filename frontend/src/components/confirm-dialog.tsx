import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  loading = false,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-80! rounded-3xl bg-card p-0 ring-0"
      >
        <div className="flex flex-col gap-2 px-5 pb-5 pt-6">
          <DialogTitle className="text-[15px] font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>

          <div className="flex gap-2 pt-4">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1 rounded-full text-[13px] font-bold"
                />
              }
            >
              {cancelLabel}
            </DialogClose>
            <Button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={cn(
                "h-11 flex-1 rounded-full text-[13px] font-bold",
                destructive
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : undefined,
              )}
            >
              {loading ? "Removendo…" : confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
