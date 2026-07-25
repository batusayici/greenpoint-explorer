---
name: ingest-newsletters
description: Weekly Track V content ingest — read Greenpoint business/org newsletters from Batu's Gmail (plus the Greenpointers roundup on the web), parse them into schema-valid draft cards, present a review diff for approval, then geocode, test, commit, and deploy. Use when Batu says "run the ingest", "refresh the map", "weekly refresh", or /ingest-newsletters.
---

# Ingest Newsletters → July-in-Greenpoint Map

Turn the week's Greenpoint newsletters into reviewed, sourced cards on the live map at the site root (`/` — formerly `/july.html`, which now redirects). **Nothing ships unreviewed; nothing is invented.**

## Files

- Cards: `src/data/demand-test/july-2026-cards.json` (schema: `src/demand-test/cardSchema.js`)
- Ledger: `src/data/demand-test/ingest-ledger.json` — `lastRunAt`, `processedItems`, `senderRegistry`
- Geocoder: `scripts/geocode-demand-cards.mjs` (Nominatim, caches to `geocode-cache.json`)

## The loop

### 1. Gather (since ledger.lastRunAt)

- **Coverage-scan report first** (2026-07-21): read the newest report in `docs/launch/coverage-scans/` (written by the scheduled `greenpoint-coverage-scan-sunday` / `-thursday` tasks — external sweep diffed against live cards). Its MISSING list is a pre-built work queue: verify each item at the organizer's page and carry it into the draft cards; its stale/wrong list feeds expiry hygiene; its new-source candidates feed the registry/roster proposals. The internal target the scans measure is **100% coverage of on-concept local events and openings** — report the current coverage score in the review diff.
- **Gmail** (connector): search threads from each `senderRegistry` sender (`from:<match> newer_than:Xd`), plus a discovery pass (`{greenpoint "manhattan ave" "franklin st"} newer_than:Xd`) for senders not yet in the registry. New plausible senders → propose adding to the registry in the review step. If the Gmail connector errors with a permissions message, tell Batu to reconnect it with read access and continue with web sources only.
- **Web**: the newest Greenpointers "What's Happening" weekly roundup (greenpointers.com blocks WebFetch — use the Browser tools), plus re-verification of any `recurring` deal whose `endsAt` (verified-through date) has passed. **Greenpointers publishes the roundup on Wednesdays** (confirmed Jul 15 + Jul 22, 2026) — it must NOT wait for the Monday run; the `greenpointers-wednesday-pull` scheduled task ingests it same-day (scoped mini-ingest, same review gate). The Monday run then only re-checks it for corrections/additions.
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
  - Brooklyn Craft Company — brooklyncraftcompany.com/collections/all-workshops (165 Greenpoint Ave; workshop calendar, sells out fast — note availability)
  - Yaro Studios — yarostudios.com/workshops-1 (76 Kent St; ceramics/fiber/print classes) + yarostudios.com/kidsclayclasses (kids-lens events)
  - PLAY Kids Greenpoint — playgreenpoint.com/calendar (33 Nassau Ave; classes/camps/parties — use the calendar, not the newsletter form, which is unreliable/hidden on-site)
  - Last Place on Earth — lastplacebk.com (531 Graham Ave; board game cafe — game nights, murder mysteries, comedy, Pilates; has newsletter signup)
  - The Carcosa Club — carcosaclub.com/events (982 Manhattan Ave; nonprofit member-run tabletop/miniatures wargaming club — Warhammer 40K, Malifaux, Blood Bowl, etc.; membership is waitlist-only but $15/day guest passes + public events exist; no newsletter found, Discord is their primary channel; ignore stale aggregator listings at a Williamsburg address — that location closed, this Greenpoint one is current)
  - The Little Dance School — thelittledanceschool.com/greenpoint (106 Calyer St, inside Triskelion/Muriel Theatre; kids dance, live Fall 2026–Spring 2027 schedule; licenses its curriculum from Petite Performers Ltd (UK) but is independently owned/operated locally — not a chain)
  - The Dance Space NY — dancewithellyshepley.com/thedancespaceny/studiodates (61 Greenpoint Ave, Suite 212/515; ballet/jazz/tap/hip-hop, kids + adult; owner Elly Shepley; site also directs to Instagram @thedancespaceny for live updates)
  - Black Rabbit — blackrabbitbar.com/blackrabbit/event/ (91 Greenpoint Ave; Tue "Nerd Alert!" trivia since 2008, Sun Buckaroo Bingo)
  - The Brew Inn — nyctrivialeague.com/listings/brew-inn-brooklyn/ (924 Manhattan Ave; Wed trivia — the venue's own domain thebrewinnnyc.com is squatted/redirects to an unrelated site, use the trivia-league listing instead)
  - Sunshine Laundromat & Pinball — sunshinelaundromat.com (860 Manhattan Ave; pinball/arcade bar, "Our Events" section; has newsletter signup)
  - Hana Makgeolli — hanamakgeolli.com/events + hanamakgeolli.com/soolschool (201 Dupont St; rice-wine/makgeolli producer — tours, tastings, classes; has newsletter signup)
  - Greenhook Ginsmiths — greenhookgin.com (208 Dupont St; gin distillery; no calendar found — check newsletter, footer "Subscribe to our emails")
  - Heaven & Earth — heavenandearthbk.com/events (290 Nassau Ave; natural wine bar; has newsletter signup)
  - Bin Bin Sake — binbinsake.com/pages/book-a-sake-tasting (29 Norman Ave; sake/natural-wine retail + bookable tastings; has newsletter signup)
  - Kettl Tea — kettl.co/collections/class (70 Greenpoint Ave; tea house — tastings/classes; has newsletter signup)
  - Bellocq Tea Atelier — bellocqtea.com/collections/tea-tastings-nyc (104 West St; tea atelier — Tasting Sessions; has newsletter signup)
  - Triskelion Arts — triskelionarts.org/availability-calendar (106 Calyer St; nonprofit dance rehearsal/performance venue + classes; has newsletter signup)
  - Brooklyn Youth Ballet — bkyouthballet.com/calendar/ (37 Greenpoint Ave, Suite 106; ballet studio, kids + adult programs)
  - Moon Bunny Aerial — moonbunnyaerial.com (394 McGuinness Blvd #208; aerial/circus/dance studio; booking calendar via feather.rsvp)
  - SPARŚA Greenpoint — sparsabrooklyn.union.site (1006 Manhattan Ave; yoga studio with meditation programming — Sound Meditations, workshops; has newsletter signup at sparsabrooklyn.com/newsletter)
  - Acme Smoked Fish — acmesmokedfish.com/collections/fish-friday (30 Gem St; Fish Friday pickup every Friday 8am–1pm, pre-orders close Fri 11:30am — re-pin the weekly event card each run; watch for closure weeks like 7/3)
  - Dashi Okume — okume.us/blogs/classes-event (50 Norman Ave complex; classes/pop-ups page was stale as of 2026-07-22 — check monthly, not weekly)
- **Community-institution roster** (2026-07-16, the ChatGPT-gap check): not businesses, so the locally-owned gate doesn't apply — these are the free/family backbone of the feed:
  - Greenpoint Library — bklynlibrary.org/locations/greenpoint (rich weekly calendar; group into per-day cards, don't flood)
  - Go Green Brooklyn — gogreenbk.org (Friends of Transmitter Park classes, Movies Under the Stars, It's My Park days)
  - Town Square BK — townsquarebk.org (501c3 since 2004; SummerStarz free Friday movies at Transmitter Park through Aug 21, scouts programs — check the events page weekly in season)
  - Greenpoint Trash Club — instagram.com/greenpointtrashclub + greenpointtrashclub.org (501c3; cleanup every Wednesday 7:30pm from a ROTATING bar meetup — the week's IG post names the spot; update the `greenpoint-trash-club` card's pin/locationName + week window each run)
  - BPL North Brooklyn environmental community calendar — bklynlibrary.org/north-brooklyn-community-calendar (community meetings, garden hours, Newtown Creek CAG; 403s plain fetches — Browser pane; mostly overlaps the branch calendar, scan for non-library civic items)
  - NYC Parks (Greenpoint-filtered) — nycgovparks.org/events, filtered to "in or near Greenpoint", PLUS the four per-park event pages checked directly every run (the citywide filter can lag or miss park-page listings; all four URLs verified 2026-07-22): Msgr. McGolrick Park (`nycgovparks.org/parks/msgr-mcgolrick-park/events`) · McCarren Park (`nycgovparks.org/parks/mccarren-park/events`) · WNYC Transmitter Park (`nycgovparks.org/parks/transmitter-park/events`) · Newtown Barge Playground (`nycgovparks.org/parks/newtown-barge-playground/events`). nycgovparks.org returns 403 to plain fetches (curl/WebFetch) — use the Browser pane, same as Greenpointers. Batu's Gmail also carries the NYC Parks "Weekly Highlights" newsletter set to the Greenpoint neighborhood (subscribed 2026-07-21) — once a first email lands, add its sender to `senderRegistry` and treat the site as the fallback, not the primary check.
    - **Skip standing municipal rec programming (2026-07-23, the McCarren pool lesson):** the park event pages are dominated by recurring NYC Parks recreation classes — McCarren Pool learn-to-swim sessions, lap swim, Shape Up NYC fitness (belly dance, bodyweight intervals) — which repeat all season at fixed times. These are **not** feed items and are **not** coverage gaps: they'd flood the map, they don't change week to week, and a resident who wants them goes to the rec center. Card the **one-off** park happenings instead (Summer Makers Terrace, City of Water Day, It's My Park, SummerStarz). Coverage scans should not re-flag the recurring classes as misses.
- **Roster discovery sweep** (2026-07-21, closes the gap Gmail already has and the web roster didn't): the Gmail side self-discovers new senders every run via the broad search query; the web roster only grows when someone notices a venue by hand. Run this sweep monthly (first Monday run of the month, not every week):
  - Scan the last 4–6 weeks of Greenpointers posts tagged "new business"/"now open" for venues with a public events/calendar page.
  - Cross-check any senders newly added to `senderRegistry` for a companion website calendar the newsletter doesn't fully cover (newsletters and calendars often diverge — see Brooklyn Craft Company/Yaro precedent).
  - Spot-check Google Maps "new" listings + geotagged Greenpoint Instagram posts for storefronts opened in the last ~90 days.
  - Any hit → propose the roster addition in the review gate, same treatment as a new Gmail sender proposal.
- **Aggregator claims rule**: events cited only by aggregators/AI answers (allevents.in, Moviefone, dead Eventbrite links) are NOT sources — verify at the organizer's own page or skip with a ledger note (precedents: Self Love Journaling 404, phantom Film Noir 9pm show).
- **Locally-owned hard gate** (Batu, 2026-07-16): only locally owned small businesses & venues get cards. Corporate-operated venues are skipped entirely — check site footers/careers pages for operator identity (precedent: Warsaw removed, Live Nation-operated; PRESS dropped, multi-location).
- **Senders worth subscribing to** (Batu action, then add to registry): Flower Cat, Dandelion Wine (tastings are newsletter-only), Archestratus, Hide & Seek.
- Skip anything whose Gmail message ID / URL is already in `processedItems`.

### 2. Parse into draft cards — truth rules (hard)

- Only facts **stated in the source**. Never invent dates, times, prices, venues, free-ness, or active status. `free: true` only when the source says free.
- Every card carries `sourceLinks` with `publisher` (+ URL, date). Newsletter-derived cards cite the business/org as publisher.
- Categories: happenings → `event` (needs `startsAt`+`endsAt`; unknown end time → same-day `23:59` sentinel); time-bound offers → `discount` with real `endsAt`; standing offers/happy hours → `discount` with `recurring: true` and `endsAt` = end of the edition week (verified-through, re-checked next run); neighborhood/civic items → `news` (publisher required); recurring clubs/memberships → `subscription`.
- Filters (2026-07-25 IA re-cut — lenses are a person's question, not a content taxonomy): author from `FILTER_IDS` in `cardSchema.js` (`new`, `food_drink`, `shopping`, `arts_culture`, `family_kids`, `live_music`, `wellness`, `deals_memberships`, `news`). There is no `events` umbrella — the day-grouped All feed is that answer. `wellness` = movement/mind-body (yoga, pilates, dance, run clubs); civic sits inside `news`; deals AND subscriptions both go to `deals_memberships`. A one-off with no honest lens gets an **empty** `filters: []` (All-only) — never force-fit; if All-only cards cluster (see the lens-less guard test in `julyCards.test.mjs`), flag the cluster as a candidate lens in the review diff. Retired ids (`events`, `services`, `deals`, `clubs_signups`, `g_train`) must never reappear — a guard test enforces this.
- Geography: Greenpoint only (bbox in `cardSchema.js`). Williamsburg-proper items are skipped — note them in the run summary, don't map them. **Exception (Batu, 2026-07-22, Newtown Creek CAG precedent): Greenpoint-related civic events held nearby (e.g. just across the creek in LIC) ship as `civic_action` pinned at their exact real location** — the subject matter, not the address, is the gate for civic items.
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

Weekly, Monday morning (a scheduled reminder exists). Also run on demand before sending any new invite wave. The **roster discovery sweep** runs monthly, folded into the first Monday run of the month. One scheduled **coverage scan** (Thu 9am, deliberately after the Wednesday Greenpointers pull — 2026-07-22 decision) writes a gap report to `docs/launch/coverage-scans/`: weekend-urgent gaps first (Batu may trigger an off-cycle mini-ingest), and the full-week diff feeds the following Monday's ingest. The former Sunday 6pm scan is **paused**; it re-enables only if Thursday reports repeatedly flag early-week gaps a Sunday run would have caught (the report's "learned" section tracks this).

**Wednesday Greenpointers pull** (2026-07-22): Greenpointers publishes their "What's Happening" weekly roundup on Wednesdays, and it's the neighborhood's most-read source — a 5-day lag to Monday means readers see it there first. The `greenpointers-wednesday-pull` scheduled task (Wed 1pm) runs a **scoped mini-ingest**: just the new roundup (plus dedupe against live cards), through the same review gate and ship steps. If the roundup isn't live yet at run time, it says so and Batu re-triggers later.
