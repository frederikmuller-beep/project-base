import { env } from "cloudflare:workers";
import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { feedbackResponses, trainingSessions, trainingSetLogs } from "../../../../db/schema";
import { toCsv, type CsvValue } from "../../../../lib/csv";

type Dataset = "overview" | "training" | "feedback";

const datasets = new Set<Dataset>(["overview", "training", "feedback"]);

const exportKey = () =>
  (env as unknown as Record<string, string | undefined>).BASE_EXPORT_KEY?.trim() ?? "";

const secureEqual = (left: string, right: string) => {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
};

const isAuthorized = (request: Request) => {
  const expected = exportKey();
  const authorization = request.headers.get("authorization") ?? "";
  return expected.length >= 24 && secureEqual(authorization, `Bearer ${expected}`);
};

const safeAnswers = (value: string) => {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, string | string[]>
      : {};
  } catch {
    return {};
  }
};

const csvResponse = (dataset: Dataset, csv: string) =>
  new Response(csv, {
    headers: {
      "cache-control": "private, no-store, max-age=0",
      "content-disposition": `attachment; filename="base-${dataset}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "content-type": "text/csv; charset=utf-8",
      "x-content-type-options": "nosniff",
    },
  });

async function readExportData() {
  const db = getDb();
  const [training, feedback] = await Promise.all([
    db.select({
      sessionId: trainingSessions.id,
      testerId: trainingSessions.testerId,
      programId: trainingSessions.programId,
      sessionStatus: trainingSessions.status,
      plannedSets: trainingSessions.plannedSets,
      completedSets: trainingSessions.completedSets,
      startedAt: trainingSessions.startedAt,
      completedAt: trainingSessions.completedAt,
      setId: trainingSetLogs.id,
      exerciseIndex: trainingSetLogs.exerciseIndex,
      setIndex: trainingSetLogs.setIndex,
      weight: trainingSetLogs.weight,
      reps: trainingSetLogs.reps,
      rpe: trainingSetLogs.rpe,
      loggedAt: trainingSetLogs.loggedAt,
    }).from(trainingSessions)
      .leftJoin(trainingSetLogs, eq(trainingSessions.id, trainingSetLogs.sessionId))
      .orderBy(asc(trainingSessions.testerId), asc(trainingSessions.startedAt), asc(trainingSetLogs.exerciseIndex), asc(trainingSetLogs.setIndex)),
    db.select().from(feedbackResponses)
      .orderBy(asc(feedbackResponses.testerId), asc(feedbackResponses.createdAt)),
  ]);
  return { training, feedback };
}

function trainingCsv(training: Awaited<ReturnType<typeof readExportData>>["training"]) {
  const headers = [
    "tester_id", "program_id", "session_status", "planned_sets", "completed_sets",
    "session_started_at", "session_completed_at", "exercise_number", "set_number",
    "weight_kg", "reps", "rpe", "set_logged_at",
  ];
  const rows = training.map((row): CsvValue[] => [
    row.testerId, row.programId, row.sessionStatus, row.plannedSets, row.completedSets,
    row.startedAt, row.completedAt, row.exerciseIndex === null ? null : row.exerciseIndex + 1,
    row.setIndex === null ? null : row.setIndex + 1, row.weight, row.reps, row.rpe, row.loggedAt,
  ]);
  return toCsv(headers, rows);
}

function feedbackCsv(feedback: Awaited<ReturnType<typeof readExportData>>["feedback"]) {
  const parsed = feedback.map((row) => ({ row, answers: safeAnswers(row.answers) }));
  const answerKeys = [...new Set(parsed.flatMap(({ answers }) => Object.keys(answers)))].sort();
  const headers = ["response_id", "tester_id", "role", "form_type", "created_at", ...answerKeys];
  const rows = parsed.map(({ row, answers }): CsvValue[] => [
    row.id, row.testerId, row.role, row.kind, row.createdAt,
    ...answerKeys.map((key) => Array.isArray(answers[key]) ? answers[key].join(" | ") : answers[key] ?? ""),
  ]);
  return toCsv(headers, rows);
}

function overviewCsv(
  training: Awaited<ReturnType<typeof readExportData>>["training"],
  feedback: Awaited<ReturnType<typeof readExportData>>["feedback"],
) {
  const summaries = new Map<string, {
    sessions: Set<string>;
    completedSessions: Set<string>;
    sets: Set<number>;
    feedback: number;
    lastActivity: string;
  }>();
  const summaryFor = (testerId: string) => {
    const existing = summaries.get(testerId);
    if (existing) return existing;
    const created = { sessions: new Set<string>(), completedSessions: new Set<string>(), sets: new Set<number>(), feedback: 0, lastActivity: "" };
    summaries.set(testerId, created);
    return created;
  };

  for (const row of training) {
    const summary = summaryFor(row.testerId);
    summary.sessions.add(row.sessionId);
    if (row.sessionStatus === "completed") summary.completedSessions.add(row.sessionId);
    if (row.setId !== null) summary.sets.add(row.setId);
    const activityAt = row.loggedAt ?? row.completedAt ?? row.startedAt;
    if (activityAt > summary.lastActivity) summary.lastActivity = activityAt;
  }
  for (const row of feedback) {
    const summary = summaryFor(row.testerId);
    summary.feedback += 1;
    if (row.createdAt > summary.lastActivity) summary.lastActivity = row.createdAt;
  }

  const rows = [...summaries.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "da"))
    .map(([testerId, summary]): CsvValue[] => [
      testerId, summary.sessions.size, summary.completedSessions.size, summary.sets.size,
      summary.feedback, summary.lastActivity,
    ]);
  return toCsv(
    ["tester_id", "sessions_started", "sessions_completed", "sets_logged", "feedback_responses", "last_activity_at"],
    rows,
  );
}

export async function GET(request: Request) {
  if (!exportKey()) {
    return Response.json({ error: "Eksporten er ikke konfigureret endnu." }, { status: 503 });
  }
  if (!isAuthorized(request)) {
    return Response.json({ error: "Forkert eksportnøgle." }, {
      status: 401,
      headers: { "cache-control": "no-store", "www-authenticate": "Bearer" },
    });
  }

  const requestedDataset = new URL(request.url).searchParams.get("dataset") as Dataset | null;
  if (!requestedDataset || !datasets.has(requestedDataset)) {
    return Response.json({ error: "Vælg overview, training eller feedback." }, { status: 400 });
  }

  try {
    const { training, feedback } = await readExportData();
    const csv = requestedDataset === "training"
      ? trainingCsv(training)
      : requestedDataset === "feedback"
        ? feedbackCsv(feedback)
        : overviewCsv(training, feedback);
    return csvResponse(requestedDataset, csv);
  } catch {
    return Response.json({ error: "Testdata kunne ikke eksporteres." }, {
      status: 500,
      headers: { "cache-control": "no-store" },
    });
  }
}
