import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateCard, inGreenpoint } from "./cardSchema.js";

const seed = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/demand-test/cards.json", import.meta.url)), "utf8"),
);
const ledger = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/demand-test/ingest-ledger.json", import.meta.url)), "utf8"),
);

test("seed has exactly 75 cards across the six layers", () => {
  // 2026-07-02 (Batu): per-station G-closure cards cut — closure context lives
  // in the banner; the layer keeps the action cards (adopt + advocacy).
  // 2026-07-08 weekly refresh: Jul 7–12 roundup in, 10 past events out.
  // 2026-07-15 limited-launch refresh: 18 past events out, 12 in from the
  // Greenpointers Jul 16–22 roundup, plus the two content-type seeds under
  // test — 3 deals (`discount`) and 3 `news` cards.
  // Evening of 2026-07-15: first Gmail ingest run — +1 event (WORD Journal
  // Club) +1 news (Rockaway Rocket); PRESS deal dropped by Batu (multi-location).
  // Same evening: live-music layer (Batu) — 4 venue cards + 2 Good Room nights,
  // then the full Troost nightly program (troostny.com/calendar/, Jul 15–22).
  // 2026-07-16 venue-calendar expansion (Batu): locally-owned-only hard gate —
  // Warsaw removed (Live Nation-operated), Trom Yorke night expired out;
  // +7 venue/business cards (Eavesdrop, Lot Radio, Greenpoint Comedy Club,
  // Film Noir Cinema, Scrappleland, Flower Cat, Hide & Seek), +17 events from
  // their published calendars, +1 subscription, +1 support, +1 news.
  // Later on 2026-07-16 (ChatGPT-gap check): community-institution sweep —
  // Greenpoint Library venue + 6 day cards from the branch's own calendar,
  // plus the Friends of Transmitter Park Longevity Stick class (Jul 23).
  // 2026-07-21 weekly refresh: 36 past events + the one-night El Born deal
  // expired out; +21 events from the venue-calendar re-pull for the Jul 23–27
  // back half (Troost 5, Eavesdrop 6, Good Room 2, Film Noir 3, GCC 3, Hide &
  // Seek weekend DJs) plus the Tend x Franca sidewalk seconds sale (Gmail), then
  // +4 Greenpoint Library day cards (Thu/Fri/Sat/Mon; Fri had garden + movie,
  // Sun had no branch programming) from the BPL branch calendar sweep.
  // 2026-07-22 Wednesday Greenpointers pull (first same-day roundup ingest):
  // 5 Jul-21 events expired out; +15 events from the 7/23–29 roundup (BIP jazz,
  // Madeline's acrylics, cannabis botany, Makers Terrace, PLAY Kids movie night,
  // BCC crafty hour, Pilates breathwork, Threes DJ night, mom run club, City of
  // Water Day, Pooch's adoption day, Held Space astrology, Disabled & Hungry
  // launch, library book club 7/29, Greenpoint Loft ecstatic dance). 6 roundup
  // items verified to Williamsburg addresses and skipped (Salotto→84 Withers,
  // Twisted Spine workshop→306 Grand, Artful Souls→105 S 5th, Rude Mouth→359
  // Metropolitan, Joy Flower Pot→713 Lorimer, Tracksmith→Grand St + MPJ Park).
  // Later on 2026-07-22 (Batu): +2 news from this week's Greenpointers front
  // page — Wasabi closing Jul 27 after 26 years (638 Manhattan Ave) and
  // Swaine's fall opening at 577 Lorimer (boundary call: Williamsburg side of
  // the envelope, added on Batu's explicit ask, Domino-yoga precedent).
  // Evening of 2026-07-22 (Batu's open-tab review): +1 subscription (Greenpoint
  // Trash Club — Wednesday 7:30pm cleanups, rotating bar meetup pinned weekly),
  // +2 events (Town Square SummerStarz free movie at Transmitter Park;
  // Acme Fish Friday pickup at 30 Gem St). Skipped: CIBONE Hozubag (Tokyo
  // multi-location brand, locally-owned gate), Dashi Okume + Dobbin St (no
  // current listings). The Newtown Creek Superfund CAG meeting (Jul 29,
  // Queens Landing Boathouse) was first skipped as LIC, then added on Batu's
  // call as civic_action — Greenpoint-related, nearby, pinned at the exact
  // spot across the creek (geocodes inside the envelope).
  // 2026-07-22 (coverage scan → Batu's ask): +1 event — It's My Park volunteer
  // day at Transmitter Park (Jul 26), from the NYC Parks per-park page (missed
  // by Greenpointers + newsletters; the residual-gap catch this scan exists for).
  // 2026-07-25 IA re-cut (Batu, N1 groundwork): filter taxonomy re-authored —
  // events/services retired, deals+clubs_signups merged into deals_memberships,
  // wellness added (6 movement cards). Second pass same day: the six cards
  // left lens-less sorted into civic (5, incl. Trash Club moved out of
  // deals_memberships) or arts_culture (2). Third pass same day: `new`
  // folded into `news` (one letter apart; every `new` card dated to the
  // original launch batch, untouched across five later ingests — never a
  // live "opened this week" lens). The 8 ex-`new` cards keep their real
  // category (new_business/service/shopping/food_drink/arts_culture) — only
  // filter-bar membership moved, so pin colors are untouched. Card set
  // itself unchanged throughout. Fourth pass same day: the 4 civic-action-
  // required cards (Newtown Creek CAG, adopt-a-business, MTA advocacy, Film
  // Noir support) moved from news to civic — they ask readers to DO
  // something, matching the lens's hands-on-participation definition
  // better than news's reporting one. The G-train status hub itself
  // (g-train-closures) stays in news — it's the reference/timeline card,
  // not itself an ask.
  // 2026-07-25 full refresh — FIRST RUN ON THE SCRIPT PIPELINE (fetch-diff +
  // Sonnet extraction fan-out; see DECISION_LOG 2026-07-25). Expiry script
  // deleted 29 past events + the unverifiable Greenpoint Fish oyster HH deal;
  // 50 adds from the full-roster backfill extraction: Troost/Eavesdrop/Good
  // Room/GCC/Film Noir/Hide & Seek week-ahead nights, Black Rabbit venue +
  // trivia + bingo (first carding), Brew Inn trivia, SPARŚA studio, Hana
  // Makgeolli collab dinners + bottomless standing offer, 5 library day
  // cards, SummerStarz Michael, Acme Fish Friday re-pin, Peek Inn (coverage-
  // scan gap), Archestratus-closed + G-train-survey news, 4 kids-program
  // registrations (Little Dance School, BK Youth Ballet, Dance Space, Yaro
  // kids clay), Moon Bunny + Pooch's deals, 6 BCC workshop/camp cards from
  // their newsletter (site collection hid them). Shenanigans (below Kinda
  // Nice) extracted but dropped — no geocodable address (no pin, no card).
  // Same-day addendum: Bios Apothecary 10%-first-order deal (61 West St —
  // address confirmed by Batu; the shop's site hides it) + Flower Cat & Bios
  // senders registered.
  // 2026-07-26 live-music re-cut (Batu): 4 undated venue cards deleted
  // (Troost, Good Room, Eavesdrop, Hide & Seek — their programs are already
  // on the map as dated gig cards; keeping both was duplication). 109 → 105.
  // 2026-07-27 Monday full refresh — EXPIRY-ONLY. The cloud runner's network
  // allowlist blocked all 43 web roster sources (agent proxy answers 403
  // host_not_allowed), so no source could be read and nothing was added; the
  // Gmail pass ran and found nothing on-concept. Expiry deleted 21 past events
  // (Jul 25–26 nights at Troost/Eavesdrop/Good Room/GCC/Film Noir/Hide & Seek,
  // Black Rabbit bingo, Hana gyopo dinner, BCC filet crochet, the Franca
  // seconds sale, and the Saturday library/park/community block). 105 → 84.
  // 2026-07-27 run 2 (game-club sources + web diffs): +7 — Troost Aug 5/6,
  // Film Noir late show 7/27, GCC free screenings 8/2, Carcosa 40k 8/1,
  // Last Place chess night, NY Society of Play fall registration. 84 → 91.
  // 2026-07-27 civic coverage-gap fix (Batu): the newsletter-only roster never
  // surfaces Council/DOT/EPA stories — +3 verified news cards (Monitor Point
  // approval, McGuinness redesign construction, Meeker Plume monitoring). 91 → 94.
  // 2026-07-27 Film Noir Monday (Batu): the 7/27 grid lists THREE shows — 6pm
  // Jackie the Stripper, 8pm Electric Dragon, 9pm Film Noir Monday — and only
  // the first two were carded across both runs. +1 event, 94 → 95. Same commit
  // corrects the 6pm card's 00:00 start (a value the calendar never stated;
  // isExpiredCard reads 00:00 as the all-day sentinel and skips the
  // started-grace hide, pinning a 6pm show to the lens from midnight).
  // 2026-07-30 (Batu's ask): the Kingsland Wildflowers festival had sat as a
  // watchItem since 7/27 (Greenpointers only said "next week", no date) — the
  // organizer's own events page (kingslandwildflowers.com/events, now a
  // registered source) gives the 10th-annual date, Sat Aug 1 2-6pm, free,
  // corroborated by Greenpointers' 7/23 writeup. +1 event, 95 → 96.
  // 2026-07-30 (Batu's ask, same day): Flower Cat's Botanic Drawing Workshop
  // (7/30, 7-9pm) — flowercat.nyc/events had nothing (normal for them; their
  // real channel is Instagram, which we don't crawl), so Batu's ma.to find
  // is the only sourceLink. One-off attribution, not a registered ma.to
  // roster source. +1 event, 96 → 97.
  // 2026-08-01 daily thin refresh: expiry deleted 30 past events (the whole
  // Jul 27–31 block) — 97 → 67. Then +7: Acme Fish Friday re-pinned to 8/7,
  // McGolrick Bird Club (Sat 8/8, free — Go Green Brooklyn listing), two
  // Scrappleland weeklies (backgammon 8/4, ScrappleLeague pinball 8/5), two
  // Brooklyn Craft Company workshops from their 7/31 newsletter (stretchy
  // knits 8/4, Crafty Hour tie dye 8/7), and the Transmitter Park
  // restaurant/marina news card (Greenpointers 7/28 + 7/31 follow-up).
  // −1: poochs-parlor-first-groom, a FLAGGED recurring deal past its
  // verified-through date whose source was unreachable this run and which
  // duplicated the live poochs-first-visit-20 card. 67 − 1 + 7 = 73.
  // 2026-08-01, same run, after PR review: greenpointers.com turned out to be
  // reachable through its public WP REST API even while the HTML page and the
  // browser fetch path were blocked. Re-verifying at the articles themselves
  // added the Greenpoint Film Festival (Aug 5–9, 259 Green St) and reversed
  // the Pooch's call — the offer is live, so the richer article-sourced card
  // is restored and the thin duplicate (`poochs-first-visit-20`, homepage URL
  // only) is dropped instead. 73 + 1 festival + 1 restored − 1 duplicate = 74.
  // Then +1 SummerStarz (Ford v Ferrari, Fri 8/7): town-square-bk fetched
  // `unchanged`, so no diff surfaced it — the page never changes, its dated
  // list simply rolls forward, and the previous instance had just expired out.
  // A standing-page series needs re-reading on the date, not on the diff. 75.
  // 2026-08-02 (PR #14 port): +5 still-live Greenpointers cards the Aug 1
  // daily never saw (its branch was cut before the Wednesday pull merged). 80.
  // 2026-08-03 Monday full refresh: expiry took the deck 80 → 68 (12 past
  // events, incl. the Kingsland festival and the 8/1-8/2 gig/screening block).
  // +4 events: three per-day Greenpoint Library cards (Wed 8/5, Thu 8/6, Fri
  // 8/7 rooftop garden). The Urban Park Rangers saltwater-fishing session on
  // 8/9 was HELD, not shipped: NYC Parks files it under "Urban Park Rangers,
  // Fishing" and never calls it family programming, so every available lens
  // would have been an inference and the lens-less test below is the gate that
  // said so. −1 discount: bios-apothecary-first-order, a
  // FLAGGED recurring deal whose re-verification FAILED — the Bios email
  // states "Your 10% off introductory offer expires tomorrow" (sent 7/27) and
  // the terms cap it at "7 days from issue date", so there is no live offer to
  // bump to and the card is deleted rather than carried. Hana's bottomless
  // makgeolli re-verified clean off an unchanged source page. 68 + 3 − 1 = 70.
  // 2026-08-03, PR #18 review: +5 of the nine held cards resolved against their
  // sources and shipped. The fishing session above is one of them — its NYC
  // Parks DETAIL page (not the events index the run read) states "Recommended
  // for ages 8 and older", which makes family_kids a reading rather than a
  // guess. Also shipped: the Transmitter Park Tuesday yoga series (time
  // confirmed, 7-8 AM, modelled recurring like sunday-yoga-domino rather than
  // as the single 8/4 date the run authored), the Marianella anniversary sale,
  // and the two Brooklyn Youth Ballet cards. The four Brooklyn Craft Company
  // workshops stay held — their per-session venue lives in a booking widget no
  // fetch can reach. 70 + 5 = 75.
  // 2026-08-05, Wednesday Greenpointers pull: +10 events off the 8/6-12
  // roundup — chess at the McCarren parkhouse, the PLAY Kids movie night, the
  // Film Noir premiere, the comedy club's secret showcase, Songwriter Sundays,
  // the Chi Ba pop-up at Threes, Kirbee's sneak preview, Jabberjaw at Paulie
  // Gee's, and two library day cards (8/11, 8/12). Four more were HELD (the
  // McCarren Demo Garden potluck, the Uzuki parfait, BQFlea and the Loft Story
  // premiere) and six Williamsburg items skipped. Expiry did NOT run — this is
  // a scoped mini-ingest, so the refresh-discipline date below stays 08-03.
  // 75 + 10 = 85.
  // 2026-08-06, Batu's rulings on the four 2026-08-05 holds (PR #21):
  // −1 `sunday-yoga-domino` (Domino Park is Williamsburg, out of scope) and
  // +1 `mccarren-demo-garden-potluck-0806`, released by the work-shift ruling.
  // 85 − 1 + 1 = 85. BQFlea, Uzuki and Loft Story stay held.
  // 2026-08-06 FULL RUN — the first under the 14-day fill rule (DECISION_LOG
  // 2026-08-06). Expiry took 11 (85 → 74). Then −1 more: the SummerStarz
  // 8/7 Ford v Ferrari screening was deleted because Town Square's own page
  // now reads "Fri. 8/07 - Ford v Ferrari >> RAINED OUT!" — the organizer
  // overrides the NYC Parks listing that still shows it. +22 adds, 14 of them
  // dated 8/13–8/20 to refill the reservoir, which was 0. 74 − 1 + 22 = 95.
  // 2026-08-07, Batu's ruling on the WORD hold: there is only one WORD in
  // Greenpoint, so a bare "Brooklyn, NY" location line is unambiguous. Address
  // verified at wordbookstores.com's own footer and corroborated by the
  // Withfriends blurb ("locations in Greenpoint, Brooklyn and Jersey City").
  // All three held cards shipped. 95 + 3 = 98.
  // 2026-08-07 daily thin refresh: expiry took the four past 8/6 events
  // (98 → 94). +2 events, both Greenpoint sessions off Brooklyn Craft Company's
  // 8/6 newsletter — Beginner Embroidery 8/8 and Knitting 101 8/17. That
  // newsletter is the one that finally states location PER DATE ("In
  // Greenpoint:" / "In Lower Manhattan:" above each session list, with a time
  // on every line), which is the exact fact the four watchItems-blocked BCC
  // workshops had been missing since the 7/31 format. All four resolve: 8/6
  // past, 8/9 and 8/11 Lower Manhattan, 8/12 Greenpoint but SOLD OUT — so none
  // was a Greenpoint card we lost. The 8/13 Sewing 101 session is real and
  // Greenpoint but deferred by the 2-per-venue cap in the live 7-day window.
  // 94 + 2 = 96.
  // 2026-08-07 (Batu): the per-venue cap from the 14-day fill rule is REPLACED
  // by an L11e concentration guard (no venue over 25% of the live window). The
  // cap had been sized on a 26% estimate computed against the BROKEN 27-card
  // window — against a healthy one Troost is 17%, and the Library already ran
  // 14% uncapped. It was suppressing 5 of Troost's 7 nights to prevent a
  // concentration the Library was already exceeding. Backfilled the 13 cards
  // the cap had pushed out: 9 Troost nights, 2 comedy-club named one-offs,
  // 2 Film Noir programmes. 96 + 13 = 109.
  // 2026-08-07, standing-programming fix: `unchanged` was being read as "no
  // supply". Black Rabbit, Hide & Seek and Scrappleland publish STATIC weekly
  // schedules, so their pages never diff, so the run skipped them forever and
  // their recurring cards expired unreplaced. Re-authored as `recurring`:
  // Black Rabbit trivia + bingo, Hide & Seek Wine Down jazz, Scrappleland
  // backgammon + pinball. Brew Inn's Wednesday quiz is HELD — no street
  // address in the listing or in any prior card. 109 + 5 = 114.
  // 2026-08-07 (Batu): Brew Inn's Wednesday quiz ships. The address WAS in the
  // snapshot all along — the listing emits structured microdata in DOM order,
  // so the street name lands on the line before the number ("Manhattan Avenue"
  // / "924" / "11222"). The hold that afternoon grepped for <number> <street>
  // only, found nothing, and called it source-blocked: a rule-miss, not a
  // source limitation. 114 + 1 = 115.
  // 2026-08-07, L12 coverage reconciliation: the new check flagged 10 sources
  // whose snapshots carried dates the deck had nothing for. Closed 14 of them —
  // Troost 8/21+8/22, five Good Room bills the extraction subagent had missed
  // entirely, the club's four standing Wed–Sat showcases as RECURRING cards
  // (not ~8 near-identical dated ones), SummerStarz Zootopia 8/21, PLAY Kids
  // Toy Story 8/21, and the Hana 8/21 tour. Two gaps remain and are correct:
  // McCarren 8/10-12 is municipal rec (learn-to-swim, lap swim, Shape Up NYC)
  // and WORD 8/12 is Jersey City. 115 + 14 = 129.
  assert.equal(seed.cards.length, 129);
  const count = (pred) => seed.cards.filter(pred).length;
  assert.equal(count((c) => c.filters.includes("new")), 0, "new retired — folded into news");
  assert.equal(count((c) => c.filters.includes("news")), 23, "22 post-expiry + Transmitter Park restaurant/marina");
  assert.equal(count((c) => c.category === "event"), 78, "64 + the 14 cards that closed the first L12 coverage report (2026-08-07)");
  assert.equal(count((c) => c.category === "discount"), 5, "Hana bottomless + Moon Bunny + Pooch's first groom + Marianella anniversary + BYB trial (Bios deleted — offer expired 7/28)");
  assert.equal(count((c) => c.category === "news"), 13, "12 post-expiry + Transmitter Park restaurant/marina");
  assert.equal(count((c) => c.filters.includes("live_music")), 26, "19 + 2 Troost nights and 5 Good Room bills recovered by the coverage check (2026-08-07)");
  assert.equal(count((c) => c.category === "subscription"), 10, "Falu, Flower Cat, Trash Club + 4 kids-program registrations + Last Place chess night + NY Society of Play fall clubs + BYB adult ballet term");
  assert.equal(count((c) => ["g_train_support", "civic_action", "support_local"].includes(c.category)), 5, "3 G-train cards + Film Noir support + Newtown Creek CAG");
});

