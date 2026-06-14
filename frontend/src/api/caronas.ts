import { env } from "@/env";

export type CaronaTipo = "carro_proprio" | "rachar_app";
export type CaronaStatus = "aberta" | "fechada" | "cancelada" | "concluida";

type Ofertante = {
  id: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
  identityVerified: boolean;
};

type CaronaVeiculo = {
  marca: string;
  modelo: string;
  placa: string;
  cor: string;
};

export type Carona = {
  id: string;
  ofertanteId: string;
  rotaId: string;
  origemLabel: string;
  origemEndereco: string;
  destinoLabel: string;
  destinoEndereco: string;
  tipo: CaronaTipo;
  veiculoId: string | null;
  horarioSaida: string;
  vagasMax: number;
  vagasDisponiveis: number;
  valorPorPessoa: number | null;
  soMulheres: boolean;
  status: CaronaStatus;
  ofertante: Ofertante;
  veiculo: CaronaVeiculo | null;
};

export type CaronaMembro = {
  userId: string;
  role: "motorista" | "passageiro";
  user: { id: string; name: string; image: string | null };
};

export type MinhaCarona = Omit<Carona, "ofertante"> & {
  membros: CaronaMembro[];
};

export type CriarCaronaInput = {
  tipo: CaronaTipo;
  rotaId: string;
  origemLabel: string;
  origemEndereco: string;
  destinoLabel: string;
  destinoEndereco: string;
  horarioSaida: string;
  vagasMax: number;
  valorPorPessoa?: number | null;
  soMulheres?: boolean;
  veiculoId?: string | null;
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

export function fetchCaronas(): Promise<Carona[]> {
  return request<Carona[]>("/caronas");
}

export function fetchMinhasCaronas(): Promise<MinhaCarona[]> {
  return request<MinhaCarona[]>("/caronas/minhas");
}

export function createCarona(input: CriarCaronaInput): Promise<Carona> {
  return request<Carona>("/caronas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function entrarCarona(id: string): Promise<Carona> {
  return request<Carona>(`/caronas/${id}/entrar`, { method: "POST" });
}
