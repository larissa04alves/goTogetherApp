import { request } from "@/api/client";

export type Rota = {
  id: string;
  userId: string;
  origemNome: string;
  origemEndereco: string;
  origemLat: number;
  origemLng: number;
  destinoNome: string;
  destinoEndereco: string;
  destinoLat: number;
  destinoLng: number;
  horarioPadrao: string;
  distanciaKm: number;
  criadoEm: string;
};

export type RotaInput = {
  origem_nome: string;
  origem_endereco: string;
  origem_lat: number;
  origem_lng: number;
  destino_nome: string;
  destino_endereco: string;
  destino_lat: number;
  destino_lng: number;
  horario_padrao: string;
  distancia_km: number;
};

export function fetchRotas(): Promise<Rota[]> {
  return request<Rota[]>("/rotas");
}

export function createRota(input: RotaInput): Promise<Rota> {
  return request<Rota>("/rotas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateRota(id: string, input: Partial<RotaInput>): Promise<Rota> {
  return request<Rota>(`/rotas/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteRota(id: string): Promise<void> {
  return request<void>(`/rotas/${id}`, { method: "DELETE" });
}
