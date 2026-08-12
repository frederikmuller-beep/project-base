import { twoWeekPlan, type ProgramDay, type SessionExercise } from "./program-data";
import { getSwimmerStrengthPlan } from "./strength-program-data";

export type SwimProfile = "long_distance" | "middle_distance" | "sprint";
export type StrengthProfile = SwimProfile | "recreational";
export type TrainingProfile = "weightlifting" | StrengthProfile;

export const swimProfileOptions: Array<{ id: SwimProfile; label: string; short: string; description: string }> = [
  { id: "long_distance", label: "Langdistance", short: "LANG", description: "Længere aerobe serier, stabil fart og effektiv teknik." },
  { id: "middle_distance", label: "Mellemdistance", short: "MELLEM", description: "Tærskel, temposkift og fart omkring konkurrencetempo." },
  { id: "sprint", label: "Sprint", short: "SPRINT", description: "Korte kvalitetsintervaller, maksimal fart og lange pauser." },
];

export const trainingProfileOptions: Array<{ id: TrainingProfile; label: string; short: string; description: string }> = [
  { id: "weightlifting", label: "Vægtløftning", short: "VL", description: "Det oprindelige BASE-program med teknik, styrke og konkurrenceløft." },
  { id: "long_distance", label: "Langdistance", short: "LANG", description: "Styrkeudholdenhed, holdning og stabilitet til længere svømmearbejde." },
  { id: "middle_distance", label: "Mellemdistance", short: "MELLEM", description: "Helkropsstyrke og power til gentagen fart." },
  { id: "sprint", label: "Sprint", short: "SPRINT", description: "Maksimal styrke og eksplosiv power med lange pauser." },
  { id: "recreational", label: "Motionist", short: "MOTION", description: "Enkel helkropsstyrke til sundhed, robusthed og en stabil træningsrytme." },
];

export const trainingProfileLabel = (profile: TrainingProfile | null | undefined) =>
  trainingProfileOptions.find((option) => option.id === profile)?.label ?? "Ikke valgt";

export const swimProfileLabel = trainingProfileLabel;

const swim = (name: string, sets: number, meters: number, restSeconds: number, focus: string): SessionExercise => ({
  name,
  sets,
  plannedReps: `${meters} m`,
  defaultWeight: "0",
  focus,
  tracking: "distance",
  effortMetric: "heart_rate_zone",
  effortTarget: "Efter passets mål",
  restSeconds,
  detail: `${sets} × ${meters} m · ${restSeconds} sek pause`,
});

type SwimSession = {
  title: string;
  focus: string;
  duration: number;
  intensity: string;
  exercises: SessionExercise[];
};

const calendar = [
  { week: 1 as const, day: "TIRSDAG", date: "11. AUG" },
  { week: 1 as const, day: "ONSDAG", date: "12. AUG" },
  { week: 1 as const, day: "TORSDAG", date: "13. AUG" },
  { week: 1 as const, day: "FREDAG", date: "14. AUG" },
  { week: 1 as const, day: "LØRDAG", date: "15. AUG" },
  { week: 1 as const, day: "SØNDAG", date: "16. AUG" },
  { week: 1 as const, day: "MANDAG", date: "17. AUG" },
  { week: 2 as const, day: "TIRSDAG", date: "18. AUG" },
  { week: 2 as const, day: "ONSDAG", date: "19. AUG" },
  { week: 2 as const, day: "TORSDAG", date: "20. AUG" },
  { week: 2 as const, day: "FREDAG", date: "21. AUG" },
  { week: 2 as const, day: "LØRDAG", date: "22. AUG" },
  { week: 2 as const, day: "SØNDAG", date: "23. AUG" },
  { week: 2 as const, day: "MANDAG", date: "24. AUG" },
];

const restDays = new Set([3, 6, 10, 13]);

