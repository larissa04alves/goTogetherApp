import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { createDb } from "@/db/client";
import { env } from "@/env";
import * as schema from "@/db/schema/auth";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        genero: { type: "string", required: false, input: true },
        phone: { type: "string", required: false, input: true },
        emergencyContactName: { type: "string", required: false, input: true },
        emergencyContactPhone: { type: "string", required: false, input: true },
      },
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes:
        env.NODE_ENV === "production"
          ? { sameSite: "none", secure: true, httpOnly: true }
          : { sameSite: "lax", secure: false, httpOnly: true },
    },
    plugins: [],
  });
}

export const auth = createAuth();
