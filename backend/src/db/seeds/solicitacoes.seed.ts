import { db } from "@/db/client";
import { solicitacao } from "@/db/schema";

import { CARONA_IDS, USER_IDS } from "./constants";

type SeedSolicitacao = {
  id: string;
  caronaId: string;
  solicitanteId: string;
  status: "pendente" | "aprovada" | "rejeitada" | "cancelada";
  respondidoEm: Date | null;
};

const solicitacoes: SeedSolicitacao[] = [
  {
    id: "seed-solicitacao-pendente",
    caronaId: CARONA_IDS.carlosAberta,
    solicitanteId: USER_IDS.ana,
    status: "pendente",
    respondidoEm: null,
  },
  {
    id: "seed-solicitacao-aprovada",
    caronaId: CARONA_IDS.joaoAberta,
    solicitanteId: USER_IDS.maria,
    status: "aprovada",
    respondidoEm: new Date(),
  },
  {
    id: "seed-solicitacao-rejeitada",
    caronaId: CARONA_IDS.luanaSoMulheres,
    solicitanteId: USER_IDS.ramon,
    status: "rejeitada",
    respondidoEm: new Date(),
  },
  {
    id: "seed-solicitacao-cancelada",
    caronaId: CARONA_IDS.luanaSoMulheres,
    solicitanteId: USER_IDS.ana,
    status: "cancelada",
    respondidoEm: new Date(),
  },
];

export async function seedSolicitacoes() {
  for (const s of solicitacoes) {
    await db
      .insert(solicitacao)
      .values({
        id: s.id,
        caronaId: s.caronaId,
        solicitanteId: s.solicitanteId,
        status: s.status,
        criadoEm: new Date(),
        respondidoEm: s.respondidoEm,
      })
      .onConflictDoNothing();
  }

  console.log(
    `Seed de solicitações concluído (${solicitacoes.length} solicitações).`,
  );
}
