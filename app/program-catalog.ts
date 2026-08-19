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

const generalStrengthNames = [
  "Front squat", "Back squat", "Dødløft", "Bænkpres", "Strict press", "Romanian deadlift", "Pendlay row", "Pull-up",
  "Bulgarian split squat", "Dips", "Hip thrust", "Farmer's walk", "Goblet squat", "Trap bar deadlift", "Step-up", "Reverse lunge",
  "Lateral lunge", "Nordic hamstring curl", "Calf raise", "Single-leg Romanian deadlift", "Chest-supported dumbbell row",
  "Incline dumbbell bench press", "Half-kneeling landmine press", "Landmine row", "Cable chest press", "Push-up", "Lat pulldown",
  "Seated cable row", "Dumbbell shoulder press", "Face pull", "Band external rotation", "Box jump", "Medicine ball slam",
  "Pallof press", "Side plank", "Copenhagen plank", "Dead bug", "Bird dog", "Suitcase carry", "Hollow body hold", "Ab wheel rollout",
];

const swimStrengthNames = [
  "Straight-arm pulldown", "Single-arm cable pulldown", "Swim bench freestyle pull", "Swim bench butterfly pull", "Band freestyle stroke",
  "Band butterfly stroke", "Band breaststroke pull", "Band backstroke pull", "Streamline lat pulldown", "Streamline overhead hold", "Prone swimmer",
  "Prone Y-T-W", "Serratus wall slide", "Scapular pull-up", "Scapular push-up", "Cable internal rotation", "Cable external rotation",
  "Overhead medicine ball throw", "Rotational medicine ball throw", "Tall-kneeling cable chop", "Tall-kneeling cable lift",
  "Single-arm row with rotation", "Isometric catch hold",
];

const enduranceStrengthNames = [
  "Trap bar deadlift", "Bulgarian split squat", "Single-leg Romanian deadlift", "Step-up", "Reverse lunge", "Lateral lunge",
  "Nordic hamstring curl", "Calf raise", "Hip thrust", "Goblet squat", "Copenhagen plank", "Side plank", "Pallof press", "Suitcase carry",
  "Chest-supported dumbbell row", "Half-kneeling landmine press", "Box jump", "Medicine ball slam",
];

const fieldStrengthNames = [
  "Trap bar deadlift", "Front squat", "Bulgarian split squat", "Nordic hamstring curl", "Box jump", "Medicine ball slam", "Push press",
  "Bænkpres", "Pull-up", "Pendlay row", "Copenhagen plank", "Farmer's walk", "Reverse lunge", "Lateral lunge", "Hip thrust", "Face pull",
];

const golfStrengthNames = [
  "Rotational medicine ball throw", "Tall-kneeling cable chop", "Tall-kneeling cable lift", "Pallof press", "Half-kneeling landmine press",
  "Single-leg Romanian deadlift", "Split squat", "Suitcase carry", "Medicine ball slam", "Cable chest press", "Landmine row",
  "Chest-supported dumbbell row", "Reverse lunge", "Side plank", "Bird dog", "Hip thrust", "Face pull", "Band external rotation", "Dead bug",
];

const powerliftingStrengthNames = [
  "Back squat", "Bænkpres", "Dødløft", "Pause back squat", "Tempo back squat", "Front squat", "Romanian deadlift", "Pendlay row", "Pull-up",
  "Dips", "Bulgarian split squat", "Hip thrust", "Face pull", "Lat pulldown", "Incline dumbbell bench press", "Ab wheel rollout",
];

const weightliftingStrengthNames = [
  "Snatch", "Power snatch", "Hang snatch", "Clean & Jerk", "Power clean", "Hang clean", "Split jerk", "Push jerk", "Front squat", "Back squat",
  "Snatch pull", "Clean pull", "Romanian deadlift", "Strict press", "Pendlay row", "Pull-up", "Bulgarian split squat", "Overhead squat",
];

