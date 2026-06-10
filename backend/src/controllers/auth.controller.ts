import { randomUUID } from "node:crypto";

import { hash } from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import type { RequestHandler } from "express";

import { db } from "@/db/client";
import { account, user } from "@/db/schema/auth";
import {
  formatValidationErrors,
  registerPayloadSchema,
  type RegisterPayload,
} from "@/validators/auth.validator";

const PASSWORD_HASH_ROUNDS = 12;
const DEFAULT_ROLE = "student";

type RegisteredUserResponse = {
  id: string;
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string | null;
  genero: string | null;
  instituicao: string | null;
  curso: string | null;
  periodo: string | null;
  email_verificado: boolean;
  identidade_verificada: boolean;
  role: string;
  created_at: string;
};

function buildRegisteredUserResponse(
  payload: RegisterPayload & {
    id: string;
    role: string;
    emailVerified: boolean;
    identityVerified: boolean;
    createdAt: Date;
  },
): RegisteredUserResponse {
  return {
    id: payload.id,
    nome_completo: payload.nome_completo,
    email: payload.email,
    cpf: payload.cpf,
    telefone: payload.telefone ?? null,
    genero: payload.genero ?? null,
    instituicao: payload.instituicao ?? null,
    curso: payload.curso ?? null,
    periodo: payload.periodo ?? null,
    email_verificado: payload.emailVerified,
    identidade_verificada: payload.identityVerified,
    role: payload.role,
    created_at: payload.createdAt.toISOString(),
  };
}

function isUniqueViolation(error: unknown): error is { code: string; constraint?: string; detail?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string" &&
    (error as { code: string }).code === "23505"
  );
}

function getDuplicateConflict(error: { constraint?: string; detail?: string }) {
  if (error.constraint === "user_cpf_unique_idx" || error.detail?.includes("(cpf)")) {
    return {
      field: "cpf",
      message: "CPF ja cadastrado.",
    };
  }

  if (error.detail?.includes("(email)")) {
    return {
      field: "email",
      message: "E-mail ja cadastrado.",
    };
  }

  return {
    field: "user",
    message: "Usuario ja cadastrado.",
  };
}

export const registerUser: RequestHandler = async (req, res) => {
  const validationResult = registerPayloadSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: "Dados de cadastro invalidos.",
      errors: formatValidationErrors(validationResult.error),
    });
  }

  const payload = validationResult.data;

  try {
    const [existingEmailUser, existingCpfUser] = await Promise.all([
      db
        .select({ id: user.id })
        .from(user)
        .where(sql`lower(${user.email}) = ${payload.email}`)
        .limit(1),
      db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.cpf, payload.cpf))
        .limit(1),
    ]);

    if (existingEmailUser[0]) {
      return res.status(409).json({
        field: "email",
        message: "E-mail ja cadastrado.",
      });
    }

    if (existingCpfUser[0]) {
      return res.status(409).json({
        field: "cpf",
        message: "CPF ja cadastrado.",
      });
    }

    const userId = randomUUID();
    const accountId = randomUUID();
    const now = new Date();
    const passwordHash = await hash(payload.senha, PASSWORD_HASH_ROUNDS);

    await db.transaction(async (tx) => {
      await tx.insert(user).values({
        id: userId,
        name: payload.nome_completo,
        email: payload.email,
        cpf: payload.cpf,
        phone: payload.telefone,
        gender: payload.genero,
        institution: payload.instituicao,
        course: payload.curso,
        period: payload.periodo,
        role: DEFAULT_ROLE,
        emailVerified: false,
        identityVerified: false,
      });

      await tx.insert(account).values({
        id: accountId,
        accountId: userId,
        providerId: "credential",
        userId,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      });
    });

    return res.status(201).json({
      user: buildRegisteredUserResponse({
        ...payload,
        id: userId,
        role: DEFAULT_ROLE,
        emailVerified: false,
        identityVerified: false,
        createdAt: now,
      }),
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      const duplicateConflict = getDuplicateConflict(error);

      return res.status(409).json(duplicateConflict);
    }

    console.error("Failed to register user", error);

    return res.status(500).json({
      message: "Nao foi possivel concluir o cadastro.",
    });
  }
};
