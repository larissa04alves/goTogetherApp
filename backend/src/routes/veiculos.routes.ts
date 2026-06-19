import type { Express } from "express";

import { veiculosController } from "@/controllers/veiculos.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerVeiculosRoutes(app: Express) {
  app.get("/veiculos", authMiddleware, veiculosController.listar);
  app.get("/veiculos/:id", authMiddleware, veiculosController.buscar);
  app.post("/veiculos", authMiddleware, veiculosController.criar);
  app.put("/veiculos/:id", authMiddleware, veiculosController.atualizar);
  app.delete("/veiculos/:id", authMiddleware, veiculosController.excluir);
}
