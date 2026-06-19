import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

import { auth } from "@/auth";
import { AppError } from "@/utils/app-error";

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
  };
};

function storeAuthenticatedContext(res: Response, session: Session): void {
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

  storeAuthenticatedContext(res, betterAuthSession);
  next();
}
