import type { Request, Response } from "express";

import { solicitacoesService } from "@/services/solicitacoes.service";
import { AppError } from "@/utils/app-error";

type Session = { user: { id: string } };

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  HUB_NAO_ENCONTRADO: { status: 404, message: "Hub não encontrado" },
  HUB_NAO_ABERTO: { status: 422, message: "Hub não está aceitando solicitações" },
  HUB_SEM_VAGAS: { status: 422, message: "Hub sem vagas disponíveis" },
  SOLICITACAO_PROPRIA_CARONA: { status: 422, message: "Você não pode solicitar entrada na própria carona" },
  SOLICITACAO_PENDENTE_DUPLICADA: { status: 409, message: "Você já tem uma solicitação pendente neste hub" },
  SOLICITACAO_APROVADA_DUPLICADA: { status: 409, message: "Você já foi aprovado neste hub" },
  GENERO_NAO_PERMITIDO: { status: 403, message: "Este hub é exclusivo para mulheres" },
  NAO_AUTORIZADO: { status: 403, message: "Você não tem permissão para esta ação" },
  SOLICITACAO_NAO_ENCONTRADA: { status: 404, message: "Solicitação não encontrada" },
  STATUS_INVALIDO: { status: 422, message: "Solicitação não está em status pendente" },
};

function mapServiceError(err: unknown): never {
  const key = err instanceof Error ? err.message : "";
  const mapped = SERVICE_ERRORS[key];
  if (mapped) {
    throw new AppError(mapped.status, mapped.message);
  }
  throw err;
}

function requireParam(req: Request, name: string, message: string): string {
  const raw = req.params[name];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) {
    throw new AppError(400, message);
  }
  return value;
}

async function solicitar(req: Request, res: Response): Promise<void> {
  const hubId = requireParam(req, "id", "ID do hub obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const nova = await solicitacoesService.solicitar(hubId, session.user.id);
    res.status(201).json(nova);
  } catch (err) {
    mapServiceError(err);
  }
}

async function listar(req: Request, res: Response): Promise<void> {
  const hubId = requireParam(req, "id", "ID do hub obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const solicitacoes = await solicitacoesService.listar(hubId, session.user.id);
    res.json(solicitacoes);
  } catch (err) {
    mapServiceError(err);
  }
}

async function aprovar(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID da solicitação obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const atualizada = await solicitacoesService.aprovar(id, session.user.id);
    res.json(atualizada);
  } catch (err) {
    mapServiceError(err);
  }
}

async function rejeitar(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID da solicitação obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const atualizada = await solicitacoesService.rejeitar(id, session.user.id);
    res.json(atualizada);
  } catch (err) {
    mapServiceError(err);
  }
}

async function cancelar(req: Request, res: Response): Promise<void> {
  const id = requireParam(req, "id", "ID da solicitação obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const atualizada = await solicitacoesService.cancelar(id, session.user.id);
    res.json(atualizada);
  } catch (err) {
    mapServiceError(err);
  }
}

export const solicitacoesController = { solicitar, listar, aprovar, rejeitar, cancelar };