test("no fully-past events linger in the seed (refresh discipline)", () => {
  // DERIVED from the ledger's lastRunAt, never hand-written (2026-08-07).
  //
  // This gate already existed and still failed to catch the 2026-08-05 run,
  // for one reason: `refreshDay` was a hardcoded literal the run bumped by
  // hand, so skipping expiry and skipping the bump were the SAME omission.
  // That commit says it outright — "the refresh-discipline date below stays
  // 08-03" — and 13 dead cards shipped. A tripwire you disarm by not touching
  // it is not a tripwire.
  //
  // lastRunAt cannot be left stale the same way: `check-freshness --stamp`
  // writes it and the client banner reads it, so a run that fails to update it
  // breaks something visible. Deriving from it means a run that skips expiry
  // now FAILS here and cannot push — verified against the 8/5 tree, which
  // carries 5 stale event cards under this rule.
  //
  // Recurring series legitimately carry their series end date, which is in the
  // future, so they are unaffected.
  const refreshDay = Date.parse(`${ledger.lastRunAt.slice(0, 10)}T00:00:00-04:00`);
  assert.ok(Number.isFinite(refreshDay), "ledger.lastRunAt must be a parseable date");
  for (const c of seed.cards.filter((x) => x.category === "event")) {
    assert.ok(Date.parse(c.endsAt) >= refreshDay,
      `${c.id} ended ${c.endsAt}, before the run at ${ledger.lastRunAt} — expiry did not run`);
  }
});

