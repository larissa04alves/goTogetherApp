import type { Request, Response } from "express";

import type { Session } from "@/middlewares/auth.middleware";
import { veiculosService } from "@/services/veiculos.service";
import { AppError } from "@/utils/app-error";
import { requireParam } from "@/utils/require-param";
import { createServiceErrorMapper } from "@/utils/service-error";
import { atualizarVeiculoSchema, criarVeiculoSchema } from "@/validators/veiculos.validator";

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  VEICULO_NAO_ENCONTRADO: { status: 404, message: "Veículo não encontrado" },
  NAO_AUTORIZADO: { status: 403, message: "Acesso não autorizado" },
  VEICULO_EM_CARONA_ATIVA: { status: 422, message: "Veículo está em uma carona ativa" },
  PLACA_DUPLICADA: { status: 409, message: "Placa já cadastrada" },
};

const mapServiceError = createServiceErrorMapper(SERVICE_ERRORS);

async function listar(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;
  const veiculos = await veiculosService.listar(session.user.id);
  res.json(veiculos);
}

async function buscar(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const v = await veiculosService.buscar(id, session.user.id);
    res.json(v);
  } catch (err) {
    mapServiceError(err);
  }
}

async function criar(req: Request, res: Response): Promise<void> {
  const parsed = criarVeiculoSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  const session = res.locals["session"] as Session;

  try {
    const novo = await veiculosService.criar(session.user.id, parsed.data);
    res.status(201).json(novo);
  } catch (err) {
    mapServiceError(err);
  }
}

async function atualizar(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID obrigatório");

  const parsed = atualizarVeiculoSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  if (Object.keys(parsed.data).length === 0) throw new AppError(400, "Nenhum campo para atualizar");

  const session = res.locals["session"] as Session;

  try {
    const atualizado = await veiculosService.atualizar(id, session.user.id, parsed.data);
    res.json(atualizado);
  } catch (err) {
    mapServiceError(err);
  }
}

async function excluir(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID obrigatório");
  const session = res.locals["session"] as Session;

  try {
    await veiculosService.excluir(id, session.user.id);
    res.status(204).send();
  } catch (err) {
    mapServiceError(err);
  }
}

export const veiculosController = { listar, buscar, criar, atualizar, excluir };
