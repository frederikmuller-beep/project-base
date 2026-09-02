import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

test("all 500 templates use distinct weekly sessions and varied sport pools", { timeout: 60_000 }, async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  try {
    const [{ programTemplates, buildTemplatePlan, exerciseMovementFamily }, { exerciseFocusTags, exerciseLibrary }, { sportProgramBlueprints }] = await Promise.all([
      server.ssrLoadModule("/app/program-catalog.ts"),
      server.ssrLoadModule("/app/exercise-data.ts"),
      server.ssrLoadModule("/app/sport-program-blueprints.ts"),
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
    assert.equal(Object.keys(sportProgramBlueprints).length, 18, "every BASE sport needs its own programming blueprint");
    for (const [sport, blueprint] of Object.entries(sportProgramBlueprints)) {
      assert.equal(blueprint.sessions.length, 3, `${sport} needs three distinct training emphases`);
      assert.equal(new Set(blueprint.sessions.map((session) => session.title)).size, 3, `${sport} session titles must be distinct`);
      assert.ok(blueprint.sessions.every((session) => session.objective.length > 20 && session.main.length >= 6 && session.assistance.length >= 6 && session.sportSpecific.length >= 6), `${sport} needs professional exercise priorities and objectives`);
    }
    for (const template of programTemplates) {
      const days = buildTemplatePlan(template.id);
      assert.equal(days.length, template.sessionsPerWeek * 12, `${template.id} must honor its advertised weekly frequency for 12 weeks`);
      assert.ok(days.every((day) => day.exercises.length > 0 && day.title.length <= 80 && day.focus.length <= 180));
      assert.ok(days.every((day) => day.exercises.every((exercise) => exerciseNames.has(exercise.name))));

      if (template.visibility === "athlete") {
        const minimumUniqueExercises = template.sessionsPerWeek === 2 ? 18 : 30;
        assert.ok(new Set(days.flatMap((day) => day.exercises.map((exercise) => exercise.name))).size >= minimumUniqueExercises, `${template.id} needs meaningful variation over 12 weeks`);
        const weekSets = Array.from({ length: 12 }, (_, weekIndex) => new Set(days.filter((day) => day.week === weekIndex + 1).flatMap((day) => day.exercises.map((exercise) => exercise.name))));
        const recurringCompetitionLifts = template.sportId === "powerlifting"
          ? new Set(["Back squat", "Bænkpres", "Dødløft", "Pause back squat", "Tempo back squat", "Front squat", "Romanian deadlift"])
          : template.sportId === "weightlifting" ? new Set(["Snatch", "Clean & Jerk", "Front squat", "Back squat"]) : new Set();
        for (const name of exerciseNames) {
          if (recurringCompetitionLifts.has(name)) continue;
          let streak = 0;
          for (const weekSet of weekSets) {
            streak = weekSet.has(name) ? streak + 1 : 0;
            assert.ok(streak <= 2, `${template.id} repeats ${name} for more than two consecutive weeks`);
          }
        }
      }

      for (let week = 1; week <= 12; week += 1) {
        const weekDays = days.filter((day) => day.week === week);
        assert.equal(weekDays.length, template.sessionsPerWeek);
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
        for (let sessionIndex = 0; sessionIndex < template.sessionsPerWeek; sessionIndex += 1) {
          const signatures = Array.from({ length: 12 }, (_, weekIndex) => days[weekIndex * template.sessionsPerWeek + sessionIndex].exercises.map((exercise) => exercise.name).join("|"));
          assert.ok(new Set(signatures).size >= 4, `${template.id} needs at least four distinct prescriptions in each weekly slot`);
        }
      }

      const weekOneSignature = days.slice(0, template.sessionsPerWeek).flatMap((day) => day.exercises.map((exercise) => exercise.name)).join("|");
      const signatures = signaturesBySport.get(template.sportId) ?? [];
      signatures.push(weekOneSignature);
      signaturesBySport.set(template.sportId, signatures);
    }

    for (const [sport, signatures] of signaturesBySport) {
      assert.ok(new Set(signatures).size >= Math.floor(signatures.length * 0.33), `${sport} templates need broader exercise variation`);
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
