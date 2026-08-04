import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the BASE dashboard and both feedback entry points", async () => {
  const [page, feedbackForm, exerciseData, exerciseVideoData] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
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
  assert.match(page, /const weekPlan/);
  assert.match(page, /Se kommende uges program/);
  assert.match(page, /Din kommende uge/);
  assert.match(page, /weekTotals\.sessions/);
  assert.match(page, /youtube-nocookie\.com\/embed/);
  assert.match(page, /session-video-button/);
  assert.match(page, /youtubeExerciseSearchUrl/);
  assert.match(page, /TEKNIKVIDEO/);
  assert.match(page, /Uge 31/i);
  assert.match(page, /Næste øvelse/);
  assert.match(page, /Afslut træning/);

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
