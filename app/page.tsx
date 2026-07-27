"use client";

import { useMemo, useState } from "react";

type View = "today" | "library" | "readiness" | "recommendation" | "session" | "complete";

const todayExercises = [
  { name: "Snatch", detail: "6 × 2 · 70 kg", focus: "Rolig fra gulv, aggressiv under stangen" },
  { name: "Clean & Jerk", detail: "5 × 1+1 · 95 kg", focus: "Stabil modtagelse" },
  { name: "Front squat", detail: "4 × 3 · 105 kg", focus: "Kontrolleret excentrisk" },
];

const exerciseLibrary = [
  { name: "Snatch", category: "Konkurrenceløft", target: "Helkrop · teknik", cue: "Tæt stang og aktiv modtagelse" },
  { name: "Hang snatch", category: "Snatch", target: "Timing · eksplosivitet", cue: "Hold spændingen over knæet" },
  { name: "Power snatch", category: "Snatch", target: "Hastighed · træk", cue: "Modtag stangen højt og stabilt" },
  { name: "Snatch balance", category: "Snatch", target: "Modtagelse · fodarbejde", cue: "Pres aktivt op mod stangen" },
  { name: "Clean & Jerk", category: "Konkurrenceløft", target: "Helkrop · teknik", cue: "Stabil clean før et roligt dip" },
  { name: "Hang clean", category: "Clean", target: "Position · turnover", cue: "Afslut benene før albuerne" },
  { name: "Power clean", category: "Clean", target: "Eksplosivitet · hastighed", cue: "Mød stangen – lad den ikke falde" },
  { name: "Push jerk", category: "Jerk", target: "Ben-drive · timing", cue: "Lodret dip og hurtig lockout" },
  { name: "Front squat", category: "Squat", target: "Ben · core", cue: "Albuer højt gennem hele løftet" },
  { name: "Back squat", category: "Squat", target: "Maksimal benstyrke", cue: "Stabil bracing og ensartet dybde" },
  { name: "Snatch pull", category: "Træk", target: "Ryg · position · kraft", cue: "Bevar skuldrene over stangen" },
  { name: "Clean pull", category: "Træk", target: "Ben · ryg · kraft", cue: "Skub gulvet væk og afslut lodret" },
  { name: "Strict press", category: "Assistance", target: "Skuldre · lockout", cue: "Spænd balder og hold ribben nede" },
];

