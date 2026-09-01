import assert from "node:assert/strict";
import test from "node:test";
import {
  buildHistoricalLoadRecommendation,
  buildLoadSuggestion,
  calculateActualWorkload,
  calculatePlannedWorkload,
  estimatedOneRepMax,
  majorLiftForExercise,
  majorStrengthLifts,
  parseEffortRepCount,
  parseRepCount,
} from "../lib/training-analytics.ts";

test("limits strength history to the eleven comparable major lifts", () => {
  assert.equal(majorStrengthLifts.length, 11);
  assert.equal(majorLiftForExercise("Overhead carry"), null);
  assert.equal(majorLiftForExercise("Strict press")?.label, "Overhead press");
  assert.equal(majorLiftForExercise("Back squat")?.label, "Squat");
  assert.equal(majorLiftForExercise("Clean+Jerk")?.label, "Clean & Jerk");
  assert.equal(majorLiftForExercise("Snatch-grip deadlift"), null);
});

const program = {
  programId: "test",
  week: 1,
  day: "MANDAG",
  date: "1. AUG",
  status: "planned",
  title: "Test",
  focus: "Test",
  duration: 45,
  exercises: [{ name: "Split squat", detail: "", focus: "", sets: 3, plannedReps: "8 pr. ben", defaultWeight: "20", effortMetric: "rir", effortTarget: "2–4 RIR" }],
};

test("counts unilateral reps twice for volume but once per side for intensity and e1RM", () => {
  assert.equal(parseRepCount("8 pr. ben"), 16);
  assert.equal(parseEffortRepCount("8 pr. ben"), 8);
  assert.equal(Math.round(estimatedOneRepMax(100, 5, 3) * 10) / 10, 126.7);
  const planned = calculatePlannedWorkload([program]);
  assert.equal(planned.volumeKg, 960);
  const actual = calculateActualWorkload([{ program, logs: [{ exerciseIndex: 0, setIndex: 0, weight: "20", reps: "8 pr. ben", rpe: "3", effortMetric: "rir", techniqueQuality: "good" }] }]);
  assert.equal(actual.volumeKg, 320);
});

test("suggests a conservative increase only after all three safety signals are positive", () => {
  const recentSets = [0, 1].map((setIndex) => ({ exerciseIndex: 0, setIndex, weight: "70", reps: "3", rpe: "3", effortMetric: "rir", techniqueQuality: "good" }));
  const suggestion = buildLoadSuggestion({ currentWeight: 70, recentSets, readinessScore: 82, pain: false, hasRemainingSet: true });
  assert.equal(suggestion.decision, "increase");
  assert.equal(suggestion.proposedWeight, 72.5);
  const held = buildLoadSuggestion({ currentWeight: 70, recentSets, readinessScore: 82, pain: true, hasRemainingSet: true });
  assert.equal(held.decision, "hold");
  assert.match(held.reasons.join(" "), /Smerte/);
});

test("uses the latest completed exercise prescription to set the next starting weight", () => {
  const completeHistory = [{
    programId: "previous",
    title: "Tidligere pas",
    date: "2026-08-20 10:00:00",
    plannedSets: 3,
    sets: [0, 1, 2].map((setIndex) => ({ setIndex, weight: "70", reps: "5", rir: "3", techniqueQuality: "good" })),
  }];
  const increase = buildHistoricalLoadRecommendation({ plannedWeight: 65, history: completeHistory });
  assert.equal(increase.decision, "increase");
  assert.equal(increase.proposedWeight, 72.5);

  const partial = buildHistoricalLoadRecommendation({ plannedWeight: 65, history: [{ ...completeHistory[0], sets: completeHistory[0].sets.slice(0, 2) }] });
  assert.equal(partial.decision, "hold");
  assert.equal(partial.proposedWeight, 70);

  const difficult = buildHistoricalLoadRecommendation({ plannedWeight: 65, history: [{ ...completeHistory[0], sets: completeHistory[0].sets.map((set) => ({ ...set, rir: "1", techniqueQuality: "poor" })) }] });
  assert.equal(difficult.decision, "decrease");
  assert.equal(difficult.proposedWeight, 67.5);
});
