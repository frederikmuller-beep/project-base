import { clearTesterId, getTesterId, normalizeTesterId, setTesterId } from "../../../lib/tester-session";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { testParticipants, trainingSessions } from "../../../db/schema";
import { getProgram } from "../../program-data";
import { isTrainingProfile } from "../../swim-program-data";
import { defaultTrainingDays, isTrainingDays, parseTrainingDays, trainingWeekdays } from "../../training-days";

export async function GET() {
  const testerId = await getTesterId();
  if (!testerId) return Response.json({ testerId: null, trainingProfile: null, trainingDays: defaultTrainingDays });
  try {
    const [participant] = await getDb().select({ trainingProfile: testParticipants.trainingProfile, trainingDays: testParticipants.trainingDays })
      .from(testParticipants).where(eq(testParticipants.testerId, testerId)).limit(1);
    if (participant?.trainingProfile) return Response.json({ testerId, trainingProfile: participant.trainingProfile, trainingDays: parseTrainingDays(participant.trainingDays) });
    const sessions = await getDb().select({ programId: trainingSessions.programId })
      .from(trainingSessions).where(eq(trainingSessions.testerId, testerId));
    const inferredProfile = sessions.some((session) => getProgram(session.programId)) ? "weightlifting" : null;
    if (inferredProfile) {
      await getDb().update(testParticipants).set({ trainingProfile: inferredProfile }).where(eq(testParticipants.testerId, testerId));
    }
    return Response.json({ testerId, trainingProfile: inferredProfile, trainingDays: parseTrainingDays(participant?.trainingDays) });
  } catch {
    return Response.json({ testerId, trainingProfile: null, trainingDays: defaultTrainingDays });
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { testerId?: string; trainingProfile?: string; trainingDays?: unknown };
  const testerId = normalizeTesterId(payload.testerId);

  if (!testerId) {
    return Response.json({ error: "Indtast dit tester-ID, fx A1 eller T1." }, { status: 400 });
  }
  if (!isTrainingProfile(payload.trainingProfile)) {
    return Response.json({ error: "Vælg en af sportsprofilerne i BASE." }, { status: 400 });
  }
  if (!isTrainingDays(payload.trainingDays)) {
    return Response.json({ error: "Vælg præcis tre forskellige træningsdage." }, { status: 400 });
  }
  const trainingDays = [...payload.trainingDays].sort((left, right) => trainingWeekdays.indexOf(left) - trainingWeekdays.indexOf(right));

  await setTesterId(testerId);
  try {
    await getDb().insert(testParticipants).values({ testerId, trainingProfile: payload.trainingProfile, trainingDays: JSON.stringify(trainingDays) }).onConflictDoUpdate({
      target: testParticipants.testerId,
      set: { trainingProfile: payload.trainingProfile, trainingDays: JSON.stringify(trainingDays), lastSeenAt: sql`CURRENT_TIMESTAMP` },
    });
  } catch {
    // The cookie still lets a tester continue while a new database migration propagates.
  }
  return Response.json({ testerId, trainingProfile: payload.trainingProfile, trainingDays });
}

export async function DELETE() {
  await clearTesterId();
  return Response.json({ cleared: true });
}
