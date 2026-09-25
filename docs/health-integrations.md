# Fremtidige sundhedsintegrationer

BASE har et leverandørneutralt datalag til Apple Health og Garmin. Ingen ekstern forbindelse er aktiveret i testperioden; det manuelle readiness-tjek fungerer uændret.

## Fælles dataformat

Begge integrationer skal omsætte kildedata til én daglig post med:

- dato og datakilde
- søvnvarighed i minutter
- søvnscore, når kilden stiller den til rådighed
- hvilepuls i bpm
- HRV i millisekunder samt målemetode
- tidspunktet hvor kilden sidst opdaterede data

Rå Apple- eller Garmin-payloads gemmes ikke i den fælles tabel. Det begrænser mængden af følsomme data og holder resten af BASE uafhængig af leverandørernes formater.

## Tilkoblingspunkter

- Apple Health: En fremtidig iOS-ledsagerapp læser HealthKit lokalt efter brugerens samtykke og sender kun normaliserede dagsmålinger til en særskilt, autentificeret ingest-endpoint.
- Garmin: En fremtidig serveradapter håndterer Garmins godkendelsesflow og webhooks/pull, normaliserer data og skriver dem til samme tabel.
- Frontend: `GET /api/health/summary` leverer seneste måling og en beskrivende 7-dages status. Når der ingen data er, fortsætter BASE med manuel readiness.

## Sikkerhedsgrænser

- Der er bevidst ingen offentlig POST-endpoint til sundhedsdata endnu.
- OAuth-tokens og andre legitimationsoplysninger må ikke gemmes i de normaliserede måletabeller eller i kildekoden.
- Hver integration skal have sin egen server-side autentificering, samtykkelog og slettefunktion før aktivering.
- 7-dages status er deskriptiv og må ikke alene ændre træningsplanen. En særskilt produktbeslutning og validering kræves, før objektive data påvirker readiness-scoren.

## Aktivering senere

1. Opret providerens autentificering og callback/ingest-flow.
2. Validér værdier, enheder, tidszone og målemetode.
3. Upsert forbindelsesstatus i `health_connections`.
4. Upsert normaliserede dagsmålinger i `daily_health_metrics`.
5. Test samtykke, afkobling, sletning, manglende data og dubletter.
6. Vis målingerne i readiness-skærmen og aktivér først påvirkning af anbefalingen efter validering.
