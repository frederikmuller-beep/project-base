export type SessionExercise = {
  name: string;
  detail: string;
  focus: string;
  sets: number;
  plannedReps: string;
  defaultWeight: string;
};

export type ProgramDay = {
  programId: string | null;
  week: 1 | 2;
  day: string;
  date: string;
  status: "today" | "planned" | "recovery" | "rest";
  title: string;
  focus: string;
  duration: number;
  exercises: SessionExercise[];
};

const exercise = (
  name: string,
  sets: number,
  plannedReps: string,
  defaultWeight: string,
  focus: string,
): SessionExercise => ({
  name,
  sets,
  plannedReps,
  defaultWeight,
  focus,
  detail: `${sets} × ${plannedReps} · ${defaultWeight} kg`,
});

export const twoWeekPlan: ProgramDay[] = [
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
      exercise("Cykel", 1, "15 min", "0", "Rolig intensitet og næseåndedræt"),
      exercise("Hofte- og ankelmobilitet", 3, "1 runde", "0", "Roligt bevægeudslag uden smerte"),
      exercise("Dead bug", 3, "8", "0", "Hold lænden i gulvet"),
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
      exercise("Roning", 1, "12 min", "0", "Jævnt tempo uden at presse pulsen"),
      exercise("Cossack squat", 3, "6", "0", "Kontrolleret sideforskydning"),
      exercise("Side plank", 3, "25 sek", "0", "Lang og stabil kropslinje"),
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
      exercise("Bulgarian split squat", 3, "8", "24", "Stabilt knæ over fod"),
      exercise("Pendlay row", 4, "6", "65", "Start hvert løft fra gulvet"),
      exercise("Overhead carry", 3, "25 m", "20", "Ribben ned og aktiv skulder"),
    ],
  },
  {
    programId: "w2-test-review", week: 2, day: "SØNDAG", date: "16. AUG", status: "recovery",
    title: "Test review", focus: "Let bevægelse og afsluttende evaluering", duration: 25,
    exercises: [
      exercise("Cykel", 1, "10 min", "0", "Meget roligt tempo"),
      exercise("World's greatest stretch", 3, "5", "0", "Roligt bevægeudslag"),
      exercise("Bird dog", 3, "8", "0", "Undgå rotation i bækkenet"),
    ],
  },
];

export const todayProgram = twoWeekPlan[0];

export function getProgram(programId: string) {
  return twoWeekPlan.find((day) => day.programId === programId);
}

export function countProgramSets(day: ProgramDay) {
  return day.exercises.reduce((total, item) => total + item.sets, 0);
}
