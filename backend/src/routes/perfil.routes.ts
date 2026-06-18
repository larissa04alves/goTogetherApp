import type { Express } from "express";

import { perfilController } from "@/controllers/perfil.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerPerfilRoutes(app: Express) {
  app.get("/perfil/me", authMiddleware, perfilController.buscarMeu);
  app.put("/perfil/me", authMiddleware, perfilController.atualizar);
  app.get("/perfil/:id", authMiddleware, perfilController.buscarPublico);
  app.get("/perfil/:id/avaliacoes", authMiddleware, perfilController.listarAvaliacoes);
}
