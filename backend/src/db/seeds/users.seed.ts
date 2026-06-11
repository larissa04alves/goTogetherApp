import { hashPassword } from "@better-auth/utils/password";

import { db } from "@/db/client";
import { account, user } from "@/db/schema";

import { USER_IDS } from "./constants";

const DEV_PASSWORD = "senha123";

type SeedUser = {
  id: string;
  name: string;
  email: string;
  genero: "feminino" | "masculino" | "outro" | "prefiro nao dizer";
  emailVerified: boolean;
};

const users: SeedUser[] = [
  {
    id: USER_IDS.joao,
    name: "João Teste",
    email: "joao.teste@email.com",
    genero: "masculino",
    emailVerified: true,
  },
  {
    id: USER_IDS.maria,
    name: "Maria Teste",
    email: "maria.teste@email.com",
    genero: "feminino",
    emailVerified: true,
  },
  {
    id: USER_IDS.carlos,
    name: "Carlos Souza",
    email: "carlos.teste@email.com",
    genero: "masculino",
    emailVerified: true,
  },
  {
    id: USER_IDS.luana,
    name: "Luana Rocha",
    email: "luana.teste@email.com",
    genero: "feminino",
    emailVerified: true,
  },
  {
    id: USER_IDS.ramon,
    name: "Ramon Dino",
    email: "ramon.teste@email.com",
    genero: "masculino",
    emailVerified: false,
  },
  {
    id: USER_IDS.ana,
    name: "Ana Paula",
    email: "ana.teste@email.com",
    genero: "feminino",
    emailVerified: true,
  },
];

export async function seedUsers() {
  const hashedPassword = await hashPassword(DEV_PASSWORD);

  for (const u of users) {
    await db
      .insert(user)
      .values({
        id: u.id,
        name: u.name,
        email: u.email,
        genero: u.genero,
        emailVerified: u.emailVerified,
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

  console.log(`Seed de usuários concluído (${users.length} usuários).`);
}
