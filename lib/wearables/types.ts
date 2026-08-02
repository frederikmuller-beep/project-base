export const wearableProviders = ["garmin", "apple"] as const;
export type WearableProvider = (typeof wearableProviders)[number];

export const hrvMetrics = ["sdnn", "rmssd", "provider_status"] as const;
export type HrvMetric = (typeof hrvMetrics)[number];

export const hrvStatuses = [
  "balanced",
  "unbalanced",
  "low",
  "poor",
  "no_status",
] as const;
export type HrvStatus = (typeof hrvStatuses)[number];

export type SleepQualitySource = "provider_score" | "base_derived";

export type DailyWearableMetrics = {
  athleteId: string;
  provider: WearableProvider;
  deviceModel: string;
  localDate: string;
  sleepDurationMinutes: number | null;
  sleepQualityScore: number | null;
  sleepQualitySource: SleepQualitySource | null;
  restingHeartRateBpm: number | null;
  hrvMs: number | null;
  hrvMetric: HrvMetric | null;
  hrvStatus: HrvStatus | null;
  wornOvernight: boolean;
};

export type SubjectiveReadiness = {
  energy: number;
  sleep: number;
  soreness: number;
  pain: boolean;
};

export type TrendDirection =
  | "improving"
  | "stable"
  | "declining"
  | "insufficient_data";

export type SevenDayStatus = "up" | "stable" | "down" | "insufficient_data";

export type ReadinessLevel = "green" | "amber" | "red";

export type ReadinessAssessment = {
  level: ReadinessLevel;
  score: number;
  sevenDayStatus: SevenDayStatus;
  recommendation: "follow_plan" | "quality_focus" | "pause_heavy_lifts";
  trends: {
    sleep: TrendDirection;
    restingHeartRate: TrendDirection;
    hrv: TrendDirection;
  };
  reasons: string[];
  validNights: number;
};
