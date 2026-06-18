import { env } from "@/env";

export type CaronaTipo = "carro_proprio" | "rachar_app";
export type CaronaStatus = "aberta" | "fechada" | "cancelada" | "concluida";

export type HubOfertante = { id: string; name: string; image: string | null };

export type HubRota = {
  id: string;
  origemNome: string;
  origemLat: number;
  origemLng: number;
  destinoNome: string;
  destinoLat: number;
  destinoLng: number;
};

export type HubVeiculo = {
  id: string;
  marca: string;
  modelo: string;
  cor: string;
  placa: string;
};

export type Hub = {
  id: string;
  tipo: CaronaTipo;
  horarioSaida: string;
  vagasMax: number;
  vagasDisponiveis: number;
  valorPorPessoa: number | null;
  soMulheres: boolean;
  status: CaronaStatus;
  criadoEm: string;
  ofertante: HubOfertante;
  rota: HubRota;
  veiculo: HubVeiculo | null;
};

export type HubMembro = {
  caronaId: string;
  userId: string;
  role: "motorista" | "passageiro";
  status: "ativo" | "expulso";
  user: { id: string; name: string; image: string | null };
};

export type MeuHub = {
  id: string;
  tipo: CaronaTipo;
  horarioSaida: string;
  vagasMax: number;
  vagasDisponiveis: number;
  valorPorPessoa: number | null;
  soMulheres: boolean;
  status: CaronaStatus;
  criadoEm: string;
  papel: "motorista" | "passageiro";
  rota: { id: string; origemNome: string; destinoNome: string };
  veiculo: {
    id: string;
    marca: string;
    modelo: string;
    placa: string;
  } | null;
  membros: HubMembro[];
};

export type CriarHubInput =
  | {
      tipo: "carro_proprio";
      rota_id: string;
      horario_saida: string;
      vagas_max: number;
      so_mulheres?: boolean;
      veiculo_id: string;
      valor_por_pessoa: number;
    }
  | {
      tipo: "rachar_app";
      rota_id: string;
      horario_saida: string;
      vagas_max: number;
      so_mulheres?: boolean;
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
    const body = (await response.json()) as {
      error?: string;
      message?: string;
    };
    return body.error ?? body.message ?? `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}

export function fetchHubs(rotaId?: string): Promise<Hub[]> {
  const qs = rotaId ? `?rota_id=${encodeURIComponent(rotaId)}` : "";
  return request<Hub[]>(`/hubs${qs}`);
}

export function fetchMeusHubs(): Promise<MeuHub[]> {
  return request<MeuHub[]>("/hubs/me");
}

export function createHub(input: CriarHubInput): Promise<{ id: string }> {
  return request<{ id: string }>("/hubs", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function entrarHub(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/hubs/${id}/entrar`, { method: "POST" });
}

export function sairHub(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/hubs/${id}/sair`, { method: "POST" });
}

export function concluirHub(
  id: string,
): Promise<{ id: string; status: CaronaStatus }> {
  return request<{ id: string; status: CaronaStatus }>(`/hubs/${id}/concluir`, {
    method: "PATCH",
  });
}

export function cancelarHub(
  id: string,
): Promise<{ id: string; status: CaronaStatus }> {
  return request<{ id: string; status: CaronaStatus }>(`/hubs/${id}/cancelar`, {
    method: "PATCH",
  });
}

export function expulsarMembro(
  hubId: string,
  membroId: string,
): Promise<{ message: string }> {
  return request<{ message: string }>(
    `/hubs/${hubId}/membros/${membroId}/expulsar`,
    { method: "PATCH" },
  );
}
