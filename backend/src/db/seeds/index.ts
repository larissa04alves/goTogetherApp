import { seedAvaliacoes } from "./avaliacoes.seed";
import { seedCaronas } from "./caronas.seed";
import { seedChat } from "./chat.seed";
import { seedSolicitacoes } from "./solicitacoes.seed";
import { seedUsers } from "./users.seed";
import { seedVeiculos } from "./veiculos.seed";

async function main() {
  await seedUsers();
  await seedVeiculos();
  await seedCaronas();
  await seedSolicitacoes();
  await seedAvaliacoes();
  await seedChat();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed falhou:", err);
  process.exit(1);
});
