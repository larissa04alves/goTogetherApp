import type { SavedRoute } from "./types";

export const mockSavedRoutes: SavedRoute[] = [
  {
    id: "1",
    origin: {
      label: "PUCPR",
      address: "Rua Imaculada Conceição, 155",
      kind: "origin",
    },
    destination: {
      label: "Casa",
      address: "Av. Comendador Araújo, 250",
      kind: "home",
    },
    departureTime: "23:00",
  },
  {
    id: "2",
    origin: {
      label: "Casa",
      address: "Av. Comendador Araújo, 250",
      kind: "origin",
    },
    destination: {
      label: "Trabalho",
      address: "Rua das Espinaúvas, 412",
      kind: "work",
    },
    departureTime: "06:30",
  },
];
