"use client";

import { useState } from "react";
import type { AthleteDashboardData } from "../lib/training-analytics";

const formatKg = (value: number) => `${value.toLocaleString("da-DK")} kg`;
const formatIntensity = (value: number | null) => value === null ? "—" : `${value.toLocaleString("da-DK", { maximumFractionDigits: 1 })} %`;

export function AthleteDashboard({ data, loading, onBack }: { data: AthleteDashboardData | null; loading: boolean; onBack: () => void }) {
  const [selectedStrengthId, setSelectedStrengthId] = useState<string | null>(null);
  const volumeProgress = data && data.summary.expectedVolumeKg > 0
    ? Math.min(100, Math.round((data.summary.actualVolumeKg / data.summary.expectedVolumeKg) * 100))
    : 0;
  const selectedStrength = data?.strengthExercises.find((strength) => strength.id === selectedStrengthId)
    ?? data?.strengthExercises.find((strength) => strength.points.length > 0)
    ?? data?.strengthExercises[0];
  const maxPoint = Math.max(1, ...(selectedStrength?.points.map((point) => point.estimated1Rm) ?? [1]));

  return (
    <section className="screen athlete-dashboard enter">
      <button className="back" onClick={onBack}>← Tilbage</button>
      <p className="eyebrow">MIN UDVIKLING</p>
      <h1>Din træning i tal.</h1>
      <p className="lede">Følg arbejdet, se din styrke udvikle sig og brug tallene til bedre beslutninger.</p>

      {loading ? <div className="dashboard-loading">Henter din træningshistorik…</div> : !data ? (
        <div className="dashboard-empty"><strong>Ingen data endnu</strong><span>Gennemfør dit første planlagte pas for at starte dashboardet.</span></div>
      ) : <>
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
