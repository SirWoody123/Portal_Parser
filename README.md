# Portal Parser

Automated pipeline for uploading creative career opportunities to the ERIC portal (meet-eric.com).

## Pipeline

1. **Scraper** (existing) — finds opportunities across ~500 sources → Backlog tab in a Google Sheet
2. **Schedule tab** (existing) — plans which day each opportunity goes live
3. **Queue tab** — daily staging area; opportunities are copied from Schedule → Queue with Status = "To upload" and a Publish Date
4. **`queue-processor.cjs`** — Railway cron job (every 15 min) picks up "To upload" rows, fetches the source URL, calls Claude to extract description/demographics/friendly name, writes the result back to the sheet, and sets Status = "Ready for Review"
5. **Copywriter review app** (TODO) — web app where the copywriter reviews each opportunity, edits it, and publishes
6. **`api-server.cjs`** — Railway API that takes structured opportunity data (JSON or text), maps tags to Firebase IDs, and writes to Firestore

```
Scraper → Backlog → Schedule → Queue tab → queue-processor.cjs → (review app) → api-server.cjs → Firebase → ERIC portal
```

## Key files

- `api-server.cjs` — main Railway server: JSON/text opportunity parsing, Firebase tag mapping, portal upload endpoint
- `queue-processor.cjs` — cron job that polls the Queue tab and runs Claude extraction
- `setup-queue-tab.cjs` — one-time script that sets up the Queue tab headers/dropdowns
- `google_script` — Google Apps Script counterpart for the legacy Apps Script → API integration
- `TEXT_PARSER_README.md` — details on the text-file opportunity format handled by `parseTextFile` in `api-server.cjs`
- `Tags987.csv` — reference copy of the original tag database used to build the tag-ID mapping in `api-server.cjs`
- `mock_opportunities/`, `samples/` — example opportunity payloads for manual testing
- `archive/legacy-patches/` — old patch-era test fixtures and scratch scripts kept for history, not used by any code path

## Infrastructure

- Railway service: `api_bridge` — https://apibridge-production.up.railway.app
- Firebase project: `neweric-744ee`
- Spreadsheet: `1N05E3Tahh9APAA-vysvD3HlP3ChISTgPwao9Te5mW18` (Queue tab, gid=1452876970)

## Setup

```bash
npm install
# create .env with Firebase, Google Sheets, and Anthropic credentials
npm start
```
