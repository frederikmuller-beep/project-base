import { getDb } from "../../../db";
import { feedbackResponses } from "../../../db/schema";

type FeedbackPayload = {
  kind?: "session" | "final";
  testerId?: string;
  role?: "athlete" | "coach";
  answers?: Record<string, string | string[]>;
  website?: string;
};

const testerIdPattern = /^[A-Za-z0-9ÆØÅæøå-]{2,12}$/;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FeedbackPayload;

    if (payload.website) {
      return Response.json({ saved: true }, { status: 201 });
    }

    if (payload.kind !== "session" && payload.kind !== "final") {
      return Response.json({ error: "Vælg en gyldig formular." }, { status: 400 });
    }

    const testerId = payload.testerId?.trim().toUpperCase() ?? "";
    if (!testerIdPattern.test(testerId)) {
      return Response.json({ error: "Indtast dit tester-ID, fx A1 eller T1." }, { status: 400 });
    }

    if (payload.role !== "athlete" && payload.role !== "coach") {
      return Response.json({ error: "Vælg atlet eller træner." }, { status: 400 });
    }

    if (!payload.answers || Array.isArray(payload.answers)) {
      return Response.json({ error: "Besvar formularen, før du sender." }, { status: 400 });
    }

    const answers = JSON.stringify(payload.answers);
    if (answers.length > 15_000) {
      return Response.json({ error: "Svaret er for langt. Forkort friteksten og prøv igen." }, { status: 400 });
    }

    const db = getDb();
    const [saved] = await db
      .insert(feedbackResponses)
      .values({ kind: payload.kind, testerId, role: payload.role, answers })
      .returning({ id: feedbackResponses.id });

    return Response.json({ saved: true, id: saved.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ukendt fejl";
    const unavailable = message.includes("no such table") || message.includes("D1 binding");
    return Response.json(
      { error: unavailable ? "Feedbackmodulet er ved at blive gjort klar. Prøv igen om lidt." : "Dit svar kunne ikke gemmes. Prøv igen." },
      { status: 500 },
    );
  }
}
