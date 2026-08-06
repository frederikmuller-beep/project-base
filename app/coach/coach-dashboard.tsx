"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AthleteSession = {
  id: string;
  title: string;
  date: string | null;
  status: "active" | "completed";
  plannedSets: number;
  completedSets: number;
  startedAt: string;
  sets: Array<{ exerciseName: string; setNumber: number; weight: string; reps: string; rpe: string }>;
};

type Athlete = {
  testerId: string;
  trainingProfile: "long_distance" | "middle_distance" | "sprint" | null;
  trainingProfileLabel: string;
  lastActiveAt: string | null;
  sessionsStarted: number;
  sessionsCompleted: number;
  setsLogged: number;
  sessions: AthleteSession[];
};

const dateLabel = (value: string | null) => {
  if (!value) return "Ingen aktivitet endnu";
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("da-DK", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

export function CoachDashboard() {
  const [coachKey, setCoachKey] = useState("");
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selected = athletes.find((athlete) => athlete.testerId === selectedId) ?? null;
  const totals = useMemo(() => ({
    sessions: athletes.reduce((sum, athlete) => sum + athlete.sessionsStarted, 0),
    completed: athletes.reduce((sum, athlete) => sum + athlete.sessionsCompleted, 0),
    sets: athletes.reduce((sum, athlete) => sum + athlete.setsLogged, 0),
  }), [athletes]);

  const loadAthletes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/coach/athletes", {
        headers: { authorization: `Bearer ${coachKey}` },
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as { athletes?: Athlete[]; error?: string } | null;
      if (!response.ok || !payload?.athletes) throw new Error(payload?.error ?? "Atletdata kunne ikke hentes.");
      setAthletes(payload.athletes);
      setSelectedId(payload.athletes[0]?.testerId ?? null);
    } catch (loadError) {
      setAthletes([]);
      setSelectedId(null);
      setError(loadError instanceof Error ? loadError.message : "Atletdata kunne ikke hentes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="coach-shell">
      <Link className="export-back" href="/">← Til BASE</Link>
      <p className="eyebrow">TRÆNER · TESTVISNING</p>
      <h1>Følg atleternes træning.</h1>
      <p className="lede">Se fremdrift og registrerede sæt via anonyme tester-ID’er.</p>

      <section className="coach-access-card">
        <label>TRÆNERNØGLE<input type="password" value={coachKey} onChange={(event) => setCoachKey(event.target.value)} placeholder="Indtast den private nøgle" /></label>
        <button type="button" disabled={coachKey.length < 24 || loading} onClick={loadAthletes}>{loading ? "Henter…" : athletes.length ? "Opdatér" : "Åbn træneroverblik"}</button>
      </section>
      {error && <div className="export-error" role="alert">{error}</div>}

      {athletes.length > 0 && (
        <>
          <section className="coach-summary">
            <div><strong>{athletes.length}</strong><span>atleter</span></div>
            <div><strong>{totals.completed}/{totals.sessions}</strong><span>pas gennemført</span></div>
            <div><strong>{totals.sets}</strong><span>sæt registreret</span></div>
          </section>
          <div className="coach-layout">
            <section className="athlete-list" aria-label="Atleter">
              {athletes.map((athlete) => (
                <button key={athlete.testerId} className={selectedId === athlete.testerId ? "active" : ""} onClick={() => setSelectedId(athlete.testerId)}>
                  <span className="athlete-avatar">{athlete.testerId.slice(0, 2)}</span>
                  <span><strong>{athlete.testerId}</strong><small>{athlete.trainingProfileLabel} · {athlete.sessionsCompleted}/{athlete.sessionsStarted} pas</small></span>
                  <b>→</b>
                </button>
              ))}
            </section>

            {selected && (
              <section className="athlete-detail">
                <div className="athlete-detail-head"><div><span>ATLET · {selected.trainingProfileLabel.toLocaleUpperCase("da-DK")}</span><h2>{selected.testerId}</h2></div><small>Senest aktiv<br />{dateLabel(selected.lastActiveAt)}</small></div>
                {selected.sessions.length === 0 ? (
                  <div className="coach-empty"><strong>Ingen træning registreret endnu.</strong><span>Atleten vises, så snart tester-ID’et er forbundet.</span></div>
                ) : selected.sessions.map((session) => (
                  <article className="coach-session" key={session.id}>
                    <div className="coach-session-head">
                      <div><span>{session.date ?? "PLANLAGT PAS"}</span><strong>{session.title}</strong></div>
                      <b className={session.status}>{session.status === "completed" ? "UDFØRT" : "I GANG"}</b>
                    </div>
                    <div className="coach-progress"><span style={{ width: `${Math.min(100, (session.completedSets / Math.max(1, session.plannedSets)) * 100)}%` }} /></div>
                    <small>{session.completedSets} af {session.plannedSets} sæt · startet {dateLabel(session.startedAt)}</small>
                    {session.sets.length > 0 && (
                      <div className="coach-sets">
                        {session.sets.map((set, index) => (
                          <div key={`${set.exerciseName}-${set.setNumber}-${index}`}><span>{set.exerciseName} · sæt {set.setNumber}</span><strong>{set.weight === "0" ? `${set.reps}` : `${set.weight} kg × ${set.reps}`} @ {set.rpe}</strong></div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </section>
            )}
          </div>
          <p className="coach-privacy">Visningen indeholder kun tester-ID og træningsdata. Feedback, readiness og helbredsdata deles ikke.</p>
        </>
      )}
    </main>
  );
}
