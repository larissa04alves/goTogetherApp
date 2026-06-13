import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { user } from "@/db/schema/auth";
import { avaliacao } from "@/db/schema/avaliacoes/avaliacao";
import { carona } from "@/db/schema/caronas/carona";
import { caronaMembro } from "@/db/schema/caronas/carona-membro";
import type { CriarAvaliacaoInput } from "@/validators/avaliacoes.validator";

async function criar(avaliadorId: string, input: CriarAvaliacaoInput) {
  const caronaExiste = await db.query.carona.findFirst({
    where: eq(carona.id, input.carona_id),
  });

  if (!caronaExiste) throw new Error("CARONA_NAO_ENCONTRADA");
  if (caronaExiste.status !== "concluida") throw new Error("CARONA_NAO_CONCLUIDA");
  if (avaliadorId === input.avaliado_id) throw new Error("AUTOAVALIACAO_PROIBIDA");

  const avaliadorParticipou = await db.query.caronaMembro.findFirst({
    where: and(
      eq(caronaMembro.caronaId, input.carona_id),
      eq(caronaMembro.userId, avaliadorId),
    ),
  });

  if (!avaliadorParticipou) throw new Error("AVALIADOR_NAO_PARTICIPOU");

  const avaliadoParticipou = await db.query.caronaMembro.findFirst({
    where: and(
      eq(caronaMembro.caronaId, input.carona_id),
      eq(caronaMembro.userId, input.avaliado_id),
    ),
  });

  if (!avaliadoParticipou) throw new Error("AVALIADO_NAO_PARTICIPOU");

  const duplicada = await db.query.avaliacao.findFirst({
    where: and(
      eq(avaliacao.caronaId, input.carona_id),
      eq(avaliacao.avaliadorId, avaliadorId),
      eq(avaliacao.avaliadoId, input.avaliado_id),
    ),
  });

  if (duplicada) throw new Error("AVALIACAO_DUPLICADA");

  const [nova] = await db
    .insert(avaliacao)
    .values({
      id: crypto.randomUUID(),
      caronaId: input.carona_id,
      avaliadorId,
      avaliadoId: input.avaliado_id,
      nota: input.nota,
      comentario: input.comentario ?? null,
    })
    .returning();

  return nova;
}

async function listarPendentes(avaliadorId: string) {
  const caronasDoAvaliador = await db
    .select({ caronaId: caronaMembro.caronaId })
    .from(caronaMembro)
    .innerJoin(carona, eq(carona.id, caronaMembro.caronaId))
    .where(
      and(
        eq(caronaMembro.userId, avaliadorId),
        eq(carona.status, "concluida"),
      ),
    );

  if (caronasDoAvaliador.length === 0) return [];

  const pendentes: {
    caronaId: string;
    usuario: { id: string; name: string; email: string };
  }[] = [];

  for (const { caronaId } of caronasDoAvaliador) {
    const membros = await db
      .select({ userId: caronaMembro.userId })
      .from(caronaMembro)
      .where(eq(caronaMembro.caronaId, caronaId));

    for (const membro of membros) {
      if (membro.userId === avaliadorId) continue;

      const jaAvaliou = await db.query.avaliacao.findFirst({
        where: and(
          eq(avaliacao.caronaId, caronaId),
          eq(avaliacao.avaliadorId, avaliadorId),
          eq(avaliacao.avaliadoId, membro.userId),
        ),
      });

      if (!jaAvaliou) {
        const membroUser = await db.query.user.findFirst({
          where: eq(user.id, membro.userId),
        });

        if (membroUser) {
          pendentes.push({
            caronaId,
            usuario: {
              id: membroUser.id,
              name: membroUser.name,
              email: membroUser.email,
            },
          });
        }
      }
    }
  }

  return pendentes;
}

async function listarDoUsuario(userId: string) {
  return db
    .select({
      id: avaliacao.id,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      createdAt: avaliacao.createdAt,
      avaliador: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(avaliacao)
    .innerJoin(user, eq(user.id, avaliacao.avaliadorId))
    .where(eq(avaliacao.avaliadoId, userId))
    .orderBy(avaliacao.createdAt);
}

export const avaliacoesService = { criar, listarPendentes, listarDoUsuario };
