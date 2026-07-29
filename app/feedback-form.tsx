"use client";

import { FormEvent, useState } from "react";

export type FeedbackKind = "session" | "final";
type TesterRole = "athlete" | "coach";

const sessionAreas = [
  "Dagens træning",
  "Readiness",
  "Anbefaling",
  "Træningslog",
  "Øvelsesbibliotek",
];

export function FeedbackForm({
  kind,
  onBack,
  onDone,
}: {
  kind: FeedbackKind;
  onBack: () => void;
  onDone: () => void;
}) {
  const [role, setRole] = useState<TesterRole>("athlete");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const answers: Record<string, string | string[]> = {};

    for (const [key, rawValue] of formData.entries()) {
      if (["testerId", "role", "website"].includes(key)) continue;
      const value = String(rawValue).trim();
      if (!value) continue;
      const existing = answers[key];
      if (existing) {
        answers[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        answers[key] = value;
      }
    }

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          testerId: String(formData.get("testerId") ?? "").trim().toUpperCase(),
          role,
          answers,
          website: String(formData.get("website") ?? ""),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Dit svar kunne ikke gemmes.");
      }

      onDone();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Dit svar kunne ikke gemmes. Prøv igen.");
      setSubmitting(false);
    }
  }

  return (
    <section className="screen feedback-screen enter">
      <button className="back" type="button" onClick={onBack}>← Tilbage</button>
      <p className="eyebrow">{kind === "session" ? "TESTFEEDBACK · 1 MIN" : "AFSLUTTENDE EVALUERING · 5–7 MIN"}</p>
      <h1>{kind === "session" ? "Hvordan fungerede BASE i dag?" : "Hvordan var testperioden?"}</h1>
      <p className="lede">
        {kind === "session"
          ? "Svar umiddelbart efter træningen. Vi tester produktet – ikke dig."
          : "Din samlede vurdering hjælper os med at vælge, hvad vi skal bygge som det næste."}
      </p>

      <form onSubmit={submitFeedback}>
        <fieldset className="form-section">
          <legend>Om din test</legend>
          <label className="field-label" htmlFor={`${kind}-tester-id`}>Tester-ID</label>
          <input
            className="text-input"
            id={`${kind}-tester-id`}
            name="testerId"
            placeholder="Fx A1 eller T1"
            minLength={2}
            maxLength={12}
            pattern="[A-Za-z0-9ÆØÅæøå-]+"
            autoComplete="off"
            required
          />
          <p className="field-hint">Brug det ID, du har fået af testlederen – ikke dit navn.</p>

          <span className="field-label">Din rolle</span>
          <div className="choice-row two-columns">
            <Choice name="role" value="athlete" label="Atlet" checked={role === "athlete"} onChange={() => setRole("athlete")} />
            <Choice name="role" value="coach" label="Træner" checked={role === "coach"} onChange={() => setRole("coach")} />
          </div>
        </fieldset>

        {kind === "session" ? <SessionQuestions /> : <FinalQuestions role={role} />}

        <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        {error && <div className="form-error" role="alert">{error}</div>}
        <p className="privacy-note">Kun dit tester-ID, din rolle og dine svar gemmes.</p>
        <button className="primary submit-feedback" type="submit" disabled={submitting}>
          {submitting ? "Gemmer svar…" : "Send feedback"}
        </button>
      </form>
    </section>
  );
}

function SessionQuestions() {
  return (
    <>
      <fieldset className="form-section">
        <legend>Dagens brug</legend>
        <span className="field-label">Hvad brugte du i dag?</span>
        <div className="check-grid">
          {sessionAreas.map((area) => (
            <label className="check-choice" key={area}>
              <input type="checkbox" name="usedAreas" value={area} />
              <span>{area}</span>
            </label>
          ))}
        </div>

        <ChoiceQuestion
          name="completion"
          label="Kunne du gennemføre det, du ville?"
          options={["Ja, uden hjælp", "Ja, med lidt hjælp", "Delvist", "Nej"]}
        />
      </fieldset>

      <fieldset className="form-section">
        <legend>Din oplevelse</legend>
        <ScaleQuestion name="ease" label="Hvor let var BASE at bruge?" low="Meget svært" high="Meget let" />
        <ScaleQuestion name="clarity" label="Hvor tydeligt var næste skridt?" low="Meget uklart" high="Meget tydeligt" />
        <ScaleQuestion name="trust" label="Hvor meget stolede du på anbefalingen?" low="Slet ikke" high="I høj grad" />
      </fieldset>

      <fieldset className="form-section">
        <legend>Med dine egne ord</legend>
        <TextQuestion name="mostUseful" label="Hvad var mest nyttigt i dag?" />
        <TextQuestion name="friction" label="Var noget uklart, irriterende eller langsomt?" />
        <TextQuestion name="missing" label="Hvad manglede du?" />
      </fieldset>
    </>
  );
}

