"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { exerciseLibrary, type ExerciseDefinition } from "../exercise-data";
import type { SessionExercise } from "../program-data";
import { swimPlans } from "../swim-program-data";

type AthleteSession = {
  id: string; title: string; date: string | null; status: "active" | "completed";
  plannedSets: number; completedSets: number; startedAt: string;
  sets: Array<{ exerciseName: string; setNumber: number; weight: string; reps: string; rpe: string; effortMetric?: "rpe" | "rir" | "heart_rate_zone" }>;
};

type Athlete = {
  testerId: string;
  trainingProfile: "weightlifting" | "long_distance" | "middle_distance" | "sprint" | "recreational" | null;
  trainingProfileLabel: string; lastActiveAt: string | null; sessionsStarted: number; sessionsCompleted: number; setsLogged: number;
  sessions: AthleteSession[];
};

type AvailableAthlete = Pick<Athlete, "testerId" | "trainingProfile" | "trainingProfileLabel" | "lastActiveAt">;
type CoachPlan = {
  programId: string; testerId: string; title: string; focus: string; scheduledDate: string; trainingType: "strength" | "swim";
  duration: number; exercises: SessionExercise[];
};
type DraftExercise = SessionExercise & { tracking: "load" | "distance"; restSeconds: number };
type LibraryCategory = "Alle" | ExerciseDefinition["category"];

const waterTemplates = Object.values(swimPlans).flat().filter((day) => day.programId && day.exercises.length > 0);
const todayIso = () => new Date().toISOString().slice(0, 10);
const emptyDraft = () => ({ id: null as string | null, title: "", focus: "Teknisk kvalitet og en tydelig opgave", scheduledDate: todayIso(), trainingType: "strength" as "strength" | "swim", exercises: [] as DraftExercise[] });

