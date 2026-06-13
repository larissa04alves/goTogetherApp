import { z } from "zod";

export const criarAvaliacaoSchema = z.object({
  carona_id: z.string().min(1),
  avaliado_id: z.string().min(1),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().optional(),
});

export type CriarAvaliacaoInput = z.infer<typeof criarAvaliacaoSchema>;
