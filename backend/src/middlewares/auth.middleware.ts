import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { auth } from "@/auth";
import { findAuthenticatedUserById } from "@/services/auth.service";

type AuthTokenPayload = {
  userId: string;
  email: string;
  role: string;
};

type SessionContext = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
  };
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

function getBearerToken(req: Request): string | null {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return null;
  }

  return token;
}

function buildLegacyUserFromSession(session: SessionContext): AuthenticatedUser {
  const now = new Date();

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    cpf: null,
    phone: null,
    gender: null,
    institution: null,
    course: null,
    period: null,
    role: "student",
    emailVerified: session.user.emailVerified,
    identityVerified: false,
    image: session.user.image ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

function buildSessionContext(user: AuthenticatedUser): SessionContext {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
    },
  };
}

function storeAuthenticatedContext(
  req: Request,
  res: Response,
  user: AuthenticatedUser,
  session: SessionContext,
): void {
  req.user = user;
  res.locals["session"] = session;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const betterAuthSession = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (betterAuthSession) {
    storeAuthenticatedContext(
      req,
      res,
      buildLegacyUserFromSession(betterAuthSession),
      betterAuthSession,
    );
    next();
    return;
  }

  const token = getBearerToken(req);

  if (!token) {
    res.status(401).json({
      error: "Nao autenticado.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;

    if (!decoded.userId) {
      res.status(401).json({
        error: "Token invalido.",
      });
      return;
    }

    const authenticatedUser = await findAuthenticatedUserById(decoded.userId);

    if (!authenticatedUser) {
      res.status(401).json({
        error: "Usuario autenticado nao encontrado.",
      });
      return;
    }

    storeAuthenticatedContext(
      req,
      res,
      authenticatedUser,
      buildSessionContext(authenticatedUser),
    );
    next();
  } catch {
    res.status(401).json({
      error: "Token invalido ou expirado.",
    });
  }
}
