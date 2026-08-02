import type { DailyWearableMetrics } from "./types";

// Anonymized transcription of the seven-day Garmin screenshots shared during
// product discovery. HRV is intentionally categorical because no raw HRV
// value was visible in the screenshots.
export const garminInstinct2xFixture: DailyWearableMetrics[] = [
  { athleteId: "tester-garmin-01", provider: "garmin", deviceModel: "Instinct 2X", localDate: "2026-07-27", sleepDurationMinutes: 350, sleepQualityScore: 72, sleepQualitySource: "provider_score", restingHeartRateBpm: 55, hrvMs: null, hrvMetric: "provider_status", hrvStatus: "balanced", wornOvernight: true },
  { athleteId: "tester-garmin-01", provider: "garmin", deviceModel: "Instinct 2X", localDate: "2026-07-28", sleepDurationMinutes: 393, sleepQualityScore: 78, sleepQualitySource: "provider_score", restingHeartRateBpm: 54, hrvMs: null, hrvMetric: "provider_status", hrvStatus: "balanced", wornOvernight: true },
  { athleteId: "tester-garmin-01", provider: "garmin", deviceModel: "Instinct 2X", localDate: "2026-07-29", sleepDurationMinutes: 321, sleepQualityScore: 70, sleepQualitySource: "provider_score", restingHeartRateBpm: 53, hrvMs: null, hrvMetric: "provider_status", hrvStatus: "balanced", wornOvernight: true },
  { athleteId: "tester-garmin-01", provider: "garmin", deviceModel: "Instinct 2X", localDate: "2026-07-30", sleepDurationMinutes: 361, sleepQualityScore: 71, sleepQualitySource: "provider_score", restingHeartRateBpm: 54, hrvMs: null, hrvMetric: "provider_status", hrvStatus: "balanced", wornOvernight: true },
  { athleteId: "tester-garmin-01", provider: "garmin", deviceModel: "Instinct 2X", localDate: "2026-07-31", sleepDurationMinutes: 302, sleepQualityScore: 61, sleepQualitySource: "provider_score", restingHeartRateBpm: 56, hrvMs: null, hrvMetric: "provider_status", hrvStatus: "balanced", wornOvernight: true },
  { athleteId: "tester-garmin-01", provider: "garmin", deviceModel: "Instinct 2X", localDate: "2026-08-01", sleepDurationMinutes: 253, sleepQualityScore: 56, sleepQualitySource: "provider_score", restingHeartRateBpm: 53, hrvMs: null, hrvMetric: "provider_status", hrvStatus: "balanced", wornOvernight: true },
  { athleteId: "tester-garmin-01", provider: "garmin", deviceModel: "Instinct 2X", localDate: "2026-08-02", sleepDurationMinutes: 326, sleepQualityScore: 70, sleepQualitySource: "provider_score", restingHeartRateBpm: 52, hrvMs: null, hrvMetric: "provider_status", hrvStatus: "balanced", wornOvernight: true },
];
