import { toNodeHandler } from "better-auth/node";
import type { Express } from "express";
import { Router } from "express";

import { auth } from "@/auth";
import { login, logout, me, register } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validateLogin, validateRegister } from "@/validators/auth.validator";

const router = Router();

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

router.get("/me", authMiddleware, me);

router.post("/logout", authMiddleware, logout);

export function registerAuthRoutes(app: Express) {
  app.all("/api/auth{/*path}", toNodeHandler(auth));
}

export default router;