const makePlan = (profile: SwimProfile, sessions: SwimSession[]): ProgramDay[] => {
  let sessionIndex = 0;
  return calendar.map((date, dayIndex) => {
    if (restDays.has(dayIndex)) {
      return { ...date, programId: null, status: "rest", title: "Hviledag", focus: "Restitution, søvn og let bevægelse efter behov", duration: 0, intensity: "Hvile", distanceMeters: 0, exercises: [] };
    }
    const session = sessions[sessionIndex];
    const currentIndex = sessionIndex;
    sessionIndex += 1;
    return {
      ...date,
      ...session,
      exercises: session.exercises.map((exercise) => ({
        ...exercise,
        effortTarget: session.intensity === "Restitution" ? "Pulszone 1–2" : exercise.effortTarget,
      })),
      programId: `${profile}-w${date.week}-s${currentIndex + 1}`,
      status: dayIndex === 0 ? "today" : session.intensity === "Restitution" ? "recovery" : "planned",
      distanceMeters: session.exercises.reduce((total, exercise) => total + exercise.sets * Number.parseFloat(exercise.plannedReps), 0),
    };
  });
};

const longDistanceSessions: SwimSession[] = [
  { title: "Aerob base", focus: "Rolig rytme og ensartede splittider", duration: 75, intensity: "Aerob", exercises: [swim("Indsvømning", 4, 100, 20, "Lang udånding og afslappet rytme"), swim("Crawl catch-up", 4, 50, 20, "Stabil kropslinje"), swim("Aerob crawl", 6, 300, 30, "Samme tempo fra start til slut"), swim("Udsvømning", 4, 50, 15, "Meget roligt") ] },
  { title: "Teknik under distance", focus: "Bevar grebet når serien bliver længere", duration: 70, intensity: "Let/moderat", exercises: [swim("Crawl med knyttede næver", 4, 50, 20, "Mærk underarmens tryk"), swim("Sculling foran", 4, 50, 20, "Tidligt indgreb"), swim("Crawl med pull buoy", 5, 300, 30, "Langt og roligt træk"), swim("Sidekick", 4, 50, 20, "Høj hofte") ] },
  { title: "Tærskelkontrol", focus: "Kontrolleret hårdt uden farttab", duration: 80, intensity: "Tærskel", exercises: [swim("Indsvømning", 4, 100, 20, "Byg tempo gradvist"), swim("Tærskel crawl", 8, 200, 25, "Stabile splittider"), swim("Teknikcrawl med paddles", 4, 100, 30, "Fast greb uden at forcere"), swim("Udsvømning", 4, 50, 15, "Sænk pulsen") ] },
  { title: "Lang serie", focus: "Pacing og koncentration over tid", duration: 85, intensity: "Aerob", exercises: [swim("Indsvømning", 5, 100, 20, "Find rytmen"), swim("Aerob crawl", 4, 500, 40, "Negativ split"), swim("Benspark med plade", 6, 50, 25, "Små spark fra hoften"), swim("Crawl fingertip drag", 4, 50, 20, "Afslappet fremføring") ] },
  { title: "Progressiv fart", focus: "Afslut stærkere end du starter", duration: 75, intensity: "Moderat/hård", exercises: [swim("Indsvømning", 4, 100, 20, "Rolig åbning"), swim("Aerob crawl", 6, 200, 25, "Hver anden hurtigere"), swim("Race pace", 8, 50, 30, "Kontrolleret fart"), swim("Udsvømning", 4, 50, 15, "Rolig teknik") ] },
  { title: "Aktiv restitution", focus: "Vandføling og bevægelseskvalitet", duration: 45, intensity: "Restitution", exercises: [swim("Indsvømning", 4, 100, 20, "Meget roligt"), swim("Sculling midt", 4, 50, 20, "Bløde bevægelser"), swim("6-1-6 sideskift", 4, 50, 20, "Balance og rotation"), swim("Udsvømning", 4, 100, 15, "Afslappet") ] },
  { title: "Aerob overdistance", focus: "Tålmodighed og stabil mekanik", duration: 90, intensity: "Aerob", exercises: [swim("Indsvømning", 5, 100, 20, "Lang rytme"), swim("Crawl med pull buoy", 3, 600, 45, "Ensartet træk"), swim("Aerob crawl", 4, 300, 30, "Hold teknikken"), swim("Udsvømning", 4, 50, 15, "Let") ] },
  { title: "Tærskelblokke", focus: "Arbejd tæt på tærskel med korte pauser", duration: 80, intensity: "Tærskel", exercises: [swim("Indsvømning", 4, 100, 20, "Progressivt"), swim("Tærskel crawl", 12, 100, 15, "Præcise splittider"), swim("Teknikcrawl med paddles", 6, 100, 25, "Stabilt greb"), swim("Udsvømning", 4, 50, 15, "Roligt") ] },
  { title: "Pace-skift", focus: "Skift fart uden at miste længde", duration: 75, intensity: "Moderat/hård", exercises: [swim("Indsvømning", 4, 100, 20, "Rolig"), swim("Aerob crawl", 6, 200, 25, "50 rolig / 50 hurtig"), swim("Race pace", 10, 50, 25, "Konkurrencefrekvens"), swim("Crawl catch-up", 4, 50, 20, "Find længden igen") ] },
  { title: "Kontrolleret test", focus: "Sammenlign tempo og oplevet anstrengelse", duration: 70, intensity: "Test", exercises: [swim("Indsvømning", 5, 100, 20, "Forbered kroppen"), swim("Aerob crawl", 1, 1500, 90, "Jævnt testtempo"), swim("Crawl med pull buoy", 4, 100, 25, "Teknisk kontrol"), swim("Udsvømning", 4, 100, 15, "Meget roligt") ] },
];

