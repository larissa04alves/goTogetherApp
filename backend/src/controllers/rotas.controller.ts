import type { Request, Response } from "express";

import { rotasService } from "@/services/rotas.service";
import { AppError } from "@/utils/app-error";
import { atualizarRotaSchema, criarRotaSchema } from "@/validators/rotas.validator";

type Session = { user: { id: string } };

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  ROTA_NAO_ENCONTRADA: { status: 404, message: "Rota não encontrada" },
  NAO_AUTORIZADO: { status: 403, message: "Acesso não autorizado" },
};

function throwServiceError(err: unknown): never {
  const key = err instanceof Error ? err.message : "";
  const mapped = SERVICE_ERRORS[key];
  if (mapped) throw new AppError(mapped.status, mapped.message);
  throw err;
}

async function listar(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;
  const rotas = await rotasService.listar(session.user.id);
  res.json(rotas);
}

async function buscar(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) throw new AppError(400, "ID obrigatório");

  const session = res.locals["session"] as Session;
  const rota = await rotasService.buscar(id, session.user.id).catch(throwServiceError);
  res.json(rota);
}

async function criar(req: Request, res: Response): Promise<void> {
  const parsed = criarRotaSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  const session = res.locals["session"] as Session;
  const novaRota = await rotasService.criar(session.user.id, parsed.data).catch(throwServiceError);
  res.status(201).json(novaRota);
}

async function atualizar(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) throw new AppError(400, "ID obrigatório");

  const parsed = atualizarRotaSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  if (Object.keys(parsed.data).length === 0) throw new AppError(400, "Nenhum campo para atualizar");

  const session = res.locals["session"] as Session;
  const rotaAtualizada = await rotasService
    .atualizar(id, session.user.id, parsed.data)
    .catch(throwServiceError);
  res.json(rotaAtualizada);
}

async function excluir(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) throw new AppError(400, "ID obrigatório");

  const session = res.locals["session"] as Session;
  await rotasService.excluir(id, session.user.id).catch(throwServiceError);
  res.status(204).send();
}

export const rotasController = { listar, buscar, criar, atualizar, excluir };
