import type { Request, Response } from "express";

import { veiculosService } from "@/services/veiculos.service";
import { AppError } from "@/utils/app-error";
import { atualizarVeiculoSchema, criarVeiculoSchema } from "@/validators/veiculos.validator";

type Session = { user: { id: string } };

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  VEICULO_NAO_ENCONTRADO: { status: 404, message: "Veículo não encontrado" },
  NAO_AUTORIZADO: { status: 403, message: "Acesso não autorizado" },
  VEICULO_EM_CARONA_ATIVA: { status: 422, message: "Veículo está em uma carona ativa" },
  PLACA_DUPLICADA: { status: 409, message: "Placa já cadastrada" },
};

function throwServiceError(err: unknown): never {
  const key = err instanceof Error ? err.message : "";
  const mapped = SERVICE_ERRORS[key];
  if (mapped) throw new AppError(mapped.status, mapped.message);
  throw err;
}

async function listar(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;
  const veiculos = await veiculosService.listar(session.user.id);
  res.json(veiculos);
}

async function buscar(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) throw new AppError(400, "ID obrigatório");

  const session = res.locals["session"] as Session;
  const v = await veiculosService.buscar(id, session.user.id).catch(throwServiceError);
  res.json(v);
}

async function criar(req: Request, res: Response): Promise<void> {
  const parsed = criarVeiculoSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  const session = res.locals["session"] as Session;
  const novo = await veiculosService.criar(session.user.id, parsed.data).catch(throwServiceError);
  res.status(201).json(novo);
}

async function atualizar(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) throw new AppError(400, "ID obrigatório");

  const parsed = atualizarVeiculoSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  if (Object.keys(parsed.data).length === 0) throw new AppError(400, "Nenhum campo para atualizar");

  const session = res.locals["session"] as Session;
  const atualizado = await veiculosService
    .atualizar(id, session.user.id, parsed.data)
    .catch(throwServiceError);
  res.json(atualizado);
}

async function excluir(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) throw new AppError(400, "ID obrigatório");

  const session = res.locals["session"] as Session;
  await veiculosService.excluir(id, session.user.id).catch(throwServiceError);
  res.status(204).send();
}

export const veiculosController = { listar, buscar, criar, atualizar, excluir };
