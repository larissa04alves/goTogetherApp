import { db } from "@/db/client";
import { rota } from "@/db/schema";

import { ROTA_IDS, USER_IDS } from "./constants";

type SeedRota = {
  id: string;
  userId: string;
  origemNome: string;
  origemEndereco: string;
  origemLat: number;
  origemLng: number;
  destinoNome: string;
  destinoEndereco: string;
  destinoLat: number;
  destinoLng: number;
  horarioPadrao: string;
  distanciaKm: number;
};

const PUCPR = {
  nome: "PUCPR",
  endereco: "Rua Imaculada Conceição, 1155, Prado Velho, 80215-901, Curitiba",
  lat: -25.4515,
  lng: -49.231,
};

const rotas: SeedRota[] = [
  {
    id: ROTA_IDS.demoCasaPucpr,
    userId: USER_IDS.demo,
    origemNome: "Casa",
    origemEndereco: "Rua Brigadeiro Franco, 1500, Centro, 80430-210, Curitiba",
    origemLat: -25.4433,
    origemLng: -49.2721,
    destinoNome: PUCPR.nome,
    destinoEndereco: PUCPR.endereco,
    destinoLat: PUCPR.lat,
    destinoLng: PUCPR.lng,
    horarioPadrao: "08:00",
    distanciaKm: 4.2,
  },
  {
    id: ROTA_IDS.demoPucprCentro,
    userId: USER_IDS.demo,
    origemNome: PUCPR.nome,
    origemEndereco: PUCPR.endereco,
    origemLat: PUCPR.lat,
    origemLng: PUCPR.lng,
    destinoNome: "Centro",
    destinoEndereco: "Praça Tiradentes, 50, Centro, 80020-100, Curitiba",
    destinoLat: -25.4296,
    destinoLng: -49.2719,
    horarioPadrao: "19:00",
    distanciaKm: 5.1,
  },
  {
    id: ROTA_IDS.joao,
    userId: USER_IDS.joao,
    origemNome: PUCPR.nome,
    origemEndereco: PUCPR.endereco,
    origemLat: PUCPR.lat,
    origemLng: PUCPR.lng,
    destinoNome: "Centro",
    destinoEndereco: "Rua XV de Novembro, 500, Centro, 80020-310, Curitiba",
    destinoLat: -25.4296,
    destinoLng: -49.2719,
    horarioPadrao: "23:00",
    distanciaKm: 5.0,
  },
  {
    id: ROTA_IDS.carlos,
    userId: USER_IDS.carlos,
    origemNome: PUCPR.nome,
    origemEndereco: PUCPR.endereco,
    origemLat: PUCPR.lat,
    origemLng: PUCPR.lng,
    destinoNome: "Batel",
    destinoEndereco: "Avenida do Batel, 1230, Batel, 80420-090, Curitiba",
    destinoLat: -25.442,
    destinoLng: -49.287,
    horarioPadrao: "18:30",
    distanciaKm: 6.3,
  },
  {
    id: ROTA_IDS.luana,
    userId: USER_IDS.luana,
    origemNome: PUCPR.nome,
    origemEndereco: PUCPR.endereco,
    origemLat: PUCPR.lat,
    origemLng: PUCPR.lng,
    destinoNome: "CIC",
    destinoEndereco: "Avenida Juscelino Kubitschek de Oliveira, 1000, Cidade Industrial, 81270-010, Curitiba",
    destinoLat: -25.4889,
    destinoLng: -49.3389,
    horarioPadrao: "22:15",
    distanciaKm: 10.5,
  },
  {
    id: ROTA_IDS.ramon,
    userId: USER_IDS.ramon,
    origemNome: PUCPR.nome,
    origemEndereco: PUCPR.endereco,
    origemLat: PUCPR.lat,
    origemLng: PUCPR.lng,
    destinoNome: "Cajuru",
    destinoEndereco: "Avenida Senador Salgado Filho, 2500, Cajuru, 82840-300, Curitiba",
    destinoLat: -25.4631,
    destinoLng: -49.2156,
    horarioPadrao: "07:30",
    distanciaKm: 5.4,
  },
];

export async function seedRotas() {
  for (const r of rotas) {
    await db
      .insert(rota)
      .values({
        id: r.id,
        userId: r.userId,
        origemNome: r.origemNome,
        origemEndereco: r.origemEndereco,
        origemLat: r.origemLat,
        origemLng: r.origemLng,
        destinoNome: r.destinoNome,
        destinoEndereco: r.destinoEndereco,
        destinoLat: r.destinoLat,
        destinoLng: r.destinoLng,
        horarioPadrao: r.horarioPadrao,
        distanciaKm: r.distanciaKm,
        criadoEm: new Date(),
      })
      .onConflictDoNothing();
  }

  console.log(`Seed de rotas concluído (${rotas.length} rotas).`);
}
