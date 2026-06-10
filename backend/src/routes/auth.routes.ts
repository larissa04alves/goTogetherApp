import { toNodeHandler } from "better-auth/node";
import type { Express } from "express";

import { auth } from "@/auth";
import { registerUser } from "@/controllers/auth.controller";

export function registerAuthRoutes(app: Express) {
  app.post("/auth/register", registerUser);
  app.all("/api/auth{/*path}", toNodeHandler(auth));
}
