import { Router } from 'express';
import { login, logout, me, register } from '@/controllers/auth.controller';
import { validateLogin, validateRegister } from '@/validators/auth.validator';

import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.post('/register', validateRegister, register);

router.post("/login", validateLogin, login);

router.get("/me", authMiddleware, me);

router.post("/logout", authMiddleware, logout);

export default router;
