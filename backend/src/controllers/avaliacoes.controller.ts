import type { Request, Response } from "express";

import { avaliacoesService } from "@/services/avaliacoes.service";
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

async function criar(req: Request, res: Response): Promise<void> {
  const parsed = criarAvaliacaoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    return;
  }

  const session = res.locals["session"] as Session;

  try {
    const nova = await avaliacoesService.criar(session.user.id, parsed.data);
    res.status(201).json(nova);
  } catch (err) {
    const key = err instanceof Error ? err.message : "";
    const mapped = SERVICE_ERRORS[key];
    if (mapped) {
      res.status(mapped.status).json({ error: mapped.message });
      return;
    }
    throw err;
  }
}

async function listarPendentes(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;
  const pendentes = await avaliacoesService.listarPendentes(session.user.id);
  res.json(pendentes);
}

async function listarDoUsuario(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) {
    res.status(400).json({ error: "ID obrigatório" });
    return;
  }
  const avaliacoes = await avaliacoesService.listarDoUsuario(id);
  res.json(avaliacoes);
}

export const avaliacoesController = { criar, listarPendentes, listarDoUsuario };
