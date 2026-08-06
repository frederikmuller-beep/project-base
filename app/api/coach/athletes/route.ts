import { asc } from "drizzle-orm";
import { getDb } from "../../../../db";
import { testParticipants, trainingSessions, trainingSetLogs } from "../../../../db/schema";
import { hasPrivateAccess, getPrivateAccessSecret } from "../../../../lib/private-access";
import { getProgram } from "../../../program-data";
import { getSwimProgram, swimProfileLabel } from "../../../swim-program-data";

export async function GET(request: Request) {
  if (!getPrivateAccessSecret("BASE_COACH_KEY")) {
    return Response.json({ error: "Træneradgangen er ikke konfigureret endnu." }, { status: 503 });
  }
  if (!hasPrivateAccess(request, "BASE_COACH_KEY")) {
    return Response.json({ error: "Forkert trænernøgle." }, {
      status: 401,
      headers: { "cache-control": "no-store", "www-authenticate": "Bearer" },
    });
  }

  try {
    const db = getDb();
    const [participants, sessions, setLogs] = await Promise.all([
      db.select().from(testParticipants).orderBy(asc(testParticipants.testerId)),
      db.select().from(trainingSessions).orderBy(asc(trainingSessions.startedAt)),
      db.select().from(trainingSetLogs).orderBy(asc(trainingSetLogs.exerciseIndex), asc(trainingSetLogs.setIndex)),
    ]);

    const participantIds = new Set([
      ...participants.map((participant) => participant.testerId),
      ...sessions.map((session) => session.testerId),
    ]);
    const logsBySession = new Map<string, typeof setLogs>();
    for (const setLog of setLogs) {
      const current = logsBySession.get(setLog.sessionId) ?? [];
      current.push(setLog);
      logsBySession.set(setLog.sessionId, current);
    }

    const athletes = [...participantIds].sort((left, right) => left.localeCompare(right, "da")).map((testerId) => {
      const athleteSessions = sessions
        .filter((session) => session.testerId === testerId)
        .sort((left, right) => right.startedAt.localeCompare(left.startedAt))
        .map((session) => {
          const program = getSwimProgram(session.programId) ?? getProgram(session.programId);
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
            sets: (logsBySession.get(session.id) ?? []).map((setLog) => ({
              exerciseName: program?.exercises[setLog.exerciseIndex]?.name ?? `Øvelse ${setLog.exerciseIndex + 1}`,
              setNumber: setLog.setIndex + 1,
              weight: setLog.weight,
              reps: setLog.reps,
              rpe: setLog.rpe,
              loggedAt: setLog.loggedAt,
            })),
          };
        });
      const lastSeenAt = participants.find((participant) => participant.testerId === testerId)?.lastSeenAt ?? null;
      const lastTrainingAt = athleteSessions[0]?.completedAt ?? athleteSessions[0]?.startedAt ?? null;
      return {
        testerId,
        trainingProfile: participants.find((participant) => participant.testerId === testerId)?.trainingProfile ?? null,
        trainingProfileLabel: swimProfileLabel(participants.find((participant) => participant.testerId === testerId)?.trainingProfile),
        lastActiveAt: [lastSeenAt, lastTrainingAt].filter(Boolean).sort().at(-1) ?? null,
        sessionsStarted: athleteSessions.length,
        sessionsCompleted: athleteSessions.filter((session) => session.status === "completed").length,
        setsLogged: athleteSessions.reduce((total, session) => total + session.sets.length, 0),
        sessions: athleteSessions,
      };
    });

    athletes.sort((left, right) => (right.lastActiveAt ?? "").localeCompare(left.lastActiveAt ?? ""));
    return Response.json({ athletes }, {
      headers: { "cache-control": "private, no-store, max-age=0", "x-content-type-options": "nosniff" },
    });
  } catch {
    return Response.json({ error: "Atletdata kunne ikke hentes." }, {
      status: 500,
      headers: { "cache-control": "no-store" },
    });
  }
}
