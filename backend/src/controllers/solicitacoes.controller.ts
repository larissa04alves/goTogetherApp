import type { Request, Response } from "express";

import { solicitacoesService } from "@/services/solicitacoes.service";

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

function handleServiceError(err: unknown, res: Response): void {
  const key = err instanceof Error ? err.message : "";
  const mapped = SERVICE_ERRORS[key];
  if (mapped) {
    res.status(mapped.status).json({ error: mapped.message });
    return;
  }
  throw err;
}

async function solicitar(req: Request, res: Response): Promise<void> {
  const hubId = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!hubId) {
    res.status(400).json({ error: "ID do hub obrigatório" });
    return;
  }

  const session = res.locals["session"] as Session;

  try {
    const nova = await solicitacoesService.solicitar(hubId, session.user.id);
    res.status(201).json(nova);
  } catch (err) {
    handleServiceError(err, res);
  }
}

async function listar(req: Request, res: Response): Promise<void> {
  const hubId = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!hubId) {
    res.status(400).json({ error: "ID do hub obrigatório" });
    return;
  }

  const session = res.locals["session"] as Session;

  try {
    const solicitacoes = await solicitacoesService.listar(hubId, session.user.id);
    res.json(solicitacoes);
  } catch (err) {
    handleServiceError(err, res);
  }
}

async function aprovar(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) {
    res.status(400).json({ error: "ID da solicitação obrigatório" });
    return;
  }

  const session = res.locals["session"] as Session;

  try {
    const atualizada = await solicitacoesService.aprovar(id, session.user.id);
    res.json(atualizada);
  } catch (err) {
    handleServiceError(err, res);
  }
}

async function rejeitar(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) {
    res.status(400).json({ error: "ID da solicitação obrigatório" });
    return;
  }

  const session = res.locals["session"] as Session;

  try {
    const atualizada = await solicitacoesService.rejeitar(id, session.user.id);
    res.json(atualizada);
  } catch (err) {
    handleServiceError(err, res);
  }
}

async function cancelar(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) {
    res.status(400).json({ error: "ID da solicitação obrigatório" });
    return;
  }

  const session = res.locals["session"] as Session;

  try {
    const atualizada = await solicitacoesService.cancelar(id, session.user.id);
    res.json(atualizada);
  } catch (err) {
    handleServiceError(err, res);
  }
}

export const solicitacoesController = { solicitar, listar, aprovar, rejeitar, cancelar };
