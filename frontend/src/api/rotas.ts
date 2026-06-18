import { env } from "@/env";

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

const BASE_URL = env.VITE_SERVER_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string; message?: string };
    return body.error ?? body.message ?? `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}

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
