import type { Request, Response } from "express";

import type { Session } from "@/middlewares/auth.middleware";
import { avaliacoesService } from "@/services/avaliacoes.service";
import { AppError } from "@/utils/app-error";
import { requireParam } from "@/utils/require-param";
import { createServiceErrorMapper } from "@/utils/service-error";
import { criarAvaliacaoSchema } from "@/validators/avaliacoes.validator";

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  CARONA_NAO_ENCONTRADA: { status: 404, message: "Carona não encontrada" },
  CARONA_NAO_CONCLUIDA: { status: 422, message: "Carona ainda não foi concluída" },
  AUTOAVALIACAO_PROIBIDA: { status: 422, message: "Você não pode avaliar a si mesmo" },
  AVALIADOR_NAO_PARTICIPOU: { status: 403, message: "Você não participou desta carona" },
  AVALIADO_NAO_PARTICIPOU: { status: 422, message: "O usuário avaliado não participou desta carona" },
  AVALIACAO_DUPLICADA: { status: 409, message: "Você já avaliou este participante nesta carona" },
};

const mapServiceError = createServiceErrorMapper(SERVICE_ERRORS);

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
  const id = requireParam(req, "id", "ID obrigatório");
  const avaliacoes = await avaliacoesService.listarDoUsuario(id);
  res.json(avaliacoes);
}

export const avaliacoesController = { criar, listarPendentes, listarDoUsuario };
