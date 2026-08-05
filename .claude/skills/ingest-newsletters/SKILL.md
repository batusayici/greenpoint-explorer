---
name: ingest-newsletters
description: Track V content ingest — script-fetch the Greenpoint source roster, diff against last run, parse only changed sources into schema-valid draft cards (subagent fan-out), then geocode, test, and ship routine updates straight to prod (2026-08-02). Cards are triaged per card: substantiated + mechanically categorized ones ship; unsourced, ambiguous, or conflicting ones are held in a review PR. Roster/sender additions, submissions, and code changes stay human-gated. Use when Batu says "run the ingest", "refresh the map", "weekly refresh", "daily refresh", or /ingest-newsletters.
---

# Ingest → Greenpoint Life Map

Turn the week's Greenpoint sources into sourced cards on the live map at the site root (`/` — formerly `/july.html`, which now redirects). **Nothing is invented. Routine updates ship themselves; doubtful cards are held for review (Batu, 2026-08-02 — DECISION_LOG). Never ship a bad card, and never drop one to avoid reviewing it.**

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
  - **Fetch strategies, cheapest first (2026-08-05).** `feed` = an RSS URL; `json` = an API endpoint, shaped by a `json: { path, fields }` block in the roster entry; `auto` = plain HTTP, falling back to headless Chromium; `browser` = straight to Chromium. **Prefer `feed`/`json` always** — they cost a single plain fetch, usually carry more than the rendered page, and are the only strategies immune to the browser path being down. A `json` source may list `urls` instead of `url` to fetch several endpoints into one snapshot (that is how the Squarespace one-month-at-a-time calendars now cover current **and** next month automatically). URLs may embed `{{now:epoch}}`, `{{now:iso}}` or `{{month:+N}}`, which the script expands at fetch time. **You do not need to hand-edit any of this during a run** — it is roster config, changed only in a reviewed PR.
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

   **A non-zero exit means the roster was not readable — STOP, do not ingest (2026-08-03).** The script exits 1 on **one** condition: errored sources exceeded 15% of those attempted. **A dead browser path is no longer fatal by itself (2026-08-05)** — it prints a `BROWSER PATH DOWN` block and the run continues, because after the feed/json migrations only 6 of 48 sources still need the browser and halting a run that read 39 of 45 sources was a false alarm. Coverage is the thing that matters and the 15% ceiling measures it directly; a failed browser source counts as an error like any other, so a browser outage big enough to matter still trips the ceiling. Read the `BROWSER PREFLIGHT` block when it appears: it names one of `playwright-missing`, `chromium-binary-missing`, `browser-egress-blocked`, `browser-connect-reset`, or `chromium-launch-failed`, each with its fix. **`browser-egress-blocked` is an environment fix Batu must apply** (allowlist outbound HTTPS for the routine at claude.ai/code) — report it and stop; never route around it. **`browser-connect-reset` (added 2026-08-05) is a different failure and needs a different fix — do not conflate them.** The preflight now cross-checks: if plain fetch reaches the control URL through the same proxy but headless Chromium's own CONNECT tunnel to it is refused/reset, that's not a missing allowlist entry (allowlisting a host plain fetch already reaches does nothing) — it's the proxy relay mishandling Chromium's CONNECT specifically. Report the exact symptom to platform support at claude.ai/code and stop; never route around it, and never re-request a host allowlist for this cause.

   Why this is a hard stop: expiry in step 1 deletes regardless, so a degraded run *shrinks* the deck while looking like a quiet week. That is exactly how 95 cards became 75 between 2026-07-27 and 08-03 (`docs/growth/2026-08-03-supply-analysis.md`). If Batu decides to proceed anyway, re-run with `--allow-degraded` — the flag keeps the choice visible in the command — and say so in the PR body.
3. Read `changes.json` (the report only — not the snapshots). Sources with status `unchanged` are DONE — do not open them, do not "double-check" them. Sources with `error` go on the Browser-pane list for step 1.

   Each `changed` source reports **`addedLines` and `removedLines`** (printed as `+A/-R`). They mean different things and neither is noise (2026-08-03):
   - **`+A` > 0** — new items to triage. This is the normal case.
   - **`+0/-R`** — the source *shrank*: items disappeared with nothing added. Usually events passing, sometimes a cancellation or a calendar emptying out (`bpl-north-brooklyn-calendar` dropped 13 in one run). **Check whether a live card depends on something that vanished** rather than skipping it because the diff file is empty — `<id>.diff.txt` only ever holds added lines.
   - **`reorderedOnly: true`** — same line set, different byte order. Nothing happened; treat as unchanged.
