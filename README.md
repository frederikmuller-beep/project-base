# PROJECT BASE

Interactive prototype for a focused weightlifting training experience. Athletes can review today's session, report readiness, receive an adjusted recommendation, log working sets, and explore the exercise library.

Live prototype: [base-training-prototype.frederikmuller.chatgpt.site](https://base-training-prototype.frederikmuller.chatgpt.site/)

## Current prototype

- Today's weightlifting session and planned volume in kilograms
- Readiness check and training recommendation
- Set-by-set training log
- Exercise library with 13 exercises across 7 categories
- Responsive Danish interface

Prototype data is temporary and is not saved between visits.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run build
npm test
npm run lint
```

## Project structure

- `app/` contains the interface and interaction flow
- `public/` contains static assets
- `tests/` verifies the server-rendered prototype
- `db/` and `worker/` provide the foundation for persisted data
- `.openai/hosting.json` contains the Sites hosting configuration

