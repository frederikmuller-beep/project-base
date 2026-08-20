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

      if (template.visibility === "athlete") {
        assert.ok(new Set(days.flatMap((day) => day.exercises.map((exercise) => exercise.name))).size >= 30, `${template.id} needs meaningful variation over 12 weeks`);
        const weekSets = Array.from({ length: 12 }, (_, weekIndex) => new Set(days.filter((day) => day.week === weekIndex + 1).flatMap((day) => day.exercises.map((exercise) => exercise.name))));
        for (const name of exerciseNames) {
          let streak = 0;
          for (const weekSet of weekSets) {
            streak = weekSet.has(name) ? streak + 1 : 0;
            assert.ok(streak <= 2, `${template.id} repeats ${name} for more than two consecutive weeks`);
          }
        }
      }

      for (let week = 1; week <= 12; week += 1) {
        const weekDays = days.filter((day) => day.week === week);
        assert.equal(weekDays.length, 3);
        const weekExercises = weekDays.flatMap((day) => day.exercises.map((exercise) => exercise.name));
        assert.equal(new Set(weekExercises).size, weekExercises.length, `${template.id} repeats an exercise within week ${week}`);
        if (template.visibility === "athlete") {
          for (const day of weekDays) {
            const roles = day.exercises.reduce((counts, exercise) => ({ ...counts, [exercise.programRole]: (counts[exercise.programRole] ?? 0) + 1 }), {});
            assert.ok(roles.main >= 1 && roles.main <= 2, `${template.id} needs one or two main exercises per session`);
            assert.ok(roles.assistance >= 1 && roles.assistance <= 3, `${template.id} needs one to three assistance exercises per session`);
            assert.ok(roles.sport_specific >= 1 && roles.sport_specific <= 2, `${template.id} needs one or two sport-specific exercises per session`);
            const families = day.exercises.map((exercise) => exerciseMovementFamily(exercise.name));
            assert.ok(new Set(families).size >= families.length - 1, `${template.id} overuses one movement family within a session in week ${week}`);
          }
          assert.ok(weekExercises.every((name) => !/ · .+ · (begynder|øvet|avanceret) .+ \d+$/i.test(name)), `${template.id} exposes generated name variants`);
        }
      }

      if (template.visibility === "athlete") {
        for (let sessionIndex = 0; sessionIndex < 3; sessionIndex += 1) {
          const signatures = Array.from({ length: 12 }, (_, weekIndex) => days[weekIndex * 3 + sessionIndex].exercises.map((exercise) => exercise.name).join("|"));
          assert.equal(new Set(signatures).size, signatures.length, `${template.id} repeats a full session across the 12 weeks`);
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

    const handball = programTemplates.find((template) => template.sportId === "handball" && template.visibility === "athlete");
    assert.ok(handball);
    const handballPlan = buildTemplatePlan(handball.id);
    const finalBlockPresses = handballPlan.filter((day) => day.week >= 10)
      .flatMap((day) => day.exercises.map((exercise) => exercise.name))
      .filter((name) => exerciseMovementFamily(name) === "horisontalt pres");
    assert.ok(new Set(finalBlockPresses).size >= 2, "handball must rotate pressing work in the final block instead of relying only on bench press");
  } finally {
    await server.close();
  }
});
