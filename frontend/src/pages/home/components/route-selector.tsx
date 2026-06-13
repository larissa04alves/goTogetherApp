import {
  ArrowDown01Icon,
  ArrowUpFromDotIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Route } from "../types";

type RouteSelectorProps = {
  route: Route;
};

export function RouteSelector({ route }: RouteSelectorProps) {
  return (
    <button
      type="button"
      aria-label="Trocar rota selecionada"
      className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        Rota selecionada
      </span>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            {route.origin}
          </span>
          <span className="text-muted-foreground rotate-90">
            <HugeiconsIcon icon={ArrowUpFromDotIcon} />
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-slate-300" />
            {route.destination}
          </span>
        </div>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={18}
          strokeWidth={1.75}
          className="text-muted-foreground"
        />
      </div>
    </button>
  );
}
