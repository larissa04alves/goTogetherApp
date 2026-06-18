import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "@/db/schema/auth";

import { carona } from "./carona";

export const caronaMembro = pgTable(
  "carona_membro",
  {
    caronaId: text("carona_id")
      .notNull()
      .references(() => carona.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["motorista", "passageiro"] }).notNull(),
    status: text("status", { enum: ["ativo", "expulso"] })
      .notNull()
      .default("ativo"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.caronaId, table.userId] })],
);

export const caronaMembroRelations = relations(caronaMembro, ({ one }) => ({
  carona: one(carona, {
    fields: [caronaMembro.caronaId],
    references: [carona.id],
  }),
  user: one(user, {
    fields: [caronaMembro.userId],
    references: [user.id],
  }),
}));
