import {
  CheckmarkBadge01Icon,
  FemaleSymbolIcon,
  MaleSymbolIcon,
  StarIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";

type ProfileCardProps = {
  name: string;
  initials: string;
  imageUrl?: string;
  gender?: string | null;
  identityVerified?: boolean;
  rating: number | null;
  reviewCount: number;
};

const genderIcon: Record<
  string,
  { icon: IconSvgElement; label: string; className: string }
> = {
  feminino: { icon: FemaleSymbolIcon, label: "Feminino", className: "text-pink-500" },
  masculino: { icon: MaleSymbolIcon, label: "Masculino", className: "text-sky-500" },
};

export function ProfileCard({
  name,
  initials,
  imageUrl,
  gender,
  identityVerified = false,
  rating,
  reviewCount,
}: ProfileCardProps) {
  const genderInfo = gender ? genderIcon[gender] : undefined;

  return (
    <article className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card px-4 pb-5 pt-6">
      <div className="relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="size-20 rounded-2xl object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-20 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground"
          >
            {initials}
          </div>
        )}
        {identityVerified && (
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
          {name}
          {genderInfo && (
            <HugeiconsIcon
              icon={genderInfo.icon}
              size={16}
              strokeWidth={2}
              aria-label={genderInfo.label}
              className={genderInfo.className}
            />
          )}
        </h2>
        {rating !== null && reviewCount > 0 ? (
          <p className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
            <HugeiconsIcon
              icon={StarIcon}
              size={13}
              strokeWidth={2}
              className="text-amber-500"
            />
            {rating.toFixed(1)} · {reviewCount}{" "}
            {reviewCount === 1 ? "avaliação" : "avaliações"}
          </p>
        ) : (
          <p className="text-[12px] text-muted-foreground">
            Sem avaliações ainda
          </p>
        )}
      </div>

      {identityVerified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
          <HugeiconsIcon icon={Tick02Icon} size={11} strokeWidth={2.5} />
          Identidade verificada
        </span>
      )}
    </article>
  );
}
