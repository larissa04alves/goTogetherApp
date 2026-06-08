import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "@/db/schema/auth";
import { carona } from "@/db/schema/caronas/carona";

export const solicitacao = pgTable(
  "solicitacao",
  {
    id: text("id").primaryKey(),
    caronaId: text("carona_id")
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
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
    respondidoEm: timestamp("respondido_em"),
  },
  (table) => [
    index("solicitacao_caronaId_idx").on(table.caronaId),
    index("solicitacao_solicitanteId_idx").on(table.solicitanteId),
  ],
);

export const solicitacaoRelations = relations(solicitacao, ({ one }) => ({
  carona: one(carona, {
    fields: [solicitacao.caronaId],
    references: [carona.id],
  }),
  solicitante: one(user, {
    fields: [solicitacao.solicitanteId],
    references: [user.id],
  }),
}));
