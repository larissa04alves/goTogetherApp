import { relations } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "@/db/schema/auth";

export const carona = pgTable(
  "carona",
  {
    id: text("id").primaryKey(),
    driverId: text("driver_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status", {
      enum: ["pendente", "ativa", "concluida", "cancelada"],
    })
      .notNull()
      .default("ativa"),
    vagasDisponiveis: integer("vagas_disponiveis").notNull().default(1),
    soMulheres: boolean("so_mulheres").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("carona_driverId_idx").on(table.driverId)],
);

export const caronaRelations = relations(carona, ({ one }) => ({
  driver: one(user, { fields: [carona.driverId], references: [user.id] }),
}));
