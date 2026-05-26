import { authClient } from "@/api/auth";

import { BottomNav } from "../../components/bottom-nav";
import { ProfileCard } from "./components/profile-card";
import { ProfileHeader } from "./components/profile-header";
import { ProfileStats } from "./components/profile-stats";
import { ReviewsSection } from "./components/reviews-section";
import { mockProfile, mockReviews } from "./mock";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export default function PerfilPage() {
  const { data } = authClient.useSession();
  const profile = data?.user
    ? {
        ...mockProfile,
        name: data.user.name,
        initials: getInitials(data.user.name),
        imageUrl: data.user.image ?? undefined,
      }
    : mockProfile;

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-5 px-5 pb-24 pt-8">
        <ProfileHeader />
        <ProfileCard profile={profile} />
        <ProfileStats stats={profile.stats} />
        <ReviewsSection reviews={mockReviews} />
      </div>
      <BottomNav active="profile" />
    </main>
  );
}