const dateLabel = (value: string | null) => {
  if (!value) return "Ingen aktivitet endnu";
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("da-DK", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

export function CoachDashboard() {
  const [coachKey, setCoachKey] = useState("");
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [availableAthletes, setAvailableAthletes] = useState<AvailableAthlete[]>([]);
  const [plans, setPlans] = useState<CoachPlan[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryCategory, setLibraryCategory] = useState<LibraryCategory>("Alle");
  const [templateId, setTemplateId] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState("");
  const selected = athletes.find((athlete) => athlete.testerId === selectedId) ?? null;
  const selectedPlans = plans.filter((plan) => plan.testerId === selectedId);
  const categories = useMemo<LibraryCategory[]>(() => ["Alle", ...Array.from(new Set(exerciseLibrary.map((exercise) => exercise.category)))], []);
  const filteredExercises = useMemo(() => {
    const query = librarySearch.trim().toLocaleLowerCase("da-DK");
    return exerciseLibrary.filter((exercise) => (libraryCategory === "Alle" || exercise.category === libraryCategory)
      && (!query || `${exercise.name} ${exercise.category} ${exercise.target}`.toLocaleLowerCase("da-DK").includes(query)));
  }, [libraryCategory, librarySearch]);
  const totals = useMemo(() => ({
    sessions: athletes.reduce((sum, athlete) => sum + athlete.sessionsStarted, 0),
    completed: athletes.reduce((sum, athlete) => sum + athlete.sessionsCompleted, 0),
    sets: athletes.reduce((sum, athlete) => sum + athlete.setsLogged, 0),
  }), [athletes]);

  const requestHeaders = (json = false) => ({ authorization: `Bearer ${coachKey}`, ...(json ? { "content-type": "application/json" } : {}) });

  const loadPlans = async () => {
    const response = await fetch("/api/coach/plans", { headers: requestHeaders(), cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as { plans?: CoachPlan[]; error?: string } | null;
    if (!response.ok || !payload?.plans) throw new Error(payload?.error ?? "Trænerplanerne kunne ikke hentes.");
    setPlans(payload.plans);
  };

  const loadAthletes = async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/coach/athletes", { headers: requestHeaders(), cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { athletes?: Athlete[]; availableAthletes?: AvailableAthlete[]; error?: string } | null;
      if (!response.ok || !payload?.athletes || !payload.availableAthletes) throw new Error(payload?.error ?? "Atletdata kunne ikke hentes.");
      setAthletes(payload.athletes); setAvailableAthletes(payload.availableAthletes);
      setSelectedId((current) => payload.athletes?.some((athlete) => athlete.testerId === current) ? current : payload.athletes?.[0]?.testerId ?? null);
      await loadPlans(); setUnlocked(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Atletdata kunne ikke hentes.");
    } finally { setLoading(false); }
  };

  const assignAthlete = async (testerId: string) => {
    setMutating(true); setError("");
    try {
      const response = await fetch("/api/coach/athletes", { method: "POST", headers: requestHeaders(true), body: JSON.stringify({ testerId }) });
      const payload = (await response.json().catch(() => null)) as { testerId?: string; error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Atleten kunne ikke tildeles.");
      await loadAthletes(); setSelectedId(payload?.testerId ?? testerId); setDraft(emptyDraft());
    } catch (assignError) { setError(assignError instanceof Error ? assignError.message : "Atleten kunne ikke tildeles."); }
    finally { setMutating(false); }
  };

  const removeAthlete = async (testerId: string) => {
    setMutating(true); setError("");
    try {
      const response = await fetch(`/api/coach/athletes?testerId=${encodeURIComponent(testerId)}`, { method: "DELETE", headers: requestHeaders() });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Tildelingen kunne ikke fjernes.");
      await loadAthletes(); setDraft(emptyDraft());
    } catch (removeError) { setError(removeError instanceof Error ? removeError.message : "Tildelingen kunne ikke fjernes."); }
    finally { setMutating(false); }
  };

  const addExercise = (exercise: ExerciseDefinition) => setDraft((current) => ({ ...current, exercises: [...current.exercises, {
    name: exercise.name, focus: exercise.cue, sets: Math.max(1, Number(exercise.sets) || 1), plannedReps: exercise.reps,
    defaultWeight: exercise.weight, tracking: exercise.format ?? "load", restSeconds: exercise.format === "distance" ? 30 : 75,
    effortMetric: exercise.format === "distance" ? "heart_rate_zone" : "rir",
    effortTarget: exercise.format === "distance" ? "Pulszone efter trænerens plan" : "RIR efter trænerens plan",
    detail: "",
  }] }));

  const updateExercise = (index: number, key: "sets" | "plannedReps" | "defaultWeight" | "restSeconds", value: string) => setDraft((current) => ({ ...current, exercises: current.exercises.map((exercise, position) => position === index ? { ...exercise, [key]: key === "sets" || key === "restSeconds" ? Math.max(0, Number(value) || 0) : value } : exercise) }));
  const removeExercise = (index: number) => setDraft((current) => ({ ...current, exercises: current.exercises.filter((_, position) => position !== index) }));

  const loadWaterTemplate = () => {
    const template = waterTemplates.find((day) => day.programId === templateId);
    if (!template) return;
    setDraft((current) => ({ ...current, id: null, title: template.title, focus: template.focus, trainingType: "swim", exercises: template.exercises.map((exercise) => ({ ...exercise, tracking: "distance", restSeconds: exercise.restSeconds ?? 30 })) }));
  };

  const editPlan = (plan: CoachPlan) => {
    setDraft({ id: plan.programId, title: plan.title, focus: plan.focus, scheduledDate: plan.scheduledDate, trainingType: plan.trainingType, exercises: plan.exercises.map((exercise) => ({ ...exercise, tracking: exercise.tracking ?? "load", restSeconds: exercise.restSeconds ?? 75 })) });
    document.getElementById("coach-plan-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const savePlan = async () => {
    if (!selectedId || !draft.title.trim() || draft.exercises.length === 0) return;
    setMutating(true); setError("");
    try {
      const response = await fetch("/api/coach/plans", { method: "POST", headers: requestHeaders(true), body: JSON.stringify({ ...draft, testerId: selectedId }) });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Trænerpasset kunne ikke gemmes.");
      await loadPlans(); setDraft(emptyDraft()); setTemplateId("");
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Trænerpasset kunne ikke gemmes."); }
    finally { setMutating(false); }
  };

  const removePlan = async (id: string) => {
    setMutating(true); setError("");
    try {
      const response = await fetch(`/api/coach/plans?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: requestHeaders() });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Trænerpasset kunne ikke fjernes.");
      await loadPlans(); if (draft.id === id) setDraft(emptyDraft());
    } catch (removeError) { setError(removeError instanceof Error ? removeError.message : "Trænerpasset kunne ikke fjernes."); }
    finally { setMutating(false); }
  };

  return (
    <main className="coach-shell">
      <Link className="export-back" href="/">← Til BASE</Link>
      <p className="eyebrow">TRÆNER · ARBEJDSRUM</p><h1>Følg og planlæg træningen.</h1>
      <p className="lede">Tildel aktive testprofiler, sammensæt styrke- eller vandpas og følg udførelsen.</p>
      <section className="coach-access-card"><label>TRÆNERNØGLE<input type="password" value={coachKey} onChange={(event) => setCoachKey(event.target.value)} placeholder="Indtast den private nøgle" /></label><button type="button" disabled={coachKey.length < 24 || loading} onClick={loadAthletes}>{loading ? "Henter…" : unlocked ? "Opdatér" : "Åbn træneroverblik"}</button></section>
      {error && <div className="export-error" role="alert">{error}</div>}

      {unlocked && <>
        <section className="coach-profile-pool">
          <div><span>AKTIVE TESTPROFILER</span><strong>Tildel uden at kende tester-ID’et</strong><small>Vælg en aktiv profil. ID’et bruges kun som pseudonym i BASE.</small></div>
          <div className="coach-profile-pool-list">
            {availableAthletes.length === 0 && <small>Alle aktive testprofiler er allerede tildelt.</small>}
            {availableAthletes.map((athlete) => <button key={athlete.testerId} disabled={mutating} onClick={() => assignAthlete(athlete.testerId)}><span>{athlete.trainingProfileLabel}</span><strong>{athlete.testerId}</strong><small>Aktiv {dateLabel(athlete.lastActiveAt)}</small><b>＋ Tildel</b></button>)}
          </div>
        </section>
        <section className="coach-summary"><div><strong>{athletes.length}</strong><span>tildelte atleter</span></div><div><strong>{totals.completed}/{totals.sessions}</strong><span>pas gennemført</span></div><div><strong>{plans.length}</strong><span>trænertildelte pas</span></div></section>
        <div className="coach-layout">
          <section className="athlete-list" aria-label="Atleter">{athletes.length === 0 && <div className="coach-empty"><strong>Ingen atleter tildelt endnu.</strong><span>Vælg en aktiv testprofil ovenfor.</span></div>}{athletes.map((athlete) => <button key={athlete.testerId} className={selectedId === athlete.testerId ? "active" : ""} onClick={() => { setSelectedId(athlete.testerId); setDraft(emptyDraft()); }}><span className="athlete-avatar">{athlete.testerId.slice(0, 2)}</span><span><strong>{athlete.testerId}</strong><small>{athlete.trainingProfileLabel} · {athlete.sessionsCompleted}/{athlete.sessionsStarted} pas</small></span><b>→</b></button>)}</section>

          {selected && <section className="athlete-detail">
            <div className="athlete-detail-head"><div><span>ATLET · {selected.trainingProfileLabel.toLocaleUpperCase("da-DK")}</span><h2>{selected.testerId}</h2></div><div className="athlete-detail-actions"><small>Senest aktiv<br />{dateLabel(selected.lastActiveAt)}</small><button type="button" disabled={mutating} onClick={() => removeAthlete(selected.testerId)}>Fjern tildeling</button></div></div>
            <section className="coach-plan-builder" id="coach-plan-builder">
              <div className="coach-builder-title"><div><span>PROGRAMBYGGER</span><strong>{draft.id ? "Redigér tildelt pas" : "Tildel et nyt pas"}</strong></div>{draft.id && <button onClick={() => setDraft(emptyDraft())}>Nyt pas</button>}</div>
              <div className="coach-template-row"><label>SKJULTE VANDPAS<select value={templateId} onChange={(event) => setTemplateId(event.target.value)}><option value="">Vælg færdigt svømmepas…</option>{waterTemplates.map((template) => <option key={template.programId} value={template.programId ?? ""}>{template.title} · {template.distanceMeters?.toLocaleString("da-DK")} m</option>)}</select></label><button disabled={!templateId} onClick={loadWaterTemplate}>Indlæs vandpas</button></div>
              <div className="coach-plan-meta"><label>TITEL<input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Fx Teknik & fart" /></label><label>DATO<input type="date" value={draft.scheduledDate} onChange={(event) => setDraft((current) => ({ ...current, scheduledDate: event.target.value }))} /></label><label>TYPE<select value={draft.trainingType} onChange={(event) => setDraft((current) => ({ ...current, trainingType: event.target.value as "strength" | "swim" }))}><option value="strength">Styrke på land</option><option value="swim">Træning i vand</option></select></label><label className="wide">FOKUS<input value={draft.focus} onChange={(event) => setDraft((current) => ({ ...current, focus: event.target.value }))} /></label></div>
              <div className="coach-library-tools"><input aria-label="Søg øvelse" value={librarySearch} onChange={(event) => setLibrarySearch(event.target.value)} placeholder="Søg i alle 178 øvelser…" /><select value={libraryCategory} onChange={(event) => setLibraryCategory(event.target.value as LibraryCategory)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
              <div className="coach-library-list">{filteredExercises.map((exercise) => <button key={exercise.name} onClick={() => addExercise(exercise)}><span><strong>{exercise.name}</strong><small>{exercise.category} · {exercise.target}</small></span><b>＋</b></button>)}</div>
              <div className="coach-draft-list">
                {draft.exercises.length === 0 && <div className="coach-empty"><strong>Passet er tomt.</strong><span>Indlæs et vandpas eller tilføj øvelser fra biblioteket.</span></div>}
                {draft.exercises.map((exercise, index) => <article key={`${exercise.name}-${index}`}><div><span>{index + 1}</span><strong>{exercise.name}</strong><button aria-label={`Fjern ${exercise.name}`} onClick={() => removeExercise(index)}>Fjern</button></div><div><label>SÆT<input inputMode="numeric" value={exercise.sets} onChange={(event) => updateExercise(index, "sets", event.target.value)} /></label><label>{exercise.tracking === "distance" ? "DISTANCE" : "REPS"}<input value={exercise.plannedReps} onChange={(event) => updateExercise(index, "plannedReps", event.target.value)} /></label>{exercise.tracking !== "distance" && <label>VÆGT<input value={exercise.defaultWeight} onChange={(event) => updateExercise(index, "defaultWeight", event.target.value)} /></label>}<label>PAUSE<input inputMode="numeric" value={exercise.restSeconds} onChange={(event) => updateExercise(index, "restSeconds", event.target.value)} /></label></div></article>)}
              </div>
              <button className="coach-save-plan" disabled={mutating || !draft.title.trim() || draft.exercises.length === 0} onClick={savePlan}>{mutating ? "Gemmer…" : draft.id ? "Gem ændringer hos atleten" : "Tildel passet til atleten"}</button>
            </section>

            {selectedPlans.length > 0 && <section className="coach-planned-list"><div><span>TILDELT AF TRÆNER</span><strong>Kommende pas</strong></div>{selectedPlans.map((plan) => <article key={plan.programId}><div><span>{plan.trainingType === "swim" ? "VAND" : "STYRKE"} · {plan.scheduledDate}</span><strong>{plan.title}</strong><small>{plan.exercises.length} øvelser · ca. {plan.duration} min</small></div><div><button onClick={() => editPlan(plan)}>Redigér</button><button className="remove" disabled={mutating} onClick={() => removePlan(plan.programId)}>Fjern</button></div></article>)}</section>}

            <section className="coach-history"><div><span>UDFØRELSE</span><strong>Registrerede træninger</strong></div>{selected.sessions.length === 0 ? <div className="coach-empty"><strong>Ingen træning registreret endnu.</strong><span>Atletens udførte sæt vises her.</span></div> : selected.sessions.map((session) => <article className="coach-session" key={session.id}><div className="coach-session-head"><div><span>{session.date ?? "PLANLAGT PAS"}</span><strong>{session.title}</strong></div><b className={session.status}>{session.status === "completed" ? "UDFØRT" : "I GANG"}</b></div><div className="coach-progress"><span style={{ width: `${Math.min(100, (session.completedSets / Math.max(1, session.plannedSets)) * 100)}%` }} /></div><small>{session.completedSets} af {session.plannedSets} sæt · startet {dateLabel(session.startedAt)}</small>{session.sets.length > 0 && <div className="coach-sets">{session.sets.map((set, index) => <div key={`${set.exerciseName}-${set.setNumber}-${index}`}><span>{set.exerciseName} · sæt {set.setNumber}</span><strong>{set.weight === "0" ? set.reps : `${set.weight} kg × ${set.reps}`} · {set.effortMetric === "heart_rate_zone" ? `zone ${set.rpe}` : set.effortMetric === "rir" ? `${set.rpe} RIR` : `RPE ${set.rpe}`}</strong></div>)}</div>}</article>)}</section>
          </section>}
        </div>
        <p className="coach-privacy">Træneren ser kun pseudonyme testprofiler og træningsdata. Feedback, readiness og helbredsdata deles ikke.</p>
      </>}
    </main>
  );
}
