import { env } from "@/env";

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

const BASE_URL = env.VITE_SERVER_URL;

export async function fetchPerfilPublico(id: string): Promise<PerfilPublico> {
  const response = await fetch(`${BASE_URL}/perfil/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const body = (await response.json()) as {
        error?: string;
        message?: string;
      };
      message = body.error ?? body.message ?? message;
    } catch {
      // resposta sem corpo JSON; mantém a mensagem padrão
    }
    throw new Error(message);
  }

  return (await response.json()) as PerfilPublico;
}
