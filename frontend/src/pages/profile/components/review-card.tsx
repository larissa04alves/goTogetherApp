import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Review } from "../types";

type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3">
      <header className="flex items-start gap-3">
        {review.author.imageUrl ? (
          <img
            src={review.author.imageUrl}
            alt={review.author.name}
            className="size-9 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-[12px] font-bold text-primary-foreground"
          >
            {review.author.initials}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-[13px] font-bold text-foreground">
            {review.author.name}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {review.when} · {review.route}
          </p>
        </div>

        <RatingStars rating={review.rating} />
      </header>

      <p className="text-[12px] leading-relaxed text-foreground/90">
        {review.text}
      </p>
    </article>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span
      aria-label={`${rating} de 5 estrelas`}
      className="flex shrink-0 items-center gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <HugeiconsIcon
          key={i}
          icon={StarIcon}
          size={12}
          strokeWidth={2}
          className={i <= rating ? "text-amber-500" : "text-slate-300"}
        />
      ))}
    </span>
  );
}
