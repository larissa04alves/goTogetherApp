import { randomUUID } from 'node:crypto';

import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { user } from '@/db/schema/auth';
import type { RegisterPayload } from '@/validators/auth.validator';

class ServiceError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function registerUser(data: RegisterPayload) {
  const email = data.email.toLowerCase().trim();
  const cpf = data.cpf;

  const usuarioComEmail = await db
    .select({
      id: user.id,
    })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (usuarioComEmail.length > 0) {
    throw new ServiceError(409, 'E-mail já cadastrado.');
  }

  const usuarioComCpf = await db
    .select({
      id: user.id,
    })
    .from(user)
    .where(eq(user.cpf, cpf))
    .limit(1);

  if (usuarioComCpf.length > 0) {
    throw new ServiceError(409, 'CPF já cadastrado.');
  }

  const id = randomUUID();
  const passwordHash = await bcrypt.hash(data.senha, 10);

  await db.insert(user).values({
    id,
    name: data.nome_completo,
    email,
    cpf,
    phone: data.telefone,
    gender: data.genero,
    institution: data.instituicao,
    course: data.curso,
    period: data.periodo,
    passwordHash,
    emailVerified: false,
    identityVerified: false,
    role: 'student',
  });

  const usuarioCriado = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      gender: user.gender,
      institution: user.institution,
      course: user.course,
      period: user.period,
      emailVerified: user.emailVerified,
      identityVerified: user.identityVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return usuarioCriado[0];
}