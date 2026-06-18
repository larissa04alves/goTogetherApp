import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/api/auth";
import { fetchHubs, type Hub } from "@/api/hubs";
import { fetchRotas } from "@/api/rotas";

import { BottomNav } from "../../components/bottom-nav";
import { rotaToSavedRoute } from "../route/map";
import type { SavedRoute } from "../route/types";
import { HomeHeader } from "./components/home-header";
import { RidesList } from "./components/rides-list";
import { RouteSelector } from "./components/route-selector";
import type { Ride } from "./types";

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

function toRide(h: Hub): Ride {
  return {
    id: h.id,
    driver: {
      id: h.ofertante.id,
      initials: initialsFrom(h.ofertante.name),
      name: h.ofertante.name,
      rating: 0,
      ridesCount: 0,
      verified: false,
      imageUrl: h.ofertante.image ?? undefined,
    },
    car: h.veiculo
      ? { model: h.veiculo.modelo, plate: h.veiculo.placa }
      : undefined,
    similarity: "alta",
    similarityMatchPct: 100,
    modality: h.tipo === "carro_proprio" ? "carro" : "app",
    time: h.horarioSaida,
    seatsTaken: h.vagasMax - h.vagasDisponiveis,
    seatsTotal: h.vagasMax,
    priceBRL: h.valorPorPessoa != null ? h.valorPorPessoa / 100 : 0,
    route: {
      origin: { label: h.rota.origemNome, address: h.rota.origemNome },
      destination: { label: h.rota.destinoNome, address: h.rota.destinoNome },
    },
  };
}

export default function HomePage() {
  const { data } = authClient.useSession();
  const userName = data?.user.name ?? "Visitante";
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    let active = true;
    fetchRotas()
      .then((list) => {
        if (active) setRoutes(list.map(rotaToSavedRoute));
      })
      .catch(() => {
        if (active) toast.error("Erro ao carregar suas rotas salvas");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetchHubs(selectedRoute?.id)
      .then((hubs) => {
        if (active) setRides(hubs.map(toRide));
      })
      .catch((err) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : "Erro ao carregar caronas",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [selectedRoute]);

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-5 px-5 pb-24 pt-8">
        <HomeHeader userName={userName} />
        <RouteSelector
          routes={routes}
          selected={selectedRoute}
          onSelect={setSelectedRoute}
        />
        <RidesList rides={rides} />
      </div>
      <BottomNav active="hubs" />
    </main>
  );
}
