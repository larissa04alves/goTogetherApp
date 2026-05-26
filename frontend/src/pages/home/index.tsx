import { authClient } from "@/api/auth";

import { BottomNav } from "../../components/bottom-nav";
import { HomeHeader } from "./components/home-header";
import { RidesList } from "./components/rides-list";
import { RouteSelector } from "./components/route-selector";
import { mockRides, mockRoute } from "./mock";

export default function HomePage() {
  const { data } = authClient.useSession();
  const userName = data?.user.name ?? "Visitante";

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-5 px-5 pb-24 pt-8">
        <HomeHeader userName={userName} />
        <RouteSelector route={mockRoute} />
        <RidesList rides={mockRides} />
      </div>
      <BottomNav active="home" />
    </main>
  );
}
