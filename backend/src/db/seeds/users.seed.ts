import { hashPassword } from "@better-auth/utils/password";

import { db } from "@/db/client";
import { account, user } from "@/db/schema";

const DEV_PASSWORD = "senha123";

const users = [
  {
    id: "seed-user-joao",
    name: "João Teste",
    email: "joao.teste@email.com",
    emailVerified: true,
  },
  {
    id: "seed-user-maria",
    name: "Maria Teste",
    email: "maria.teste@email.com",
    emailVerified: false,
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
