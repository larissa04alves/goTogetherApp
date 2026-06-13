import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Profile } from "../types";

type ProfileStatsProps = {
  stats: Profile["stats"];
};

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <section
      aria-label="Estatísticas do perfil"
      className="grid grid-cols-3 rounded-2xl border border-border bg-card p-4"
    >
      <Stat
        value={
          <span className="inline-flex items-center gap-1">
            <HugeiconsIcon
              icon={StarIcon}
              size={14}
              strokeWidth={2}
              className="text-amber-500"
            />
            {stats.rating.toFixed(1)}
          </span>
        }
        label="Avaliação"
      />
      <Stat value={stats.given} label="Oferecidos" hasDivider />
      <Stat value={stats.taken} label="Tomadas" hasDivider />
    </section>
  );
}

function Stat({
  value,
  label,
  hasDivider,
}: {
  value: React.ReactNode;
  label: string;
  hasDivider?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 ${
        hasDivider ? "border-l border-border" : ""
      }`}
    >
      <span className="text-[18px] font-bold text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
