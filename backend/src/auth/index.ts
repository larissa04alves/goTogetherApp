import { compare, hash as hashPassword } from "bcryptjs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { createDb } from "@/db/client";
import * as schema from "@/db/schema/auth";
import { env } from "@/env";

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
      minPasswordLength: 8,
      password: {
        hash: async (password) => hashPassword(password, 12),
        verify: async ({ password, hash }) => compare(password, hash),
      },
    },
    user: {
      additionalFields: {
        gender: { type: "string", required: false, input: true },
        phone: { type: "string", required: false, input: true },
        emergencyContactName: { type: "string", required: false, input: true },
        emergencyContactPhone: { type: "string", required: false, input: true },
        identityVerified: { type: "boolean", required: false, input: false },
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
export { authMiddleware } from "@/middlewares/auth.middleware";
