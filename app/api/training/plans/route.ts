import { and, asc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { coachTrainingPlans } from "../../../../db/schema";
import { coachPlanToProgramDay } from "../../../../lib/coach-plans";
import { getTesterId } from "../../../../lib/tester-session";

export async function GET() {
  const testerId = await getTesterId();
  if (!testerId) return Response.json({ error: "Tilslut dit tester-ID først." }, { status: 401 });
  try {
    const rows = await getDb().select().from(coachTrainingPlans).where(and(eq(coachTrainingPlans.testerId, testerId), eq(coachTrainingPlans.status, "active"))).orderBy(asc(coachTrainingPlans.scheduledDate));
    return Response.json({ plans: rows.map(coachPlanToProgramDay) }, { headers: { "cache-control": "private, no-store" } });
  } catch {
    return Response.json({ error: "Trænerens tildelte pas kunne ikke hentes." }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
