import { exerciseLibrary, type ExerciseDefinition } from "./exercise-data";
import { getWeekProgression, progressExercisePrescription, type ProgramDay, type SessionExercise } from "./program-data";
import { sportProfiles, type ContentVisibility, type Difficulty, type TrainingProfile } from "./sport-catalog";

export type ProgramTemplate = {
  id: string;
  sportId: TrainingProfile;
  title: string;
  goal: string;
  focus: string;
  difficulty: Difficulty;
  durationWeeks: 12;
  sessionsPerWeek: number;
  visibility: ContentVisibility;
};

const profileFocus: Record<TrainingProfile, string[]> = {
  weightlifting: ["konkurrenceløft", "teknik", "maksimal styrke", "power"],
  long_distance: ["styrkeudholdenhed", "skulderrobusthed", "kropslinje", "2500 m temposvømning"],
  middle_distance: ["race pace", "power", "tærskel", "3000 m vandinterval"],
  sprint: ["start og vending", "topfart", "eksplosiv styrke", "sprintserier i vand"],
  recreational: ["helkropsstyrke", "bevægelseskvalitet", "vaner", "grundform"],
  athletics: ["acceleration", "springkraft", "kastestyrke", "robusthed"],
  golf: ["rotation", "hoftekontrol", "slagkraft", "rygstabilitet"],
  running: ["hurtigere 10 km", "løbeøkonomi", "tærskel", "3000 m intervalløb"],
  powerlifting: ["squat", "bænkpres", "dødløft", "konkurrenceform"],
  skiing: ["benudholdenhed", "balance", "stavkraft", "aerob kapacitet"],
  triathlon: ["disciplinbalance", "styrkeudholdenhed", "skiftezonen", "aerob base"],
  ironman: ["lang udholdenhed", "energiøkonomi", "robusthed", "raceforberedelse"],
  hyrox: ["stationsstyrke", "løbsøkonomi", "sled power", "arbejdskapacitet"],
  crossfit: ["mixed modal", "gymnastik", "vægtløftning", "engine"],
  cycling: ["trådøkonomi", "tærskel", "sprintkraft", "position"],
  american_football: ["10-yard acceleration", "kontaktstyrke", "retningsskift", "positionskraft"],
  football: ["kampkondition", "acceleration", "suicide runs", "retningsskift"],
  handball: ["springkraft", "kastestyrke", "retningsskift", "skulderrobusthed"],
};

const directCoachOnly = (profile: TrainingProfile, focus: string) =>
  ["long_distance", "middle_distance", "sprint"].includes(profile)
  || /løb|interval|suicide|vand|race pace|tærskel|aerob base|lang udholdenhed|kampkondition/i.test(focus);

export const programTemplates: ProgramTemplate[] = Array.from({ length: 500 }, (_, index) => {
  const sport = sportProfiles[index % sportProfiles.length];
  const focus = profileFocus[sport.id][Math.floor(index / sportProfiles.length) % profileFocus[sport.id].length];
  const difficulty = (["Begynder", "Øvet", "Avanceret"] as const)[Math.floor(index / (sportProfiles.length * 4)) % 3];
  const cycle = Math.floor(index / sportProfiles.length) + 1;
  return {
    id: `base-template-${sport.id}-${String(cycle).padStart(2, "0")}`,
    sportId: sport.id,
    title: `${sport.label}: ${focus} · forløb ${cycle}`,
    goal: `Forbedr ${focus} gennem en tydelig 12-ugers progression`,
    focus,
    difficulty,
    durationWeeks: 12,
    sessionsPerWeek: difficulty === "Begynder" ? 2 : 3,
    visibility: directCoachOnly(sport.id, focus) ? "coach_only" : "athlete",
  };
});

const sessionThemes = ["Hovedstyrke", "Power & ensidig kontrol", "Støttestyrke & robusthed"];
const withSessionTheme = (title: string, theme: string) => `${title.slice(0, Math.max(1, 77 - theme.length)).trimEnd()} · ${theme}`;

const exerciseSearchText = (exercise: ExerciseDefinition) => `${exercise.name} ${exercise.target} ${exercise.focus ?? ""}`.toLocaleLowerCase("da-DK");

const sportPool = (profile: TrainingProfile, tracking: "load" | "distance", difficulty: Difficulty, focus: string) => {
  const focusTerms = focus.toLocaleLowerCase("da-DK").split(/\s+|·/).filter((term) => term.length > 3);
  const candidates = exerciseLibrary.filter((exercise) => exercise.sports?.includes(profile)
    && (exercise.format ?? "load") === tracking
    && (tracking === "distance" ? exercise.visibility === "coach_only" : exercise.visibility !== "coach_only"));
  return candidates.sort((left, right) => {
    const score = (exercise: ExerciseDefinition) => (exercise.difficulty === difficulty ? 3 : 0) + focusTerms.filter((term) => exerciseSearchText(exercise).includes(term)).length * 2;
    return score(right) - score(left) || left.name.localeCompare(right.name, "da");
  });
};

