import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type ProfileCardProps = {
  name: string;
  initials: string;
  imageUrl?: string;
  rating: number | null;
  reviewCount: number;
};

export function ProfileCard({
  name,
  initials,
  imageUrl,
  rating,
  reviewCount,
}: ProfileCardProps) {
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
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-[18px] font-bold leading-tight text-foreground">
          {name}
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
    </article>
  );
}
