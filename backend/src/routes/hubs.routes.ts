import type { Express } from "express";

import { hubsController } from "@/controllers/hubs.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerHubsRoutes(app: Express) {
  app.post("/hubs", authMiddleware, hubsController.criar);
}
