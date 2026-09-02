"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { healthProviderLabel, healthTrendLabel, type HealthSummary } from "../lib/health-data";
import type { AthleteDashboardData, ExerciseHistorySession, HistoricalLoadRecommendation, LoadSuggestion, TechniqueQuality } from "../lib/training-analytics";
import { AthleteDashboard } from "./athlete-dashboard";
import { exerciseFocusTags, exerciseLibrary, type ExerciseDefinition, type ExerciseFocusTag } from "./exercise-data";
import { availableSessionExercises, definitionToContextualSessionExercise, fiveExerciseAlternatives } from "./exercise-alternatives";
import { exerciseVideos, youtubeExerciseSearchUrl } from "./exercise-videos";
import { FeedbackForm, type FeedbackKind } from "./feedback-form";
import { countProgramSets, getWeekProgression, type ProgramDay, type SessionExercise } from "./program-data";
import { defaultSwimProfile, getTrainingPlan, trainingProfileLabel, trainingProfileOptions, type TrainingProfile } from "./swim-program-data";
import { applyPreferredTrainingDays, defaultTrainingDays, hasConsecutiveTrainingDays, trainingWeekdays, type TrainingWeekday } from "./training-days";

type View = "today" | "dashboard" | "week" | "library" | "readiness" | "recommendation" | "session" | "complete" | "feedback" | "feedbackThanks" | "extraBuilder" | "extraDay";

type ExtraDayExercise = {
  name: string;
  focus: string;
  sets: string;
  reps: string;
  weight: string;
  format: "load" | "distance";
};

type LibraryCategory = "Alle" | ExerciseDefinition["category"];
type LibraryFocus = "Alle" | ExerciseFocusTag;

const defaultPlan = getTrainingPlan(defaultSwimProfile);

const countReps = (value: string) =>
  value.split("+").reduce((sum, part) => sum + (Number.parseFloat(part) || 0), 0);

type SessionProgress = {
  programId: string;
  status: "active" | "completed";
  completedSets: number;
  plannedSets: number;
  exercises?: SessionExercise[];
};

type TrainingSetLog = {
  exerciseIndex: number;
  setIndex: number;
  weight: string;
  reps: string;
  rpe: string;
  effortMetric?: "rpe" | "rir" | "heart_rate_zone";
  techniqueQuality?: TechniqueQuality | null;
};

type ExerciseHistoryData = {
  exerciseName: string;
  history: ExerciseHistorySession[];
  recommendation: HistoricalLoadRecommendation | null;
};

const setLogKey = (exercisePosition: number, setPosition: number) => `${exercisePosition}:${setPosition}`;
const formatTimer = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const exerciseEffortMetric = (exercise: SessionExercise) => exercise.effortMetric ?? (exercise.tracking === "distance" ? "heart_rate_zone" : "rir");
const defaultEffortValue = (exercise: SessionExercise) => exerciseEffortMetric(exercise) === "heart_rate_zone" ? "2" : exercise.effortTarget?.startsWith("4") ? "5" : "3";
const effortLabel = (metric: "rpe" | "rir" | "heart_rate_zone") => metric === "heart_rate_zone" ? "PULSZONE" : metric === "rir" ? "RIR" : "RPE";
const effortSummary = (metric: "rpe" | "rir" | "heart_rate_zone", value: string) => metric === "heart_rate_zone" ? `pulszone ${value}` : metric === "rir" ? `${value} RIR` : `RPE ${value}`;
const programRoleLabel = (role: SessionExercise["programRole"]) => role === "main" ? "HOVEDØVELSE" : role === "assistance" ? "ASSISTANCE" : role === "sport_specific" ? "SPORTSRELEVANT" : "";

const positionFromCompletedSets = (plan: SessionExercise[], completedSets: number) => {
  let remaining = completedSets;
  for (let exerciseIndex = 0; exerciseIndex < plan.length; exerciseIndex += 1) {
    if (remaining < plan[exerciseIndex].sets) return { exerciseIndex, setIndex: remaining };
    remaining -= plan[exerciseIndex].sets;
  }
  return { exerciseIndex: Math.max(0, plan.length - 1), setIndex: Math.max(0, plan.at(-1)?.sets ?? 1) - 1 };
};

