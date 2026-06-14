import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        gender: { type: "string", required: false },
        phone: { type: "string", required: false },
        emergencyContactName: { type: "string", required: false },
        emergencyContactPhone: { type: "string", required: false },
        identityVerified: { type: "boolean", required: false },
      },
    }),
  ],
});
