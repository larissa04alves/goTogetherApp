import { relations } from "drizzle-orm";
import {
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "@/db/schema/auth";

export const rota = pgTable(
  "rota",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    origemNome: text("origem_nome").notNull(),
    origemEndereco: text("origem_endereco").notNull(),
    origemLat: doublePrecision("origem_lat").notNull(),
    origemLng: doublePrecision("origem_lng").notNull(),

    destinoNome: text("destino_nome").notNull(),
    destinoEndereco: text("destino_endereco").notNull(),
    destinoLat: doublePrecision("destino_lat").notNull(),
    destinoLng: doublePrecision("destino_lng").notNull(),

    horarioPadrao: text("horario_padrao").notNull(),
    distanciaKm: doublePrecision("distancia_km").notNull(),

    criadoEm: timestamp("criado_em").defaultNow().notNull(),
  },
  (table) => [
    index("rota_userId_idx").on(table.userId),
  ],
);

export const rotaRelations = relations(rota, ({ one }) => ({
  user: one(user, { fields: [rota.userId], references: [user.id] }),
}));