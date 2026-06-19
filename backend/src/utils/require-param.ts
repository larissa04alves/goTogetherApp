import type { Request } from "express";

import { AppError } from "@/utils/app-error";

export function requireParam(req: Request, name: string, message: string): string {
  const raw = req.params[name];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) throw new AppError(400, message);
  return value;
}
