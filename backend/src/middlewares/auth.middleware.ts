import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

import { auth } from "@/auth";
import { AppError } from "@/utils/app-error";

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

  if (!betterAuthSession) {
    next(new AppError(401, "Não autenticado."));
    return;
  }

  storeAuthenticatedContext(
    req,
    res,
    buildLegacyUserFromSession(betterAuthSession),
    betterAuthSession,
  );
  next();
}
