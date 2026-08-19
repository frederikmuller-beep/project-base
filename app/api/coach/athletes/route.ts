import { and, asc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../../db";
import { coachAthleteAssignments, coachTrainingPlans, testParticipants, trainingSessions, trainingSetLogs } from "../../../../db/schema";
import { coachPlanToProgramDay } from "../../../../lib/coach-plans";
import { hasPrivateAccess, getPrivateAccessSecret } from "../../../../lib/private-access";
import { normalizeTesterId } from "../../../../lib/tester-session";
import { parseEffortRepCount } from "../../../../lib/training-analytics";
import { getTrainingProgram, swimProfileLabel, type TrainingProfile } from "../../../swim-program-data";

const testCoachId = "test-coach-1";

const accessError = (request: Request) => {
  if (!getPrivateAccessSecret("BASE_COACH_KEY")) {
    return Response.json({ error: "Træneradgangen er ikke konfigureret endnu." }, { status: 503 });
  }
  if (!hasPrivateAccess(request, "BASE_COACH_KEY")) {
    return Response.json({ error: "Forkert trænernøgle." }, {
      status: 401,
      headers: { "cache-control": "no-store", "www-authenticate": "Bearer" },
    });
  }
  return null;
};

export async function GET(request: Request) {
  const denied = accessError(request);
  if (denied) return denied;

  try {
    const db = getDb();
    const assignments = await db.select().from(coachAthleteAssignments)
      .where(eq(coachAthleteAssignments.coachId, testCoachId))
      .orderBy(asc(coachAthleteAssignments.assignedAt));
    const participantIds = assignments.map((assignment) => assignment.testerId);
    const [allParticipants, sessions, customPlans] = await Promise.all([
      db.select().from(testParticipants).orderBy(asc(testParticipants.lastSeenAt)),
      participantIds.length === 0 ? Promise.resolve([]) : db.select().from(trainingSessions).where(inArray(trainingSessions.testerId, participantIds)).orderBy(asc(trainingSessions.startedAt)),
      db.select().from(coachTrainingPlans).where(eq(coachTrainingPlans.coachId, testCoachId)),
    ]);
    const participants = allParticipants.filter((participant) => participantIds.includes(participant.testerId));
    const customPrograms = new Map(customPlans.map((plan) => [plan.id, coachPlanToProgramDay(plan)]));
    const sessionIds = sessions.map((session) => session.id);
    const setLogs = sessionIds.length === 0 ? [] : await db.select().from(trainingSetLogs)
      .where(inArray(trainingSetLogs.sessionId, sessionIds))
      .orderBy(asc(trainingSetLogs.exerciseIndex), asc(trainingSetLogs.setIndex));
    const logsBySession = new Map<string, typeof setLogs>();
    for (const setLog of setLogs) {
      const current = logsBySession.get(setLog.sessionId) ?? [];
      current.push(setLog);
      logsBySession.set(setLog.sessionId, current);
    }

    const athletes = participantIds.map((testerId) => {
      const trainingProfile = participants.find((participant) => participant.testerId === testerId)?.trainingProfile ?? null;
      let strengthVolumeKg = 0;
      let distanceMeters = 0;
      const athleteSessions = sessions
        .filter((session) => session.testerId === testerId)
        .sort((left, right) => right.startedAt.localeCompare(left.startedAt))
        .map((session) => {
          const program = customPrograms.get(session.programId) ?? (trainingProfile ? getTrainingProgram(trainingProfile as TrainingProfile, session.programId) : undefined);
          const sessionLogs = logsBySession.get(session.id) ?? [];
          for (const setLog of sessionLogs) {
            const exercise = program?.exercises[setLog.exerciseIndex];
            if (exercise?.tracking === "distance") distanceMeters += Number.parseFloat(setLog.reps) || 0;
            else strengthVolumeKg += (Number.parseFloat(setLog.weight) || 0) * parseEffortRepCount(setLog.reps);
          }
          return {
            id: session.id,
            programId: session.programId,
            title: program?.title ?? session.programId,
            date: program?.date ?? null,
            status: session.status,
            plannedSets: session.plannedSets,
            completedSets: session.completedSets,
            startedAt: session.startedAt,
            completedAt: session.completedAt,
            sets: sessionLogs.map((setLog) => ({
              exerciseName: program?.exercises[setLog.exerciseIndex]?.name ?? `Øvelse ${setLog.exerciseIndex + 1}`,
              setNumber: setLog.setIndex + 1,
              weight: setLog.weight,
              reps: setLog.reps,
              rpe: setLog.rpe,
              effortMetric: setLog.effortMetric,
              techniqueQuality: setLog.techniqueQuality,
              loggedAt: setLog.loggedAt,
            })),
          };
        });
      const lastSeenAt = participants.find((participant) => participant.testerId === testerId)?.lastSeenAt ?? null;
      const lastTrainingAt = athleteSessions[0]?.completedAt ?? athleteSessions[0]?.startedAt ?? null;
      return {
        testerId,
        trainingProfile,
        trainingProfileLabel: swimProfileLabel(trainingProfile),
        lastActiveAt: [lastSeenAt, lastTrainingAt].filter(Boolean).sort().at(-1) ?? null,
        sessionsStarted: athleteSessions.length,
        sessionsCompleted: athleteSessions.filter((session) => session.status === "completed").length,
        setsLogged: athleteSessions.reduce((total, session) => total + session.sets.length, 0),
        strengthVolumeKg: Math.round(strengthVolumeKg),
        distanceMeters: Math.round(distanceMeters),
        sessions: athleteSessions,
      };
    });

    athletes.sort((left, right) => (right.lastActiveAt ?? "").localeCompare(left.lastActiveAt ?? ""));
    const availableAthletes = allParticipants.filter((participant) => !participantIds.includes(participant.testerId) && participant.trainingProfile).map((participant) => ({
      testerId: participant.testerId,
      trainingProfile: participant.trainingProfile,
      trainingProfileLabel: swimProfileLabel(participant.trainingProfile),
      lastActiveAt: participant.lastSeenAt,
    })).sort((left, right) => right.lastActiveAt.localeCompare(left.lastActiveAt));
    return Response.json({ athletes, availableAthletes }, {
      headers: { "cache-control": "private, no-store, max-age=0", "x-content-type-options": "nosniff" },
    });
  } catch {
    return Response.json({ error: "Atletdata kunne ikke hentes." }, {
      status: 500,
      headers: { "cache-control": "no-store" },
    });
  }
}

export async function POST(request: Request) {
  const denied = accessError(request);
  if (denied) return denied;
  const payload = (await request.json().catch(() => null)) as { testerId?: string } | null;
  const testerId = normalizeTesterId(payload?.testerId);
  if (!testerId) return Response.json({ error: "Indtast et gyldigt tester-ID." }, { status: 400 });
  try {
    const db = getDb();
    const [participant] = await db.select({ testerId: testParticipants.testerId }).from(testParticipants).where(eq(testParticipants.testerId, testerId)).limit(1);
    if (!participant) return Response.json({ error: "Testprofilen findes ikke." }, { status: 404 });
    await db.insert(coachAthleteAssignments).values({ coachId: testCoachId, testerId }).onConflictDoNothing();
    return Response.json({ assigned: true, testerId }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ error: "Atleten kunne ikke tildeles." }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}

export async function DELETE(request: Request) {
  const denied = accessError(request);
  if (denied) return denied;
  const testerId = normalizeTesterId(new URL(request.url).searchParams.get("testerId"));
  if (!testerId) return Response.json({ error: "Vælg et gyldigt tester-ID." }, { status: 400 });
  try {
    await getDb().delete(coachAthleteAssignments).where(and(
      eq(coachAthleteAssignments.coachId, testCoachId),
      eq(coachAthleteAssignments.testerId, testerId),
    ));
    return Response.json({ removed: true, testerId }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ error: "Tildelingen kunne ikke fjernes." }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
