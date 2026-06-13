import path from "path";
import type { Request, Response } from "express";
import multer from "multer";

import { AppError } from "@/utils/app-error";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${crypto.randomUUID()}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, "Tipo de arquivo não suportado. Use JPG, PNG, WebP ou PDF."));
    }
  },
});

async function uploadDocumento(req: Request, res: Response): Promise<void> {
  if (!req.file) throw new AppError(400, "Arquivo obrigatório");
  res.status(201).json({ filename: req.file.filename, path: req.file.path });
}

export const documentsController = { uploadDocumento };
