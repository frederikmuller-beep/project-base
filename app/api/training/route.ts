import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { coachTrainingPlans, testParticipants, trainingSessions, trainingSetLogs } from "../../../db/schema";
import { coachPlanToProgramDay } from "../../../lib/coach-plans";
import { countProgramSets } from "../../program-data";
import { getTrainingProgram } from "../../swim-program-data";
import { getTesterId } from "../../../lib/tester-session";
import { buildLoadSuggestion, type TechniqueQuality } from "../../../lib/training-analytics";

type TrainingPayload = {
  action?: "start" | "log_set";
  programId?: string;
  exerciseIndex?: number;
  setIndex?: number;
  weight?: string;
  reps?: string;
  rpe?: string;
  effortMetric?: "rir" | "heart_rate_zone";
  techniqueQuality?: TechniqueQuality;
  readinessScore?: number | null;
  pain?: boolean | null;
};

const sessionSetLogs = async (sessionId: string) => getDb()
  .select({
    exerciseIndex: trainingSetLogs.exerciseIndex,
    setIndex: trainingSetLogs.setIndex,
    weight: trainingSetLogs.weight,
    reps: trainingSetLogs.reps,
    rpe: trainingSetLogs.rpe,
    effortMetric: trainingSetLogs.effortMetric,
    techniqueQuality: trainingSetLogs.techniqueQuality,
  })
  .from(trainingSetLogs)
  .where(eq(trainingSetLogs.sessionId, sessionId));

const cleanLogValue = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned.length > 0 && cleaned.length <= maxLength ? cleaned : null;
};

const unavailableMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  return message.includes("no such table") || message.includes("D1 binding");
};

async function requireTesterId() {
  const testerId = await getTesterId();
  if (!testerId) throw new Error("TESTER_REQUIRED");
  return testerId;
}