const middleDistanceSessions: SwimSession[] = [
  { title: "Teknik & tempo", focus: "Find et effektivt tempo omkring 200-fart", duration: 70, intensity: "Moderat", exercises: [swim("Indsvømning", 4, 100, 20, "Byg tempo"), swim("Crawl catch-up", 4, 50, 20, "Kontrolleret timing"), swim("Race pace", 8, 100, 35, "Stabil 200-fart"), swim("Udsvømning", 4, 50, 15, "Roligt") ] },
  { title: "Aerob støtte", focus: "Kapacitet mellem fartpassene", duration: 70, intensity: "Aerob", exercises: [swim("Indsvømning", 4, 100, 20, "Afslappet"), swim("Aerob crawl", 6, 200, 25, "Jævne splittider"), swim("Crawl med pull buoy", 4, 150, 30, "Stabilt greb"), swim("Sidekick", 4, 50, 20, "Kropslinje") ] },
  { title: "Tærskel & afslutning", focus: "Hold teknikken og accelerér de sidste meter", duration: 80, intensity: "Tærskel", exercises: [swim("Indsvømning", 5, 100, 20, "Progressivt"), swim("Tærskel crawl", 10, 100, 20, "Kontrolleret hårdt"), swim("Race pace", 8, 50, 35, "Hurtig afslutning"), swim("Udsvømning", 4, 50, 15, "Sænk pulsen") ] },
  { title: "200-special", focus: "Fartkontrol gennem fire 50’ere", duration: 75, intensity: "Race pace", exercises: [swim("Indsvømning", 4, 100, 20, "Klar til fart"), swim("Race pace", 4, 200, 60, "Del løbet korrekt"), swim("Sprint fra afsæt", 8, 25, 50, "Hurtigt men rent"), swim("Udsvømning", 4, 100, 15, "Let") ] },
  { title: "Ben & undervand", focus: "Fart fra ben og effektiv streamline", duration: 65, intensity: "Moderat/hård", exercises: [swim("Benspark med plade", 8, 50, 25, "Stabil frekvens"), swim("Delfinbenspark på ryggen", 8, 25, 30, "Stram streamline"), swim("Streamline-benspark på ryggen", 6, 50, 25, "Høj hofte"), swim("Aerob crawl", 4, 200, 25, "Rolig afslutning") ] },
  { title: "Aktiv restitution", focus: "Teknik, balance og let cirkulation", duration: 45, intensity: "Restitution", exercises: [swim("Indsvømning", 4, 100, 20, "Roligt"), swim("Sculling foran", 4, 50, 20, "Vandføling"), swim("6-1-6 sideskift", 4, 50, 20, "Kontrolleret rotation"), swim("Udsvømning", 4, 100, 15, "Let") ] },
  { title: "Broken race", focus: "Konkurrencefart i opdelte blokke", duration: 80, intensity: "Race pace", exercises: [swim("Indsvømning", 5, 100, 20, "Progressivt"), swim("Race pace", 12, 50, 30, "Præcis fart"), swim("Tærskel crawl", 6, 100, 20, "Hold trykket"), swim("Udsvømning", 4, 50, 15, "Roligt") ] },
  { title: "Tærskel 200", focus: "Robust fart og korte pauser", duration: 80, intensity: "Tærskel", exercises: [swim("Indsvømning", 4, 100, 20, "Find rytmen"), swim("Tærskel crawl", 6, 200, 25, "Ensartede splittider"), swim("Teknikcrawl med paddles", 6, 100, 30, "Fast greb"), swim("Udsvømning", 4, 50, 15, "Let") ] },
  { title: "Fartreserve", focus: "Høj fart med bevaret teknik", duration: 65, intensity: "Hård", exercises: [swim("Indsvømning", 4, 100, 20, "Progressivt"), swim("Sprint fra afsæt", 12, 25, 45, "Maksimal kvalitet"), swim("Race pace", 8, 75, 40, "Kontrolleret høj fart"), swim("Udsvømning", 6, 50, 20, "God restitution") ] },
  { title: "200-test", focus: "Test pacing, teknik og pulszone", duration: 65, intensity: "Test", exercises: [swim("Indsvømning", 6, 100, 20, "Kom gradvist op i fart"), swim("Race pace", 1, 200, 120, "Kontrolleret testløb"), swim("Aerob crawl", 6, 100, 20, "Aktiv restitution"), swim("Udsvømning", 4, 100, 15, "Meget roligt") ] },
];

