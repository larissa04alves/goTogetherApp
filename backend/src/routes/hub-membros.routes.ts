import type { Express } from "express";

import { hubMembrosController } from "@/controllers/hub-membros.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerHubMembrosRoutes(app: Express) {
  app.get("/hubs/:id/membros", authMiddleware, hubMembrosController.listarMembros);
  app.patch("/hubs/:hubId/membros/:membroId/expulsar", authMiddleware, hubMembrosController.expulsar);
}