export async function GET() {
  try {
    const testerId = await requireTesterId();
    const db = getDb();
    const sessions = await db
      .select({
        programId: trainingSessions.programId,
        status: trainingSessions.status,
        completedSets: trainingSessions.completedSets,
        plannedSets: trainingSessions.plannedSets,
      })
      .from(trainingSessions)
      .where(eq(trainingSessions.testerId, testerId));

    return Response.json({ sessions });
  } catch (error) {
    if (error instanceof Error && error.message === "TESTER_REQUIRED") {
      return Response.json({ error: "Tilslut dit tester-ID først." }, { status: 401 });
    }
    return Response.json(
      { error: unavailableMessage(error) ? "Træningshistorikken er ved at blive gjort klar. Prøv igen om lidt." : "Fremdriften kunne ikke hentes." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const testerId = await requireTesterId();
    const payload = (await request.json()) as TrainingPayload;
    const db = getDb();
    const [participant] = await db.select({ trainingProfile: testParticipants.trainingProfile })
      .from(testParticipants).where(eq(testParticipants.testerId, testerId)).limit(1);
    if (!participant?.trainingProfile) {
      return Response.json({ error: "Vælg din træningsprofil før du starter passet." }, { status: 400 });
    }
    const staticProgram = payload.programId ? getTrainingProgram(participant.trainingProfile, payload.programId) : undefined;
    const [coachPlan] = payload.programId && !staticProgram
      ? await db.select().from(coachTrainingPlans).where(and(eq(coachTrainingPlans.id, payload.programId), eq(coachTrainingPlans.testerId, testerId))).limit(1)
      : [];
    const program = staticProgram ?? (coachPlan ? coachPlanToProgramDay(coachPlan) : undefined);

    const matchesProfile = Boolean(staticProgram) || Boolean(coachPlan && coachPlan.testerId === testerId);
    if (!program || !program.programId || !matchesProfile || program.exercises.length === 0) {
      return Response.json({ error: "Vælg et gyldigt planlagt pas." }, { status: 400 });
    }

    const plannedSets = countProgramSets(program);
    const sessionId = crypto.randomUUID();

    await db.insert(trainingSessions).values({
      id: sessionId,
      testerId,
      programId: program.programId,
      plannedSets,
    }).onConflictDoNothing();

    const [session] = await db
      .select()
      .from(trainingSessions)
      .where(and(eq(trainingSessions.testerId, testerId), eq(trainingSessions.programId, program.programId)))
      .limit(1);

    if (!session) throw new Error("SESSION_NOT_CREATED");

    if (payload.action === "start") {
      const sets = await sessionSetLogs(session.id);
      return Response.json({
        programId: session.programId,
        status: session.status,
        completedSets: session.completedSets,
        plannedSets: session.plannedSets,
        sets,
      });
    }

    if (payload.action !== "log_set") {
      return Response.json({ error: "Vælg en gyldig handling." }, { status: 400 });
    }

    const exerciseIndex = payload.exerciseIndex;
    const setIndex = payload.setIndex;
    const plannedExercise = Number.isInteger(exerciseIndex) ? program.exercises[exerciseIndex as number] : undefined;
    if (!plannedExercise || !Number.isInteger(setIndex) || (setIndex as number) < 0 || (setIndex as number) >= plannedExercise.sets) {
      return Response.json({ error: "Sættet findes ikke i det planlagte pas." }, { status: 400 });
    }

    const weight = cleanLogValue(payload.weight, 12);
    const reps = cleanLogValue(payload.reps, 12);
    const rpe = cleanLogValue(payload.rpe, 8);
    const effortMetric = plannedExercise.effortMetric ?? (plannedExercise.tracking === "distance" ? "heart_rate_zone" : "rir");
    if (!weight || !reps || !rpe) {
      return Response.json({ error: `Udfyld sættets data og ${effortMetric === "rir" ? "RIR" : "pulszone"} før du gemmer.` }, { status: 400 });
    }
    const effortNumber = Number(rpe);
    if (!Number.isFinite(effortNumber) || (effortMetric === "rir" ? effortNumber < 0 || effortNumber > 10 : !Number.isInteger(effortNumber) || effortNumber < 1 || effortNumber > 5)) {
      return Response.json({ error: effortMetric === "rir" ? "RIR skal være mellem 0 og 10." : "Vælg pulszone 1–5." }, { status: 400 });
    }
    const techniqueQuality = effortMetric === "rir" && (payload.techniqueQuality === "good" || payload.techniqueQuality === "uncertain" || payload.techniqueQuality === "poor")
      ? payload.techniqueQuality
      : null;
    if (effortMetric === "rir" && !techniqueQuality) {
      return Response.json({ error: "Vurdér den tekniske kvalitet før du gemmer sættet." }, { status: 400 });
    }

    await db.insert(trainingSetLogs).values({
      sessionId: session.id,
      exerciseIndex: exerciseIndex as number,
      setIndex: setIndex as number,
      weight,
      reps,
      rpe,
      effortMetric,
      techniqueQuality,
    }).onConflictDoUpdate({
      target: [trainingSetLogs.sessionId, trainingSetLogs.exerciseIndex, trainingSetLogs.setIndex],
      set: { weight, reps, rpe, effortMetric, techniqueQuality, loggedAt: sql`CURRENT_TIMESTAMP` },
    });

    const [countRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(trainingSetLogs)
      .where(eq(trainingSetLogs.sessionId, session.id));
    const completedSets = Number(countRow?.count ?? 0);
    const status = completedSets >= plannedSets ? "completed" : "active";

    await db.update(trainingSessions).set({
      completedSets,
      status,
      completedAt: status === "completed" ? sql`CURRENT_TIMESTAMP` : null,
    }).where(eq(trainingSessions.id, session.id));

    const exerciseLogs = effortMetric === "rir" ? await db.select({
      exerciseIndex: trainingSetLogs.exerciseIndex,
      setIndex: trainingSetLogs.setIndex,
      weight: trainingSetLogs.weight,
      reps: trainingSetLogs.reps,
      rpe: trainingSetLogs.rpe,
      effortMetric: trainingSetLogs.effortMetric,
      techniqueQuality: trainingSetLogs.techniqueQuality,
    }).from(trainingSetLogs).where(and(eq(trainingSetLogs.sessionId, session.id), eq(trainingSetLogs.exerciseIndex, exerciseIndex as number))) : [];
    const sparring = effortMetric === "rir" ? buildLoadSuggestion({
      currentWeight: Number.parseFloat(weight) || 0,
      recentSets: exerciseLogs.sort((a, b) => a.setIndex - b.setIndex),
      readinessScore: typeof payload.readinessScore === "number" ? payload.readinessScore : null,
      pain: typeof payload.pain === "boolean" ? payload.pain : null,
      hasRemainingSet: (setIndex as number) + 1 < plannedExercise.sets,
    }) : null;

    return Response.json({
      programId: program.programId,
      completedSets,
      plannedSets,
      status,
      savedSet: { exerciseIndex, setIndex, weight, reps, rpe, effortMetric, techniqueQuality },
      sparring,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TESTER_REQUIRED") {
      return Response.json({ error: "Tilslut dit tester-ID først." }, { status: 401 });
    }
    return Response.json(
      { error: unavailableMessage(error) ? "Træningshistorikken er ved at blive gjort klar. Prøv igen om lidt." : "Sættet kunne ikke gemmes. Prøv igen." },
      { status: 500 },
    );
  }
}
