import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db/client";
import { carona } from "@/db/schema/caronas/carona";
import { veiculo } from "@/db/schema/veiculos/veiculo";
import type {
  AtualizarVeiculoInput,
  CriarVeiculoInput,
} from "@/validators/veiculos.validator";

async function listar(userId: string) {
  return db.query.veiculo.findMany({
    where: eq(veiculo.userId, userId),
    orderBy: veiculo.criadoEm,
  });
}

async function buscar(veiculoId: string, userId: string) {
  const v = await db.query.veiculo.findFirst({
    where: eq(veiculo.id, veiculoId),
  });

  if (!v) throw new Error("VEICULO_NAO_ENCONTRADO");
  if (v.userId !== userId) throw new Error("NAO_AUTORIZADO");

  return v;
}

function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; cause?: { code?: string } };
  return e?.code === "23505" || e?.cause?.code === "23505";
}

async function criar(userId: string, data: CriarVeiculoInput) {
  try {
    const [novo] = await db
      .insert(veiculo)
      .values({ id: crypto.randomUUID(), userId, ...data })
      .returning();

    return novo;
  } catch (err) {
    if (isUniqueViolation(err)) throw new Error("PLACA_DUPLICADA");
    throw err;
  }
}

async function atualizar(
  veiculoId: string,
  userId: string,
  data: AtualizarVeiculoInput,
) {
  const v = await db.query.veiculo.findFirst({
    where: eq(veiculo.id, veiculoId),
  });

  if (!v) throw new Error("VEICULO_NAO_ENCONTRADO");
  if (v.userId !== userId) throw new Error("NAO_AUTORIZADO");

  const [atualizado] = await db
    .update(veiculo)
    .set(data)
    .where(eq(veiculo.id, veiculoId))
    .returning();

  return atualizado;
}

async function excluir(veiculoId: string, userId: string) {
  const v = await db.query.veiculo.findFirst({
    where: eq(veiculo.id, veiculoId),
  });

  if (!v) throw new Error("VEICULO_NAO_ENCONTRADO");
  if (v.userId !== userId) throw new Error("NAO_AUTORIZADO");

  const caronaAtiva = await db.query.carona.findFirst({
    where: and(
      eq(carona.veiculoId, veiculoId),
      inArray(carona.status, ["aberta", "fechada"]),
    ),
  });

  if (caronaAtiva) throw new Error("VEICULO_EM_CARONA_ATIVA");

  await db.delete(veiculo).where(eq(veiculo.id, veiculoId));
}

export const veiculosService = { listar, buscar, criar, atualizar, excluir };
