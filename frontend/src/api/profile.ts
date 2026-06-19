import { request } from "@/api/client";

export type PerfilPublico = {
  id: string;
  name: string;
  gender: string | null;
  institution: string | null;
  course: string | null;
  period: string | null;
  image: string | null;
  identityVerified: boolean;
  createdAt: string;
  avaliacaoMedia: number | null;
  caronasOferecidas: number;
  caronasTomadas: number;
};

export function fetchPerfilPublico(id: string): Promise<PerfilPublico> {
  return request<PerfilPublico>(`/perfil/${id}`);
}
