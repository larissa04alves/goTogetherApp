import type { Request, Response } from "express";

import type { Session } from "@/middlewares/auth.middleware";
import { rotasService } from "@/services/rotas.service";
import { AppError } from "@/utils/app-error";
import { requireParam } from "@/utils/require-param";
import { createServiceErrorMapper } from "@/utils/service-error";
import { atualizarRotaSchema, criarRotaSchema } from "@/validators/rotas.validator";

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  ROTA_NAO_ENCONTRADA: { status: 404, message: "Rota não encontrada" },
  NAO_AUTORIZADO: { status: 403, message: "Acesso não autorizado" },
};

const mapServiceError = createServiceErrorMapper(SERVICE_ERRORS);

async function listar(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;
  const rotas = await rotasService.listar(session.user.id);
  res.json(rotas);
}

async function buscar(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const rota = await rotasService.buscar(id, session.user.id);
    res.json(rota);
  } catch (err) {
    mapServiceError(err);
  }
}

async function criar(req: Request, res: Response): Promise<void> {
  const parsed = criarRotaSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  const session = res.locals["session"] as Session;

  try {
    const novaRota = await rotasService.criar(session.user.id, parsed.data);
    res.status(201).json(novaRota);
  } catch (err) {
    mapServiceError(err);
  }
}

async function atualizar(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID obrigatório");

  const parsed = atualizarRotaSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  if (Object.keys(parsed.data).length === 0) throw new AppError(400, "Nenhum campo para atualizar");

  const session = res.locals["session"] as Session;

  try {
    const rotaAtualizada = await rotasService.atualizar(id, session.user.id, parsed.data);
    res.json(rotaAtualizada);
  } catch (err) {
    mapServiceError(err);
  }
}

async function excluir(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID obrigatório");
  const session = res.locals["session"] as Session;

  try {
    await rotasService.excluir(id, session.user.id);
    res.status(204).send();
  } catch (err) {
    mapServiceError(err);
  }
}

export const rotasController = { listar, buscar, criar, atualizar, excluir };
