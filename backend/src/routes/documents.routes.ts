import type { Express } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { documentsController, upload } from "@/controllers/documents.controller";

export function registerDocumentsRoutes(app: Express) {
  app.post(
    "/api/documents/upload",
    authMiddleware,
    upload.single("document"),
    documentsController.uploadDocumento,
  );
}
