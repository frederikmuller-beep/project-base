# BASE Product Requirements Document (PRD)

## Document record

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | Draft |
| Product owner | BASE founding team |
| Product stage | Validated prototype → pilot MVP |
| Primary market | Olympic weightlifting |
| Last reviewed | 2026-08-03 |

## 1. Executive summary

BASE is a focused training product for Olympic weightlifters and their coaches. It connects the daily plan, athlete readiness, an explainable recommendation, session execution, training logs, and coach review in one workflow.

The existing prototype demonstrates the athlete journey in Danish: today's session, a short readiness check, a green/amber/red recommendation, reversible load adjustment, set logging, an exercise library, and structured test feedback persisted to Cloudflare D1.

The next product stage is not “more prototype.” It is a pilot-ready MVP that supports real users, real plans, persistent session data, coach oversight, and trustworthy operational measurement.

## 2. Problem

Athletes often receive a plan in one tool, discuss changes in another, log results elsewhere, and rely on memory for the reason behind an adjustment. Coaches spend time reconstructing context and cannot consistently see what was planned, changed, completed, or felt difficult.

This creates four core failures:

- **Execution failure:** the athlete is unsure what to do next.
- **Context failure:** readiness and session outcomes are separated from the plan.
- **Trust failure:** recommendations are hard to understand or override.
- **Feedback failure:** the coach receives incomplete or delayed information.

## 3. Product hypothesis

If BASE gives athletes one clear daily workflow and gives coaches transparent control over plans and adjustments, then athletes will complete and log more planned sessions, coaches will spend less time gathering context, and both groups will trust the system enough to use it weekly.

## 4. Users

### Primary: coached weightlifting athlete

- Trains 2–6 times per week.
- Receives programming from a coach.
- Needs speed and clarity during training.
- Wants useful adjustment without surrendering control.
- Has limited patience for administrative logging.

### Primary: weightlifting coach

- Programs for multiple athletes.
- Needs to know whether sessions were followed and how they went.
- Must remain accountable for material training decisions.
- Values time saved only when quality and control are preserved.

### Secondary: self-coached athlete

May use templates and BASE guidance, but must see the limits of automated recommendations.

### Later: club administrator and federation staff

These roles are out of MVP scope except for architecture and permission readiness.

## 5. Jobs to be done

### Athlete jobs

- When I arrive to train, show me today's plan and the next useful action.
- When my condition differs from normal, help me make a responsible adjustment.
- When I complete a set, let me log it in seconds.
- When a recommendation changes my plan, show me why and let me reverse it.
- When training ends, show what happened and what my coach will see.

### Coach jobs

- Let me create or assign a plan without spreadsheet duplication.
- Show the differences between planned and completed work.
- Surface athletes who need attention without creating alarm fatigue.
- Let me approve, override, or disable automated adjustments.
- Preserve the history behind consequential decisions.

## 6. Goals and success measures

### MVP goals

1. Deliver the complete plan → readiness → decision → log → review loop.
2. Make every adjustment explainable and reversible.
3. Give coaches usable oversight across their athletes.
4. Establish secure persistence and product analytics.
5. Generate evidence for retention, trust, and willingness to pay.

### Pilot targets

Targets are hypotheses until pilot baselines exist:

| Outcome | Pilot target |
|---|---|
| Planned sessions started | ≥ 70% |
| Started sessions completed | ≥ 75% |
| Completed sessions with useful logs | ≥ 80% |
| Median set-log interaction | ≤ 10 seconds |
| Recommendation reason understood | ≥ 4/5 |
| Athlete weekly-use intent | ≥ 4/5 |
| Coach reports time saved or better clarity | ≥ 70% |
| Week-4 retained pilot users | ≥ 50% |
| Unexplained material adjustments | 0 |

### Non-goals for MVP

- Medical diagnosis, rehabilitation prescription, or injury prediction.
- Autonomous AI coaching without human review controls.
- Social feeds, challenges, or public leaderboards.
- Marketplace, federation analytics, or multi-sport support.
- Wearable integrations before the manual workflow proves value.
- Advanced billing or enterprise procurement.

## 7. Current-state baseline

The repository currently contains:

- a Next.js 16 / React 19 / TypeScript client prototype;
- Danish mobile-first screens for today's plan and exercise library;
- energy, sleep, soreness, and pain readiness inputs;
- deterministic green/amber/red recommendations;
- reversible load adjustment and set logging;
- session and final feedback forms for athletes and coaches;
- a Cloudflare D1 feedback table via Drizzle ORM;
- build, lint, and rendered-source tests;
- Sites/Cloudflare hosting configuration.

