import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const feedbackResponses = sqliteTable("feedback_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind", { enum: ["session", "final"] }).notNull(),
  testerId: text("tester_id").notNull(),
  role: text("role", { enum: ["athlete", "coach"] }).notNull(),
  answers: text("answers").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
