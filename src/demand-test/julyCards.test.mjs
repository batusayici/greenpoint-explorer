import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateCard, inGreenpoint } from "./cardSchema.js";

const seed = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/demand-test/cards.json", import.meta.url)), "utf8"),
);

test("seed has exactly 71 cards across the six layers", () => {
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
  // left lens-less sorted into community (5, incl. Trash Club moved out of
  // deals_memberships) or arts_culture (2). Third pass same day: `new`
  // folded into `news` (one letter apart; every `new` card dated to the
  // original launch batch, untouched across five later ingests — never a
  // live "opened this week" lens). The 8 ex-`new` cards keep their real
  // category (new_business/service/shopping/food_drink/arts_culture) — only
  // filter-bar membership moved, so pin colors are untouched. Card set
  // itself unchanged throughout. Fourth pass same day: the 4 civic-action-
  // required cards (Newtown Creek CAG, adopt-a-business, MTA advocacy, Film
  // Noir support) moved from news to community — they ask readers to DO
  // something, matching community's hands-on-participation definition
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
  // 2026-07-30 Wednesday Greenpointers pull (7/30-8/5 roundup), merged after
  // the day's three content pushes. Expiry deleted 16 past events (Jul 27-29
  // nights at Troost/Film Noir/GCC/Black Rabbit/Brew Inn, the BCC Monday
  // workshops, the Tue/Wed library blocks), 97 -> 81. +10 events from the
  // roundup and one judgment delete: `poochs-parlor-first-groom` duplicated
  // `poochs-first-visit-20` (the same 20%-off first groom carded twice, 7/22
  // and 7/25, with different verified-through dates), so the expiry FLAG on
  // the older copy was a dedupe signal, not a re-verify one. 81 -> 90. Six
  // roundup items skipped on the Williamsburg address gate; five held as
  // watchItems because no named source states a Greenpoint street address.
  assert.equal(seed.cards.length, 90);
  const count = (pred) => seed.cards.filter(pred).length;
  assert.equal(count((c) => c.filters.includes("new")), 0, "new retired — folded into news");
  assert.equal(count((c) => c.filters.includes("news")), 22, "19 + Monitor Point + McGuinness + Meeker Plume");
  assert.equal(count((c) => c.category === "event"), 42, "32 post-expiry + the ten 7/30-8/5 Greenpointers roundup adds");
  assert.equal(count((c) => c.category === "discount"), 4, "Hana bottomless + Moon Bunny + Pooch's Greenpointers 20% + Bios first-order");
  assert.equal(count((c) => c.category === "news"), 12, "9 + Monitor Point + McGuinness + Meeker Plume");
  assert.equal(count((c) => c.filters.includes("live_music")), 17, "13 dated gigs + Le Fanfare/Lot Radio/Flower Cat ongoing programming + Saint Vitus news");
  assert.equal(count((c) => c.category === "subscription"), 9, "Falu, Flower Cat, Trash Club + 4 kids-program registrations + Last Place chess night + NY Society of Play fall clubs");
  assert.equal(count((c) => ["g_train_support", "civic_action", "support_local"].includes(c.category)), 5, "3 G-train cards + Film Noir support + Newtown Creek CAG");
});

test("no fully-past events linger in the seed (refresh discipline)", () => {
  // Refreshed 2026-07-30; recurring series carry their series end date.
  const refreshDay = Date.parse("2026-07-30T00:00:00-04:00");
  for (const c of seed.cards.filter((x) => x.category === "event")) {
    assert.ok(Date.parse(c.endsAt) >= refreshDay, `${c.id} ended before the 2026-07-30 refresh`);
  }
});

test("deals carry the expiry contract; recurring deals are flagged, dated deals are not", () => {
  // Limited launch: expired dated cards vanish at render time (isExpiredCard), so
  // endsAt is load-bearing on every deal. recurring marks endsAt as merely
  // verified-through (UI suppresses the "ends" line) — a dated one-night deal
  // must NOT carry it.
  const deals = seed.cards.filter((c) => c.category === "discount");
  assert.equal(deals.length, 4);
  for (const c of deals) {
    assert.ok(c.endsAt, `${c.id} missing endsAt`);
    assert.ok(c.filters.includes("deals_memberships"), `${c.id} missing deals_memberships filter`);
  }
  // 2026-07-25: the Greenpoint Fish oyster HH deleted (past verified-through,
  // site unreachable for re-verification). Three recurring standing offers
  // (verified-through dated) + one dated deal (Moon Bunny, real 8/15 deadline).
  assert.equal(seed.cards.find((c) => c.id === "hana-bottomless-makgeolli").recurring, true);
  assert.equal(seed.cards.find((c) => c.id === "poochs-first-visit-20").recurring, true);
  assert.equal(seed.cards.find((c) => c.id === "bios-apothecary-first-order").recurring, true);
  assert.equal(seed.cards.find((c) => c.id === "moon-bunny-back-to-school").recurring, undefined, "dated deal must NOT carry recurring");
});