// Substantiation gate (2026-08-02): when ingest went autonomous, "a human read
// it" stopped being the thing standing between a fabricated claim and a
// resident. This is what replaced it — every card authored from that date
// forward carries the verbatim source line its claims rest on. The backlog is
// grandfathered by createdAt: those cards WERE human-reviewed, so re-quoting
// them retroactively would be theater. A new card without a quote is not
// dropped and not shipped — the ingest ritual holds it in a PR for review.
const SUBSTANTIATION_FROM = "2026-08-02";

test("every card authored under autonomous ingest carries its verbatim source quote", () => {
  const missing = seed.cards
    .filter((c) => c.createdAt >= SUBSTANTIATION_FROM)
    .filter((c) => typeof c.sourceQuote !== "string" || c.sourceQuote.trim().length === 0)
    .map((c) => c.id);
  assert.deepEqual(
    missing,
    [],
    `cards created on/after ${SUBSTANTIATION_FROM} must carry sourceQuote — hold them for review instead of shipping`,
  );
});

test("deals carry the expiry contract; recurring deals are flagged, dated deals are not", () => {
  // Limited launch: expired dated cards vanish at render time (isExpiredCard), so
  // endsAt is load-bearing on every deal. recurring marks endsAt as merely
  // verified-through (UI suppresses the "ends" line) — a dated one-night deal
  // must NOT carry it.
  const deals = seed.cards.filter((c) => c.category === "discount");
  // 2026-08-03: +2 held cards resolved and shipped — the Marianella anniversary
  // sale and the Brooklyn Youth Ballet trial, both recurring/verified-through
  // (neither source states a closing date).
  assert.equal(deals.length, 5);
  for (const c of deals) {
    assert.ok(c.endsAt, `${c.id} missing endsAt`);
    assert.ok(c.filters.includes("deals_memberships"), `${c.id} missing deals_memberships filter`);
  }
  // 2026-07-25: the Greenpoint Fish oyster HH deleted (past verified-through,
  // site unreachable for re-verification). Three recurring standing offers
  // (verified-through dated) + one dated deal (Moon Bunny, real 8/15 deadline).
  // 2026-08-01: the Pooch's pair resolved to ONE card. The 6/1 article still
  // states the offer ("Mention Greenpointers for 20% off your first
  // appointment"), re-verified via the WP REST API, so poochs-parlor-first-groom
  // keeps its slot with verified-through bumped to 8/8; poochs-first-visit-20
  // was the duplicate and went instead — it cited only the homepage.
  // 2026-08-03: bios-apothecary-first-order deleted — re-verification found the
  // introductory offer expired 7/28 ("expires 7 days from issue date"), so the
  // recurring/verified-through slot could not be renewed.
  assert.equal(seed.cards.find((c) => c.id === "hana-bottomless-makgeolli").recurring, true);
  assert.equal(seed.cards.find((c) => c.id === "poochs-parlor-first-groom").recurring, true);
  assert.equal(seed.cards.find((c) => c.id === "bios-apothecary-first-order"), undefined, "deleted — offer expired, no live offer to verify through");
  assert.equal(seed.cards.find((c) => c.id === "moon-bunny-back-to-school").recurring, undefined, "dated deal must NOT carry recurring");
});

