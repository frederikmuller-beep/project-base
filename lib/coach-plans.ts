import type { ProgramDay, SessionExercise } from "../app/program-data";

export type CoachPlanExercise = {
  name: string;
  focus: string;
  sets: number;
  plannedReps: string;
  defaultWeight: string;
  tracking: "load" | "distance";
  restSeconds: number;
};

export type CoachPlanRecord = {
  id: string;
  testerId: string;
  title: string;
  focus: string;
  scheduledDate: string;
  trainingType: "strength" | "swim";
  duration: number;
  exercises: string;
};

export const parseCoachPlanExercises = (value: string): CoachPlanExercise[] => {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CoachPlanExercise => {
      if (!item || typeof item !== "object") return false;
      const exercise = item as Partial<CoachPlanExercise>;
      return typeof exercise.name === "string" && typeof exercise.focus === "string"
        && Number.isInteger(exercise.sets) && (exercise.sets ?? 0) > 0
        && typeof exercise.plannedReps === "string" && typeof exercise.defaultWeight === "string"
        && (exercise.tracking === "load" || exercise.tracking === "distance")
        && Number.isInteger(exercise.restSeconds) && (exercise.restSeconds ?? -1) >= 0;
    });
  } catch {
    return [];
  }
};

export const coachPlanToProgramDay = (plan: CoachPlanRecord): ProgramDay => {
  const exercises = parseCoachPlanExercises(plan.exercises);
  const date = new Date(`${plan.scheduledDate}T12:00:00`);
  const day = Number.isNaN(date.getTime()) ? "TRÆNERPAS" : date.toLocaleDateString("da-DK", { weekday: "long" }).toLocaleUpperCase("da-DK");
  const dateLabel = Number.isNaN(date.getTime()) ? plan.scheduledDate : date.toLocaleDateString("da-DK", { day: "numeric", month: "short" }).toLocaleUpperCase("da-DK");
  return {
    programId: plan.id,
    week: 1,
    day,
    date: dateLabel,
    status: "planned",
    title: plan.title,
    focus: plan.focus,
    duration: plan.duration,
    intensity: plan.trainingType === "swim" ? "Vandpas" : "Trænerplan",
    distanceMeters: exercises.reduce((sum, exercise) => exercise.tracking === "distance" ? sum + exercise.sets * (Number.parseFloat(exercise.plannedReps) || 0) : sum, 0),
    exercises: exercises.map((exercise): SessionExercise => ({
      ...exercise,
      detail: exercise.tracking === "distance"
        ? `${exercise.sets} × ${exercise.plannedReps} · ${exercise.restSeconds} sek pause`
        : `${exercise.sets} × ${exercise.plannedReps} · ${exercise.defaultWeight} kg · ${exercise.restSeconds} sek pause`,
    })),
  };
};
