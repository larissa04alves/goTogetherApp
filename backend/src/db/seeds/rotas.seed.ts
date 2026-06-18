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
  endereco: "Rua Imaculada Conceição, 1155, Prado Velho",
  lat: -25.4515,
  lng: -49.231,
};

const rotas: SeedRota[] = [
  {
    id: ROTA_IDS.demoCasaPucpr,
    userId: USER_IDS.demo,
    origemNome: "Casa",
    origemEndereco: "Rua Brigadeiro Franco, 1500, Centro",
    origemLat: -25.47,
    origemLng: -49.29,
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
    destinoEndereco: "Praça Tiradentes, Centro",
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
    destinoEndereco: "Rua XV de Novembro, 500, Centro",
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
    destinoEndereco: "Avenida do Batel, 1230, Batel",
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
    destinoEndereco: "Rua Manoel Ribas, CIC",
    destinoLat: -25.487,
    destinoLng: -49.336,
    horarioPadrao: "22:15",
    distanciaKm: 11.8,
  },
  {
    id: ROTA_IDS.ramon,
    userId: USER_IDS.ramon,
    origemNome: PUCPR.nome,
    origemEndereco: PUCPR.endereco,
    origemLat: PUCPR.lat,
    origemLng: PUCPR.lng,
    destinoNome: "Pinhais",
    destinoEndereco: "Avenida Camilo di Lellis, Pinhais",
    destinoLat: -25.445,
    destinoLng: -49.192,
    horarioPadrao: "07:30",
    distanciaKm: 8.7,
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
