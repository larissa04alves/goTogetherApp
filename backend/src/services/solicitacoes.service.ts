import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { user } from "@/db/schema/auth";
import { carona } from "@/db/schema/caronas/carona";
import { solicitacao } from "@/db/schema/solicitacoes/solicitacao";

async function solicitar(caronaId: string, solicitanteId: string) {
  const hub = await db.query.carona.findFirst({
    where: eq(carona.id, caronaId),
  });

  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");
  if (hub.status !== "aberta") throw new Error("HUB_NAO_ABERTO");
  if (hub.vagasDisponiveis <= 0) throw new Error("HUB_SEM_VAGAS");
  if (hub.ofertanteId === solicitanteId) throw new Error("SOLICITACAO_PROPRIA_CARONA");

  const pendente = await db.query.solicitacao.findFirst({
    where: and(
      eq(solicitacao.caronaId, caronaId),
      eq(solicitacao.solicitanteId, solicitanteId),
      eq(solicitacao.status, "pendente"),
    ),
  });

  if (pendente) throw new Error("SOLICITACAO_PENDENTE_DUPLICADA");

  const aprovada = await db.query.solicitacao.findFirst({
    where: and(
      eq(solicitacao.caronaId, caronaId),
      eq(solicitacao.solicitanteId, solicitanteId),
      eq(solicitacao.status, "aprovada"),
    ),
  });

  if (aprovada) throw new Error("SOLICITACAO_APROVADA_DUPLICADA");

  if (hub.soMulheres) {
    const solicitante = await db.query.user.findFirst({
      where: eq(user.id, solicitanteId),
    });

    if (!solicitante || solicitante.gender !== "feminino") {
      throw new Error("GENERO_NAO_PERMITIDO");
    }
  }

  const [nova] = await db
    .insert(solicitacao)
    .values({
      id: crypto.randomUUID(),
      caronaId,
      solicitanteId,
      status: "pendente",
    })
    .returning();

  return nova;
}

async function listar(caronaId: string, userId: string) {
  const hub = await db.query.carona.findFirst({
    where: eq(carona.id, caronaId),
  });

  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");
  if (hub.ofertanteId !== userId) throw new Error("NAO_AUTORIZADO");

  return db
    .select({
      id: solicitacao.id,
      status: solicitacao.status,
      criadoEm: solicitacao.criadoEm,
      respondidoEm: solicitacao.respondidoEm,
      solicitante: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
    .from(solicitacao)
    .innerJoin(user, eq(user.id, solicitacao.solicitanteId))
    .where(eq(solicitacao.caronaId, caronaId))
    .orderBy(solicitacao.criadoEm);
}

async function aprovar(solicitacaoId: string, userId: string) {
  const sol = await db.query.solicitacao.findFirst({
    where: eq(solicitacao.id, solicitacaoId),
  });

  if (!sol) throw new Error("SOLICITACAO_NAO_ENCONTRADA");

  const hub = await db.query.carona.findFirst({
    where: eq(carona.id, sol.caronaId),
  });

  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");
  if (hub.ofertanteId !== userId) throw new Error("NAO_AUTORIZADO");
  if (sol.status !== "pendente") throw new Error("STATUS_INVALIDO");

  return db.transaction(async (tx) => {
    const [atualizada] = await tx
      .update(solicitacao)
      .set({ status: "aprovada", respondidoEm: new Date() })
      .where(eq(solicitacao.id, solicitacaoId))
      .returning();

    await tx
      .update(carona)
      .set({ vagasDisponiveis: sql`${carona.vagasDisponiveis} - 1` })
      .where(eq(carona.id, sol.caronaId));

    return atualizada;
  });
}

async function rejeitar(solicitacaoId: string, userId: string) {
  const sol = await db.query.solicitacao.findFirst({
    where: eq(solicitacao.id, solicitacaoId),
  });

  if (!sol) throw new Error("SOLICITACAO_NAO_ENCONTRADA");

  const hub = await db.query.carona.findFirst({
    where: eq(carona.id, sol.caronaId),
  });

  if (!hub) throw new Error("HUB_NAO_ENCONTRADO");
  if (hub.ofertanteId !== userId) throw new Error("NAO_AUTORIZADO");
  if (sol.status !== "pendente") throw new Error("STATUS_INVALIDO");

  const [atualizada] = await db
    .update(solicitacao)
    .set({ status: "rejeitada", respondidoEm: new Date() })
    .where(eq(solicitacao.id, solicitacaoId))
    .returning();

  return atualizada;
}

async function cancelar(solicitacaoId: string, userId: string) {
  const sol = await db.query.solicitacao.findFirst({
    where: eq(solicitacao.id, solicitacaoId),
  });

  if (!sol) throw new Error("SOLICITACAO_NAO_ENCONTRADA");
  if (sol.solicitanteId !== userId) throw new Error("NAO_AUTORIZADO");
  if (sol.status !== "pendente") throw new Error("STATUS_INVALIDO");

  const [atualizada] = await db
    .update(solicitacao)
    .set({ status: "cancelada" })
    .where(eq(solicitacao.id, solicitacaoId))
    .returning();

  return atualizada;
}

export const solicitacoesService = { solicitar, listar, aprovar, rejeitar, cancelar };
