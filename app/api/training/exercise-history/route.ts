import { asc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../../db";
import { coachTrainingPlans, testParticipants, trainingSessions, trainingSetLogs } from "../../../../db/schema";
import { coachPlanToProgramDay } from "../../../../lib/coach-plans";
import { buildHistoricalLoadRecommendation, type ExerciseHistorySession } from "../../../../lib/training-analytics";
import { getTesterId } from "../../../../lib/tester-session";
import type { ProgramDay } from "../../../program-data";
import { getTrainingProgram, trainingProfileOptions, type TrainingProfile } from "../../../swim-program-data";

const normalizeExerciseName = (value: string) => value.trim().toLocaleLowerCase("da-DK").replaceAll("&", "+").replace(/\s*\+\s*/g, "+");

const resolveStaticProgram = (preferredProfile: TrainingProfile, programId: string) => {
  const preferred = getTrainingProgram(preferredProfile, programId);
  if (preferred) return preferred;
  for (const option of trainingProfileOptions) {
    const program = getTrainingProgram(option.id, programId);
    if (program) return program;
  }
  return undefined;
};

const unavailableMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  return message.includes("no such table") || message.includes("D1 binding");
};

export async function GET(request: Request) {
  const testerId = await getTesterId();
  if (!testerId) return Response.json({ error: "Tilslut dit tester-ID først." }, { status: 401 });

  try {
    const url = new URL(request.url);
    const programId = url.searchParams.get("programId")?.trim() ?? "";
    const exerciseIndex = Number(url.searchParams.get("exerciseIndex"));
    if (!programId || !Number.isInteger(exerciseIndex) || exerciseIndex < 0) {
      return Response.json({ error: "Vælg en gyldig øvelse." }, { status: 400 });
    }

    const db = getDb();
    const [participant, coachRows, sessions] = await Promise.all([
      db.select({ trainingProfile: testParticipants.trainingProfile }).from(testParticipants).where(eq(testParticipants.testerId, testerId)).limit(1),
      db.select().from(coachTrainingPlans).where(eq(coachTrainingPlans.testerId, testerId)),
      db.select().from(trainingSessions).where(eq(trainingSessions.testerId, testerId)).orderBy(asc(trainingSessions.startedAt)),
    ]);
    const profile = participant[0]?.trainingProfile;
    if (!profile) return Response.json({ error: "Vælg din træningsprofil først." }, { status: 400 });

    const coachProgramMap = new Map(coachRows.map((row) => [row.id, coachPlanToProgramDay(row)]));
    const currentProgram = resolveStaticProgram(profile, programId) ?? coachProgramMap.get(programId);
    const currentExercise = currentProgram?.exercises[exerciseIndex];
    if (!currentProgram || !currentExercise || currentExercise.tracking === "distance") {
      return Response.json({ history: [], recommendation: null }, { headers: { "cache-control": "private, no-store" } });
    }

    const sessionIds = sessions.map((session) => session.id);
    const logs = sessionIds.length > 0
      ? await db.select().from(trainingSetLogs).where(inArray(trainingSetLogs.sessionId, sessionIds)).orderBy(asc(trainingSetLogs.loggedAt))
      : [];
    const logsBySession = new Map<string, typeof logs>();
    for (const log of logs) {
      const list = logsBySession.get(log.sessionId) ?? [];
      list.push(log);
      logsBySession.set(log.sessionId, list);
    }

    const wantedName = normalizeExerciseName(currentExercise.name);
    const history: ExerciseHistorySession[] = [];
    for (const session of sessions) {
      if (session.programId === programId) continue;
      const historicalProgram: ProgramDay | undefined = resolveStaticProgram(profile, session.programId) ?? coachProgramMap.get(session.programId);
      if (!historicalProgram) continue;
      const matchingIndexes = historicalProgram.exercises
        .map((exercise, index) => normalizeExerciseName(exercise.name) === wantedName ? index : -1)
        .filter((index) => index >= 0);
      for (const matchingIndex of matchingIndexes) {
        const exercise = historicalProgram.exercises[matchingIndex];
        const matchingLogs = (logsBySession.get(session.id) ?? [])
          .filter((log) => log.exerciseIndex === matchingIndex && (log.effortMetric ?? "rir") === "rir")
          .map((log) => ({ setIndex: log.setIndex, weight: log.weight, reps: log.reps, rir: log.rpe, techniqueQuality: log.techniqueQuality }));
        if (matchingLogs.length === 0) continue;
        history.push({
          programId: session.programId,
          title: historicalProgram.title,
          date: session.completedAt ?? session.startedAt,
          plannedSets: exercise.sets,
          sets: matchingLogs,
        });
      }
    }
    history.sort((a, b) => b.date.localeCompare(a.date));
    const recommendation = buildHistoricalLoadRecommendation({ plannedWeight: Number.parseFloat(currentExercise.defaultWeight) || 0, history });
    return Response.json({ exerciseName: currentExercise.name, history, recommendation }, { headers: { "cache-control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: unavailableMessage(error) ? "Øvelseshistorikken er ved at blive gjort klar." : "Øvelseshistorikken kunne ikke hentes." }, { status: 500 });
  }
}
