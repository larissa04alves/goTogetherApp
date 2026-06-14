import type { Request, Response } from "express";

import { avaliacoesService } from "@/services/avaliacoes.service";
import { AppError } from "@/utils/app-error";
import { criarAvaliacaoSchema } from "@/validators/avaliacoes.validator";

type Session = { user: { id: string } };

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  CARONA_NAO_ENCONTRADA: { status: 404, message: "Carona não encontrada" },
  CARONA_NAO_CONCLUIDA: { status: 422, message: "Carona ainda não foi concluída" },
  AUTOAVALIACAO_PROIBIDA: { status: 422, message: "Você não pode avaliar a si mesmo" },
  AVALIADOR_NAO_PARTICIPOU: { status: 403, message: "Você não participou desta carona" },
  AVALIADO_NAO_PARTICIPOU: { status: 422, message: "O usuário avaliado não participou desta carona" },
  AVALIACAO_DUPLICADA: { status: 409, message: "Você já avaliou este participante nesta carona" },
};

function mapServiceError(err: unknown): never {
  const key = err instanceof Error ? err.message : "";
  const mapped = SERVICE_ERRORS[key];
  if (mapped) {
    throw new AppError(mapped.status, mapped.message);
  }
  throw err;
}

async function criar(req: Request, res: Response): Promise<void> {
  const parsed = criarAvaliacaoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos", parsed.error.flatten());
  }

  const session = res.locals["session"] as Session;

  try {
    const nova = await avaliacoesService.criar(session.user.id, parsed.data);
    res.status(201).json(nova);
  } catch (err) {
    mapServiceError(err);
  }
}

async function listarPendentes(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;
  const pendentes = await avaliacoesService.listarPendentes(session.user.id);
  res.json(pendentes);
}

async function listarDoUsuario(req: Request, res: Response): Promise<void> {
  const raw = req.params["id"];
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id) {
    throw new AppError(400, "ID obrigatório");
  }
  const avaliacoes = await avaliacoesService.listarDoUsuario(id);
  res.json(avaliacoes);
}

export const avaliacoesController = { criar, listarPendentes, listarDoUsuario };
