import { z } from "zod";

export const criarRotaSchema = z.object({
  origem_nome: z.string().min(1),
  origem_endereco: z.string().min(1),
  origem_lat: z.number().finite(),
  origem_lng: z.number().finite(),
  destino_nome: z.string().min(1),
  destino_endereco: z.string().min(1),
  destino_lat: z.number().finite(),
  destino_lng: z.number().finite(),
  horario_padrao: z.string().min(1),
  distancia_km: z.number().positive(),
});

export const atualizarRotaSchema = criarRotaSchema.partial();

export type CriarRotaInput = z.infer<typeof criarRotaSchema>;
export type AtualizarRotaInput = z.infer<typeof atualizarRotaSchema>;
