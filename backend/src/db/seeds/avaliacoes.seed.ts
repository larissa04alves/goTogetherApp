import { db } from "@/db/client";
import { avaliacao } from "@/db/schema";

import { CARONA_IDS, USER_IDS } from "./constants";

type SeedAvaliacao = {
  id: string;
  caronaId: string;
  avaliadorId: string;
  avaliadoId: string;
  nota: number;
  comentario: string | null;
};

// IMPORTANTE: a demo NÃO avalia ninguém aqui — ela recebe 4 avaliações
// (perfil com nota boa) e fica com 4 pendências pra demonstrar ao vivo:
//   - na carona concluída como ofertante: avaliar Maria e Ana
//   - na carona concluída como passageira: avaliar João e Carlos
const avaliacoes: SeedAvaliacao[] = [
  // demoConcluidaOfertante — demo recebe de Maria e Ana
  {
    id: "seed-aval-maria-demo",
    caronaId: CARONA_IDS.demoConcluidaOfertante,
    avaliadorId: USER_IDS.maria,
    avaliadoId: USER_IDS.demo,
    nota: 5,
    comentario: "Motorista super atenciosa, dirige com cuidado!",
  },
  {
    id: "seed-aval-ana-demo",
    caronaId: CARONA_IDS.demoConcluidaOfertante,
    avaliadorId: USER_IDS.ana,
    avaliadoId: USER_IDS.demo,
    nota: 4,
    comentario: "Carona tranquila, chegamos no horário.",
  },
  // entre passageiras (popula os perfis de Maria e Ana)
  {
    id: "seed-aval-ana-maria",
    caronaId: CARONA_IDS.demoConcluidaOfertante,
    avaliadorId: USER_IDS.ana,
    avaliadoId: USER_IDS.maria,
    nota: 5,
    comentario: "Companhia agradável na viagem.",
  },
  {
    id: "seed-aval-maria-ana",
    caronaId: CARONA_IDS.demoConcluidaOfertante,
    avaliadorId: USER_IDS.maria,
    avaliadoId: USER_IDS.ana,
    nota: 4,
    comentario: "Pontual e simpática.",
  },
  // joaoConcluidaDemoPassageira — demo recebe de João e Carlos
  {
    id: "seed-aval-joao-demo",
    caronaId: CARONA_IDS.joaoConcluidaDemoPassageira,
    avaliadorId: USER_IDS.joao,
    avaliadoId: USER_IDS.demo,
    nota: 5,
    comentario: "Passageira pontual, recomendo!",
  },
  {
    id: "seed-aval-carlos-demo",
    caronaId: CARONA_IDS.joaoConcluidaDemoPassageira,
    avaliadorId: USER_IDS.carlos,
    avaliadoId: USER_IDS.demo,
    nota: 5,
    comentario: "Ótima companhia de viagem.",
  },
  // entre João e Carlos (popula os perfis deles)
  {
    id: "seed-aval-carlos-joao",
    caronaId: CARONA_IDS.joaoConcluidaDemoPassageira,
    avaliadorId: USER_IDS.carlos,
    avaliadoId: USER_IDS.joao,
    nota: 5,
    comentario: "Motorista nota 10, dirige muito bem.",
  },
  {
    id: "seed-aval-joao-carlos",
    caronaId: CARONA_IDS.joaoConcluidaDemoPassageira,
    avaliadorId: USER_IDS.joao,
    avaliadoId: USER_IDS.carlos,
    nota: 5,
    comentario: "Tranquilo e pontual.",
  },
];

export async function seedAvaliacoes() {
  for (const a of avaliacoes) {
    await db
      .insert(avaliacao)
      .values({
        id: a.id,
        caronaId: a.caronaId,
        avaliadorId: a.avaliadorId,
        avaliadoId: a.avaliadoId,
        nota: a.nota,
        comentario: a.comentario,
        createdAt: new Date(),
      })
      .onConflictDoNothing();
  }

  console.log(`Seed de avaliações concluído (${avaliacoes.length} avaliações).`);
}
