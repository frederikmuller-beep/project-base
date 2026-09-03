import { clarifyUnilateralReps } from "./exercise-units";

export type SessionExercise = {
  name: string;
  detail: string;
  focus: string;
  sets: number;
  plannedReps: string;
  defaultWeight: string;
  tracking?: "load" | "distance";
  restSeconds?: number;
  effortMetric?: "rir" | "heart_rate_zone";
  effortTarget?: string;
  programRole?: "main" | "assistance" | "sport_specific";
};

export type ProgramDay = {
  programId: string | null;
  week: number;
  day: string;
  date: string;
  status: "today" | "planned" | "recovery" | "rest";
  title: string;
  focus: string;
  duration: number;
  exercises: SessionExercise[];
  intensity?: string;
  distanceMeters?: number;
  phase?: string;
  progressionNote?: string;
};

export type WeekProgression = {
  week: number;
  phase: "Fundament" | "Akkumulering" | "Deload" | "Opbygning" | "Intensivering" | "Topning" | "Realisering";
  loadFactor: number;
  setDelta: number;
  repDelta: number;
  distanceFactor: number;
  intensity: string;
  rirTarget: string;
  heartRateTarget: string;
  summary: string;
};

export const weekProgressions: WeekProgression[] = [
  { week: 1, phase: "Fundament", loadFactor: 1, setDelta: 0, repDelta: 0, distanceFactor: 1, intensity: "Moderat", rirTarget: "3–4 RIR", heartRateTarget: "Pulszone 2–3", summary: "Find sikre startvægte og ensartet teknik." },
  { week: 2, phase: "Fundament", loadFactor: 1.025, setDelta: 0, repDelta: 0, distanceFactor: 1.05, intensity: "Moderat+", rirTarget: "3 RIR", heartRateTarget: "Pulszone 2–3", summary: "Lidt mere belastning uden at miste kvalitet." },
  { week: 3, phase: "Akkumulering", loadFactor: 1.05, setDelta: 1, repDelta: 0, distanceFactor: 1.1, intensity: "Moderat · mere volumen", rirTarget: "2–3 RIR", heartRateTarget: "Pulszone 2–4", summary: "Ugens højeste arbejdsmængde bygger kapacitet." },
  { week: 4, phase: "Deload", loadFactor: 0.9, setDelta: -1, repDelta: 0, distanceFactor: 0.7, intensity: "Let", rirTarget: "4–6 RIR", heartRateTarget: "Pulszone 1–2", summary: "Volumen og belastning sænkes for at absorbere arbejdet." },
  { week: 5, phase: "Opbygning", loadFactor: 1.05, setDelta: 0, repDelta: 0, distanceFactor: 1.08, intensity: "Moderat+", rirTarget: "2–3 RIR", heartRateTarget: "Pulszone 2–3", summary: "Ny blok starter over det første fundament." },
  { week: 6, phase: "Opbygning", loadFactor: 1.075, setDelta: 1, repDelta: 0, distanceFactor: 1.15, intensity: "Moderat/hård · mere volumen", rirTarget: "2 RIR", heartRateTarget: "Pulszone 2–4", summary: "Mere samlet arbejde før intensiteten stiger." },
  { week: 7, phase: "Intensivering", loadFactor: 1.1, setDelta: 0, repDelta: -1, distanceFactor: 1.08, intensity: "Hård · kontrolleret", rirTarget: "1–3 RIR", heartRateTarget: "Pulszone 3–4", summary: "Højere belastning og færre gentagelser pr. sæt." },
  { week: 8, phase: "Deload", loadFactor: 0.95, setDelta: -1, repDelta: 0, distanceFactor: 0.75, intensity: "Let", rirTarget: "4–6 RIR", heartRateTarget: "Pulszone 1–2", summary: "Trætheden sænkes før den specifikke blok." },
  { week: 9, phase: "Intensivering", loadFactor: 1.1, setDelta: -1, repDelta: -1, distanceFactor: 1, intensity: "Hård · lavere volumen", rirTarget: "1–3 RIR", heartRateTarget: "Pulszone 3–4", summary: "Mere specifik intensitet med færre arbejdssæt." },
  { week: 10, phase: "Intensivering", loadFactor: 1.125, setDelta: -1, repDelta: -1, distanceFactor: 1.05, intensity: "Hård", rirTarget: "1–2 RIR", heartRateTarget: "Pulszone 3–4", summary: "Belastningen stiger, mens volumen holdes kontrolleret." },
  { week: 11, phase: "Topning", loadFactor: 1.15, setDelta: -1, repDelta: -2, distanceFactor: 0.9, intensity: "Høj kvalitet", rirTarget: "1–2 RIR", heartRateTarget: "Pulszone 4", summary: "De tungeste eller hurtigste kvalitetsarbejder i forløbet." },
  { week: 12, phase: "Realisering", loadFactor: 1.075, setDelta: -2, repDelta: -2, distanceFactor: 0.6, intensity: "Lav volumen · friskhed", rirTarget: "2–4 RIR", heartRateTarget: "Pulszone 2–3", summary: "Volumen falder markant, så udviklingen kan vurderes frisk." },
];

