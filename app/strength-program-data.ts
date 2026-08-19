import { extendPlanToTwelveWeeks, type ProgramDay, type SessionExercise } from "./program-data";
import type { StrengthProfile } from "./sport-catalog";
import { clarifyUnilateralReps } from "./exercise-units";

const strength = (name: string, sets: number, reps: string, weight: string, restSeconds: number, focus: string): SessionExercise => {
  const clearReps = clarifyUnilateralReps(name, reps);
  return {
  name,
  sets,
  plannedReps: clearReps,
  defaultWeight: weight,
  focus,
  tracking: "load",
  effortMetric: "rir",
  effortTarget: "2–4 RIR",
  restSeconds,
  detail: `${sets} × ${clearReps} · ${weight} kg · ${restSeconds} sek pause`,
};
};

type StrengthSession = {
  title: string;
  focus: string;
  duration: number;
  intensity: string;
  exercises: SessionExercise[];
};

const calendar = [
  { week: 1 as const, day: "TIRSDAG", date: "11. AUG" }, { week: 1 as const, day: "ONSDAG", date: "12. AUG" },
  { week: 1 as const, day: "TORSDAG", date: "13. AUG" }, { week: 1 as const, day: "FREDAG", date: "14. AUG" },
  { week: 1 as const, day: "LØRDAG", date: "15. AUG" }, { week: 1 as const, day: "SØNDAG", date: "16. AUG" },
  { week: 1 as const, day: "MANDAG", date: "17. AUG" }, { week: 2 as const, day: "TIRSDAG", date: "18. AUG" },
  { week: 2 as const, day: "ONSDAG", date: "19. AUG" }, { week: 2 as const, day: "TORSDAG", date: "20. AUG" },
  { week: 2 as const, day: "FREDAG", date: "21. AUG" }, { week: 2 as const, day: "LØRDAG", date: "22. AUG" },
  { week: 2 as const, day: "SØNDAG", date: "23. AUG" }, { week: 2 as const, day: "MANDAG", date: "24. AUG" },
];

const trainingDays = new Set([0, 2, 4, 7, 9, 11]);

const makeStrengthPlan = (profile: StrengthProfile, sessions: StrengthSession[]): ProgramDay[] => {
  let sessionIndex = 0;
  return calendar.map((date, dayIndex) => {
    if (!trainingDays.has(dayIndex)) {
      return { ...date, programId: null, status: "rest", title: "Ingen styrketræning", focus: profile === "recreational" ? "Restitution, gåtur eller let bevægelse efter behov" : "Svømmetræning og restitution efter trænerens plan", duration: 0, intensity: "Hvile", exercises: [] };
    }
    const session = sessions[sessionIndex];
    sessionIndex += 1;
    return { ...date, ...session, programId: `strength-${profile}-w${date.week}-s${sessionIndex}`, status: dayIndex === 0 ? "today" : "planned" };
  });
};