const sprintSessions: SwimSession[] = [
  { title: "Acceleration", focus: "Maksimal fart med fuld teknisk kontrol", duration: 60, intensity: "Sprint", exercises: [swim("Indsvømning", 4, 100, 20, "Progressivt"), swim("Sprint fra afsæt", 12, 25, 60, "Eksplosiv acceleration"), swim("Crawl fingertip drag", 4, 50, 25, "Afspænding"), swim("Udsvømning", 4, 50, 20, "Roligt") ] },
  { title: "Start & undervand", focus: "Reaktion, streamline og breakout", duration: 55, intensity: "Eksplosiv", exercises: [swim("Startspring og undervand", 10, 15, 75, "Samme opsætning hver gang"), swim("Delfinbenspark på ryggen", 8, 25, 40, "Hurtige små bevægelser"), swim("Sprint fra afsæt", 8, 25, 60, "Fart gennem breakout"), swim("Udsvømning", 6, 50, 20, "Let") ] },
  { title: "Ren fart", focus: "Højeste mulige fart med lange pauser", duration: 60, intensity: "Maksimal", exercises: [swim("Indsvømning", 5, 100, 20, "Klar til fart"), swim("Sprint fra afsæt", 16, 15, 75, "Stop før kvaliteten falder"), swim("Race pace", 6, 50, 60, "Konkurrencefrekvens"), swim("Udsvømning", 6, 50, 20, "Meget roligt") ] },
  { title: "Speed endurance", focus: "Bevar fart gennem hele 50’eren", duration: 65, intensity: "Hård", exercises: [swim("Indsvømning", 4, 100, 20, "Progressivt"), swim("Race pace", 8, 50, 90, "Fuld kvalitet"), swim("Benspark med plade", 8, 25, 40, "Hurtige fødder"), swim("Udsvømning", 6, 50, 20, "Let") ] },
  { title: "Vending & breakout", focus: "Hurtig retning og fart ud af væggen", duration: 55, intensity: "Teknik/fart", exercises: [swim("Vendingstræning", 12, 15, 45, "Stram rotation"), swim("Streamline-benspark på ryggen", 8, 25, 35, "Fast kropslinje"), swim("Sprint fra afsæt", 8, 25, 60, "Hurtigt breakout"), swim("Udsvømning", 4, 50, 20, "Roligt") ] },
  { title: "Aktiv restitution", focus: "Afspænding og vandføling", duration: 40, intensity: "Restitution", exercises: [swim("Indsvømning", 4, 100, 20, "Meget roligt"), swim("Sculling foran", 4, 50, 20, "Bløde bevægelser"), swim("Enarmscrawl", 4, 50, 25, "Rolig rotation"), swim("Udsvømning", 4, 100, 15, "Afslappet") ] },
  { title: "Power 25", focus: "Gentag eksplosive præstationer", duration: 60, intensity: "Sprint", exercises: [swim("Indsvømning", 5, 100, 20, "Progressivt"), swim("Sprint fra afsæt", 12, 25, 75, "Eksplosiv kvalitet"), swim("Startspring og undervand", 8, 15, 75, "Eksplosivt"), swim("Udsvømning", 6, 50, 20, "Let") ] },
  { title: "Laktattolerance", focus: "Bevar mekanikken under høj belastning", duration: 65, intensity: "Meget hård", exercises: [swim("Indsvømning", 5, 100, 20, "God forberedelse"), swim("Race pace", 6, 75, 120, "Høj fart, fuld pause"), swim("Crawl med pull buoy", 4, 100, 35, "Find grebet igen"), swim("Udsvømning", 8, 50, 20, "Grundig restitution") ] },
  { title: "Race skills", focus: "Sæt start, fart og vending sammen", duration: 60, intensity: "Race pace", exercises: [swim("Startspring og undervand", 6, 15, 75, "Konkurrenceopsætning"), swim("Race pace", 6, 50, 90, "Konkurrencefart"), swim("Vendingstræning", 8, 15, 45, "Hurtigt ud"), swim("Udsvømning", 6, 50, 20, "Let") ] },
  { title: "50-test", focus: "Test start, topfart og teknisk holdbarhed", duration: 55, intensity: "Test", exercises: [swim("Indsvømning", 6, 100, 20, "Klar til test"), swim("Sprint fra afsæt", 4, 25, 90, "Aktivering"), swim("Race pace", 1, 50, 180, "Maksimalt testløb"), swim("Udsvømning", 8, 50, 20, "Grundig restitution") ] },
];

export const swimPlans: Record<SwimProfile, ProgramDay[]> = {
  long_distance: makePlan("long_distance", longDistanceSessions),
  middle_distance: makePlan("middle_distance", middleDistanceSessions),
  sprint: makePlan("sprint", sprintSessions),
};

export const defaultSwimProfile: SwimProfile = "middle_distance";
export const getSwimPlan = (profile: SwimProfile) => swimPlans[profile];
export const getSwimProgram = (programId: string) => Object.values(swimPlans).flat().find((day) => day.programId === programId);
export const isSwimProfile = (value: unknown): value is SwimProfile => swimProfileOptions.some((option) => option.id === value);
export const isTrainingProfile = (value: unknown): value is TrainingProfile => trainingProfileOptions.some((option) => option.id === value);
export const getTrainingPlan = (profile: TrainingProfile) => profile === "weightlifting" ? twoWeekPlan : getSwimmerStrengthPlan(profile);