test("news cards name their publisher and sit in the news layer", () => {
  const news = seed.cards.filter((c) => c.category === "news");
  // 2026-07-27: +3 civic-issue cards (Monitor Point approval, McGuinness
  // redesign construction, Meeker Plume monitoring) — coverage-gap fix.
  assert.equal(news.length, 13);
  for (const c of news) {
    assert.ok(c.filters.includes("news"), `${c.id} missing news filter`);
    assert.ok(c.sourceLinks.some((s) => s.publisher), `${c.id} missing publisher`);
  }
});

test("the G-closure campaign card is a durable object: timeline, graph links, actions", () => {
  // The doc's flagship example ("What Changed Near Me?"): one card that answers
  // what changed / over what time / what's connected / what can I do.
  const c = seed.cards.find((x) => x.id === "g-train-closures");
  assert.ok(c, "g-train-closures campaign card exists");
  assert.equal(c.category, "g_train_support");
  assert.ok(c.timeline.length >= 3, "source-backed closure timeline");
  for (const rid of ["adopt-a-business", "g-advocacy-mta", "sailor-and-siren", "sotteatery"]) {
    assert.ok(c.relatedCardIds.includes(rid), `links to ${rid}`);
  }
  assert.ok(c.actions.some((a) => a.type === "file_complaint" && a.url), "complaint action");
  assert.ok(c.sourceLinks.some((s) => s.publisher === "MTA"), "MTA is cited for closure dates");
});

