import { clearTesterId, getTesterId, normalizeTesterId, setTesterId } from "../../../lib/tester-session";
import { sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { testParticipants } from "../../../db/schema";

export async function GET() {
  return Response.json({ testerId: await getTesterId() });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { testerId?: string };
  const testerId = normalizeTesterId(payload.testerId);

  if (!testerId) {
    return Response.json({ error: "Indtast dit tester-ID, fx A1 eller T1." }, { status: 400 });
  }

  await setTesterId(testerId);
  try {
    await getDb().insert(testParticipants).values({ testerId }).onConflictDoUpdate({
      target: testParticipants.testerId,
      set: { lastSeenAt: sql`CURRENT_TIMESTAMP` },
    });
  } catch {
    // The cookie still lets a tester continue while a new database migration propagates.
  }
  return Response.json({ testerId });
}

export async function DELETE() {
  await clearTesterId();
  return Response.json({ cleared: true });
}