const longDistanceStrength: StrengthSession[] = [
  { title: "Styrkeudholdenhed A", focus: "Trækstyrke, hoftestabilitet og robust kropslinje", duration: 55, intensity: "Moderat", exercises: [strength("Romanian deadlift", 3, "8", "60", 75, "Kontrolleret bagkæde"), strength("Pull-up", 3, "6", "0", 75, "Aktive skuldre"), strength("Split squat", 3, "8", "24", 60, "Stabilt knæ"), strength("Pallof press", 3, "10", "12", 45, "Modstå rotation"), strength("Band external rotation", 3, "12", "5", 30, "Rolig skulderkontrol")] },
  { title: "Skulder & core", focus: "Holdning og skulderkontrol til længere arbejde", duration: 50, intensity: "Let/moderat", exercises: [strength("Seated cable row", 4, "10", "35", 60, "Saml skulderbladene"), strength("Push-up", 3, "10", "0", 60, "Stabil kropslinje"), strength("Single-leg Romanian deadlift", 3, "8", "20", 60, "Kontroller hoften"), strength("Dead bug", 3, "10", "0", 30, "Rolig vejrtrækning"), strength("Side plank", 3, "30 sek", "0", 30, "Lang kropslinje")] },
  { title: "Ben & ryg", focus: "Udholdende kraft uden unødig træthed", duration: 60, intensity: "Moderat", exercises: [strength("Front squat", 4, "6", "55", 90, "Høj torso"), strength("Lat pulldown", 4, "10", "40", 60, "Træk med ryggen"), strength("Bulgarian split squat", 3, "8 pr. ben", "20", 60, "Jævn kontrol"), strength("Calf raise", 3, "12", "30", 45, "Fuld bevægelse"), strength("Plank", 3, "40 sek", "0", 30, "Stabil vejrtrækning")] },
  { title: "Styrkeudholdenhed B", focus: "Gentagelig kvalitet i hele kroppen", duration: 55, intensity: "Moderat", exercises: [strength("Romanian deadlift", 4, "8", "62.5", 75, "Lang ryg"), strength("Seated cable row", 4, "10", "37.5", 60, "Kontrolleret træk"), strength("Half-kneeling landmine press", 3, "8", "20", 60, "Ribben ned"), strength("Copenhagen plank", 3, "20 sek", "0", 30, "Stabil hofte"), strength("Band external rotation", 3, "12", "5", 30, "Let modstand")] },
  { title: "Ensidig kontrol", focus: "Stabilitet omkring hofte, knæ og skulder", duration: 50, intensity: "Let/moderat", exercises: [strength("Split squat", 4, "8", "26", 60, "Stabil fod"), strength("Pull-up", 4, "6", "0", 75, "Rolig sænkning"), strength("Push-up", 4, "10", "0", 60, "Fast core"), strength("Pallof press", 3, "12", "12", 45, "Ingen rotation"), strength("Bird dog", 3, "10", "0", 30, "Rolig kontrol")] },
  { title: "Kontrolleret afslutning", focus: "Sammenlign kvalitet og RIR med uge ét", duration: 55, intensity: "Moderat", exercises: [strength("Front squat", 3, "6", "57.5", 90, "Samme dybde"), strength("Lat pulldown", 3, "10", "42.5", 60, "Stabil skulder"), strength("Romanian deadlift", 3, "8", "65", 75, "Kontrolleret tempo"), strength("Dead bug", 3, "10", "0", 30, "Hold lænden"), strength("Side plank", 3, "35 sek", "0", 30, "Lang linje")] },
];

const middleDistanceStrength: StrengthSession[] = [
  { title: "Helkropsstyrke A", focus: "Ben, træk og stabilitet til gentagen høj fart", duration: 60, intensity: "Moderat/hård", exercises: [strength("Front squat", 4, "5", "65", 105, "Eksplosiv op"), strength("Pull-up", 4, "5", "0", 90, "Aktive skuldre"), strength("Bench press", 3, "6", "50", 90, "Stabil skulder"), strength("Romanian deadlift", 3, "6", "70", 90, "Kraftfuld hofte"), strength("Pallof press", 3, "10", "14", 45, "Stabil torso")] },
  { title: "Power & skulder", focus: "Hurtig kraft med kontrolleret skulderarbejde", duration: 55, intensity: "Power", exercises: [strength("Box jump", 5, "3", "0", 90, "Maksimal kvalitet"), strength("Medicine ball slam", 4, "6", "6", 60, "Eksplosiv afslutning"), strength("Half-kneeling landmine press", 4, "6", "25", 75, "Stabil torso"), strength("Seated cable row", 4, "8", "42.5", 75, "Hurtigt ind, roligt ud"), strength("Band external rotation", 3, "12", "5", 30, "Skulderkontrol")] },
  { title: "Helkropsstyrke B", focus: "Ensidig styrke og robust bagkæde", duration: 60, intensity: "Moderat/hård", exercises: [strength("Back squat", 4, "5", "75", 105, "Stabil bund"), strength("Bulgarian split squat", 3, "6 pr. ben", "28", 75, "Kontrolleret knæ"), strength("Lat pulldown", 4, "8", "45", 75, "Fast greb"), strength("Push-up", 4, "8", "0", 60, "Eksplosiv op"), strength("Copenhagen plank", 3, "20 sek", "0", 30, "Stabil hofte")] },
  { title: "Power & træk", focus: "Overfør kraft hurtigt uden at jage udmattelse", duration: 55, intensity: "Power", exercises: [strength("Box jump", 5, "3", "0", 90, "Friske gentagelser"), strength("Medicine ball slam", 5, "5", "6", 60, "Maksimal hastighed"), strength("Pendlay row", 4, "6", "50", 90, "Eksplosivt træk"), strength("Half-kneeling landmine press", 3, "6", "27.5", 75, "Fast core"), strength("Dead bug", 3, "8", "0", 30, "Kontrol") ] },
  { title: "Styrke omkring race pace", focus: "Lav volumen og høj kvalitet mellem fartpas", duration: 50, intensity: "Moderat", exercises: [strength("Front squat", 3, "4", "70", 105, "Kraftfuld op"), strength("Pull-up", 3, "5", "0", 90, "Ingen kip"), strength("Bench press", 3, "5", "52.5", 90, "Rolig sænkning"), strength("Single-leg Romanian deadlift", 3, "6", "24", 60, "Stabil hofte"), strength("Pallof press", 3, "10", "14", 45, "Fast torso")] },
  { title: "Kvalitetstest", focus: "Gentag uge ét med samme teknik og registrér RIR", duration: 55, intensity: "Moderat/hård", exercises: [strength("Back squat", 3, "5", "77.5", 105, "Ens gentagelser"), strength("Seated cable row", 3, "8", "45", 75, "Stabil ryg"), strength("Push-up", 3, "10", "0", 60, "Fast linje"), strength("Medicine ball slam", 4, "5", "6", 60, "Hurtige kast"), strength("Side plank", 3, "30 sek", "0", 30, "Stabil core")] },
];

