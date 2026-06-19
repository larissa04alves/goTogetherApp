import { toast } from "sonner";

import type { Review } from "../types";
import { ReviewCard } from "./review-card";

type ReviewsSectionProps = {
  reviews: Review[];
};

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-foreground">
          Avaliações recentes
        </h2>
        <button
          type="button"
          onClick={() => toast.info("Em breve")}
          className="text-[12px] font-bold text-primary hover:underline focus-visible:outline-none"
        >
          Ver todas
        </button>
      </div>

      {reviews.length > 0 ? (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card p-4 text-center text-[12px] text-muted-foreground">
          Nenhuma avaliação ainda.
        </p>
      )}
    </section>
  );
}
