import { asc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../../db";
import { coachTrainingPlans, testParticipants, trainingSessions, trainingSetLogs } from "../../../../db/schema";
import { coachPlanToProgramDay } from "../../../../lib/coach-plans";
import {
  calculateActualWorkload,
  calculatePlannedWorkload,
  estimatedOneRepMax,
  parseEffortRepCount,
  type AnalyticsSetLog,
  type AthleteDashboardData,
} from "../../../../lib/training-analytics";
import { getTesterId } from "../../../../lib/tester-session";
import { getProgram, twoWeekPlan } from "../../../program-data";
import { getStrengthProgram, getSwimmerStrengthPlan } from "../../../strength-program-data";

const unavailableMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  return message.includes("no such table") || message.includes("D1 binding");
};

export async function GET() {
  const testerId = await getTesterId();
  if (!testerId) return Response.json({ error: "Tilslut dit tester-ID først." }, { status: 401 });

  try {
    const db = getDb();
    const [participant] = await db.select({ trainingProfile: testParticipants.trainingProfile })
      .from(testParticipants).where(eq(testParticipants.testerId, testerId)).limit(1);
    if (!participant?.trainingProfile) return Response.json({ error: "Vælg din træningsprofil først." }, { status: 400 });

    const [sessions, coachRows] = await Promise.all([
      db.select().from(trainingSessions).where(eq(trainingSessions.testerId, testerId)).orderBy(asc(trainingSessions.startedAt)),
      db.select().from(coachTrainingPlans).where(eq(coachTrainingPlans.testerId, testerId)),
    ]);
    const sessionIds = sessions.map((session) => session.id);
    const logs = sessionIds.length > 0
      ? await db.select().from(trainingSetLogs).where(inArray(trainingSetLogs.sessionId, sessionIds)).orderBy(asc(trainingSetLogs.loggedAt))
      : [];
    const coachPrograms = coachRows.map(coachPlanToProgramDay);
    const coachProgramMap = new Map(coachPrograms.map((program) => [program.programId, program]));
    const staticPrograms = participant.trainingProfile === "weightlifting" ? twoWeekPlan : getSwimmerStrengthPlan(participant.trainingProfile);
    const activeCoachProgramIds = new Set(coachRows.filter((row) => row.status === "active").map((row) => row.id));
    const expectedPrograms = [...staticPrograms.filter((program) => program.programId && program.exercises.length > 0), ...coachPrograms.filter((program) => program.programId && activeCoachProgramIds.has(program.programId) && program.exercises.length > 0)];

    const sessionData = sessions.flatMap((session) => {
      const program = participant.trainingProfile === "weightlifting" ? getProgram(session.programId) : getStrengthProgram(session.programId);
      const resolvedProgram = program ?? coachProgramMap.get(session.programId);
      if (!resolvedProgram) return [];
      return [{
        session,
        program: resolvedProgram,
        logs: logs.filter((log) => log.sessionId === session.id) as AnalyticsSetLog[],
      }];
    });
    const planned = calculatePlannedWorkload(expectedPrograms);
    const actual = calculateActualWorkload(sessionData);

    const strengthByExercise = new Map<string, Array<{ label: string; estimated1Rm: number; loggedAt: string }>>();
    for (const { program, logs: sessionLogs } of sessionData) {
      const bestInSession = new Map<string, { estimated1Rm: number; loggedAt: string }>();
      for (const log of sessionLogs) {
        const exercise = program.exercises[log.exerciseIndex];
        if (!exercise || exercise.tracking === "distance" || (log.effortMetric ?? "rir") !== "rir") continue;
        const estimate = estimatedOneRepMax(Number.parseFloat(log.weight) || 0, parseEffortRepCount(log.reps), Number.parseFloat(log.rpe) || 0);
        if (estimate <= 0) continue;
        const current = bestInSession.get(exercise.name);
        if (!current || estimate > current.estimated1Rm) bestInSession.set(exercise.name, { estimated1Rm: estimate, loggedAt: log.loggedAt ?? "" });
      }
      for (const [exercise, point] of bestInSession) {
        const list = strengthByExercise.get(exercise) ?? [];
        list.push({ label: `Pas ${list.length + 1}`, ...point });
        strengthByExercise.set(exercise, list);
      }
    }
    const primaryStrength = [...strengthByExercise.entries()].sort((a, b) => b[1].length - a[1].length || b[1].at(-1)!.loggedAt.localeCompare(a[1].at(-1)!.loggedAt))[0];
    let strength: AthleteDashboardData["strength"] = null;
    if (primaryStrength) {
      const [exercise, rawPoints] = primaryStrength;
      const baseline = rawPoints[0].estimated1Rm;
      const points = rawPoints.map((point) => ({
        label: point.label,
        estimated1Rm: Math.round(point.estimated1Rm * 10) / 10,
        relativeIndex: Math.round((point.estimated1Rm / baseline) * 100),
      }));
      const current = rawPoints.at(-1)!.estimated1Rm;
      strength = {
        exercise,
        currentEstimated1Rm: Math.round(current * 10) / 10,
        bestEstimated1Rm: Math.round(Math.max(...rawPoints.map((point) => point.estimated1Rm)) * 10) / 10,
        relativeIndex: Math.round((current / baseline) * 100),
        changePercent: Math.round(((current / baseline - 1) * 100) * 10) / 10,
        points,
      };
    }

    const data: AthleteDashboardData = {
      summary: {
        expectedVolumeKg: planned.volumeKg,
        actualVolumeKg: actual.volumeKg,
        expectedIntensityPercent: planned.intensityPercent,
        actualIntensityPercent: actual.intensityPercent,
        completedSessions: sessions.filter((session) => session.status === "completed").length,
        plannedSessions: expectedPrograms.length,
      },
      strength,
    };
    return Response.json(data, { headers: { "cache-control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: unavailableMessage(error) ? "Dashboardet er ved at blive gjort klar." : "Dashboardet kunne ikke hentes." }, { status: 500 });
  }
}
