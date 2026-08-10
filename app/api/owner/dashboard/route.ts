import { getDb } from "../../../../db";
import { coachAthleteAssignments, feedbackResponses, testParticipants, trainingSessions, trainingSetLogs } from "../../../../db/schema";
import { getPrivateAccessSecret, hasPrivateAccess } from "../../../../lib/private-access";

const profileLabels: Record<string, string> = {
  weightlifting: "Vægtløftning",
  long_distance: "Langdistance",
  middle_distance: "Mellemdistance",
  sprint: "Sprint",
  unknown: "Ikke valgt",
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

const utcDate = (value: string | null | undefined) => value?.slice(0, 10) ?? "";

export async function GET(request: Request) {
  if (!getPrivateAccessSecret("BASE_OWNER_KEY")) {
    return Response.json({ error: "Ejer-dashboardet er ikke konfigureret endnu." }, { status: 503 });
  }
  if (!hasPrivateAccess(request, "BASE_OWNER_KEY")) {
    return Response.json({ error: "Forkert ejernøgle." }, {
      status: 401,
      headers: { "cache-control": "no-store", "www-authenticate": "Bearer" },
    });
  }

  try {
    const db = getDb();
    const [participants, sessions, setLogs, feedback, assignments] = await Promise.all([
      db.select().from(testParticipants),
      db.select().from(trainingSessions),
      db.select().from(trainingSetLogs),
      db.select().from(feedbackResponses),
      db.select().from(coachAthleteAssignments),
    ]);

    const generatedAt = new Date().toISOString();
    const today = new Date(`${generatedAt.slice(0, 10)}T00:00:00.000Z`);
    const dayKeys = Array.from({ length: 14 }, (_, offset) => {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - (13 - offset));
      return date.toISOString().slice(0, 10);
    });
    const activity = dayKeys.map((date) => ({
      date,
      started: sessions.filter((session) => utcDate(session.startedAt) === date).length,
      completed: sessions.filter((session) => utcDate(session.completedAt) === date).length,
      sets: setLogs.filter((set) => utcDate(set.loggedAt) === date).length,
    }));

    const completedSessions = sessions.filter((session) => session.status === "completed");
    const participantIds = new Set([
      ...participants.map((participant) => participant.testerId),
      ...sessions.map((session) => session.testerId),
      ...feedback.map((response) => response.testerId),
    ]);
    const feedbackTesterIds = new Set(feedback.map((response) => response.testerId));
    const completionRate = sessions.length > 0 ? completedSessions.length / sessions.length : 0;
    const feedbackCoverage = participantIds.size > 0 ? feedbackTesterIds.size / participantIds.size : 0;

    const profiles = Object.keys(profileLabels).map((profile) => {
      const profileParticipants = participants.filter((participant) => (participant.trainingProfile ?? "unknown") === profile);
      const ids = new Set(profileParticipants.map((participant) => participant.testerId));
      const profileSessions = sessions.filter((session) => ids.has(session.testerId));
      return {
        profile,
        label: profileLabels[profile],
        athletes: profileParticipants.length,
        started: profileSessions.length,
        completed: profileSessions.filter((session) => session.status === "completed").length,
      };
    }).filter((profile) => profile.athletes > 0 || profile.started > 0);

    const ratingKeys = {
      ease: ["ease", "overallEase"],
      clarity: ["clarity"],
      trust: ["trust", "overallTrust"],
      value: ["overallValue"],
    };
    const parsedFeedback = feedback.map((response) => ({ ...response, parsed: safeAnswers(response.answers) }));
    const averageFor = (keys: string[]) => {
      const values = parsedFeedback.flatMap(({ parsed }) => keys.map((key) => Number(parsed[key])).filter((value) => Number.isFinite(value) && value >= 1 && value <= 5));
      return values.length > 0 ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : null;
    };
    const feedbackSignals = {
      responses: feedback.length,
      sessionResponses: feedback.filter((response) => response.kind === "session").length,
      finalResponses: feedback.filter((response) => response.kind === "final").length,
      athleteResponses: feedback.filter((response) => response.role === "athlete").length,
      coachResponses: feedback.filter((response) => response.role === "coach").length,
      frictionMentions: parsedFeedback.filter(({ parsed }) => typeof parsed.friction === "string" && parsed.friction.trim().length > 0).length,
      ease: averageFor(ratingKeys.ease),
      clarity: averageFor(ratingKeys.clarity),
      trust: averageFor(ratingKeys.trust),
      value: averageFor(ratingKeys.value),
    };

    const sessionsByTester = new Map<string, typeof sessions>();
    for (const session of sessions) {
      const current = sessionsByTester.get(session.testerId) ?? [];
      current.push(session);
      sessionsByTester.set(session.testerId, current);
    }
    const feedbackByTester = new Map<string, number>();
    for (const response of feedback) feedbackByTester.set(response.testerId, (feedbackByTester.get(response.testerId) ?? 0) + 1);
    const participantById = new Map(participants.map((participant) => [participant.testerId, participant]));
    const assignedIds = new Set(assignments.map((assignment) => assignment.testerId));
    const setSessionIds = new Map<string, number>();
    for (const set of setLogs) setSessionIds.set(set.sessionId, (setSessionIds.get(set.sessionId) ?? 0) + 1);
    const followUpCutoff = new Date(today);
    followUpCutoff.setUTCDate(today.getUTCDate() - 3);

    const athletes = [...participantIds].map((testerId) => {
      const athleteSessions = sessionsByTester.get(testerId) ?? [];
      const participant = participantById.get(testerId);
      const lastCandidates = [
        participant?.lastSeenAt,
        ...athleteSessions.map((session) => session.completedAt ?? session.startedAt),
        ...feedback.filter((response) => response.testerId === testerId).map((response) => response.createdAt),
      ].filter((value): value is string => Boolean(value)).sort();
      const lastActiveAt = lastCandidates.at(-1) ?? null;
      const status = athleteSessions.length === 0
        ? "not_started"
        : !lastActiveAt || new Date(lastActiveAt.replace(" ", "T") + (lastActiveAt.includes("Z") ? "" : "Z")) < followUpCutoff
          ? "follow_up"
          : "active";
      return {
        testerId,
        profile: participant?.trainingProfile ?? "unknown",
        profileLabel: profileLabels[participant?.trainingProfile ?? "unknown"],
        sessionsStarted: athleteSessions.length,
        sessionsCompleted: athleteSessions.filter((session) => session.status === "completed").length,
        setsLogged: athleteSessions.reduce((sum, session) => sum + (setSessionIds.get(session.id) ?? 0), 0),
        feedbackResponses: feedbackByTester.get(testerId) ?? 0,
        assignedToCoach: assignedIds.has(testerId),
        lastActiveAt,
        status,
      };
    }).sort((left, right) => {
      const order = { not_started: 0, follow_up: 1, active: 2 };
      return order[left.status] - order[right.status] || (right.lastActiveAt ?? "").localeCompare(left.lastActiveAt ?? "");
    });

    return Response.json({
      generatedAt,
      totals: {
        testers: participantIds.size,
        activated: athletes.filter((athlete) => athlete.sessionsStarted > 0).length,
        sessionsStarted: sessions.length,
        sessionsCompleted: completedSessions.length,
        completionRate,
        setsLogged: setLogs.length,
        feedbackResponses: feedback.length,
        feedbackCoverage,
        coachAssigned: assignedIds.size,
        needsAttention: athletes.filter((athlete) => athlete.status !== "active").length,
      },
      activity,
      profiles,
      feedback: feedbackSignals,
      athletes,
    }, { headers: { "cache-control": "private, no-store, max-age=0", "x-content-type-options": "nosniff" } });
  } catch {
    return Response.json({ error: "Dashboarddata kunne ikke hentes." }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
