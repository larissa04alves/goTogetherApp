import { request } from "@/api/client";

export type UploadedDocument = {
  filename: string;
  path: string;
};

export function uploadDocument(file: File): Promise<UploadedDocument> {
  const body = new FormData();
  body.append("document", file);
  // headers: {} overrides the default "Content-Type: application/json" from the
  // shared client so the browser can set the multipart/form-data boundary automatically.
  return request<UploadedDocument>("/api/documents/upload", {
    method: "POST",
    body,
    headers: {},
  });
}
