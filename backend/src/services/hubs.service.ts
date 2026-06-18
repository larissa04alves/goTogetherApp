import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { user } from "@/db/schema/auth";
import { carona } from "@/db/schema/caronas/carona";
import { rota } from "@/db/schema/rotas";
import { veiculo } from "@/db/schema/veiculos/veiculo";
import type { CriarHubInput } from "@/validators/hubs.validator";

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

export const hubsService = { criar };
