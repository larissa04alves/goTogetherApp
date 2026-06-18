import { and, avg, count, desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { user } from "@/db/schema/auth";
import { avaliacao } from "@/db/schema/avaliacoes/avaliacao";
import { carona } from "@/db/schema/caronas/carona";
import { caronaMembro } from "@/db/schema/caronas/carona-membro";
import type { AtualizarPerfilInput } from "@/validators/perfil.validator";

async function buscarMeu(userId: string) {
  const u = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  if (!u) throw new Error("USUARIO_NAO_ENCONTRADO");

  return {
    id: u.id,
    name: u.name,
    email: u.email,
    cpf: u.cpf,
    phone: u.phone,
    gender: u.gender,
    institution: u.institution,
    course: u.course,
    period: u.period,
    emergencyContactName: u.emergencyContactName,
    emergencyContactPhone: u.emergencyContactPhone,
    role: u.role,
    emailVerified: u.emailVerified,
    identityVerified: u.identityVerified,
    image: u.image,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

async function atualizar(userId: string, data: AtualizarPerfilInput) {
  if (Object.keys(data).length === 0) throw new Error("NENHUM_CAMPO");

  const u = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  if (!u) throw new Error("USUARIO_NAO_ENCONTRADO");

  const updateData: Partial<typeof user.$inferInsert> = {};

  if (data.telefone !== undefined) updateData.phone = data.telefone;
  if (data.genero !== undefined) updateData.gender = data.genero;
  if (data.instituicao !== undefined) updateData.institution = data.instituicao;
  if (data.curso !== undefined) updateData.course = data.curso;
  if (data.periodo !== undefined) updateData.period = data.periodo;
  if (data.contato_emergencia_nome !== undefined) updateData.emergencyContactName = data.contato_emergencia_nome;
  if (data.contato_emergencia_telefone !== undefined) updateData.emergencyContactPhone = data.contato_emergencia_telefone;
  if (data.foto_url !== undefined) updateData.image = data.foto_url;

  const results = await db
    .update(user)
    .set(updateData)
    .where(eq(user.id, userId))
    .returning();

  const atualizado = results[0];
  if (!atualizado) throw new Error("USUARIO_NAO_ENCONTRADO");

  return {
    id: atualizado.id,
    name: atualizado.name,
    email: atualizado.email,
    cpf: atualizado.cpf,
    phone: atualizado.phone,
    gender: atualizado.gender,
    institution: atualizado.institution,
    course: atualizado.course,
    period: atualizado.period,
    emergencyContactName: atualizado.emergencyContactName,
    emergencyContactPhone: atualizado.emergencyContactPhone,
    role: atualizado.role,
    emailVerified: atualizado.emailVerified,
    identityVerified: atualizado.identityVerified,
    image: atualizado.image,
    createdAt: atualizado.createdAt,
    updatedAt: atualizado.updatedAt,
  };
}

async function buscarPublico(perfilId: string) {
  const u = await db.query.user.findFirst({
    where: eq(user.id, perfilId),
  });

  if (!u) throw new Error("USUARIO_NAO_ENCONTRADO");

  const [mediaResult] = await db
    .select({ media: avg(avaliacao.nota) })
    .from(avaliacao)
    .where(eq(avaliacao.avaliadoId, perfilId));

  const [oferecidas] = await db
    .select({ total: count() })
    .from(carona)
    .where(eq(carona.ofertanteId, perfilId));

  const [tomadas] = await db
    .select({ total: count() })
    .from(caronaMembro)
    .where(
      and(
        eq(caronaMembro.userId, perfilId),
        eq(caronaMembro.role, "passageiro"),
        eq(caronaMembro.status, "ativo"),
      ),
    );

  return {
    id: u.id,
    name: u.name,
    gender: u.gender,
    institution: u.institution,
    course: u.course,
    period: u.period,
    image: u.image,
    identityVerified: u.identityVerified,
    createdAt: u.createdAt,
    avaliacaoMedia: mediaResult?.media ? Number(mediaResult.media) : null,
    caronasOferecidas: oferecidas?.total ?? 0,
    caronasTomadas: tomadas?.total ?? 0,
  };
}

async function listarAvaliacoes(perfilId: string) {
  return db
    .select({
      id: avaliacao.id,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      criadoEm: avaliacao.createdAt,
      avaliador: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(avaliacao)
    .innerJoin(user, eq(user.id, avaliacao.avaliadorId))
    .where(eq(avaliacao.avaliadoId, perfilId))
    .orderBy(desc(avaliacao.createdAt));
}

export const perfilService = { buscarMeu, atualizar, buscarPublico, listarAvaliacoes };