test("news cards name their publisher and sit in the news layer", () => {
  const news = seed.cards.filter((c) => c.category === "news");
  // 2026-07-27: +3 civic-issue cards (Monitor Point approval, McGuinness
  // redesign construction, Meeker Plume monitoring) — coverage-gap fix.
  assert.equal(news.length, 12);
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
  // 2026-07-30: the expired library/trivia day cards drop out; the five roundup
  // adds whose Greenpointers line says "Free" come in. The other five stay
  // unmarked — the source states a price (Jucy Lucy $40, Threes from $25),
  // "by donation" (one-day choir), or nothing at all (McGolrick cleanup,
  // Milltown dog adoption, both only "no RSVP needed").
  assert.deepEqual(free, [
    "dreams-on-command-artist-talk-0802",
    "gcc-artists-beers-0802",
    "greenpoint-trash-club",
    "kingsland-wildflowers-festival-2026",
    "library-friday-programs-0731",
    "library-saturday-programs-0801",
    "library-thursday-programs-0730",
    "library-tuesday-programs-0804",
    "macha-poetry-open-mic-0731",
    "scrappleland-topperz-pinball-0802",
    "summerstarz-michael-0731",
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
  // 2026-07-30 expiry took the dated pair (the Greenpoint Loft ecstatic dance
  // and the Monday library block), leaving the two standing movement cards.
  // The roundup's one movement item — a drop-in mat Pilates class at Movement
  // Loft — is held, not carded: no named source states its address.
  assert.deepEqual(wellness, [
    "sparsa-greenpoint",
    "sunday-yoga-domino",
  ]);
  assert.ok(!seed.cards.find((c) => c.id === "greenpoint-trash-club").filters.includes("wellness"));
});

test("no card is lens-less — the six 2026-07-25 stragglers resolved into Community or Arts & Culture", () => {
  // Empty filters (All-only) is legal schema-wise but was a placeholder, not
  // a destination: every card that landed there got a real home same day.
  const lensless = seed.cards.filter((c) => c.filters.length === 0);
  assert.deepEqual(lensless, [], "a growing lens-less list means the taxonomy is leaking — review at ingest");
});

test("the community lens holds civic/mutual-aid stewardship (2026-07-25, 2nd + 4th pass)", () => {
  // Park cleanups, harbor day, dog adoption, a trash-cleanup club, an
  // accessibility-advocacy launch — future home for things like stoop sales.
  // 4th pass added the civic-ASK cards: a CAG meeting, adopt-a-business,
  // MTA advocacy, Film Noir support — hands-on participation, not reporting.
  const community = seed.cards.filter((c) => c.filters.includes("community")).map((c) => c.id).sort();
  // 2026-07-27 expiry took the dated half of this lens (City of Water Day, the
  // Disabled & Hungry launch, It's My Park at Transmitter, the Saturday library
  // block, Pooch's adoption day) — the standing civic asks are what remain.
  // 2026-07-30 (Batu): the game-club pair added on 2026-07-27 is OUT —
  // "Community has gaming events that shouldn't be there. That category is for
  // civic action." Carcosa's 40k tournament and Last Place's chess night moved
  // to arts_culture (the shelf that already holds culture/ideas programming).
  // The lens rule is now hard: hands-on civic participation and mutual aid
  // only — never a gathering that is simply social.
  // 2026-07-30 Greenpointers roundup: +2 that clear the hard rule — the
  // McGolrick Park cleanup and Milltown's True North Rescue adoption day are
  // stewardship, not social gatherings. Two roundup items were deliberately
  // kept OUT under the same rule: Threes' board-game speed dating (a ticketed
  // singles night, filed food_drink) and Scrappleland's Topperz pinball league
  // (a game night, filed arts_culture alongside Carcosa and Last Place, even
  // though it collects donations for NYC Trans Archive).
  assert.deepEqual(community, [
    "adopt-a-business",
    "film-noir-support",
    "g-advocacy-mta",
    "greenpoint-trash-club",
    "mcgolrick-park-cleanup-0801",
    "milltown-dog-adoption-0801",
    "newtown-creek-cag-0729",
  ]);
  const gathering = ["carcosa-warhammer-rtt-0801", "last-place-chess-chill"];
  for (const id of gathering) {
    assert.ok(!community.includes(id), `${id} is a social gathering, not civic action`);
  }
  // Trash Club moved OUT of deals_memberships — it's civic action, not a
  // paid membership; a signup card can only be one thing at a glance.
  assert.ok(!seed.cards.find((c) => c.id === "greenpoint-trash-club").filters.includes("deals_memberships"));
  // The G-train status hub is a reference/timeline card, not itself an ask —
  // it stays in news, unlike the four action cards above.
  assert.ok(seed.cards.find((c) => c.id === "g-train-closures").filters.includes("news"));
  assert.ok(!seed.cards.find((c) => c.id === "g-train-closures").filters.includes("community"));
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
    "bios-apothecary-first-order",
    "falu-tinned-fish-club",
    "flower-cat-subscription",
    "hana-bottomless-makgeolli",
    "moon-bunny-back-to-school",
    "poochs-first-visit-20",
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
  assert.equal(byId("greenpoint-comedy-club").relatedCardIds.length, 3);
  assert.ok(byId("film-noir-film-club-0730").relatedCardIds.includes("film-noir-cinema"), "screening joins the venue graph");
  assert.deepEqual(byId("flower-cat-subscription").relatedCardIds, ["flower-cat"]);
  // First carding of Black Rabbit: venue ↔ its standing weeknights (Sunday
  // bingo expired 2026-07-27; Tuesday trivia recurs).
  // Black Rabbit's standing weeknights have both expired out, so the venue card
  // carries no gig links until the next pull re-cards them.
  assert.equal(byId("black-rabbit").relatedCardIds, undefined);
  assert.equal(byId("black-rabbit-nerd-alert-trivia"), undefined);
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
