import type { Express } from "express";

import { solicitacoesController } from "@/controllers/solicitacoes.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerSolicitacoesRoutes(app: Express) {
  app.post("/hubs/:id/solicitar", authMiddleware, solicitacoesController.solicitar);
  app.get("/hubs/:id/solicitacoes", authMiddleware, solicitacoesController.listar);
  app.patch("/solicitacoes/:id/aprovar", authMiddleware, solicitacoesController.aprovar);
  app.patch("/solicitacoes/:id/rejeitar", authMiddleware, solicitacoesController.rejeitar);
  app.patch("/solicitacoes/:id/cancelar", authMiddleware, solicitacoesController.cancelar);
}
