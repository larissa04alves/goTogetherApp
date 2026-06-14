import { env } from "@/env";

export type UploadedDocument = {
  filename: string;
  path: string;
};

const BASE_URL = env.VITE_SERVER_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as T;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: string;
      message?: string;
    };
    return body.error ?? body.message ?? `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}

export function uploadDocument(file: File): Promise<UploadedDocument> {
  const body = new FormData();
  body.append("document", file);
  return request<UploadedDocument>("/api/documents/upload", {
    method: "POST",
    body,
  });
}
