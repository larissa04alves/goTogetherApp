import type { Request, Response } from "express";

import type { Session } from "@/middlewares/auth.middleware";
import { hubMembrosService } from "@/services/hub-membros.service";
import { requireParam } from "@/utils/require-param";
import { createServiceErrorMapper } from "@/utils/service-error";

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  HUB_NAO_ENCONTRADO: { status: 404, message: "Hub não encontrado" },
  NAO_AUTORIZADO: { status: 403, message: "Apenas o criador do hub pode realizar esta ação" },
  AUTO_EXPULSAO: { status: 422, message: "O criador do hub não pode expulsar a si mesmo" },
  MEMBRO_NAO_ENCONTRADO: { status: 404, message: "Membro não encontrado neste hub" },
  MEMBRO_NAO_ATIVO: { status: 422, message: "Membro já foi removido ou expulso" },
  HUB_NAO_ABERTO: { status: 422, message: "Este hub não está aberto para entrada" },
  HUB_SEM_VAGAS: { status: 422, message: "Não há vagas disponíveis neste hub" },
  ENTRADA_PROPRIA_CARONA: { status: 422, message: "Você não pode entrar no próprio hub" },
  JA_E_MEMBRO: { status: 409, message: "Você já participa deste hub" },
  GENERO_NAO_PERMITIDO: { status: 403, message: "Hub exclusivo para mulheres" },
  OFERTANTE_NAO_SAI: { status: 422, message: "O criador do hub não pode sair; cancele o hub" },
};

const mapServiceError = createServiceErrorMapper(SERVICE_ERRORS);

async function listarMembros(req: Request, res: Response): Promise<void> {
  const hubId = requireParam(req, "id", "ID do hub obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const membros = await hubMembrosService.listarMembros(hubId, session.user.id);
    res.json(membros);
  } catch (err) {
    mapServiceError(err);
  }
}

async function expulsar(req: Request, res: Response): Promise<void> {
  const hubId = requireParam(req, "hubId", "ID do hub obrigatório");
  const membroId = requireParam(req, "membroId", "ID do membro obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const hubAtualizado = await hubMembrosService.expulsar(hubId, membroId, session.user.id);
    res.json({ message: "Membro expulso com sucesso", hub: hubAtualizado });
  } catch (err) {
    mapServiceError(err);
  }
}

async function entrar(req: Request, res: Response): Promise<void> {
  const hubId = requireParam(req, "id", "ID do hub obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const hub = await hubMembrosService.entrar(hubId, session.user.id);
    res.json({ message: "Você entrou no hub", hub });
  } catch (err) {
    mapServiceError(err);
  }
}

async function sair(req: Request, res: Response): Promise<void> {
  const hubId = requireParam(req, "id", "ID do hub obrigatório");
  const session = res.locals["session"] as Session;

  try {
    const hub = await hubMembrosService.sair(hubId, session.user.id);
    res.json({ message: "Você saiu do hub", hub });
  } catch (err) {
    mapServiceError(err);
  }
}

export const hubMembrosController = { listarMembros, expulsar, entrar, sair };
