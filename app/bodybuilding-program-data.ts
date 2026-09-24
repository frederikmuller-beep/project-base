import type { ProgramDay, SessionExercise } from "./program-data";

type BodybuildingExercise = [name: string, reps: string, weight: string, focus: string, role?: "main" | "assistance"];

const sessions: Array<{ title: string; focus: string; duration: number; exercises: BodybuildingExercise[] }> = [
  { title: "Push · brystfokus", focus: "Brystvolumen med sekundært arbejde til sidedelt og triceps", duration: 80, exercises: [
    ["Bænkpres", "6–8", "70", "Stabil opsætning og kontrolleret bundposition", "main"], ["Incline dumbbell bench press", "8–10", "24", "Øvre bryst gennem fuldt bevægeudslag", "main"], ["Cable fly", "12–15", "15", "Konstant spænding og kontrolleret stræk"], ["Cable lateral raise", "12–20", "7.5", "Sidedelt uden momentum"], ["Cable triceps extension", "10–15", "25", "Fuld albuestrækning"], ["Overhead cable triceps extension", "12–15", "20", "Triceps i lang muskellængde"],
  ] },
  { title: "Pull · rygfokus", focus: "Rygbredde og -tykkelse med målrettet arbejde til bagskulder og biceps", duration: 80, exercises: [
    ["Pull-up", "6–10", "0", "Skulderblad ned før albuen trækkes", "main"], ["Chest-supported dumbbell row", "8–10", "24", "Stabil overkrop og fuldt træk", "main"], ["Lat pulldown", "10–12", "45", "Albuer mod hoften"], ["Reverse pec deck", "12–20", "25", "Bagskulder uden at overstrække ryggen"], ["EZ-bar curl", "8–12", "25", "Stille overarm og kontrolleret excentrisk"], ["Incline dumbbell curl", "10–15", "10", "Belastet stræk uden skulderbevægelse"],
  ] },
  { title: "Ben · quadriceps", focus: "Høj quadricepsspænding med tilstrækkelig baglårs- og lægvolumen", duration: 85, exercises: [
    ["Back squat", "6–8", "90", "Ensartet dybde og stabil bracing", "main"], ["Hack squat", "8–10", "80", "Knæ frem og kontrolleret bundposition", "main"], ["Leg press", "10–15", "120", "Fuldt bevægeudslag uden bækkenkip"], ["Leg extension", "12–15", "35", "Kontrolleret topkontraktion"], ["Lying leg curl", "10–15", "30", "Hoften stabil gennem hele sættet"], ["Standing calf raise", "8–12", "60", "Pause i top og fuldt stræk"],
  ] },
  { title: "Overkrop · skuldre & arme", focus: "Ekstra frekvens til delts og arme uden at gentage push/pull-dagen", duration: 75, exercises: [
    ["Machine shoulder press", "6–10", "40", "Stabil presbane og kontrolleret bund", "main"], ["Seated cable row", "8–12", "45", "Træk skulderbladene tilbage uden momentum", "main"], ["Pec deck", "10–15", "35", "Brystarbejde med lav stabilitetspris"], ["Cable lateral raise", "12–20", "7.5", "Kontrolleret sidedeltarbejde"], ["Cable hammer curl", "10–15", "20", "Neutralt greb og stabile albuer"], ["Overhead cable triceps extension", "10–15", "20", "Fuld længde og rolig excentrisk"],
  ] },
  { title: "Ben · bagkæde", focus: "Baglår, balder og lægge med supplerende ensidig styrke", duration: 80, exercises: [
    ["Romanian deadlift", "6–10", "80", "Hofte tilbage og kontrolleret stræk", "main"], ["Hip thrust", "8–12", "90", "Fuld hofteekstension uden lændeoverstræk", "main"], ["Bulgarian split squat", "8–12 pr. ben", "20", "Stabilt knæ og ensartet dybde"], ["Seated leg curl", "10–15", "35", "Arbejd gennem fuldt bevægeudslag"], ["Seated calf raise", "12–20", "40", "Rolig bundposition uden bounce"], ["Cable crunch", "10–15", "30", "Rul brystkassen mod bækkenet"],
  ] },
];

