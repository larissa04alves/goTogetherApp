import { relations } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "@/db/schema/auth";

export const carona = pgTable(
  "carona",
  {
    id: text("id").primaryKey(),
    ofertanteId: text("ofertante_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rotaId: text("rota_id").notNull(),
    tipo: text("tipo", { enum: ["carro_proprio", "rachar_app"] }).notNull(),
    veiculoId: text("veiculo_id"),
    horarioSaida: text("horario_saida").notNull(),
    vagasMax: integer("vagas_max").notNull(),
    vagasDisponiveis: integer("vagas_disponiveis").notNull(),
    valorPorPessoa: integer("valor_por_pessoa"),
    soMulheres: boolean("so_mulheres").notNull().default(false),
    status: text("status", {
      enum: ["aberta", "fechada", "cancelada", "concluida"],
    })
      .notNull()
      .default("aberta"),
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
  },
  (table) => [index("carona_ofertanteId_idx").on(table.ofertanteId)],
);

export const caronaRelations = relations(carona, ({ one }) => ({
  ofertante: one(user, { fields: [carona.ofertanteId], references: [user.id] }),
}));
