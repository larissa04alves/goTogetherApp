import { env } from "@/env";

export type StreamCredentials = {
  apiKey: string;
  token: string;
  userId: string;
};

export type HubChannel = {
  channelType: string;
  channelId: string;
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

export function fetchStreamToken(): Promise<StreamCredentials> {
  return request<StreamCredentials>("/stream/token", { method: "POST" });
}

export function joinHubChannel(hubId: string, name?: string): Promise<HubChannel> {
  return request<HubChannel>(`/hubs/${hubId}/chat`, {
    method: "POST",
    body: JSON.stringify(name ? { name } : {}),
  });
}
