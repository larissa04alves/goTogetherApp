import { and, desc, eq, gt } from "drizzle-orm";

import { db } from "@/db/client";
import { user } from "@/db/schema/auth";
import { carona } from "@/db/schema/caronas/carona";
import { caronaMembro } from "@/db/schema/caronas/carona-membro";
import { rota } from "@/db/schema/rotas";
import { veiculo } from "@/db/schema/veiculos/veiculo";
import type { CriarHubInput } from "@/validators/hubs.validator";

interface ListarFiltros {
  rotaId?: string;
  soMulheres?: boolean;
  horario?: string;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseMinutes(time: string): number {
  const parts = time.split(":");
  return (Number(parts[0]) || 0) * 60 + (Number(parts[1]) || 0);
}

function calcularSimilaridade(
  hubRota: { origemLat: number; origemLng: number; destinoLat: number; destinoLng: number },
  refRota: { origemLat: number; origemLng: number; destinoLat: number; destinoLng: number } | null,
  hubHorario: string,
  refHorario: string | null,
): number {
  const scores: number[] = [];

  if (refRota) {
    const origemDist = haversineKm(hubRota.origemLat, hubRota.origemLng, refRota.origemLat, refRota.origemLng);
    const destinoDist = haversineKm(hubRota.destinoLat, hubRota.destinoLng, refRota.destinoLat, refRota.destinoLng);
    scores.push(1 / (1 + origemDist));
    scores.push(1 / (1 + destinoDist));
  }

  if (refHorario) {
    const diff = Math.abs(parseMinutes(hubHorario) - parseMinutes(refHorario));
    scores.push(diff <= 30 ? 1 - diff / 30 : 0);
  }

  if (scores.length === 0) return 0;
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

async function criar(userId: string, data: CriarHubInput) {
  const r = await db.query.rota.findFirst({
    where: eq(rota.id, data.rota_id),
  });

  if (!r) throw new Error("ROTA_NAO_ENCONTRADA");
  if (r.userId !== userId) throw new Error("ROTA_NAO_PERTENCE");

  const hubDuplicado = await db.query.carona.findFirst({
    where: and(
      eq(carona.rotaId, data.rota_id),
      eq(carona.horarioSaida, data.horario_saida),
      eq(carona.status, "aberta"),
    ),
  });

  if (hubDuplicado) throw new Error("HUB_DUPLICADO");

  if (data.so_mulheres) {
    const criador = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!criador || criador.gender !== "feminino") {
      throw new Error("GENERO_NAO_PERMITIDO");
    }
  }

  if (data.tipo === "carro_proprio") {
    const v = await db.query.veiculo.findFirst({
      where: eq(veiculo.id, data.veiculo_id),
    });

    if (!v) throw new Error("VEICULO_NAO_ENCONTRADO");
    if (v.userId !== userId) throw new Error("VEICULO_NAO_PERTENCE");
    if (data.vagas_max > v.capacidade) throw new Error("VAGAS_EXCEDE_CAPACIDADE");
  }

  const values: typeof carona.$inferInsert = {
    id: crypto.randomUUID(),
    ofertanteId: userId,
    rotaId: data.rota_id,
    tipo: data.tipo,
    horarioSaida: data.horario_saida,
    vagasMax: data.vagas_max,
    vagasDisponiveis: data.vagas_max,
    soMulheres: data.so_mulheres ?? false,
    status: "aberta",
  };

  if (data.tipo === "carro_proprio") {
    values.veiculoId = data.veiculo_id;
    values.valorPorPessoa = data.valor_por_pessoa;
  }

  const [hub] = await db.insert(carona).values(values).returning();

  return hub;
}

async function listar(userId: string, filtros: ListarFiltros) {
  const usuario = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  let refRota: typeof rota.$inferSelect | undefined;
  if (filtros.rotaId) {
    const r = await db.query.rota.findFirst({
      where: eq(rota.id, filtros.rotaId),
    });
    if (!r) throw new Error("ROTA_NAO_ENCONTRADA");
    refRota = r;
  }

  const isFeminino = usuario?.gender === "feminino";

  const hubs = await db
    .select({
      id: carona.id,
      tipo: carona.tipo,
      horarioSaida: carona.horarioSaida,
      vagasMax: carona.vagasMax,
      vagasDisponiveis: carona.vagasDisponiveis,
      valorPorPessoa: carona.valorPorPessoa,
      soMulheres: carona.soMulheres,
      status: carona.status,
      criadoEm: carona.criadoEm,
      ofertante: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
      rota: {
        id: rota.id,
        origemNome: rota.origemNome,
        origemLat: rota.origemLat,
        origemLng: rota.origemLng,
        destinoNome: rota.destinoNome,
        destinoLat: rota.destinoLat,
        destinoLng: rota.destinoLng,
      },
      veiculo: {
        id: veiculo.id,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        cor: veiculo.cor,
        placa: veiculo.placa,
      },
    })
    .from(carona)
    .innerJoin(user, eq(user.id, carona.ofertanteId))
    .innerJoin(rota, eq(rota.id, carona.rotaId))
    .leftJoin(veiculo, eq(veiculo.id, carona.veiculoId))
    .where(
      and(
        eq(carona.status, "aberta"),
        gt(carona.vagasDisponiveis, 0),
        !isFeminino ? eq(carona.soMulheres, false) : undefined,
        filtros.soMulheres !== undefined ? eq(carona.soMulheres, filtros.soMulheres) : undefined,
      ),
    )
    .orderBy(desc(carona.criadoEm));

  const temReferencia = refRota ?? filtros.horario;
  if (!temReferencia) return hubs;

  return hubs
    .map((hub) => ({
      ...hub,
      similaridade: calcularSimilaridade(
        hub.rota,
        refRota ?? null,
        hub.horarioSaida,
        filtros.horario ?? null,
      ),
    }))
    .sort((a, b) => b.similaridade - a.similaridade);
}

async function buscar(hubId: string, userId: string) {
  const results = await db
    .select({
      id: carona.id,
      ofertanteId: carona.ofertanteId,
      tipo: carona.tipo,
      horarioSaida: carona.horarioSaida,
      vagasMax: carona.vagasMax,
      vagasDisponiveis: carona.vagasDisponiveis,
      valorPorPessoa: carona.valorPorPessoa,
      soMulheres: carona.soMulheres,
      status: carona.status,
      criadoEm: carona.criadoEm,
      ofertante: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      rota: {
        id: rota.id,
        origemNome: rota.origemNome,
        origemEndereco: rota.origemEndereco,
        origemLat: rota.origemLat,
        origemLng: rota.origemLng,
        destinoNome: rota.destinoNome,
        destinoEndereco: rota.destinoEndereco,
        destinoLat: rota.destinoLat,
        destinoLng: rota.destinoLng,
      },
      veiculo: {
        id: veiculo.id,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        cor: veiculo.cor,
        placa: veiculo.placa,
        capacidade: veiculo.capacidade,
      },
    })
    .from(carona)
    .innerJoin(user, eq(user.id, carona.ofertanteId))
    .innerJoin(rota, eq(rota.id, carona.rotaId))
    .leftJoin(veiculo, eq(veiculo.id, carona.veiculoId))
    .where(eq(carona.id, hubId));

  const hub = results[0];
  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");

  const membro = await db.query.caronaMembro.findFirst({
    where: and(
      eq(caronaMembro.caronaId, hubId),
      eq(caronaMembro.userId, userId),
      eq(caronaMembro.status, "ativo"),
    ),
  });

  return {
    ...hub,
    isOfertante: hub.ofertanteId === userId,
    isMembro: !!membro,
  };
}

async function listarMeus(userId: string) {
  return db
    .select({
      id: carona.id,
      tipo: carona.tipo,
      horarioSaida: carona.horarioSaida,
      vagasMax: carona.vagasMax,
      vagasDisponiveis: carona.vagasDisponiveis,
      valorPorPessoa: carona.valorPorPessoa,
      soMulheres: carona.soMulheres,
      status: carona.status,
      criadoEm: carona.criadoEm,
      rota: {
        id: rota.id,
        origemNome: rota.origemNome,
        destinoNome: rota.destinoNome,
      },
      veiculo: {
        id: veiculo.id,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        placa: veiculo.placa,
      },
    })
    .from(carona)
    .innerJoin(rota, eq(rota.id, carona.rotaId))
    .leftJoin(veiculo, eq(veiculo.id, carona.veiculoId))
    .where(eq(carona.ofertanteId, userId))
    .orderBy(desc(carona.criadoEm));
}

async function cancelar(hubId: string, userId: string) {
  const hub = await db.query.carona.findFirst({
    where: eq(carona.id, hubId),
  });

  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");
  if (hub.ofertanteId !== userId) throw new Error("NAO_AUTORIZADO");
  if (hub.status !== "aberta") throw new Error("HUB_NAO_ABERTO");

  const [atualizado] = await db
    .update(carona)
    .set({ status: "cancelada" })
    .where(eq(carona.id, hubId))
    .returning();

  return atualizado;
}

export const hubsService = { criar, listar, buscar, listarMeus, cancelar };
