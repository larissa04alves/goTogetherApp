import { request } from "@/api/client";

export type Vehicle = {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
  cor: string;
  capacidade: number;
};

export type VehicleInput = {
  marca: string;
  modelo: string;
  placa: string;
  cor: string;
  capacidade: number;
};

export function fetchVehicles(): Promise<Vehicle[]> {
  return request<Vehicle[]>("/veiculos");
}

export function createVehicle(input: VehicleInput): Promise<Vehicle> {
  return request<Vehicle>("/veiculos", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateVehicle(id: string, input: VehicleInput): Promise<Vehicle> {
  return request<Vehicle>(`/veiculos/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteVehicle(id: string): Promise<void> {
  return request<void>(`/veiculos/${id}`, { method: "DELETE" });
}
