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

export type ExerciseHistorySet = {
  setIndex: number;
  weight: string;
  reps: string;
  rir: string;
  techniqueQuality: TechniqueQuality | null;
};

export type ExerciseHistorySession = {
  programId: string;
  title: string;
  date: string;
  plannedSets: number;
  sets: ExerciseHistorySet[];
};

export type HistoricalLoadRecommendation = {
  decision: "increase" | "hold" | "decrease" | "planned";
  proposedWeight: number;
  previousWeight: number | null;
  headline: string;
  reasons: string[];
};

export const majorStrengthLifts = [
  { id: "clean", label: "Clean", exerciseNames: ["Clean"] },
  { id: "power-clean", label: "Power clean", exerciseNames: ["Power clean"] },
  { id: "jerk", label: "Jerk", exerciseNames: ["Jerk"] },
  { id: "clean-and-jerk", label: "Clean & Jerk", exerciseNames: ["Clean & Jerk", "Clean + Jerk", "Clean+Jerk"] },
  { id: "snatch", label: "Snatch", exerciseNames: ["Snatch"] },
  { id: "power-snatch", label: "Power snatch", exerciseNames: ["Power snatch"] },
  { id: "front-squat", label: "Front squat", exerciseNames: ["Front squat"] },
  { id: "squat", label: "Squat", exerciseNames: ["Back squat", "Squat"] },
  { id: "deadlift", label: "Dødløft", exerciseNames: ["Dødløft", "Deadlift"] },
  { id: "bench-press", label: "Bænkpres", exerciseNames: ["Bænkpres", "Bench press"] },
  { id: "overhead-press", label: "Overhead press", exerciseNames: ["Overhead press", "Strict press"] },
] as const;

export type MajorStrengthLift = (typeof majorStrengthLifts)[number];

const normalizeExerciseName = (value: string) => value.trim().toLocaleLowerCase("da-DK").replaceAll("&", "+").replace(/\s*\+\s*/g, "+");

export const majorLiftForExercise = (exerciseName: string): MajorStrengthLift | null => {
  const normalized = normalizeExerciseName(exerciseName);
  return majorStrengthLifts.find((lift) => lift.exerciseNames.some((name) => normalizeExerciseName(name) === normalized)) ?? null;
};

export type StrengthExerciseMetric = {
  id: MajorStrengthLift["id"];
  exercise: string;
  currentEstimated1Rm: number | null;
  bestEstimated1Rm: number | null;
  relativeIndex: number | null;
  changePercent: number | null;
  points: Array<{ label: string; estimated1Rm: number; relativeIndex: number }>;
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
  strengthExercises: StrengthExerciseMetric[];
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

const roundTrainingWeight = (weight: number) => {
  const increment = increaseForWeight(weight);
  return Math.max(0, Math.round(weight / increment) * increment);
};

export const buildHistoricalLoadRecommendation = ({
  plannedWeight,
  history,
}: {
  plannedWeight: number;
  history: ExerciseHistorySession[];
}): HistoricalLoadRecommendation => {
  const previous = history[0];
  const validSets = previous?.sets.filter((set) => Number.parseFloat(set.weight) > 0) ?? [];
  if (!previous || validSets.length === 0) {
    return {
      decision: "planned",
      proposedWeight: roundTrainingWeight(plannedWeight),
      previousWeight: null,
      headline: "Start med den planlagte vægt",
      reasons: ["Der er endnu ingen tidligere sæt i denne øvelse"],
    };
  }

  const latestWeight = Number.parseFloat(validSets.at(-1)!.weight);
  const completedPrescription = validSets.length >= previous.plannedSets;
  const rirValues = validSets.map((set) => Number.parseFloat(set.rir)).filter(Number.isFinite);
  const averageRir = rirValues.length > 0 ? rirValues.reduce((sum, value) => sum + value, 0) / rirValues.length : null;
  const techniquePoor = validSets.some((set) => set.techniqueQuality === "poor");
  const techniqueGood = validSets.length >= 2 && validSets.every((set) => set.techniqueQuality === "good");
  const increment = increaseForWeight(latestWeight);

  if (techniquePoor || (averageRir !== null && averageRir < 1.5)) {
    return {
      decision: "decrease",
      proposedWeight: roundTrainingWeight(Math.max(0, latestWeight - increment)),
      previousWeight: latestWeight,
      headline: "BASE foreslår en lidt lavere startvægt",
      reasons: [
        techniquePoor ? "Teknikken var ikke god i mindst ét tidligere sæt" : "Den seneste træning lå under 1,5 RIR i gennemsnit",
        `${validSets.length} af ${previous.plannedSets} sæt blev registreret sidst`,
      ],
    };
  }

  if (completedPrescription && techniqueGood && averageRir !== null && averageRir >= 3) {
    return {
      decision: "increase",
      proposedWeight: roundTrainingWeight(latestWeight + increment),
      previousWeight: latestWeight,
      headline: "BASE foreslår en forsigtig stigning",
      reasons: [
        `Alle ${previous.plannedSets} planlagte sæt blev gennemført`,
        `${averageRir.toLocaleString("da-DK", { maximumFractionDigits: 1 })} RIR i gennemsnit og god teknik`,
      ],
    };
  }

  return {
    decision: "hold",
    proposedWeight: roundTrainingWeight(latestWeight),
    previousWeight: latestWeight,
    headline: "BASE foreslår samme startvægt som sidst",
    reasons: [
      completedPrescription ? "Den seneste træning blev gennemført uden et tydeligt signal til stigning" : `${validSets.length} af ${previous.plannedSets} sæt blev gennemført sidst`,
      averageRir === null ? "RIR-data var ikke komplette" : `${averageRir.toLocaleString("da-DK", { maximumFractionDigits: 1 })} RIR i gennemsnit`,
    ],
  };
};

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
