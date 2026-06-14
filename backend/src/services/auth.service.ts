import { randomUUID } from 'node:crypto';

import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { user } from '@/db/schema/auth';
import type { RegisterPayload } from '@/validators/auth.validator';

import jwt, { type SignOptions } from "jsonwebtoken";


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

type LoginData = {
  email: string;
  senha: string;
};

type AuthTokenPayload = {
  userId: string;
  email: string;
  role: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }

  return secret;
}

function getJwtExpiresIn(): SignOptions["expiresIn"] {
  return (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];
}

export async function loginUser(data: LoginData) {
  const email = data.email.toLowerCase().trim();

  const [existingUser] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash: user.passwordHash,
      emailVerified: user.emailVerified,
      identityVerified: user.identityVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!existingUser || !existingUser.passwordHash) {
    throw {
      status: 401,
      message: "E-mail ou senha inválidos.",
    };
  }

  const passwordMatches = await bcrypt.compare(
    data.senha,
    existingUser.passwordHash
  );

  if (!passwordMatches) {
    throw {
      status: 401,
      message: "E-mail ou senha inválidos.",
    };
  }

  const payload: AuthTokenPayload = {
    userId: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
  };

  const token = jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  });

  return {
    token,
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      emailVerified: existingUser.emailVerified,
      identityVerified: existingUser.identityVerified,
      image: existingUser.image,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    },
  };
}

export async function findAuthenticatedUserById(userId: string) {
  const [authenticatedUser] = await db
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
      role: user.role,
      emailVerified: user.emailVerified,
      identityVerified: user.identityVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return authenticatedUser;
}