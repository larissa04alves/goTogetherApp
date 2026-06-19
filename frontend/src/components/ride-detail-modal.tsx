import {
  ArrowRight01Icon,
  Cancel01Icon,
  Car03Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  MapsCircle01Icon,
  StarIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { RouteMap } from "@/components/route-map";
import { formatPrice } from "@/lib/format-currency";

export type HubDetailSimilarity = "alta" | "media" | "baixa";

export type HubDetail = {
  id: string;
  title?: string;
  time: string;
  seatsTaken?: number;
  seatsTotal: number;
  priceBRL?: number;
  driver?: {
    id: string;
    initials: string;
    name: string;
    rating: number;
    ridesCount: number;
    verified: boolean;
    imageUrl?: string;
  };
  car?: {
    model: string;
    plate: string;
  };
  similarity?: {
    kind: HubDetailSimilarity;
    matchPct: number;
  };
  route?: {
    origin: { label: string; address: string; lat: number; lng: number };
    destination: { label: string; address: string; lat: number; lng: number };
  };
};

type RideDetailModalProps = {
  detail: HubDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionLabel: string;
  onAction: (hubId: string) => void;
  onViewProfile?: (userId: string) => void;
  actionPending?: boolean;
};

const similarityBanner: Record<
  HubDetailSimilarity,
  { label: string; className: string }
> = {
  alta: {
    label: "Alta similaridade",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  media: {
    label: "Média similaridade",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  baixa: {
    label: "Baixa similaridade",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

export function RideDetailModal({
  detail,
  open,
  onOpenChange,
  actionLabel,
  onAction,
  onViewProfile,
  actionPending = false,
}: RideDetailModalProps) {
  if (!detail) return null;
  const driver = detail.driver;
  const sim = detail.similarity
    ? similarityBanner[detail.similarity.kind]
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-80! rounded-3xl bg-card p-0 ring-0"
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <DialogClose
            render={
              <button
                type="button"
                aria-label="Fechar"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.75} />
          </DialogClose>
          <DialogTitle className="text-[14px] font-bold text-foreground">
            Detalhe da carona
          </DialogTitle>
          <span className="size-8" aria-hidden="true" />
        </header>

        <div className="flex flex-col gap-3 px-4 pb-4">
          {detail.route ? (
            <RouteMap
              origin={detail.route.origin}
              destination={detail.route.destination}
            />
          ) : (
            <div
              aria-label="Mapa do trajeto"
              className="grid h-36 w-full place-items-center rounded-2xl bg-slate-100 text-muted-foreground"
            >
              <div className="flex flex-col items-center gap-1 text-[11px]">
                <HugeiconsIcon
                  icon={MapsCircle01Icon}
                  size={28}
                  strokeWidth={1.5}
                />
                Google Maps
              </div>
            </div>
          )}

          {detail.driver ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              {detail.driver.imageUrl ? (
                <img
                  src={detail.driver.imageUrl}
                  alt={detail.driver.name}
                  className="size-12 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
                >
                  {detail.driver.initials}
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-sm font-bold text-foreground">
                  {detail.driver.name}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={12}
                    strokeWidth={2}
                    className="text-amber-500"
                  />
                  <span className="font-bold text-foreground">
                    {detail.driver.rating.toFixed(1)}
                  </span>
                  <span>·</span>
                  <span>{detail.driver.ridesCount} caronas</span>
                </div>
                {detail.driver.verified && (
                  <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-primary">
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      size={11}
                      strokeWidth={2}
                    />
                    Identidade verificada
                  </span>
                )}
              </div>
              {detail.car && (
                <div className="flex shrink-0 flex-col items-end gap-0.5 border-l border-border pl-3 text-right">
                  <HugeiconsIcon
                    icon={Car03Icon}
                    size={16}
                    strokeWidth={1.75}
                    className="text-muted-foreground"
                  />
                  <p className="text-[11px] font-bold text-foreground">
                    {detail.car.model}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {detail.car.plate}
                  </p>
                </div>
              )}
            </div>
          ) : detail.title ? (
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3">
              <span className="size-2 shrink-0 rounded-full bg-primary" />
              <p className="truncate text-sm font-bold text-foreground">
                {detail.title}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-3">
            <InfoCell icon={Clock01Icon} label="Horário" value={detail.time} />
            <InfoCell
              icon={UserMultiple02Icon}
              label="Vagas"
              value={`${detail.seatsTaken ?? 0}/${detail.seatsTotal}`}
            />
            <InfoCell
              label="R$"
              value={
                detail.priceBRL !== undefined
                  ? formatPrice(detail.priceBRL)
                  : "—"
              }
              valueClassName="text-primary"
              caption="por pessoa"
            />
          </div>

          {sim && detail.similarity && (
            <div
              className={`flex items-start gap-2 rounded-2xl border p-3 ${sim.className}`}
            >
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-current" />
              <div className="flex flex-col gap-0.5 text-[12px]">
                <p className="font-bold">
                  {sim.label} · {detail.similarity.matchPct}% do trajeto
                </p>
                <p className="text-[11px] opacity-80">
                  A rota dele coincide bastante com a sua.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {driver && onViewProfile && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onViewProfile(driver.id)}
                className="h-11 flex-1 rounded-full text-[13px] font-bold"
              >
                Ver perfil
              </Button>
            )}
            <Button
              type="button"
              disabled={actionPending}
              onClick={() => onAction(detail.id)}
              className="group h-11 flex-1 rounded-full text-[13px] font-bold"
            >
              {actionLabel}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className="ml-1 transition-transform group-hover:translate-x-0.5"
              />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoCell({
  icon,
  label,
  value,
  caption,
  valueClassName,
}: {
  icon?: typeof Clock01Icon;
  label: string;
  value: string;
  caption?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      {icon ? (
        <HugeiconsIcon
          icon={icon}
          size={16}
          strokeWidth={1.75}
          className="text-muted-foreground"
        />
      ) : (
        <span className="text-[11px] font-bold text-muted-foreground">
          {label}
        </span>
      )}
      <span
        className={`text-[13px] font-bold text-foreground ${valueClassName ?? ""}`}
      >
        {value}
      </span>
      <span className="text-[9px] uppercase tracking-wide text-slate-400">
        {caption ?? label}
      </span>
    </div>
  );
}
