import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the BASE dashboard, profile-specific 12-week plans and both feedback entry points", async () => {
  const [page, programData, swimProgramData, strengthProgramData, feedbackForm, exerciseData, exerciseVideoData, exerciseUnits, sportCatalog, programCatalog] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/program-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/swim-program-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/strength-program-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/feedback-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/exercise-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/exercise-videos.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/exercise-units.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sport-catalog.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/program-catalog.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /God træning\./);
  assert.match(page, /planlagt styrketid/);
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
  assert.match(page, /activePlan/);
  assert.match(page, /Åbn dit 12-ugers program/);
  assert.match(page, /Dit program over 12 uger/);
  assert.match(page, /Array.from\(\{ length: 12 \}/);
  assert.match(page, /selectedWeekProgression/);
  assert.match(page, /program-phase-card/);
  assert.match(page, /weekTotals\.sessions/);
  assert.match(page, /startPlannedSession/);
  assert.match(page, /NÆSTE PROGRAM/);
  assert.match(page, /FRA DIN TRÆNER/);
  assert.match(page, /Fortsæt program/);
  assert.match(page, /coachPlans\.find/);
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
  assert.match(programData, /weekProgressions: WeekProgression\[]/);
  assert.match(programData, /phase: "Akkumulering"/);
  assert.match(programData, /phase: "Deload"/);
  assert.match(programData, /phase: "Topning"/);
  assert.match(programData, /phase: "Realisering"/);
  assert.match(programData, /progressExercisePrescription/);
  assert.match(programData, /loadFactor: 1\.15/);
  assert.match(programData, /distanceFactor: 0\.6/);
  assert.match(programData, /Bulgarian split squat", 3, "8 pr\. ben"/);
  assert.match(strengthProgramData, /Bulgarian split squat", 3, "8 pr\. ben"/);
  assert.match(exerciseUnits, /"Split squat": "ben"/);
  assert.match(exerciseUnits, /"Single-arm cable pulldown": "arm"/);
  assert.match(exerciseUnits, /"Side plank": "side"/);
  assert.match(exerciseUnits, /"Enarmscrawl": "arm"/);
  assert.match(exerciseUnits, /clarifyUnilateralReps/);
  assert.match(exerciseData, /reps: clarifyUnilateralReps/);
  assert.match(strengthProgramData, /clarifyUnilateralReps/);
  assert.match(swimProgramData, /clarifyUnilateralReps/);
  assert.match(swimProgramData, /long_distance: extendPlanToTwelveWeeks\(makePlan/);
  assert.match(swimProgramData, /middle_distance: extendPlanToTwelveWeeks\(makePlan/);
  assert.match(swimProgramData, /sprint: extendPlanToTwelveWeeks\(makePlan/);
  assert.match(sportCatalog, /Langdistance svømning/);
  assert.match(sportCatalog, /Mellemdistance svømning/);
  assert.match(sportCatalog, /Sprintsvømning/);
  assert.match(swimProgramData, /restSeconds/);
  assert.equal((swimProgramData.match(/const .*Sessions: SwimSession\[]/g) ?? []).length, 3);
  const longSessions = swimProgramData.slice(swimProgramData.indexOf("const longDistanceSessions"), swimProgramData.indexOf("const middleDistanceSessions"));
  const middleSessions = swimProgramData.slice(swimProgramData.indexOf("const middleDistanceSessions"), swimProgramData.indexOf("const sprintSessions"));
  const sprintSessions = swimProgramData.slice(swimProgramData.indexOf("const sprintSessions"), swimProgramData.indexOf("export const swimPlans"));
  assert.equal((longSessions.match(/\{ title:/g) ?? []).length, 10);
  assert.equal((middleSessions.match(/\{ title:/g) ?? []).length, 10);
  assert.equal((sprintSessions.match(/\{ title:/g) ?? []).length, 10);
  assert.match(page, /profile-options/);
  assert.match(page, /trainingProfileOptions/);
  assert.match(sportCatalog, /id: "weightlifting", label: "Vægtløftning"/);
  assert.match(sportCatalog, /id: "recreational", label: "Motionist"/);
  assert.match(swimProgramData, /getTrainingPlan/);
  assert.match(swimProgramData, /getSwimmerStrengthPlan/);
  assert.match(strengthProgramData, /long_distance: extendPlanToTwelveWeeks\(makeStrengthPlan/);
  assert.match(strengthProgramData, /middle_distance: extendPlanToTwelveWeeks\(makeStrengthPlan/);
  assert.match(strengthProgramData, /sprint: extendPlanToTwelveWeeks\(makeStrengthPlan/);
  assert.match(strengthProgramData, /recreational: extendPlanToTwelveWeeks\(makeStrengthPlan/);
  assert.equal((strengthProgramData.match(/const .*Strength: StrengthSession\[]/g) ?? []).length, 4);
  const recreationalSessions = strengthProgramData.slice(strengthProgramData.indexOf("const recreationalStrength"), strengthProgramData.indexOf("export const swimmerStrengthPlans"));
  assert.equal((recreationalSessions.match(/\{ title:/g) ?? []).length, 6);
  assert.match(page, /exercise\.visibility !== "coach_only"/);
  assert.match(page, /Udforsk øvelsesbiblioteket/);

  assert.match(feedbackForm, /TESTFEEDBACK · 1 MIN/);
  assert.match(feedbackForm, /AFSLUTTENDE EVALUERING · 5–7 MIN/);
  assert.match(feedbackForm, /Som atlet/);
  assert.match(feedbackForm, /Som træner/);
  assert.match(feedbackForm, /fetch\("\/api\/feedback"/);

  const exerciseRows = exerciseData.split("\n").filter((line) => line.startsWith("  { name:") && !line.includes("catalogHighlights"));
  const exerciseNames = exerciseRows.map((line) => line.match(/name: "([^"]+)"/)?.[1]);
  assert.ok(exerciseRows.length >= 178);
  assert.equal(new Set(exerciseNames).size, exerciseRows.length);
  assert.ok(exerciseRows.every((line) => /sets: "[^"]+", reps: "[^"]+", weight: "[^"]+"/.test(line)));
  assert.ok(exerciseRows.filter((line) => /category: "Svømning"/.test(line)).length >= 28);
  assert.equal(exerciseRows.filter((line) => /category: "Svømmestyrke"/.test(line)).length, 24);
  assert.match(exerciseData, /1000 - exerciseLibrarySource\.length - catalogHighlights\.length/);
  assert.match(exerciseData, /visibility: "coach_only"/);
  assert.match(exerciseData, /name: "2500 m temposvømning"/);
  assert.match(exerciseData, /name: "3000 m intervalløb"/);
  assert.match(exerciseData, /name: "Suicide runs"/);
  assert.match(programCatalog, /Array\.from\(\{ length: 500 \}/);
  assert.match(programCatalog, /durationWeeks: 12/);
  assert.match(programCatalog, /buildTemplatePlan/);
  assert.match(programCatalog, /progressExercisePrescription/);
  for (const sport of ["athletics", "golf", "running", "powerlifting", "skiing", "triathlon", "ironman", "hyrox", "crossfit", "cycling", "american_football", "football", "handball"]) assert.match(sportCatalog, new RegExp(`id: "${sport}"`));
  assert.match(exerciseData, /name: "Bænkpres"/);
  assert.match(exerciseData, /name: "Dødløft"/);
  assert.match(exerciseData, /name: "Dips"/);
  assert.match(exerciseData, /name: "Swim bench freestyle pull"/);
  assert.match(exerciseData, /name: "Isometric catch hold"/);
  assert.match(page, /Se indeks/);
  assert.match(page, /swimStrengthCount/);
  assert.match(page, /href="\/coach"/);
  assert.match(page, /Åbn træneroverblik/);
  assert.match(page, /PAUSETIMER/);
  assert.match(page, /setRestSecondsRemaining/);
  assert.match(page, /Se og ret udførte sæt/);
  assert.match(page, /Rediger dette sæt/);
  assert.match(page, /openLoggedSet/);
  assert.match(page, /Træn med rolig intensitet/);
  assert.match(page, /currentExercise\.tracking === "distance"/);
  assert.match(page, /svømmedistance/);

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
  const [schema, participantRoute, trainingRoute, testerSession, migration, effortMigration, techniqueMigration] = await Promise.all([
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/participant/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/training/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/tester-session.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0001_dapper_quasimodo.sql", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0007_cute_captain_marvel.sql", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0008_nostalgic_thena.sql", import.meta.url), "utf8"),
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
  assert.match(trainingRoute, /effortMetric/);
  assert.match(trainingRoute, /RIR skal være mellem 0 og 10/);
  assert.match(trainingRoute, /Vælg pulszone 1–5/);
  assert.match(trainingRoute, /techniqueQuality/);
  assert.match(trainingRoute, /buildLoadSuggestion/);
  assert.match(migration, /CREATE TABLE `training_sessions`/);
  assert.match(migration, /CREATE TABLE `training_set_logs`/);
  assert.match(effortMigration, /ADD `effort_metric` text DEFAULT 'rpe' NOT NULL/);
  assert.match(techniqueMigration, /ADD `technique_quality` text/);
});

test("builds a private athlete dashboard from persisted training data", async () => {
  const [page, dashboard, analyticsRoute, analytics, exportRoute] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/athlete-dashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/training/analytics/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/training-analytics.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/export/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Se din udvikling/);
  assert.match(page, /BASE SPARRING/);
  assert.match(page, /Teknisk kvalitet/);
  assert.match(dashboard, /FORVENTET VOLUMEN/);
  assert.match(dashboard, /FAKTISK INTENSITET/);
  assert.match(dashboard, /RELATIV STYRKE/);
  assert.match(dashboard, /Første registrering = 100/);
  assert.match(dashboard, /strengthExercises\.map/);
  assert.match(dashboard, /Ingen data for/);
  assert.match(analyticsRoute, /getTesterId/);
  assert.match(analyticsRoute, /private, no-store/);
  assert.match(analyticsRoute, /majorLiftForExercise/);
  assert.match(analyticsRoute, /majorStrengthLifts\.map/);
  assert.match(analytics, /estimatedOneRepMax/);
  for (const lift of ["Clean", "Power clean", "Jerk", "Clean & Jerk", "Snatch", "Power snatch", "Front squat", "Squat", "Dødløft", "Bænkpres", "Overhead press"]) {
    assert.match(analytics, new RegExp(lift.replace(/[&]/g, "\\&")));
  }
  assert.match(analytics, /readinessScore !== null && readinessScore >= 72/);
  assert.match(analytics, /lastTwo\.every\(\(set\) => set\.techniqueQuality === "good"\)/);
  assert.match(exportRoute, /technique_quality/);
});

test("uses RIR for strength and heart-rate zones for cardio recovery", async () => {
  const [page, programData, strengthData, swimData, exportRoute] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/program-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/strength-program-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/swim-program-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/export/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(programData, /effortMetric: "rir"/);
  assert.match(programData, /effortTarget: "4–6 RIR"/);
  assert.match(programData, /effortMetric: "heart_rate_zone"/);
  assert.match(programData, /effortTarget: "Pulszone 1–2"/);
  assert.match(strengthData, /effortMetric: "rir"/);
  assert.match(swimData, /effortMetric: "heart_rate_zone"/);
  assert.match(swimData, /session\.intensity === "Restitution" \? "Pulszone 1–2"/);
  assert.match(page, /RIR er antal gode gentagelser/);
  assert.match(page, /Uden pulsur: brug samtaletempo og RPE 2–4 som fallback/);
  assert.match(page, /PULSZONE/);
  assert.match(exportRoute, /"effort_metric", "effort_value"/);
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
  const [route, panel, csv, privateAccess] = await Promise.all([
    readFile(new URL("../app/api/admin/export/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/export/export-panel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/csv.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/private-access.ts", import.meta.url), "utf8"),
  ]);

  assert.match(route, /BASE_EXPORT_KEY/);
  assert.match(route, /hasPrivateAccess/);
  assert.match(privateAccess, /authorization/);
  assert.match(privateAccess, /secureEqual/);
  assert.match(route, /private, no-store/);
  assert.match(route, /overview.*training.*feedback/);
  assert.doesNotMatch(route, /dailyHealthMetrics|healthConnections/);
  assert.match(panel, /Nøglen gemmes ikke i browseren/);
  assert.match(panel, /Download CSV/);
  assert.doesNotMatch(panel, /localStorage|sessionStorage/);
  assert.match(csv, /spreadsheetFormulaPattern/);
  assert.match(csv, /replaceAll\('\"', '\"\"'\)/);
});

test("protects the coach view and limits it to pseudonymous training data", async () => {
  const [schema, participantRoute, coachRoute, planRoute, athletePlansRoute, trainingRoute, dashboard, coachPage, migration, assignmentMigration, planMigration] = await Promise.all([
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/participant/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/coach/athletes/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/coach/plans/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/training/plans/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/training/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/coach/coach-dashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/coach/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0003_ambiguous_pretty_boy.sql", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0005_strong_mulholland_black.sql", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0006_flawless_killraven.sql", import.meta.url), "utf8"),
  ]);

  assert.match(schema, /testParticipants/);
  assert.match(participantRoute, /insert\(testParticipants\)/);
  assert.match(coachRoute, /BASE_COACH_KEY/);
  assert.match(coachRoute, /trainingSessions/);
  assert.match(coachRoute, /trainingSetLogs/);
  assert.match(coachRoute, /coachAthleteAssignments/);
  assert.match(coachRoute, /inArray\(trainingSessions\.testerId, participantIds\)/);
  assert.match(coachRoute, /export async function POST/);
  assert.match(coachRoute, /export async function DELETE/);
  assert.match(coachRoute, /availableAthletes/);
  assert.doesNotMatch(coachRoute, /feedbackResponses|dailyHealthMetrics|healthConnections/);
  assert.match(dashboard, /\/api\/coach\/athletes/);
  assert.match(dashboard, /Feedback, readiness og helbredsdata deles ikke/);
  assert.match(dashboard, /Tildel uden at kende tester-ID’et/);
  assert.match(dashboard, /Fjern tildeling/);
  assert.match(dashboard, /AKTIVE TESTPROFILER/);
  assert.match(dashboard, /SKJULTE VANDPAS/);
  assert.match(dashboard, /exerciseLibrary/);
  assert.match(dashboard, /Indlæs vandpas/);
  assert.match(dashboard, /Tildel passet til atleten/);
  assert.match(dashboard, /500 komplette skabeloner/);
  assert.match(dashboard, /Tildel alle 12 uger/);
  assert.match(dashboard, /faktisk styrkevolume/);
  assert.match(dashboard, /registreret distance/);
  assert.match(coachRoute, /strengthVolumeKg/);
  assert.match(coachRoute, /distanceMeters/);
  assert.doesNotMatch(dashboard, /localStorage|sessionStorage/);
  assert.match(schema, /coachTrainingPlans/);
  assert.match(planRoute, /BASE_COACH_KEY/);
  assert.match(planRoute, /exerciseNames\.has/);
  assert.match(planRoute, /coachAthleteAssignments/);
  assert.match(planRoute, /status: "archived"/);
  assert.match(athletePlansRoute, /getTesterId/);
  assert.match(athletePlansRoute, /coachPlanToProgramDay/);
  assert.match(trainingRoute, /coachTrainingPlans/);
  assert.match(trainingRoute, /coachPlanToProgramDay/);
  assert.match(coachPage, /robots: \{ index: false, follow: false \}/);
  assert.match(migration, /CREATE TABLE `test_participants`/);
  assert.match(assignmentMigration, /CREATE TABLE `coach_athlete_assignments`/);
  assert.match(assignmentMigration, /CREATE UNIQUE INDEX `idx_coach_athlete_assignments_coach_tester`/);
  assert.match(planMigration, /CREATE TABLE `coach_training_plans`/);
  assert.match(planMigration, /idx_coach_training_plans_tester_status_date/);
});

test("persists and enforces each athlete's selected sport profile", async () => {
  const [schema, participantRoute, trainingRoute, coachRoute, dashboard, migration] = await Promise.all([
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/participant/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/training/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/coach/athletes/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/coach/coach-dashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0004_keen_skreet.sql", import.meta.url), "utf8"),
  ]);

  assert.match(schema, /trainingProfile/);
  assert.match(schema, /"weightlifting", "long_distance", "middle_distance", "sprint", "recreational"/);
  assert.match(participantRoute, /isTrainingProfile/);
  assert.match(participantRoute, /inferredProfile = sessions\.some/);
  assert.match(participantRoute, /getProgram\(session\.programId\)/);
  assert.match(participantRoute, /trainingProfile: payload\.trainingProfile/);
  assert.match(trainingRoute, /getTrainingProgram\(participant\.trainingProfile, payload\.programId\)/);
  assert.match(trainingRoute, /matchesProfile = Boolean\(staticProgram\)/);
  assert.match(coachRoute, /trainingProfileLabel/);
  assert.match(dashboard, /athlete\.trainingProfileLabel/);
  assert.match(migration, /ADD `training_profile` text/);
});

test("protects the live owner dashboard and reconciles the core test metrics", async () => {
  const [route, dashboard, page, privateAccess] = await Promise.all([
    readFile(new URL("../app/api/owner/dashboard/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/owner/owner-dashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/private-access.ts", import.meta.url), "utf8"),
  ]);

  assert.match(privateAccess, /BASE_OWNER_KEY/);
  assert.match(route, /hasPrivateAccess\(request, "BASE_OWNER_KEY"\)/);
  assert.match(route, /testParticipants/);
  assert.match(route, /trainingSessions/);
  assert.match(route, /trainingSetLogs/);
  assert.match(route, /feedbackResponses/);
  assert.match(route, /coachAthleteAssignments/);
  assert.match(route, /completionRate/);
  assert.match(route, /feedbackCoverage/);
  assert.match(route, /length: 14/);
  assert.match(route, /private, no-store/);
  assert.match(dashboard, /BASE-overblik/);
  assert.match(dashboard, /Seneste 14 dage/);
  assert.match(dashboard, /FEEDBACKKVALITET/);
  assert.match(dashboard, /HANDLINGSLISTE/);
  assert.match(dashboard, /60_000/);
  assert.doesNotMatch(dashboard, /localStorage|sessionStorage/);
  assert.match(page, /robots: \{ index: false, follow: false \}/);
});
