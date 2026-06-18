import type { Express } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { rotasController } from "@/controllers/rotas.controller";

export function registerRotasRoutes(app: Express) {
  app.get("/rotas", authMiddleware, rotasController.listar);
  app.get("/rotas/:id", authMiddleware, rotasController.buscar);
  app.post("/rotas", authMiddleware, rotasController.criar);
  app.put("/rotas/:id", authMiddleware, rotasController.atualizar);
  app.delete("/rotas/:id", authMiddleware, rotasController.excluir);
}