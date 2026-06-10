import { z, type ZodError } from "zod";

import { isValidCpf, normalizeCpf } from "@/utils/cpf";

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? undefined : trimmedValue;
}

const optionalTextField = z.preprocess(normalizeOptionalString, z.string().max(255).optional());

export const registerPayloadSchema = z.object({
  nome_completo: z
    .string()
    .trim()
    .min(1, "nome_completo e obrigatorio.")
    .refine(
      (value) => value.split(/\s+/).filter(Boolean).length >= 2,
      "nome_completo deve conter pelo menos duas palavras.",
    ),
  email: z
    .string()
    .trim()
    .min(1, "email e obrigatorio.")
    .email("email deve ter um formato valido.")
    .transform((value) => value.toLowerCase()),
  senha: z
    .string()
    .min(1, "senha e obrigatoria.")
    .min(8, "senha deve ter no minimo 8 caracteres.")
    .refine(
      (value) => /[A-Za-z]/.test(value) && /\d/.test(value),
      "senha deve conter letras e numeros.",
    ),
  cpf: z
    .string()
    .trim()
    .min(1, "cpf e obrigatorio.")
    .transform(normalizeCpf)
    .refine((value) => isValidCpf(value), "cpf invalido."),
  telefone: z.preprocess(normalizeOptionalString, z.string().max(20).optional()),
  genero: z.preprocess(normalizeOptionalString, z.string().max(50).optional()),
  instituicao: optionalTextField,
  curso: optionalTextField,
  periodo: optionalTextField,
});

export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

export function formatValidationErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
