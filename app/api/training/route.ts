import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { testParticipants, trainingSessions, trainingSetLogs } from "../../../db/schema";
import { countProgramSets, getProgram } from "../../program-data";
import { getStrengthProgram } from "../../strength-program-data";
import { getTesterId } from "../../../lib/tester-session";

type TrainingPayload = {
  action?: "start" | "log_set";
  programId?: string;
  exerciseIndex?: number;
  setIndex?: number;
  weight?: string;
  reps?: string;
  rpe?: string;
};

const sessionSetLogs = async (sessionId: string) => getDb()
  .select({
    exerciseIndex: trainingSetLogs.exerciseIndex,
    setIndex: trainingSetLogs.setIndex,
    weight: trainingSetLogs.weight,
    reps: trainingSetLogs.reps,
    rpe: trainingSetLogs.rpe,
  })
  .from(trainingSetLogs)
  .where(eq(trainingSetLogs.sessionId, sessionId));

const cleanLogValue = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned.length > 0 && cleaned.length <= maxLength ? cleaned : null;
};

const unavailableMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  return message.includes("no such table") || message.includes("D1 binding");
};

async function requireTesterId() {
  const testerId = await getTesterId();
  if (!testerId) throw new Error("TESTER_REQUIRED");
  return testerId;
}

export async function GET() {
  try {
    const testerId = await requireTesterId();
    const db = getDb();
    const sessions = await db
      .select({
        programId: trainingSessions.programId,
        status: trainingSessions.status,
        completedSets: trainingSessions.completedSets,
        plannedSets: trainingSessions.plannedSets,
      })
      .from(trainingSessions)
      .where(eq(trainingSessions.testerId, testerId));

    return Response.json({ sessions });
  } catch (error) {
    if (error instanceof Error && error.message === "TESTER_REQUIRED") {
      return Response.json({ error: "Tilslut dit tester-ID først." }, { status: 401 });
    }
    return Response.json(
      { error: unavailableMessage(error) ? "Træningshistorikken er ved at blive gjort klar. Prøv igen om lidt." : "Fremdriften kunne ikke hentes." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const testerId = await requireTesterId();
    const payload = (await request.json()) as TrainingPayload;
    const db = getDb();
    const [participant] = await db.select({ trainingProfile: testParticipants.trainingProfile })
      .from(testParticipants).where(eq(testParticipants.testerId, testerId)).limit(1);
    if (!participant?.trainingProfile) {
      return Response.json({ error: "Vælg din træningsprofil før du starter passet." }, { status: 400 });
    }
    const program = payload.programId
      ? participant.trainingProfile === "weightlifting" ? getProgram(payload.programId) : getStrengthProgram(payload.programId)
      : undefined;

    const matchesProfile = participant.trainingProfile === "weightlifting"
      ? Boolean(program && getProgram(program.programId ?? ""))
      : Boolean(program?.programId?.startsWith(`strength-${participant.trainingProfile}-`));
    if (!program || !program.programId || !matchesProfile || program.exercises.length === 0) {
      return Response.json({ error: "Vælg et gyldigt planlagt pas." }, { status: 400 });
    }

    const plannedSets = countProgramSets(program);
    const sessionId = crypto.randomUUID();

    await db.insert(trainingSessions).values({
      id: sessionId,
      testerId,
      programId: program.programId,
      plannedSets,
    }).onConflictDoNothing();

    const [session] = await db
      .select()
      .from(trainingSessions)
      .where(and(eq(trainingSessions.testerId, testerId), eq(trainingSessions.programId, program.programId)))
      .limit(1);

    if (!session) throw new Error("SESSION_NOT_CREATED");

    if (payload.action === "start") {
      const sets = await sessionSetLogs(session.id);
      return Response.json({
        programId: session.programId,
        status: session.status,
        completedSets: session.completedSets,
        plannedSets: session.plannedSets,
        sets,
      });
    }

    if (payload.action !== "log_set") {
      return Response.json({ error: "Vælg en gyldig handling." }, { status: 400 });
    }

    const exerciseIndex = payload.exerciseIndex;
    const setIndex = payload.setIndex;
    const plannedExercise = Number.isInteger(exerciseIndex) ? program.exercises[exerciseIndex as number] : undefined;
    if (!plannedExercise || !Number.isInteger(setIndex) || (setIndex as number) < 0 || (setIndex as number) >= plannedExercise.sets) {
      return Response.json({ error: "Sættet findes ikke i det planlagte pas." }, { status: 400 });
    }

    const weight = cleanLogValue(payload.weight, 12);
    const reps = cleanLogValue(payload.reps, 12);
    const rpe = cleanLogValue(payload.rpe, 8);
    if (!weight || !reps || !rpe) {
      return Response.json({ error: "Udfyld sættets data og RPE før du gemmer." }, { status: 400 });
    }

    await db.insert(trainingSetLogs).values({
      sessionId: session.id,
      exerciseIndex: exerciseIndex as number,
      setIndex: setIndex as number,
      weight,
      reps,
      rpe,
    }).onConflictDoUpdate({
      target: [trainingSetLogs.sessionId, trainingSetLogs.exerciseIndex, trainingSetLogs.setIndex],
      set: { weight, reps, rpe, loggedAt: sql`CURRENT_TIMESTAMP` },
    });

    const [countRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(trainingSetLogs)
      .where(eq(trainingSetLogs.sessionId, session.id));
    const completedSets = Number(countRow?.count ?? 0);
    const status = completedSets >= plannedSets ? "completed" : "active";

    await db.update(trainingSessions).set({
      completedSets,
      status,
      completedAt: status === "completed" ? sql`CURRENT_TIMESTAMP` : null,
    }).where(eq(trainingSessions.id, session.id));

    return Response.json({
      programId: program.programId,
      completedSets,
      plannedSets,
      status,
      savedSet: { exerciseIndex, setIndex, weight, reps, rpe },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TESTER_REQUIRED") {
      return Response.json({ error: "Tilslut dit tester-ID først." }, { status: 401 });
    }
    return Response.json(
      { error: unavailableMessage(error) ? "Træningshistorikken er ved at blive gjort klar. Prøv igen om lidt." : "Sættet kunne ikke gemmes. Prøv igen." },
      { status: 500 },
    );
  }
}
