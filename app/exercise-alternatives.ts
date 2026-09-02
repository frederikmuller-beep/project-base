import { exerciseLibrary, type ExerciseDefinition } from "./exercise-data";
import type { SessionExercise } from "./program-data";
import type { TrainingProfile } from "./swim-program-data";

const groups = [
  ["helkrop", "konkurrenceløft", "clean", "snatch", "jerk"],
  ["ben", "squat", "knæ", "lår", "hofte", "læg"],
  ["bagkæde", "dødløft", "hamstring", "glute", "ryg · kraft", "træk"],
  ["bryst", "bænk", "pres", "push-up", "dips"],
  ["ryg", "lat", "row", "pull-up", "trækstyrke"],
  ["skulder", "overhead", "lockout", "rotator"],
  ["core", "rotation", "anti-rotation", "bracing", "stabilitet"],
  ["eksplosiv", "sprint", "hop", "kast", "power"],
] as const;

const text = (exercise: Pick<ExerciseDefinition, "name" | "target" | "category">) => `${exercise.name} ${exercise.target} ${exercise.category}`.toLocaleLowerCase("da-DK");
const muscleGroups = (exercise: Pick<ExerciseDefinition, "name" | "target" | "category">) => {
  const haystack = text(exercise);
  return groups.map((tokens, index) => tokens.some((token) => haystack.includes(token)) ? index : -1).filter((index) => index >= 0);
};

export const definitionToSessionExercise = (exercise: ExerciseDefinition): SessionExercise => ({
  name: exercise.name,
  detail: `${exercise.sets} × ${exercise.reps}`,
  focus: exercise.cue,
  sets: Math.max(1, Number.parseInt(exercise.sets, 10) || 3),
  plannedReps: exercise.reps,
  defaultWeight: exercise.weight,
  tracking: exercise.format === "distance" ? "distance" : "load",
  restSeconds: exercise.format === "distance" ? 90 : 75,
  effortMetric: exercise.format === "distance" ? "heart_rate_zone" : "rir",
  effortTarget: exercise.format === "distance" ? "Pulszone 2–4" : "2–4 RIR",
  programRole: "assistance",
});

export const availableSessionExercises = (profile: TrainingProfile) => exerciseLibrary.filter((exercise) =>
  exercise.visibility !== "coach_only" && (!exercise.sports?.length || exercise.sports.includes(profile)),
);

export const fiveExerciseAlternatives = (current: SessionExercise, profile: TrainingProfile) => {
  const source = exerciseLibrary.find((exercise) => exercise.name === current.name);
  const currentGroups = source ? muscleGroups(source) : [];
  return availableSessionExercises(profile)
    .filter((exercise) => exercise.name !== current.name && (exercise.format === "distance") === (current.tracking === "distance"))
    .map((exercise) => {
      const candidateGroups = muscleGroups(exercise);
      const groupMatches = candidateGroups.filter((group) => currentGroups.includes(group)).length;
      const categoryMatch = source?.category === exercise.category ? 1 : 0;
      return { exercise, score: groupMatches * 10 + categoryMatch * 4 + (exercise.sports?.includes(profile) ? 2 : 0) };
    })
    .filter((item) => currentGroups.length === 0 || item.score >= 10)
    .sort((a, b) => b.score - a.score || a.exercise.name.localeCompare(b.exercise.name, "da"))
    .slice(0, 5)
    .map(({ exercise }) => exercise);
};