test("every action is tappable — url, share, internal filter, or derivable directions", () => {
  // Untappable actions produce no action_tap evidence; the go/no-go bar is
  // "action, not interest", so dead actions are banned from the seed.
  for (const c of seed.cards) {
    for (const a of c.actions) {
      const tappable =
        a.url != null ||
        a.type === "share" ||
        a.filterId != null ||
        (a.type === "visit" && (c.address != null || c.lat != null));
      assert.ok(tappable, `${c.id}: dead action "${a.label}"`);
    }
  }
});

test("free-ness is designated only where the source states it (tester feedback #2)", () => {
  const free = seed.cards.filter((c) => c.free === true).map((c) => c.id).sort();
  // 2026-08-03: the four 8/1-8/2 free events expired out (Kingsland festival,
  // GCC artists-and-beers, Scrappleland Topperz pinball, Dreams on Command
  // artist talk). The three new Greenpoint Library day cards are deliberately
  // NOT here: only some programs in each day state "Free", and a grouped card
  // must not extend one line's free-ness across the whole day.
  assert.deepEqual(free, [
    "community-yoga-transmitter-tuesdays", // "a free outdoor yoga practice" on the Go Green listing
    "greenpoint-trash-club",
    // 2026-08-05 roundup: both state free-ness in the line the card quotes —
    // "teen interns are running a free scavenger hunt" and "You can get free
    // tickets here". The 8/12 library card is NOT here: its garden club line
    // never says free. (library-tuesday-programs-0804 expired 2026-08-06.)
    "library-tuesday-programs-0811",
    "mcgolrick-bird-club-0808", // "Free" on the Go Green Brooklyn listing
    // 2026-08-06: NYC Parks states "Movies Under the Stars" is free on the
    // McGolrick events page. The 8/13 and 8/14 library day-cards are NOT here —
    // same grouped-card rule as above.
    "mcgolrick-movies-guardians-0819",
    "paulie-gees-jabberjaw-comedy-0811",
    // 2026-08-06: the 8/7 Ford v Ferrari card was DELETED, not rolled forward —
    // Town Square's own page reads "Fri. 8/07 - Ford v Ferrari >> RAINED OUT!".
    // The 8/14 screening is the next live one in the same free series.
    "summerstarz-project-hail-mary-0814", // "Free SummerStarz Movies" on townsquarebk.org
    // 2026-08-07: the season's closing screening, surfaced by the coverage check.
    "summerstarz-zootopia-0821",
    "transmitter-saltwater-fishing-0809", // "Cost / Free" on the NYC Parks event page
  ]);
});

test("reader-facing copy spells out Shop Small Greenpoint (no bare acronym)", () => {
  for (const c of seed.cards) {
    for (const text of [c.title, c.summary, c.whyItMatters ?? "", ...c.actions.map((a) => a.label)]) {
      assert.ok(!/\bSSG\b/.test(text), `${c.id}: "${text}"`);
    }
  }
});

test("retired layers stay retired — no card references them", () => {
  // g_train retired 2026-07-23 (campaign-as-category read as confusing);
  // events/services/deals/clubs_signups retired in the 2026-07-25 IA re-cut;
  // new retired same day (third pass) — folded into news. Future ingests
  // must not resurrect any of them.
  const retired = ["g_train", "events", "services", "deals", "clubs_signups", "new"];
  for (const c of seed.cards) {
    for (const id of retired) {
      assert.ok(!c.filters.includes(id), `${c.id} still carries ${id}`);
      assert.ok(!c.actions.some((a) => a.filterId === id), `${c.id} action opens retired layer ${id}`);
    }
  }
});

test("the 8 ex-new cards folded into news, keeping their real category (pin color unchanged)", () => {
  const folded = {
    "sailor-and-siren": "new_business",
    "core-press": "service",
    "poochs-parlor": "service",
    "giggles-and-wiggles": "shopping",
    "cookies-n-cream": "food_drink",
    "sotteatery": "food_drink",
    "socceria": "food_drink",
    "dreams-on-command": "arts_culture",
  };
  for (const [id, category] of Object.entries(folded)) {
    const c = seed.cards.find((x) => x.id === id);
    assert.ok(c, `${id} exists`);
    assert.ok(c.filters.includes("news"), `${id} missing news filter`);
    assert.equal(c.category, category, `${id} category changed — pin color would shift`);
  }
});

