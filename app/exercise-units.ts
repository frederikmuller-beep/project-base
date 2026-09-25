export type UnilateralUnit = "ben" | "arm" | "side";

export const unilateralExerciseUnits: Readonly<Record<string, UnilateralUnit>> = {
  "Split squat": "ben",
  "Bulgarian split squat": "ben",
  "Single-leg Romanian deadlift": "ben",
  "Step-up": "ben",
  "Reverse lunge": "ben",
  "Lateral lunge": "ben",
  "Half-kneeling landmine press": "arm",
  "Single-arm cable pulldown": "arm",
  "Single-arm row with rotation": "arm",
  "Swim bench freestyle pull": "arm",
  "Band freestyle stroke": "arm",
  "Band backstroke pull": "arm",
  "Isometric catch hold": "arm",
  "Cable internal rotation": "arm",
  "Cable external rotation": "arm",
  "Pallof press": "side",
  "Side plank": "side",
  "Copenhagen plank": "side",
  "Bird dog": "side",
  "Dead bug": "side",
  "Rotational medicine ball throw": "side",
  "Tall-kneeling cable chop": "side",
  "Tall-kneeling cable lift": "side",
  "Suitcase carry": "side",
  "Cossack squat": "side",
  "World's greatest stretch": "side",
  "Overhead carry": "arm",
  "Enarmscrawl": "arm",
  "Enarmsrygcrawl": "arm",
  "Enarmsbutterfly": "arm",
  "Sidekick": "side",
};

export const clarifyUnilateralReps = (exerciseName: string, reps: string) => {
  const unit = unilateralExerciseUnits[exerciseName];
  if (!unit || /\bpr\.\s/.test(reps)) return reps;
  return `${reps} pr. ${unit}`;
};
