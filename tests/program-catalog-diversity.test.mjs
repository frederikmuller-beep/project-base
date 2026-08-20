import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

test("all 500 templates use distinct weekly sessions and varied sport pools", { timeout: 60_000 }, async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  try {
    const [{ programTemplates, buildTemplatePlan, exerciseMovementFamily }, { exerciseFocusTags, exerciseLibrary }] = await Promise.all([
      server.ssrLoadModule("/app/program-catalog.ts"),
      server.ssrLoadModule("/app/exercise-data.ts"),
    ]);
    const exerciseNames = new Set(exerciseLibrary.map((exercise) => exercise.name));
    const signaturesBySport = new Map();

    assert.ok(exerciseLibrary.length >= 200 && exerciseLibrary.length <= 300, "the curated library should favor quality over an artificial target");
    assert.equal(exerciseNames.size, exerciseLibrary.length, "exercise names must be unique");
    assert.ok(exerciseLibrary.every((exercise) => exercise.name && exercise.target && exercise.cue && exercise.sets && exercise.reps));
    for (const focus of exerciseFocusTags) {
      assert.ok(exerciseLibrary.filter((exercise) => exercise.tags?.includes(focus)).length >= 5, `${focus} needs a useful filtered exercise pool`);
    }
    assert.ok(exerciseLibrary.every((exercise) => !/ · .+ · (begynder|øvet|avanceret) .+ \d+$/i.test(exercise.name)), "generated numbered variants must not exist in the library");
    assert.equal(programTemplates.length, 500);
    for (const template of programTemplates) {
      const days = buildTemplatePlan(template.id);
      assert.equal(days.length, 36, `${template.id} must contain three sessions for 12 weeks`);
      assert.ok(days.every((day) => day.exercises.length > 0 && day.title.length <= 80 && day.focus.length <= 180));
      assert.ok(days.every((day) => day.exercises.every((exercise) => exerciseNames.has(exercise.name))));

      for (let week = 1; week <= 12; week += 1) {
        const weekDays = days.filter((day) => day.week === week);
        assert.equal(weekDays.length, 3);
        const weekExercises = weekDays.flatMap((day) => day.exercises.map((exercise) => exercise.name));
        assert.equal(new Set(weekExercises).size, weekExercises.length, `${template.id} repeats an exercise within week ${week}`);
        if (template.visibility === "athlete") {
          const families = weekExercises.map(exerciseMovementFamily);
          assert.equal(new Set(families).size, families.length, `${template.id} repeats a movement family within week ${week}`);
          assert.ok(weekExercises.every((name) => !/ · .+ · (begynder|øvet|avanceret) .+ \d+$/i.test(name)), `${template.id} exposes generated name variants`);
        }
      }

      const weekOneSignature = days.slice(0, 3).flatMap((day) => day.exercises.map((exercise) => exercise.name)).join("|");
      const signatures = signaturesBySport.get(template.sportId) ?? [];
      signatures.push(weekOneSignature);
      signaturesBySport.set(template.sportId, signatures);
    }

    for (const [sport, signatures] of signaturesBySport) {
      assert.ok(new Set(signatures).size >= Math.floor(signatures.length * 0.75), `${sport} templates need broader exercise variation`);
    }
  } finally {
    await server.close();
  }
});
