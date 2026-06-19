import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core";

import { account } from "./account";
import { session } from "./session";

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    cpf: text("cpf"),
    phone: text("phone"),
    gender: text("gender"),
    institution: text("institution"),
    course: text("course"),
    period: text("period"),
    emergencyContactName: text("emergency_contact_name"),
    emergencyContactPhone: text("emergency_contact_phone"),
    role: text("role").default("student").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    identityVerified: boolean("identity_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("user_cpf_unique_idx").on(table.cpf)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));
