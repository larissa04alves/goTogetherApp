import type { Request, Response } from 'express';
import { registerUser } from '@/services/auth.service';

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