"use client";

import { useMemo, useState } from "react";
import { exerciseLibrary, type ExerciseDefinition } from "./exercise-data";
import { exerciseVideos, youtubeExerciseSearchUrl } from "./exercise-videos";
import { FeedbackForm, type FeedbackKind } from "./feedback-form";

type View = "today" | "week" | "library" | "readiness" | "recommendation" | "session" | "complete" | "feedback" | "feedbackThanks" | "extraBuilder" | "extraDay";

type SessionExercise = {
  name: string;
  detail: string;
  focus: string;
  sets: number;
  plannedReps: string;
  defaultWeight: string;
};

type ExtraDayExercise = {
  name: string;
  focus: string;
  sets: string;
  reps: string;
  weight: string;
};

type LibraryCategory = "Alle" | ExerciseDefinition["category"];

type WeekDay = {
  day: string;
  date: string;
  status: "today" | "planned" | "recovery" | "rest";
  title: string;
  focus: string;
  duration: number;
  sets: number;
  exercises: string[];
};

const todayExercises: SessionExercise[] = [
  { name: "Snatch", detail: "6 × 2 · 70 kg", focus: "Rolig fra gulv, aggressiv under stangen", sets: 6, plannedReps: "2", defaultWeight: "70" },
  { name: "Clean & Jerk", detail: "5 × 1+1 · 95 kg", focus: "Stabil modtagelse", sets: 5, plannedReps: "1+1", defaultWeight: "95" },
  { name: "Front squat", detail: "4 × 3 · 105 kg", focus: "Kontrolleret excentrisk", sets: 4, plannedReps: "3", defaultWeight: "105" },
];

const weekPlan: WeekDay[] = [
  { day: "MANDAG", date: "27. JUL", status: "today", title: "Competition focus", focus: "Teknisk kvalitet under moderat belastning", duration: 80, sets: 15, exercises: ["Snatch · 6 × 2", "Clean & Jerk · 5 × 1+1", "Front squat · 4 × 3"] },
  { day: "TIRSDAG", date: "28. JUL", status: "recovery", title: "Aktiv restitution", focus: "Bevægelse, mobilitet og rolig coretræning", duration: 35, sets: 6, exercises: ["Cykel · 15 min", "Hofte- og ankelmobilitet · 3 runder", "Dead bug · 3 × 8"] },
  { day: "ONSDAG", date: "29. JUL", status: "planned", title: "Snatch technique", focus: "Timing fra hæng og stabil overheadposition", duration: 70, sets: 14, exercises: ["Power snatch · 5 × 2", "Hang snatch · 4 × 3", "Snatch pull · 3 × 3", "Overhead squat · 2 × 5"] },
  { day: "TORSDAG", date: "30. JUL", status: "rest", title: "Hviledag", focus: "Søvn, mad og let bevægelse efter behov", duration: 0, sets: 0, exercises: [] },
  { day: "FREDAG", date: "31. JUL", status: "planned", title: "Clean & jerk power", focus: "Stabil modtagelse og kraftfuldt ben-drive", duration: 85, sets: 16, exercises: ["Clean & Jerk · 5 × 1+1", "Clean pull · 4 × 3", "Front squat · 4 × 3", "Push jerk · 3 × 3"] },
  { day: "LØRDAG", date: "1. AUG", status: "planned", title: "Strength base", focus: "Benstyrke, bagkæde og overheadkapacitet", duration: 75, sets: 14, exercises: ["Back squat · 5 × 5", "Strict press · 4 × 6", "Romanian deadlift · 3 × 8", "Plank · 2 × 30 sek"] },
  { day: "SØNDAG", date: "2. AUG", status: "rest", title: "Hviledag", focus: "Fuld restitution før næste træningsuge", duration: 0, sets: 0, exercises: [] },
];

const weekTotals = weekPlan.reduce(
  (totals, day) => ({
    sessions: totals.sessions + (day.duration > 0 ? 1 : 0),
    minutes: totals.minutes + day.duration,
    sets: totals.sets + day.sets,
  }),
  { sessions: 0, minutes: 0, sets: 0 },
);

