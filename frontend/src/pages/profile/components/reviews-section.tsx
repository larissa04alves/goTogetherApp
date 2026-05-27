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

      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
