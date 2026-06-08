import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "@/db/schema/auth";
import { carona } from "@/db/schema/caronas/carona";

export const solicitacao = pgTable(
  "solicitacao",
  {
    id: text("id").primaryKey(),
    hubId: text("hub_id")
      .notNull()
      .references(() => carona.id, { onDelete: "cascade" }),
    solicitanteId: text("solicitante_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status", {
      enum: ["pendente", "aprovada", "rejeitada", "cancelada"],
    })
      .notNull()
      .default("pendente"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("solicitacao_hubId_idx").on(table.hubId),
    index("solicitacao_solicitanteId_idx").on(table.solicitanteId),
  ],
);

export const solicitacaoRelations = relations(solicitacao, ({ one }) => ({
  hub: one(carona, {
    fields: [solicitacao.hubId],
    references: [carona.id],
  }),
  solicitante: one(user, {
    fields: [solicitacao.solicitanteId],
    references: [user.id],
  }),
}));
