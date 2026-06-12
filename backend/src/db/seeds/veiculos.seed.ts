import { db } from "@/db/client";
import { veiculo } from "@/db/schema";

import { USER_IDS, VEICULO_IDS } from "./constants";

type SeedVeiculo = {
  id: string;
  userId: string;
  marca: string;
  modelo: string;
  placa: string;
  cor: string;
  capacidade: number;
};

const veiculos: SeedVeiculo[] = [
  {
    id: VEICULO_IDS.joao,
    userId: USER_IDS.joao,
    marca: "Honda",
    modelo: "Fit",
    placa: "ABC1D23",
    cor: "Branco",
    capacidade: 4,
  },
  {
    id: VEICULO_IDS.carlos,
    userId: USER_IDS.carlos,
    marca: "Fiat",
    modelo: "Argo",
    placa: "DEF4G56",
    cor: "Prata",
    capacidade: 4,
  },
  {
    id: VEICULO_IDS.luana,
    userId: USER_IDS.luana,
    marca: "Toyota",
    modelo: "Corolla",
    placa: "GHI7J89",
    cor: "Preto",
    capacidade: 5,
  },
  {
    id: VEICULO_IDS.ramon,
    userId: USER_IDS.ramon,
    marca: "Volkswagen",
    modelo: "Gol",
    placa: "JKL2M34",
    cor: "Vermelho",
    capacidade: 4,
  },
];

export async function seedVeiculos() {
  for (const v of veiculos) {
    await db
      .insert(veiculo)
      .values({
        id: v.id,
        userId: v.userId,
        marca: v.marca,
        modelo: v.modelo,
        placa: v.placa,
        cor: v.cor,
        capacidade: v.capacidade,
        criadoEm: new Date(),
      })
      .onConflictDoNothing();
  }

  console.log(`Seed de veículos concluído (${veiculos.length} veículos).`);
}
