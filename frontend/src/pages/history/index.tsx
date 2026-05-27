import { useEffect, useState } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { loadJSON, saveJSON } from "@/lib/storage";
import type { SavedRoute } from "@/pages/route/types";

import { EmptyHubs } from "./components/empty-hubs";
import { HubCard } from "./components/hub-card";
import type { Hub } from "./types";

const HUBS_KEY = "hubs";
const ROUTES_KEY = "routes";

export default function HistoryPage() {
  const [hubs, setHubs] = useState<Hub[]>(() => loadJSON<Hub[]>(HUBS_KEY, []));
  const [routes] = useState<SavedRoute[]>(() =>
    loadJSON<SavedRoute[]>(ROUTES_KEY, []),
  );

  useEffect(() => {
    saveJSON(HUBS_KEY, hubs);
  }, [hubs]);

  const sorted = [...hubs].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-4 px-5 pb-24 pt-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold leading-tight text-foreground">
            Histórico de caronas
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            {hubs.length} {hubs.length === 1 ? "criada" : "criadas"}
          </p>
        </header>

        {sorted.length === 0 ? (
          <EmptyHubs onCreate={() => setHubs(hubs)} />
        ) : (
          <section className="flex flex-col gap-3">
            {sorted.map((hub) => (
              <HubCard
                key={hub.id}
                hub={hub}
                route={routes.find((r) => r.id === hub.routeId)}
              />
            ))}
          </section>
        )}
      </div>
      <BottomNav active="history" />
    </main>
  );
}
