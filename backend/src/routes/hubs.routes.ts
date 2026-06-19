import type { Express } from "express";

import { hubsController } from "@/controllers/hubs.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerHubsRoutes(app: Express) {
  app.post("/hubs", authMiddleware, hubsController.criar);
  app.get("/hubs", authMiddleware, hubsController.listar);
  app.get("/hubs/me", authMiddleware, hubsController.listarMeus);
  app.get("/hubs/:id", authMiddleware, hubsController.buscar);
  app.patch("/hubs/:id/cancelar", authMiddleware, hubsController.cancelar);
  app.patch("/hubs/:id/concluir", authMiddleware, hubsController.concluir);
}
