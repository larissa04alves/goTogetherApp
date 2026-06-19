import { AppError } from "@/utils/app-error";

export type ServiceErrorMap = Record<string, { status: number; message: string }>;

export function createServiceErrorMapper(errors: ServiceErrorMap) {
  return (err: unknown): never => {
    const key = err instanceof Error ? err.message : "";
    const mapped = errors[key];
    if (mapped) throw new AppError(mapped.status, mapped.message);
    throw err;
  };
}
