---
name: ingest-newsletters
description: Weekly Track V content ingest — read Greenpoint business/org newsletters from Batu's Gmail (plus the Greenpointers roundup on the web), parse them into schema-valid draft cards, present a review diff for approval, then geocode, test, commit, and deploy. Use when Batu says "run the ingest", "refresh the map", "weekly refresh", or /ingest-newsletters.
---

# Ingest Newsletters → July-in-Greenpoint Map

Turn the week's Greenpoint newsletters into reviewed, sourced cards on the live map at `/july.html`. **Nothing ships unreviewed; nothing is invented.**

## Files

- Cards: `src/data/demand-test/july-2026-cards.json` (schema: `src/demand-test/cardSchema.js`)
- Ledger: `src/data/demand-test/ingest-ledger.json` — `lastRunAt`, `processedItems`, `senderRegistry`
- Geocoder: `scripts/geocode-demand-cards.mjs` (Nominatim, caches to `geocode-cache.json`)

## The loop

### 1. Gather (since ledger.lastRunAt)

- **Gmail** (connector): search threads from each `senderRegistry` sender (`from:<match> newer_than:Xd`), plus a discovery pass (`{greenpoint "manhattan ave" "franklin st"} newer_than:Xd`) for senders not yet in the registry. New plausible senders → propose adding to the registry in the review step. If the Gmail connector errors with a permissions message, tell Batu to reconnect it with read access and continue with web sources only.
- **Web**: the newest Greenpointers "What's Happening" weekly roundup (greenpointers.com blocks WebFetch — use the Browser tools), plus re-verification of any `recurring` deal whose `endsAt` (verified-through date) has passed.
- **Business-as-venue roster** (2026-07-16, the Flower Cat lesson): locally owned spots whose event programs never reach newsletters or Greenpointers. Check each published calendar every run for the coming week:
  - Troost — troostny.com/calendar/
  - Eavesdrop — eavesdrop.nyc/calendar
  - Greenpoint Comedy Club — tickets.greenpointcomedyclub.com/b/greenpointcomedyclub/index
  - Film Noir Cinema — filmnoircinema.com (month grid; also watch the "Keep Us Alive" banner)
  - Good Room — donyc.com/venues/good-room (their own site is JS-thin)
  - Archestratus — archestrat.us/pages/events
  - Flower Cat — flowercat.nyc/events (often empty — they announce late; venue card carries the "check their channels" note)
  - Hide & Seek — hideandseek.nyc (recurring program lives in the site marquee: jazz Wed 7pm, DJs Fri/Sat)
  - Scrappleland — scrappleland.com (ScrappleLeague Wednesdays; re-verify season is running)
  - WORD — wordbookstores.com/events (Brooklyn filter)
- **Community-institution roster** (2026-07-16, the ChatGPT-gap check): not businesses, so the locally-owned gate doesn't apply — these are the free/family backbone of the feed:
  - Greenpoint Library — bklynlibrary.org/locations/greenpoint (rich weekly calendar; group into per-day cards, don't flood)
  - Go Green Brooklyn — gogreenbk.org (Friends of Transmitter Park classes, Movies Under the Stars, It's My Park days)
- **Aggregator claims rule**: events cited only by aggregators/AI answers (allevents.in, Moviefone, dead Eventbrite links) are NOT sources — verify at the organizer's own page or skip with a ledger note (precedents: Self Love Journaling 404, phantom Film Noir 9pm show).
- **Locally-owned hard gate** (Batu, 2026-07-16): only locally owned small businesses & venues get cards. Corporate-operated venues are skipped entirely — check site footers/careers pages for operator identity (precedent: Warsaw removed, Live Nation-operated; PRESS dropped, multi-location).
- **Senders worth subscribing to** (Batu action, then add to registry): Flower Cat, Dandelion Wine (tastings are newsletter-only), Archestratus, Hide & Seek.
- Skip anything whose Gmail message ID / URL is already in `processedItems`.

### 2. Parse into draft cards — truth rules (hard)

- Only facts **stated in the source**. Never invent dates, times, prices, venues, free-ness, or active status. `free: true` only when the source says free.
- Every card carries `sourceLinks` with `publisher` (+ URL, date). Newsletter-derived cards cite the business/org as publisher.
- Categories: happenings → `event` (needs `startsAt`+`endsAt`; unknown end time → same-day `23:59` sentinel); time-bound offers → `discount` with real `endsAt`; standing offers/happy hours → `discount` with `recurring: true` and `endsAt` = end of the edition week (verified-through, re-checked next run); neighborhood/civic items → `news` (publisher required); recurring clubs/memberships → `subscription`.
- Geography: Greenpoint only (bbox in `cardSchema.js`). Williamsburg-proper items are skipped — note them in the run summary, don't map them.
- Copy rules: `kicker` ≤ 44 chars, glanceable; summary must not restate the when-line's date/time; spell out "Shop Small Greenpoint" (never "SSG"); all UI stays II-C palette (no code changes needed for content).
- Cross-link: if a card is at/with a business already on the map, add reciprocal `relatedCardIds`.
- Conflicting sources (e.g. two articles disagree on a date): prefer the dedicated article over a roundup line, note the conflict, set `trustRisk: "medium"`.

### 3. Expiry hygiene (auto-delete — no approval needed, Batu 2026-07-16)

- Delete `event` cards with `endsAt` before today.
- Drop or re-verify `discount` cards past their `endsAt` (recurring ones: re-verify against the source; if unverifiable, delete).
- Prune dangling `relatedCardIds` (delete the key if it empties — schema rejects `[]`).

### 4. Review gate (Batu approves — this IS the approval queue)

Present one compact diff: **adds** (id, title, category, when, source), **updates**, **deletes**, **skips** (with reasons), and proposed sender-registry additions. Wait for approval; apply edits Batu asks for. Nothing proceeds without a yes.

### 5. Ship

1. Apply approved changes to the JSON; bump `version` to today; set `updatedAt` on touched cards.
2. `node scripts/geocode-demand-cards.mjs` — every new card must resolve inside the bbox (widen `geocodeQuery` to the venue/park name if a street query misses).
3. Update `julyCards.test.mjs` contract counts (total, per-category, free list, related pairs) to the new reality; `npm test` must pass.
4. Update the ledger: `lastRunAt`, append `processedItems` entries with outcomes.
5. Commit (`content(track-v): weekly refresh — <summary>`), deploy to Vercel prod, and spot-check the live page (pins render, no expired deals, new cards open).

## Cadence

Weekly, Monday morning (a scheduled reminder exists). Also run on demand before sending any new invite wave.