export const getWeekProgression = (week: number) => weekProgressions[Math.min(11, Math.max(0, week - 1))];

const roundedLoad = (weight: number) => {
  const increment = weight < 40 ? 0.5 : 2.5;
  return Math.round(weight / increment) * increment;
};

const adjustStrengthReps = (reps: string, delta: number) => {
  if (delta === 0 || reps.includes("+") || /\b(?:m|min|sek|runde)\b/i.test(reps)) return reps;
  const match = reps.match(/^(\d+)(.*)$/);
  if (!match) return reps;
  return `${Math.max(1, Number(match[1]) + delta)}${match[2]}`;
};

export const progressExercisePrescription = (exercise: SessionExercise, week: number): SessionExercise => {
  const progression = getWeekProgression(week);
  const sets = Math.max(1, exercise.sets + progression.setDelta);
  if (exercise.tracking === "distance") {
    const distanceMatch = exercise.plannedReps.match(/^(\d+(?:\.\d+)?)\s*m$/i);
    const baseMeters = Number(distanceMatch?.[1] ?? 0);
    const increment = baseMeters < 25 ? 5 : 25;
    const meters = baseMeters > 0 ? Math.max(increment, Math.round((baseMeters * progression.distanceFactor) / increment) * increment) : 0;
    const plannedReps = meters > 0 ? `${meters} m` : exercise.plannedReps;
    return { ...exercise, sets, plannedReps, effortTarget: progression.heartRateTarget, detail: `${sets} × ${plannedReps} · ${progression.heartRateTarget.toLocaleLowerCase("da-DK")}` };
  }
  const numericWeight = Number.parseFloat(exercise.defaultWeight);
  const defaultWeight = Number.isFinite(numericWeight) && numericWeight > 0 ? String(roundedLoad(numericWeight * progression.loadFactor)) : exercise.defaultWeight;
  const plannedReps = adjustStrengthReps(exercise.plannedReps, progression.repDelta);
  return { ...exercise, sets, plannedReps, defaultWeight, restSeconds: (exercise.restSeconds ?? 75) + (week >= 7 && week !== 8 && week !== 12 ? 15 : 0), effortTarget: progression.rirTarget, detail: `${sets} × ${plannedReps} · ${defaultWeight} kg · ${progression.rirTarget}` };
};

const exercise = (
  name: string,
  sets: number,
  plannedReps: string,
  defaultWeight: string,
  focus: string,
): SessionExercise => {
  const clearReps = clarifyUnilateralReps(name, plannedReps);
  return {
  name,
  sets,
  plannedReps: clearReps,
  defaultWeight,
  focus,
  effortMetric: "rir",
  effortTarget: "2–4 RIR",
  detail: `${sets} × ${clearReps} · ${defaultWeight} kg`,
};
};

const recoveryExercise = (name: string, sets: number, plannedReps: string, defaultWeight: string, focus: string): SessionExercise => ({
  ...exercise(name, sets, plannedReps, defaultWeight, focus),
  effortTarget: "4–6 RIR",
});

const recoveryCardio = (name: string, plannedReps: string, focus: string): SessionExercise => ({
  name, sets: 1, plannedReps, defaultWeight: "0", focus, tracking: "distance", restSeconds: 0,
  effortMetric: "heart_rate_zone", effortTarget: "Pulszone 1–2",
  detail: `${plannedReps} · pulszone 1–2`,
});

