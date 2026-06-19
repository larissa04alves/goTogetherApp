import type { Express } from "express";

import { documentsController, upload } from "@/controllers/documents.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export function registerDocumentsRoutes(app: Express) {
  app.post(
    "/api/documents/upload",
    authMiddleware,
    upload.single("document"),
    documentsController.uploadDocumento,
  );
}
