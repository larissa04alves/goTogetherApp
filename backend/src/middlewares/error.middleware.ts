import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { env } from "@/env";
import { errorBody } from "@/utils/api-response";
import { AppError } from "@/utils/app-error";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorBody(err.statusCode, err.message, err.details));
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json(errorBody(400, "Dados inválidos", err.flatten()));
    return;
  }

  const isDev = env.NODE_ENV === "development";
  const message = isDev && err instanceof Error ? err.message : "Erro interno do servidor";
  const details = isDev && err instanceof Error ? err.stack : undefined;

  res.status(500).json(errorBody(500, message, details));
};
