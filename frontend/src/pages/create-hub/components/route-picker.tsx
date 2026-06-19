import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { RouteSummary } from "@/components/route-summary";
import type { SavedRoute } from "@/pages/route/types";

type RoutePickerProps = {
  routes: SavedRoute[];
  selected: SavedRoute | null;
  onSelect: (route: SavedRoute) => void;
};

export function RoutePicker({ routes, selected, onSelect }: RoutePickerProps) {
  const [open, setOpen] = useState(false);

  function handlePick(route: SavedRoute) {
    onSelect(route);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-label="Trocar rota selecionada"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {selected ? (
          <RouteSummary route={selected} />
        ) : (
          <span className="text-sm text-muted-foreground">
            Selecione uma rota
          </span>
        )}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={18}
          strokeWidth={1.75}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2">
          {routes.map((route) => {
            const isSelected = selected?.id === route.id;
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => handlePick(route)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isSelected ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <RouteSummary route={route} />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

