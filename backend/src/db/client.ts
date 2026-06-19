import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "@/env";

import * as schema from "@/db/schema";

export function createDb() {
  return drizzle(env.DATABASE_URL, { schema });
}

export const db = createDb();
