"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type DashboardData = {
  generatedAt: string;
  totals: {
    testers: number; activated: number; sessionsStarted: number; sessionsCompleted: number;
    completionRate: number; setsLogged: number; feedbackResponses: number; feedbackCoverage: number;
    coachAssigned: number; needsAttention: number;
  };
  activity: Array<{ date: string; started: number; completed: number; sets: number }>;
  profiles: Array<{ profile: string; label: string; athletes: number; started: number; completed: number }>;
  feedback: {
    responses: number; sessionResponses: number; finalResponses: number; athleteResponses: number;
    coachResponses: number; frictionMentions: number; ease: number | null; clarity: number | null;
    trust: number | null; value: number | null;
  };
  athletes: Array<{
    testerId: string; profile: string; profileLabel: string; sessionsStarted: number; sessionsCompleted: number;
    setsLogged: number; feedbackResponses: number; assignedToCoach: boolean; lastActiveAt: string | null;
    status: "active" | "follow_up" | "not_started";
  }>;
};

const dateTimeLabel = (value: string | null) => {
  if (!value) return "Ingen aktivitet";
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("da-DK", { dateStyle: "short", timeStyle: "short" }).format(date);
};
const dayLabel = (value: string) => new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00Z`));
const percent = (value: number) => `${Math.round(value * 100)} %`;
const rating = (value: number | null) => value === null ? "—" : value.toLocaleString("da-DK", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function OwnerDashboard() {
  const [ownerKey, setOwnerKey] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadDashboard = useCallback(async () => {
    if (ownerKey.length < 24) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/owner/dashboard", {
        headers: { authorization: `Bearer ${ownerKey}` },
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as DashboardData & { error?: string } | null;
      if (!response.ok || !payload?.totals) throw new Error(payload?.error ?? "Dashboardet kunne ikke hentes.");
      setData(payload);
    } catch (loadError) {
      setData(null);
      setError(loadError instanceof Error ? loadError.message : "Dashboardet kunne ikke hentes.");
    } finally {
      setLoading(false);
    }
  }, [ownerKey]);

  useEffect(() => {
    if (!data || !autoRefresh) return;
    const interval = window.setInterval(() => { void loadDashboard(); }, 60_000);
    return () => window.clearInterval(interval);
  }, [autoRefresh, data, loadDashboard]);

  const visibleAthletes = useMemo(
    () => data?.athletes.filter((athlete) => profile === "all" || athlete.profile === profile) ?? [],
    [data, profile],
  );
  const chartMax = Math.max(1, ...(data?.activity.map((day) => Math.max(day.started, day.completed)) ?? [1]));
  const profileMax = Math.max(1, ...(data?.profiles.map((item) => item.athletes) ?? [1]));

  return (
    <main className="owner-shell">
      <header className="owner-header">
        <div><Link href="/">← Til BASE</Link><p className="eyebrow">EJER · LIVE TESTDATA</p><h1>BASE-overblik</h1><p>Følg aktivitet, engagement, feedback og trænerdækning.</p></div>
        {data && <div className="owner-freshness"><span className={loading ? "refreshing" : ""} />Opdateret {dateTimeLabel(data.generatedAt)}<button onClick={() => void loadDashboard()} disabled={loading}>{loading ? "Henter…" : "Opdatér nu"}</button></div>}
      </header>

      {!data && (
        <section className="owner-access-card">
          <div><strong>Privat ejeradgang</strong><p>Dashboardet viser alle pseudonyme testdata og er kun beregnet til projektejeren.</p></div>
          <label>EJERNØGLE<input type="password" value={ownerKey} onChange={(event) => setOwnerKey(event.target.value)} placeholder="Indtast din private nøgle" /></label>
          <button onClick={() => void loadDashboard()} disabled={ownerKey.length < 24 || loading}>{loading ? "Henter…" : "Åbn dashboard"}</button>
          {error && <div className="owner-error" role="alert">{error}</div>}
        </section>
      )}

      {data && (
        <>
          <section className="owner-kpis" aria-label="Nøgletal">
            <article><span>TESTERE</span><strong>{data.totals.testers}</strong><small>{data.totals.activated} har startet · {data.totals.coachAssigned} træner-tildelt</small></article>
            <article><span>GENNEMFØRTE PAS</span><strong>{data.totals.sessionsCompleted}</strong><small>{data.totals.sessionsStarted} startet · {percent(data.totals.completionRate)} gennemført</small></article>
            <article><span>REGISTREREDE SÆT</span><strong>{data.totals.setsLogged}</strong><small>På tværs af alle testprofiler</small></article>
            <article><span>FEEDBACKSVAR</span><strong>{data.totals.feedbackResponses}</strong><small>{percent(data.totals.feedbackCoverage)} af testerne har svaret</small></article>
            <article className={data.totals.needsAttention > 0 ? "attention" : ""}><span>KRÆVER OPMÆRKSOMHED</span><strong>{data.totals.needsAttention}</strong><small>Ikke startet eller inaktiv i mindst 3 dage</small></article>
          </section>

          <section className="owner-grid">
            <article className="owner-panel owner-activity-panel">
              <div className="owner-panel-head"><div><span>AKTIVITET</span><h2>Seneste 14 dage</h2></div><div className="owner-legend"><span><i className="started" />Startet</span><span><i className="completed" />Gennemført</span></div></div>
              <div className="owner-chart" aria-label="Startede og gennemførte træninger de seneste 14 dage">
                {data.activity.map((day) => (
                  <div className="owner-chart-day" key={day.date} title={`${dayLabel(day.date)}: ${day.started} startet, ${day.completed} gennemført, ${day.sets} sæt`}>
                    <div className="owner-bars"><i className="started" style={{ height: `${(day.started / chartMax) * 100}%` }} /><i className="completed" style={{ height: `${(day.completed / chartMax) * 100}%` }} /></div>
                    <span>{dayLabel(day.date)}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="owner-panel">
              <div className="owner-panel-head"><div><span>PROFILFORDELING</span><h2>Testere og gennemførelse</h2></div></div>
              <div className="owner-profile-list">
                {data.profiles.map((item) => (
                  <button key={item.profile} className={profile === item.profile ? "active" : ""} onClick={() => setProfile(profile === item.profile ? "all" : item.profile)}>
                    <div><strong>{item.label}</strong><span>{item.completed}/{item.started} pas gennemført</span></div>
                    <div className="owner-profile-bar"><i style={{ width: `${(item.athletes / profileMax) * 100}%` }} /></div><b>{item.athletes}</b>
                  </button>
                ))}
              </div>
            </article>
          </section>

          <section className="owner-feedback-section">
            <div className="owner-section-title"><div><span>FEEDBACKKVALITET</span><h2>Hvad fortæller testerne?</h2></div><p>{data.feedback.sessionResponses} sessionssvar · {data.feedback.finalResponses} afsluttende · {data.feedback.coachResponses} fra trænere</p></div>
            <div className="owner-ratings">
              <article><span>Brugervenlighed</span><strong>{rating(data.feedback.ease)}</strong><small>ud af 5</small></article>
              <article><span>Tydelighed</span><strong>{rating(data.feedback.clarity)}</strong><small>ud af 5</small></article>
              <article><span>Tillid</span><strong>{rating(data.feedback.trust)}</strong><small>ud af 5</small></article>
              <article><span>Oplevet værdi</span><strong>{rating(data.feedback.value)}</strong><small>ud af 5</small></article>
              <article><span>Friktion nævnt</span><strong>{data.feedback.frictionMentions}</strong><small>svar med konkret friktion</small></article>
            </div>
          </section>

          <section className="owner-athlete-section">
            <div className="owner-section-title"><div><span>HANDLINGSLISTE</span><h2>Testere</h2></div><div className="owner-table-controls"><button className={profile === "all" ? "active" : ""} onClick={() => setProfile("all")}>Alle profiler</button><label><input type="checkbox" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} /> Auto-opdatér</label></div></div>
            <div className="owner-table-wrap"><table><thead><tr><th>Tester</th><th>Profil</th><th>Status</th><th>Pas</th><th>Sæt</th><th>Feedback</th><th>Træner</th><th>Senest aktiv</th></tr></thead><tbody>
              {visibleAthletes.map((athlete) => (
                <tr key={athlete.testerId}><td><strong>{athlete.testerId}</strong></td><td>{athlete.profileLabel}</td><td><span className={`owner-status ${athlete.status}`}>{athlete.status === "active" ? "Aktiv" : athlete.status === "follow_up" ? "Følg op" : "Ikke startet"}</span></td><td>{athlete.sessionsCompleted}/{athlete.sessionsStarted}</td><td>{athlete.setsLogged}</td><td>{athlete.feedbackResponses}</td><td>{athlete.assignedToCoach ? "Ja" : "Nej"}</td><td>{dateTimeLabel(athlete.lastActiveAt)}</td></tr>
              ))}
              {visibleAthletes.length === 0 && <tr><td colSpan={8}>Ingen testere i denne profil.</td></tr>}
            </tbody></table></div>
          </section>
          <p className="owner-source-note">Kilde: BASE-testdatabasen · pseudonyme tester-ID’er · data opdateres ved åbning og hvert minut, når auto-opdatering er aktiv.</p>
        </>
      )}
    </main>
  );
}
