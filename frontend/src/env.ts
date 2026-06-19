import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
  },
  // Workaround de tipagem: @t3-oss/env-core espera `Record<string, string>`,
  // mas import.meta.env não tem esse tipo estático — cast necessário.
  runtimeEnv: (import.meta as any).env,
  emptyStringAsUndefined: true,
});

export const isDev = import.meta.env.DEV;
