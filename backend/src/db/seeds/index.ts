import { sql } from "drizzle-orm";

import { db } from "@/db/client";

import { seedAvaliacoes } from "./avaliacoes.seed";
import { seedCaronas } from "./caronas.seed";
import { seedChat } from "./chat.seed";
import { seedRotas } from "./rotas.seed";
import { seedUsers } from "./users.seed";
import { seedVeiculos } from "./veiculos.seed";

// Limpa todas as tabelas de dados (incluindo contas) para um estado
// determinístico. CASCADE resolve as FKs; RESTART IDENTITY zera sequências.
async function limparBanco() {
  await db.execute(
    sql`TRUNCATE TABLE
      avaliacao, solicitacao, carona_membro, carona, rota, veiculo,
      "session", account, verification, "user"
    RESTART IDENTITY CASCADE`,
  );
  console.log("Banco limpo (todas as tabelas de dados zeradas).");
}

async function main() {
  await limparBanco();
  await seedUsers();
  await seedVeiculos();
  await seedRotas();
  await seedCaronas();
  await seedAvaliacoes();

  // Chat depende do Stream (rede/credenciais); não deve abortar o seed.
  try {
    await seedChat();
  } catch (err) {
    console.warn(
      "Seed de chat falhou (siga sem ele; o chat funciona ao vivo no app):",
      err instanceof Error ? err.message : err,
    );
  }

  console.log("\n✅ Seed concluído. Conta demo: demo@gotogether.com / demo1234");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed falhou:", err);
  process.exit(1);
});
