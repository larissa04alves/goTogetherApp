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

const avaliacoes: SeedAvaliacao[] = [
  {
    id: "seed-avaliacao-joao-carlos",
    caronaId: CARONA_IDS.joaoConcluida,
    avaliadorId: USER_IDS.joao,
    avaliadoId: USER_IDS.carlos,
    nota: 5,
    comentario: "Passageiro pontual e tranquilo, recomendo!",
  },
  {
    id: "seed-avaliacao-joao-ana",
    caronaId: CARONA_IDS.joaoConcluida,
    avaliadorId: USER_IDS.joao,
    avaliadoId: USER_IDS.ana,
    nota: 4,
    comentario: "Tudo certo na viagem.",
  },
  {
    id: "seed-avaliacao-carlos-joao",
    caronaId: CARONA_IDS.joaoConcluida,
    avaliadorId: USER_IDS.carlos,
    avaliadoId: USER_IDS.joao,
    nota: 5,
    comentario: "Motorista atencioso e dirige super bem.",
  },
  {
    id: "seed-avaliacao-ana-joao",
    caronaId: CARONA_IDS.joaoConcluida,
    avaliadorId: USER_IDS.ana,
    avaliadoId: USER_IDS.joao,
    nota: 5,
    comentario: "Carona confortável, chegamos no horário.",
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

  console.log(
    `Seed de avaliações concluído (${avaliacoes.length} avaliações).`,
  );
}