const weekPrescription = (week: number) => {
  if (week === 4 || week === 8 || week === 12) return { phase: "Deload", setDelta: -2, load: 0.9, rir: "4–5 RIR", note: "Halveret arbejdsmængde sænker træthed og bevarer bevægelseskvalitet." };
  if (week <= 3) return { phase: "Akkumulering", setDelta: week === 3 ? 1 : 0, load: 1 + (week - 1) * 0.025, rir: week === 1 ? "3 RIR" : "2–3 RIR", note: "Byg gentagelser og arbejdssæt, før belastningen løftes." };
  if (week <= 7) return { phase: "Overload", setDelta: week === 7 ? 1 : 0, load: 1.05 + (week - 5) * 0.025, rir: week === 7 ? "1–2 RIR" : "2 RIR", note: "Progressér vægt eller gentagelser, når alle sæt rammer teknik- og RIR-målet." };
  return { phase: "Intensivering", setDelta: 0, load: 1.1 + (week - 9) * 0.025, rir: week === 11 ? "1 RIR" : "1–2 RIR", note: "Høj indsats med uændret teknik; kun sidste isolationssæt må nærme sig 0 RIR." };
};

const roundLoad = (value: number) => Math.round(value / (value < 40 ? 0.5 : 2.5)) * (value < 40 ? 0.5 : 2.5);

const makeExercise = (exercise: BodybuildingExercise, week: number, index: number): SessionExercise => {
  const [name, plannedReps, baseWeight, focus, role = "assistance"] = exercise;
  const prescription = weekPrescription(week);
  const baseSets = role === "main" ? 4 : 3;
  const sets = Math.max(2, baseSets + prescription.setDelta);
  const numericWeight = Number(baseWeight);
  const defaultWeight = numericWeight > 0 ? String(roundLoad(numericWeight * prescription.load)) : baseWeight;
  const effortTarget = prescription.rir;
  return {
    name, sets, plannedReps, defaultWeight, focus,
    tracking: "load", restSeconds: role === "main" ? 150 : 75,
    effortMetric: "rir", effortTarget,
    programRole: role === "main" ? "main" : index >= 4 ? "sport_specific" : "assistance",
    detail: `${role === "main" ? "Hovedøvelse" : "Hypertrofi"} · ${sets} × ${plannedReps} · ${defaultWeight} kg · ${effortTarget}`,
  };
};

const weekdays = ["MANDAG", "TIRSDAG", "TORSDAG", "FREDAG", "LØRDAG"];

export const bodybuildingPlan: ProgramDay[] = Array.from({ length: 12 }, (_, weekIndex) => {
  const week = weekIndex + 1;
  const prescription = weekPrescription(week);
  const training = sessions.map((session, sessionIndex): ProgramDay => ({
    programId: `base-bodybuilding-w${week}-s${sessionIndex + 1}`,
    week,
    day: weekdays[sessionIndex],
    date: `UGE ${week}`,
    status: week === 1 && sessionIndex === 0 ? "today" : "planned",
    title: `Bodybuilding · ${session.title}`,
    focus: `${prescription.phase} · ${session.focus}`,
    duration: session.duration,
    intensity: prescription.rir,
    phase: prescription.phase,
    progressionNote: prescription.note,
    exercises: session.exercises.map((exercise, index) => makeExercise(exercise, week, index)),
  }));
  const rest = ["ONSDAG", "SØNDAG"].map((day): ProgramDay => ({ programId: null, week, day, date: `UGE ${week}`, status: "rest", title: "Hviledag", focus: "Restitution, søvn og tilstrækkelig ernæring", duration: 0, exercises: [] }));
  return [...training, ...rest];
}).flat();

