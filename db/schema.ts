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

export const wearableConnections = sqliteTable(
  "wearable_connections",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    testerId: text("tester_id").notNull(),
    provider: text("provider", { enum: ["garmin", "apple"] }).notNull(),
    deviceFamily: text("device_family").notNull(),
    deviceModel: text("device_model").notNull(),
    consentStatus: text("consent_status", { enum: ["granted", "revoked"] }).notNull(),
    consentedAt: text("consented_at").notNull(),
    revokedAt: text("revoked_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("wearable_connections_tester_provider_unique").on(
      table.testerId,
      table.provider,
    ),
  ],
);

export const wearableDailyMetrics = sqliteTable(
  "wearable_daily_metrics",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    connectionId: integer("connection_id")
      .notNull()
      .references(() => wearableConnections.id, { onDelete: "cascade" }),
    localDate: text("local_date").notNull(),
    sleepDurationMinutes: integer("sleep_duration_minutes"),
    sleepQualityScore: integer("sleep_quality_score"),
    sleepQualitySource: text("sleep_quality_source", {
      enum: ["provider_score", "base_derived"],
    }),
    restingHeartRateBpm: integer("resting_heart_rate_bpm"),
    hrvMs: integer("hrv_ms"),
    hrvMetric: text("hrv_metric", { enum: ["sdnn", "rmssd", "provider_status"] }),
    hrvStatus: text("hrv_status", {
      enum: ["balanced", "unbalanced", "low", "poor", "no_status"],
    }),
    wornOvernight: integer("worn_overnight", { mode: "boolean" }).notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("wearable_daily_metrics_connection_date_unique").on(
      table.connectionId,
      table.localDate,
    ),
    index("wearable_daily_metrics_date_idx").on(table.localDate),
  ],
);