function FinalQuestions({ role }: { role: TesterRole }) {
  return (
    <>
      <fieldset className="form-section">
        <legend>Samlet vurdering</legend>
        <label className="field-label" htmlFor="sessions-used">Hvor mange gange brugte du BASE?</label>
        <input className="text-input compact-input" id="sessions-used" name="sessionsUsed" type="number" min="1" max="30" inputMode="numeric" required />
        <ScaleQuestion name="overallEase" label="Hvor let var BASE samlet set at bruge?" low="Meget svært" high="Meget let" />
        <ScaleQuestion name="overallValue" label="Hvor stor værdi gav BASE dig?" low="Ingen værdi" high="Meget stor værdi" />
        <ScaleQuestion name="overallTrust" label="Hvor troværdige var anbefalingerne?" low="Utroværdige" high="Meget troværdige" />

        <ChoiceQuestion
          name="mostValuableFeature"
          label="Hvilken funktion gav mest værdi?"
          options={["Dagens plan", "Readiness", "Anbefaling", "Træningslog", "Øvelsesbibliotek"]}
        />
        <ChoiceQuestion
          name="comparison"
          label="Hvordan var BASE sammenlignet med din nuværende løsning?"
          options={["Meget bedre", "Lidt bedre", "Cirka det samme", "Lidt dårligere", "Meget dårligere"]}
        />
        <ChoiceQuestion
          name="weeklyUse"
          label="Ville du bruge BASE hver uge?"
          options={["Helt sikkert", "Sandsynligvis", "Måske", "Sandsynligvis ikke", "Slet ikke"]}
        />
      </fieldset>

      <fieldset className="form-section role-section">
        <legend>{role === "athlete" ? "Som atlet" : "Som træner"}</legend>
        {role === "athlete" ? (
          <>
            <ScaleQuestion name="readinessHelp" label="Hjalp readiness-tjekket dig med at vurdere dagens træning?" low="Slet ikke" high="I høj grad" />
            <ScaleQuestion name="loadFit" label="Passede den anbefalede belastning til din dagsform?" low="Slet ikke" high="Meget godt" />
            <ChoiceQuestion name="loggingDistraction" label="Forstyrrede registreringen selve træningen?" options={["Nej", "Lidt", "En del", "Meget"]} />
            <TextQuestion name="loggingImprovement" label="Hvad skulle gøre træningsloggen lettere?" />
          </>
        ) : (
          <>
            <ScaleQuestion name="coachOverview" label="Gav BASE et tydeligt billede af atletens plan og status?" low="Slet ikke" high="I høj grad" />
            <ChoiceQuestion name="coachSupport" label="Hvordan påvirkede anbefalingerne din faglige vurdering?" options={["Understøttede meget", "Understøttede lidt", "Hverken eller", "Forstyrrede lidt", "Forstyrrede meget"]} />
            <TextQuestion name="coachMissingInfo" label="Hvilke oplysninger manglede du?" />
            <TextQuestion name="responsibility" label="Hvordan bør ansvaret fordeles mellem atlet, træner og BASE?" />
          </>
        )}
      </fieldset>

      <fieldset className="form-section">
        <legend>Det vigtigste næste skridt</legend>
        <TextQuestion name="leastValuable" label="Hvilken funktion gav mindst værdi – og hvorfor?" />
        <TextQuestion name="priorityChange" label="Hvad er den vigtigste ændring, vi bør lave først?" required />
        <TextQuestion name="retentionReason" label="Hvad ville få dig til at bruge BASE fast?" />
        <TextQuestion name="additionalFeedback" label="Er der andet, vi bør vide?" />
        <ChoiceQuestion name="followUp" label="Må vi kontakte dig til en 15-minutters samtale?" options={["Ja", "Nej"]} />
      </fieldset>
    </>
  );
}

function ScaleQuestion({ name, label, low, high }: { name: string; label: string; low: string; high: string }) {
  return (
    <div className="question-block">
      <span className="field-label">{label}</span>
      <div className="feedback-scale" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value}>
            <input type="radio" name={name} value={value} required />
            <span>{value}</span>
          </label>
        ))}
      </div>
      <div className="scale-labels"><span>{low}</span><span>{high}</span></div>
    </div>
  );
}

function ChoiceQuestion({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div className="question-block">
      <span className="field-label">{label}</span>
      <div className="choice-stack" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <Choice key={option} name={name} value={option} label={option} />
        ))}
      </div>
    </div>
  );
}

function Choice({
  name,
  value,
  label,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="radio-choice">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} required />
      <span>{label}</span>
    </label>
  );
}

function TextQuestion({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="question-block field-label">
      {label}
      <textarea className="text-area" name={name} rows={3} maxLength={1000} required={required} />
    </label>
  );
}
