import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findAuthenticatedUserById } from "../services/auth.service";

type AuthTokenPayload = {
  userId: string;
  email: string;
  role: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
  gender: string | null;
  institution: string | null;
  course: string | null;
  period: string | null;
  role: string;
  emailVerified: boolean;
  identityVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }

  return secret;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Token não informado.",
      });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Token inválido.",
      });
    }

    const decoded = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;

    if (!decoded.userId) {
      return res.status(401).json({
        message: "Token inválido.",
      });
    }

    const authenticatedUser = await findAuthenticatedUserById(decoded.userId);

    if (!authenticatedUser) {
      return res.status(401).json({
        message: "Usuário autenticado não encontrado.",
      });
    }

    req.user = authenticatedUser;

    next();
  } catch {
    return res.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}