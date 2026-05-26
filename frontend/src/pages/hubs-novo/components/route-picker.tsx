import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SavedRoute } from "@/pages/rotas/types";

type RoutePickerProps = {
  routes: SavedRoute[];
  selected: SavedRoute | null;
  onSelect: (route: SavedRoute) => void;
};

export function RoutePicker({ routes, selected, onSelect }: RoutePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex flex-col">
          {selected ? (
            <>
              <span className="text-sm font-bold text-foreground">
                {selected.origin.label} → {selected.destination.label}
              </span>
              <span className="text-xs text-muted-foreground">
                Saída {selected.departureTime}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-muted-foreground">
              Escolher rota
            </span>
          )}
        </span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.75} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Escolher rota</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-2 pb-[env(safe-area-inset-bottom)]">
            {routes.map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => {
                  onSelect(route);
                  setOpen(false);
                }}
                className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-sm font-bold text-foreground">
                  {route.origin.label} → {route.destination.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  Saída {route.departureTime}
                </span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
