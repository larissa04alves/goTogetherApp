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
};

function mapServiceError(err: unknown): never {
  const key = err instanceof Error ? err.message : "";
  const mapped = SERVICE_ERRORS[key];
  if (mapped) throw new AppError(mapped.status, mapped.message);
  throw err;
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

export const hubsController = { criar };
