import { z } from "zod";

export const atualizarPerfilSchema = z
  .object({
    telefone: z.string().min(1).optional(),
    genero: z.string().min(1).optional(),
    instituicao: z.string().min(1).optional(),
    curso: z.string().min(1).optional(),
    periodo: z.string().min(1).optional(),
    contato_emergencia_nome: z.string().min(1).optional(),
    contato_emergencia_telefone: z.string().min(1).optional(),
    foto_url: z.string().min(1).optional(),
  })
  .strict();

export type AtualizarPerfilInput = z.infer<typeof atualizarPerfilSchema>;
