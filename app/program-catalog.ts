import { clarifyUnilateralReps } from "./exercise-units";
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

const strengthSeeds: Record<TrainingProfile, Array<[string, string, string]>> = {
  weightlifting: [["Front squat", "3", "70"], ["Clean pull", "3", "90"], ["Strict press", "6", "35"]],
  long_distance: [["Romanian deadlift", "8", "55"], ["Seated cable row", "10", "32.5"], ["Pallof press", "10", "12"]],
  middle_distance: [["Front squat", "5", "60"], ["Pull-up", "6", "0"], ["Medicine ball slam", "6", "6"]],
  sprint: [["Back squat", "4", "75"], ["Box jump", "3", "0"], ["Bench press", "5", "50"]],
  recreational: [["Goblet squat", "8", "16"], ["Seated cable row", "10", "30"], ["Romanian deadlift", "8", "40"]],
  athletics: [["Front squat", "5", "65"], ["Box jump", "4", "0"], ["Romanian deadlift", "6", "65"]],
  golf: [["Pallof press", "10", "12"], ["Half-kneeling landmine press", "8", "20"], ["Single-leg Romanian deadlift", "8 pr. ben", "18"]],
  running: [["Split squat", "8 pr. ben", "20"], ["Romanian deadlift", "8", "55"], ["Calf raise", "12", "25"]],
  powerlifting: [["Back squat", "5", "80"], ["Bænkpres", "5", "55"], ["Dødløft", "4", "95"]],
  skiing: [["Bulgarian split squat", "8 pr. ben", "22"], ["Romanian deadlift", "8", "55"], ["Seated cable row", "10", "35"]],
  triathlon: [["Split squat", "8 pr. ben", "18"], ["Seated cable row", "10", "32.5"], ["Pallof press", "10", "12"]],
  ironman: [["Goblet squat", "10", "18"], ["Romanian deadlift", "10", "50"], ["Seated cable row", "12", "30"]],
  hyrox: [["Front squat", "6", "60"], ["Farmer's walk", "30 m", "24"], ["Push press", "6", "35"]],
  crossfit: [["Front squat", "5", "60"], ["Push press", "6", "35"], ["Pull-up", "6", "0"]],
  cycling: [["Back squat", "6", "65"], ["Bulgarian split squat", "8 pr. ben", "20"], ["Dead bug", "10", "0"]],
  american_football: [["Back squat", "5", "80"], ["Bænkpres", "5", "60"], ["Box jump", "3", "0"]],
  football: [["Split squat", "8 pr. ben", "20"], ["Romanian deadlift", "8", "55"], ["Copenhagen plank", "25 sek", "0"]],
  handball: [["Front squat", "6", "60"], ["Half-kneeling landmine press", "8", "22.5"], ["Box jump", "4", "0"]],
};

const sessionExercise = (name: string, reps: string, weight: string, week: number): SessionExercise => {
  const plannedReps = clarifyUnilateralReps(name, reps);
  return progressExercisePrescription({ name, sets: 4, plannedReps, defaultWeight: weight, focus: "Kontrolleret kvalitet med den planlagte indsats", tracking: "load", restSeconds: 75, effortMetric: "rir", effortTarget: "3–4 RIR", detail: "" }, week);
};

export const buildGenericTrainingPlan = (profile: TrainingProfile): ProgramDay[] => Array.from({ length: 12 }, (_, weekIndex) => {
  const week = weekIndex + 1;
  const progression = getWeekProgression(week);
  return [0, 2, 5].map((_, sessionIndex) => {
    const day = ["MANDAG", "ONSDAG", "LØRDAG"][sessionIndex];
    const exercises = strengthSeeds[profile].map(([name, reps, weight]) => sessionExercise(name, reps, weight, week));
    return {
      programId: `base-${profile}-w${week}-s${sessionIndex + 1}`,
      week,
      day,
      date: `UGE ${week}`,
      status: week === 1 && sessionIndex === 0 ? "today" as const : "planned" as const,
      title: `${sportProfiles.find((sport) => sport.id === profile)?.label} · ${["fundament", "kapacitet", "kvalitet"][sessionIndex]}`,
      focus: `${progression.phase} · Sportsrelevant styrke på land; direkte løbe-, vand- og shuttlepas styres af træneren`,
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
  if (template.visibility === "coach_only") {
    const directExercise = ["long_distance", "middle_distance", "sprint"].includes(template.sportId) ? "2500 m temposvømning"
      : template.sportId === "football" ? "Suicide runs"
      : template.sportId === "cycling" ? "Cykelinterval"
      : ["triathlon", "ironman"].includes(template.sportId) ? "Brick-interval"
      : template.sportId === "american_football" || template.sportId === "athletics" ? "10-yard sprint"
      : "3000 m intervalløb";
    return Array.from({ length: 12 }, (_, weekIndex) => [0, 2, 5].map((_, sessionIndex): ProgramDay => {
      const week = weekIndex + 1;
      const baseMeters = directExercise === "10-yard sprint" ? 10 : directExercise === "Suicide runs" ? 120 : directExercise === "Cykelinterval" ? 2000 : directExercise === "Brick-interval" ? 1000 : 500;
      const progression = getWeekProgression(week);
      const exercise = progressExercisePrescription({ name: directExercise, sets: 6, plannedReps: `${baseMeters} m`, defaultWeight: "0", focus: template.focus, tracking: "distance", restSeconds: 60, effortMetric: "heart_rate_zone", effortTarget: "Pulszone 2–3", detail: "" }, week);
      const distanceMeters = exercise.sets * (Number.parseFloat(exercise.plannedReps) || 0);
      return { programId: `${template.id}-w${week}-s${sessionIndex + 1}`, week, day: ["MANDAG", "ONSDAG", "LØRDAG"][sessionIndex], date: `UGE ${week}`, status: week === 1 && sessionIndex === 0 ? "today" : "planned", title: template.title, focus: `${progression.phase} · ${template.goal}`, duration: 45 + sessionIndex * 10, intensity: progression.intensity, phase: progression.phase, progressionNote: progression.summary, distanceMeters, exercises: [exercise] };
    })).flat();
  }
  return buildGenericTrainingPlan(template.sportId).map((day) => ({ ...day, programId: `${template.id}-${day.programId?.split("-").slice(-2).join("-")}`, title: template.title, focus: template.goal }));
};
