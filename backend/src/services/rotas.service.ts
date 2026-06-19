import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { rota } from "@/db/schema/rotas";
import type {
  AtualizarRotaInput,
  CriarRotaInput,
} from "@/validators/rotas.validator";

function montarDadosCriacao(userId: string, data: CriarRotaInput) {
  return {
    id: crypto.randomUUID(),
    userId,

    origemNome: data.origem_nome,
    origemEndereco: data.origem_endereco,
    origemLat: data.origem_lat,
    origemLng: data.origem_lng,

    destinoNome: data.destino_nome,
    destinoEndereco: data.destino_endereco,
    destinoLat: data.destino_lat,
    destinoLng: data.destino_lng,

    horarioPadrao: data.horario_padrao,
    distanciaKm: data.distancia_km,
  };
}

function montarDadosAtualizacao(data: AtualizarRotaInput) {
  const updateData: Partial<typeof rota.$inferInsert> = {};

  if (data.origem_nome !== undefined) updateData.origemNome = data.origem_nome;
  if (data.origem_endereco !== undefined) updateData.origemEndereco = data.origem_endereco;
  if (data.origem_lat !== undefined) updateData.origemLat = data.origem_lat;
  if (data.origem_lng !== undefined) updateData.origemLng = data.origem_lng;

  if (data.destino_nome !== undefined) updateData.destinoNome = data.destino_nome;
  if (data.destino_endereco !== undefined) updateData.destinoEndereco = data.destino_endereco;
  if (data.destino_lat !== undefined) updateData.destinoLat = data.destino_lat;
  if (data.destino_lng !== undefined) updateData.destinoLng = data.destino_lng;

  if (data.horario_padrao !== undefined) updateData.horarioPadrao = data.horario_padrao;
  if (data.distancia_km !== undefined) updateData.distanciaKm = data.distancia_km;

  return updateData;
}

async function listar(userId: string) {
  return db.query.rota.findMany({
    where: eq(rota.userId, userId),
    orderBy: rota.criadoEm,
  });
}

async function buscar(rotaId: string, userId: string) {
  const rotaEncontrada = await db.query.rota.findFirst({
    where: eq(rota.id, rotaId),
  });

  if (!rotaEncontrada) throw new Error("ROTA_NAO_ENCONTRADA");
  if (rotaEncontrada.userId !== userId) throw new Error("NAO_AUTORIZADO");

  return rotaEncontrada;
}

async function criar(userId: string, data: CriarRotaInput) {
  const [nova] = await db
    .insert(rota)
    .values(montarDadosCriacao(userId, data))
    .returning();

  return nova;
}

async function atualizar(
  rotaId: string,
  userId: string,
  data: AtualizarRotaInput,
) {
  const rotaEncontrada = await db.query.rota.findFirst({
    where: eq(rota.id, rotaId),
  });

  if (!rotaEncontrada) throw new Error("ROTA_NAO_ENCONTRADA");
  if (rotaEncontrada.userId !== userId) throw new Error("NAO_AUTORIZADO");

  const [atualizada] = await db
    .update(rota)
    .set(montarDadosAtualizacao(data))
    .where(eq(rota.id, rotaId))
    .returning();

  return atualizada;
}

async function excluir(rotaId: string, userId: string) {
  const rotaEncontrada = await db.query.rota.findFirst({
    where: eq(rota.id, rotaId),
  });

  if (!rotaEncontrada) throw new Error("ROTA_NAO_ENCONTRADA");
  if (rotaEncontrada.userId !== userId) throw new Error("NAO_AUTORIZADO");

  await db.delete(rota).where(eq(rota.id, rotaId));
}

export const rotasService = {
  listar,
  buscar,
  criar,
  atualizar,
  excluir,
};