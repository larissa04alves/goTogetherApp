import {
  Car03Icon,
  StarIcon,
  TaxiIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { formatPrice } from "@/lib/format-currency";
import type { Modality, Ride, Similarity } from "../types";

type RideCardProps = {
  ride: Ride;
  onClick?: () => void;
};

const similarityStyles: Record<Similarity, { label: string; className: string }> = {
  alta: {
    label: "Alta similaridade",
    className: "bg-emerald-100 text-emerald-700",
  },
  media: {
    label: "Média similaridade",
    className: "bg-amber-100 text-amber-700",
  },
  baixa: {
    label: "Baixa similaridade",
    className: "bg-rose-100 text-rose-700",
  },
};

const modalityStyles: Record<Modality, { label: string; icon: typeof TaxiIcon }> = {
  app: { label: "App", icon: TaxiIcon },
  carro: { label: "Carro", icon: Car03Icon },
};

export function RideCard({ ride, onClick }: RideCardProps) {
  const sim = similarityStyles[ride.similarity];
  const mod = modalityStyles[ride.modality];

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
      <div className="flex items-start gap-3">
        {ride.driver.imageUrl ? (
          <img
            src={ride.driver.imageUrl}
            alt={ride.driver.name}
            className="size-12 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          >
            {ride.driver.initials}
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-sm font-bold text-foreground">
            {ride.driver.name}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <HugeiconsIcon
              icon={StarIcon}
              size={12}
              strokeWidth={2}
              className="text-amber-500"
            />
            <span className="font-bold text-foreground">
              {ride.driver.rating.toFixed(1)}
            </span>
            <span>·</span>
            <span>{ride.driver.ridesCount} caronas</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${sim.className}`}
            >
              {sim.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              <HugeiconsIcon icon={mod.icon} size={11} strokeWidth={2} />
              {mod.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="font-bold text-foreground">{ride.time}</span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={UserMultiple02Icon}
              size={12}
              strokeWidth={1.75}
            />
            {ride.seatsTaken}/{ride.seatsTotal} vagas
          </span>
        </div>
        <span className="text-sm font-bold text-primary">
          {formatPrice(ride.priceBRL)}
        </span>
      </div>
    </article>
  );
}

