import {
  CheckmarkBadge01Icon,
  FemaleSymbolIcon,
  MaleSymbolIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Gender, Profile } from "../types";

const genderIcon: Record<Gender, { icon: typeof FemaleSymbolIcon; label: string; className: string }> = {
  female: {
    icon: FemaleSymbolIcon,
    label: "Feminino",
    className: "text-pink-500",
  },
  male: {
    icon: MaleSymbolIcon,
    label: "Masculino",
    className: "text-sky-500",
  },
};

type ProfileCardProps = {
  profile: Profile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <article className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card px-4 pb-5 pt-6">
      <div className="relative">
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt={profile.name}
            className="size-20 rounded-2xl object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-20 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground"
          >
            {profile.initials}
          </div>
        )}
        {profile.identityVerified && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-card bg-primary"
          >
            <HugeiconsIcon
              icon={CheckmarkBadge01Icon}
              size={14}
              strokeWidth={2.25}
              className="text-primary-foreground"
            />
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="flex items-center gap-1.5 text-[18px] font-bold leading-tight text-foreground">
          {profile.name}
          <HugeiconsIcon
            icon={genderIcon[profile.gender].icon}
            size={16}
            strokeWidth={2}
            aria-label={genderIcon[profile.gender].label}
            className={genderIcon[profile.gender].className}
          />
        </h2>
        <p className="text-[12px] text-muted-foreground">{profile.job}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {profile.identityVerified && (
          <VerifiedPill label="Identidade verificada" />
        )}
      </div>
    </article>
  );
}

function VerifiedPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
      <HugeiconsIcon icon={Tick02Icon} size={11} strokeWidth={2.5} />
      {label}
    </span>
  );
}
