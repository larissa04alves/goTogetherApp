import type { Request, Response } from "express";

import type { Session } from "@/middlewares/auth.middleware";
import { perfilService } from "@/services/perfil.service";
import { AppError } from "@/utils/app-error";
import { requireParam } from "@/utils/require-param";
import { createServiceErrorMapper } from "@/utils/service-error";
import { atualizarPerfilSchema } from "@/validators/perfil.validator";

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  USUARIO_NAO_ENCONTRADO: { status: 404, message: "Usuário não encontrado" },
  NENHUM_CAMPO: { status: 400, message: "Nenhum campo para atualizar" },
};

const mapServiceError = createServiceErrorMapper(SERVICE_ERRORS);

async function buscarMeu(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;
  const perfil = await perfilService.buscarMeu(session.user.id);
  res.json(perfil);
}

async function atualizar(req: Request, res: Response): Promise<void> {
  const parsed = atualizarPerfilSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  const session = res.locals["session"] as Session;

  try {
    const perfil = await perfilService.atualizar(session.user.id, parsed.data);
    res.json(perfil);
  } catch (err) {
    mapServiceError(err);
  }
}

async function buscarPublico(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID do usuário obrigatório");

  try {
    const perfil = await perfilService.buscarPublico(id);
    res.json(perfil);
  } catch (err) {
    mapServiceError(err);
  }
}

async function listarAvaliacoes(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID do usuário obrigatório");
  const avaliacoes = await perfilService.listarAvaliacoes(id);
  res.json(avaliacoes);
}

export const perfilController = { buscarMeu, atualizar, buscarPublico, listarAvaliacoes };
