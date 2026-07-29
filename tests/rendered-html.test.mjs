import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the BASE dashboard and both feedback entry points", async () => {
  const [page, feedbackForm] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/feedback-form.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /God træning, Mikkel\./);
  assert.match(page, /3\.100 kg/);
  assert.match(page, /Afslutter du testperioden\?/);
  assert.match(page, /Giv feedback på træningen/);
  assert.match(page, /TESTSVAR GEMMES/);
  assert.match(page, /totalPlannedSets/);
  assert.match(page, /setIndex \+ 1 < currentExercise\.sets/);
  assert.match(page, /Næste øvelse/);
  assert.match(page, /Afslut træning/);

  assert.match(feedbackForm, /TESTFEEDBACK · 1 MIN/);
  assert.match(feedbackForm, /AFSLUTTENDE EVALUERING · 5–7 MIN/);
  assert.match(feedbackForm, /Som atlet/);
  assert.match(feedbackForm, /Som træner/);
  assert.match(feedbackForm, /fetch\("\/api\/feedback"/);
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
