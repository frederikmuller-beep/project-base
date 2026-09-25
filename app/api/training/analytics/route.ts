import { asc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../../db";
import { coachTrainingPlans, testParticipants, trainingSessions, trainingSetLogs } from "../../../../db/schema";
import { coachPlanToProgramDay } from "../../../../lib/coach-plans";
import {
  calculateActualWorkload,
  calculatePlannedWorkload,
  estimatedOneRepMax,
  majorLiftForExercise,
  majorStrengthLifts,
  parseEffortRepCount,
  parseRepCount,
  type AnalyticsSetLog,
  type AthleteDashboardData,
} from "../../../../lib/training-analytics";
import { getTesterId } from "../../../../lib/tester-session";
import { parseSessionExercises } from "../../../../lib/session-exercises";
import { getTrainingPlan, getTrainingProgram } from "../../../swim-program-data";

const unavailableMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  return message.includes("no such table") || message.includes("D1 binding");
};

const bodybuildingMuscleGroups = [
  { id: "chest", label: "Bryst", pattern: /bænkpres|bench press|cable fly|pec deck|chest press|dips/i },
  { id: "back", label: "Ryg", pattern: /pull-up|pulldown|row|straight-arm/i },
  { id: "quads", label: "Quadriceps", pattern: /back squat|front squat|hack squat|leg press|leg extension/i },
  { id: "posterior", label: "Baglår & balder", pattern: /romanian|hip thrust|split squat|leg curl/i },
  { id: "shoulders", label: "Skuldre", pattern: /shoulder press|lateral raise|reverse pec deck|face pull/i },
  { id: "biceps", label: "Biceps", pattern: /curl/i },
  { id: "triceps", label: "Triceps", pattern: /triceps extension/i },
  { id: "calves", label: "Læg", pattern: /calf raise/i },
  { id: "core", label: "Core", pattern: /crunch|plank|dead bug|ab wheel/i },
] as const;

const bodybuildingGroupFor = (exerciseName: string) => bodybuildingMuscleGroups.find((group) => group.pattern.test(exerciseName));