Prototype session and training data are held in client state and are not persisted. Authentication, coach workflows, real programming, authorization, audit history, and production analytics remain to be built.

## 8. MVP scope

### 8.1 Identity and onboarding

**FR-001** Users must create or access an account through a secure authentication flow.

**FR-002** A user must select or be assigned an athlete, coach, or dual role.

**FR-003** Athlete onboarding must capture units, timezone, training frequency, competition lifts, and coach relationship only when required for product value.

**FR-004** The product must record consent and policy versions.

### 8.2 Coach-athlete relationship

**FR-010** An athlete may invite or accept one or more authorized coaches according to the initial relationship policy.

**FR-011** A coach must see only athletes who have an active relationship with that coach.

**FR-012** The athlete must be able to revoke access, subject to legally required record retention.

**FR-013** Material actions must identify the actor and source.

### 8.3 Exercise library

**FR-020** Exercises must have a stable identifier, name, category, movement family, equipment, and coaching cues.

**FR-021** Coaches may use approved exercises when programming.

**FR-022** Custom exercises may be added later; MVP may restrict creation to administrators.

### 8.4 Programming

**FR-030** A coach must create, edit, duplicate, and assign a session.

**FR-031** A session must support ordered exercises, sets, reps, load prescriptions, RPE/RIR targets, rest, tempo, notes, and technical focus where applicable.

**FR-032** The athlete must see the published plan but not unpublished coach drafts.

**FR-033** Changes after publication must preserve the prior value and actor.

**FR-034** Program templates and multi-week cycles are desirable but may follow single-session assignment if pilot speed requires it.

### 8.5 Today's session

**FR-040** The athlete must see the correct local-date session, duration estimate, work summary, and next action.

**FR-041** The athlete may begin the session with or without completing readiness when policy permits.

**FR-042** Offline or interrupted sessions must not silently lose confirmed set logs.

### 8.6 Readiness

**FR-050** MVP readiness inputs are energy, sleep quality, soreness, and pain indication.

**FR-051** The system must show the purpose of each input and avoid requesting diagnostic detail.

**FR-052** A pain indication must not produce an automated heavy-load prescription.

**FR-053** The result must show status, score or band, reason, proposed action, uncertainty, and safety boundary.

**FR-054** The readiness method and version must be stored with the result.

### 8.7 Recommendations and overrides

**FR-060** A recommendation must display the original plan and proposed change side by side.

**FR-061** The athlete or authorized coach must explicitly accept, reject, or modify a material recommendation.

**FR-062** Overrides must preserve actor, timestamp, reason when required, and before/after values.

**FR-063** Coach policy may disable or constrain automated adjustments per athlete.

**FR-064** The system must never describe readiness output as diagnosis or treatment.

### 8.8 Session logging

**FR-070** The athlete must log actual load, reps, and RPE for a working set.

**FR-071** Common planned values should be prefilled and editable.

**FR-072** Users must be able to edit or delete their own recent log entries with auditability.

**FR-073** The session must show progress, next exercise, and completion state.

**FR-074** Session completion must summarize plan adherence, adjustments, volume, and subjective outcome.

### 8.9 Coach review

**FR-080** A coach must see assigned, started, completed, and missed sessions.

**FR-081** The coach must see planned versus completed work and accepted/overridden recommendations.

**FR-082** The system should surface attention-required items using transparent rules.

**FR-083** The coach may add feedback tied to a session.

### 8.10 Feedback and research

**FR-090** The existing anonymous tester-ID feedback flow must remain available during the pilot.

**FR-091** Product feedback data must remain logically separate from operational training records.

**FR-092** Research exports must minimize personal data and record export purpose.

## 9. Core workflows

### Athlete session workflow

1. Open BASE and see today's assigned session.
2. Review session purpose and planned work.
3. Complete optional or required readiness check.
4. Review the recommendation and rationale.
5. Accept, reject, or modify the proposal.
6. Start the session and log working sets.
7. Complete the session and add short outcome feedback.
8. See what was shared with the coach.

### Coach workflow

1. Create or duplicate a session.
2. Assign and publish it to an athlete.
3. Set readiness/adjustment permissions.
4. Monitor completion and exceptions.
5. Review planned versus completed work.
6. Comment or adjust upcoming training.

