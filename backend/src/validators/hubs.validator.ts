import { z } from "zod";

const hubCarroProprioSchema = z.object({
  tipo: z.literal("carro_proprio"),
  rota_id: z.string().min(1),
  horario_saida: z.string().min(1),
  vagas_max: z.number().int().positive(),
  so_mulheres: z.boolean().optional(),
  veiculo_id: z.string().min(1),
  valor_por_pessoa: z.number().int().positive(),
});

const hubRacharAppSchema = z
  .object({
    tipo: z.literal("rachar_app"),
    rota_id: z.string().min(1),
    horario_saida: z.string().min(1),
    vagas_max: z.number().int().positive().max(4),
    so_mulheres: z.boolean().optional(),
  })
  .strict();

export const criarHubSchema = z.discriminatedUnion("tipo", [
  hubCarroProprioSchema,
  hubRacharAppSchema,
]);

export type CriarHubInput = z.infer<typeof criarHubSchema>;
