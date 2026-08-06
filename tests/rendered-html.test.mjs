import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the BASE dashboard, two-week plan and both feedback entry points", async () => {
  const [page, programData, feedbackForm, exerciseData, exerciseVideoData] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/program-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/feedback-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/exercise-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/exercise-videos.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /God træning, Mikkel\./);
  assert.match(page, /3\.100 kg/);
  assert.match(page, /Afslutter du testperioden\?/);
  assert.match(page, /Giv feedback på træningen/);
  assert.match(page, /TESTSVAR GEMMES/);
  assert.match(page, /totalPlannedSets/);
  assert.match(page, /setIndex \+ 1 < currentExercise\.sets/);
  assert.match(page, /Sammensæt ekstra træningsdag/);
  assert.match(page, /toggleExtraExercise/);
  assert.match(page, /extraBuilder/);
  assert.match(page, /Start ekstra træning/);
  assert.match(page, /sessionPlan/);
  assert.match(page, /filteredExercises/);
  assert.match(page, /librarySearch/);
  assert.match(page, /twoWeekPlan/);
  assert.match(page, /Åbn testperiodens programmer/);
  assert.match(page, /Dine næste to uger/);
  assert.match(page, /weekTotals\.sessions/);
  assert.match(page, /startPlannedSession/);
  assert.match(page, /\/api\/participant/);
  assert.match(page, /\/api\/training/);
  assert.match(page, /youtube-nocookie\.com\/embed/);
  assert.match(page, /session-video-button/);
  assert.match(page, /youtubeExerciseSearchUrl/);
  assert.match(page, /TEKNIKVIDEO/);
  assert.match(page, /TESTPERIODE/);
  assert.match(page, /Næste øvelse/);
  assert.match(page, /Afslut træning/);

  assert.equal((programData.match(/programId: "/g) ?? []).length, 11);
  assert.equal((programData.match(/week: 1, day/g) ?? []).length, 7);
  assert.equal((programData.match(/week: 2, day/g) ?? []).length, 7);
  assert.match(programData, /w1-competition-focus/);
  assert.match(programData, /w2-test-review/);

  assert.match(feedbackForm, /TESTFEEDBACK · 1 MIN/);
  assert.match(feedbackForm, /AFSLUTTENDE EVALUERING · 5–7 MIN/);
  assert.match(feedbackForm, /Som atlet/);
  assert.match(feedbackForm, /Som træner/);
  assert.match(feedbackForm, /fetch\("\/api\/feedback"/);

  const exerciseRows = exerciseData.split("\n").filter((line) => line.startsWith("  { name:"));
  const exerciseNames = exerciseRows.map((line) => line.match(/name: "([^"]+)"/)?.[1]);
  assert.equal(exerciseRows.length, 90);
  assert.equal(new Set(exerciseNames).size, 90);
  assert.ok(exerciseRows.every((line) => /sets: "[^"]+", reps: "[^"]+", weight: "[^"]+"/.test(line)));

  const videoRows = exerciseVideoData.split("\n").filter((line) => /^  "[^"]+": \{ youtubeId:/.test(line));
  const videoIds = videoRows.map((line) => line.match(/youtubeId: "([^"]+)"/)?.[1]);
  assert.equal(videoRows.length, 11);
  assert.equal(new Set(videoIds).size, 11);
  assert.match(exerciseVideoData, /"Snatch"/);
  assert.match(exerciseVideoData, /"Clean & Jerk"/);
  assert.match(exerciseVideoData, /"Front squat"/);
});

test("persists feedback through the declared D1 database", async () => {
  const [hosting, schema, route, migration] = await Promise.all([
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/feedback/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0000_polite_sabretooth.sql", import.meta.url), "utf8"),
  ]);

  assert.equal(JSON.parse(hosting).d1, "DB");
  assert.match(schema, /feedbackResponses/);
  assert.match(schema, /tester_id/);
  assert.match(route, /insert\(feedbackResponses\)/);
  assert.match(route, /testerIdPattern/);
  assert.match(migration, /CREATE TABLE `feedback_responses`/);
});

test("persists each tester's planned-session progress and set logs in D1", async () => {
  const [schema, participantRoute, trainingRoute, testerSession, migration] = await Promise.all([
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/participant/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/training/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/tester-session.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0001_dapper_quasimodo.sql", import.meta.url), "utf8"),
  ]);

  assert.match(schema, /trainingSessions/);
  assert.match(schema, /trainingSetLogs/);
  assert.match(schema, /idx_training_sessions_tester_program/);
  assert.match(participantRoute, /setTesterId/);
  assert.match(testerSession, /httpOnly: true/);
  assert.match(testerSession, /sameSite: "lax"/);
  assert.match(trainingRoute, /getTesterId/);
  assert.match(trainingRoute, /insert\(trainingSetLogs\)/);
  assert.match(trainingRoute, /completedSets >= plannedSets/);
  assert.match(migration, /CREATE TABLE `training_sessions`/);
  assert.match(migration, /CREATE TABLE `training_set_logs`/);
});

test("keeps future Apple Health and Garmin integrations provider-neutral", async () => {
  const [schema, healthData, summaryRoute, page, migration, documentation] = await Promise.all([
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/health-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/health/summary/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0002_unique_rogue.sql", import.meta.url), "utf8"),
    readFile(new URL("../docs/health-integrations.md", import.meta.url), "utf8"),
  ]);

  assert.match(schema, /healthConnections/);
  assert.match(schema, /dailyHealthMetrics/);
  assert.match(schema, /"apple_health", "garmin"/);
  assert.match(schema, /sleepDurationMinutes/);
  assert.match(schema, /restingHeartRate/);
  assert.match(schema, /hrvMethod/);
  assert.match(healthData, /buildHealthSummary/);
  assert.match(healthData, /signals\.length >= 2/);
  assert.match(summaryRoute, /getTesterId/);
  assert.match(summaryRoute, /\.limit\(14\)/);
  assert.doesNotMatch(summaryRoute, /export async function POST/);
  assert.match(page, /\/api\/health\/summary/);
  assert.match(page, /bruges som kontekst, ikke til automatisk at ændre planen/);
  assert.match(migration, /CREATE TABLE `health_connections`/);
  assert.match(migration, /CREATE TABLE `daily_health_metrics`/);
  assert.match(documentation, /ingen offentlig POST-endpoint/i);
  assert.match(documentation, /Apple Health/);
  assert.match(documentation, /Garmin/);
});

test("protects internal CSV exports and exposes only the intended test datasets", async () => {
  const [route, panel, csv] = await Promise.all([
    readFile(new URL("../app/api/admin/export/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/export/export-panel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/csv.ts", import.meta.url), "utf8"),
  ]);

  assert.match(route, /BASE_EXPORT_KEY/);
  assert.match(route, /authorization/);
  assert.match(route, /secureEqual/);
  assert.match(route, /private, no-store/);
  assert.match(route, /overview.*training.*feedback/);
  assert.doesNotMatch(route, /dailyHealthMetrics|healthConnections/);
  assert.match(panel, /Nøglen gemmes ikke i browseren/);
  assert.match(panel, /Download CSV/);
  assert.doesNotMatch(panel, /localStorage|sessionStorage/);
  assert.match(csv, /spreadsheetFormulaPattern/);
  assert.match(csv, /replaceAll\('\"', '\"\"'\)/);
});
