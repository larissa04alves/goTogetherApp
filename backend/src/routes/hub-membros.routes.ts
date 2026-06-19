import type { Express } from "express";

import { hubMembrosController } from "@/controllers/hub-membros.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerHubMembrosRoutes(app: Express) {
  app.get("/hubs/:id/membros", authMiddleware, hubMembrosController.listarMembros);
  app.post("/hubs/:id/entrar", authMiddleware, hubMembrosController.entrar);
  app.post("/hubs/:id/sair", authMiddleware, hubMembrosController.sair);
  app.patch("/hubs/:hubId/membros/:membroId/expulsar", authMiddleware, hubMembrosController.expulsar);
}