test("the wellness lens holds the movement cluster (2026-07-25 IA re-cut)", () => {
  // Yoga/pilates/dance/run — the recurring cluster the events umbrella hid.
  // Trash Club stays out (Batu: it's civic action, not fitness).
  const wellness = seed.cards.filter((c) => c.filters.includes("wellness")).map((c) => c.id).sort();
  // 2026-08-01 expiry took the dated half again (the loft's ecstatic dance and
  // the library's Monday movement block) — the standing pair is what remains.
  // 2026-08-03 restock: the adult ballet term (dance, 18+) and the Tuesday
  // Transmitter Park yoga series — both the movement cluster this lens names.
  // The ballet term is an ENROLLMENT, so it files to its audience lens here
  // rather than deals_memberships (SKILL.md, 2026-08-02).
  // 2026-08-06: sunday-yoga-domino removed — Batu ruled Domino Park is
  // Williamsburg and out of scope (PR #21). It was the deck's only Domino item
  // and the reason the map was inconsistent about that park.
  assert.deepEqual(wellness, [
    "bk-youth-ballet-adult-term",
    "community-yoga-transmitter-tuesdays",
    "sparsa-greenpoint",
  ]);
  assert.ok(!seed.cards.find((c) => c.id === "greenpoint-trash-club").filters.includes("wellness"));
});

// 2026-08-02 launch IA (Batu): "warhammer night shouldn't be in the same lens
// as cinema noir or art gallery opening." Arts & Culture had reached 24 cards
// with six of them games — a Warhammer tournament, two pinball leagues and a
// backgammon club on the same shelf as a film festival, a gallery talk and a
// one-day choir. The intent differs: arts cards are ATTEND ONCE, games cards
// are JOIN A STANDING SCENE. `games` is authored-folded into "More" — it earns
// a lens, not a primary chip.
test("the games lens holds play, and no games card is left in Arts & Culture", () => {
  const games = seed.cards.filter((c) => c.filters.includes("games")).map((c) => c.id).sort();
  assert.deepEqual(games, [
    "black-rabbit",
    // 2026-08-07: Black Rabbit and Scrappleland are back after the standing-
    // programming fix — their weekly nights had silently stopped being carded
    // because a static schedule page never produces a diff.
    "black-rabbit-nerd-alert-trivia",
    "black-rabbit-sunday-bingo",
    "brew-inn-greenpoint-trivia",
    // 2026-08-06: Carcosa Club enters the graph on the first 14-day fill run —
    // the Squarespace JSON finally carried dated events (Malifaux 8/8, Hot Dog
    // Day 8/15). A game club's programme is play by definition.
    "carcosa-hot-dog-day-0815",
    "carcosa-malifaux-monthly-0808",
    "last-place-chess-chill",
    // 2026-08-05: North Brooklyn Chess's August residency at the McCarren
    // parkhouse — "Casual, social chess", so play, not culture. 2026-08-06:
    // re-authored as `recurring` through 8/20 — the Greenpointers piece states
    // "weekly chess nights every Thursday from 7 to 11pm", so a single-night
    // card was under-reading its own source.
    "nb-chess-parkhouse-0806",
    "scrappleland",
    "scrappleland-backgammon-club",
    "scrappleland-pinball-league",
  ]);
  // The whole point of the cut: play and culture no longer share a shelf.
  for (const id of games) {
    const c = seed.cards.find((x) => x.id === id);
    assert.ok(!c.filters.includes("arts_culture"), `${id} is still in arts_culture — the split leaked`);
  }
  // Venues keep their real-world lens too: Scrappleland and Black Rabbit are
  // places you eat and drink, not only places you play. (The Threes speed-dating
  // card expired 2026-08-06 and left this list with it.)
  for (const id of ["scrappleland", "black-rabbit"]) {
    assert.ok(seed.cards.find((x) => x.id === id).filters.includes("food_drink"), `${id} lost food_drink`);
  }
  // Batu, 2026-08-02: "kids events should be in kids." The kids' D&D/Magic
  // clubs stay single-filed to family_kids and do NOT double-file into games.
  const kidsGames = seed.cards.find((c) => c.id === "nyplays-fall-registration");
  assert.deepEqual(kidsGames.filters, ["family_kids"]);
});

// The rule above only pins the eight cards that existed on 2026-08-02. This one
// keeps the split honest as the deck turns over: match on the COPY, not on ids,
// so it survives expiry and re-asserts on every ingest. Prose in the ingest
// skill tells the routine where games go; this is what stops a stale definition
// from quietly refiling one back onto the culture shelf.
test("a card that names a game is never filed under Arts & Culture", () => {
  const NAMES_A_GAME = /\b(pinball|backgammon|chess|warhammer|trivia|bingo|board game|tabletop|mahjong|dominoes|arcade|dungeons ?& ?dragons|d&d)\b/i;
  const play = seed.cards.filter((c) => NAMES_A_GAME.test([c.title, c.kicker, c.summary].join(" ")));
  assert.ok(play.length > 0, "no games cards at all — the lens emptied, review the roster");
  for (const c of play) {
    assert.ok(!c.filters.includes("arts_culture"), `${c.id} names a game but sits in arts_culture`);
    // `games` OR `family_kids` — kids' game clubs belong to their audience lens
    // (Batu, 2026-08-02), so this must not force them into games.
    assert.ok(
      c.filters.includes("games") || c.filters.includes("family_kids"),
      `${c.id} names a game but is in neither games nor family_kids`,
    );
  }
});

test("no card is lens-less — the six 2026-07-25 stragglers resolved into Civic or Arts & Culture", () => {
  // Empty filters (All-only) is legal schema-wise but was a placeholder, not
  // a destination: every card that landed there got a real home same day.
  const lensless = seed.cards.filter((c) => c.filters.length === 0);
  assert.deepEqual(lensless, [], "a growing lens-less list means the taxonomy is leaking — review at ingest");
});

