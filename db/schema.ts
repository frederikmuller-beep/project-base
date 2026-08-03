import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const feedbackResponses = sqliteTable("feedback_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind", { enum: ["session", "final"] }).notNull(),
  testerId: text("tester_id").notNull(),
  role: text("role", { enum: ["athlete", "coach"] }).notNull(),
  answers: text("answers").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const trainingSessions = sqliteTable("training_sessions", {
  id: text("id").primaryKey(),
  testerId: text("tester_id").notNull(),
  programId: text("program_id").notNull(),
  status: text("status", { enum: ["active", "completed"] }).notNull().default("active"),
  plannedSets: integer("planned_sets").notNull(),
  completedSets: integer("completed_sets").notNull().default(0),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
}, (table) => [
  uniqueIndex("idx_training_sessions_tester_program").on(table.testerId, table.programId),
  index("idx_training_sessions_tester").on(table.testerId),
]);

export const trainingSetLogs = sqliteTable("training_set_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull().references(() => trainingSessions.id, { onDelete: "cascade" }),
  exerciseIndex: integer("exercise_index").notNull(),
  setIndex: integer("set_index").notNull(),
  weight: text("weight").notNull(),
  reps: text("reps").notNull(),
  rpe: text("rpe").notNull(),
  loggedAt: text("logged_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_training_set_logs_session_position").on(table.sessionId, table.exerciseIndex, table.setIndex),
  index("idx_training_set_logs_session").on(table.sessionId),
]);
