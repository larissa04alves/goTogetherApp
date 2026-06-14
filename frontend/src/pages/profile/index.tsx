import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/api/auth";
import { fetchReceivedReviews } from "@/api/reviews";
import { formatRelativeTime } from "@/lib/format-relative-time";

import { BottomNav } from "../../components/bottom-nav";
import { ProfileCard } from "./components/profile-card";
import { ProfileHeader } from "./components/profile-header";
import { ReviewsSection } from "./components/reviews-section";
import type { Review } from "./types";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export default function ProfilePage() {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    fetchReceivedReviews(userId)
      .then((received) => {
        if (!active) return;
        setReviews(
          received.map((r) => ({
            id: r.id,
            author: {
              initials: getInitials(r.avaliador.name),
              name: r.avaliador.name,
              imageUrl: r.avaliador.image ?? undefined,
            },
            when: formatRelativeTime(r.createdAt),
            rating: r.nota,
            text: r.comentario ?? "",
          })),
        );
      })
      .catch((err) => {
        if (active)
          toast.error(
            err instanceof Error ? err.message : "Erro ao carregar avaliações",
          );
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const rating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10,
        ) / 10
      : null;

  const name = data?.user?.name ?? "Visitante";

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-5 px-5 pb-24 pt-8">
        <ProfileHeader />
        <ProfileCard
          name={name}
          initials={getInitials(name)}
          imageUrl={data?.user?.image ?? undefined}
          gender={data?.user?.gender}
          identityVerified={data?.user?.identityVerified ?? false}
          rating={rating}
          reviewCount={reviews.length}
        />
        <ReviewsSection reviews={reviews} />
      </div>
      <BottomNav active="profile" />
    </main>
  );
}
