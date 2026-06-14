import { toNodeHandler } from "better-auth/node";
import type { Express } from "express";

import { auth } from "@/auth";

export function registerAuthRoutes(app: Express) {
  app.all("/api/auth{/*path}", toNodeHandler(auth));
}
