import {
  ArrowDown01Icon,
  ArrowUpFromDotIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import type { SavedRoute } from "../../route/types";

type RouteSelectorProps = {
  routes: SavedRoute[];
  selected: SavedRoute | null;
  onSelect: (route: SavedRoute | null) => void;
};

export function RouteSelector({
  routes,
  selected,
  onSelect,
}: RouteSelectorProps) {
  const [open, setOpen] = useState(false);

  function pick(route: SavedRoute | null) {
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
        className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Rota selecionada
        </span>
        <div className="flex items-center justify-between gap-3">
          {selected ? (
            <RouteSummary route={selected} />
          ) : (
            <span className="text-sm font-bold text-foreground">
              Todas as rotas
            </span>
          )}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={18}
            strokeWidth={1.75}
            className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open ? (
        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-2">
          <button
            type="button"
            onClick={() => pick(null)}
            className={`flex w-full items-center rounded-xl p-3 text-left text-sm font-bold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selected === null ? "bg-primary/10" : "hover:bg-muted"
            }`}
          >
            Todas as rotas
          </button>
          {routes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => pick(route)}
              className={`flex w-full items-center rounded-xl p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selected?.id === route.id ? "bg-primary/10" : "hover:bg-muted"
              }`}
            >
              <RouteSummary route={route} />
            </button>
          ))}
          {routes.length === 0 ? (
            <span className="px-3 py-2 text-[12px] text-muted-foreground">
              Nenhuma rota salva. Crie em "Rotas".
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function RouteSummary({ route }: { route: SavedRoute }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold text-foreground">
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="size-2 shrink-0 rounded-full bg-primary" />
        <span className="truncate">{route.origin.label}</span>
      </span>
      <span className="rotate-90 text-muted-foreground">
        <HugeiconsIcon icon={ArrowUpFromDotIcon} size={14} strokeWidth={1.75} />
      </span>
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="size-2 shrink-0 rounded-full bg-slate-300" />
        <span className="truncate">{route.destination.label}</span>
      </span>
    </span>
  );
}
