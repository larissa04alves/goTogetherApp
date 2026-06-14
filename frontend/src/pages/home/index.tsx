import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/api/auth";
import { fetchCaronas, type Carona } from "@/api/caronas";

import { BottomNav } from "../../components/bottom-nav";
import { HomeHeader } from "./components/home-header";
import { RidesList } from "./components/rides-list";
import { RouteSelector } from "./components/route-selector";
import { mockRoute } from "./mock";
import type { Ride } from "./types";

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

function toRide(c: Carona): Ride {
  return {
    id: c.id,
    driver: {
      initials: initialsFrom(c.ofertante.name),
      name: c.ofertante.name,
      rating: 0,
      ridesCount: 0,
      verified: c.ofertante.identityVerified,
      imageUrl: c.ofertante.image ?? undefined,
    },
    car: c.veiculo
      ? { model: c.veiculo.modelo, plate: c.veiculo.placa }
      : undefined,
    similarity: "alta",
    similarityMatchPct: 100,
    modality: c.tipo === "carro_proprio" ? "carro" : "app",
    time: c.horarioSaida,
    seatsTaken: c.vagasMax - c.vagasDisponiveis,
    seatsTotal: c.vagasMax,
    priceBRL: c.valorPorPessoa != null ? c.valorPorPessoa / 100 : 0,
    route: {
      origin: { label: c.origemLabel, address: c.origemEndereco },
      destination: { label: c.destinoLabel, address: c.destinoEndereco },
    },
  };
}

export default function HomePage() {
  const { data } = authClient.useSession();
  const userName = data?.user.name ?? "Visitante";
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    let active = true;
    fetchCaronas()
      .then((caronas) => {
        if (active) setRides(caronas.map(toRide));
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
  }, []);

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-5 px-5 pb-24 pt-8">
        <HomeHeader userName={userName} />
        <RouteSelector route={mockRoute} />
        <RidesList rides={rides} />
      </div>
      <BottomNav active="hubs" />
    </main>
  );
}
