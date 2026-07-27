---
name: ingest-newsletters
description: Track V content ingest — script-fetch the Greenpoint source roster, diff against last run, parse only changed sources into schema-valid draft cards (subagent fan-out), present a review diff for approval, then geocode, test, commit, and deploy. Use when Batu says "run the ingest", "refresh the map", "weekly refresh", "daily refresh", or /ingest-newsletters.
---

# Ingest → Greenpoint Life Map

Turn the week's Greenpoint sources into reviewed, sourced cards on the live map at the site root (`/` — formerly `/july.html`, which now redirects). **Nothing ships unreviewed; nothing is invented.**

## Cost architecture (2026-07-25 redesign — read before running)

The old agent-driven roster sweep cost ~$41/run because every scraped page and the full cards JSON sat in one growing context (cache-read was 68% of the bill). The redesign:

- **Scripts do the deterministic work** (fetch/diff, expiry, card index) — near-zero tokens.
- **Page text never enters the orchestrator context.** Changed sources are parsed by extraction subagents that Read the snapshot files themselves and return compact draft-card JSON.
- **Never Read `cards.json` into context.** Dedupe and cross-link against `npm run ingest:index` (~6k tokens). Read individual cards only when editing them (Grep for the id, Edit surgically).
- **Model tiering:** orchestrator = Opus. Extraction subagents = `model: "sonnet"` (spec-constrained schema work). Never Fable for scheduled runs.

## Files

- Cards: `src/data/demand-test/cards.json` (schema: `src/demand-test/cardSchema.js`) — do not bulk-read; see above
  - **Renamed 2026-07-27** from `july-2026-cards.json` (de-July, launch item L6). The feed is month-agnostic — it is the live deck, not a July edition. If a run finds the old filename anywhere (a stale doc, a cached command, an `ingest/*` branch opened before the rename), update the reference rather than recreating the old file. The test file is still named `julyCards.test.mjs` and the CSS classes are still `.july-*` — those are internal identifiers, deliberately left alone.
- Web-source roster: `src/data/demand-test/ingest-sources.json` (URLs, fetch method, per-source notes — the machine half of this skill)
- Ledger: `src/data/demand-test/ingest-ledger.json` — `lastRunAt`, `processedItems`, `senderRegistry`
- Scripts: `npm run ingest:fetch` (snapshot + diff roster → `.ingest-cache/changes.json`), `npm run ingest:expire` (expiry hygiene), `npm run ingest:index` (compact card index), `node scripts/geocode-demand-cards.mjs` (Nominatim, caches to `geocode-cache.json`)
- Snapshots/diffs: `.ingest-cache/` (gitignored) — `<id>.txt` latest text, `<id>.ingested.txt` last-ingested baseline, `<id>.diff.txt` lines added vs that baseline. Statuses in `changes.json` are relative to the last *ingested* baseline, so content stays "changed" until a run actually reviews it — daily fetches can't erode a diff.

## Run modes