export default function Home() {
  const [view, setView] = useState<View>("today");
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [soreness, setSoreness] = useState(3);
  const [pain, setPain] = useState(false);
  const [adjusted, setAdjusted] = useState(false);
  const [logged, setLogged] = useState(false);
  const [weight, setWeight] = useState("65");
  const [reps, setReps] = useState("2");
  const [rpe, setRpe] = useState("7");

  const readiness = useMemo(() => {
    if (pain) return { level: "Rød", className: "red", score: 38, text: "Pause tunge løft", reason: "Du har angivet smerte. BASE ændrer ikke din plan automatisk." };
    const score = Math.round(((energy + sleep + (6 - soreness)) / 15) * 100);
    if (score >= 72) return { level: "Grøn", className: "green", score, text: "Følg planen", reason: "Dine svar ligger tæt på dit normale niveau." };
    return { level: "Gul", className: "amber", score, text: "Reducer belastningen 7 %", reason: "Lav energi og ømhed gør kvalitet vigtigere end maksimal belastning i dag." };
  }, [energy, sleep, soreness, pain]);

  const reset = () => {
    setView("today"); setEnergy(3); setSleep(3); setSoreness(3); setPain(false);
    setAdjusted(false); setLogged(false); setWeight("65"); setReps("2"); setRpe("7");
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
              <div><strong>3,1 t</strong><span>samlet volumen</span></div>
            </div>
          </article>

          <button className="readiness-card" onClick={() => setView("readiness")}>
            <span className="pulse-dot" />
            <span><strong>Check din readiness</strong><small>30 sekunder · tilpas dagens belastning</small></span>
            <b>→</b>
          </button>

          <div className="section-head"><h3>Dagens plan</h3><span>3 øvelser</span></div>
          <div className="exercise-list">
            {todayExercises.map((exercise, index) => (
              <div className="exercise" key={exercise.name}>
                <span className="exercise-number">0{index + 1}</span>
                <div><strong>{exercise.name}</strong><small>{exercise.detail}</small></div>
              </div>
            ))}
          </div>
          <button className="library-link" onClick={() => setView("library")}>
            <span><strong>Udforsk øvelsesbiblioteket</strong><small>13 øvelser · 7 kategorier</small></span>
            <b>→</b>
          </button>
          <button className="primary" onClick={() => setView("session")}>Start træning</button>
        </section>
      )}

      {view === "library" && (
        <section className="screen enter">
          <button className="back" onClick={() => setView("today")}>← Tilbage</button>
          <p className="eyebrow">ØVELSESBIBLIOTEK</p>
          <h1>Variation med et formål.</h1>
          <p className="lede">Hver variation er koblet til et træningsmål og et enkelt teknisk fokus.</p>
          <div className="library-summary">
            <div><strong>13</strong><span>øvelser</span></div>
            <div><strong>7</strong><span>kategorier</span></div>
            <div><strong>10</strong><span>variationer</span></div>
          </div>
          <div className="library-list">
            {exerciseLibrary.map((exercise, index) => (
              <article className="library-exercise" key={exercise.name}>
                <div className="library-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="library-content">
                  <span className="category-pill">{exercise.category}</span>
                  <h3>{exercise.name}</h3>
                  <p>{exercise.target}</p>
                  <small><b>Fokus:</b> {exercise.cue}</small>
                </div>
                <button aria-label={`Tilføj ${exercise.name} til program`}>+</button>
              </article>
            ))}
          </div>
          <button className="secondary" onClick={() => setView("today")}>Tilbage til dagens træning</button>
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
          {!pain && <button className="primary" onClick={() => { setAdjusted(readiness.level !== "Grøn"); setView("session"); }}>{readiness.level === "Grøn" ? "Fortsæt med planen" : "Anvend og start træning"}</button>}
          <button className="secondary" onClick={() => { setAdjusted(false); setView("session"); }}>{pain ? "Gå tilbage til planen" : "Behold oprindelig plan"}</button>
          <p className="safety">BASE giver træningsstøtte – ikke medicinsk rådgivning.</p>
        </section>
      )}

      {view === "session" && (
        <section className="screen enter session-screen">
          <div className="live-row"><span className="live-dot" /> TRÆNING I GANG <small>00:12</small></div>
          <p className="eyebrow">ØVELSE 1 AF 3</p>
          <h1>Snatch</h1>
          <p className="lede">Rolig fra gulv, aggressiv under stangen.</p>
          {adjusted && <div className="adjusted-note"><span>↘</span><div><strong>Tilpasset fra 70 kg</strong><small>Readiness · gul</small></div><button onClick={() => setAdjusted(false)}>Fortryd</button></div>}
          <div className="set-progress">{[1,2,3,4,5,6].map(n => <span key={n} className={logged && n === 1 ? "done" : n === 1 ? "current" : ""}>{n}</span>)}</div>
          <article className="log-card">
            <div className="set-heading"><span>SÆT 1</span><strong>2 reps</strong></div>
            <div className="inputs">
              <label>VÆGT<input inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)} /><span>kg</span></label>
              <label>REPS<input inputMode="numeric" value={reps} onChange={e => setReps(e.target.value)} /></label>
              <label>RPE<input inputMode="decimal" value={rpe} onChange={e => setRpe(e.target.value)} /></label>
            </div>
            {!logged ? <button className="primary" onClick={() => setLogged(true)}>Gem sæt</button> : <div className="saved">✓ Sæt gemt · {weight} kg × {reps} @ RPE {rpe}</div>}
          </article>
          <div className="next-exercise"><span>NÆSTE</span><strong>Clean & Jerk · 5 × 1+1</strong></div>
          {logged && <button className="primary" onClick={() => setView("complete")}>Afslut testtræning</button>}
        </section>
      )}

      {view === "complete" && (
        <section className="screen complete-screen enter">
          <div className="checkmark">✓</div>
          <p className="eyebrow">SESSION GEMT</p>
          <h1>Godt arbejde.</h1>
          <p className="lede">Du gennemførte prototypeflowet.</p>
          <article className="summary-card"><div><strong>1</strong><span>sæt logget</span></div><div><strong>{weight} kg</strong><span>snatch</span></div><div><strong>{adjusted ? "−7 %" : "0 %"}</strong><span>tilpasning</span></div></article>
          <div className="test-question"><strong>Hvad forventede du skulle ske nu?</strong><p>Fortæl testlederen, hvad du ville gøre som det næste i en rigtig træning.</p></div>
          <button className="primary" onClick={reset}>Start prototypen forfra</button>
        </section>
      )}

      <footer className="prototype-label">INTERAKTIV PROTOTYPE · DATA GEMMES IKKE</footer>
    </main>
  );
}

function Metric({ label, low, high, value, setValue }: { label: string; low: string; high: string; value: number; setValue: (n: number) => void }) {
  return <div className="metric"><div className="metric-head"><strong>{label}</strong><span>{value}/5</span></div><div className="scale">{[1,2,3,4,5].map(n => <button key={n} onClick={() => setValue(n)} className={value === n ? "active" : ""}>{n}</button>)}</div><div className="scale-labels"><span>{low}</span><span>{high}</span></div></div>;
}
