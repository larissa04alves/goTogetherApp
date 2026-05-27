import { ArrowRight01Icon, Car03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";

import type { Vehicle } from "@/pages/settings/types";

type VehicleCardProps = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/configuracoes")}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
        <HugeiconsIcon icon={Car03Icon} size={20} strokeWidth={1.75} />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-bold text-foreground">
          {vehicle.model}
        </span>
        <span className="text-xs text-muted-foreground">{vehicle.plate}</span>
      </span>
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.75} />
    </button>
  );
}
