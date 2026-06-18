import {
  Cancel01Icon,
  FilterHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { entrarHub } from "@/api/hubs";
import { joinHubChannel } from "@/api/chat";
import { RideDetailModal } from "@/components/ride-detail-modal";
import type { HubDetail } from "@/components/ride-detail-modal";

import type { Modality, Ride, Similarity } from "../types";
import { RideCard } from "./ride-card";

function toHubDetail(ride: Ride): HubDetail {
  return {
    id: ride.id,
    time: ride.time,
    seatsTaken: ride.seatsTaken,
    seatsTotal: ride.seatsTotal,
    priceBRL: ride.priceBRL,
    driver: {
      initials: ride.driver.initials,
      name: ride.driver.name,
      rating: ride.driver.rating,
      ridesCount: ride.driver.ridesCount,
      verified: ride.driver.verified,
      imageUrl: ride.driver.imageUrl,
    },
    car: ride.car,
    similarity: { kind: ride.similarity, matchPct: ride.similarityMatchPct },
    route: ride.route,
  };
}

type RidesListProps = {
  rides: Ride[];
};

const similarityOptions: { value: Similarity; label: string }[] = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Média" },
  { value: "baixa", label: "Baixa" },
];

const modalityOptions: { value: Modality; label: string }[] = [
  { value: "app", label: "App" },
  { value: "carro", label: "Carro" },
];

export function RidesList({ rides }: RidesListProps) {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [similarities, setSimilarities] = useState<Similarity[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [joining, setJoining] = useState(false);

  async function handleEnterHub(hubId: string) {
    setJoining(true);
    try {
      await entrarHub(hubId);
      const name = selectedRide
        ? `Carona de ${selectedRide.driver.name}`
        : undefined;
      await joinHubChannel(hubId, name);
      navigate(`/chat/${hubId}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível entrar no hub",
      );
      setJoining(false);
    }
  }

  const filtered = useMemo(() => {
    return rides.filter((r) => {
      if (similarities.length > 0 && !similarities.includes(r.similarity)) {
        return false;
      }
      if (modalities.length > 0 && !modalities.includes(r.modality)) {
        return false;
      }
      return true;
    });
  }, [rides, similarities, modalities]);

  const activeCount = similarities.length + modalities.length;
  const hasFilters = activeCount > 0;

  function toggleSimilarity(value: Similarity) {
    setSimilarities((curr) =>
      curr.includes(value) ? curr.filter((v) => v !== value) : [...curr, value],
    );
  }

  function toggleModality(value: Modality) {
    setModalities((curr) =>
      curr.includes(value) ? curr.filter((v) => v !== value) : [...curr, value],
    );
  }

  function clearFilters() {
    setSimilarities([]);
    setModalities([]);
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-foreground">
          {filtered.length} caronas disponíveis
        </h2>
        <button
          type="button"
          aria-label="Filtrar caronas"
          aria-expanded={filterOpen}
          onClick={() => setFilterOpen((v) => !v)}
          className={`relative flex size-9 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            filterOpen || hasFilters
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <HugeiconsIcon
            icon={FilterHorizontalIcon}
            size={16}
            strokeWidth={1.75}
          />
          {hasFilters && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-white"
            >
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {filterOpen && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
          <FilterGroup label="Similaridade">
            {similarityOptions.map((opt) => (
              <FilterPill
                key={opt.value}
                label={opt.label}
                active={similarities.includes(opt.value)}
                onClick={() => toggleSimilarity(opt.value)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Modalidade">
            {modalityOptions.map((opt) => (
              <FilterPill
                key={opt.value}
                label={opt.label}
                active={modalities.includes(opt.value)}
                onClick={() => toggleModality(opt.value)}
              />
            ))}
          </FilterGroup>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center justify-center gap-1.5 self-start text-[12px] font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
              Limpar filtros
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Nenhuma carona com esses filtros.
          </p>
        ) : (
          filtered.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onClick={() => setSelectedRide(ride)}
            />
          ))
        )}
      </div>

      <RideDetailModal
        detail={selectedRide ? toHubDetail(selectedRide) : null}
        open={selectedRide !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRide(null);
        }}
        actionLabel="Entrar no hub"
        onAction={handleEnterHub}
        actionPending={joining}
      />
    </section>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}
