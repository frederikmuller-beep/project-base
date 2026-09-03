import assert from "node:assert/strict";
import test from "node:test";
import { buildHealthSummary } from "../lib/health-data.ts";

const days = ["2026-08-01", "2026-08-02", "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07"];

const metric = (metricDate, overrides = {}) => ({
  provider: "apple_health",
  metricDate,
  sleepDurationMinutes: 420,
  sleepScore: 70,
  restingHeartRate: 55,
  hrvMs: 50,
  hrvMethod: "sdnn",
  sourceUpdatedAt: `${metricDate}T08:00:00Z`,
  ...overrides,
});

test("returns an unavailable summary when no provider has supplied data", () => {
  assert.deepEqual(buildHealthSummary([]), {
    available: false,
    provider: null,
    latest: null,
    daysIncluded: 0,
    trend: "insufficient",
  });
});

test("describes an improving seven-day pattern without creating a readiness score", () => {
  const metrics = days.map((day) => metric(day));
  metrics[6] = metric(days[6], {
    sleepDurationMinutes: 480,
    sleepScore: 80,
    restingHeartRate: 52,
    hrvMs: 60,
  });

  const summary = buildHealthSummary(metrics);
  assert.equal(summary.provider, "apple_health");
  assert.equal(summary.daysIncluded, 7);
  assert.equal(summary.trend, "up");
  assert.equal(summary.latest?.metricDate, "2026-08-07");
  assert.equal("score" in summary, false);
});

test("marks sparse data as insufficient and never mixes providers", () => {
  const summary = buildHealthSummary([
    metric("2026-08-05"),
    metric("2026-08-06"),
    metric("2026-08-07", { provider: "garmin", hrvMethod: "nightly_average" }),
  ]);

  assert.equal(summary.provider, "garmin");
  assert.equal(summary.daysIncluded, 1);
  assert.equal(summary.trend, "insufficient");
});