test("the civic lens holds civic/mutual-aid stewardship (2026-07-25, 2nd + 4th pass)", () => {
  // Park cleanups, harbor day, dog adoption, a trash-cleanup club, an
  // accessibility-advocacy launch — future home for things like stoop sales.
  // 4th pass added the civic-ASK cards: a CAG meeting, adopt-a-business,
  // MTA advocacy, Film Noir support — hands-on participation, not reporting.
  const civic = seed.cards.filter((c) => c.filters.includes("civic")).map((c) => c.id).sort();
  // 2026-07-27 expiry took the dated half of this lens (City of Water Day, the
  // Disabled & Hungry launch, It's My Park at Transmitter, the Saturday library
  // block, Pooch's adoption day) — the standing civic asks are what remain.
  // 2026-07-30 (Batu): the game-club pair added on 2026-07-27 is OUT —
  // "Community has gaming events that shouldn't be there. That category is for
  // civic action." Carcosa's 40k tournament and Last Place's chess night moved
  // to arts_culture (the shelf that already holds culture/ideas programming).
  // The lens rule is now hard: hands-on civic participation and mutual aid
  // only — never a gathering that is simply social.
  // 2026-08-02: that pair moved again, out of arts_culture and into the new
  // `games` lens — arts_culture was only ever the least-wrong home for them.
  // 2026-08-02: LABELLED "Civic" to match the rule, then the id renamed to
  // `civic` too — one word for one lens.
  // 2026-08-01 expiry took the library's Tuesday civic block; the standing
  // asks plus the CAG meeting remain.
  // 2026-08-06: the McCarren Demo Garden potluck joins under Batu's work-shift
  // ruling (PR #21) — a garden work shift is civic, and a social gathering
  // attached to one inherits the lens WHEN THE SOURCE STATES THE SHIFT. That
  // is the one sanctioned exception to the "never merely social" rule above:
  // the 6pm shift is in the sourceQuote, and it is what earns the lens.
  // 2026-08-07 expiry took that potluck (it ran 8/6), so the lens is back to
  // the four standing asks plus the CAG meeting.
  assert.deepEqual(civic, [
    "adopt-a-business",
    "film-noir-support",
    "g-advocacy-mta",
    "greenpoint-trash-club",
    "newtown-creek-cag-0729",
  ]);
  const gathering = ["carcosa-warhammer-rtt-0801", "last-place-chess-chill"];
  for (const id of gathering) {
    assert.ok(!civic.includes(id), `${id} is a social gathering, not civic action`);
  }
  // Trash Club moved OUT of deals_memberships — it's civic action, not a
  // paid membership; a signup card can only be one thing at a glance.
  assert.ok(!seed.cards.find((c) => c.id === "greenpoint-trash-club").filters.includes("deals_memberships"));
  // The G-train status hub is a reference/timeline card, not itself an ask —
  // it stays in news, unlike the four action cards above.
  assert.ok(seed.cards.find((c) => c.id === "g-train-closures").filters.includes("news"));
  assert.ok(!seed.cards.find((c) => c.id === "g-train-closures").filters.includes("civic"));
});

// 2026-07-30 (Batu): "deals & memberships should only have deals & memberships.
// enrollments & registrations or game nights don't belong here." `subscription`
// is the schema category for BOTH a standing membership (Falu's tinned-fish
// club, Flower Cat's weekly delivery) and a term enrollment (fall dance
// registration, kids' game clubs) — so the lens cannot be derived from the
// category and has to be authored against this rule. A membership is an
// open-ended standing relationship; a registration buys a fixed term and
// belongs with its audience lens (family_kids / wellness).
test("the deals & memberships lens holds only deals and standing memberships", () => {
  const lens = seed.cards.filter((c) => c.filters.includes("deals_memberships"));
  for (const c of lens) {
    assert.ok(
      c.category === "discount" || c.category === "subscription",
      `${c.id} (${c.category}) is neither a deal nor a membership`,
    );
    assert.ok(
      !/registration|enrollment|signup|sign-up/i.test(`${c.title} ${c.kicker}`),
      `${c.id} reads as an enrollment, not a membership — file it under its audience lens`,
    );
  }
  assert.deepEqual(lens.map((c) => c.id).sort(), [
    // 2026-08-03: the ballet trial double-files family_kids + deals_memberships,
    // the same shape as moon-bunny-back-to-school — "kids events go in kids"
    // bars double-filing into arts_culture/games, not into a deals lens.
    "bk-youth-ballet-trial-class",
    "falu-tinned-fish-club",
    "flower-cat-subscription",
    "hana-bottomless-makgeolli",
    "marianella-19th-anniversary-sale",
    "moon-bunny-back-to-school",
    "poochs-parlor-first-groom",
  ]);
});

test("astrology landed in Arts & Culture, not stranded", () => {
  // cannabis-botany-0723 expired out in the 2026-07-25 refresh;
  // held-space-astrology-0725 in the 2026-07-27 one. Match on the copy instead
  // of a card id so the rule survives expiry and re-asserts on the next one.
  const astrology = seed.cards.filter((c) => /astrolog/i.test(`${c.title} ${c.summary ?? ""}`));
  for (const c of astrology) {
    assert.ok(c.filters.includes("arts_culture"), `${c.id} missing arts_culture`);
  }
});

test("every dated event carries a Today-lens window (start and end)", () => {
  for (const c of seed.cards.filter((x) => x.category === "event")) {
    if (c.startsAt != null || c.endsAt != null) {
      assert.ok(c.endsAt != null, `${c.id} missing endsAt — it would stay 'live' forever`);
    }
  }
});

test("the hidden-engagement addendum cards carry their contract", () => {
  // The Dandelion Wine tasting exemplar (Jul 2) aged out in the 2026-07-08
  // refresh — the pattern lives on in the spec; the subscription half stays.
  const club = seed.cards.find((c) => c.id === "falu-tinned-fish-club");
  assert.ok(club, "Falu House Tinned Fish Club exists");
  assert.ok(club.filters.includes("deals_memberships"));
  assert.ok(club.actions.some((a) => a.type === "join"), "club has a one-tap join action");
});

