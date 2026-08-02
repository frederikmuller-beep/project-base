# Garmin readiness groundwork

Status: technical foundation only. Nothing in this document or branch is connected to the public BASE test.

## Product decision

BASE uses Garmin first and keeps the internal contract provider-neutral so Apple HealthKit can be added later. The first supported discovery device is Garmin Instinct 2X.

The daily input is deliberately small:

- sleep duration;
- sleep quality score and its source;
- resting heart rate;
- HRV value plus metric type when available;
- Garmin HRV status when a raw value is unavailable;
- whether the athlete wore the device overnight.

BASE compares each athlete with their own history. It does not compare raw HRV values across providers because Apple exposes SDNN while a Garmin feed may use another representation.

## Seven-day status

The latest seven local calendar days are ordered chronologically. At least four complete nights are required. With fewer nights, BASE returns `insufficient_data`.

For the discovery version, the first and last three valid observations are compared:

- sleep score: a difference below 5 points is stable;
- resting heart rate: a difference below 2 bpm is stable, and lower is better;
- raw HRV: a relative difference below 8% is stable;
- categorical HRV: recent `balanced` readings are stable; `unbalanced`, `low`, or `poor` are declining.

The combined status is down only when at least two available signals decline. It is up only when at least two improve. Otherwise it is stable. These thresholds are product hypotheses and must be validated with more athletes before production use.

## Readiness safety rules

The wearable status supplements the existing athlete check-in; it does not replace it.

1. Pain always returns red and pauses heavy lifting.
2. A low subjective score or two declining wearable signals returns amber.
3. Declining sleep alone does not reduce the load when HRV and resting heart rate are stable.
4. The athlete and coach can always override an automated suggestion.
5. BASE describes fitness support, not diagnosis or medical advice.

The numeric score remains based on the existing subjective check-in until the wearable weighting has been validated. This avoids presenting an unvalidated composite number as precision.

## Integration boundary

Historical readiness data will eventually arrive through the [Garmin Health API](https://developer.garmin.com/gc-developer-program/health-api/) after explicit consent and device sync. The adapter should map the approved Garmin payload to `DailyWearableMetrics` and discard unneeded source fields.

No token, external account identifier, or raw provider payload belongs in the daily metrics table. Revoking consent must stop imports and delete the connection's daily metrics through the database cascade after any required confirmation flow.

## Live pulse and rest timer contract

Live workout behavior is a separate future Connect IQ component. It must not depend on the historical nightly sync.

Expected events:

| Event | Required fields | Purpose |
| --- | --- | --- |
| `set_completed` | session, exercise, set, timestamp | Starts the programmed minimum rest |
| `rest_tick` | elapsed seconds, current heart rate if available | Updates the watch and BASE session |
| `rest_target_reached` | target seconds, timestamp | Triggers vibration and marks the athlete eligible to continue |
| `rest_extended` | added seconds, actor | Records an athlete or coach override |
| `next_set_started` | timestamp | Ends the rest interval |

Pulse is advisory. The programmed minimum rest expires on time even if the sensor is missing, and the athlete can continue or extend the rest manually.

## Work intentionally deferred

- Garmin Health commercial approval and credentials;
- production consent and deletion screens;
- real health-data ingestion;
- Connect IQ watch application;
- public deployment;
- Apple HealthKit adapter.

The next decision gate is evidence that wearable data changes a coaching decision or that more test athletes use a compatible Garmin device.
