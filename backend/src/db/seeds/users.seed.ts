import { hash } from "bcryptjs";

import { db } from "@/db/client";
import { account, user } from "@/db/schema";

import { USER_IDS } from "./constants";

// Senha única para todas as contas seed (incluindo a demo).
const SEED_PASSWORD = "demo1234";

type SeedUser = {
  id: string;
  name: string;
  email: string;
  genero: "feminino" | "masculino" | "outro" | "prefiro nao dizer";
  emailVerified: boolean;
  identityVerified: boolean;
};

const users: SeedUser[] = [
  {
    id: USER_IDS.demo,
    name: "Demo",
    email: "demo@gotogether.com",
    genero: "feminino",
    emailVerified: true,
    identityVerified: true,
  },
  {
    id: USER_IDS.joao,
    name: "João Teste",
    email: "joao.teste@email.com",
    genero: "masculino",
    emailVerified: true,
    identityVerified: true,
  },
  {
    id: USER_IDS.maria,
    name: "Maria Teste",
    email: "maria.teste@email.com",
    genero: "feminino",
    emailVerified: true,
    identityVerified: true,
  },
  {
    id: USER_IDS.carlos,
    name: "Carlos Souza",
    email: "carlos.teste@email.com",
    genero: "masculino",
    emailVerified: true,
    identityVerified: true,
  },
  {
    id: USER_IDS.luana,
    name: "Luana Rocha",
    email: "luana.teste@email.com",
    genero: "feminino",
    emailVerified: true,
    identityVerified: true,
  },
  {
    id: USER_IDS.ramon,
    name: "Ramon Dino",
    email: "ramon.teste@email.com",
    genero: "masculino",
    emailVerified: false,
    identityVerified: false,
  },
  {
    id: USER_IDS.ana,
    name: "Ana Paula",
    email: "ana.teste@email.com",
    genero: "feminino",
    emailVerified: true,
    identityVerified: true,
  },
];

export async function seedUsers() {
  const hashedPassword = await hash(SEED_PASSWORD, 12);

  for (const u of users) {
    await db
      .insert(user)
      .values({
        id: u.id,
        name: u.name,
        email: u.email,
        gender: u.genero,
        emailVerified: u.emailVerified,
        identityVerified: u.identityVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    await db
      .insert(account)
      .values({
        id: `seed-account-${u.id}`,
        accountId: u.email,
        providerId: "credential",
        userId: u.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
  }

  console.log(
    `Seed de usuários concluído (${users.length} usuários, senha: ${SEED_PASSWORD}).`,
  );
}
