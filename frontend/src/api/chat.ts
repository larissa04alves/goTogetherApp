import { request } from "@/api/client";

export type StreamCredentials = {
  apiKey: string;
  token: string;
  userId: string;
};

export type HubChannel = {
  channelType: string;
  channelId: string;
};

export function fetchStreamToken(): Promise<StreamCredentials> {
  return request<StreamCredentials>("/chat/token", { method: "POST" });
}

export function joinHubChannel(hubId: string, name?: string): Promise<HubChannel> {
  return request<HubChannel>(`/hubs/${hubId}/chat`, {
    method: "POST",
    body: JSON.stringify(name ? { name } : {}),
  });
}
