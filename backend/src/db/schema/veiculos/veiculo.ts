import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { user } from "@/db/schema/auth";

export const veiculo = pgTable(
  "veiculo",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    marca: text("marca").notNull(),
    modelo: text("modelo").notNull(),
    placa: text("placa").notNull(),
    cor: text("cor").notNull(),
    capacidade: integer("capacidade").notNull(),
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("veiculo_placa_unique_idx").on(table.placa),
    index("veiculo_userId_idx").on(table.userId),
  ],
);

export const veiculoRelations = relations(veiculo, ({ one }) => ({
  user: one(user, { fields: [veiculo.userId], references: [user.id] }),
}));
