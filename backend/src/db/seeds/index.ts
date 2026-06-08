import { seedUsers } from "./users.seed";

async function main() {
  await seedUsers();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed falhou:", err);
  process.exit(1);
});