export default function Home() {
  const [view, setView] = useState<View>("today");
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [soreness, setSoreness] = useState(3);
  const [pain, setPain] = useState(false);
  const [adjusted, setAdjusted] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);
  const [setSaved, setSetSaved] = useState(false);
  const [weight, setWeight] = useState("70");
  const [reps, setReps] = useState("2");
  const [rpe, setRpe] = useState("3");
  const [techniqueQuality, setTechniqueQuality] = useState<TechniqueQuality | "">("");
  const [readinessChecked, setReadinessChecked] = useState(false);
  const [loadSuggestion, setLoadSuggestion] = useState<LoadSuggestion | null>(null);
  const [dashboardData, setDashboardData] = useState<AthleteDashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>("session");
  const [sessionPlan, setSessionPlan] = useState<SessionExercise[]>(defaultPlan[0].exercises);
  const [extraDraft, setExtraDraft] = useState<ExtraDayExercise[]>([]);
  const [extraDay, setExtraDay] = useState<ExtraDayExercise[]>([]);
  const [extraDayName, setExtraDayName] = useState("Teknik & styrke");
  const [savedExtraDayName, setSavedExtraDayName] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryCategory, setLibraryCategory] = useState<LibraryCategory>("Alle");
  const [libraryFocus, setLibraryFocus] = useState<LibraryFocus>("Alle");
  const [videoExercise, setVideoExercise] = useState<string | null>(null);
  const [testerId, setTesterId] = useState<string | null>(null);
  const [trainingProfile, setTrainingProfile] = useState<TrainingProfile | null>(null);
  const [profileDraft, setProfileDraft] = useState<TrainingProfile>(defaultSwimProfile);
  const [trainingDays, setTrainingDays] = useState<TrainingWeekday[]>(defaultTrainingDays);
  const [trainingDaysDraft, setTrainingDaysDraft] = useState<TrainingWeekday[]>(defaultTrainingDays);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [testerInput, setTesterInput] = useState("");
  const [identityLoading, setIdentityLoading] = useState(true);
  const [identityError, setIdentityError] = useState("");
  const [progress, setProgress] = useState<Record<string, SessionProgress>>({});
  const [coachPlans, setCoachPlans] = useState<ProgramDay[]>([]);
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(null);
  const [sessionProgramId, setSessionProgramId] = useState<string | null>(null);
  const [savingSet, setSavingSet] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [sessionLogs, setSessionLogs] = useState<Record<string, TrainingSetLog>>({});
  const [editingSetKey, setEditingSetKey] = useState<string | null>(null);
  const [resumePosition, setResumePosition] = useState<{ exerciseIndex: number; setIndex: number } | null>(null);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(90);
  const [restRunning, setRestRunning] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistoryData | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exerciseChangeMode, setExerciseChangeMode] = useState<"replace" | "add" | null>(null);
  const [sessionExerciseSearch, setSessionExerciseSearch] = useState("");
  const [customizingSession, setCustomizingSession] = useState(false);
  const [dayExerciseProgramId, setDayExerciseProgramId] = useState<string | null>(null);
  const [dayExerciseSearch, setDayExerciseSearch] = useState("");
  const sessionLogsRef = useRef(sessionLogs);
  const activeProfile = trainingProfile ?? profileDraft;
  const activePlan = useMemo(() => {
    const plan = getTrainingPlan(activeProfile);
    return activeProfile === "weightlifting" ? plan : applyPreferredTrainingDays(plan, trainingDays);
  }, [activeProfile, trainingDays]);
  const activeToday = activePlan[0];
  const selectedWeekPlan = useMemo(() => activePlan.filter((day) => day.week === selectedWeek), [activePlan, selectedWeek]);
  const selectedWeekProgression = getWeekProgression(selectedWeek);
  const nextProgram = useMemo(() => {
    const coachProgramIds = new Set(coachPlans.map((day) => day.programId));
    const availablePrograms = [...coachPlans, ...activePlan].filter((day) => day.programId && day.exercises.length > 0);
    const day = availablePrograms.find((candidate) => progress[candidate.programId!]?.status === "active")
      ?? coachPlans.find((candidate) => candidate.programId && progress[candidate.programId]?.status !== "completed")
      ?? activePlan.find((candidate) => candidate.programId && candidate.exercises.length > 0 && progress[candidate.programId]?.status !== "completed")
      ?? null;
    if (!day?.programId) return null;
    return {
      day,
      source: coachProgramIds.has(day.programId) ? "coach" as const : "base" as const,
      progress: progress[day.programId],
    };
  }, [activePlan, coachPlans, progress]);
  const weekTotals = useMemo(() => activePlan.reduce(
    (totals, day) => ({
      sessions: totals.sessions + (day.duration > 0 ? 1 : 0),
      minutes: totals.minutes + day.duration,
      sets: totals.sets + countProgramSets(day),
      distance: totals.distance + (day.distanceMeters ?? 0),
    }),
    { sessions: 0, minutes: 0, sets: 0, distance: 0 },
  ), [activePlan]);
  const currentExercise = sessionPlan[exerciseIndex];
  const currentEffortMetric = currentExercise ? exerciseEffortMetric(currentExercise) : "rir";
  const nextExercise = sessionPlan[exerciseIndex + 1];
  const totalPlannedSets = useMemo(
    () => sessionPlan.reduce((total, exercise) => total + exercise.sets, 0),
    [sessionPlan],
  );
  const extraTotals = useMemo(() => {
    const sets = extraDraft.reduce((total, exercise) => total + (Number(exercise.sets) || 0), 0);
    const volume = extraDraft.reduce(
      (total, exercise) => exercise.format === "load" ? total + (Number(exercise.sets) || 0) * countReps(exercise.reps) * (Number(exercise.weight) || 0) : total,
      0,
    );
    const distance = extraDraft.reduce(
      (total, exercise) => exercise.format === "distance" ? total + (Number(exercise.sets) || 0) * (Number.parseFloat(exercise.reps) || 0) : total,
      0,
    );
    return { sets, volume, distance };
  }, [extraDraft]);
  const savedExtraTotals = useMemo(() => {
    const sets = extraDay.reduce((total, exercise) => total + (Number(exercise.sets) || 0), 0);
    const volume = extraDay.reduce(
      (total, exercise) => exercise.format === "load" ? total + (Number(exercise.sets) || 0) * countReps(exercise.reps) * (Number(exercise.weight) || 0) : total,
      0,
    );
    const distance = extraDay.reduce(
      (total, exercise) => exercise.format === "distance" ? total + (Number(exercise.sets) || 0) * (Number.parseFloat(exercise.reps) || 0) : total,
      0,
    );
    return { sets, volume, distance };
  }, [extraDay]);
  const extraDayPlan = useMemo<SessionExercise[]>(() => extraDay.map((exercise) => ({
    name: exercise.name,
    detail: exercise.format === "distance" ? `${exercise.sets} × ${exercise.reps}` : `${exercise.sets} × ${exercise.reps} · ${exercise.weight} kg`,
    focus: exercise.focus,
    sets: Math.max(1, Number(exercise.sets) || 1),
    plannedReps: exercise.reps || "1",
    defaultWeight: exercise.weight || "0",
    tracking: exercise.format,
  })), [extraDay]);
  const athleteExerciseLibrary = useMemo(
    () => exerciseLibrary.filter((exercise) => exercise.visibility !== "coach_only"),
    [],
  );
  const exerciseAlternatives = useMemo(() => currentExercise ? fiveExerciseAlternatives(currentExercise, activeProfile) : [], [currentExercise, activeProfile]);
  const addableSessionExercises = useMemo(() => {
    const query = sessionExerciseSearch.trim().toLocaleLowerCase("da-DK");
    const chosen = new Set(sessionPlan.map((exercise) => exercise.name));
    return availableSessionExercises(activeProfile).filter((exercise) => !chosen.has(exercise.name) && (!query || `${exercise.name} ${exercise.target}`.toLocaleLowerCase("da-DK").includes(query))).slice(0, 20);
  }, [activeProfile, sessionExerciseSearch, sessionPlan]);
  const currentExerciseHasLogs = Object.values(sessionLogs).some((log) => log.exerciseIndex === exerciseIndex);
  const minimumCurrentExerciseSets = Math.max(1, ...Object.values(sessionLogs).filter((log) => log.exerciseIndex === exerciseIndex).map((log) => log.setIndex + 1));
  const libraryCategories = useMemo<LibraryCategory[]>(
    () => ["Alle", ...Array.from(new Set(athleteExerciseLibrary.map((exercise) => exercise.category)))],
    [athleteExerciseLibrary],
  );
  const swimStrengthCount = useMemo(
    () => athleteExerciseLibrary.filter((exercise) => exercise.category === "Svømmestyrke").length,
    [athleteExerciseLibrary],
  );
  const filteredExercises = useMemo(() => {
    const query = librarySearch.trim().toLocaleLowerCase("da-DK");
    return athleteExerciseLibrary.filter((exercise) => {
      const matchesCategory = libraryCategory === "Alle" || exercise.category === libraryCategory;
      const matchesFocus = libraryFocus === "Alle" || exercise.tags?.includes(libraryFocus);
      const searchableText = `${exercise.name} ${exercise.category} ${exercise.target} ${exercise.cue} ${exercise.tags?.join(" ") ?? ""}`.toLocaleLowerCase("da-DK");
      return matchesCategory && matchesFocus && (!query || searchableText.includes(query));
    });
  }, [athleteExerciseLibrary, libraryCategory, libraryFocus, librarySearch]);
  const selectedVideo = videoExercise ? exerciseVideos[videoExercise] : undefined;
  const currentSetKey = setLogKey(exerciseIndex, setIndex);
  const currentSetWasLogged = Boolean(sessionLogs[currentSetKey]);
  const sortedSessionLogs = useMemo(
    () => Object.values(sessionLogs).sort((a, b) => a.exerciseIndex - b.exerciseIndex || a.setIndex - b.setIndex),
    [sessionLogs],
  );

  useEffect(() => {
    sessionLogsRef.current = sessionLogs;
  }, [sessionLogs]);

  useEffect(() => {
    if (!restRunning) return;
    const timer = window.setInterval(() => {
      setRestSecondsRemaining((seconds) => {
        if (seconds <= 1) {
          setRestRunning(false);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [restRunning]);

  useEffect(() => {
    if (view !== "session" || !sessionProgramId || !currentExercise || currentExercise.tracking === "distance") return;
    const controller = new AbortController();
    fetch(`/api/training/exercise-history?programId=${encodeURIComponent(sessionProgramId)}&exerciseIndex=${exerciseIndex}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Historikken kunne ikke hentes.");
        return response.json() as Promise<ExerciseHistoryData>;
      })
      .then((data) => {
        setExerciseHistory(data);
        const firstSet = setLogKey(exerciseIndex, 0);
        if (!sessionLogsRef.current[firstSet] && data.recommendation) setWeight(String(data.recommendation.proposedWeight));
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setExerciseHistory(null);
      })
      .finally(() => { if (!controller.signal.aborted) setHistoryLoading(false); });
    return () => controller.abort();
  }, [view, sessionProgramId, exerciseIndex, currentExercise]);

  const loadProgress = async () => {
    const response = await fetch("/api/training", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { sessions?: SessionProgress[] };
    setProgress(Object.fromEntries((data.sessions ?? []).map((session) => [session.programId, session])));
  };

  const loadHealthSummary = async () => {
    const response = await fetch("/api/health/summary", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { summary?: HealthSummary };
    setHealthSummary(data.summary ?? null);
  };

  const loadCoachPlans = async () => {
    const response = await fetch("/api/training/plans", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { plans?: ProgramDay[] };
    setCoachPlans(data.plans ?? []);
  };

  const loadDashboard = async () => {
    setDashboardLoading(true);
    try {
      const response = await fetch("/api/training/analytics", { cache: "no-store" });
      if (!response.ok) {
        setDashboardData(null);
        return;
      }
      setDashboardData((await response.json()) as AthleteDashboardData);
    } finally {
      setDashboardLoading(false);
    }
  };

  const openDashboard = () => {
    setView("dashboard");
    void loadDashboard();
  };

  useEffect(() => {
    let active = true;
    fetch("/api/participant", { cache: "no-store" })
      .then(async (response) => response.json() as Promise<{ testerId: string | null; trainingProfile: TrainingProfile | null; trainingDays?: TrainingWeekday[] }>)
      .then(async (data) => {
        if (!active) return;
        setTesterId(data.testerId);
        setTrainingProfile(data.trainingProfile);
        if (data.trainingProfile) setProfileDraft(data.trainingProfile);
        if (data.trainingDays?.length === 3) {
          setTrainingDays(data.trainingDays);
          setTrainingDaysDraft(data.trainingDays);
        }
        if (data.testerId) await Promise.all([loadProgress(), loadHealthSummary(), loadCoachPlans()]);
      })
      .catch(() => undefined)
      .finally(() => { if (active) setIdentityLoading(false); });
    return () => { active = false; };
  }, []);

  const toggleTrainingDay = (day: TrainingWeekday) => setTrainingDaysDraft((current) => current.includes(day)
    ? current.filter((candidate) => candidate !== day)
    : current.length < 3 ? [...current, day] : current);

  const connectTester = async () => {
    setIdentityError("");
    setIdentityLoading(true);
    try {
      const response = await fetch("/api/participant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ testerId: testerId ?? testerInput, trainingProfile: profileDraft, trainingDays: trainingDaysDraft }),
      });
      const data = (await response.json()) as { testerId?: string; trainingProfile?: TrainingProfile; trainingDays?: TrainingWeekday[]; error?: string };
      if (!response.ok || !data.testerId) throw new Error(data.error ?? "Tester-ID kunne ikke gemmes.");
      setTesterId(data.testerId);
      setTrainingProfile(data.trainingProfile ?? profileDraft);
      setTrainingDays(data.trainingDays ?? trainingDaysDraft);
      setTrainingDaysDraft(data.trainingDays ?? trainingDaysDraft);
      setEditingPreferences(false);
      setTesterInput("");
      await Promise.all([loadProgress(), loadHealthSummary(), loadCoachPlans()]);
    } catch (error) {
      setIdentityError(error instanceof Error ? error.message : "Tester-ID kunne ikke gemmes.");
    } finally {
      setIdentityLoading(false);
    }
  };

  const disconnectTester = async () => {
    await fetch("/api/participant", { method: "DELETE" });
    setTesterId(null);
    setTrainingProfile(null);
    setTrainingDays(defaultTrainingDays);
    setTrainingDaysDraft(defaultTrainingDays);
    setEditingPreferences(false);
    setProgress({});
    setCoachPlans([]);
    setHealthSummary(null);
    setDashboardData(null);
    setIdentityError("");
  };

  const openFeedback = (kind: FeedbackKind) => {
    setFeedbackKind(kind);
    setView("feedback");
  };

  const readiness = useMemo(() => {
    if (pain) return { level: "Rød", className: "red", score: 38, text: "Pause hård træning", reason: "Du har angivet smerte. BASE ændrer ikke din plan automatisk." };
    const score = Math.round(((energy + sleep + (6 - soreness)) / 15) * 100);
    if (score >= 72) return { level: "Grøn", className: "green", score, text: "Følg planen", reason: "Dine svar ligger tæt på dit normale niveau." };
    return { level: "Gul", className: "amber", score, text: "Sænk intensiteten", reason: "Lav energi og ømhed gør rolig teknik vigtigere end høj fart i dag." };
  }, [energy, sleep, soreness, pain]);

  const reset = () => {
    setView("today"); setEnergy(3); setSleep(3); setSoreness(3); setPain(false);
    setAdjusted(false); setExerciseIndex(0); setSetIndex(0); setCompletedSets(0);
    setSetSaved(false); setWeight("0"); setReps(activeToday.exercises[0]?.plannedReps ?? "100 m"); setRpe(activeToday.exercises[0] ? defaultEffortValue(activeToday.exercises[0]) : "3"); setTechniqueQuality(""); setLoadSuggestion(null); setSessionPlan(activeToday.exercises);
    setSessionProgramId(null); setSaveError(""); setSessionLogs({}); setEditingSetKey(null); setResumePosition(null);
    setRestSecondsRemaining(90); setRestRunning(false);
    setExerciseHistory(null); setHistoryOpen(false); setHistoryLoading(false);
    setExerciseChangeMode(null); setSessionExerciseSearch(""); setCustomizingSession(false);
  };

  const startSession = (
    useAdjustment: boolean,
    plan: SessionExercise[] = activeToday.exercises,
    programId: string | null = null,
    alreadyCompleted = 0,
    initialLogs: TrainingSetLog[] = [],
  ) => {
    if (plan.length === 0) return;
    const position = positionFromCompletedSets(plan, alreadyCompleted);
    const openingExercise = plan[position.exerciseIndex];
    const logs = Object.fromEntries(initialLogs.map((log) => [setLogKey(log.exerciseIndex, log.setIndex), log]));
    const openingLog = logs[setLogKey(position.exerciseIndex, position.setIndex)];
    setSessionPlan(plan);
    setSessionProgramId(programId);
    setAdjusted(useAdjustment);
    setExerciseIndex(position.exerciseIndex);
    setSetIndex(position.setIndex);
    setCompletedSets(alreadyCompleted);
    setSessionLogs(logs);
    setSetSaved(Boolean(openingLog));
    setEditingSetKey(null);
    setResumePosition(null);
    setSaveError("");
    setWeight(openingLog?.weight ?? (useAdjustment && position.exerciseIndex === 0 && openingExercise.tracking !== "distance" ? "65" : openingExercise.defaultWeight));
    setReps(openingLog?.reps ?? openingExercise.plannedReps);
    setRpe(openingLog?.rpe ?? defaultEffortValue(openingExercise));
    setTechniqueQuality(openingLog?.techniqueQuality ?? "");
    setLoadSuggestion(null);
    setExerciseHistory(null);
    setHistoryOpen(false);
    setHistoryLoading(openingExercise.tracking !== "distance");
    setRestSecondsRemaining(openingExercise.restSeconds ?? 90);
    setRestRunning(false);
    setView("session");
  };

  const startPlannedSession = async (day: ProgramDay, useAdjustment = false) => {
    if (!day.programId || day.exercises.length === 0) return;
    if (!testerId) {
      setIdentityError("Indtast dit tester-ID for at starte og gemme dette pas.");
      setView("week");
      return;
    }
    setIdentityError("");
    try {
      const response = await fetch("/api/training", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "start", programId: day.programId }),
      });
      const data = (await response.json()) as SessionProgress & { sets?: TrainingSetLog[]; exercises?: SessionExercise[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Passet kunne ikke åbnes.");
      setProgress((current) => ({ ...current, [data.programId]: data }));
      startSession(useAdjustment, data.exercises ?? day.exercises, day.programId, data.completedSets, data.sets ?? []);
    } catch (error) {
      setIdentityError(error instanceof Error ? error.message : "Passet kunne ikke åbnes.");
      setView("week");
    }
  };

  const saveCurrentSet = async () => {
    if (setSaved) return;
    setSaveError("");
    if (currentEffortMetric === "rir" && !techniqueQuality) {
      setSaveError("Vurdér den tekniske kvalitet før du gemmer sættet.");
      return;
    }
    if (!sessionProgramId) {
      setCompletedSets((count) => count + 1);
      setSessionLogs((logs) => ({ ...logs, [currentSetKey]: { exerciseIndex, setIndex, weight, reps, rpe, effortMetric: currentEffortMetric, techniqueQuality: techniqueQuality || null } }));
      setSetSaved(true);
      setRestSecondsRemaining(currentExercise.restSeconds ?? 90);
      setRestRunning(true);
      return;
    }

    setSavingSet(true);
    try {
      const response = await fetch("/api/training", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "log_set",
          programId: sessionProgramId,
          exerciseIndex,
          setIndex,
          weight,
          reps,
          rpe,
          effortMetric: currentEffortMetric,
          techniqueQuality: techniqueQuality || undefined,
          readinessScore: readinessChecked ? readiness.score : null,
          pain: readinessChecked ? pain : null,
        }),
      });
      const data = (await response.json()) as SessionProgress & { savedSet?: TrainingSetLog; sparring?: LoadSuggestion | null; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Sættet kunne ikke gemmes.");
      setCompletedSets(data.completedSets);
      setProgress((current) => ({ ...current, [data.programId]: data }));
      if (data.savedSet) setSessionLogs((logs) => ({ ...logs, [setLogKey(data.savedSet!.exerciseIndex, data.savedSet!.setIndex)]: data.savedSet! }));
      setLoadSuggestion(data.sparring ?? null);
      setSetSaved(true);
      if (!currentSetWasLogged) {
        setRestSecondsRemaining(currentExercise.restSeconds ?? 90);
        setRestRunning(true);
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Sættet kunne ikke gemmes.");
    } finally {
      setSavingSet(false);
    }
  };

  const customizeTodaySession = async (nextPlan: SessionExercise[], changedIndex?: number) => {
    if (!sessionProgramId || customizingSession) return;
    const replacedCurrentExercise = changedIndex === exerciseIndex && nextPlan[exerciseIndex]?.name !== currentExercise.name;
    setCustomizingSession(true);
    setSaveError("");
    try {
      const response = await fetch("/api/training", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "customize", programId: sessionProgramId, exerciseNames: nextPlan.map((exercise) => exercise.name), exerciseSets: nextPlan.map((exercise) => exercise.sets) }),
      });
      const data = (await response.json()) as SessionProgress & { exercises?: SessionExercise[]; error?: string };
      if (!response.ok || !data.exercises) throw new Error(data.error ?? "Træningen kunne ikke tilpasses.");
      setSessionPlan(data.exercises);
      setProgress((current) => ({ ...current, [data.programId]: data }));
      if (changedIndex === exerciseIndex) {
        const replacement = data.exercises[exerciseIndex];
        setSetIndex((current) => Math.min(current, replacement.sets - 1));
        if (replacedCurrentExercise) {
          setWeight(replacement.defaultWeight);
          setReps(replacement.plannedReps);
          setRpe(defaultEffortValue(replacement));
          setTechniqueQuality("");
          setExerciseHistory(null);
          setHistoryOpen(false);
          setHistoryLoading(replacement.tracking !== "distance");
        }
        setRestSecondsRemaining(replacement.restSeconds ?? 90);
      }
      setExerciseChangeMode(null);
      setSessionExerciseSearch("");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Træningen kunne ikke tilpasses.");
    } finally {
      setCustomizingSession(false);
    }
  };

  const addExerciseToPlannedDay = async (day: ProgramDay, exercise: ExerciseDefinition) => {
    if (!day.programId || customizingSession) return;
    const currentExercises = progress[day.programId]?.exercises ?? day.exercises;
    if (currentExercises.length >= 12 || currentExercises.some((item) => item.name === exercise.name)) return;
    const nextPlan = [...currentExercises, definitionToContextualSessionExercise(exercise, currentExercises)];
    setCustomizingSession(true);
    setIdentityError("");
    try {
      const response = await fetch("/api/training", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "customize", programId: day.programId, exerciseNames: nextPlan.map((item) => item.name), exerciseSets: nextPlan.map((item) => item.sets) }),
      });
      const data = (await response.json()) as SessionProgress & { error?: string };
      if (!response.ok || !data.exercises) throw new Error(data.error ?? "Øvelsen kunne ikke tilføjes til dagen.");
      setProgress((current) => ({ ...current, [data.programId]: data }));
      setDayExerciseProgramId(null);
      setDayExerciseSearch("");
    } catch (error) {
      setIdentityError(error instanceof Error ? error.message : "Øvelsen kunne ikke tilføjes til dagen.");
    } finally {
      setCustomizingSession(false);
    }
  };

  const openLoggedSet = (log: TrainingSetLog) => {
    if (!editingSetKey) setResumePosition({ exerciseIndex, setIndex });
    setEditingSetKey(setLogKey(log.exerciseIndex, log.setIndex));
    if (log.exerciseIndex !== exerciseIndex) {
      setExerciseHistory(null);
      setHistoryOpen(false);
      setHistoryLoading(sessionPlan[log.exerciseIndex]?.tracking !== "distance");
    }
    setExerciseIndex(log.exerciseIndex);
    setSetIndex(log.setIndex);
    setWeight(log.weight);
    setReps(log.reps);
    setRpe(log.rpe);
    setTechniqueQuality(log.techniqueQuality ?? "");
    setLoadSuggestion(null);
    setSetSaved(true);
    setRestRunning(false);
    setSaveError("");
  };

  const returnToTraining = () => {
    if (!resumePosition) {
      setEditingSetKey(null);
      return;
    }
    const resumeExercise = sessionPlan[resumePosition.exerciseIndex];
    const resumeLog = sessionLogs[setLogKey(resumePosition.exerciseIndex, resumePosition.setIndex)];
    setExerciseIndex(resumePosition.exerciseIndex);
    if (resumePosition.exerciseIndex !== exerciseIndex) {
      setExerciseHistory(null);
      setHistoryOpen(false);
      setHistoryLoading(resumeExercise.tracking !== "distance");
    }
    setSetIndex(resumePosition.setIndex);
    setWeight(resumeLog?.weight ?? resumeExercise.defaultWeight);
    setReps(resumeLog?.reps ?? resumeExercise.plannedReps);
    setRpe(resumeLog?.rpe ?? defaultEffortValue(resumeExercise));
    setTechniqueQuality(resumeLog?.techniqueQuality ?? "");
    setSetSaved(Boolean(resumeLog));
    setEditingSetKey(null);
    setResumePosition(null);
    setSaveError("");
  };

  const advanceSession = () => {
    if (setIndex + 1 < currentExercise.sets) {
      setSetIndex((index) => index + 1);
      setSetSaved(false);
      setTechniqueQuality("");
      setLoadSuggestion(null);
      setRestSecondsRemaining(currentExercise.restSeconds ?? 90);
      setRestRunning(false);
      return;
    }

    if (nextExercise) {
      setExerciseIndex((index) => index + 1);
      setSetIndex(0);
      setSetSaved(false);
      setWeight(nextExercise.defaultWeight);
      setReps(nextExercise.plannedReps);
      setRpe(defaultEffortValue(nextExercise));
      setTechniqueQuality("");
      setLoadSuggestion(null);
      setExerciseHistory(null);
      setHistoryOpen(false);
      setHistoryLoading(nextExercise.tracking !== "distance");
      setRestSecondsRemaining(nextExercise.restSeconds ?? 90);
      setRestRunning(false);
      return;
    }

    setView("complete");
  };

  const acceptLoadSuggestion = () => {
    if (loadSuggestion?.decision !== "increase" || loadSuggestion.proposedWeight === null || setIndex + 1 >= currentExercise.sets) return;
    setSetIndex((index) => index + 1);
    setWeight(String(loadSuggestion.proposedWeight));
    setReps(currentExercise.plannedReps);
    setRpe(defaultEffortValue(currentExercise));
    setTechniqueQuality("");
    setSetSaved(false);
    setRestSecondsRemaining(currentExercise.restSeconds ?? 90);
    setRestRunning(false);
    setLoadSuggestion(null);
  };

  const toggleExtraExercise = (exercise: ExerciseDefinition) => {
    setExtraDraft((current) => {
      if (current.some((item) => item.name === exercise.name)) {
        return current.filter((item) => item.name !== exercise.name);
      }
      if (current.length >= 5) return current;
      return [...current, {
        name: exercise.name,
        focus: exercise.cue,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        format: exercise.format ?? "load",
      }];
    });
  };

  const updateExtraExercise = (name: string, field: "sets" | "reps" | "weight", value: string) => {
    setExtraDraft((current) => current.map((exercise) =>
      exercise.name === name ? { ...exercise, [field]: value } : exercise,
    ));
  };

  const saveExtraDay = () => {
    if (extraDraft.length === 0) return;
    setExtraDay(extraDraft.map((exercise) => ({ ...exercise })));
    setSavedExtraDayName(extraDayName.trim() || "Ekstra træningsdag");
    setView("extraDay");
  };

  const editExtraDay = () => {
    setExtraDraft(extraDay.map((exercise) => ({ ...exercise })));
    setExtraDayName(savedExtraDayName || "Teknik & styrke");
    setView("extraBuilder");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="BASE">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-wave brand-wave-one" />
            <span className="brand-wave brand-wave-two" />
          </span>
          <span className="brand-wordmark"><b>BASE</b><strong>.</strong></span>
        </div>
        <button className="avatar" aria-label="Åbn profil">MH</button>
      </header>

      {view === "today" && (
        <section className="screen enter">
          <p className="eyebrow">{activeProfile === "weightlifting" ? "MANDAG · 3. AUGUST" : "TIRSDAG · 11. AUGUST"}</p>
          <h1>God træning.</h1>
          <p className="lede">Dit program er tilpasset {trainingProfileLabel(activeProfile).toLocaleLowerCase("da-DK")}.</p>

          <a className="coach-entry-button" href="/coach">
            <span>TRÆNERADGANG</span>
            <strong>Åbn træneroverblik</strong>
            <b>→</b>
          </a>

          {nextProgram ? (
            <article className="hero-card next-program-card">
              <div className="next-program-label">
                <span>NÆSTE PROGRAM</span>
                <b>{nextProgram.source === "coach" ? "FRA DIN TRÆNER" : "BASE-PROGRAM"}</b>
              </div>
              <div className="hero-meta"><span>{nextProgram.day.day} · {nextProgram.day.date}</span><span>{nextProgram.day.duration} MIN</span></div>
              <h2>{nextProgram.day.title}</h2>
              <p>{nextProgram.day.focus}.</p>
              <div className="session-stats">
                <div><strong>{nextProgram.day.exercises.length}</strong><span>blokke</span></div>
                <div><strong>{countProgramSets(nextProgram.day)}</strong><span>arbejdssæt</span></div>
                <div><strong>{nextProgram.progress?.completedSets ?? 0}/{countProgramSets(nextProgram.day)}</strong><span>udført</span></div>
              </div>
              <button className="next-program-start" onClick={() => startPlannedSession(nextProgram.day)}>
                {nextProgram.progress?.status === "active" ? "Fortsæt program" : "Start program"}<b>→</b>
              </button>
            </article>
          ) : (
            <article className="hero-card all-programs-complete">
              <div className="hero-meta"><span>TESTPERIODE</span><span>FÆRDIG</span></div>
              <h2>Alle programmer er gennemført</h2>
              <p>Tak for indsatsen. Du kan stadig se og rette dine udførte sæt i tougersoversigten.</p>
            </article>
          )}

          <button className="athlete-dashboard-entry" onClick={openDashboard}>
            <span className="dashboard-entry-icon">↗</span>
            <span><strong>Se din udvikling</strong><small>Volumen · intensitet · estimeret 1RM</small></span>
            <b>→</b>
          </button>

          <button className="readiness-card" onClick={() => setView("readiness")}>
            <span className="pulse-dot" />
            <span><strong>Check din readiness</strong><small>30 sekunder · tilpas dagens belastning</small></span>
            <b>→</b>
          </button>

          <button className="week-entry" onClick={() => setView("week")}>
            <span className="week-entry-date"><strong>2</strong><small>UGER</small></span>
            <span><strong>Åbn dit 12-ugers program</strong><small>{weekTotals.sessions} pas · {weekTotals.minutes} min · {weekTotals.sets} arbejdssæt</small></span>
            <b>→</b>
          </button>

          {nextProgram && <><div className="section-head"><h3>Øvelser i næste program</h3><span>{nextProgram.day.exercises.length} blokke</span></div>
          <div className="exercise-list">
            {nextProgram.day.exercises.map((exercise, index) => (
              <div className="exercise" key={exercise.name}>
                <span className="exercise-number">0{index + 1}</span>
                <div><strong>{exercise.name}</strong><small>{exercise.detail}</small></div>
                <button className="exercise-video-button" aria-label={`Se video for ${exercise.name}`} onClick={() => setVideoExercise(exercise.name)}>▶</button>
              </div>
            ))}
          </div></>}
          <button className="library-link" onClick={() => setView("library")}>
            <span><strong>Udforsk øvelsesbiblioteket</strong><small>{exerciseLibrary.length.toLocaleString("da-DK")} i BASE · {athleteExerciseLibrary.length.toLocaleString("da-DK")} åbne i testen</small></span>
            <b>→</b>
          </button>
          {extraDay.length === 0 ? (
            <button className="extra-day-entry" onClick={() => setView("library")}>
              <span className="extra-day-icon">＋</span>
              <span><strong>Sammensæt ekstra træningsdag</strong><small>Vælg øvelser og tilpas doseringen</small></span>
              <b>→</b>
            </button>
          ) : (
            <article className="saved-extra-day">
              <div className="saved-extra-day-head"><span>EKSTRA DAG</span><button onClick={editExtraDay}>Redigér</button></div>
              <h3>{savedExtraDayName}</h3>
              <p>{extraDay.length} øvelser · {savedExtraTotals.sets} arbejdssæt · {savedExtraTotals.distance > 0 ? `${savedExtraTotals.distance.toLocaleString("da-DK")} m svømning` : `${savedExtraTotals.volume.toLocaleString("da-DK")} kg volumen`}</p>
              <button className="secondary" onClick={() => setView("extraDay")}>Se ekstra træningsdag</button>
            </article>
          )}
          {nextProgram && <button className="primary" onClick={() => startPlannedSession(nextProgram.day)}>{nextProgram.progress?.status === "active" ? "Fortsæt næste program" : "Start næste program"}</button>}
          <article className="feedback-entry">
            <span className="feedback-entry-icon">◎</span>
            <div>
              <strong>Afslutter du testperioden?</strong>
              <small>Del din samlede oplevelse på 5–7 minutter.</small>
            </div>
            <button onClick={() => openFeedback("final")}>Åbn</button>
          </article>
        </section>
      )}

      {view === "dashboard" && <AthleteDashboard data={dashboardData} loading={dashboardLoading} onBack={() => setView("today")} />}

      {view === "week" && (
        <section className="screen enter">
          <button className="back" onClick={() => setView("today")}>← Tilbage</button>
          <p className="eyebrow">12-UGERS TESTFORLØB · UGE {selectedWeek}</p>
          <h1>Dit program over 12 uger.</h1>
          <p className="lede">Åbn hvert planlagt pas, udfør alle sæt og fortsæt senere uden at miste din fremdrift.</p>
          <article className={testerId ? "tester-card connected" : "tester-card"}>
            {testerId && trainingProfile && !editingPreferences ? (
              <>
                <span className="tester-check">✓</span>
                <div><strong>{testerId} · {trainingProfileLabel(trainingProfile)}</strong><small>{trainingProfile === "weightlifting" ? "Den eksisterende vægtløftertest beholder sine fem faste ugentlige pas." : `Træningsdage: ${trainingDays.map((day) => day.toLocaleLowerCase("da-DK")).join(" · ")}`}</small></div>
                <div className="tester-actions"><button onClick={() => { setProfileDraft(trainingProfile); setTrainingDaysDraft(trainingDays); setEditingPreferences(true); }}>Redigér</button><button onClick={disconnectTester}>Log ud</button></div>
              </>
            ) : (
              <>
                <div className="tester-copy"><strong>{testerId ? "Redigér profil og træningsdage" : "Forbind tester-ID og træningsprofil"}</strong><small>Vælg den profil og de tre ugedage, der passer til din hverdag.</small></div>
                <div className="profile-options" role="radiogroup" aria-label="Træningsprofil">
                  {trainingProfileOptions.map((option) => (
                    <button type="button" role="radio" aria-checked={profileDraft === option.id} className={profileDraft === option.id ? "active" : ""} key={option.id} onClick={() => setProfileDraft(option.id)}>
                      <strong>{option.label}</strong><small>{option.description}</small>
                    </button>
                  ))}
                </div>
                {profileDraft === "weightlifting" ? <div className="training-day-note"><strong>Eksisterende vægtløftertest</strong><span>Profilen har fem faste ugentlige pas og beholder den nuværende rytme, så den igangværende test ikke ændres.</span></div> : <div className="training-day-picker"><span>VÆLG 3 TRÆNINGSDAGE</span><div className="training-day-options">{trainingWeekdays.map((day) => <button type="button" key={day} className={trainingDaysDraft.includes(day) ? "active" : ""} aria-pressed={trainingDaysDraft.includes(day)} onClick={() => toggleTrainingDay(day)}><strong>{day.slice(0, 3)}</strong><small>{day.toLocaleLowerCase("da-DK")}</small></button>)}</div><small>{trainingDaysDraft.length}/3 valgt · valget gælder alle 12 uger og kan ændres senere.</small>{hasConsecutiveTrainingDays(trainingDaysDraft) && <p>Bemærk: Du har valgt sammenhængende træningsdage. Overvej at gøre mindst ét af passene lettere.</p>}</div>}
                <div className="tester-connect">
                  {!testerId && <input aria-label="Tester-ID" value={testerInput} onChange={(event) => setTesterInput(event.target.value)} placeholder="A1" maxLength={12} />}
                  <button onClick={connectTester} disabled={identityLoading || (!testerId && !testerInput.trim()) || (profileDraft !== "weightlifting" && trainingDaysDraft.length !== 3)}>{identityLoading ? "…" : testerId ? "Gem valg" : "Forbind"}</button>
                  {testerId && <button className="cancel" onClick={() => { setProfileDraft(trainingProfile ?? defaultSwimProfile); setTrainingDaysDraft(trainingDays); setEditingPreferences(false); }}>Annullér</button>}
                </div>
              </>
            )}
            {identityError && <p className="tester-error">{identityError}</p>}
          </article>
          <article className="week-summary">
            <div><strong>{weekTotals.sessions}</strong><span>planlagte pas</span></div>
            <div><strong>{weekTotals.minutes} min</strong><span>planlagt styrketid</span></div>
            <div><strong>{trainingProfileLabel(activeProfile)}</strong><span>profil</span></div>
          </article>
          <div className="program-week-picker" aria-label="Vælg programuge">
            {Array.from({ length: 12 }, (_, index) => index + 1).map((week) => <button key={week} className={selectedWeek === week ? "active" : ""} aria-pressed={selectedWeek === week} onClick={() => setSelectedWeek(week)}>Uge {week}</button>)}
          </div>
          <article className={`program-phase-card ${selectedWeekProgression.phase === "Deload" ? "deload" : ""}`}>
            <span>{selectedWeekProgression.phase.toLocaleUpperCase("da-DK")} · UGE {selectedWeek}</span>
            <strong>{selectedWeekProgression.intensity}</strong>
            <p>{selectedWeekProgression.summary}</p>
            <small>Styrke: {selectedWeekProgression.rirTarget} · Kondition: {selectedWeekProgression.heartRateTarget}</small>
          </article>
          {coachPlans.length > 0 && (
            <section className="coach-assigned-plans">
              <div><span>FRA DIN TRÆNER</span><strong>{coachPlans.length} tildelte pas</strong><small>Disse pas er sammensat specifikt til din testprofil.</small></div>
              {coachPlans.map((day) => {
                const dayProgress = day.programId ? progress[day.programId] : undefined;
                return (
                  <article key={day.programId}>
                    <div><span>{day.intensity === "Vandpas" ? "VANDPAS" : "STYRKE"} · {day.day} {day.date}</span><strong>{day.title}</strong><small>{day.focus} · {day.exercises.length} øvelser</small></div>
                    <button onClick={() => startPlannedSession(day)}>{dayProgress ? dayProgress.status === "completed" ? "Se sæt" : "Fortsæt" : "Åbn pas"} →</button>
                  </article>
                );
              })}
            </section>
          )}
          <div className="week-list">
            {selectedWeekPlan.map((day) => {
              const dayProgress = day.programId ? progress[day.programId] : undefined;
              const dayExercises = dayProgress?.exercises?.length ? dayProgress.exercises : day.exercises;
              const effectiveDay = { ...day, exercises: dayExercises };
              const daySets = countProgramSets(effectiveDay);
              const dayExerciseOptions = day.programId === dayExerciseProgramId
                ? availableSessionExercises(activeProfile).filter((exercise) => !dayExercises.some((item) => item.name === exercise.name) && (!dayExerciseSearch.trim() || `${exercise.name} ${exercise.target}`.toLocaleLowerCase("da-DK").includes(dayExerciseSearch.trim().toLocaleLowerCase("da-DK")))).slice(0, 16)
                : [];
              return (
              <article className={`week-day ${day.status}`} key={`${day.week}-${day.day}`}>
                <div className="week-day-head">
                  <div className="week-date"><b>UGE {day.week}</b><strong>{day.day}</strong><span>{day.date}</span></div>
                  <span className={`week-status ${day.status}`}>
                    {dayProgress?.status === "completed" ? "UDFØRT" : dayProgress ? `${dayProgress.completedSets}/${dayProgress.plannedSets} SÆT` : day.status === "today" ? "I DAG" : day.status === "rest" ? "HVILE" : day.status === "recovery" ? "REST." : "PLANLAGT"}
                  </span>
                </div>
                <div className="week-day-title">
                  <div><h3>{day.title}</h3><p>{day.focus}</p></div>
                  {day.duration > 0 && <strong>{day.distanceMeters ? `${day.distanceMeters.toLocaleString("da-DK")} m · ` : ""}{day.duration} min</strong>}
                </div>
                {dayExercises.length > 0 && (
                  <div className="week-exercises">
                    {dayExercises.map((exercise) => {
                      return (
                        <button key={exercise.name} onClick={() => setVideoExercise(exercise.name)}>
                          <span>{exercise.programRole ? `${programRoleLabel(exercise.programRole)} · ` : ""}{exercise.name} · {exercise.sets} × {exercise.plannedReps}{exercise.restSeconds ? ` · ${exercise.restSeconds} sek pause` : ""}{exercise.effortTarget ? ` · ${exercise.effortTarget}` : ""}</span><b>{exerciseVideos[exercise.name] ? "▶" : "⌕"}</b>
                        </button>
                      );
                    })}
                  </div>
                )}
                {day.programId && dayProgress?.status !== "completed" && (
                  <button className="add-exercise-to-day" onClick={() => { setDayExerciseProgramId(dayExerciseProgramId === day.programId ? null : day.programId); setDayExerciseSearch(""); }} disabled={dayExercises.length >= 12}>
                    ＋ Tilføj øvelse til dagen
                  </button>
                )}
                {day.programId === dayExerciseProgramId && (
                  <div className="day-exercise-picker">
                    <input value={dayExerciseSearch} onChange={(event) => setDayExerciseSearch(event.target.value)} placeholder="Søg efter øvelse eller muskelgruppe" />
                    <small className="contextual-dose-note">Standarddoseringen tilpasses denne dags sæt, pauser og intensitet.</small>
                    <div>{dayExerciseOptions.map((exercise) => <button key={exercise.name} onClick={() => addExerciseToPlannedDay(effectiveDay, exercise)} disabled={customizingSession}><span><strong>{exercise.name}</strong><small>{exercise.target}</small></span><b>Tilføj +</b></button>)}</div>
                  </div>
                )}
                {day.programId && dayProgress?.status !== "completed" && (
                  <button className="open-program" onClick={() => startPlannedSession(effectiveDay)}>
                    {dayProgress ? `Fortsæt pas · ${dayProgress.completedSets}/${daySets} sæt →` : "Start dette pas →"}
                  </button>
                )}
                {dayProgress?.status === "completed" && (
                  <div className="program-complete">
                    <span>✓ Pas gennemført og gemt</span>
                    <button onClick={() => startPlannedSession(effectiveDay)}>Se og ret udførte sæt</button>
                  </div>
                )}
              </article>
            );})}
          </div>
          {extraDay.length > 0 && (
            <article className="week-extra-day">
              <span>＋</span>
              <div><strong>{savedExtraDayName}</strong><small>Din ekstra dag · {extraDay.length} øvelser · {savedExtraTotals.sets} sæt</small></div>
              <button onClick={() => setView("extraDay")}>Se dag</button>
            </article>
          )}
          <p className="week-note">Test-ID’et huskes i browseren i 21 dage. Træningsdata gemmes i BASE-databasen – ikke i en almindelig cookie.</p>
        </section>
      )}

      {view === "library" && (
        <section className="screen enter">
          <button className="back" onClick={() => setView("today")}>← Tilbage</button>
          <p className="eyebrow">ØVELSESBIBLIOTEK</p>
          <h1>Variation med et formål.</h1>
          <p className="lede">Hver øvelse har et klart træningsmål, en konkret dosering og ét teknisk fokus.</p>
          <div className="library-summary">
            <div><strong>{exerciseLibrary.length.toLocaleString("da-DK")}</strong><span>i BASE</span></div>
            <div><strong>{athleteExerciseLibrary.length.toLocaleString("da-DK")}</strong><span>åbne i testen</span></div>
            <div><strong>{Object.keys(exerciseVideos).length}</strong><span>testvideoer</span></div>
          </div>
          <button className="swim-strength-index" onClick={() => setLibraryCategory("Svømmestyrke")}>
            <span>SVØMMESTYRKE</span>
            <div><strong>{swimStrengthCount} øvelser på land</strong><small>Skuldre, træk, streamline, core og eksplosivitet</small></div>
            <b>Se indeks →</b>
          </button>
          <div className="video-library-note"><span>▶</span><p><strong>Videoafprøvning</strong> Centrale øvelser har en integreret teknikvideo. Resten åbner en målrettet YouTube-søgning.</p></div>
          <div className="library-tools">
            <label className="library-search">
              <span>SØG I BIBLIOTEKET</span>
              <input
                type="search"
                value={librarySearch}
                onChange={(event) => setLibrarySearch(event.target.value)}
                placeholder="Fx pause, squat eller jerk"
              />
            </label>
            <div className="focus-filters" aria-label="Filtrér øvelser efter fokus">
              {(["Alle", ...exerciseFocusTags] as LibraryFocus[]).map((focus) => (
                <button
                  key={focus}
                  className={libraryFocus === focus ? "active" : ""}
                  aria-pressed={libraryFocus === focus}
                  onClick={() => setLibraryFocus(focus)}
                >{focus === "Alle" ? "Alle fokusområder" : focus}</button>
              ))}
            </div>
            <div className="category-filters" aria-label="Filtrér øvelser efter kategori">
              {libraryCategories.map((category) => (
                <button
                  key={category}
                  className={libraryCategory === category ? "active" : ""}
                  aria-pressed={libraryCategory === category}
                  onClick={() => setLibraryCategory(category)}
                >{category}</button>
              ))}
            </div>
            <small className="library-result-count">{filteredExercises.length} øvelser vist</small>
          </div>
          <div className="library-list">
            {filteredExercises.slice(0, 120).map((exercise, index) => {
              const selected = extraDraft.some((item) => item.name === exercise.name);
              return (
              <article className={selected ? "library-exercise selected" : "library-exercise"} key={exercise.name}>
                <div className="library-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="library-content">
                  <span className="category-pill">{exercise.category} · {exercise.difficulty}</span>
                  <h3>{exercise.name}</h3>
                  <p>{exercise.target}</p>
                  <small><b>Fokus:</b> {exercise.cue}</small>
                  <button className="watch-video" onClick={() => setVideoExercise(exercise.name)}>
                    {exerciseVideos[exercise.name] ? "▶ Se teknikvideo" : "⌕ Find teknikvideo"}
                  </button>
                </div>
                <button
                  className={selected ? "selected" : ""}
                  aria-label={`${selected ? "Fjern" : "Tilføj"} ${exercise.name} ${selected ? "fra" : "til"} program`}
                  aria-pressed={selected}
                  onClick={() => toggleExtraExercise(exercise)}
                >{selected ? "✓" : "+"}</button>
              </article>
            );})}
            {filteredExercises.length === 0 && (
              <div className="library-empty">
                <strong>Ingen øvelser matcher.</strong>
                <span>Prøv et andet søgeord eller vælg kategorien Alle.</span>
              </div>
            )}
          </div>
          <div className="builder-dock">
            <div><strong>{extraDraft.length} / 5 øvelser valgt</strong><small>Vælg op til fem øvelser til din ekstra dag.</small></div>
            <button className="primary" disabled={extraDraft.length === 0} onClick={() => setView("extraBuilder")}>Sammensæt dagen</button>
          </div>
          <button className="secondary" onClick={() => setView("today")}>Tilbage til dagens træning</button>
        </section>
      )}

      {view === "extraBuilder" && (
        <section className="screen enter">
          <button className="back" onClick={() => setView("library")}>← Tilbage til biblioteket</button>
          <p className="eyebrow">EKSTRA TRÆNINGSDAG</p>
          <h1>Sammensæt din dag.</h1>
          <p className="lede">Tilpas træningsmængden, så den passer til formålet med dagen.</p>
          <label className="day-name-field">NAVN PÅ DAGEN<input value={extraDayName} onChange={(event) => setExtraDayName(event.target.value)} maxLength={36} /></label>
          <div className="builder-exercises">
            {extraDraft.map((exercise, index) => (
              <article className="builder-exercise" key={exercise.name}>
                <div className="builder-exercise-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{exercise.name}</strong><small>{exercise.focus}</small></div>
                  <button aria-label={`Fjern ${exercise.name}`} onClick={() => setExtraDraft((current) => current.filter((item) => item.name !== exercise.name))}>×</button>
                </div>
                <div className={`prescription-inputs ${exercise.format === "distance" ? "distance" : ""}`}>
                  <label>SÆT<input inputMode="numeric" value={exercise.sets} onChange={(event) => updateExtraExercise(exercise.name, "sets", event.target.value)} /></label>
                  <label>{exercise.format === "distance" ? "DISTANCE" : "REPS"}<input inputMode="text" value={exercise.reps} onChange={(event) => updateExtraExercise(exercise.name, "reps", event.target.value)} /></label>
                  {exercise.format === "load" && <label>VÆGT<input inputMode="decimal" value={exercise.weight} onChange={(event) => updateExtraExercise(exercise.name, "weight", event.target.value)} /><span>kg</span></label>}
                </div>
              </article>
            ))}
          </div>
          <article className="extra-day-totals">
            <div><strong>{extraDraft.length}</strong><span>øvelser</span></div>
            <div><strong>{extraTotals.sets}</strong><span>arbejdssæt</span></div>
            <div><strong>{extraTotals.distance > 0 ? `${extraTotals.distance.toLocaleString("da-DK")} m` : `${extraTotals.volume.toLocaleString("da-DK")} kg`}</strong><span>{extraTotals.distance > 0 ? "svømmedistance" : "samlet volumen"}</span></div>
          </article>
          <button className="primary" disabled={extraDraft.length === 0} onClick={saveExtraDay}>Gem ekstra træningsdag</button>
        </section>
      )}

      {view === "extraDay" && (
        <section className="screen enter">
          <button className="back" onClick={() => setView("today")}>← Tilbage</button>
          <p className="eyebrow">DIN EKSTRA DAG</p>
          <h1>{savedExtraDayName}</h1>
          <p className="lede">En fleksibel træningsdag sammensat fra øvelsesbiblioteket.</p>
          <article className="extra-day-totals">
            <div><strong>{extraDay.length}</strong><span>øvelser</span></div>
            <div><strong>{savedExtraTotals.sets}</strong><span>arbejdssæt</span></div>
            <div><strong>{savedExtraTotals.distance > 0 ? `${savedExtraTotals.distance.toLocaleString("da-DK")} m` : `${savedExtraTotals.volume.toLocaleString("da-DK")} kg`}</strong><span>{savedExtraTotals.distance > 0 ? "svømmedistance" : "samlet volumen"}</span></div>
          </article>
          <div className="exercise-list extra-day-list">
            {extraDay.map((exercise, index) => (
              <div className="exercise" key={exercise.name}>
                <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{exercise.name}</strong><small>{exercise.format === "distance" ? `${exercise.sets} × ${exercise.reps}` : `${exercise.sets} × ${exercise.reps} · ${exercise.weight} kg`}</small></div>
                <button className="exercise-video-button" aria-label={`Se video for ${exercise.name}`} onClick={() => setVideoExercise(exercise.name)}>{exerciseVideos[exercise.name] ? "▶" : "⌕"}</button>
              </div>
            ))}
          </div>
          <button className="primary" onClick={() => startSession(false, extraDayPlan)}>Start ekstra træning</button>
          <button className="secondary" onClick={editExtraDay}>Redigér dagen</button>
        </section>
      )}

      {view === "readiness" && (
        <section className="screen enter">
          <button className="back" onClick={() => setView("today")}>← Tilbage</button>
          <p className="eyebrow">DAGLIGT CHECK-IN</p>
          <h1>Hvordan har kroppen det?</h1>
          <p className="lede">Svar ud fra hvordan du har det lige nu.</p>
          {healthSummary?.available && healthSummary.latest && (
            <article className="health-context-card">
              <div className="health-context-head">
                <div><span>DATA FRA</span><strong>{healthProviderLabel(healthSummary.provider)}</strong></div>
                <div className={`health-trend ${healthSummary.trend}`}><span />{healthTrendLabel(healthSummary.trend)}</div>
              </div>
              <div className="health-context-metrics">
                {healthSummary.latest.sleepDurationMinutes !== null && (
                  <div><strong>{Math.floor(healthSummary.latest.sleepDurationMinutes / 60)}t {healthSummary.latest.sleepDurationMinutes % 60}m</strong><span>Søvn</span></div>
                )}
                {healthSummary.latest.sleepScore !== null && <div><strong>{healthSummary.latest.sleepScore}</strong><span>Søvnscore</span></div>}
                {healthSummary.latest.restingHeartRate !== null && <div><strong>{healthSummary.latest.restingHeartRate}</strong><span>Hvilepuls</span></div>}
                {healthSummary.latest.hrvMs !== null && <div><strong>{healthSummary.latest.hrvMs} ms</strong><span>HRV</span></div>}
              </div>
              <p>{healthSummary.daysIncluded} dages data · bruges som kontekst, ikke til automatisk at ændre planen.</p>
            </article>
          )}
          <Metric label="Energi" low="Flad" high="Stærk" value={energy} setValue={setEnergy} />
          <Metric label="Søvnkvalitet" low="Dårlig" high="God" value={sleep} setValue={setSleep} />
          <Metric label="Muskelømhed" low="Ingen" high="Meget" value={soreness} setValue={setSoreness} />
          <div className="pain-row">
            <div><strong>Har du smerter?</strong><small>Ikke almindelig muskelømhed</small></div>
            <button className={pain ? "toggle on" : "toggle"} onClick={() => setPain(!pain)} aria-pressed={pain}><span /></button>
          </div>
          <button className="primary" onClick={() => { setReadinessChecked(true); setView("recommendation"); }}>Se min anbefaling</button>
        </section>
      )}

      {view === "recommendation" && (
        <section className="screen enter">
          <button className="back" onClick={() => setView("readiness")}>← Redigér svar</button>
          <p className="eyebrow">DIN READINESS</p>
          <div className={`score-ring ${readiness.className}`}><strong>{readiness.score}</strong><span>/ 100</span></div>
          <div className={`status ${readiness.className}`}><span />{readiness.level} readiness</div>
          <h1>{readiness.text}</h1>
          <p className="lede">{readiness.reason}</p>
          <article className="change-card">
            <div className="change-title"><span>Forslag til dagens plan</span><strong>{pain ? "Ingen hård træning" : readiness.level === "Grøn" ? "Ingen ændring" : "Rolig intensitet"}</strong></div>
            <div className="weight-change"><div><small>Planlagt snatch</small><strong>70 kg</strong></div><span>→</span><div><small>Foreslået</small><strong>{pain ? "—" : readiness.level === "Grøn" ? "70 kg" : "65 kg"}</strong></div></div>
            <p>Du kan altid se den oprindelige plan og ændre beslutningen.</p>
          </article>
          {!pain && <button className="primary" onClick={() => startPlannedSession(nextProgram?.day ?? activeToday, readiness.level !== "Grøn")}>{readiness.level === "Grøn" ? "Fortsæt med planen" : "Anvend og start træning"}</button>}
          <button className="secondary" onClick={() => startPlannedSession(nextProgram?.day ?? activeToday)}>{pain ? "Gå tilbage til planen" : "Behold oprindelig plan"}</button>
          <p className="safety">BASE giver træningsstøtte – ikke medicinsk rådgivning.</p>
        </section>
      )}

      {view === "session" && (
        <section className="screen enter session-screen">
          <div className="live-row"><span className="live-dot" /> TRÆNING I GANG <small>{completedSets} / {totalPlannedSets} sæt</small></div>
          <p className="eyebrow">ØVELSE {exerciseIndex + 1} AF {sessionPlan.length}</p>
          <h1>{currentExercise.name}</h1>
          <p className="lede">{currentExercise.focus}.</p>
          <div className="session-exercise-actions">
            <button onClick={() => setExerciseChangeMode(exerciseChangeMode === "replace" ? null : "replace")} disabled={currentExerciseHasLogs || customizingSession}>Skift øvelse</button>
            <button onClick={() => setExerciseChangeMode(exerciseChangeMode === "add" ? null : "add")} disabled={sessionPlan.length >= 12 || customizingSession}>+ Tilføj ekstra øvelse</button>
          </div>
          <div className="session-set-controls">
            <button
              onClick={() => customizeTodaySession(sessionPlan.map((exercise, index) => index === exerciseIndex ? { ...exercise, sets: exercise.sets - 1 } : exercise), exerciseIndex)}
              disabled={currentExercise.sets <= minimumCurrentExerciseSets || customizingSession}
            >− Fjern sæt</button>
            <strong>{currentExercise.sets} sæt</strong>
            <button
              onClick={() => customizeTodaySession(sessionPlan.map((exercise, index) => index === exerciseIndex ? { ...exercise, sets: exercise.sets + 1 } : exercise), exerciseIndex)}
              disabled={currentExercise.sets >= 20 || customizingSession}
            >+ Tilføj sæt</button>
          </div>
          {currentExerciseHasLogs && <p className="session-customize-note">Øvelsen kan ikke skiftes, efter et sæt er gemt. Dine registreringer bevares.</p>}
          {exerciseChangeMode === "replace" && (
            <article className="session-exercise-picker">
              <div><span>5 ALTERNATIVER</span><strong>Samme muskelgruppe</strong><button onClick={() => setExerciseChangeMode(null)}>Luk</button></div>
              <div className="session-alternative-list">
                {exerciseAlternatives.map((exercise) => (
                  <button key={exercise.name} onClick={() => customizeTodaySession(sessionPlan.map((item, index) => index === exerciseIndex ? definitionToContextualSessionExercise(exercise, sessionPlan, item) : item), exerciseIndex)} disabled={customizingSession}>
                    <strong>{exercise.name}</strong><small>{exercise.target}</small><span>Vælg →</span>
                  </button>
                ))}
              </div>
            </article>
          )}
          {exerciseChangeMode === "add" && (
            <article className="session-exercise-picker add">
              <div><span>EKSTRA ØVELSE</span><strong>Føj til dagens træning</strong><button onClick={() => setExerciseChangeMode(null)}>Luk</button></div>
              <input value={sessionExerciseSearch} onChange={(event) => setSessionExerciseSearch(event.target.value)} placeholder="Søg efter øvelse eller muskelgruppe" />
              <small className="contextual-dose-note">BASE matcher automatisk dagens sæt, pause, intensitet og relative belastning.</small>
              <div className="session-alternative-list">
                {addableSessionExercises.map((exercise) => (
                  <button key={exercise.name} onClick={() => customizeTodaySession([...sessionPlan, definitionToContextualSessionExercise(exercise, sessionPlan)])} disabled={customizingSession}>
                    <strong>{exercise.name}</strong><small>{exercise.target}</small><span>Tilføj +</span>
                  </button>
                ))}
              </div>
            </article>
          )}
          {currentExercise.tracking !== "distance" && (
            <article className={`exercise-history-summary ${exerciseHistory?.recommendation?.decision ?? "planned"}`}>
              <div>
                <span>PERSONLIG STARTVÆGT</span>
                <strong>{historyLoading ? "Beregner ud fra tidligere sæt…" : exerciseHistory?.recommendation ? `${String(exerciseHistory.recommendation.proposedWeight).replace(".", ",")} kg` : `${currentExercise.defaultWeight} kg`}</strong>
                {!historyLoading && exerciseHistory?.recommendation && <small>{exerciseHistory.recommendation.headline} · {exerciseHistory.recommendation.reasons[0]}</small>}
              </div>
              <button onClick={() => setHistoryOpen((open) => !open)} disabled={historyLoading}>
                {historyOpen ? "Skjul historik" : `Se historik${exerciseHistory?.history.length ? ` · ${exerciseHistory.history.length} pas` : ""}`}
              </button>
            </article>
          )}
          {historyOpen && exerciseHistory && (
            <article className="exercise-history-panel">
              <div className="exercise-history-title"><span>TIDLIGERE SÆT</span><strong>{exerciseHistory.exerciseName}</strong></div>
              {exerciseHistory.history.length === 0 ? (
                <p>Ingen tidligere registreringer. BASE bruger den planlagte vægt i dette pas.</p>
              ) : exerciseHistory.history.map((session) => (
                <div className="exercise-history-session" key={`${session.programId}-${session.date}`}>
                  <div><strong>{session.title}</strong><span>{new Date(session.date).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" })} · {session.sets.length}/{session.plannedSets} sæt</span></div>
                  <div>{session.sets.map((set) => <span key={set.setIndex}>Sæt {set.setIndex + 1}: <b>{set.weight} kg × {set.reps}</b> · {set.rir} RIR</span>)}</div>
                </div>
              ))}
            </article>
          )}
          <button className="session-video-button" onClick={() => setVideoExercise(currentExercise.name)}>
            <span>{exerciseVideos[currentExercise.name] ? "▶" : "⌕"}</span>
            <span><strong>{exerciseVideos[currentExercise.name] ? "Se teknikvideo" : "Find teknikvideo"}</strong><small>Åbnes uden at nulstille træningen</small></span>
          </button>
          <article className={`rest-timer ${restSecondsRemaining === 0 ? "finished" : ""}`}>
            <div>
              <span>PAUSETIMER</span>
              <small>{currentExercise.restSeconds ?? 90} sek anbefalet</small>
            </div>
            <strong aria-live="polite">{formatTimer(restSecondsRemaining)}</strong>
            <div className="rest-timer-actions">
              <button onClick={() => setRestRunning((running) => !running)} disabled={restSecondsRemaining === 0}>
                {restRunning ? "Pause" : "Start"}
              </button>
              <button onClick={() => { setRestSecondsRemaining(currentExercise.restSeconds ?? 90); setRestRunning(false); }}>Nulstil</button>
              <button onClick={() => setRestSecondsRemaining((seconds) => seconds + 30)}>+30 sek</button>
            </div>
          </article>
          {adjusted && <div className="adjusted-note"><span>↘</span><div><strong>Træn med rolig intensitet</strong><small>Readiness · gul · behold teknisk kvalitet</small></div><button onClick={() => setAdjusted(false)}>Fortryd</button></div>}
          <div className="set-progress" style={{ gridTemplateColumns: `repeat(${currentExercise.sets}, 1fr)` }}>
            {Array.from({ length: currentExercise.sets }, (_, index) => (
              <span key={index} className={index < setIndex || (index === setIndex && setSaved) ? "done" : index === setIndex ? "current" : ""}>{index + 1}</span>
            ))}
          </div>
          <article className="log-card">
            <div className="set-heading"><span>SÆT {setIndex + 1} AF {currentExercise.sets}</span><strong>{currentExercise.plannedReps}{currentExercise.tracking === "distance" ? currentExercise.restSeconds ? ` · ${currentExercise.restSeconds} sek pause` : "" : " reps"}</strong></div>
            <div className="effort-guidance"><span>{currentEffortMetric === "heart_rate_zone" ? "CARDIO" : "STYRKE"}</span><strong>{currentExercise.effortTarget ?? (currentEffortMetric === "heart_rate_zone" ? "Pulszone efter passets mål" : "RIR efter passets mål")}</strong><small>{currentEffortMetric === "heart_rate_zone" ? "Uden pulsur: brug samtaletempo og RPE 2–4 som fallback." : "RIR er antal gode gentagelser, du vurderer var tilbage."}</small></div>
            <div className={`inputs ${currentExercise.tracking === "distance" ? "distance-inputs" : ""}`}>
              {currentExercise.tracking !== "distance" && <label>VÆGT<input inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)} disabled={setSaved} /><span>kg</span></label>}
              <label>{currentExercise.tracking === "distance" ? "DISTANCE" : "REPS"}<input inputMode="text" value={reps} onChange={e => setReps(e.target.value)} disabled={setSaved} /></label>
              <label>{effortLabel(currentEffortMetric)}{currentEffortMetric === "heart_rate_zone" ? <select value={rpe} onChange={e => setRpe(e.target.value)} disabled={setSaved}>{[1, 2, 3, 4, 5].map((zone) => <option key={zone} value={zone}>Zone {zone}</option>)}</select> : <input inputMode="decimal" value={rpe} onChange={e => setRpe(e.target.value)} disabled={setSaved} />}</label>
            </div>
            {currentEffortMetric === "rir" && (
              <div className="technique-quality">
                <div><strong>Teknisk kvalitet</strong><small>Vurdér sættet ærligt — det indgår i BASEs belastningsforslag.</small></div>
                <div>
                  {([['good', 'God'], ['uncertain', 'Usikker'], ['poor', 'Ikke god']] as const).map(([value, label]) => (
                    <button key={value} className={techniqueQuality === value ? `active ${value}` : ""} onClick={() => setTechniqueQuality(value)} disabled={setSaved}>{label}</button>
                  ))}
                </div>
              </div>
            )}
            {!setSaved ? (
              <button className="primary" onClick={saveCurrentSet} disabled={savingSet}>{savingSet ? "Gemmer…" : currentSetWasLogged ? "Gem ændringer" : "Gem sæt"}</button>
            ) : (
              <>
                <div className="saved">✓ Sæt gemt · {currentExercise.tracking === "distance" ? reps : `${weight} kg × ${reps}`} · {effortSummary(currentEffortMetric, rpe)}</div>
                <button className="edit-set-button" onClick={() => setSetSaved(false)}>Rediger dette sæt</button>
                {loadSuggestion && currentEffortMetric === "rir" && !editingSetKey && (
                  <article className={`base-sparring ${loadSuggestion.decision}`}>
                    <div><span>BASE SPARRING</span><strong>{loadSuggestion.headline}</strong></div>
                    <ul>{loadSuggestion.reasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}</ul>
                    {loadSuggestion.decision === "increase" && <div className="base-sparring-actions"><button onClick={acceptLoadSuggestion}>Brug {String(loadSuggestion.proposedWeight).replace(".", ",")} kg</button><button onClick={() => setLoadSuggestion(null)}>Behold planen</button></div>}
                  </article>
                )}
                <button className="primary next-set-button" onClick={editingSetKey ? returnToTraining : advanceSession}>
                  {editingSetKey
                    ? "Tilbage til træningen"
                    : nextExercise === undefined && setIndex + 1 === currentExercise.sets
                    ? "Afslut træning"
                    : setIndex + 1 === currentExercise.sets
                      ? `Næste øvelse · ${nextExercise?.name}`
                      : `Fortsæt til sæt ${setIndex + 2}`}
                </button>
              </>
            )}
            {saveError && <div className="set-save-error">{saveError}</div>}
          </article>
          {sortedSessionLogs.length > 0 && (
            <article className="completed-set-list">
              <div><strong>Udførte sæt</strong><span>Tryk på et sæt for at rette det</span></div>
              <div className="completed-set-buttons">
                {sortedSessionLogs.map((log) => (
                  <button
                    key={setLogKey(log.exerciseIndex, log.setIndex)}
                    className={setLogKey(log.exerciseIndex, log.setIndex) === currentSetKey ? "active" : ""}
                    onClick={() => openLoggedSet(log)}
                  >
                    <span>{sessionPlan[log.exerciseIndex]?.name ?? `Øvelse ${log.exerciseIndex + 1}`} · sæt {log.setIndex + 1}</span>
                    <strong>{sessionPlan[log.exerciseIndex]?.tracking === "distance" ? log.reps : `${log.weight} kg × ${log.reps}`} · {effortSummary(log.effortMetric ?? (sessionPlan[log.exerciseIndex] ? exerciseEffortMetric(sessionPlan[log.exerciseIndex]) : "rpe"), log.rpe)}</strong>
                  </button>
                ))}
              </div>
            </article>
          )}
          <div className="next-exercise">
            <span>{nextExercise ? "NÆSTE ØVELSE" : "SIDSTE ØVELSE"}</span>
            <strong>{nextExercise ? `${nextExercise.name} · ${nextExercise.detail}` : `${totalPlannedSets - completedSets} sæt tilbage`}</strong>
          </div>
        </section>
      )}

      {view === "complete" && (
        <section className="screen complete-screen enter">
          <div className="checkmark">✓</div>
          <p className="eyebrow">SESSION AFSLUTTET</p>
          <h1>Godt arbejde.</h1>
          <p className="lede">Du gennemførte passet. Dine sæt er gemt på din testprofil.</p>
          <article className="summary-card"><div><strong>{completedSets}</strong><span>sæt logget</span></div><div><strong>{sessionPlan.length}</strong><span>øvelser</span></div><div><strong>{adjusted ? "−7 %" : "0 %"}</strong><span>tilpasning</span></div></article>
          <div className="test-question"><strong>Hjælp os med at gøre BASE bedre</strong><p>Besvar 10 korte spørgsmål om denne session. Det tager cirka ét minut.</p></div>
          <button className="primary" onClick={() => openFeedback("session")}>Giv feedback på træningen</button>
          <button className="secondary" onClick={() => { reset(); setView("week"); }}>Spring over og se testprogrammet</button>
        </section>
      )}

      {view === "feedback" && (
        <FeedbackForm
          kind={feedbackKind}
          onBack={() => setView(feedbackKind === "session" ? "complete" : "today")}
          onDone={() => setView("feedbackThanks")}
        />
      )}

      {view === "feedbackThanks" && (
        <section className="screen complete-screen enter">
          <div className="checkmark">✓</div>
          <p className="eyebrow">SVAR MODTAGET</p>
          <h1>Tak for din feedback.</h1>
          <p className="lede">Dit svar er gemt og bruges til at prioritere den næste version af BASE.</p>
          <article className="feedback-confirmation">
            <strong>{feedbackKind === "session" ? "Sessionen er evalueret" : "Testperioden er evalueret"}</strong>
            <span>Du har ikke delt navn eller følsomme helbredsoplysninger.</span>
          </article>
          <button className="primary" onClick={reset}>Tilbage til forsiden</button>
        </section>
      )}

      {videoExercise && (
        <div className="video-overlay" onClick={() => setVideoExercise(null)}>
          <article className="video-dialog" role="dialog" aria-modal="true" aria-labelledby="video-title" onClick={(event) => event.stopPropagation()}>
            <div className="video-dialog-head">
              <div><span>TEKNIKVIDEO · PROTOTYPE</span><h2 id="video-title">{videoExercise}</h2></div>
              <button aria-label="Luk video" onClick={() => setVideoExercise(null)}>×</button>
            </div>
            {selectedVideo ? (
              <div className="video-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0&playsinline=1`}
                  title={`${videoExercise} teknikvideo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="video-search-fallback">
                <span>⌕</span>
                <strong>Videoen er ikke udvalgt endnu</strong>
                <p>Til testperioden kan du åbne en målrettet søgning og vælge den mest relevante demonstration.</p>
              </div>
            )}
            <div className="video-dialog-actions">
              {selectedVideo ? (
                <a href={selectedVideo.sourceUrl} target="_blank" rel="noreferrer">Kilde: {selectedVideo.source} ↗</a>
              ) : (
                <a className="video-search-action" href={youtubeExerciseSearchUrl(videoExercise)} target="_blank" rel="noreferrer">Søg efter {videoExercise} på YouTube ↗</a>
              )}
            </div>
            <p className="video-safety-note">Ekstern demonstration til prototypetest. Følg altid din træners anvisninger.</p>
          </article>
        </div>
      )}

      <footer className="prototype-label">INTERAKTIV PROTOTYPE · TESTSVAR GEMMES</footer>
    </main>
  );
}

function Metric({ label, low, high, value, setValue }: { label: string; low: string; high: string; value: number; setValue: (n: number) => void }) {
  return <div className="metric"><div className="metric-head"><strong>{label}</strong><span>{value}/5</span></div><div className="scale">{[1,2,3,4,5].map(n => <button key={n} onClick={() => setValue(n)} className={value === n ? "active" : ""}>{n}</button>)}</div><div className="scale-labels"><span>{low}</span><span>{high}</span></div></div>;
}
