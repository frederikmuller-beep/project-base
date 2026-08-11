import { clearTesterId, getTesterId, normalizeTesterId, setTesterId } from "../../../lib/tester-session";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { testParticipants, trainingSessions } from "../../../db/schema";
import { getProgram } from "../../program-data";
import { isTrainingProfile } from "../../swim-program-data";

export async function GET() {
  const testerId = await getTesterId();
  if (!testerId) return Response.json({ testerId: null, trainingProfile: null });
  try {
    const [participant] = await getDb().select({ trainingProfile: testParticipants.trainingProfile })
      .from(testParticipants).where(eq(testParticipants.testerId, testerId)).limit(1);
    if (participant?.trainingProfile) return Response.json({ testerId, trainingProfile: participant.trainingProfile });
    const sessions = await getDb().select({ programId: trainingSessions.programId })
      .from(trainingSessions).where(eq(trainingSessions.testerId, testerId));
    const inferredProfile = sessions.some((session) => getProgram(session.programId)) ? "weightlifting" : null;
    if (inferredProfile) {
      await getDb().update(testParticipants).set({ trainingProfile: inferredProfile }).where(eq(testParticipants.testerId, testerId));
    }
    return Response.json({ testerId, trainingProfile: inferredProfile });
  } catch {
    return Response.json({ testerId, trainingProfile: null });
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { testerId?: string; trainingProfile?: string };
  const testerId = normalizeTesterId(payload.testerId);

  if (!testerId) {
    return Response.json({ error: "Indtast dit tester-ID, fx A1 eller T1." }, { status: 400 });
  }
  if (!isTrainingProfile(payload.trainingProfile)) {
    return Response.json({ error: "Vælg Vægtløftning, Langdistance, Mellemdistance, Sprint eller Motionist." }, { status: 400 });
  }

  await setTesterId(testerId);
  try {
    await getDb().insert(testParticipants).values({ testerId, trainingProfile: payload.trainingProfile }).onConflictDoUpdate({
      target: testParticipants.testerId,
      set: { trainingProfile: payload.trainingProfile, lastSeenAt: sql`CURRENT_TIMESTAMP` },
    });
  } catch {
    // The cookie still lets a tester continue while a new database migration propagates.
  }
  return Response.json({ testerId, trainingProfile: payload.trainingProfile });
}

export async function DELETE() {
  await clearTesterId();
  return Response.json({ cleared: true });
}