4. **Read `watchItems` in the ledger — this is the run's memory of what is already known to be blocked (2026-08-03).** Each entry names an item and the condition that would unblock it. **Do not re-author an item on this list unless its condition is now met**; re-authoring a known-blocked item just to hold it again burns a review cycle every week and teaches nothing. Check the condition, then either promote the item to a real card or leave it. Report the count in the run summary as `N blocked, unchanged` so a stuck queue stays visible instead of going quietly dark.

### 1. Gather

- **Changed web sources** → extraction subagents (step 1a). `new` status (first-ever snapshot) = treat the full text as the diff.
- **Errored sources** → check them yourself in the Browser pane (the roster notes in `ingest-sources.json` carry per-site instructions — e.g. the Trash Club's rotating IG meetup spot). **The Greenpoint Library sweep is no longer one of these (2026-08-05):** the branch calendar now arrives as `json` straight from the events index the discover catalog itself queries, carrying the full forward calendar — do not open the Browser pane for it. **After the 2026-08-05 migration only 6 sources can ever land here** — `play-kids-greenpoint`, `word-bookstore`, `sparsa`, `dance-space-ny`, `greenpoint-comedy-club`, `greenpoint-trash-club` — and each was checked for a plain-fetchable endpoint and provably has none (WebSocket-delivered listings, an Instagram-only schedule, or a bot wall). **Do not re-hunt for their APIs each run**; if one is unreachable, that is the known state, not a new failure.
- **Gmail** (connector): search threads from each `senderRegistry` sender (`from:<match> newer_than:Xd`), plus a discovery pass (`{greenpoint "manhattan ave" "franklin st"} newer_than:Xd`) for senders not yet in the registry. New plausible senders → propose adding to the registry in the review step. If the Gmail connector errors with a permissions message, tell Batu to reconnect it with read access and continue with web sources only.
- **Greenpointers**: read from the **RSS feed** (`greenpointers.com/feed/`, `fetch: "feed"` — switched 2026-08-05 from the browser-only front page). The feed's `content:encoded` carries the **full post body**, so the snapshot already contains the roundup's items with their times, venues and free-ness — extract from it directly. **No Browser-pane visit to the post is needed**; the old "verify items at the post itself" step existed because the front-page diff gave only a URL. The post URL is in the snapshot beside each item — cite it as the `sourceLink`. The HTML site still blocks plain WebFetch, so never fall back to the page. Apply the Williamsburg-address gate per item.
- **Coverage-scan reports** (`docs/launch/coverage-scans/`): if a report newer than the ledger's `lastRunAt` exists, its MISSING list is a pre-built work queue — verify each item at the organizer's page. (The scheduled scan is being retired as the fetch-diff loop covers it; treat any remaining reports as input, not as a required step.)
- **Roster discovery sweep** (monthly, first Monday run of the month): scan the last 4–6 weeks of Greenpointers "new business"/"now open" posts for venues with a public events page; cross-check newly added Gmail senders for companion website calendars; spot-check Google Maps "new" listings + geotagged Greenpoint IG for storefronts opened in the last ~90 days. Any hit → propose adding to `ingest-sources.json` in the review gate, same treatment as a new Gmail sender. **Check for an RSS feed before proposing `browser`** (try `/feed/`, `/rss`, `/blog/feed`): a feed is the cheapest strategy, usually carries fuller text than the rendered page, and does not depend on the browser path being up — see the Greenpointers switch, 2026-08-05.
- **Business submissions (L5, Monday full run only):** run `node scripts/tally-pull.mjs`. If `TALLY_API_KEY` is absent from the environment, log "tally key missing — submissions skipped" and continue (never fail the run on it). Submissions whose Tally submission id is not yet in `processedItems` are **asks — supply-gate evidence first, cards second**: count and quote each in the review diff under its own "asks" section, and append its submission id to `processedItems` at ship time so it's never re-reviewed. A submission only becomes a card if its claims verify at a named source through the normal gates below — the form is ultra-light by design (business name · what's happening · email), so most asks need a Batu follow-up before they can ship. **A run containing submission-derived adds is always human-gated — asks never qualify for the zero-add auto-merge promotion.**
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
> **`quote` is load-bearing and must be copied character-for-character from the text — it is what lets the item ship without a human reading it** (it becomes the card's `sourceQuote`). Never paraphrase, never reconstruct it from memory, never quote a line that doesn't actually carry the claim. If the text doesn't state something, leave that field null and say so in `notes` — a null field gets the item reviewed; a fabricated quote gets a wrong card in front of residents.

The subagent returns data, not cards — the orchestrator does the judgment: dedupe against `npm run ingest:index`, apply the gates above, author the card (schema fields, kicker, filters, copy rules), and cross-link.

### 2. Parse into draft cards — truth rules (hard)

- Only facts **stated in the source**. Never invent dates, times, prices, venues, free-ness, or active status. `free: true` only when the source says free.
- Every card carries `sourceLinks` with `publisher` (+ URL, date). Newsletter-derived cards cite the business/org as publisher.
- **Every card authored from 2026-08-02 carries `sourceQuote`** — the extraction subagent's verbatim `quote`, the line the card's claims rest on. `sourceLinks` proves the card was *attributed*; `sourceQuote` proves it was *sourced*, and attribution alone can't catch a plausible sentence assembled around a real URL. Schema-checked, and a dated test fails any card with `createdAt >= 2026-08-02` that lacks one.
- Categories: happenings → `event` (needs `startsAt`+`endsAt`; unknown end time → same-day `23:59` sentinel); time-bound offers → `discount` with real `endsAt`; standing offers/happy hours → `discount` with `recurring: true` and `endsAt` = end of the edition week (verified-through, re-checked next run); neighborhood/civic items → `news` (publisher required); recurring clubs/memberships → `subscription`.
- **Lens rules (Batu, 2026-07-30 + 2026-08-02) — three lenses have hard membership tests. Repo tests enforce all three on the live deck, so a violation fails `npm test` and the card cannot ship.**
  - **`games` is play — added 2026-08-02** ("warhammer night shouldn't be in the same lens as cinema noir or art gallery opening"). Tournaments, leagues, club nights, trivia, bingo, board/tabletop/video game events, and the venues whose program IS play (Scrappleland, Black Rabbit, Last Place on Earth, Carcosa, Frontier Games). **A games card must NOT also carry `arts_culture`** — that split is the whole point, and a test asserts it. Venues keep their real-world lens alongside (`food_drink` for a bar or taproom): play is an additional membership, not a replacement. The chip is **authored-folded into "More"** (`FOLDED_FILTER_IDS` in `cardSchema.js`) — that is a standing decision, not a volume state, so **never "promote" it by editing the fold** however well stocked a week looks.
  - **`arts_culture` is culture you attend or make** — film, galleries, comedy, music-adjacent programming, talks, craft/sewing classes. If the activity is a *game*, it is `games`, not here.
  - **`civic` is civic action and mutual aid ONLY** (**renamed from `community` on 2026-08-02 — author `civic`, never `community`, which now fails schema validation**). Hands-on participation with neighborhood stakes: cleanups, CAG meetings, advocacy asks, a business asking for help. A gathering that is merely *social* does not qualify no matter how community-flavored it sounds — the 40k tournament and the weekly chess night were evicted from here in July and now live in `games`.
  - **`deals_memberships` is deals and standing memberships ONLY.** `subscription` is the schema category for both a standing membership (Falu tinned-fish club, Flower Cat weekly delivery — open-ended relationship) *and* a term enrollment (fall dance registration, kids' game clubs — a fixed term you buy once). **The lens cannot be derived from the category:** enrollments and registrations go to their audience lens (`family_kids` / `wellness` / `games`), never here.
- **Kids events go in kids (Batu, 2026-08-02).** Anything authored for children — a kids' art workshop, a kids' sewing camp, kids' D&D or Magic clubs — is `family_kids` and does **not** double-file into `arts_culture` or `games`. Genuinely all-ages venues and festivals (the Library, Kingsland Wildflowers) may still carry both.
  - **A kids DEAL double-files `family_kids` + `deals_memberships` (2026-08-03, PR #18).** The no-double-file rule above bars `arts_culture` and `games` — it does **not** bar a deals lens, and `moon-bunny-back-to-school` has shipped both since July. So a discounted trial or offer at a kids' business is not a rule collision and is not a hold: file both.
- **Adult movement and dance enrollments are `wellness` (2026-08-03, PR #18).** `cardSchema.js` defines the lens as the movement cluster — yoga / pilates / **dance** / run — so an adult ballet, barre or dance term is `wellness`, not `arts_culture`. `arts_culture` is culture you **attend**; a term you enrol in and do weekly is movement. (`arts_culture` was never even an option here: the enrollment rule above names `family_kids`/`wellness`/`games` as the only audience lenses.)
- **An offer with no stated end date is `recurring` + verified-through — NOT a hold (2026-08-03, PR #18).** "For a little while", "while supplies last", an open-ended intro offer: set `endsAt` to the end of the edition week and let the next run re-verify or drop it. That mechanism already exists (see the category rules above, and `poochs-parlor-first-groom`); the 2026-08-03 run held a card for a missing field the rules already fill. If the offer is **online/sitewide** rather than in-store, say so in the copy — a storefront pin implies you can walk there for it.
- **The live lens set is `FILTER_IDS` in `cardSchema.js` — read it, don't recall it.** It has changed six times since July; a lens you remember may be retired. Authoring a card with an unknown filter fails schema validation, and a card whose copy names a game (pinball, chess, trivia, bingo, board game, Warhammer, D&D…) fails `npm test` unless it is in `games` or `family_kids` — so a stale lens definition cannot ship a mis-filed card.
- **Lens rules (Batu, 2026-07-26):** `shopping` is retired as a lens — sales/offers at shops go to `deals_memberships`; store openings go to `news` (+`family_kids` etc. as honest). **`live_music` = dated gigs or documented ongoing programming, never bare place cards** — do NOT author an undated venue card when the venue's program is already on the map as dated gig cards (that duplication is what got Troost/Good Room/Eavesdrop/Hide & Seek venue cards deleted). A gig card missing `startsAt` shows on every prior day's Today lens; a repo test now fails on it.
- Geography: Greenpoint only (bbox in `cardSchema.js`). Williamsburg-proper items are skipped — note them in the run summary, don't map them. **Exception (Batu, 2026-07-22, Newtown Creek CAG precedent): Greenpoint-related civic events held nearby (e.g. just across the creek in LIC) ship as `civic_action` pinned at their exact real location** — the subject matter, not the address, is the gate for civic items.
- Copy rules (field contract, 2026-07-29 punch list P1 #3): **`kicker` = the glanceable hook in the list row** (why you'd tap, ≤ 44 chars); **`summary` = what the row could NOT say** — it must not restate the kicker, the when-line's date/time, or the address, and stays ≤ 200 chars. Run `lintCard` (from `cardSchema.js`) on every new/changed card and rewrite until clean — it flags kicker/summary overlap and over-length summaries. Spell out "Shop Small Greenpoint" (never "SSG"); all UI stays II-C palette (no code changes needed for content).
- Cross-link: if a card is at/with a business already on the map, add reciprocal `relatedCardIds` (the index shows which venue cards exist). **Order carries no meaning — do not try to rank them by hand.** Since 2026-07-30 the UI shows exactly one "Related" card, chosen by `pickRelated()` (drop expired → soonest upcoming → else freshest evergreen), so just add the link and let the picker sort it out.
- Conflicting sources (e.g. two articles disagree on a date): prefer the dedicated article over a roundup line, note the conflict, set `trustRisk: "medium"`.
- Re-verify any recurring deal the expiry script FLAGGED (past its verified-through date): confirm at the source and bump `endsAt`, or delete.

### 3. Triage each card: ship, or hold for review (Batu, 2026-08-02)

**Routine updates ship. Anything unsourced or uncertainly categorized is held for review — never shipped, never silently dropped.** Triage is **per card**, not per run: a run with nine clean cards and one doubtful one ships nine and PRs the tenth. The old human gate is not being removed so much as *narrowed to the cards that actually need it*.

**A card SHIPS only if all of these are true:**

1. **Substantiated** — you can point to the verbatim line in the source that carries its claims (what, when, where, price/free-ness). Put that line in the card's **`sourceQuote`** field. This is schema-checked and enforced by a dated test: any card with `createdAt >= 2026-08-02` and no `sourceQuote` fails `npm test`, so an unsourced card cannot reach prod even by mistake.
2. **Categorized off the source, not decided** — the category and lens follow mechanically (a dated happening at a venue → `event`; a stated time-bound offer → `discount`; a membership → `subscription`). If you had to *choose* between two plausible homes, it is not mechanical.
3. **Complete** — no claim inferred, guessed, or filled from prior knowledge. Free-ness in particular: `free: true` only where the source says free.
4. **In the clear on the standing gates** — Greenpoint bbox, locally-owned rule, aggregator rule, no duplicate of a live card.
5. **`trustRisk: "low"`** and no source conflict you had to adjudicate.

**A card is HELD (authored, then PR'd — not deleted) if any of these is true:**

- No verbatim quote covers a claim, or the quote is thinner than the card (**the single most important hold** — this is the failure a reviewer used to catch).
- Its category or lens was a judgment call between two plausible homes.
- Any field is inferred rather than stated — a guessed end time, an assumed price, an "it's probably still running."
- Sources conflict, or `trustRisk` is `medium`/`high`.
- The locally-owned or Greenpoint-geography call is genuinely uncertain.
- It came from a business submission (L5) or a first-time source.

Hold means **keep the work**: author the card properly, put it in the PR with the reason on one line, and say what would resolve it. A held card is a queue item, not a loss.

**RESOLVE BEFORE YOU HOLD (Batu, 2026-08-03 — the PR #18 lesson).** That review
classified all nine holds from the 2026-08-03 run and found only **one** was a
genuinely new judgment call. Four were the run failing to use knowledge it already
had, and four were a standing source limitation that would have regenerated every
week. A hold is legitimate only after these three checks are exhausted, and the
hold note must **name which one it failed**:

- **R1 — Follow the link.** If a required field (time, venue, age, price,
  free-ness) is missing — **or a lens cannot be assigned, which is the same
  problem wearing a different hat: the fact the lens depends on is missing** —
  *and* the listing links to a detail/event page, open the detail page before
  holding. **When a source offers both an index and a per-item
  page, the per-item page is the source of record.** Precedent: the NYC Parks
  events index tags the ranger fishing session only "Urban Park Rangers, Fishing",
  which made every lens look like a guess — the event's own page states
  "Recommended for ages 8 and older", which shipped it. Go Green's listing
  likewise omits the time its detail page carries. Deliberately bounded: only on a
  **missing field**, never a fetch-everything sweep — the cost architecture above
  is the constraint.
- **R2 — Check whether a standing rule already supplies the field.** A "missing"
  field is often one this skill already has an answer for: an offer with no stated
  end date is `recurring` + verified-through (**not** a hold); an enrollment goes
  to its audience lens. Re-read the rules above before concluding a field is
  unfillable.
- **R3 — Check for a live card of the same shape — for FILING ONLY.**
  `npm run ingest:index` is already in the loop and cheap. If a live card has
  already made this exact **categorization** call — which lens, which category,
  whether to double-file — follow it; that call was reviewed once and does not
  need reviewing again. Precedent: `moon-bunny-back-to-school` had already settled
  how a kids discount files, which is what the BYB trial needed.
  **A precedent card NEVER supplies a fact.** Venue, time, price, free-ness and
  dates come from the source or the card is held — full stop. The trap is real
  and this run walked up to it: five live Brooklyn Craft Company cards are pinned
  at 165 Greenpoint Ave, so "a live card of the same shape exists" would have
  cheerfully invented the venue for four workshops whose newsletter never said
  which city they were in. Same shape ≠ same facts.

**A hold that R1–R3 would have resolved is a defect, not caution** — it costs a
review cycle and, on a same-week item, usually the card itself.

**Run-level gates — all must pass before ANY push:**

1. `npm test` green (schema, substantiation, bbox geocode, lens rules, unique ids, place-graph, no open-start gigs).
2. `lintCard` clean on every new/changed card.
3. `npm run build` succeeds.
4. **Deck swing within ±40%** of the live card count — a bigger swing is the signature of a broken fetch or a bad diff, not a busy week. Halt, PR, report.
5. **File set is content-only**: `cards.json`, `geocode-cache.json`, `ingest-ledger.json`, `freshness-stamp.json`, and the contract counts in `julyCards.test.mjs`. **Anything outside that set means the run is not a content run** — PR the whole thing.

**Also always human-gated, regardless of card quality:** roster/sender/allowlist additions (a new source is a trust decision about a publisher), and any code change.

### 4. Ship

1. Apply changes to the JSON; bump `version` to today; set `updatedAt` on touched cards. Edit surgically — never rewrite the whole file from context.
2. `node scripts/geocode-demand-cards.mjs` — every new card must resolve inside the bbox (widen `geocodeQuery` to the venue/park name if a street query misses).
3. Update `julyCards.test.mjs` contract counts (the expiry script printed the post-expiry baseline; adjust for adds) and the refresh-discipline date; `npm test` must pass.
4. Update the ledger: `lastRunAt`, append `processedItems` entries with outcomes. Then `npm run ingest:fetch -- --mark-ingested` to promote the ingested snapshots to baselines (include sources whose extraction found nothing — they were processed too; a run that aborted before shipping must NOT mark).
5. Run the step-3 run-level gates. All green → commit the **shipping** cards (`content(track-v): <cadence> refresh — <summary>`), **`git pull --rebase` then push straight to `main`** — push is the production deploy (Vercel-linked). Then spot-check the live page (pins render, no expired deals, new cards open).
6. **Held cards go to a PR** (`ingest/review-<date>`) with a one-line reason each and what would resolve it. Ship first, then PR — a doubtful card must never delay the clean ones.
7. **Report every run in the summary**, whether or not it shipped: what shipped, what was held and why, and the gate results. Autonomy without a log is not autonomy, it's drift.
8. **Classify every hold and log the tally (2026-08-03).** One line in the summary, and the same line on the run's `processedItems` entry so the trend is queryable across runs:

   `holds: <n> new-judgment · <n> rule-miss · <n> source-blocked`

   - **`new-judgment`** — a call this skill genuinely has no answer for. Expected to stay low but never zero; each one should come back as a proposed rule (below).
   - **`rule-miss`** — R1/R2/R3 would have resolved it. **This is the number to drive to zero.** A non-zero `rule-miss` means the run held a card it had everything it needed to ship, so say which check was skipped.
   - **`source-blocked`** — the source genuinely doesn't carry the fact and no fetch can reach it. Goes to `watchItems`, not to a re-author next week.
9. **Turn each resolved hold into something durable (Batu, 2026-08-03 — the authority split).**
   - **Facts** — "this newsletter never states per-date venue", "this booking widget is unreadable by automation" — the run writes them itself, into the source's `notes` in `ingest-sources.json` or into `watchItems`. No approval needed; both files are already in the content-only file set.
   - **Rules** — anything that decides how a *class* of future card is filed — go into **this skill**, proposed as a one-line addition in the review PR. Batu approves the **rule once**, and every future matching card then ships mechanically with no per-card review. This needs no new gate: gate 5's content-only file set already forces a `SKILL.md` edit into a PR, so a rule can never self-approve while facts flow freely.
   - The point of the loop: **a judgment call should be made once.** If the same call is being made a second time, the first one wasn't written down.

**Rollback:** content lives in one JSON file, so a bad ship is `git revert <sha> && git push`. If a spot-check shows the live page broken or a card that shouldn't be there, revert first and diagnose after — do not leave a bad deck live while investigating.

## Cadence

- **Daily thin run** (scheduled): scripts + changed-source extraction + Gmail quick pass. Most days this is a no-op costing cents; late announcers (Flower Cat, Trash Club's weekly spot) get caught same-day.
- **Content auto-ships (Batu, 2026-08-02 — supersedes the 2026-07-28 zero-add/expiry-only promotion, which was too narrow):** any run passing the step-3 machine gates pushes to `main` itself. The 2026-07-28 rule gated exactly the runs that carried value — a queue of unmerged `ingest/*` PRs left the live feed a week stale, which costs more than a wrong card would. The gates moved from "a human looked at it" to "it traces to a named source and the suite passes."
- **The freshness alarm is the backstop** (L11, `freshness.js`): if runs stop shipping, the live banner degrades honestly to "listings verified through &lt;date&gt;" rather than silently presenting a stale deck as current. Auto-ship makes that alarm load-bearing — do not let a run mark snapshots ingested without shipping, or the stamp will claim freshness the deck doesn't have.
- **Monday full run**: everything, incl. monthly discovery sweep on the first Monday.
- **Wednesday Greenpointers pull** (scheduled, Wed 1pm): the roundup publishes Wednesdays; a 5-day lag to Monday means readers see it there first. If the roundup isn't live yet at run time, say so — Batu re-triggers later.
- The Thursday coverage scan is retired once the daily loop is live (its gap-catching is what the fetch-diff does every day); a monthly audit-style scan can replace it if gaps reappear. The former Sunday 6pm scan stays retired.
