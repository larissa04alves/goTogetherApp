import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { cpfValido, limparCpf } from '@/utils/cpf';

const textoOpcional = z
  .string()
  .trim()
  .optional()
  .transform((valor) => (valor === '' ? undefined : valor));

export const registerSchema = z.object({
  nome_completo: z
    .string()
    .trim()
    .min(1, 'Nome completo é obrigatório.')
    .refine(
      (valor) => valor.split(/\s+/).length >= 2,
      'Nome completo deve conter pelo menos duas palavras.'
    ),

  email: z
    .string()
    .trim()
    .min(1, 'E-mail é obrigatório.')
    .email('Formato de e-mail inválido.')
    .toLowerCase(),

  senha: z
    .string()
    .min(1, 'Senha é obrigatória.')
    .min(8, 'Senha deve conter no mínimo 8 caracteres.')
    .regex(/[A-Za-z]/, 'Senha deve conter pelo menos uma letra.')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número.'),

  cpf: z
    .string()
    .trim()
    .min(1, 'CPF é obrigatório.')
    .transform((valor) => limparCpf(valor))
    .refine((valor) => cpfValido(valor), 'CPF inválido.'),

  telefone: textoOpcional,

  genero: textoOpcional,

  instituicao: textoOpcional,

  curso: textoOpcional,

  periodo: textoOpcional,
});

export type RegisterPayload = z.infer<typeof registerSchema>;

export function formatValidationErrors(error: z.ZodError) {
  return error.flatten().fieldErrors;
}

export function validateRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: 'Erro de validação.',
      errors: formatValidationErrors(result.error),
    });
  }

  req.body = result.data;
  return next();
}

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "E-mail é obrigatório.")
    .email("E-mail inválido."),

  senha: z
    .string()
    .trim()
    .min(1, "Senha é obrigatória."),
});

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten();

    return res.status(400).json({
      message: "Erro de validação.",
      errors: {
        formErrors: errors.formErrors,
        fieldErrors: errors.fieldErrors,
      },
    });
  }

  req.body = result.data;
  next();
}