const profileStrengthNames: Record<TrainingProfile, string[]> = {
  weightlifting: weightliftingStrengthNames,
  long_distance: swimStrengthNames,
  middle_distance: swimStrengthNames,
  sprint: swimStrengthNames,
  recreational: generalStrengthNames,
  athletics: fieldStrengthNames,
  golf: golfStrengthNames,
  running: enduranceStrengthNames,
  powerlifting: powerliftingStrengthNames,
  skiing: enduranceStrengthNames,
  triathlon: [...swimStrengthNames, ...enduranceStrengthNames],
  ironman: [...enduranceStrengthNames, ...swimStrengthNames],
  hyrox: [...fieldStrengthNames, ...enduranceStrengthNames],
  crossfit: [...weightliftingStrengthNames, ...fieldStrengthNames],
  cycling: enduranceStrengthNames,
  american_football: fieldStrengthNames,
  football: fieldStrengthNames,
  handball: fieldStrengthNames,
};

const isGeneratedCatalogVariant = (exercise: ExerciseDefinition) => exercise.name.split(" · ").length >= 3 && /\s\d+$/.test(exercise.name);
export const exerciseMovementFamily = (name: string) => {
  const base = name.split(" · ")[0].trim().toLocaleLowerCase("da-DK");
  if (/medicine ball|medicinbold|throw|kast|slam/.test(base)) return "powerkast";
  if (/jump|hop|spring/.test(base)) return "spring";
  if (/single-leg romanian/.test(base)) return "ensidigt hoftedominant";
  if (/split squat|bulgarian|step-up|reverse lunge|lateral lunge/.test(base)) return "ensidigt knædominant";
  if (/front squat|back squat|goblet squat|leg press|box squat|anderson squat/.test(base)) return "bilateral squat";
  if (/nordic|leg curl/.test(base)) return "baglår knæfleksion";
  if (/deadlift|dødløft|romanian deadlift|hip thrust|glute bridge/.test(base)) return "bilateral hofteekstension";
  if (/bench|bænk|chest press|push-up|dips/.test(base)) return "horisontalt pres";
  if (/strict press|shoulder press|push press|landmine press/.test(base)) return "vertikalt pres";
  if (/row/.test(base)) return "horisontalt træk";
  if (/pulldown|pull-up/.test(base)) return "vertikalt træk";
  if (/pallof|rotation|chop|cable lift/.test(base)) return "rotation og antirotation";
  if (/side plank|copenhagen/.test(base)) return "lateral core";
  if (/plank|dead bug|bird dog|hollow|ab wheel/.test(base)) return "anti-ekstension og corekontrol";
  if (/carry|walk/.test(base)) return "carry";
  if (/face pull|external rotation|internal rotation|wall slide|wall angel|prone|scapular/.test(base)) return "skulderkontrol";
  if (/calf raise/.test(base)) return "lægstyrke";
  if (/snatch/.test(base)) return "snatch";
  if (/clean/.test(base)) return "clean";
  if (/jerk/.test(base)) return "jerk";
  return base;
};

const uniqueExercises = (exercises: ExerciseDefinition[]) => Array.from(new Map(exercises.map((exercise) => [exercise.name, exercise])).values());

const exerciseTheme = (exercise: ExerciseDefinition) => {
  const text = exerciseSearchText(exercise);
  if (/jump|throw|kast|slam|snatch|clean|jerk|power|single-leg|split squat|lunge|step-up/.test(text)) return 1;
  if (/plank|pallof|carry|walk|rotation|chop|lift|face pull|dead bug|bird dog|hollow|ab wheel|band|wall|scapular|prone|stabil|robust/.test(text)) return 2;
  return 0;
};

