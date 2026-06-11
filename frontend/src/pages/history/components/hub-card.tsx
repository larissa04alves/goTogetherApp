import { Car03Icon, SmartPhone01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { SavedRoute } from "@/pages/route/types";

import type { Hub } from "../types";

type HubCardProps = {
  hub: Hub;
  route: SavedRoute | undefined;
  onClick?: () => void;
};

export function HubCard({ hub, route, onClick }: HubCardProps) {
  const isCarona = hub.mode === "carona";
  const ModeIcon = isCarona ? Car03Icon : SmartPhone01Icon;
  const modeLabel = isCarona ? "Carona" : "App de transporte";

  return (
    <article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 ${
        onClick
          ? "cursor-pointer transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          : ""
      }`}
    >
      <header className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
          <HugeiconsIcon icon={ModeIcon} size={12} strokeWidth={2} />
          {modeLabel}
        </span>
        <span className="text-xs font-bold text-muted-foreground">
          {hub.departureTime}
        </span>
      </header>

      <p className="text-sm font-bold text-foreground">
        {route
          ? `${route.origin.label} → ${route.destination.label}`
          : "Rota removida"}
      </p>

      <footer className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <HugeiconsIcon icon={UserGroupIcon} size={14} strokeWidth={1.75} />
          {hub.seats} {hub.seats === 1 ? "vaga" : "vagas"}
        </span>
        {isCarona ? (
          <span className="font-bold text-foreground">
            R$ {hub.priceBRL.toFixed(2).replace(".", ",")}
          </span>
        ) : hub.notes ? (
          <span className="line-clamp-1 max-w-[60%] text-right">{hub.notes}</span>
        ) : null}
      </footer>

      {isCarona ? (
        <p className="text-[11px] text-muted-foreground">
          {hub.vehicle.modelo} · {hub.vehicle.placa}
        </p>
      ) : null}
    </article>
  );
}
