import { env } from "@/env";

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

const BASE_URL = env.VITE_SERVER_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string; message?: string };
    return body.error ?? body.message ?? `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}

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
