import type { Request, Response } from "express";

import { veiculosService } from "@/services/veiculos.service";
import { atualizarVeiculoSchema, criarVeiculoSchema } from "@/validators/veiculos.validator";

type Session = { user: { id: string } };

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  VEICULO_NAO_ENCONTRADO: { status: 404, message: "Veículo não encontrado" },
  NAO_AUTORIZADO: { status: 403, message: "Acesso não autorizado" },
  VEICULO_EM_CARONA_ATIVA: { status: 422, message: "Veículo está em uma carona ativa" },
};

async function listar(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;
  const veiculos = await veiculosService.listar(session.user.id);
  res.json(veiculos);
}

async function buscar(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) {
    res.status(400).json({ error: "ID obrigatório" });
    return;
  }

  const session = res.locals["session"] as Session;

  try {
    const v = await veiculosService.buscar(id, session.user.id);
    res.json(v);
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

async function criar(req: Request, res: Response): Promise<void> {
  const parsed = criarVeiculoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    return;
  }

  const session = res.locals["session"] as Session;
  const novo = await veiculosService.criar(session.user.id, parsed.data);
  res.status(201).json(novo);
}

async function atualizar(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) {
    res.status(400).json({ error: "ID obrigatório" });
    return;
  }

  const parsed = atualizarVeiculoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "Nenhum campo para atualizar" });
    return;
  }

  const session = res.locals["session"] as Session;

  try {
    const atualizado = await veiculosService.atualizar(id, session.user.id, parsed.data);
    res.json(atualizado);
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

async function excluir(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  if (!id) {
    res.status(400).json({ error: "ID obrigatório" });
    return;
  }

  const session = res.locals["session"] as Session;

  try {
    await veiculosService.excluir(id, session.user.id);
    res.status(204).send();
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

export const veiculosController = { listar, buscar, criar, atualizar, excluir };
