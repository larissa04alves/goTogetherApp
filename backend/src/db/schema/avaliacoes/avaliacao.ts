import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { user } from "@/db/schema/auth";
import { carona } from "@/db/schema/caronas/carona";

export const avaliacao = pgTable(
  "avaliacao",
  {
    id: text("id").primaryKey(),
    caronaId: text("carona_id")
      .notNull()
      .references(() => carona.id),
    avaliadorId: text("avaliador_id")
      .notNull()
      .references(() => user.id),
    avaliadoId: text("avaliado_id")
      .notNull()
      .references(() => user.id),
    nota: integer("nota").notNull(),
    comentario: text("comentario"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("avaliacao_unique_idx").on(
      table.caronaId,
      table.avaliadorId,
      table.avaliadoId,
    ),
    index("avaliacao_avaliadoId_idx").on(table.avaliadoId),
  ],
);

export const avaliacaoRelations = relations(avaliacao, ({ one }) => ({
  carona: one(carona, {
    fields: [avaliacao.caronaId],
    references: [carona.id],
  }),
  avaliador: one(user, {
    fields: [avaliacao.avaliadorId],
    references: [user.id],
    relationName: "avaliacoes_dadas",
  }),
  avaliado: one(user, {
    fields: [avaliacao.avaliadoId],
    references: [user.id],
    relationName: "avaliacoes_recebidas",
  }),
}));