const selectBlockExercises = (pool: ExerciseDefinition[], count: number, variant: number, block: number) => {
  if (pool.length === 0) return [];
  const offset = (variant * 7 + block * 11) % pool.length;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
  return rotated.slice(0, Math.min(count, rotated.length));
};

const sessionExercise = (exercise: ExerciseDefinition, week: number): SessionExercise => progressExercisePrescription({
  name: exercise.name,
  sets: Math.max(1, Number(exercise.sets) || 3),
  plannedReps: exercise.reps,
  defaultWeight: exercise.weight,
  focus: exercise.cue,
  tracking: exercise.format ?? "load",
  restSeconds: exercise.format === "distance" ? 45 : 75,
  effortMetric: exercise.format === "distance" ? "heart_rate_zone" : "rir",
  effortTarget: exercise.format === "distance" ? "Pulszone 2–3" : "3–4 RIR",
  detail: "",
}, week);

export const buildGenericTrainingPlan = (profile: TrainingProfile, variant = 0, difficulty: Difficulty = "Øvet", focus = "sportsrelevant styrke"): ProgramDay[] => Array.from({ length: 12 }, (_, weekIndex) => {
  const week = weekIndex + 1;
  const progression = getWeekProgression(week);
  const block = Math.floor(weekIndex / 4);
  const selectedExercises = selectBlockExercises(sportPool(profile, "load", difficulty, focus), 12, variant, block);
  return [0, 2, 5].map((_, sessionIndex) => {
    const day = ["MANDAG", "ONSDAG", "LØRDAG"][sessionIndex];
    const exercises = selectedExercises.slice(sessionIndex * 4, sessionIndex * 4 + 4).map((exercise) => sessionExercise(exercise, week));
    return {
      programId: `base-${profile}-w${week}-s${sessionIndex + 1}`,
      week,
      day,
      date: `UGE ${week}`,
      status: week === 1 && sessionIndex === 0 ? "today" as const : "planned" as const,
      title: `${sportProfiles.find((sport) => sport.id === profile)?.label} · ${sessionThemes[sessionIndex]}`,
      focus: `${progression.phase} · ${focus}; direkte løbe-, vand- og shuttlepas styres af træneren`,
      duration: 50 + sessionIndex * 5,
      intensity: progression.intensity,
      phase: progression.phase,
      progressionNote: progression.summary,
      exercises,
    };
  });
}).flat();

export const getProgramTemplate = (id: string) => programTemplates.find((template) => template.id === id);
export const buildTemplatePlan = (id: string) => {
  const template = getProgramTemplate(id);
  if (!template) return [];
  const variant = Number.parseInt(template.id.split("-").at(-1) ?? "0", 10) || 0;
  if (template.visibility === "coach_only") {
    const pool = sportPool(template.sportId, "distance", template.difficulty, template.focus);
    return Array.from({ length: 12 }, (_, weekIndex) => {
      const week = weekIndex + 1;
      const block = Math.floor(weekIndex / 4);
      const progression = getWeekProgression(week);
      const selectedExercises = selectBlockExercises(pool, 6, variant, block);
      return [0, 2, 5].map((_, sessionIndex): ProgramDay => {
        const exercises = selectedExercises.slice(sessionIndex * 2, sessionIndex * 2 + 2).map((exercise) => sessionExercise(exercise, week));
        const distanceMeters = exercises.reduce((total, exercise) => total + exercise.sets * (Number.parseFloat(exercise.plannedReps) || 0), 0);
        return { programId: `${template.id}-w${week}-s${sessionIndex + 1}`, week, day: ["MANDAG", "ONSDAG", "LØRDAG"][sessionIndex], date: `UGE ${week}`, status: week === 1 && sessionIndex === 0 ? "today" : "planned", title: withSessionTheme(template.title, sessionThemes[sessionIndex]), focus: `${progression.phase} · ${template.goal}`, duration: 45 + sessionIndex * 10, intensity: progression.intensity, phase: progression.phase, progressionNote: progression.summary, distanceMeters, exercises };
      });
    }).flat();
  }
  return buildGenericTrainingPlan(template.sportId, variant, template.difficulty, template.focus).map((day) => ({ ...day, programId: `${template.id}-${day.programId?.split("-").slice(-2).join("-")}`, title: withSessionTheme(template.title, day.title.split(" · ").at(-1) ?? "Træning"), focus: `${day.phase} · ${template.goal}` }));
};
