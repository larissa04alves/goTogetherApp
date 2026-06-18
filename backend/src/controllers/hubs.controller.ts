import type { Request, Response } from "express";

import { hubsService } from "@/services/hubs.service";
import { AppError } from "@/utils/app-error";
import { criarHubSchema } from "@/validators/hubs.validator";

type Session = { user: { id: string } };

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  ROTA_NAO_ENCONTRADA: { status: 404, message: "Rota não encontrada" },
  ROTA_NAO_PERTENCE: { status: 403, message: "A rota não pertence ao usuário logado" },
  HUB_DUPLICADO: { status: 409, message: "Já existe um hub ativo para esta rota e horário" },
  GENERO_NAO_PERMITIDO: { status: 403, message: "Hubs exclusivos para mulheres só podem ser criados por usuárias com gênero feminino" },
  VEICULO_NAO_ENCONTRADO: { status: 404, message: "Veículo não encontrado" },
  VEICULO_NAO_PERTENCE: { status: 403, message: "O veículo não pertence ao usuário logado" },
  VAGAS_EXCEDE_CAPACIDADE: { status: 422, message: "Quantidade de vagas excede a capacidade do veículo" },
  HUB_NAO_ENCONTRADO: { status: 404, message: "Hub não encontrado" },
  NAO_AUTORIZADO: { status: 403, message: "Acesso não autorizado" },
  HUB_NAO_ABERTO: { status: 422, message: "Apenas hubs abertos podem ser cancelados" },
};

function mapServiceError(err: unknown): never {
  const key = err instanceof Error ? err.message : "";
  const mapped = SERVICE_ERRORS[key];
  if (mapped) throw new AppError(mapped.status, mapped.message);
  throw err;
}

function requireParam(req: Request, name: string, message: string): string {
  const raw = req.params[name];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) throw new AppError(400, message);
  return value;
}

async function criar(req: Request, res: Response): Promise<void> {
  const parsed = criarHubSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  const session = res.locals["session"] as Session;

  try {
    const hub = await hubsService.criar(session.user.id, parsed.data);
    res.status(201).json(hub);
  } catch (err) {
    mapServiceError(err);
  }
}

async function listar(req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;

  const rotaId = typeof req.query["rota_id"] === "string" ? req.query["rota_id"] : undefined;
  const horario = typeof req.query["horario"] === "string" ? req.query["horario"] : undefined;
  const soMulheresParam = req.query["so_mulheres"];
  const soMulheres = soMulheresParam === "true" ? true : soMulheresParam === "false" ? false : undefined;

  try {
    const hubs = await hubsService.listar(session.user.id, { rotaId, soMulheres, horario });
    res.json(hubs);
  } catch (err) {
    mapServiceError(err);
  }
}

async function buscar(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID do hub obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const hub = await hubsService.buscar(id, session.user.id);
    res.json(hub);
  } catch (err) {
    mapServiceError(err);
  }
}

async function listarMeus(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;
  const hubs = await hubsService.listarMeus(session.user.id);
  res.json(hubs);
}

async function cancelar(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID do hub obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const hub = await hubsService.cancelar(id, session.user.id);
    res.json(hub);
  } catch (err) {
    mapServiceError(err);
  }
}

export const hubsController = { criar, listar, buscar, listarMeus, cancelar };