## 10. Readiness policy for MVP

The prototype formula is a provisional heuristic, not a validated medical or performance model. Production MVP must version the policy and support domain review.

Initial behavior:

- **Pain indicated:** stop automated heavy-load adjustment; show a neutral safety route and preserve human choice.
- **Green:** recommend following the plan.
- **Amber:** propose a bounded, coach-configurable reduction or quality-focused alternative.
- **Red without pain:** recommend stopping or substantially modifying the planned intensity according to an approved rule.

The user must see why the band was assigned. BASE must not infer injury or readiness from unavailable data.

## 11. Data and analytics requirements

The product must record events for onboarding, plan publication, session view/start/completion, readiness completion, recommendation display, accept/reject/modify, set creation/edit, coach review, and feedback submission.

Each event requires a stable name, timestamp, pseudonymous actor, relevant entity ID, product version, and minimal properties needed for analysis. Sensitive free text must not be copied into analytics.

Metric definitions must live in documentation before dashboards are treated as authoritative.

## 12. Privacy, safety, and permissions

- Access must be deny-by-default and relationship-scoped.
- Training and readiness data must be treated as sensitive personal data even when not legally classified as medical data.
- The product must support data export, account deletion, and relationship revocation.
- Retention periods must be documented before production launch.
- Security-relevant and consequential recommendation actions require audit history.
- User-facing language must distinguish training support from medical advice.

## 13. Non-functional requirements

| Area | Requirement |
|---|---|
| Availability | Pilot target ≥ 99.5% monthly, excluding announced maintenance |
| Performance | Initial mobile view usable within 2.5 seconds on a typical 4G connection |
| Logging | Confirmed set saves must be durable and visibly acknowledged |
| Accessibility | WCAG 2.2 AA target for core workflows |
| Localization | Danish first; strings structured for later localization |
| Security | OWASP-aligned controls, secure sessions, rate limiting, auditability |
| Observability | Structured errors, request correlation, critical-flow monitoring |
| Compatibility | Current major mobile Safari and Chrome; responsive desktop coach view |

## 14. Release gates

### Prototype gate

Current clickable flow, persisted feedback, and qualitative test process.

### Pilot MVP gate

Authentication, persistent plans/sessions/sets/readiness, coach relationship and review, authorization, audit history, backups, monitoring, and verified migration path.

### Paid beta gate

Demonstrated week-4 retention, acceptable trust scores, support process, billing, data rights workflow, incident response, and published terms/privacy materials.

## 15. Dependencies

- Qualified weightlifting coach/domain reviewer.
- Privacy and legal review before paid launch.
- Authentication provider and email delivery decision.
- D1 data model and migration strategy.
- Product analytics with a documented event taxonomy.
- Reliable deployment, backup, and recovery processes.

## 16. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Users treat readiness as medical advice | Explicit boundaries, pain routing, domain review, conservative wording |
| Logging creates friction | Prefill, fast controls, measure interaction time, allow later correction |
| Coaches fear loss of control | Coach policy, transparent sources, overrides, full history |
| Small pilot creates false confidence | Label evidence quality and avoid statistical claims |
| Scope expands before retention | Enforce release gates and non-goals |
| Sensitive data is over-collected | Data minimization, retention schedule, access controls |

## 17. Open product decisions

- Whether athletes may have multiple active coaches in MVP.
- Whether readiness is optional, coach-required, or athlete-configurable.
- Exact bounded adjustment rules and qualified approver.
- Whether self-coached athletes enter the first paid cohort.
- Minimum useful coach dashboard scope.
- Data retention and deletion timelines.
- Initial pricing and entitlement boundaries.

## 18. Acceptance criteria

The PRD is ready for approval when every MVP requirement has an owner and validation method, readiness rules have a qualified review path, analytics definitions are agreed, privacy and permission boundaries are testable, and non-goals prevent expansion before core-loop evidence exists.

## 19. Approval record

| Role | Approver | Decision | Date |
|---|---|---|---|
| Founder / product owner | Pending | Pending | Pending |
| Technical owner | Pending | Pending | Pending |
| Domain reviewer | Pending | Pending | Pending |

## 20. Change log

| Version | Date | Status | Summary |
|---|---|---|---|
| 0.1 | 2026-08-03 | Draft | Initial PRD grounded in the current BASE prototype and pilot goals. |
