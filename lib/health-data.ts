export type HealthProvider = "apple_health" | "garmin";
export type HealthTrend = "up" | "stable" | "down" | "insufficient";

export type DailyHealthMetric = {
  provider: HealthProvider;
  metricDate: string;
  sleepDurationMinutes: number | null;
  sleepScore: number | null;
  restingHeartRate: number | null;
  hrvMs: number | null;
  hrvMethod: "sdnn" | "rmssd" | "nightly_average" | "unknown" | null;
  sourceUpdatedAt: string;
};

export type HealthSummary = {
  available: boolean;
  provider: HealthProvider | null;
  latest: DailyHealthMetric | null;
  daysIncluded: number;
  trend: HealthTrend;
};

const validMetric = (value: number | null) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;

const relativeChange = (latest: number | null, history: Array<number | null>, inverse = false) => {
  const current = validMetric(latest);
  const baselineValues = history.map(validMetric).filter((value): value is number => value !== null);
  if (current === null || baselineValues.length < 2) return null;
  const baseline = baselineValues.reduce((sum, value) => sum + value, 0) / baselineValues.length;
  if (baseline === 0) return null;
  const change = ((current - baseline) / baseline) * 100;
  return inverse ? -change : change;
};

export function buildHealthSummary(metrics: DailyHealthMetric[]): HealthSummary {
  if (metrics.length === 0) {
    return { available: false, provider: null, latest: null, daysIncluded: 0, trend: "insufficient" };
  }

  const sorted = [...metrics].sort((a, b) => b.metricDate.localeCompare(a.metricDate));
  const provider = sorted[0].provider;
  const providerMetrics = sorted.filter((metric) => metric.provider === provider).slice(0, 7);
  const latest = providerMetrics[0];
  const history = providerMetrics.slice(1);
  const signals = [
    relativeChange(latest.sleepDurationMinutes, history.map((day) => day.sleepDurationMinutes)),
    relativeChange(latest.sleepScore, history.map((day) => day.sleepScore)),
    relativeChange(latest.restingHeartRate, history.map((day) => day.restingHeartRate), true),
    relativeChange(latest.hrvMs, history.map((day) => day.hrvMs)),
  ].filter((value): value is number => value !== null);

  let trend: HealthTrend = "insufficient";
  if (signals.length >= 2) {
    const averageSignal = signals.reduce((sum, value) => sum + value, 0) / signals.length;
    trend = averageSignal >= 3 ? "up" : averageSignal <= -3 ? "down" : "stable";
  }

  return {
    available: true,
    provider,
    latest,
    daysIncluded: providerMetrics.length,
    trend,
  };
}

export const healthProviderLabel = (provider: HealthProvider | null) =>
  provider === "apple_health" ? "Apple Health" : provider === "garmin" ? "Garmin" : "Sundhedsdata";

export const healthTrendLabel = (trend: HealthTrend) => ({
  up: "Opadgående",
  stable: "Stabil",
  down: "Nedadgående",
  insufficient: "Afventer 7-dages grundlag",
}[trend]);
