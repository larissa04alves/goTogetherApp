import { z } from "zod";

export const emailValidator = z.email("Informe um e-mail válido");

export const passwordValidator = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres");

export const nameValidator = z.string().min(2, "Informe seu nome completo");

const brPhoneRegex = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

export const phoneValidator = z
  .string()
  .regex(brPhoneRegex, "Telefone inválido");

export const emergencyContactValidator = z
  .string()
  .min(5, "Informe nome e telefone do contato de emergência");