const sprintStrength: StrengthSession[] = [
  { title: "Maksimal styrke A", focus: "Høj kraft i ben og overkrop med fulde pauser", duration: 65, intensity: "Tung", exercises: [strength("Back squat", 5, "3", "90", 150, "Eksplosiv op"), strength("Bench press", 5, "3", "60", 135, "Stabil skulder"), strength("Pull-up", 4, "4", "0", 120, "Tilføj vægt hvis let"), strength("Romanian deadlift", 4, "5", "80", 120, "Kraftfuld hofte"), strength("Pallof press", 3, "8", "16", 45, "Fast torso")] },
  { title: "Eksplosiv power A", focus: "Maksimal bevægelseshastighed og lange pauser", duration: 55, intensity: "Power", exercises: [strength("Box jump", 6, "3", "0", 120, "Stop ved faldende højde"), strength("Medicine ball slam", 6, "4", "8", 75, "Maksimal hastighed"), strength("Push press", 5, "3", "40", 120, "Hurtigt ben-drive"), strength("Pendlay row", 4, "4", "55", 105, "Eksplosivt træk"), strength("Dead bug", 3, "8", "0", 30, "Stabil core")] },
  { title: "Maksimal styrke B", focus: "Ensidig benkraft og stærkt træk", duration: 65, intensity: "Tung", exercises: [strength("Front squat", 5, "3", "80", 150, "Høj torso"), strength("Bulgarian split squat", 4, "5 pr. ben", "34", 90, "Eksplosiv op"), strength("Lat pulldown", 5, "5", "55", 105, "Tungt kontrolleret træk"), strength("Half-kneeling landmine press", 4, "5", "32.5", 90, "Fast torso"), strength("Copenhagen plank", 3, "20 sek", "0", 30, "Stabil hofte")] },
  { title: "Eksplosiv power B", focus: "Reaktiv kraft uden ophobet træthed", duration: 55, intensity: "Power", exercises: [strength("Box jump", 6, "2", "0", 120, "Maksimal højde"), strength("Medicine ball slam", 6, "4", "8", 75, "Hurtig kraft"), strength("Push press", 5, "2", "45", 120, "Eksplosivt"), strength("Pull-up", 4, "4", "0", 105, "Hurtigt op"), strength("Band external rotation", 3, "10", "5", 30, "Let kontrol")] },
  { title: "Tung kvalitet", focus: "Få stærke gentagelser med fuld kontrol", duration: 60, intensity: "Tung", exercises: [strength("Back squat", 4, "3", "92.5", 150, "Ingen langsomme reps"), strength("Bench press", 4, "3", "62.5", 135, "Fast opsætning"), strength("Romanian deadlift", 3, "4", "85", 120, "Kraftfuld hofte"), strength("Seated cable row", 4, "5", "50", 90, "Stabil ryg"), strength("Side plank", 3, "25 sek", "0", 30, "Fast core")] },
  { title: "Power-test", focus: "Sammenlign fart og RIR med første uge", duration: 50, intensity: "Power", exercises: [strength("Box jump", 5, "3", "0", 120, "Samme højde hver gang"), strength("Medicine ball slam", 5, "4", "8", 75, "Maksimal fart"), strength("Push press", 4, "3", "45", 120, "Hurtig stang"), strength("Pull-up", 3, "4", "0", 105, "Ren teknik"), strength("Pallof press", 3, "8", "16", 45, "Stabil torso")] },
];

