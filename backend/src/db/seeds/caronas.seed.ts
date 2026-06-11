import { db } from "@/db/client";
import { carona, caronaMembro } from "@/db/schema";

import { CARONA_IDS, USER_IDS, VEICULO_IDS } from "./constants";

type SeedCarona = {
  id: string;
  ofertanteId: string;
  rotaId: string;
  tipo: "carro_proprio" | "rachar_app";
  veiculoId: string | null;
  horarioSaida: string;
  vagasMax: number;
  vagasDisponiveis: number;
  valorPorPessoa: number | null;
  soMulheres: boolean;
  status: "aberta" | "fechada" | "cancelada" | "concluida";
};

const caronas: SeedCarona[] = [
  {
    id: CARONA_IDS.joaoAberta,
    ofertanteId: USER_IDS.joao,
    rotaId: "seed-rota-pucpr-centro",
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.joao,
    horarioSaida: "23:00",
    vagasMax: 4,
    vagasDisponiveis: 2,
    valorPorPessoa: 500,
    soMulheres: false,
    status: "aberta",
  },
  {
    id: CARONA_IDS.carlosAberta,
    ofertanteId: USER_IDS.carlos,
    rotaId: "seed-rota-pucpr-batel",
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.carlos,
    horarioSaida: "18:30",
    vagasMax: 4,
    vagasDisponiveis: 3,
    valorPorPessoa: 450,
    soMulheres: false,
    status: "aberta",
  },
  {
    id: CARONA_IDS.luanaSoMulheres,
    ofertanteId: USER_IDS.luana,
    rotaId: "seed-rota-pucpr-cic",
    tipo: "rachar_app",
    veiculoId: null,
    horarioSaida: "22:15",
    vagasMax: 3,
    vagasDisponiveis: 2,
    valorPorPessoa: null,
    soMulheres: true,
    status: "aberta",
  },
  {
    id: CARONA_IDS.joaoConcluida,
    ofertanteId: USER_IDS.joao,
    rotaId: "seed-rota-pucpr-centro",
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.joao,
    horarioSaida: "23:00",
    vagasMax: 4,
    vagasDisponiveis: 1,
    valorPorPessoa: 500,
    soMulheres: false,
    status: "concluida",
  },
  {
    id: CARONA_IDS.ramonCancelada,
    ofertanteId: USER_IDS.ramon,
    rotaId: "seed-rota-pucpr-pinhais",
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.ramon,
    horarioSaida: "07:00",
    vagasMax: 3,
    vagasDisponiveis: 3,
    valorPorPessoa: 600,
    soMulheres: false,
    status: "cancelada",
  },
];

type SeedMembro = {
  caronaId: string;
  userId: string;
  role: "motorista" | "passageiro";
};

const membros: SeedMembro[] = [
  { caronaId: CARONA_IDS.joaoAberta, userId: USER_IDS.joao, role: "motorista" },
  {
    caronaId: CARONA_IDS.joaoAberta,
    userId: USER_IDS.maria,
    role: "passageiro",
  },
  {
    caronaId: CARONA_IDS.carlosAberta,
    userId: USER_IDS.carlos,
    role: "motorista",
  },
  {
    caronaId: CARONA_IDS.luanaSoMulheres,
    userId: USER_IDS.luana,
    role: "motorista",
  },
  {
    caronaId: CARONA_IDS.joaoConcluida,
    userId: USER_IDS.joao,
    role: "motorista",
  },
  {
    caronaId: CARONA_IDS.joaoConcluida,
    userId: USER_IDS.carlos,
    role: "passageiro",
  },
  {
    caronaId: CARONA_IDS.joaoConcluida,
    userId: USER_IDS.ana,
    role: "passageiro",
  },
];

export async function seedCaronas() {
  for (const c of caronas) {
    await db
      .insert(carona)
      .values({
        id: c.id,
        ofertanteId: c.ofertanteId,
        rotaId: c.rotaId,
        tipo: c.tipo,
        veiculoId: c.veiculoId,
        horarioSaida: c.horarioSaida,
        vagasMax: c.vagasMax,
        vagasDisponiveis: c.vagasDisponiveis,
        valorPorPessoa: c.valorPorPessoa,
        soMulheres: c.soMulheres,
        status: c.status,
        criadoEm: new Date(),
      })
      .onConflictDoNothing();
  }

  for (const m of membros) {
    await db
      .insert(caronaMembro)
      .values({
        caronaId: m.caronaId,
        userId: m.userId,
        role: m.role,
        joinedAt: new Date(),
      })
      .onConflictDoNothing();
  }

  console.log(
    `Seed de caronas concluído (${caronas.length} caronas, ${membros.length} membros).`,
  );
}
