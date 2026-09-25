import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { dailyHealthMetrics, healthConnections } from "../../../../db/schema";
import { buildHealthSummary, type DailyHealthMetric } from "../../../../lib/health-data";
import { getTesterId } from "../../../../lib/tester-session";

const unavailableMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  return message.includes("no such table") || message.includes("D1 binding");
};

export async function GET() {
  const testerId = await getTesterId();
  if (!testerId) {
    return Response.json({ error: "Tilslut dit tester-ID først." }, { status: 401 });
  }

  try {
    const db = getDb();
    const [connections, rows] = await Promise.all([
      db.select({
        provider: healthConnections.provider,
        status: healthConnections.status,
        lastSyncedAt: healthConnections.lastSyncedAt,
      }).from(healthConnections).where(eq(healthConnections.testerId, testerId)),
      db.select({
        provider: dailyHealthMetrics.provider,
        metricDate: dailyHealthMetrics.metricDate,
        sleepDurationMinutes: dailyHealthMetrics.sleepDurationMinutes,
        sleepScore: dailyHealthMetrics.sleepScore,
        restingHeartRate: dailyHealthMetrics.restingHeartRate,
        hrvMs: dailyHealthMetrics.hrvMs,
        hrvMethod: dailyHealthMetrics.hrvMethod,
        sourceUpdatedAt: dailyHealthMetrics.sourceUpdatedAt,
      }).from(dailyHealthMetrics)
        .where(eq(dailyHealthMetrics.testerId, testerId))
        .orderBy(desc(dailyHealthMetrics.metricDate))
        .limit(14),
    ]);

    return Response.json({
      connections,
      summary: buildHealthSummary(rows as DailyHealthMetric[]),
    });
  } catch (error) {
    if (unavailableMessage(error)) {
      return Response.json({ connections: [], summary: buildHealthSummary([]) });
    }
    return Response.json({ error: "Sundhedsdata kunne ikke hentes." }, { status: 500 });
  }
}
