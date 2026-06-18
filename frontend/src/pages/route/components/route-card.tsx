import {
  Clock01Icon,
  Delete02Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Endpoint, SavedRoute } from "../types";

type RouteCardProps = {
  route: SavedRoute;
  onEdit: () => void;
  onDelete: () => void;
};

const endpointColor: Record<Endpoint["kind"], string> = {
  origin: "bg-primary",
  home: "bg-slate-400",
  work: "bg-amber-500",
};

export function RouteCard({ route, onEdit, onDelete }: RouteCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <EndpointTrail
          originKind={route.origin.kind}
          destinationKind={route.destination.kind}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <EndpointRow endpoint={route.origin} />
          <div className="border-t border-dashed border-border" />
          <EndpointRow endpoint={route.destination} />
        </div>

        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            aria-label={`Editar rota ${route.origin.label} para ${route.destination.label}`}
            onClick={onEdit}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon icon={Edit02Icon} size={16} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={`Remover rota ${route.origin.label} para ${route.destination.label}`}
            onClick={onDelete}
            className="flex size-8 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <footer className="flex items-center gap-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <HugeiconsIcon icon={Clock01Icon} size={12} strokeWidth={1.75} />
          Saída <span className="font-bold text-foreground">{route.departureTime}</span>
        </span>
      </footer>
    </article>
  );

  function EndpointTrail({
    originKind,
    destinationKind,
  }: {
    originKind: Endpoint["kind"];
    destinationKind: Endpoint["kind"];
  }) {
    return (
      <div className="flex flex-col items-center gap-1 pt-1.5">
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full ${endpointColor[originKind]}`}
        />
        <span aria-hidden="true" className="h-8 w-px bg-border" />
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full ${endpointColor[destinationKind]}`}
        />
      </div>
    );
  }
}

function EndpointRow({ endpoint }: { endpoint: Endpoint }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <p className="truncate text-[13px] font-bold text-foreground">
        {endpoint.label}
      </p>
      <p className="truncate text-[11px] text-muted-foreground">
        {endpoint.address}
      </p>
    </div>
  );
}