- **Full** (Monday, or on demand before an invite wave): all steps below, including Gmail and the monthly roster-discovery sweep when due.
- **Daily thin**: steps 0–1 with web sources only + Gmail quick pass; if `changes.json` shows nothing changed and expiry deleted nothing, report "no changes" and stop — that run should cost cents.
- **Wednesday Greenpointers pull**: scoped mini-ingest of just the new roundup (it publishes Wednesdays and is the neighborhood's most-read source — never wait for Monday). Same review gate and ship steps. If the roundup URL is already in `processedItems`, say so and stop.

## The loop

### 0. Scripts first (no model judgment needed)

1. `npm run ingest:expire` — deletes past events and dated deals, prunes dangling `relatedCardIds` (auto-delete is pre-approved, Batu 2026-07-16). Capture its report: the printed contract counts feed step 5, and any FLAGGED recurring deal joins the re-verify queue.
2. `npm run ingest:fetch` — snapshots every roster source and writes `.ingest-cache/changes.json`. First Monday of the month: add `--include-monthly`.
3. Read `changes.json` (the report only — not the snapshots). Sources with status `unchanged` are DONE — do not open them, do not "double-check" them. Sources with `error` go on the Browser-pane list for step 1.

### 1. Gather

- **Changed web sources** → extraction subagents (step 1a). `new` status (first-ever snapshot) = treat the full text as the diff.
- **Errored sources** → check them yourself in the Browser pane (the roster notes in `ingest-sources.json` carry per-site instructions — e.g. the Greenpoint Library discover-catalog sweep, the Trash Club's rotating IG meetup spot).
- **Gmail** (connector): search threads from each `senderRegistry` sender (`from:<match> newer_than:Xd`), plus a discovery pass (`{greenpoint "manhattan ave" "franklin st"} newer_than:Xd`) for senders not yet in the registry. New plausible senders → propose adding to the registry in the review step. If the Gmail connector errors with a permissions message, tell Batu to reconnect it with read access and continue with web sources only.
- **Greenpointers**: a front-page diff surfaces the new roundup URL — verify items at the post itself (Browser pane; the site blocks WebFetch). Apply the Williamsburg-address gate per item.
- **Coverage-scan reports** (`docs/launch/coverage-scans/`): if a report newer than the ledger's `lastRunAt` exists, its MISSING list is a pre-built work queue — verify each item at the organizer's page. (The scheduled scan is being retired as the fetch-diff loop covers it; treat any remaining reports as input, not as a required step.)
- **Roster discovery sweep** (monthly, first Monday run of the month): scan the last 4–6 weeks of Greenpointers "new business"/"now open" posts for venues with a public events page; cross-check newly added Gmail senders for companion website calendars; spot-check Google Maps "new" listings + geotagged Greenpoint IG for storefronts opened in the last ~90 days. Any hit → propose adding to `ingest-sources.json` in the review gate, same treatment as a new Gmail sender.
- Skip anything whose Gmail message ID / URL is already in `processedItems`.

**Hard gates (unchanged):**
- **Aggregator claims rule**: events cited only by aggregators/AI answers (allevents.in, Moviefone, dead Eventbrite links) are NOT sources — verify at the organizer's own page or skip with a ledger note (precedents: Self Love Journaling 404, phantom Film Noir 9pm show).
- **Locally-owned hard gate** (Batu, 2026-07-16): only locally owned small businesses & venues get cards. Corporate-operated venues are skipped entirely — check site footers/careers pages for operator identity (precedents: Warsaw removed, Live Nation-operated; PRESS dropped, multi-location). Community institutions (library, parks, Town Square, Trash Club) are exempt — they're the free/family backbone of the feed.
- **Senders worth subscribing to** (Batu action, then add to registry): Flower Cat, Dandelion Wine (tastings are newsletter-only), Archestratus, Hide & Seek.

### 1a. Extraction fan-out (changed sources)

For each `changed`/`new` source, spawn an extraction subagent — batch all of them in ONE message so they run in parallel; `model: "sonnet"`. Prompt template (fill the ⟨⟩):

> Read ⟨textPath⟩ (full snapshot of ⟨name⟩, ⟨url⟩) and ⟨diffPath⟩ (lines added since last ingest — your focus; ignore removed/boilerplate noise). Source notes: ⟨notes from ingest-sources.json⟩. Today is ⟨date⟩; we card events/offers from today through ⟨+10 days⟩.
> Extract ONLY facts stated in the text: happenings with a date (events), time-bound offers (deals), standing offers, memberships/clubs, closures/openings/news. Never invent dates, times, prices, venues, free-ness, or active status; mark `free: true` only where the text says free. Skip anything at a non-Greenpoint address (report it in `skipped` with the address). Skip recurring municipal rec classes (pool lessons, Shape Up NYC).
> Return raw JSON only: `{"items": [{"title", "kind": "event|deal|news|subscription", "startsAt", "endsAt", "venue", "address", "price", "free", "url", "quote": "<the source line(s) verbatim>", "notes"}], "skipped": [{"title", "reason"}], "nothing": false}`. ISO datetimes with -04:00; unknown end time → same-day 23:59. If the diff has no on-concept items, return `{"nothing": true}`.

The subagent returns data, not cards — the orchestrator does the judgment: dedupe against `npm run ingest:index`, apply the gates above, author the card (schema fields, kicker, filters, copy rules), and cross-link.

### 2. Parse into draft cards — truth rules (hard)

- Only facts **stated in the source**. Never invent dates, times, prices, venues, free-ness, or active status. `free: true` only when the source says free.
- Every card carries `sourceLinks` with `publisher` (+ URL, date). Newsletter-derived cards cite the business/org as publisher.
- Categories: happenings → `event` (needs `startsAt`+`endsAt`; unknown end time → same-day `23:59` sentinel); time-bound offers → `discount` with real `endsAt`; standing offers/happy hours → `discount` with `recurring: true` and `endsAt` = end of the edition week (verified-through, re-checked next run); neighborhood/civic items → `news` (publisher required); recurring clubs/memberships → `subscription`.
- **Lens rules (Batu, 2026-07-26):** `shopping` is retired as a lens — sales/offers at shops go to `deals_memberships`; store openings go to `news` (+`family_kids` etc. as honest). **`live_music` = dated gigs or documented ongoing programming, never bare place cards** — do NOT author an undated venue card when the venue's program is already on the map as dated gig cards (that duplication is what got Troost/Good Room/Eavesdrop/Hide & Seek venue cards deleted). A gig card missing `startsAt` shows on every prior day's Today lens; a repo test now fails on it.
- Geography: Greenpoint only (bbox in `cardSchema.js`). Williamsburg-proper items are skipped — note them in the run summary, don't map them. **Exception (Batu, 2026-07-22, Newtown Creek CAG precedent): Greenpoint-related civic events held nearby (e.g. just across the creek in LIC) ship as `civic_action` pinned at their exact real location** — the subject matter, not the address, is the gate for civic items.
- Copy rules: `kicker` ≤ 44 chars, glanceable; summary must not restate the when-line's date/time; spell out "Shop Small Greenpoint" (never "SSG"); all UI stays II-C palette (no code changes needed for content).
- Cross-link: if a card is at/with a business already on the map, add reciprocal `relatedCardIds` (the index shows which venue cards exist).
- Conflicting sources (e.g. two articles disagree on a date): prefer the dedicated article over a roundup line, note the conflict, set `trustRisk: "medium"`.
- Re-verify any recurring deal the expiry script FLAGGED (past its verified-through date): confirm at the source and bump `endsAt`, or delete.

### 3. Review gate (Batu approves — this IS the approval queue)

Present one compact diff: **adds** (id, title, category, when, source), **updates**, **deletes** (the expiry script's, plus any judgment deletes), **skips** (with reasons), and proposed sender-registry / source-roster additions. Wait for approval; apply edits Batu asks for. Nothing proceeds without a yes. (Daily thin runs with zero adds/updates need no gate — report and stop.)

### 4. Ship

1. Apply approved changes to the JSON; bump `version` to today; set `updatedAt` on touched cards. Edit surgically — never rewrite the whole file from context.
2. `node scripts/geocode-demand-cards.mjs` — every new card must resolve inside the bbox (widen `geocodeQuery` to the venue/park name if a street query misses).
3. Update `julyCards.test.mjs` contract counts (the expiry script printed the post-expiry baseline; adjust for adds) and the refresh-discipline date; `npm test` must pass.
4. Update the ledger: `lastRunAt`, append `processedItems` entries with outcomes. Then `npm run ingest:fetch -- --mark-ingested` to promote the reviewed snapshots to baselines (include sources whose extraction found nothing — they were reviewed too; a run that stopped before the review gate must NOT mark).
5. Commit (`content(track-v): <cadence> refresh — <summary>`), deploy to Vercel prod, and spot-check the live page (pins render, no expired deals, new cards open).

## Cadence

- **Daily thin run** (scheduled): scripts + changed-source extraction + Gmail quick pass. Most days this is a no-op costing cents; late announcers (Flower Cat, Trash Club's weekly spot) get caught same-day.
- **Monday full run**: everything, incl. monthly discovery sweep on the first Monday.
- **Wednesday Greenpointers pull** (scheduled, Wed 1pm): the roundup publishes Wednesdays; a 5-day lag to Monday means readers see it there first. If the roundup isn't live yet at run time, say so — Batu re-triggers later.
- The Thursday coverage scan is retired once the daily loop is live (its gap-catching is what the fetch-diff does every day); a monthly audit-style scan can replace it if gaps reappear. The former Sunday 6pm scan stays retired.
