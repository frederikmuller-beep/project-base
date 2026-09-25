"use client";

import { useState } from "react";
import { healthProviderLabel, healthTrendLabel, type HealthSummary } from "../lib/health-data";
import type { AthleteDashboardData } from "../lib/training-analytics";

const formatKg = (value: number) => `${value.toLocaleString("da-DK")} kg`;
const formatIntensity = (value: number | null) => value === null ? "—" : `${value.toLocaleString("da-DK", { maximumFractionDigits: 1 })} %`;

export function AthleteDashboard({ data, loading, healthSummary, readiness, onBack }: { data: AthleteDashboardData | null; loading: boolean; healthSummary: HealthSummary | null; readiness: { energy: number; sleep: number; soreness: number; pain: boolean; checked: boolean }; onBack: () => void }) {
  const [selectedStrengthId, setSelectedStrengthId] = useState<string | null>(null);
  const volumeProgress = data && data.summary.expectedVolumeKg > 0
    ? Math.min(100, Math.round((data.summary.actualVolumeKg / data.summary.expectedVolumeKg) * 100))
    : 0;
  const selectedStrength = data?.strengthExercises.find((strength) => strength.id === selectedStrengthId)
    ?? data?.strengthExercises.find((strength) => strength.points.length > 0)
    ?? data?.strengthExercises[0];
  const maxPoint = Math.max(1, ...(selectedStrength?.points.map((point) => point.estimated1Rm) ?? [1]));
  const readinessScore = Math.max(1, Math.min(5, Math.round((readiness.energy + readiness.sleep + (6 - readiness.soreness) - (readiness.pain ? 2 : 0)) / 3)));
  const readinessHeadline = !readiness.checked ? "Dagens check-in mangler" : readiness.pain || readinessScore <= 2 ? "Træn med omtanke i dag" : readinessScore >= 4 ? "Klar til planlagt kvalitet" : "Normal træning med kontrol";

  return (
    <section className="screen athlete-dashboard enter">
      <button className="back" onClick={onBack}>← Tilbage</button>
      <p className="eyebrow">MIN UDVIKLING</p>
      <h1>Din træning i tal.</h1>
      <p className="lede">Følg arbejdet, se din styrke udvikle sig og brug tallene til bedre beslutninger.</p>

      {loading ? <div className="dashboard-loading">Henter din træningshistorik…</div> : !data ? (
        <div className="dashboard-empty"><strong>Ingen data endnu</strong><span>Gennemfør dit første planlagte pas for at starte dashboardet.</span></div>
      ) : <>
        <div className="dashboard-section-title first"><span>READINESS</span><h2>Din status i dag</h2></div>
        <article className={`dashboard-readiness-card ${readiness.checked ? `score-${readinessScore}` : "pending"}`}>
          <div><span>{readiness.checked ? `CHECK-IN · ${readinessScore}/5` : "CHECK-IN"}</span><strong>{readinessHeadline}</strong><p>{readiness.checked ? `Energi ${readiness.energy}/5 · søvn ${readiness.sleep}/5 · ømhed ${readiness.soreness}/5${readiness.pain ? " · smerte registreret" : ""}` : "Udfyld readiness på startsiden før træningen, så anbefalingen får dagens kontekst."}</p></div>
          {healthSummary?.available && healthSummary.latest ? <aside><span>{healthProviderLabel(healthSummary.provider)}</span><strong>{healthTrendLabel(healthSummary.trend)}</strong><small>{healthSummary.latest.hrvMs !== null ? `${healthSummary.latest.hrvMs} ms HRV` : `${healthSummary.daysIncluded} dages data`}</small></aside> : <aside><span>URDATA</span><strong>Afventer</strong><small>Garmin / Apple Health</small></aside>}
        </article>

        <article className="dashboard-week-card">
          <div><span>{data.overview.phase.toLocaleUpperCase("da-DK")} · UGE {data.overview.currentWeek}</span><strong>{data.overview.feedback.headline}</strong><p>{data.overview.feedback.detail}</p></div>
          <b>{data.overview.completedSessions}/{data.overview.plannedSessions}</b>
          {data.overview.nextSession && <small>NÆSTE · {data.overview.nextSession}</small>}
        </article>

        <article className="dashboard-progress-card">
          <div><span>TESTPERIODEN</span><strong>{data.summary.completedSessions} af {data.summary.plannedSessions} pas gennemført</strong></div>
          <b>{volumeProgress}%</b>
          <div className="dashboard-progress-track"><i style={{ width: `${volumeProgress}%` }} /></div>
          <small>Andel af den forventede styrkevolumen, som er registreret.</small>
        </article>

        <div className="dashboard-section-title"><span>BELASTNING</span><h2>Forventet og faktisk</h2></div>
        <div className="dashboard-comparison">
          <article><span>FORVENTET VOLUMEN</span><strong>{formatKg(data.summary.expectedVolumeKg)}</strong><small>Samlet planlagt arbejde</small></article>
          <article><span>FAKTISK VOLUMEN</span><strong>{formatKg(data.summary.actualVolumeKg)}</strong><small>Vægt × udførte gentagelser</small></article>
          <article><span>FORVENTET INTENSITET</span><strong>{formatIntensity(data.summary.expectedIntensityPercent)}</strong><small>Gns. af estimeret 1RM</small></article>
          <article><span>FAKTISK INTENSITET</span><strong>{formatIntensity(data.summary.actualIntensityPercent)}</strong><small>Baseret på vægt, reps og RIR</small></article>
        </div>

        {data.sportModule && <>
          <div className="dashboard-section-title"><span>{data.sportModule.eyebrow}</span><h2>{data.sportModule.title}</h2></div>
          <div className={`sport-dashboard-grid ${data.sportModule.kind}`}>
            {data.sportModule.metrics.map((metric) => <article key={metric.label}><span>{metric.label.toLocaleUpperCase("da-DK")}</span><strong>{metric.value}</strong><small>{metric.detail}</small></article>)}
          </div>
          <p className="sport-dashboard-feedback">{data.sportModule.feedback}</p>
        </>}

        {data.bodybuilding && <>
          <div className="dashboard-section-title"><span>BODYBUILDING · UGE {data.bodybuilding.currentWeek}</span><h2>Muskelgruppevolumen</h2></div>
          <article className="bodybuilding-feedback-card">
            <div><span>{data.bodybuilding.phase.toLocaleUpperCase("da-DK")}</span><strong>{data.bodybuilding.feedback.headline}</strong></div>
            <b>{data.bodybuilding.completedSessions}/{data.bodybuilding.plannedSessions}</b>
            <p>{data.bodybuilding.feedback.detail}</p>
            {data.bodybuilding.nextSession && <small>NÆSTE PAS · {data.bodybuilding.nextSession}</small>}
          </article>
          <div className="muscle-volume-list">
            {data.bodybuilding.muscleGroups.map((group) => {
              const completion = group.plannedSets > 0 ? Math.min(100, Math.round((group.completedSets / group.plannedSets) * 100)) : 0;
              const state = completion >= 100 ? "Gennemført" : completion >= 70 ? "Tæt på" : group.completedSets > 0 ? "I gang" : "Planlagt";
              return <article key={group.id}>
                <div><strong>{group.label}</strong><span>{group.completedSets} / {group.plannedSets} arbejdssæt</span></div>
                <b className={completion >= 100 ? "complete" : ""}>{state}</b>
                <div className="muscle-volume-track"><i style={{ width: `${completion}%` }} /></div>
              </article>;
            })}
          </div>
          <p className="bodybuilding-volume-note">BASE tæller primære arbejdssæt pr. muskelgruppe. Indirekte arbejde fra flerledsøvelser vises ikke som et helt ekstra sæt.</p>
        </>}

        <div className="dashboard-section-title"><span>RELATIV STYRKE</span><h2>Udvikling i estimeret 1RM</h2></div>
        <div className="strength-lift-selector" aria-label="Vælg hovedøvelse">
          {data.strengthExercises.map((strength) => (
            <button
              className={selectedStrength?.id === strength.id ? "active" : ""}
              key={strength.id}
              onClick={() => setSelectedStrengthId(strength.id)}
              type="button"
            >
              <strong>{strength.exercise}</strong>
              <span>{strength.currentEstimated1Rm === null ? "Ingen data" : `${strength.currentEstimated1Rm.toLocaleString("da-DK", { maximumFractionDigits: 1 })} kg`}</span>
            </button>
          ))}
        </div>
        {selectedStrength && selectedStrength.points.length > 0 && selectedStrength.currentEstimated1Rm !== null && selectedStrength.changePercent !== null && selectedStrength.relativeIndex !== null ? (
          <article className="strength-history-card">
            <div className="strength-history-head">
              <div><span>{selectedStrength.exercise}</span><strong>{selectedStrength.currentEstimated1Rm.toLocaleString("da-DK", { maximumFractionDigits: 1 })} kg</strong><small>Aktuelt estimeret 1RM</small></div>
              <b className={selectedStrength.changePercent >= 0 ? "positive" : "negative"}>{selectedStrength.changePercent >= 0 ? "+" : ""}{selectedStrength.changePercent.toLocaleString("da-DK", { maximumFractionDigits: 1 })}%</b>
            </div>
            <div className="strength-history-chart" aria-label={`Historisk estimeret 1RM for ${selectedStrength.exercise}`}>
              {selectedStrength.points.map((point, index) => <div key={`${point.label}-${index}`}><i style={{ height: `${Math.max(12, (point.estimated1Rm / maxPoint) * 100)}%` }} /><span>{point.label}</span></div>)}
            </div>
            <div className="strength-index-row"><span>Relativt styrkeindeks</span><strong>{selectedStrength.relativeIndex}</strong><small>Første registrering = 100</small></div>
          </article>
        ) : <div className="dashboard-empty compact"><strong>Ingen data for {selectedStrength?.exercise ?? "øvelsen"} endnu</strong><span>Historikken starter, når du logger et belastet sæt med reps og RIR.</span></div>}

        <article className="dashboard-method-note"><strong>Sådan regner BASE</strong><p>Estimeret 1RM beregnes med Epley-formlen ud fra vægt, gentagelser og registreret RIR. Tallene er træningsstøtte og ikke en maksimaltest.</p></article>
      </>}
    </section>
  );
}
