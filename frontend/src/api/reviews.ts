import { request } from "@/api/client";

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
