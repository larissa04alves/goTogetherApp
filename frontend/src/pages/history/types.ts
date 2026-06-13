import type { Vehicle } from "@/api/vehicles";

export type HubMode = "carona" | "app";

export type HubBase = {
  id: string;
  routeId: string;
  departureTime: string;
  seats: number;
  createdAt: string;
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