const recreationalStrength: StrengthSession[] = [
  { title: "Helkrop A", focus: "Lær bevægelserne og afslut med overskud", duration: 45, intensity: "Let/moderat", exercises: [strength("Goblet squat", 3, "8", "16", 75, "Rolig ned, stabil op"), strength("Seated cable row", 3, "10", "30", 60, "Saml skulderbladene"), strength("Push-up", 3, "8", "0", 60, "Fast kropslinje"), strength("Romanian deadlift", 3, "8", "40", 75, "Skub hoften tilbage"), strength("Dead bug", 3, "8", "0", 30, "Rolig vejrtrækning")] },
  { title: "Helkrop B", focus: "Ben, pres og træk med kontrolleret teknik", duration: 45, intensity: "Moderat", exercises: [strength("Split squat", 3, "8", "12", 60, "Stabilt knæ"), strength("Lat pulldown", 3, "10", "35", 60, "Træk albuerne ned"), strength("Incline dumbbell bench press", 3, "8", "20", 75, "Rolig sænkning"), strength("Glute bridge", 3, "12", "0", 45, "Spænd balderne"), strength("Side plank", 3, "20 sek", "0", 30, "Lang kropslinje")] },
  { title: "Helkrop C", focus: "Gentagelig styrke og god bevægelseskvalitet", duration: 50, intensity: "Moderat", exercises: [strength("Leg press", 3, "10", "60", 75, "Kontrolleret dybde"), strength("Seated cable row", 3, "10", "32.5", 60, "Stabil overkrop"), strength("Half-kneeling landmine press", 3, "8", "15", 60, "Ribben ned"), strength("Romanian deadlift", 3, "8", "42.5", 75, "Lang ryg"), strength("Farmer's walk", 3, "30 m", "24", 45, "Gå højt og roligt")] },
  { title: "Helkrop A · progression", focus: "Lidt mere arbejde med samme tekniske ro", duration: 45, intensity: "Moderat", exercises: [strength("Goblet squat", 3, "10", "16", 75, "Samme dybde hver gang"), strength("Seated cable row", 3, "10", "32.5", 60, "Saml skulderbladene"), strength("Push-up", 3, "10", "0", 60, "Stop før teknikken falder"), strength("Romanian deadlift", 3, "8", "42.5", 75, "Kontrolleret bagkæde"), strength("Dead bug", 3, "10", "0", 30, "Hold lænden rolig")] },
  { title: "Helkrop B · progression", focus: "Byg sikker styrke uden at træne til udmattelse", duration: 45, intensity: "Moderat", exercises: [strength("Split squat", 3, "8", "14", 60, "Tryk gennem hele foden"), strength("Lat pulldown", 3, "10", "37.5", 60, "Rolig retur"), strength("Incline dumbbell bench press", 3, "8", "22", 75, "Stabile skuldre"), strength("Glute bridge", 3, "15", "0", 45, "Fuld hofte"), strength("Side plank", 3, "25 sek", "0", 30, "Rolig vejrtrækning")] },
  { title: "Rolig afslutning", focus: "Sammenlign teknik, energi og RIR med første uge", duration: 45, intensity: "Let/moderat", exercises: [strength("Leg press", 3, "10", "65", 75, "Jævn bevægelse"), strength("Seated cable row", 3, "10", "35", 60, "Kontrolleret træk"), strength("Half-kneeling landmine press", 3, "8", "17.5", 60, "Fast core"), strength("Romanian deadlift", 3, "8", "45", 75, "Stop med overskud"), strength("Farmer's walk", 3, "30 m", "26", 45, "Stabil holdning")] },
];

export const swimmerStrengthPlans: Record<StrengthProfile, ProgramDay[]> = {
  long_distance: extendPlanToTwelveWeeks(makeStrengthPlan("long_distance", longDistanceStrength)),
  middle_distance: extendPlanToTwelveWeeks(makeStrengthPlan("middle_distance", middleDistanceStrength)),
  sprint: extendPlanToTwelveWeeks(makeStrengthPlan("sprint", sprintStrength)),
  recreational: extendPlanToTwelveWeeks(makeStrengthPlan("recreational", recreationalStrength)),
};

export const getSwimmerStrengthPlan = (profile: StrengthProfile) => swimmerStrengthPlans[profile];
export const getStrengthProgram = (programId: string) => Object.values(swimmerStrengthPlans).flat().find((day) => day.programId === programId);