const countReps = (value: string) =>
  value.split("+").reduce((sum, part) => sum + (Number(part) || 0), 0);

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
  const [rpe, setRpe] = useState("7");
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>("session");
  const [sessionPlan, setSessionPlan] = useState<SessionExercise[]>(todayExercises);
  const [extraDraft, setExtraDraft] = useState<ExtraDayExercise[]>([]);
  const [extraDay, setExtraDay] = useState<ExtraDayExercise[]>([]);
  const [extraDayName, setExtraDayName] = useState("Teknik & styrke");
  const [savedExtraDayName, setSavedExtraDayName] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryCategory, setLibraryCategory] = useState<LibraryCategory>("Alle");
  const [videoExercise, setVideoExercise] = useState<string | null>(null);
  const currentExercise = sessionPlan[exerciseIndex];
  const nextExercise = sessionPlan[exerciseIndex + 1];
  const totalPlannedSets = useMemo(
    () => sessionPlan.reduce((total, exercise) => total + exercise.sets, 0),
    [sessionPlan],
  );
  const extraTotals = useMemo(() => {
    const sets = extraDraft.reduce((total, exercise) => total + (Number(exercise.sets) || 0), 0);
    const volume = extraDraft.reduce(
      (total, exercise) => total + (Number(exercise.sets) || 0) * countReps(exercise.reps) * (Number(exercise.weight) || 0),
      0,
    );
    return { sets, volume };
  }, [extraDraft]);
  const savedExtraTotals = useMemo(() => {
    const sets = extraDay.reduce((total, exercise) => total + (Number(exercise.sets) || 0), 0);
    const volume = extraDay.reduce(
      (total, exercise) => total + (Number(exercise.sets) || 0) * countReps(exercise.reps) * (Number(exercise.weight) || 0),
      0,
    );
    return { sets, volume };
  }, [extraDay]);
  const extraDayPlan = useMemo<SessionExercise[]>(() => extraDay.map((exercise) => ({
    name: exercise.name,
    detail: `${exercise.sets} × ${exercise.reps} · ${exercise.weight} kg`,
    focus: exercise.focus,
    sets: Math.max(1, Number(exercise.sets) || 1),
    plannedReps: exercise.reps || "1",
    defaultWeight: exercise.weight || "0",
  })), [extraDay]);
  const libraryCategories = useMemo<LibraryCategory[]>(
    () => ["Alle", ...Array.from(new Set(exerciseLibrary.map((exercise) => exercise.category)))],
    [],
  );
  const filteredExercises = useMemo(() => {
    const query = librarySearch.trim().toLocaleLowerCase("da-DK");
    return exerciseLibrary.filter((exercise) => {
      const matchesCategory = libraryCategory === "Alle" || exercise.category === libraryCategory;
      const searchableText = `${exercise.name} ${exercise.category} ${exercise.target} ${exercise.cue}`.toLocaleLowerCase("da-DK");
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [libraryCategory, librarySearch]);
  const selectedVideo = videoExercise ? exerciseVideos[videoExercise] : undefined;

  const openFeedback = (kind: FeedbackKind) => {
    setFeedbackKind(kind);
    setView("feedback");
  };

  const readiness = useMemo(() => {
    if (pain) return { level: "Rød", className: "red", score: 38, text: "Pause tunge løft", reason: "Du har angivet smerte. BASE ændrer ikke din plan automatisk." };
    const score = Math.round(((energy + sleep + (6 - soreness)) / 15) * 100);
    if (score >= 72) return { level: "Grøn", className: "green", score, text: "Følg planen", reason: "Dine svar ligger tæt på dit normale niveau." };
    return { level: "Gul", className: "amber", score, text: "Reducer belastningen 7 %", reason: "Lav energi og ømhed gør kvalitet vigtigere end maksimal belastning i dag." };
  }, [energy, sleep, soreness, pain]);

  const reset = () => {
    setView("today"); setEnergy(3); setSleep(3); setSoreness(3); setPain(false);
    setAdjusted(false); setExerciseIndex(0); setSetIndex(0); setCompletedSets(0);
    setSetSaved(false); setWeight("70"); setReps("2"); setRpe("7"); setSessionPlan(todayExercises);
  };

  const startSession = (useAdjustment: boolean, plan: SessionExercise[] = todayExercises) => {
    if (plan.length === 0) return;
    setSessionPlan(plan);
    setAdjusted(useAdjustment);
    setExerciseIndex(0);
    setSetIndex(0);
    setCompletedSets(0);
    setSetSaved(false);
    setWeight(useAdjustment ? "65" : plan[0].defaultWeight);
    setReps(plan[0].plannedReps);
    setRpe("7");
    setView("session");
  };

  const saveCurrentSet = () => {
    if (setSaved) return;
    setCompletedSets((count) => count + 1);
    setSetSaved(true);
  };

  const advanceSession = () => {
    if (setIndex + 1 < currentExercise.sets) {
      setSetIndex((index) => index + 1);
      setSetSaved(false);
      return;
    }

    if (nextExercise) {
      setExerciseIndex((index) => index + 1);
      setSetIndex(0);
      setSetSaved(false);
      setWeight(nextExercise.defaultWeight);
      setReps(nextExercise.plannedReps);
      setRpe("7");
      return;
    }

    setView("complete");
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
        <div className="brand">BASE<span>.</span></div>
        <button className="avatar" aria-label="Åbn profil">MH</button>
      </header>

      {view === "today" && (
        <section className="screen enter">
          <p className="eyebrow">MANDAG · 27. JULI</p>
          <h1>God træning, Mikkel.</h1>
          <p className="lede">I dag bygger vi sikkerhed under tunge løft.</p>

          <article className="hero-card">
            <div className="hero-meta"><span>VÆGTLØFTNING</span><span>80 MIN</span></div>
            <h2>Competition focus</h2>
            <p>Teknisk kvalitet under moderat belastning.</p>
            <div className="session-stats">
              <div><strong>3</strong><span>øvelser</span></div>
              <div><strong>15</strong><span>arbejdssæt</span></div>
              <div><strong>3.100 kg</strong><span>samlet volumen</span></div>
            </div>
          </article>

          <button className="readiness-card" onClick={() => setView("readiness")}>
            <span className="pulse-dot" />
            <span><strong>Check din readiness</strong><small>30 sekunder · tilpas dagens belastning</small></span>
            <b>→</b>
          </button>

          <button className="week-entry" onClick={() => setView("week")}>
            <span className="week-entry-date"><strong>31</strong><small>UGE</small></span>
            <span><strong>Se kommende uges program</strong><small>{weekTotals.sessions} pas · {weekTotals.minutes} min · {weekTotals.sets} arbejdssæt</small></span>
            <b>→</b>
          </button>

          <div className="section-head"><h3>Dagens plan</h3><span>3 øvelser</span></div>
          <div className="exercise-list">
            {todayExercises.map((exercise, index) => (
              <div className="exercise" key={exercise.name}>
                <span className="exercise-number">0{index + 1}</span>
                <div><strong>{exercise.name}</strong><small>{exercise.detail}</small></div>
                <button className="exercise-video-button" aria-label={`Se video for ${exercise.name}`} onClick={() => setVideoExercise(exercise.name)}>▶</button>
              </div>
            ))}
          </div>
          <button className="library-link" onClick={() => setView("library")}>
            <span><strong>Udforsk øvelsesbiblioteket</strong><small>{exerciseLibrary.length} øvelser · {libraryCategories.length - 1} kategorier</small></span>
            <b>→</b>
          </button>
          {extraDay.length === 0 ? (
            <button className="extra-day-entry" onClick={() => setView("library")}>
              <span className="extra-day-icon">＋</span>
              <span><strong>Sammensæt ekstra træningsdag</strong><small>Vælg øvelser, sæt, reps og vægt</small></span>
              <b>→</b>
            </button>
          ) : (
            <article className="saved-extra-day">
              <div className="saved-extra-day-head"><span>EKSTRA DAG</span><button onClick={editExtraDay}>Redigér</button></div>
              <h3>{savedExtraDayName}</h3>
              <p>{extraDay.length} øvelser · {savedExtraTotals.sets} arbejdssæt · {savedExtraTotals.volume.toLocaleString("da-DK")} kg volumen</p>
              <button className="secondary" onClick={() => setView("extraDay")}>Se ekstra træningsdag</button>
            </article>
          )}
          <button className="primary" onClick={() => startSession(false)}>Start træning</button>
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

      {view === "week" && (
        <section className="screen enter">
          <button className="back" onClick={() => setView("today")}>← Tilbage</button>
          <p className="eyebrow">UGE 31 · 27. JUL – 2. AUG</p>
          <h1>Din kommende uge.</h1>
          <p className="lede">Se træning, restitution og fokus for hver dag, før ugen går i gang.</p>
          <article className="week-summary">
            <div><strong>{weekTotals.sessions}</strong><span>planlagte pas</span></div>
            <div><strong>{weekTotals.minutes}</strong><span>minutter</span></div>
            <div><strong>{weekTotals.sets}</strong><span>arbejdssæt</span></div>
          </article>
          <div className="week-list">
            {weekPlan.map((day) => (
              <article className={`week-day ${day.status}`} key={day.day}>
                <div className="week-day-head">
                  <div className="week-date"><strong>{day.day}</strong><span>{day.date}</span></div>
                  <span className={`week-status ${day.status}`}>
                    {day.status === "today" ? "I DAG" : day.status === "rest" ? "HVILE" : day.status === "recovery" ? "REST." : "PLANLAGT"}
                  </span>
                </div>
                <div className="week-day-title">
                  <div><h3>{day.title}</h3><p>{day.focus}</p></div>
                  {day.duration > 0 && <strong>{day.duration} min</strong>}
                </div>
                {day.exercises.length > 0 && (
                  <div className="week-exercises">
                    {day.exercises.map((exercise) => {
                      const exerciseName = exercise.split(" · ")[0];
                      return (
                        <button key={exercise} onClick={() => setVideoExercise(exerciseName)}>
                          <span>{exercise}</span><b>{exerciseVideos[exerciseName] ? "▶" : "⌕"}</b>
                        </button>
                      );
                    })}
                  </div>
                )}
                {day.status === "today" && <button onClick={() => setView("today")}>Åbn dagens træning →</button>}
              </article>
            ))}
          </div>
          {extraDay.length > 0 && (
            <article className="week-extra-day">
              <span>＋</span>
              <div><strong>{savedExtraDayName}</strong><small>Din ekstra dag · {extraDay.length} øvelser · {savedExtraTotals.sets} sæt</small></div>
              <button onClick={() => setView("extraDay")}>Se dag</button>
            </article>
          )}
          <p className="week-note">Planen er et prototypeeksempel. Readiness kan stadig bruges til at tilpasse dagens belastning.</p>
        </section>
      )}

      {view === "library" && (
        <section className="screen enter">
          <button className="back" onClick={() => setView("today")}>← Tilbage</button>
          <p className="eyebrow">ØVELSESBIBLIOTEK</p>
          <h1>Variation med et formål.</h1>
          <p className="lede">Hver variation er koblet til et træningsmål og et enkelt teknisk fokus.</p>
          <div className="library-summary">
            <div><strong>{exerciseLibrary.length}</strong><span>øvelser</span></div>
            <div><strong>{libraryCategories.length - 1}</strong><span>kategorier</span></div>
            <div><strong>{Object.keys(exerciseVideos).length}</strong><span>testvideoer</span></div>
          </div>
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
            {filteredExercises.map((exercise, index) => {
              const selected = extraDraft.some((item) => item.name === exercise.name);
              return (
              <article className={selected ? "library-exercise selected" : "library-exercise"} key={exercise.name}>
                <div className="library-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="library-content">
                  <span className="category-pill">{exercise.category}</span>
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
                <div className="prescription-inputs">
                  <label>SÆT<input inputMode="numeric" value={exercise.sets} onChange={(event) => updateExtraExercise(exercise.name, "sets", event.target.value)} /></label>
                  <label>REPS<input inputMode="text" value={exercise.reps} onChange={(event) => updateExtraExercise(exercise.name, "reps", event.target.value)} /></label>
                  <label>VÆGT<input inputMode="decimal" value={exercise.weight} onChange={(event) => updateExtraExercise(exercise.name, "weight", event.target.value)} /><span>kg</span></label>
                </div>
              </article>
            ))}
          </div>
          <article className="extra-day-totals">
            <div><strong>{extraDraft.length}</strong><span>øvelser</span></div>
            <div><strong>{extraTotals.sets}</strong><span>arbejdssæt</span></div>
            <div><strong>{extraTotals.volume.toLocaleString("da-DK")} kg</strong><span>samlet volumen</span></div>
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
            <div><strong>{savedExtraTotals.volume.toLocaleString("da-DK")} kg</strong><span>samlet volumen</span></div>
          </article>
          <div className="exercise-list extra-day-list">
            {extraDay.map((exercise, index) => (
              <div className="exercise" key={exercise.name}>
                <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{exercise.name}</strong><small>{exercise.sets} × {exercise.reps} · {exercise.weight} kg</small></div>
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
          <Metric label="Energi" low="Flad" high="Stærk" value={energy} setValue={setEnergy} />
          <Metric label="Søvnkvalitet" low="Dårlig" high="God" value={sleep} setValue={setSleep} />
          <Metric label="Muskelømhed" low="Ingen" high="Meget" value={soreness} setValue={setSoreness} />
          <div className="pain-row">
            <div><strong>Har du smerter?</strong><small>Ikke almindelig muskelømhed</small></div>
            <button className={pain ? "toggle on" : "toggle"} onClick={() => setPain(!pain)} aria-pressed={pain}><span /></button>
          </div>
          <button className="primary" onClick={() => setView("recommendation")}>Se min anbefaling</button>
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
            <div className="change-title"><span>Forslag til dagens plan</span><strong>{pain ? "Ingen tunge løft" : readiness.level === "Grøn" ? "Ingen ændring" : "−7 % belastning"}</strong></div>
            <div className="weight-change"><div><small>Planlagt snatch</small><strong>70 kg</strong></div><span>→</span><div><small>Foreslået</small><strong>{pain ? "—" : readiness.level === "Grøn" ? "70 kg" : "65 kg"}</strong></div></div>
            <p>Du kan altid se den oprindelige plan og ændre beslutningen.</p>
          </article>
          {!pain && <button className="primary" onClick={() => startSession(readiness.level !== "Grøn")}>{readiness.level === "Grøn" ? "Fortsæt med planen" : "Anvend og start træning"}</button>}
          <button className="secondary" onClick={() => startSession(false)}>{pain ? "Gå tilbage til planen" : "Behold oprindelig plan"}</button>
          <p className="safety">BASE giver træningsstøtte – ikke medicinsk rådgivning.</p>
        </section>
      )}

      {view === "session" && (
        <section className="screen enter session-screen">
          <div className="live-row"><span className="live-dot" /> TRÆNING I GANG <small>{completedSets} / {totalPlannedSets} sæt</small></div>
          <p className="eyebrow">ØVELSE {exerciseIndex + 1} AF {sessionPlan.length}</p>
          <h1>{currentExercise.name}</h1>
          <p className="lede">{currentExercise.focus}.</p>
          <button className="session-video-button" onClick={() => setVideoExercise(currentExercise.name)}>
            <span>{exerciseVideos[currentExercise.name] ? "▶" : "⌕"}</span>
            <span><strong>{exerciseVideos[currentExercise.name] ? "Se teknikvideo" : "Find teknikvideo"}</strong><small>Åbnes uden at nulstille træningen</small></span>
          </button>
          {adjusted && exerciseIndex === 0 && <div className="adjusted-note"><span>↘</span><div><strong>Tilpasset fra 70 kg</strong><small>Readiness · gul</small></div><button onClick={() => { setAdjusted(false); setWeight("70"); }}>Fortryd</button></div>}
          <div className="set-progress" style={{ gridTemplateColumns: `repeat(${currentExercise.sets}, 1fr)` }}>
            {Array.from({ length: currentExercise.sets }, (_, index) => (
              <span key={index} className={index < setIndex || (index === setIndex && setSaved) ? "done" : index === setIndex ? "current" : ""}>{index + 1}</span>
            ))}
          </div>
          <article className="log-card">
            <div className="set-heading"><span>SÆT {setIndex + 1} AF {currentExercise.sets}</span><strong>{currentExercise.plannedReps} reps</strong></div>
            <div className="inputs">
              <label>VÆGT<input inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)} disabled={setSaved} /><span>kg</span></label>
              <label>REPS<input inputMode="text" value={reps} onChange={e => setReps(e.target.value)} disabled={setSaved} /></label>
              <label>RPE<input inputMode="decimal" value={rpe} onChange={e => setRpe(e.target.value)} disabled={setSaved} /></label>
            </div>
            {!setSaved ? (
              <button className="primary" onClick={saveCurrentSet}>Gem sæt</button>
            ) : (
              <>
                <div className="saved">✓ Sæt gemt · {weight} kg × {reps} @ RPE {rpe}</div>
                <button className="primary next-set-button" onClick={advanceSession}>
                  {nextExercise === undefined && setIndex + 1 === currentExercise.sets
                    ? "Afslut træning"
                    : setIndex + 1 === currentExercise.sets
                      ? `Næste øvelse · ${nextExercise?.name}`
                      : `Fortsæt til sæt ${setIndex + 2}`}
                </button>
              </>
            )}
          </article>
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
          <p className="lede">Du gennemførte prototypeflowet.</p>
          <article className="summary-card"><div><strong>{completedSets}</strong><span>sæt logget</span></div><div><strong>{sessionPlan.length}</strong><span>øvelser</span></div><div><strong>{adjusted ? "−7 %" : "0 %"}</strong><span>tilpasning</span></div></article>
          <div className="test-question"><strong>Hjælp os med at gøre BASE bedre</strong><p>Besvar 10 korte spørgsmål om denne session. Det tager cirka ét minut.</p></div>
          <button className="primary" onClick={() => openFeedback("session")}>Giv feedback på træningen</button>
          <button className="secondary" onClick={reset}>Spring over og start forfra</button>
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
