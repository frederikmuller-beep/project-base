import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { garminInstinct2xFixture } from "../lib/wearables/garmin-instinct-2x.fixture.ts";
import { assessReadiness } from "../lib/wearables/readiness.ts";

test("keeps the shared Instinct 2X example green when physiology is stable", () => {
  const result = assessReadiness(garminInstinct2xFixture, {
    energy: 4,
    sleep: 4,
    soreness: 2,
    pain: false,
  });

  assert.equal(result.level, "green");
  assert.equal(result.sevenDayStatus, "stable");
  assert.equal(result.trends.sleep, "declining");
  assert.equal(result.trends.restingHeartRate, "stable");
  assert.equal(result.trends.hrv, "stable");
  assert.match(result.reasons.join(" "), /Søvnen er faldende/);
});

test("subjective fatigue still produces an amber recommendation", () => {
  const result = assessReadiness(garminInstinct2xFixture, {
    energy: 2,
    sleep: 2,
    soreness: 4,
    pain: false,
  });

  assert.equal(result.level, "amber");
  assert.equal(result.recommendation, "quality_focus");
});

test("pain cannot be overruled by wearable data", () => {
  const result = assessReadiness(garminInstinct2xFixture, {
    energy: 5,
    sleep: 5,
    soreness: 1,
    pain: true,
  });

  assert.equal(result.level, "red");
  assert.equal(result.recommendation, "pause_heavy_lifts");
});

test("does not invent a trend from fewer than four nights", () => {
  const result = assessReadiness(garminInstinct2xFixture.slice(0, 3), {
    energy: 4,
    sleep: 4,
    soreness: 2,
    pain: false,
  });

  assert.equal(result.sevenDayStatus, "insufficient_data");
  assert.equal(result.trends.sleep, "insufficient_data");
});

test("returns down only when several independent signals decline", () => {
  const declining = garminInstinct2xFixture.map((day, index) => ({
    ...day,
    sleepQualityScore: 82 - index * 4,
    restingHeartRateBpm: 50 + index,
    hrvStatus: index >= 4 ? "unbalanced" : "balanced",
  }));
  const result = assessReadiness(declining, {
    energy: 4,
    sleep: 4,
    soreness: 2,
    pain: false,
  });

  assert.equal(result.sevenDayStatus, "down");
  assert.equal(result.level, "amber");
});

test("limits the trend to seven calendar days and complete nights", () => {
  const stale = {
    ...garminInstinct2xFixture[0],
    localDate: "2026-06-01",
    sleepQualityScore: 100,
    restingHeartRateBpm: 40,
  };
  const incomplete = {
    ...garminInstinct2xFixture[4],
    sleepQualityScore: 0,
    restingHeartRateBpm: 100,
    wornOvernight: false,
  };
  const history = [stale, ...garminInstinct2xFixture.slice(0, 4), incomplete, ...garminInstinct2xFixture.slice(5)];
  const result = assessReadiness(history, {
    energy: 4,
    sleep: 4,
    soreness: 2,
    pain: false,
  });

  assert.equal(result.validNights, 6);
  assert.notEqual(result.sevenDayStatus, "down");
});

test("declares minimal consent-aware storage without raw provider payloads", async () => {
  const [schema, migration] = await Promise.all([
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0001_fantastic_cammi.sql", import.meta.url), "utf8"),
  ]);

  assert.match(schema, /wearableConnections/);
  assert.match(schema, /consentStatus/);
  assert.match(schema, /wearableDailyMetrics/);
  assert.match(migration, /ON DELETE cascade/);
  assert.doesNotMatch(schema, /rawPayload|accessToken|refreshToken/);
});
