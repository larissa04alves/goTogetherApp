import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { user } from "@/db/schema/auth";
import { carona } from "@/db/schema/caronas/carona";
import { caronaMembro } from "@/db/schema/caronas/carona-membro";

async function listarMembros(hubId: string, userId: string) {
  const hub = await db.query.carona.findFirst({
    where: eq(carona.id, hubId),
  });

  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");
  if (hub.ofertanteId !== userId) throw new Error("NAO_AUTORIZADO");

  return db
    .select({
      caronaId: caronaMembro.caronaId,
      userId: caronaMembro.userId,
      nome: user.name,
      email: user.email,
      genero: user.gender,
      role: caronaMembro.role,
      status: caronaMembro.status,
      entradaEm: caronaMembro.joinedAt,
    })
    .from(caronaMembro)
    .innerJoin(user, eq(user.id, caronaMembro.userId))
    .where(
      and(eq(caronaMembro.caronaId, hubId), eq(caronaMembro.status, "ativo")),
    )
    .orderBy(caronaMembro.joinedAt);
}

async function expulsar(hubId: string, membroUserId: string, userId: string) {
  const hub = await db.query.carona.findFirst({
    where: eq(carona.id, hubId),
  });

  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");
  if (hub.ofertanteId !== userId) throw new Error("NAO_AUTORIZADO");
  if (membroUserId === userId) throw new Error("AUTO_EXPULSAO");

  const membro = await db.query.caronaMembro.findFirst({
    where: and(
      eq(caronaMembro.caronaId, hubId),
      eq(caronaMembro.userId, membroUserId),
    ),
  });

  if (!membro) throw new Error("MEMBRO_NAO_ENCONTRADO");
  if (membro.status !== "ativo") throw new Error("MEMBRO_NAO_ATIVO");

  return db.transaction(async (tx) => {
    await tx
      .update(caronaMembro)
      .set({ status: "expulso" })
      .where(
        and(
          eq(caronaMembro.caronaId, hubId),
          eq(caronaMembro.userId, membroUserId),
        ),
      );

    const [hubAtualizado] = await tx
      .update(carona)
      .set({
        vagasDisponiveis: sql`LEAST(${carona.vagasDisponiveis} + 1, ${carona.vagasMax})`,
      })
      .where(eq(carona.id, hubId))
      .returning();

    return hubAtualizado;
  });
}

async function entrar(hubId: string, userId: string) {
  const hub = await db.query.carona.findFirst({ where: eq(carona.id, hubId) });

  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");
  if (hub.status !== "aberta") throw new Error("HUB_NAO_ABERTO");
  if (hub.vagasDisponiveis <= 0) throw new Error("HUB_SEM_VAGAS");
  if (hub.ofertanteId === userId) throw new Error("ENTRADA_PROPRIA_CARONA");

  const existente = await db.query.caronaMembro.findFirst({
    where: and(eq(caronaMembro.caronaId, hubId), eq(caronaMembro.userId, userId)),
  });
  if (existente?.status === "ativo") throw new Error("JA_E_MEMBRO");

  if (hub.soMulheres) {
    const u = await db.query.user.findFirst({ where: eq(user.id, userId) });
    if (!u || u.gender !== "feminino") throw new Error("GENERO_NAO_PERMITIDO");
  }

  return db.transaction(async (tx) => {
    if (existente) {
      await tx
        .update(caronaMembro)
        .set({ status: "ativo", role: "passageiro" })
        .where(and(eq(caronaMembro.caronaId, hubId), eq(caronaMembro.userId, userId)));
    } else {
      await tx.insert(caronaMembro).values({
        caronaId: hubId,
        userId,
        role: "passageiro",
        status: "ativo",
      });
    }

    const [hubAtualizado] = await tx
      .update(carona)
      .set({ vagasDisponiveis: sql`${carona.vagasDisponiveis} - 1` })
      .where(eq(carona.id, hubId))
      .returning();

    return hubAtualizado;
  });
}

async function sair(hubId: string, userId: string) {
  const hub = await db.query.carona.findFirst({ where: eq(carona.id, hubId) });
  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");
  if (hub.ofertanteId === userId) throw new Error("OFERTANTE_NAO_SAI");

  const membro = await db.query.caronaMembro.findFirst({
    where: and(eq(caronaMembro.caronaId, hubId), eq(caronaMembro.userId, userId)),
  });
  if (!membro || membro.status !== "ativo") throw new Error("MEMBRO_NAO_ATIVO");

  return db.transaction(async (tx) => {
    await tx
      .update(caronaMembro)
      .set({ status: "expulso" })
      .where(and(eq(caronaMembro.caronaId, hubId), eq(caronaMembro.userId, userId)));

    const [hubAtualizado] = await tx
      .update(carona)
      .set({
        vagasDisponiveis: sql`LEAST(${carona.vagasDisponiveis} + 1, ${carona.vagasMax})`,
      })
      .where(eq(carona.id, hubId))
      .returning();

    return hubAtualizado;
  });
}

export const hubMembrosService = { listarMembros, expulsar, entrar, sair };
