import { Car03Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type CreateHubSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateHubSheet({ open, onOpenChange }: CreateHubSheetProps) {
  const navigate = useNavigate();

  function handlePick(modo: "carona" | "app") {
    onOpenChange(false);
    navigate(`/hubs/novo?modo=${modo}`);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Criar nova carona</SheetTitle>
          <SheetDescription>Escolha como você vai oferecer</SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            onClick={() => handlePick("carona")}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary">
              <HugeiconsIcon icon={Car03Icon} size={22} strokeWidth={1.75} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Carona</span>
              <span className="text-xs text-muted-foreground">
                Use seu carro e defina o valor por passageiro
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePick("app")}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary">
              <HugeiconsIcon icon={SmartPhone01Icon} size={22} strokeWidth={1.75} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-foreground">
                App de transporte
              </span>
              <span className="text-xs text-muted-foreground">
                99, Uber e similares — sem valor nem veículo
              </span>
            </span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
