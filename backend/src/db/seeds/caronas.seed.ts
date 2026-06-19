import { db } from "@/db/client";
import { carona, caronaMembro } from "@/db/schema";

import { CARONA_IDS, ROTA_IDS, USER_IDS, VEICULO_IDS } from "./constants";

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
    rotaId: ROTA_IDS.joao,
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.joao,
    horarioSaida: "23:00",
    vagasMax: 4,
    vagasDisponiveis: 3,
    valorPorPessoa: 500,
    soMulheres: false,
    status: "aberta",
  },
  {
    id: CARONA_IDS.carlosAberta,
    ofertanteId: USER_IDS.carlos,
    rotaId: ROTA_IDS.carlos,
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.carlos,
    horarioSaida: "18:30",
    vagasMax: 4,
    vagasDisponiveis: 4,
    valorPorPessoa: 450,
    soMulheres: false,
    status: "aberta",
  },
  {
    id: CARONA_IDS.luanaSoMulheres,
    ofertanteId: USER_IDS.luana,
    rotaId: ROTA_IDS.luana,
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
    id: CARONA_IDS.ramonComDemo,
    ofertanteId: USER_IDS.ramon,
    rotaId: ROTA_IDS.ramon,
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.ramon,
    horarioSaida: "07:30",
    vagasMax: 4,
    vagasDisponiveis: 3,
    valorPorPessoa: 600,
    soMulheres: false,
    status: "aberta",
  },
  {
    id: CARONA_IDS.demoGerencia,
    ofertanteId: USER_IDS.demo,
    rotaId: ROTA_IDS.demoCasaPucpr,
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.demo,
    horarioSaida: "08:00",
    vagasMax: 4,
    vagasDisponiveis: 2,
    valorPorPessoa: 550,
    soMulheres: false,
    status: "aberta",
  },
  // --- CONCLUÍDA da DEMO como ofertante (avaliar passageiros ao vivo) ---
  {
    id: CARONA_IDS.demoConcluidaOfertante,
    ofertanteId: USER_IDS.demo,
    rotaId: ROTA_IDS.demoPucprCentro,
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.demo,
    horarioSaida: "19:00",
    vagasMax: 4,
    vagasDisponiveis: 2,
    valorPorPessoa: 500,
    soMulheres: false,
    status: "concluida",
  },
  // --- CONCLUÍDA de outro onde a demo foi passageira (avaliar motorista/co-passageiro) ---
  {
    id: CARONA_IDS.joaoConcluidaDemoPassageira,
    ofertanteId: USER_IDS.joao,
    rotaId: ROTA_IDS.joao,
    tipo: "carro_proprio",
    veiculoId: VEICULO_IDS.joao,
    horarioSaida: "23:00",
    vagasMax: 4,
    vagasDisponiveis: 2,
    valorPorPessoa: 500,
    soMulheres: false,
    status: "concluida",
  },
  // --- CANCELADA da DEMO (mostra estado cancelado) ---
  {
    id: CARONA_IDS.demoCancelada,
    ofertanteId: USER_IDS.demo,
    rotaId: ROTA_IDS.demoCasaPucpr,
    tipo: "rachar_app",
    veiculoId: null,
    horarioSaida: "10:00",
    vagasMax: 3,
    vagasDisponiveis: 3,
    valorPorPessoa: null,
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
  // joaoAberta
  { caronaId: CARONA_IDS.joaoAberta, userId: USER_IDS.joao, role: "motorista" },
  {
    caronaId: CARONA_IDS.joaoAberta,
    userId: USER_IDS.maria,
    role: "passageiro",
  },
  // carlosAberta
  {
    caronaId: CARONA_IDS.carlosAberta,
    userId: USER_IDS.carlos,
    role: "motorista",
  },
  // luanaSoMulheres
  {
    caronaId: CARONA_IDS.luanaSoMulheres,
    userId: USER_IDS.luana,
    role: "motorista",
  },
  {
    caronaId: CARONA_IDS.luanaSoMulheres,
    userId: USER_IDS.ana,
    role: "passageiro",
  },
  // ramonComDemo (demo é passageira)
  {
    caronaId: CARONA_IDS.ramonComDemo,
    userId: USER_IDS.ramon,
    role: "motorista",
  },
  {
    caronaId: CARONA_IDS.ramonComDemo,
    userId: USER_IDS.demo,
    role: "passageiro",
  },
  // demoGerencia (demo ofertante + 2 passageiros)
  {
    caronaId: CARONA_IDS.demoGerencia,
    userId: USER_IDS.demo,
    role: "motorista",
  },
  {
    caronaId: CARONA_IDS.demoGerencia,
    userId: USER_IDS.maria,
    role: "passageiro",
  },
  {
    caronaId: CARONA_IDS.demoGerencia,
    userId: USER_IDS.carlos,
    role: "passageiro",
  },
  // demoConcluidaOfertante (demo ofertante + maria + ana)
  {
    caronaId: CARONA_IDS.demoConcluidaOfertante,
    userId: USER_IDS.demo,
    role: "motorista",
  },
  {
    caronaId: CARONA_IDS.demoConcluidaOfertante,
    userId: USER_IDS.maria,
    role: "passageiro",
  },
  {
    caronaId: CARONA_IDS.demoConcluidaOfertante,
    userId: USER_IDS.ana,
    role: "passageiro",
  },
  // joaoConcluidaDemoPassageira (joao ofertante + demo + carlos)
  {
    caronaId: CARONA_IDS.joaoConcluidaDemoPassageira,
    userId: USER_IDS.joao,
    role: "motorista",
  },
  {
    caronaId: CARONA_IDS.joaoConcluidaDemoPassageira,
    userId: USER_IDS.demo,
    role: "passageiro",
  },
  {
    caronaId: CARONA_IDS.joaoConcluidaDemoPassageira,
    userId: USER_IDS.carlos,
    role: "passageiro",
  },
  // demoCancelada (só a demo)
  {
    caronaId: CARONA_IDS.demoCancelada,
    userId: USER_IDS.demo,
    role: "motorista",
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
        status: "ativo",
        joinedAt: new Date(),
      })
      .onConflictDoNothing();
  }

  console.log(
    `Seed de caronas concluído (${caronas.length} caronas, ${membros.length} membros).`,
  );
}
