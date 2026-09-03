import type { ProgramDay } from "./program-data";

export const trainingWeekdays = ["MANDAG", "TIRSDAG", "ONSDAG", "TORSDAG", "FREDAG", "LØRDAG", "SØNDAG"] as const;
export type TrainingWeekday = typeof trainingWeekdays[number];

export const defaultTrainingDays: TrainingWeekday[] = ["MANDAG", "ONSDAG", "LØRDAG"];

export const isTrainingDays = (value: unknown): value is TrainingWeekday[] => Array.isArray(value)
  && value.length === 3
  && new Set(value).size === 3
  && value.every((day) => trainingWeekdays.includes(day as TrainingWeekday));

export const parseTrainingDays = (value: string | null | undefined): TrainingWeekday[] => {
  if (!value) return defaultTrainingDays;
  try {
    const parsed: unknown = JSON.parse(value);
    return isTrainingDays(parsed) ? [...parsed].sort((left, right) => trainingWeekdays.indexOf(left) - trainingWeekdays.indexOf(right)) : defaultTrainingDays;
  } catch {
    return defaultTrainingDays;
  }
};

export const hasConsecutiveTrainingDays = (days: TrainingWeekday[]) => {
  const indexes = new Set(days.map((day) => trainingWeekdays.indexOf(day)));
  return [...indexes].some((index) => indexes.has((index + 1) % trainingWeekdays.length));
};

const dateForProgramDay = (week: number, day: TrainingWeekday) => {
  const weekday = trainingWeekdays.indexOf(day);
  const date = new Date(Date.UTC(2026, 7, 3 + (week - 1) * 7 + weekday));
  const parts = new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short", timeZone: "UTC" }).formatToParts(date);
  const dayNumber = parts.find((part) => part.type === "day")?.value ?? "";
  const month = (parts.find((part) => part.type === "month")?.value ?? "").replaceAll(".", "").toLocaleUpperCase("da-DK");
  return `${dayNumber}. ${month}`;
};

export const applyPreferredTrainingDays = (plan: ProgramDay[], preferredDays: TrainingWeekday[]) => {
  const normalizedDays = isTrainingDays(preferredDays)
    ? [...preferredDays].sort((left, right) => trainingWeekdays.indexOf(left) - trainingWeekdays.indexOf(right))
    : defaultTrainingDays;
  const weeks = Array.from(new Set(plan.map((day) => day.week)));

  return weeks.flatMap((week) => {
    const weekPlan = plan.filter((day) => day.week === week);
    const trainingDays = weekPlan.filter((day) => day.programId && day.exercises.length > 0);
    if (trainingDays.length !== normalizedDays.length) return weekPlan;

    const scheduledTraining = trainingDays.map((day, index) => ({
      ...day,
      day: normalizedDays[index],
      date: dateForProgramDay(week, normalizedDays[index]),
    }));
    const remainingWeekdays = trainingWeekdays.filter((day) => !normalizedDays.includes(day));
    const scheduledRest = weekPlan.filter((day) => !day.programId || day.exercises.length === 0).map((day, index) => {
      const weekday = remainingWeekdays[index];
      return weekday ? { ...day, day: weekday, date: dateForProgramDay(week, weekday) } : day;
    });

    return [...scheduledTraining, ...scheduledRest].sort((left, right) => trainingWeekdays.indexOf(left.day as TrainingWeekday) - trainingWeekdays.indexOf(right.day as TrainingWeekday));
  });
};
