import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { coachTrainingPlans, testParticipants, trainingSessions, trainingSetLogs } from "../../../db/schema";
import { coachPlanToProgramDay } from "../../../lib/coach-plans";
import { countProgramSets } from "../../program-data";
import { getTrainingProgram } from "../../swim-program-data";
import { getTesterId } from "../../../lib/tester-session";
import { buildLoadSuggestion, type TechniqueQuality } from "../../../lib/training-analytics";
import { parseSessionExercises } from "../../../lib/session-exercises";
import { exerciseLibrary } from "../../exercise-data";
import { definitionToSessionExercise } from "../../exercise-alternatives";

type TrainingPayload = {
  action?: "start" | "log_set" | "customize";
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
  exerciseNames?: string[];
  exerciseSets?: number[];
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

    const initialPlannedSets = countProgramSets(program);
    const sessionId = crypto.randomUUID();

    await db.insert(trainingSessions).values({
      id: sessionId,
      testerId,
      programId: program.programId,
      plannedSets: initialPlannedSets,
    }).onConflictDoNothing();

    const [session] = await db
      .select()
      .from(trainingSessions)
      .where(and(eq(trainingSessions.testerId, testerId), eq(trainingSessions.programId, program.programId)))
      .limit(1);

    if (!session) throw new Error("SESSION_NOT_CREATED");

    const plannedSets = session.plannedSets;
    const sessionExercises = parseSessionExercises(session.customExercises, program.exercises);

    if (payload.action === "start") {
      const sets = await sessionSetLogs(session.id);
      return Response.json({
        programId: session.programId,
        status: session.status,
        completedSets: session.completedSets,
        plannedSets: session.plannedSets,
        exercises: sessionExercises,
        sets,
      });
    }

    if (payload.action === "customize") {
      const names = payload.exerciseNames;
      const requestedSets = payload.exerciseSets;
      if (!Array.isArray(names) || names.length === 0 || names.length > 12 || names.some((name) => typeof name !== "string" || name.length > 120)) {
        return Response.json({ error: "Vælg mellem 1 og 12 gyldige øvelser." }, { status: 400 });
      }
      if (!Array.isArray(requestedSets) || requestedSets.length !== names.length || requestedSets.some((sets) => !Number.isInteger(sets) || sets < 1 || sets > 20)) {
        return Response.json({ error: "Hver øvelse skal have mellem 1 og 20 sæt." }, { status: 400 });
      }
      const definitions = new Map(exerciseLibrary
        .filter((exercise) => exercise.visibility !== "coach_only" && (!exercise.sports?.length || exercise.sports.includes(participant.trainingProfile!)))
        .map((exercise) => [exercise.name, exercise]));
      const customized = names.map((name, index) => {
        const existing = sessionExercises[index];
        if (existing?.name === name) return { ...existing, sets: requestedSets[index], detail: existing.detail.replace(/^\d+\s*×/, `${requestedSets[index]} ×`) };
        const definition = definitions.get(name);
        return definition ? { ...definitionToSessionExercise(definition), sets: requestedSets[index] } : null;
      });
      if (customized.some((exercise) => !exercise)) {
        return Response.json({ error: "En af øvelserne findes ikke i biblioteket." }, { status: 400 });
      }
      const loggedSets = await sessionSetLogs(session.id);
      const changesLoggedExercise = loggedSets.some((log) => customized[log.exerciseIndex]?.name !== sessionExercises[log.exerciseIndex]?.name || log.setIndex >= (customized[log.exerciseIndex]?.sets ?? 0));
      if (changesLoggedExercise) {
        return Response.json({ error: "En øvelse med gemte sæt kan ikke udskiftes." }, { status: 409 });
      }
      const exercises = customized as typeof sessionExercises;
      const customizedPlannedSets = exercises.reduce((total, exercise) => total + exercise.sets, 0);
      const completedSets = loggedSets.length;
      const status = completedSets >= customizedPlannedSets ? "completed" : "active";
      await db.update(trainingSessions).set({
        customExercises: JSON.stringify(exercises),
        plannedSets: customizedPlannedSets,
        completedSets,
        status,
        completedAt: status === "completed" ? sql`CURRENT_TIMESTAMP` : null,
      }).where(eq(trainingSessions.id, session.id));
      return Response.json({ programId: session.programId, status, completedSets, plannedSets: customizedPlannedSets, exercises, sets: loggedSets });
    }

    if (payload.action !== "log_set") {
      return Response.json({ error: "Vælg en gyldig handling." }, { status: 400 });
    }

    const exerciseIndex = payload.exerciseIndex;
    const setIndex = payload.setIndex;
    const plannedExercise = Number.isInteger(exerciseIndex) ? sessionExercises[exerciseIndex as number] : undefined;
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
