import type { Rota, RotaInput } from "@/api/rotas";

import type { Endpoint, SavedRoute } from "./types";

function inferKind(label: string): Endpoint["kind"] {
  const normalized = label.trim().toLowerCase();
  if (normalized === "casa") return "home";
  if (normalized === "trabalho") return "work";
  return "origin";
}

export function rotaToSavedRoute(r: Rota): SavedRoute {
  return {
    id: r.id,
    origin: {
      label: r.origemNome,
      address: r.origemEndereco,
      kind: "origin",
      lat: r.origemLat,
      lng: r.origemLng,
    },
    destination: {
      label: r.destinoNome,
      address: r.destinoEndereco,
      kind: inferKind(r.destinoNome),
      lat: r.destinoLat,
      lng: r.destinoLng,
    },
    departureTime: r.horarioPadrao,
  };
}

export type RouteFormValues = {
  originLabel: string;
  originAddress: string;
  destinationLabel: string;
  destinationAddress: string;
  departureTime: string;
};

export function formToRotaInput(values: RouteFormValues): RotaInput {
  return {
    origem_nome: values.originLabel,
    origem_endereco: values.originAddress,
    origem_lat: 0,
    origem_lng: 0,
    destino_nome: values.destinationLabel,
    destino_endereco: values.destinationAddress,
    destino_lat: 0,
    destino_lng: 0,
    horario_padrao: values.departureTime,
    distancia_km: 1,
  };
}