const sportPool = (profile: TrainingProfile, tracking: "load" | "distance", difficulty: Difficulty, focus: string) => {
  const focusTerms = focus.toLocaleLowerCase("da-DK").split(/\s+|·/).filter((term) => term.length > 3);
  const candidates = exerciseLibrary.filter((exercise) => exercise.sports?.includes(profile)
    && (exercise.format ?? "load") === tracking
    && (tracking === "distance" ? exercise.visibility === "coach_only" : exercise.visibility !== "coach_only"));
  const priorityNames = tracking === "load" ? [...profileStrengthNames[profile], ...generalStrengthNames] : [];
  const byName = new Map(exerciseLibrary.map((exercise) => [exercise.name, exercise]));
  const curated = priorityNames.map((name) => byName.get(name)).filter((exercise): exercise is ExerciseDefinition => Boolean(exercise));
  const pool = tracking === "load"
    ? uniqueExercises([...curated, ...candidates.filter((exercise) => !isGeneratedCatalogVariant(exercise))])
    : candidates;
  const priority = new Map(priorityNames.map((name, index) => [name, priorityNames.length - index]));
  return pool.sort((left, right) => {
    const score = (exercise: ExerciseDefinition) => (exercise.difficulty === difficulty ? 3 : 0) + focusTerms.filter((term) => exerciseSearchText(exercise).includes(term)).length * 2;
    return score(right) - score(left) || (priority.get(right.name) ?? 0) - (priority.get(left.name) ?? 0) || left.name.localeCompare(right.name, "da");
  });
};

const selectWeeklyExercises = (pool: ExerciseDefinition[], perSession: number, variant: number, block: number) => {
  if (pool.length === 0) return [];
  const offset = (Math.max(0, variant - 1) + block * 13) % pool.length;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
  const usedFamilies = new Set<string>();
  const usedNames = new Set<string>();
  return sessionThemes.map((_, sessionIndex) => {
    const preferred = rotated.filter((exercise) => exerciseTheme(exercise) === sessionIndex);
    const fallback = rotated.filter((exercise) => exerciseTheme(exercise) !== sessionIndex);
    const selected: ExerciseDefinition[] = [];
    for (const exercise of [...preferred, ...fallback]) {
      const family = exerciseMovementFamily(exercise.name);
      if (usedFamilies.has(family)) continue;
      selected.push(exercise);
      usedFamilies.add(family);
      usedNames.add(exercise.name);
      if (selected.length === perSession) break;
    }
    if (selected.length < perSession) {
      for (const exercise of rotated) {
        if (usedNames.has(exercise.name)) continue;
        selected.push(exercise);
        usedNames.add(exercise.name);
        if (selected.length === perSession) break;
      }
    }
    return selected;
  });
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
  const weeklyExercises = selectWeeklyExercises(sportPool(profile, "load", difficulty, focus), 4, variant, block);
  return [0, 2, 5].map((_, sessionIndex) => {
    const day = ["MANDAG", "ONSDAG", "LØRDAG"][sessionIndex];
    const exercises = weeklyExercises[sessionIndex].map((exercise) => sessionExercise(exercise, week));
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
      const weeklyExercises = selectWeeklyExercises(pool, 2, variant, block);
      return [0, 2, 5].map((_, sessionIndex): ProgramDay => {
        const exercises = weeklyExercises[sessionIndex].map((exercise) => sessionExercise(exercise, week));
        const distanceMeters = exercises.reduce((total, exercise) => total + exercise.sets * (Number.parseFloat(exercise.plannedReps) || 0), 0);
        return { programId: `${template.id}-w${week}-s${sessionIndex + 1}`, week, day: ["MANDAG", "ONSDAG", "LØRDAG"][sessionIndex], date: `UGE ${week}`, status: week === 1 && sessionIndex === 0 ? "today" : "planned", title: withSessionTheme(template.title, sessionThemes[sessionIndex]), focus: `${progression.phase} · ${template.goal}`, duration: 45 + sessionIndex * 10, intensity: progression.intensity, phase: progression.phase, progressionNote: progression.summary, distanceMeters, exercises };
      });
    }).flat();
  }
  return buildGenericTrainingPlan(template.sportId, variant, template.difficulty, template.focus).map((day) => ({ ...day, programId: `${template.id}-${day.programId?.split("-").slice(-2).join("-")}`, title: withSessionTheme(template.title, day.title.split(" · ").at(-1) ?? "Træning"), focus: `${day.phase} · ${template.goal}` }));
};
