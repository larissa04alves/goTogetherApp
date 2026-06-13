import type { Express } from "express";

import { chatController } from "@/controllers/chat.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerChatRoutes(app: Express) {
  app.post("/chat/token", authMiddleware, chatController.token);
  app.post("/hubs/:id/chat", authMiddleware, chatController.joinHub);
}
