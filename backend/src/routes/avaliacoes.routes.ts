import type { Express } from "express";

import { avaliacoesController } from "@/controllers/avaliacoes.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerAvaliacoesRoutes(app: Express) {
  app.post("/avaliacoes", authMiddleware, avaliacoesController.criar);
  app.get("/avaliacoes/pendentes", authMiddleware, avaliacoesController.listarPendentes);
  app.get("/perfil/:id/avaliacoes", authMiddleware, avaliacoesController.listarDoUsuario);
}
