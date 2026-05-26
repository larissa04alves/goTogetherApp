// frontend/src/pages/caronas/types.ts
import type { Vehicle } from "@/pages/configuracoes/types";

export type HubMode = "carona" | "app";

export type HubBase = {
  id: string;
  routeId: string;
  departureTime: string; // "HH:mm"
  seats: number;
  createdAt: string; // ISO
};

export type CaronaHub = HubBase & {
  mode: "carona";
  priceBRL: number;
  vehicle: Vehicle;
};

export type AppTransporteHub = HubBase & {
  mode: "app";
  notes?: string;
};

export type Hub = CaronaHub | AppTransporteHub;
