import { z } from "zod";

export const criarVeiculoSchema = z.object({
  marca: z.string().min(1),
  modelo: z.string().min(1),
  placa: z.string().min(1),
  cor: z.string().min(1),
  capacidade: z.number().int().min(1).max(7),
});

export const atualizarVeiculoSchema = criarVeiculoSchema.partial();

export type CriarVeiculoInput = z.infer<typeof criarVeiculoSchema>;
export type AtualizarVeiculoInput = z.infer<typeof atualizarVeiculoSchema>;
