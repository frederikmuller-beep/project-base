import type { ProgramDay, SessionExercise } from "../app/program-data";

export type TechniqueQuality = "good" | "uncertain" | "poor";

export type AnalyticsSetLog = {
  sessionId?: string;
  exerciseIndex: number;
  setIndex: number;
  weight: string;
  reps: string;
  rpe: string;
  effortMetric?: "rpe" | "rir" | "heart_rate_zone";
  techniqueQuality?: TechniqueQuality | null;
  loggedAt?: string;
};

export type WorkloadMetrics = {
  volumeKg: number;
  intensityPercent: number | null;
  loadedSets: number;
};

export type LoadSuggestion = {
  decision: "increase" | "hold";
  proposedWeight: number | null;
  deltaKg: number | null;
  headline: string;
  reasons: string[];
};

export type AthleteDashboardData = {
  summary: {
    expectedVolumeKg: number;
    actualVolumeKg: number;
    expectedIntensityPercent: number | null;
    actualIntensityPercent: number | null;
    completedSessions: number;
    plannedSessions: number;
  };
  strength: {
    exercise: string;
    currentEstimated1Rm: number;
    bestEstimated1Rm: number;
    relativeIndex: number;
    changePercent: number;
    points: Array<{ label: string; estimated1Rm: number; relativeIndex: number }>;
  } | null;
};

export const parseEffortRepCount = (value: string) =>
  value.split("+").reduce((total, part) => total + (Number.parseFloat(part) || 0), 0);

export const parseRepCount = (value: string) => {
  const base = parseEffortRepCount(value);
  return /\bpr\.\s(?:ben|arm|side)\b/i.test(value) ? base * 2 : base;
};

export const estimatedOneRepMax = (weight: number, reps: number, rir: number) =>
  weight > 0 && reps > 0 ? weight * (1 + (reps + Math.max(0, rir)) / 30) : 0;

const setIntensity = (reps: number, rir: number) => {
  const estimateFactor = 1 + (reps + Math.max(0, rir)) / 30;
  return estimateFactor > 1 ? 100 / estimateFactor : 100;
};

const plannedRir = (exercise: SessionExercise) => exercise.effortTarget?.startsWith("4") ? 5 : 3;

export const calculatePlannedWorkload = (programs: ProgramDay[]): WorkloadMetrics => {
  let volumeKg = 0;
  let intensityTotal = 0;
  let loadedSets = 0;
  for (const program of programs) {
    for (const exercise of program.exercises) {
      if (exercise.tracking === "distance") continue;
      const weight = Number.parseFloat(exercise.defaultWeight) || 0;
      const volumeReps = parseRepCount(exercise.plannedReps);
      const effortReps = parseEffortRepCount(exercise.plannedReps);
      volumeKg += exercise.sets * weight * volumeReps;
      if (weight > 0 && effortReps > 0) {
        intensityTotal += exercise.sets * setIntensity(effortReps, plannedRir(exercise));
        loadedSets += exercise.sets;
      }
    }
  }
  return {
    volumeKg: Math.round(volumeKg),
    intensityPercent: loadedSets > 0 ? Math.round((intensityTotal / loadedSets) * 10) / 10 : null,
    loadedSets,
  };
};

export const calculateActualWorkload = (sessions: Array<{ program: ProgramDay; logs: AnalyticsSetLog[] }>): WorkloadMetrics => {
  let volumeKg = 0;
  let intensityTotal = 0;
  let loadedSets = 0;
  for (const session of sessions) {
    for (const log of session.logs) {
      const exercise = session.program.exercises[log.exerciseIndex];
      if (!exercise || exercise.tracking === "distance") continue;
      const weight = Number.parseFloat(log.weight) || 0;
      const volumeReps = parseRepCount(log.reps);
      const effortReps = parseEffortRepCount(log.reps);
      volumeKg += weight * volumeReps;
      if (weight > 0 && effortReps > 0 && (log.effortMetric ?? "rir") === "rir") {
        intensityTotal += setIntensity(effortReps, Number.parseFloat(log.rpe) || 0);
        loadedSets += 1;
      }
    }
  }
  return {
    volumeKg: Math.round(volumeKg),
    intensityPercent: loadedSets > 0 ? Math.round((intensityTotal / loadedSets) * 10) / 10 : null,
    loadedSets,
  };
};

const increaseForWeight = (weight: number) => weight >= 100 ? 5 : weight >= 20 ? 2.5 : 1;

export const buildLoadSuggestion = ({
  currentWeight,
  recentSets,
  readinessScore,
  pain,
  hasRemainingSet,
}: {
  currentWeight: number;
  recentSets: AnalyticsSetLog[];
  readinessScore: number | null;
  pain: boolean | null;
  hasRemainingSet: boolean;
}): LoadSuggestion => {
  const lastTwo = recentSets.slice(-2);
  const enoughSets = lastTwo.length === 2;
  const rirReady = enoughSets && lastTwo.every((set) => (Number.parseFloat(set.rpe) || 0) >= 3);
  const techniqueReady = enoughSets && lastTwo.every((set) => set.techniqueQuality === "good");
  const readinessReady = readinessScore !== null && readinessScore >= 72;
  const painFree = pain === false;
  const eligible = hasRemainingSet && currentWeight > 0 && enoughSets && rirReady && techniqueReady && readinessReady && painFree;

  if (eligible) {
    const deltaKg = increaseForWeight(currentWeight);
    return {
      decision: "increase",
      proposedWeight: currentWeight + deltaKg,
      deltaKg,
      headline: `Du kan prøve +${String(deltaKg).replace(".", ",")} kg i næste sæt`,
      reasons: ["To sæt med mindst 3 RIR", "God teknisk kvalitet", "Grøn readiness og ingen smerte"],
    };
  }

  const reasons: string[] = [];
  if (!hasRemainingSet) reasons.push("Ingen resterende sæt i øvelsen");
  if (!enoughSets) reasons.push("BASE kræver to registrerede sæt");
  else {
    if (!rirReady) reasons.push("Mindst ét sæt havde under 3 RIR");
    if (!techniqueReady) reasons.push("Teknikken var ikke godkendt i begge sæt");
  }
  if (!readinessReady) reasons.push(readinessScore === null ? "Readiness-tjek mangler" : "Readiness er ikke grøn");
  if (!painFree) reasons.push(pain === null ? "Smerte-status mangler" : "Smerte er registreret");
  return { decision: "hold", proposedWeight: null, deltaKg: null, headline: "Behold den planlagte belastning", reasons };
};
