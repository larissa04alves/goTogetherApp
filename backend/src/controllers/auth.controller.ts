import type { Request, Response } from 'express';
import { registerUser } from '@/services/auth.service';

import { loginUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const usuario = await registerUser(req.body);

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      usuario,
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && 'statusCode' in error
        ? Number((error as { statusCode: number }).statusCode)
        : 500;

    const message =
      error instanceof Error
        ? error.message
        : 'Erro interno ao cadastrar usuário.';

    return res.status(statusCode).json({
      message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(error.status || 500).json({
      message: error.message || "Erro interno ao realizar login.",
    });
  }
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: "Usuário não autenticado.",
    });
  }

  return res.status(200).json({
    user: req.user,
  });
}

export async function logout(_req: Request, res: Response) {
  return res.status(200).json({
    message: "Logout realizado com sucesso.",
  });
}