const originalTwoWeekPlan: ProgramDay[] = [
  {
    programId: "w1-competition-focus", week: 1, day: "MANDAG", date: "3. AUG", status: "today",
    title: "Competition focus", focus: "Teknisk kvalitet under moderat belastning", duration: 80,
    exercises: [
      exercise("Snatch", 6, "2", "70", "Rolig fra gulv, aggressiv under stangen"),
      exercise("Clean & Jerk", 5, "1+1", "95", "Stabil modtagelse"),
      exercise("Front squat", 4, "3", "105", "Kontrolleret excentrisk"),
    ],
  },
  {
    programId: "w1-active-recovery", week: 1, day: "TIRSDAG", date: "4. AUG", status: "recovery",
    title: "Aktiv restitution", focus: "Bevægelse, mobilitet og rolig coretræning", duration: 35,
    exercises: [
      recoveryCardio("Cykel", "15 min", "Rolig intensitet og næseåndedræt"),
      recoveryExercise("Hofte- og ankelmobilitet", 3, "1 runde", "0", "Roligt bevægeudslag uden smerte"),
      recoveryExercise("Dead bug", 3, "8", "0", "Hold lænden i gulvet"),
    ],
  },
  {
    programId: "w1-snatch-technique", week: 1, day: "ONSDAG", date: "5. AUG", status: "planned",
    title: "Snatch technique", focus: "Timing fra hæng og stabil overheadposition", duration: 70,
    exercises: [
      exercise("Power snatch", 5, "2", "60", "Tæt stangbane og hurtige fødder"),
      exercise("Hang snatch", 4, "3", "55", "Pres gulvet væk fra knæet"),
      exercise("Snatch pull", 3, "3", "85", "Afslut trækket lodret"),
      exercise("Overhead squat", 2, "5", "50", "Aktive skuldre gennem hele løftet"),
    ],
  },
  { programId: null, week: 1, day: "TORSDAG", date: "6. AUG", status: "rest", title: "Hviledag", focus: "Søvn, mad og let bevægelse efter behov", duration: 0, exercises: [] },
  {
    programId: "w1-clean-jerk-power", week: 1, day: "FREDAG", date: "7. AUG", status: "planned",
    title: "Clean & jerk power", focus: "Stabil modtagelse og kraftfuldt ben-drive", duration: 85,
    exercises: [
      exercise("Clean & Jerk", 5, "1+1", "97.5", "Samme opsætning i alle forsøg"),
      exercise("Clean pull", 4, "3", "120", "Hold balancen midt på foden"),
      exercise("Front squat", 4, "3", "107.5", "Høj albueposition"),
      exercise("Push jerk", 3, "3", "80", "Kort dip og aktiv låsning"),
    ],
  },
  {
    programId: "w1-strength-base", week: 1, day: "LØRDAG", date: "8. AUG", status: "planned",
    title: "Strength base", focus: "Benstyrke, bagkæde og overheadkapacitet", duration: 75,
    exercises: [
      exercise("Back squat", 5, "5", "120", "Ens tempo og stabil bundposition"),
      exercise("Strict press", 4, "6", "45", "Spændt mave og lige stangbane"),
      exercise("Romanian deadlift", 3, "8", "85", "Hofte tilbage og lang ryg"),
      exercise("Plank", 2, "30 sek", "0", "Hold en rolig vejrtrækning"),
    ],
  },
  { programId: null, week: 1, day: "SØNDAG", date: "9. AUG", status: "rest", title: "Hviledag", focus: "Fuld restitution før næste træningsuge", duration: 0, exercises: [] },
  {
    programId: "w2-speed-position", week: 2, day: "MANDAG", date: "10. AUG", status: "planned",
    title: "Speed & position", focus: "Hurtighed under stangen fra sikre positioner", duration: 75,
    exercises: [
      exercise("Tall snatch", 4, "3", "35", "Træk kroppen aktivt under stangen"),
      exercise("Block snatch", 5, "2", "62.5", "Hold brystet over stangen"),
      exercise("Snatch balance", 4, "2", "60", "Lås aktivt i modtagelsen"),
      exercise("Back squat", 4, "4", "125", "Kontrolleret ned, kraftfuldt op"),
    ],
  },
  {
    programId: "w2-recovery-flow", week: 2, day: "TIRSDAG", date: "11. AUG", status: "recovery",
    title: "Recovery flow", focus: "Cirkulation, mobilitet og let stabilitet", duration: 30,
    exercises: [
      recoveryCardio("Roning", "12 min", "Jævnt tempo uden at presse pulsen"),
      recoveryExercise("Cossack squat", 3, "6", "0", "Kontrolleret sideforskydning"),
      recoveryExercise("Side plank", 3, "25 sek", "0", "Lang og stabil kropslinje"),
    ],
  },
  {
    programId: "w2-clean-complex", week: 2, day: "ONSDAG", date: "12. AUG", status: "planned",
    title: "Clean complex", focus: "Sammenhæng mellem træk, vending og squat", duration: 80,
    exercises: [
      exercise("Hang clean", 4, "2", "80", "Færdiggør benstrækket"),
      exercise("Clean + Front squat", 5, "1+2", "90", "Stabil vendingsposition"),
      exercise("Clean deadlift", 4, "3", "115", "Skuldre og hofter stiger sammen"),
      exercise("Push press", 3, "5", "65", "Ben-drive før armene"),
    ],
  },
  { programId: null, week: 2, day: "TORSDAG", date: "13. AUG", status: "rest", title: "Hviledag", focus: "Prioritér søvn og regelmæssige måltider", duration: 0, exercises: [] },
  {
    programId: "w2-heavy-quality", week: 2, day: "FREDAG", date: "14. AUG", status: "planned",
    title: "Heavy quality", focus: "Få tunge løft med høj teknisk kvalitet", duration: 90,
    exercises: [
      exercise("Snatch", 5, "1", "75", "Kun velkontrollerede forsøg"),
      exercise("Clean & Jerk", 5, "1+1", "102.5", "Rolig clean og beslutsomt jerk"),
      exercise("Front squat", 4, "2", "115", "Bevar høj position"),
    ],
  },
  {
    programId: "w2-strength-support", week: 2, day: "LØRDAG", date: "15. AUG", status: "planned",
    title: "Strength support", focus: "Robust bagkæde, trækstyrke og skulderkontrol", duration: 70,
    exercises: [
      exercise("Snatch-grip deadlift", 4, "5", "105", "Hold stangen tæt"),
      exercise("Bulgarian split squat", 3, "8 pr. ben", "24", "Stabilt knæ over fod"),
      exercise("Pendlay row", 4, "6", "65", "Start hvert løft fra gulvet"),
      exercise("Overhead carry", 3, "25 m", "20", "Ribben ned og aktiv skulder"),
    ],
  },
  {
    programId: "w2-test-review", week: 2, day: "SØNDAG", date: "16. AUG", status: "recovery",
    title: "Test review", focus: "Let bevægelse og afsluttende evaluering", duration: 25,
    exercises: [
      recoveryCardio("Cykel", "10 min", "Meget roligt tempo"),
      recoveryExercise("World's greatest stretch", 3, "5", "0", "Roligt bevægeudslag"),
      recoveryExercise("Bird dog", 3, "8", "0", "Undgå rotation i bækkenet"),
    ],
  },
];

