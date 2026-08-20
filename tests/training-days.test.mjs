import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

test("validates, warns about and applies three athlete-selected training days", async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  try {
    const { applyPreferredTrainingDays, hasConsecutiveTrainingDays, isTrainingDays, parseTrainingDays } = await server.ssrLoadModule("/app/training-days.ts");
    assert.equal(isTrainingDays(["TIRSDAG", "TORSDAG", "SØNDAG"]), true);
    assert.equal(isTrainingDays(["TIRSDAG", "TIRSDAG", "SØNDAG"]), false);
    assert.deepEqual(parseTrainingDays('["SØNDAG","TIRSDAG","TORSDAG"]'), ["TIRSDAG", "TORSDAG", "SØNDAG"]);
    assert.deepEqual(parseTrainingDays("broken"), ["MANDAG", "ONSDAG", "LØRDAG"]);
    assert.equal(hasConsecutiveTrainingDays(["MANDAG", "TIRSDAG", "LØRDAG"]), true);
    assert.equal(hasConsecutiveTrainingDays(["MANDAG", "TORSDAG", "SØNDAG"]), true, "Sunday and Monday are adjacent");
    assert.equal(hasConsecutiveTrainingDays(["TIRSDAG", "TORSDAG", "LØRDAG"]), false);

    const exercise = { name: "Squat", detail: "3 × 5", focus: "Styrke", sets: 3, plannedReps: "5", defaultWeight: "60" };
    const genericPlan = [
      { week: 1, day: "MANDAG", date: "3 AUG", title: "A", focus: "A", duration: 50, programId: "a", exercises: [exercise] },
      { week: 1, day: "ONSDAG", date: "5 AUG", title: "B", focus: "B", duration: 50, programId: "b", exercises: [exercise] },
      { week: 1, day: "LØRDAG", date: "8 AUG", title: "C", focus: "C", duration: 50, programId: "c", exercises: [exercise] },
    ];
    const remapped = applyPreferredTrainingDays(genericPlan, ["TIRSDAG", "TORSDAG", "SØNDAG"]);
    assert.deepEqual(remapped.map((day) => day.day), ["TIRSDAG", "TORSDAG", "SØNDAG"]);
    assert.deepEqual(remapped.map((day) => day.programId), ["a", "b", "c"], "session order and contents stay intact");
    assert.deepEqual(remapped.map((day) => day.date), ["4. AUG", "6. AUG", "9. AUG"]);

    const fiveDayWeightliftingPlan = Array.from({ length: 5 }, (_, index) => ({ ...genericPlan[0], day: ["MANDAG", "TIRSDAG", "ONSDAG", "FREDAG", "LØRDAG"][index], programId: `wl-${index}` }));
    assert.deepEqual(applyPreferredTrainingDays(fiveDayWeightliftingPlan, ["TIRSDAG", "TORSDAG", "SØNDAG"]), fiveDayWeightliftingPlan, "existing five-day weightlifting test remains unchanged");
  } finally {
    await server.close();
  }
});
