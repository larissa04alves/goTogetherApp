import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { authClient } from "@/api/auth";
import { fetchPerfilPublico, type PerfilPublico } from "@/api/perfil";
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
  const { id } = useParams();
  const { data } = authClient.useSession();
  const ownId = data?.user?.id;
  const isOwn = !id || id === ownId;
  const targetId = id ?? ownId;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [publicProfile, setPublicProfile] = useState<PerfilPublico | null>(null);

  useEffect(() => {
    if (!targetId) return;
    let active = true;
    fetchReceivedReviews(targetId)
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
  }, [targetId]);

  useEffect(() => {
    if (isOwn || !id) {
      setPublicProfile(null);
      return;
    }
    let active = true;
    fetchPerfilPublico(id)
      .then((perfil) => {
        if (active) setPublicProfile(perfil);
      })
      .catch((err) => {
        if (active)
          toast.error(
            err instanceof Error ? err.message : "Erro ao carregar perfil",
          );
      });
    return () => {
      active = false;
    };
  }, [id, isOwn]);

  const computedRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10,
        ) / 10
      : null;

  const name = isOwn
    ? (data?.user?.name ?? "Visitante")
    : (publicProfile?.name ?? "Usuário");
  const imageUrl = isOwn
    ? (data?.user?.image ?? undefined)
    : (publicProfile?.image ?? undefined);
  const gender = isOwn ? data?.user?.gender : publicProfile?.gender;
  const identityVerified = isOwn
    ? (data?.user?.identityVerified ?? false)
    : (publicProfile?.identityVerified ?? false);
  const rating = isOwn ? computedRating : (publicProfile?.avaliacaoMedia ?? null);

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-5 px-5 pb-24 pt-8">
        <ProfileHeader isOwn={isOwn} />
        <ProfileCard
          name={name}
          initials={getInitials(name)}
          imageUrl={imageUrl}
          gender={gender}
          identityVerified={identityVerified}
          rating={rating}
          reviewCount={reviews.length}
        />
        <ReviewsSection reviews={reviews} />
      </div>
      <BottomNav active="profile" />
    </main>
  );
}