test("every card validates", () => {
  for (const card of seed.cards) {
    const r = validateCard(card);
    assert.deepEqual(r.errors, [], `card ${card.id}`);
  }
});

test("every card is geocoded inside Greenpoint (run scripts/geocode-demand-cards.mjs)", () => {
  for (const card of seed.cards) {
    assert.ok(inGreenpoint(card), `${card.id} has no derived coords`);
  }
});

// The World Cup watch-party cluster (world-cup-watch) aged out in the
// 2026-07-21 refresh (final was Jul 19) — its multi-venue coverage test
// retired with it. The `venues[]` cluster path stays exercised via schema
// validation on any future cluster card.

test("ids are unique", () => {
  assert.equal(new Set(seed.cards.map((c) => c.id)).size, seed.cards.length);
});

test("relatedCardIds resolve to real cards (place-graph integrity)", () => {
  const ids = new Set(seed.cards.map((c) => c.id));
  for (const c of seed.cards) {
    for (const rid of c.relatedCardIds ?? []) {
      assert.ok(ids.has(rid), `${c.id} links to unknown card "${rid}"`);
    }
  }
  // Densified 2026-07-03: the G-train cluster is reciprocal around the
  // campaign card, and the one organic pair (Socceria is a World Cup venue).
  const byId = (id) => seed.cards.find((c) => c.id === id);
  assert.deepEqual(byId("adopt-a-business").relatedCardIds, ["g-train-closures", "g-advocacy-mta"]);
  assert.deepEqual(byId("g-advocacy-mta").relatedCardIds, ["g-train-closures", "adopt-a-business"]);
  assert.ok(byId("sailor-and-siren").relatedCardIds.includes("g-train-closures"));
  assert.ok(byId("sotteatery").relatedCardIds.includes("g-train-closures"));
  // Live-music layer, re-cut 2026-07-26 (Batu): live music is gigs with dates
  // or ongoing programming, NOT places — undated venue cards whose program is
  // already on the map as dated gigs (Troost, Good Room, Eavesdrop,
  // Hide & Seek) are deleted as duplication, and their gig cards carry no
  // dangling refs. Venues that ARE the representation (Le Fanfare, Lot Radio,
  // Flower Cat — ongoing programming, no dated siblings) stay.
  for (const gone of ["troost", "good-room", "eavesdrop", "hide-and-seek"]) {
    assert.equal(byId(gone), undefined, `venue card "${gone}" deleted (2026-07-26 re-cut)`);
  }
  for (const kept of ["le-fanfare", "the-lot-radio", "flower-cat"]) {
    assert.ok(byId(kept), `ongoing-programming card "${kept}" survives the re-cut`);
  }
  // Counts here track the live gig set, so expiry moves them: the 2026-07-27
  // run pruned gcc-saturday-shows-0725 and black-rabbit-buckaroo-bingo out of
  // their venues' link lists (the expiry script drops dangling refs).
  // 2026-08-01: expiry cleared the whole Jul 27–31 gig block, so the comedy
  // club is down to its two live shows (the 8/2 free screenings card got its
  // missing reciprocal link the same run).
  // 2026-08-03: expiry took both remaining showcase cards, so the prune left
  // the venue with no link list at all (same shape as Black Rabbit below).
  // 2026-08-05: the club is back in the graph with the 8/8 Secret Showcase.
  // 2026-08-06: the first 14-day fill run added three named one-off bookings
  // (the recurring Thu/Fri/Sat showcases are deliberately not carded), so the
  // club's link list is four deep.
  assert.deepEqual(byId("greenpoint-comedy-club").relatedCardIds, [
    "comedy-secret-showcase-0808",
    "comedy-raanan-hershberg-0811",
    "comedy-carmen-lagala-0815",
    "comedy-dani-castaneda-0816",
    // 2026-08-07: the four standing showcases, carded once each as recurring
    // after the coverage check flagged six uncovered showcase dates.
    "comedy-wednesday-cysk",
    "comedy-thursday-showcase",
    "comedy-friday-showcase",
    "comedy-saturday-showcase",
  ]);
  // Scrappleland's club nights all expired 2026-08-06; the prune emptied its
  // link list, so Carcosa now carries the games side of the place graph.
  assert.deepEqual(byId("scrappleland").relatedCardIds, ["scrappleland-backgammon-club", "scrappleland-pinball-league"]);
  assert.deepEqual(byId("flower-cat-subscription").relatedCardIds, ["flower-cat"]);
  // Black Rabbit's weeknight cards have all expired (Sunday bingo 2026-07-27,
  // Tuesday trivia 2026-08-01) — the expiry script drops dangling refs, so the
  // venue card carries no link list until its next gig is carded.
  // 2026-08-07: both are back, and their venue link lists with them — this is
  // the standing-programming fix landing in the place graph.
  assert.deepEqual(byId("black-rabbit").relatedCardIds, ["black-rabbit-nerd-alert-trivia", "black-rabbit-sunday-bingo"]);
  assert.ok(byId("black-rabbit-nerd-alert-trivia").recurring, "a standing weekly night is a recurring card");
});

test("dated gigs carry a start (open-start regression, 2026-07-26)", () => {
  // Ingest once emitted gig cards with endsAt but no startsAt; isActiveOn
  // treats an open-start window as active on EVERY prior day, so a week of
  // Troost gigs all stacked onto today's lens at once. Deals may be genuinely
  // open-start ("until Aug 2"); live-music events may not.
  for (const c of seed.cards) {
    if ((c.filters ?? []).includes("live_music") && c.endsAt != null) {
      assert.ok(c.startsAt != null, `${c.id}: live_music card has endsAt but no startsAt`);
    }
  }
});

test("every card id is a URL-safe slug (deep-link contract, Phase 3.1)", () => {
  // Card ids double as public /e/<slug> paths — must stay lowercase kebab.
  for (const card of seed.cards) {
    assert.match(card.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, `card id not URL-safe: ${card.id}`);
  }
});