const dateForWeekday = (week: number, weekday: number) => {
  const date = new Date(Date.UTC(2026, 7, 3 + (week - 1) * 7 + weekday));
  return `${date.getUTCDate()}. ${new Intl.DateTimeFormat("da-DK", { month: "short", timeZone: "UTC" }).format(date).replace(".", "").toLocaleUpperCase("da-DK")}`;
};

export const extendPlanToTwelveWeeks = (basePlan: ProgramDay[]): ProgramDay[] => Array.from({ length: 12 }, (_, weekIndex) => {
  const week = weekIndex + 1;
  const sourceWeek = ((week - 1) % 2) + 1;
  const progression = getWeekProgression(week);
  return basePlan.filter((day) => day.week === sourceWeek).map((day, weekday) => {
    const exercises = day.status === "recovery" ? day.exercises : day.exercises.map((exercise) => progressExercisePrescription(exercise, week));
    const distanceMeters = exercises.some((exercise) => exercise.tracking === "distance") ? exercises.reduce((total, exercise) => total + (exercise.tracking === "distance" ? exercise.sets * (Number.parseFloat(exercise.plannedReps) || 0) : 0), 0) : day.distanceMeters;
    return {
      ...day,
      week,
      date: dateForWeekday(week, weekday),
      status: week === 1 && weekday === 0 ? "today" as const : day.status === "today" ? "planned" as const : day.status,
      programId: !day.programId || week <= 2 ? day.programId : `${day.programId}-w${week}`,
      focus: day.status === "rest" ? day.focus : `${progression.phase} · ${day.focus}`,
      intensity: day.status === "rest" ? day.intensity : progression.intensity,
      phase: progression.phase,
      progressionNote: progression.summary,
      exercises,
      distanceMeters,
    };
  });
}).flat();

export const twoWeekPlan: ProgramDay[] = extendPlanToTwelveWeeks(originalTwoWeekPlan);
export const twelveWeekPlan = twoWeekPlan;

export const todayProgram = twoWeekPlan[0];

export function getProgram(programId: string) {
  return twoWeekPlan.find((day) => day.programId === programId);
}

export function countProgramSets(day: ProgramDay) {
  return day.exercises.reduce((total, item) => total + item.sets, 0);
}