const enduranceProfiles = new Set(["long_distance", "middle_distance", "sprint", "running", "cycling", "skiing", "triathlon", "ironman"]);
const teamProfiles = new Set(["american_football", "football", "handball"]);
const hybridProfiles = new Set(["athletics", "hyrox", "crossfit"]);
const strengthProfiles = new Set(["weightlifting", "powerlifting"]);
const formatMeters = (meters: number) => meters >= 1000 ? `${(meters / 1000).toLocaleString("da-DK", { maximumFractionDigits: 1 })} km` : `${Math.round(meters).toLocaleString("da-DK")} m`;

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
    const staticPrograms = getTrainingPlan(participant.trainingProfile);
    const activeCoachProgramIds = new Set(coachRows.filter((row) => row.status === "active").map((row) => row.id));
    const expectedPrograms = [...staticPrograms.filter((program) => program.programId && program.exercises.length > 0), ...coachPrograms.filter((program) => program.programId && activeCoachProgramIds.has(program.programId) && program.exercises.length > 0)];

    const sessionData = sessions.flatMap((session) => {
      const program = getTrainingProgram(participant.trainingProfile, session.programId);
      const resolvedProgram = program ?? coachProgramMap.get(session.programId);
      if (!resolvedProgram) return [];
      return [{
        session,
        program: { ...resolvedProgram, exercises: parseSessionExercises(session.customExercises, resolvedProgram.exercises) },
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
        const majorLift = majorLiftForExercise(exercise.name);
        if (!majorLift) continue;
        const estimate = estimatedOneRepMax(Number.parseFloat(log.weight) || 0, parseEffortRepCount(log.reps), Number.parseFloat(log.rpe) || 0);
        if (estimate <= 0) continue;
        const current = bestInSession.get(majorLift.id);
        if (!current || estimate > current.estimated1Rm) bestInSession.set(majorLift.id, { estimated1Rm: estimate, loggedAt: log.loggedAt ?? "" });
      }
      for (const [exercise, point] of bestInSession) {
        const list = strengthByExercise.get(exercise) ?? [];
        list.push({ label: `Pas ${list.length + 1}`, ...point });
        strengthByExercise.set(exercise, list);
      }
    }
    const strengthExercises: AthleteDashboardData["strengthExercises"] = majorStrengthLifts.map((lift) => {
      const rawPoints = strengthByExercise.get(lift.id) ?? [];
      if (rawPoints.length === 0) return {
        id: lift.id,
        exercise: lift.label,
        currentEstimated1Rm: null,
        bestEstimated1Rm: null,
        relativeIndex: null,
        changePercent: null,
        points: [],
      };
      const baseline = rawPoints[0].estimated1Rm;
      const points = rawPoints.map((point) => ({
        label: point.label,
        estimated1Rm: Math.round(point.estimated1Rm * 10) / 10,
        relativeIndex: Math.round((point.estimated1Rm / baseline) * 100),
      }));
      const current = rawPoints.at(-1)!.estimated1Rm;
      return {
        id: lift.id,
        exercise: lift.label,
        currentEstimated1Rm: Math.round(current * 10) / 10,
        bestEstimated1Rm: Math.round(Math.max(...rawPoints.map((point) => point.estimated1Rm)) * 10) / 10,
        relativeIndex: Math.round((current / baseline) * 100),
        changePercent: Math.round(((current / baseline - 1) * 100) * 10) / 10,
        points,
      };
    });

    const bodybuilding = participant.trainingProfile === "bodybuilding" ? (() => {
      const completedProgramIds = new Set(sessions.filter((session) => session.status === "completed").map((session) => session.programId));
      const currentWeek = Array.from({ length: 12 }, (_, index) => index + 1).find((week) =>
        staticPrograms.some((program) => program.week === week && program.programId && !completedProgramIds.has(program.programId)),
      ) ?? 12;
      const weekPrograms = staticPrograms.filter((program) => program.week === currentWeek && program.programId && program.exercises.length > 0);
      const weekSessionData = sessionData.filter(({ program }) => program.week === currentWeek);
      const plannedByGroup = new Map<string, number>();
      const completedByGroup = new Map<string, number>();
      for (const program of weekPrograms) {
        for (const exercise of program.exercises) {
          const group = bodybuildingGroupFor(exercise.name);
          if (group) plannedByGroup.set(group.id, (plannedByGroup.get(group.id) ?? 0) + exercise.sets);
        }
      }
      for (const { program, logs: sessionLogs } of weekSessionData) {
        for (const log of sessionLogs) {
          const group = bodybuildingGroupFor(program.exercises[log.exerciseIndex]?.name ?? "");
          if (group) completedByGroup.set(group.id, (completedByGroup.get(group.id) ?? 0) + 1);
        }
      }
      const muscleGroups = bodybuildingMuscleGroups.map(({ id, label }) => ({
        id,
        label,
        plannedSets: plannedByGroup.get(id) ?? 0,
        completedSets: completedByGroup.get(id) ?? 0,
      })).filter((group) => group.plannedSets > 0);
      const completedSessions = weekPrograms.filter((program) => program.programId && completedProgramIds.has(program.programId)).length;
      const nextProgram = weekPrograms.find((program) => program.programId && !completedProgramIds.has(program.programId));
      const lowestCompletion = [...muscleGroups].sort((left, right) => (left.completedSets / left.plannedSets) - (right.completedSets / right.plannedSets))[0];
      const feedback = completedSessions === 0
        ? { headline: `Uge ${currentWeek} er klar`, detail: `Start med ${nextProgram?.title.replace("Bodybuilding · ", "") ?? "første pas"}. BASE vurderer volumen igen, når de første sæt er registreret.` }
        : completedSessions < weekPrograms.length
          ? { headline: `${completedSessions} af ${weekPrograms.length} pas er gennemført`, detail: `Fortsæt med ${nextProgram?.title.replace("Bodybuilding · ", "") ?? "næste pas"}. ${lowestCompletion?.label ?? "Den resterende volumen"} fyldes op senere i ugens split.` }
          : lowestCompletion && lowestCompletion.completedSets < lowestCompletion.plannedSets * 0.8
            ? { headline: `${lowestCompletion.label} ligger under planen`, detail: `Du har registreret ${lowestCompletion.completedSets} af ${lowestCompletion.plannedSets} planlagte arbejdssæt. BASE holder belastningen stabil og prioriterer fuldførelse før mere vægt.` }
            : { headline: "Ugens volumen er gennemført", detail: "Muskelgrupperne ligger tæt på planen. Næste progression afgøres af RIR, teknik og gennemførte sæt — ikke volumen alene." };
      return {
        currentWeek,
        phase: weekPrograms[0]?.phase ?? "Akkumulering",
        completedSessions,
        plannedSessions: weekPrograms.length,
        nextSession: nextProgram?.title.replace("Bodybuilding · ", "") ?? null,
        feedback,
        muscleGroups,
      };
    })() : undefined;

    const completedProgramIds = new Set(sessions.filter((session) => session.status === "completed").map((session) => session.programId));
    const currentWeek = Array.from({ length: 12 }, (_, index) => index + 1).find((week) =>
      staticPrograms.some((program) => program.week === week && program.programId && !completedProgramIds.has(program.programId)),
    ) ?? 12;
    const weekPrograms = staticPrograms.filter((program) => program.week === currentWeek && program.programId && program.exercises.length > 0);
    const weekSessionData = sessionData.filter(({ program }) => program.week === currentWeek);
    const completedWeekSessions = weekPrograms.filter((program) => program.programId && completedProgramIds.has(program.programId)).length;
    const nextProgram = weekPrograms.find((program) => program.programId && !completedProgramIds.has(program.programId));
    const overview: AthleteDashboardData["overview"] = {
      currentWeek,
      phase: weekPrograms[0]?.phase ?? "Træningsblok",
      completedSessions: completedWeekSessions,
      plannedSessions: weekPrograms.length,
      nextSession: nextProgram?.title ?? null,
      feedback: completedWeekSessions === 0
        ? { headline: `Uge ${currentWeek} er klar`, detail: `Start med ${nextProgram?.title ?? "ugens første pas"}. BASE vurderer udviklingen, når de første sæt er registreret.` }
        : completedWeekSessions < weekPrograms.length
          ? { headline: `${completedWeekSessions} af ${weekPrograms.length} pas er gennemført`, detail: `Fortsæt med ${nextProgram?.title ?? "næste pas"}. Planen justeres først, når der er nok data til at se en tendens.` }
          : { headline: "Ugens plan er gennemført", detail: "BASE sammenholder nu gennemførelse, intensitet og kvalitet, før næste uges anbefaling gives." },
    };

    const weekLogs = weekSessionData.flatMap(({ program, logs: sessionLogs }) => sessionLogs.map((log) => ({ exercise: program.exercises[log.exerciseIndex], log })));
    const completedLoadedSets = weekLogs.filter(({ exercise }) => exercise && exercise.tracking !== "distance").length;
    const qualityLogs = weekLogs.filter(({ log }) => log.techniqueQuality);
    const goodTechniquePercent = qualityLogs.length > 0 ? Math.round((qualityLogs.filter(({ log }) => log.techniqueQuality === "good").length / qualityLogs.length) * 100) : null;
    const plannedDistance = weekPrograms.flatMap((program) => program.exercises).reduce((total, exercise) => exercise.tracking === "distance" ? total + exercise.sets * parseRepCount(exercise.plannedReps) : total, 0);
    const actualDistance = weekLogs.reduce((total, { exercise, log }) => exercise?.tracking === "distance" ? total + parseRepCount(log.reps) : total, 0);
    const actualMinutes = Math.round(weekSessionData.reduce((total, { session }) => {
      if (!session.completedAt) return total;
      const minutes = (new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / 60000;
      return total + (Number.isFinite(minutes) ? Math.max(0, Math.min(240, minutes)) : 0);
    }, 0));
    const zoneCounts = new Map<string, number>();
    for (const { log } of weekLogs) if ((log.effortMetric ?? "rir") === "heart_rate_zone") zoneCounts.set(log.rpe, (zoneCounts.get(log.rpe) ?? 0) + 1);
    const dominantZone = [...zoneCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0];
    const powerSets = weekLogs.filter(({ exercise }) => /sprint|jump|spring|kast|throw|medicine|sled|power/i.test(exercise?.name ?? "")).length;
    const directionSets = weekLogs.filter(({ exercise }) => /retningsskift|shuttle|ladder|carioca|skater/i.test(exercise?.name ?? "")).length;
    const rotationSets = weekLogs.filter(({ exercise }) => /rotation|chop|lift|scoop/i.test(exercise?.name ?? "")).length;
    const activeWeeks = new Set(sessionData.filter(({ session }) => session.status === "completed").map(({ program }) => program.week)).size;
    const sportModule: AthleteDashboardData["sportModule"] = participant.trainingProfile === "bodybuilding" ? undefined
      : enduranceProfiles.has(participant.trainingProfile) ? {
        kind: "endurance", eyebrow: "DISTANCE & PULS", title: "Ugens udholdenhedsarbejde",
        feedback: actualDistance > 0 ? "Distance og pulszone følges sammen, så mere arbejde ikke automatisk tolkes som bedre arbejde." : "Distance vises, så snart et distancebaseret pas eller en trænerplan bliver registreret.",
        metrics: [
          { label: "Planlagt distance", value: formatMeters(plannedDistance), detail: "Denne programuge" },
          { label: "Faktisk distance", value: formatMeters(actualDistance), detail: "Registreret i udførte sæt" },
          { label: "Træningstid", value: `${actualMinutes} min`, detail: "Faktisk tid i afsluttede pas" },
          { label: "Primær pulszone", value: dominantZone ? `Zone ${dominantZone}` : "—", detail: "Baseret på registrerede intervaller" },
        ],
      } : teamProfiles.has(participant.trainingProfile) ? {
        kind: "team", eyebrow: "KAMPKAPACITET", title: "Power og retningsskift",
        feedback: "BASE holder power, retningsskift og konditionsarbejde adskilt, så træthed ikke skjuler kvaliteten i de hurtige aktioner.",
        metrics: [
          { label: "Styrkesæt", value: String(completedLoadedSets), detail: "Udførte belastede sæt" },
          { label: "Power & sprint", value: `${powerSets} sæt`, detail: "Eksplosive registreringer" },
          { label: "Retningsskift", value: `${directionSets} sæt`, detail: "Bremsning og re-acceleration" },
          { label: "Konditionsdistance", value: formatMeters(actualDistance), detail: "Udført i denne uge" },
        ],
      } : hybridProfiles.has(participant.trainingProfile) ? {
        kind: "hybrid", eyebrow: "HYBRID BELASTNING", title: "Styrke og kapacitet",
        feedback: "BASE viser styrke og kondition side om side, så den ene kvalitet ikke udvikles på bekostning af den anden.",
        metrics: [
          { label: "Styrkesæt", value: String(completedLoadedSets), detail: "Belastede sæt i denne uge" },
          { label: "Powerarbejde", value: `${powerSets} sæt`, detail: "Sprint, spring og eksplosivitet" },
          { label: "Distance", value: formatMeters(actualDistance), detail: "Konditionsarbejde" },
          { label: "Teknisk kvalitet", value: goodTechniquePercent === null ? "—" : `${goodTechniquePercent}%`, detail: "Sæt vurderet som gode" },
        ],
      } : participant.trainingProfile === "golf" ? {
        kind: "golf", eyebrow: "SLAGKRAFT & KONTROL", title: "Rotation og robusthed",
        feedback: "Rotationsarbejde vurderes sammen med styrke og teknik, så mere kraft ikke opnås på bekostning af kontrol.",
        metrics: [
          { label: "Styrkesæt", value: String(completedLoadedSets), detail: "Udført i denne uge" },
          { label: "Rotationsarbejde", value: `${rotationSets} sæt`, detail: "Kraftoverførsel og antirotation" },
          { label: "Teknisk kvalitet", value: goodTechniquePercent === null ? "—" : `${goodTechniquePercent}%`, detail: "Sæt vurderet som gode" },
          { label: "Pas gennemført", value: `${completedWeekSessions}/${weekPrograms.length}`, detail: "Ugens kontinuitet" },
        ],
      } : participant.trainingProfile === "recreational" ? {
        kind: "recreational", eyebrow: "KONTINUITET", title: "Din træningsrytme",
        feedback: "For motionisten prioriterer BASE stabil træning og sikre gentagelser før hurtige vægtstigninger.",
        metrics: [
          { label: "Aktive uger", value: String(activeWeeks), detail: "Uger med gennemførte pas" },
          { label: "Ugens pas", value: `${completedWeekSessions}/${weekPrograms.length}`, detail: "Gennemført som planlagt" },
          { label: "Arbejdssæt", value: String(completedLoadedSets), detail: "Registreret i denne uge" },
          { label: "Teknisk kvalitet", value: goodTechniquePercent === null ? "—" : `${goodTechniquePercent}%`, detail: "Sæt vurderet som gode" },
        ],
      } : strengthProfiles.has(participant.trainingProfile) ? {
        kind: "strength", eyebrow: "STYRKE & TEKNIK", title: "Kvalitet under belastning",
        feedback: "BASE foreslår først mere vægt, når gennemførte sæt, RIR og teknisk kvalitet peger i samme retning.",
        metrics: [
          { label: "Arbejdssæt", value: String(completedLoadedSets), detail: "Registreret i denne uge" },
          { label: "Faktisk intensitet", value: actual.intensityPercent === null ? "—" : `${actual.intensityPercent.toLocaleString("da-DK")} %`, detail: "Estimeret ud fra reps og RIR" },
          { label: "Teknisk kvalitet", value: goodTechniquePercent === null ? "—" : `${goodTechniquePercent}%`, detail: "Sæt vurderet som gode" },
          { label: "Pas gennemført", value: `${completedWeekSessions}/${weekPrograms.length}`, detail: "Denne programuge" },
        ],
      } : undefined;

    const data: AthleteDashboardData = {
      profile: participant.trainingProfile,
      overview,
      summary: {
        expectedVolumeKg: planned.volumeKg,
        actualVolumeKg: actual.volumeKg,
        expectedIntensityPercent: planned.intensityPercent,
        actualIntensityPercent: actual.intensityPercent,
        completedSessions: sessions.filter((session) => session.status === "completed").length,
        plannedSessions: expectedPrograms.length,
      },
      strengthExercises,
      sportModule,
      bodybuilding,
    };
    return Response.json(data, { headers: { "cache-control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: unavailableMessage(error) ? "Dashboardet er ved at blive gjort klar." : "Dashboardet kunne ikke hentes." }, { status: 500 });
  }
}
