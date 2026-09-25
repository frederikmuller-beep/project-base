import type { SessionExercise } from "../app/program-data";

export const parseSessionExercises = (value: string | null | undefined, fallback: SessionExercise[]) => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > 12) return fallback;
    const valid = parsed.every((exercise) => {
      if (!exercise || typeof exercise !== "object") return false;
      const candidate = exercise as Partial<SessionExercise>;
      return typeof candidate.name === "string" && candidate.name.length > 0
        && typeof candidate.focus === "string"
        && Number.isInteger(candidate.sets) && (candidate.sets ?? 0) > 0 && (candidate.sets ?? 0) <= 20
        && typeof candidate.plannedReps === "string"
        && typeof candidate.defaultWeight === "string";
    });
    return valid ? parsed as SessionExercise[] : fallback;
  } catch {
    return fallback;
  }
};
