import { env } from "@/env";

export type ReceivedReview = {
  id: string;
  nota: number;
  comentario: string | null;
  createdAt: string;
  avaliador: {
    id: string;
    name: string;
    image: string | null;
  };
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

export type PendingReview = {
  caronaId: string;
  usuario: { id: string; name: string; email: string };
};

export type CriarAvaliacaoInput = {
  carona_id: string;
  avaliado_id: string;
  nota: number;
  comentario?: string;
};

export function fetchReceivedReviews(userId: string): Promise<ReceivedReview[]> {
  return request<ReceivedReview[]>(`/perfil/${userId}/avaliacoes`);
}

export function fetchAvaliacoesPendentes(): Promise<PendingReview[]> {
  return request<PendingReview[]>("/avaliacoes/pendentes");
}

export function createAvaliacao(input: CriarAvaliacaoInput): Promise<unknown> {
  return request("/avaliacoes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
