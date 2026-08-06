"use client";

import { useState } from "react";
import Link from "next/link";

const exports = [
  { dataset: "overview", title: "Testoverblik", description: "Én række pr. tester med gennemførte pas, sæt og feedback." },
  { dataset: "training", title: "Træningsdata", description: "Alle planlagte pas og registrerede arbejdssæt." },
  { dataset: "feedback", title: "Feedbacksvar", description: "Alle sessionsevalueringer og afsluttende spørgeskemaer." },
] as const;

export function ExportPanel() {
  const [exportKey, setExportKey] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const download = async (dataset: typeof exports[number]["dataset"]) => {
    setError("");
    setDownloading(dataset);
    try {
      const response = await fetch(`/api/admin/export?dataset=${dataset}`, {
        headers: { authorization: `Bearer ${exportKey}` },
        cache: "no-store",
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Eksporten kunne ikke hentes.");
      }
      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") ?? "";
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? `base-${dataset}.csv`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Eksporten kunne ikke hentes.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <section className="export-shell">
      <Link className="export-back" href="/">← Til BASE</Link>
      <p className="eyebrow">INTERN TESTADMINISTRATION</p>
      <h1>Eksportér testdata.</h1>
      <p className="lede">Download pseudonymiserede testdata som CSV-filer, der kan åbnes direkte i Excel eller Google Sheets.</p>

      <label className="export-key-field">
        EKSPORTNØGLE
        <input
          type="password"
          value={exportKey}
          onChange={(event) => setExportKey(event.target.value)}
          autoComplete="current-password"
          placeholder="Indtast din private nøgle"
        />
      </label>

      <div className="export-options">
        {exports.map((item) => (
          <article className="export-option" key={item.dataset}>
            <div><strong>{item.title}</strong><p>{item.description}</p></div>
            <button
              type="button"
              disabled={exportKey.length < 24 || downloading !== null}
              onClick={() => download(item.dataset)}
            >
              {downloading === item.dataset ? "Henter…" : "Download CSV"}
            </button>
          </article>
        ))}
      </div>

      {error && <div className="export-error" role="alert">{error}</div>}
      <p className="export-privacy">Nøglen gemmes ikke i browseren. Eksporterne indeholder tester-ID, men ingen navne eller urdata.</p>
    </section>
  );
}
