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

export const testParticipants = sqliteTable("test_participants", {
  testerId: text("tester_id").primaryKey(),
  trainingProfile: text("training_profile", { enum: ["weightlifting", "long_distance", "middle_distance", "sprint"] }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  lastSeenAt: text("last_seen_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const coachAthleteAssignments = sqliteTable("coach_athlete_assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coachId: text("coach_id").notNull(),
  testerId: text("tester_id").notNull(),
  assignedAt: text("assigned_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_coach_athlete_assignments_coach_tester").on(table.coachId, table.testerId),
  index("idx_coach_athlete_assignments_coach").on(table.coachId),
]);

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

export const healthConnections = sqliteTable("health_connections", {
  id: text("id").primaryKey(),
  testerId: text("tester_id").notNull(),
  provider: text("provider", { enum: ["apple_health", "garmin"] }).notNull(),
  status: text("status", { enum: ["pending", "connected", "disconnected", "error"] }).notNull().default("pending"),
  providerUserId: text("provider_user_id"),
  connectedAt: text("connected_at"),
  lastSyncedAt: text("last_synced_at"),
  disconnectedAt: text("disconnected_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_health_connections_tester_provider").on(table.testerId, table.provider),
  index("idx_health_connections_tester").on(table.testerId),
]);

export const dailyHealthMetrics = sqliteTable("daily_health_metrics", {
  id: text("id").primaryKey(),
  testerId: text("tester_id").notNull(),
  provider: text("provider", { enum: ["apple_health", "garmin"] }).notNull(),
  metricDate: text("metric_date").notNull(),
  sleepDurationMinutes: integer("sleep_duration_minutes"),
  sleepScore: integer("sleep_score"),
  restingHeartRate: integer("resting_heart_rate"),
  hrvMs: integer("hrv_ms"),
  hrvMethod: text("hrv_method", { enum: ["sdnn", "rmssd", "nightly_average", "unknown"] }),
  sourceUpdatedAt: text("source_updated_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_daily_health_metrics_tester_provider_date").on(table.testerId, table.provider, table.metricDate),
  index("idx_daily_health_metrics_tester_date").on(table.testerId, table.metricDate),
]);
