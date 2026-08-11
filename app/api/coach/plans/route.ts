import { and, asc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { coachAthleteAssignments, coachTrainingPlans } from "../../../../db/schema";
import { exerciseLibrary } from "../../../exercise-data";
import { coachPlanToProgramDay, type CoachPlanExercise } from "../../../../lib/coach-plans";
import { getPrivateAccessSecret, hasPrivateAccess } from "../../../../lib/private-access";
import { normalizeTesterId } from "../../../../lib/tester-session";

const testCoachId = "test-coach-1";
const exerciseNames = new Set(exerciseLibrary.map((exercise) => exercise.name));

const accessError = (request: Request) => {
  if (!getPrivateAccessSecret("BASE_COACH_KEY")) return Response.json({ error: "Træneradgangen er ikke konfigureret endnu." }, { status: 503 });
  if (!hasPrivateAccess(request, "BASE_COACH_KEY")) return Response.json({ error: "Forkert trænernøgle." }, { status: 401, headers: { "cache-control": "no-store", "www-authenticate": "Bearer" } });
  return null;
};

const cleanText = (value: unknown, maxLength: number) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength ? value.trim() : null;

const cleanExercise = (value: unknown): CoachPlanExercise | null => {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const name = cleanText(item.name, 100);
  const focus = cleanText(item.focus, 180);
  const plannedReps = cleanText(item.plannedReps, 20);
  const defaultWeight = cleanText(item.defaultWeight, 12);
  const sets = Number(item.sets);
  const restSeconds = Number(item.restSeconds);
  const tracking = item.tracking === "distance" ? "distance" : item.tracking === "load" ? "load" : null;
  if (!name || !exerciseNames.has(name) || !focus || !plannedReps || !defaultWeight || !tracking || !Number.isInteger(sets) || sets < 1 || sets > 20 || !Number.isInteger(restSeconds) || restSeconds < 0 || restSeconds > 600) return null;
  return { name, focus, plannedReps, defaultWeight, sets, restSeconds, tracking };
};

const serializedPlan = (plan: typeof coachTrainingPlans.$inferSelect) => ({ ...coachPlanToProgramDay(plan), testerId: plan.testerId, trainingType: plan.trainingType, scheduledDate: plan.scheduledDate, updatedAt: plan.updatedAt });

export async function GET(request: Request) {
  const denied = accessError(request);
  if (denied) return denied;
  const testerId = normalizeTesterId(new URL(request.url).searchParams.get("testerId"));
  try {
    const rows = await getDb().select().from(coachTrainingPlans).where(testerId
      ? and(eq(coachTrainingPlans.coachId, testCoachId), eq(coachTrainingPlans.testerId, testerId), eq(coachTrainingPlans.status, "active"))
      : and(eq(coachTrainingPlans.coachId, testCoachId), eq(coachTrainingPlans.status, "active")))
      .orderBy(asc(coachTrainingPlans.scheduledDate), asc(coachTrainingPlans.createdAt));
    return Response.json({ plans: rows.map(serializedPlan) }, { headers: { "cache-control": "private, no-store" } });
  } catch {
    return Response.json({ error: "Trænerplanerne kunne ikke hentes." }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}

export async function POST(request: Request) {
  const denied = accessError(request);
  if (denied) return denied;
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const testerId = normalizeTesterId(payload?.testerId);
  const title = cleanText(payload?.title, 80);
  const focus = cleanText(payload?.focus, 180);
  const scheduledDate = typeof payload?.scheduledDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(payload.scheduledDate) ? payload.scheduledDate : null;
  const trainingType = payload?.trainingType === "swim" ? "swim" : payload?.trainingType === "strength" ? "strength" : null;
  const rawExercises = Array.isArray(payload?.exercises) ? payload.exercises : [];
  const exercises = rawExercises.map(cleanExercise);
  if (!testerId || !title || !focus || !scheduledDate || !trainingType || rawExercises.length < 1 || rawExercises.length > 20 || exercises.some((exercise) => !exercise)) {
    return Response.json({ error: "Udfyld titel, dato og 1–20 gyldige øvelser." }, { status: 400 });
  }
  const db = getDb();
  try {
    const [assignment] = await db.select({ id: coachAthleteAssignments.id }).from(coachAthleteAssignments).where(and(eq(coachAthleteAssignments.coachId, testCoachId), eq(coachAthleteAssignments.testerId, testerId))).limit(1);
    if (!assignment) return Response.json({ error: "Tildel atleten til træneren først." }, { status: 403 });
    const requestedId = cleanText(payload?.id, 80);
    const duration = Math.min(120, Math.max(25, Math.round((exercises as CoachPlanExercise[]).reduce((sum, exercise) => sum + exercise.sets * (exercise.restSeconds + 45), 0) / 60)));
    if (requestedId) {
      const [existing] = await db.select({ id: coachTrainingPlans.id }).from(coachTrainingPlans).where(and(eq(coachTrainingPlans.id, requestedId), eq(coachTrainingPlans.coachId, testCoachId), eq(coachTrainingPlans.testerId, testerId))).limit(1);
      if (!existing) return Response.json({ error: "Trænerpasset findes ikke." }, { status: 404 });
      await db.update(coachTrainingPlans).set({ title, focus, scheduledDate, trainingType, duration, exercises: JSON.stringify(exercises), status: "active", updatedAt: sql`CURRENT_TIMESTAMP` }).where(eq(coachTrainingPlans.id, requestedId));
      const [updated] = await db.select().from(coachTrainingPlans).where(eq(coachTrainingPlans.id, requestedId)).limit(1);
      return Response.json({ plan: serializedPlan(updated) }, { headers: { "cache-control": "no-store" } });
    }
    const id = `coach-${crypto.randomUUID()}`;
    await db.insert(coachTrainingPlans).values({ id, coachId: testCoachId, testerId, title, focus, scheduledDate, trainingType, duration, exercises: JSON.stringify(exercises) });
    const [created] = await db.select().from(coachTrainingPlans).where(eq(coachTrainingPlans.id, id)).limit(1);
    return Response.json({ plan: serializedPlan(created) }, { status: 201, headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ error: "Trænerpasset kunne ikke gemmes." }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}

export async function DELETE(request: Request) {
  const denied = accessError(request);
  if (denied) return denied;
  const id = cleanText(new URL(request.url).searchParams.get("id"), 80);
  if (!id) return Response.json({ error: "Vælg et gyldigt trænerpas." }, { status: 400 });
  try {
    await getDb().update(coachTrainingPlans).set({ status: "archived", updatedAt: sql`CURRENT_TIMESTAMP` }).where(and(eq(coachTrainingPlans.id, id), eq(coachTrainingPlans.coachId, testCoachId)));
    return Response.json({ removed: true }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ error: "Trænerpasset kunne ikke fjernes." }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
