import { clearTesterId, getTesterId, normalizeTesterId, setTesterId } from "../../../lib/tester-session";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { testParticipants } from "../../../db/schema";
import { isSwimProfile } from "../../swim-program-data";

export async function GET() {
  const testerId = await getTesterId();
  if (!testerId) return Response.json({ testerId: null, trainingProfile: null });
  try {
    const [participant] = await getDb().select({ trainingProfile: testParticipants.trainingProfile })
      .from(testParticipants).where(eq(testParticipants.testerId, testerId)).limit(1);
    return Response.json({ testerId, trainingProfile: participant?.trainingProfile ?? null });
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
  if (!isSwimProfile(payload.trainingProfile)) {
    return Response.json({ error: "Vælg Langdistance, Mellemdistance eller Sprint." }, { status: 400 });
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
