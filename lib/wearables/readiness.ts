import type {
  DailyWearableMetrics,
  HrvStatus,
  ReadinessAssessment,
  SubjectiveReadiness,
  TrendDirection,
} from "./types";

const MINIMUM_VALID_NIGHTS = 4;
const SLEEP_SCORE_CHANGE_THRESHOLD = 5;
const RESTING_HEART_RATE_CHANGE_THRESHOLD = 2;
const HRV_RELATIVE_CHANGE_THRESHOLD = 0.08;

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function edgeAverages(values: number[]): { first: number; last: number } | null {
  if (values.length < MINIMUM_VALID_NIGHTS) return null;

  const edgeSize = Math.min(3, Math.floor(values.length / 2));
  return {
    first: mean(values.slice(0, edgeSize)),
    last: mean(values.slice(-edgeSize)),
  };
}

function numericTrend(
  values: Array<number | null>,
  threshold: number,
  lowerIsBetter = false,
): TrendDirection {
  const validValues = values.filter((value): value is number => value !== null);
  const edges = edgeAverages(validValues);
  if (!edges) return "insufficient_data";

  const change = edges.last - edges.first;
  if (Math.abs(change) < threshold) return "stable";

  const improving = lowerIsBetter ? change < 0 : change > 0;
  return improving ? "improving" : "declining";
}

function relativeNumericTrend(values: Array<number | null>): TrendDirection {
  const validValues = values.filter((value): value is number => value !== null);
  const edges = edgeAverages(validValues);
  if (!edges || edges.first === 0) return "insufficient_data";

  const relativeChange = (edges.last - edges.first) / edges.first;
  if (Math.abs(relativeChange) < HRV_RELATIVE_CHANGE_THRESHOLD) return "stable";
  return relativeChange > 0 ? "improving" : "declining";
}

function statusTrend(statuses: Array<HrvStatus | null>): TrendDirection {
  const validStatuses = statuses.filter((status): status is HrvStatus => status !== null);
  if (validStatuses.length < MINIMUM_VALID_NIGHTS) return "insufficient_data";

  const recent = validStatuses.slice(-3);
  if (recent.some((status) => status === "low" || status === "poor")) return "declining";
  if (recent.some((status) => status === "unbalanced")) return "declining";
  if (recent.every((status) => status === "balanced")) return "stable";
  return "insufficient_data";
}

function subjectiveScore(subjective: SubjectiveReadiness): number {
  const fields = [subjective.energy, subjective.sleep, subjective.soreness];
  if (fields.some((value) => !Number.isInteger(value) || value < 1 || value > 5)) {
    throw new RangeError("Subjective readiness values must be integers from 1 to 5.");
  }

  return Math.round(
    ((subjective.energy + subjective.sleep + (6 - subjective.soreness)) / 15) * 100,
  );
}

export function assessReadiness(
  history: DailyWearableMetrics[],
  subjective: SubjectiveReadiness,
): ReadinessAssessment {
  const sorted = [...history].sort((left, right) => left.localDate.localeCompare(right.localDate));
  const latestDate = sorted.at(-1)?.localDate;
  const cutoffDate = latestDate ? new Date(`${latestDate}T00:00:00Z`) : null;
  cutoffDate?.setUTCDate(cutoffDate.getUTCDate() - 6);
  const cutoff = cutoffDate?.toISOString().slice(0, 10);
  const chronological = cutoff
    ? sorted.filter((day) => day.localDate >= cutoff)
    : [];
  const completeNights = chronological.filter((day) => day.wornOvernight);
  const validNights = completeNights.length;
  const score = subjectiveScore(subjective);

  const sleep = numericTrend(
    completeNights.map((day) => day.sleepQualityScore),
    SLEEP_SCORE_CHANGE_THRESHOLD,
  );
  const restingHeartRate = numericTrend(
    completeNights.map((day) => day.restingHeartRateBpm),
    RESTING_HEART_RATE_CHANGE_THRESHOLD,
    true,
  );
  const hrvValues = completeNights.map((day) => day.hrvMs);
  const hrv = hrvValues.filter((value) => value !== null).length >= MINIMUM_VALID_NIGHTS
    ? relativeNumericTrend(hrvValues)
    : statusTrend(completeNights.map((day) => day.hrvStatus));
  const trends = { sleep, restingHeartRate, hrv };

  const availableTrends = Object.values(trends).filter(
    (trend) => trend !== "insufficient_data",
  );
  const decliningSignals = availableTrends.filter((trend) => trend === "declining").length;
  const improvingSignals = availableTrends.filter((trend) => trend === "improving").length;
  const sevenDayStatus = validNights < MINIMUM_VALID_NIGHTS
    ? "insufficient_data"
    : decliningSignals >= 2
      ? "down"
      : improvingSignals >= 2
        ? "up"
        : "stable";

  if (subjective.pain) {
    return {
      level: "red",
      score,
      sevenDayStatus,
      recommendation: "pause_heavy_lifts",
      trends,
      reasons: ["Atleten har angivet smerte; urdata må ikke tilsidesætte sikkerhedssignalet."],
      validNights,
    };
  }

  const reasons: string[] = [];
  if (sleep === "declining" && sevenDayStatus === "stable") {
    reasons.push("Søvnen er faldende, men HRV og hvilepuls bekræfter ikke en samlet nedgang.");
  }
  if (sevenDayStatus === "insufficient_data") {
    reasons.push("Der er for få komplette nætter til en sikker syvdagesstatus.");
  }

  if (score < 72 || sevenDayStatus === "down") {
    reasons.push(
      score < 72
        ? "Atletens egne svar peger på lavere readiness."
        : "Mindst to uafhængige ursignaler er faldende.",
    );
    return {
      level: "amber",
      score,
      sevenDayStatus,
      recommendation: "quality_focus",
      trends,
      reasons,
      validNights,
    };
  }

  reasons.push("Ingen kombination af ursignaler kræver automatisk belastningsreduktion.");
  return {
    level: "green",
    score,
    sevenDayStatus,
    recommendation: "follow_plan",
    trends,
    reasons,
    validNights,
  };
}
