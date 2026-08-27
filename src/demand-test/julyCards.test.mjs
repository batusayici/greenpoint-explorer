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

// Title carries NO counts on purpose (2026-08-13): it read "exactly 75 cards
// across the six layers" from 2026-07-08 until the deck hit 159 across twelve
// categories — the assertions below are bumped every ingest run, the title never
// was, so anyone grepping for the deck size found a number 84 cards stale.
test("deck size and per-layer counts are pinned — update on every ingest", () => {
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
  // 2026-08-08, daily thin run locally (cloud halted on the browser-path
  // outage): expiry deleted the 8 passed 8/7 events, and 4 cards shipped —
  // Arrebato 8/8 (new Film Noir diff line), Watch Me final screenings
  // 8/21-22 (back-of-window fill), library Thursday 8/20 grouped card, and
  // the next Fish Friday 8/14 (acme flagged UNMARKED STANDING? by the
  // coverage check; roster now carries standing:true). The nycparks sources
  // collapsed 4 scrapes into one plain-fetch citywide-RSS feed source; its
  // SummerStarz/McGolrick items were already carded. 129 - 8 + 4 = 125.
  // 2026-08-08, ChatGPT gap cross-check (Batu): a resident ran a Greenpoint
  // event search in ChatGPT for today and found 4 things the deck was
  // missing. +4 events/cards: film-noir-watch-me-0808 recovers a REAL bug —
  // the WATCH ME entry's Squarespace fullUrl slug reused the premiere's
  // 8/7 date even though its ISO startDate is 8/8 7pm, so the card had been
  // carded under the wrong day and this morning's expiry deleted it as
  // "passed" a full day before it actually screened (see SKILL.md fix).
  // Also onboarded three new standing sources: GrowNYC (mccarren-greenmarket,
  // Saturdays 8am-3pm) and Bandit Running (bandit-running-greenpoint-runners,
  // Saturdays 9:30am) as undated venue-style cards; Dreams On Command's own
  // site (dreams-on-command-there-are-people-here-0808, "There Are People
  // Here" closing today) as a dated exhibit card — the map only had the
  // generic July venue blurb sourced secondhand from Shop Small Greenpoint.
  // Two ChatGPT finds stayed uncarded on purpose: On The Riddimz (Box House
  // Hotel) was sourced only to a Reddit thread, not an organizer's own page;
  // Charlotte de Witte / Under the K Bridge Park is ticketed via AXS, which
  // Batu chose not to onboard this pass (nightlife/tourist fit call, not a
  // sourcing gap). 125 + 4 = 129, less the 7/29 Newtown Creek CAG = 128.
  //
  // 2026-08-08 MEMBERSHIP SWEEP (+6 = 134). The source roster is events-shaped
  // — all 47 sources point at calendar/workshop URLs — so standing offers only
  // ever arrived when a newsletter happened to mention one. A sweep of 15
  // roster businesses found six uncarded and fully sourced: hana-sool-club,
  // yaro-studio-membership, kettl-tea-subscriptions,
  // carcosa-membership-guest-pass, moon-bunny-monthly-plans,
  // word-romance-book-club. Two were HELD, not dropped: Bin Bin Club (its own
  // page states no price) and WORD's Withfriends membership (tiers never
  // loaded). Film Noir has no membership — it has a GoFundMe, which is an
  // editorial call for Batu, not a card.
  // 2026-08-08 BCC RE-READ (+2 = 136). Batu asked whether the Brooklyn Craft
  // Company newsletter of 8/6 was fully reflected. It was not: 12 Greenpoint
  // sessions in the email, 2 carded. bcc-sewing-101-tote-0813 had been
  // deferred under a 2-per-venue cap abolished that same day, and
  // bcc-knitting-101-0822 was already quoted inside the 8/17 card's own
  // sourceQuote. Six later sessions went to watchItems — email is one-shot,
  // so unlike a re-fetched web snapshot they had no roll-in path.
  // 2026-08-08 LEAVES + GREENPOINT YMCA ONBOARDING (+3 = 139). Both were
  // Greenpoint venues absent from the roster AND the sender registry — Batu
  // asked after subscribing to Leaves' list the same day, and the Y's branch
  // list turned up unread in the inbox audit. Leaves: august book club
  // (Wednesdays, recurring) + summer writing group 8/20. YMCA: Fall 1
  // registration. Skipped: Printed Matter art book fair (Manhattan).
  // 2026-08-08 SSG DEALS & MEMBERSHIPS SWEEP (+6 = 145). A second pass over the
  // Shop Small Greenpoint directory asking about `subscription` supply rather
  // than events: WORD's 4-tier membership, Held Space, Selformer, Clay Space,
  // Marianella's monthly box, Driftaway's coffee subscriptions. Three of the
  // six (Clay Space, Selformer, Held Space) had been rejected as EVENT sources
  // in the same day's roster scan — the event-calendar field says nothing about
  // whether a business sells a membership. Brooklyn Winery's wine club was HELD,
  // not shipped: its own /wine-club page calls the club's future undecided while
  // its specials page advertises a standing member benefit (source-conflicted).
  // 2026-08-08 CIBONE O'TE (+2 = 147). Batu-supplied source (their newsletter):
  // the Re:STATION archival Comme des Garçons / Yohji Yamamoto showcase, Aug 15
  // – Sep 15, plus the venue card. This is the FIRST EXCEPTION to the
  // locally-owned hard gate (Batu, 2026-08-08): CIBONE lists Tokyo Omotesando
  // and Ginza alongside Brooklyn, so the 2026-07-16 rule that dropped PRESS for
  // being multi-location would have skipped it. Batu ruled 50 Norman in — its
  // tenants (CIBONE, Kama-Asa, Dashi Okume, Cafe O'te) are now eligible for
  // venue and event cards like any local business.
  // 2026-08-10 FLYER SIGHTINGS (+3 = 150). Batu photographed three posted
  // flyers in the neighborhood: WORD Bookstore's monthly comedy night
  // (Herman Melville Presents, third Thursdays), Kindred's Thursday sunset
  // yoga in Transmitter Park (the Tuesday morning card's other weekly slot),
  // and a one-off McGolrick Park pottery pop-up (Series 1: Picture Frames,
  // same day). A fourth flyer (Green Carpet Learning Studio's Summer Studio)
  // was held — no street address could be confirmed, and business listings
  // are human-gated regardless.
  // 2026-08-10 EXPIRY (150 → 135). The first clean expiry since 8/8 — every run
  // between halted at the fetch gate, so 17 passed events (8/8–8/10) were live
  // on the map for two days. Deterministic script, no judgment: 15 deletions,
  // 6 related-link prunes, and 4 recurring deals FLAGGED rather than dropped
  // (poochs-parlor, marianella, bk-youth-ballet, dreams-on-command) — they are
  // past their verified-through dates but their sources are egress-blocked, so
  // they need a bump or a delete once fetch is restored, not a guess now.
  // 2026-08-10 SALVAGE (135 → 140). The 2026-08-10 weekly run halted at the
  // fetch gate twice and its work stranded on a branch behind a closed PR
  // (#27), 4 commits behind main. Rather than merge a stale base, the content
  // was lifted onto main directly: 5 cards the coverage check found that the
  // diff never surfaced (3 Film Noir screenings sitting under already-carded
  // slots, 2 Troost nights), plus 5 card updates — the chess card re-verified
  // against its own 8/06 article instead of a roundup line (and a wrong
  // sourceLink corrected), Sunset Storytime added to the 8/20 library card,
  // and the Transmitter Park hub given the elected-officials development as a
  // sourceQuote rather than a third near-identical news card.
  // Both sides had run expiry independently and converged on identical
  // relatedCardIds, so the only real merge was that hub card's content fields.
  // 2026-08-10 McGOLRICK FARMERS MARKET (+1 = 141). A year-round Sunday market
  // no roster source covered, surfaced by adding the NYC Open Data farmers-market
  // dataset as a plain-fetchable stand-in for grownyc.org (blanket edge WAF —
  // even its robots.txt 403s). Deliberately NOT carded off that dataset: its
  // newest rows are 2025, so a 2026 market from it would be inference. Verified
  // instead at Down to Earth Markets' own site, which states the current hours
  // verbatim, and the city dataset independently agrees on day and hours.
  // 2026-08-10 Monday full refresh — FIRST NON-DEGRADED RUN since the two
  // environment faults were found. Allowlist round 2 (jumpcomedy, kindrednyc,
  // leavesbookstore, happy-medium) landed, taking the roster from 22 errors
  // that morning to 7 — all 7 now the Chromium CONNECT fault alone. Reach
  // 51/58 (12%), under the ceiling, so the fetch exited 0. SIXTEEN sources
  // produced a first-ever snapshot: the SSG-sweep sources onboarded 8/8 had
  // been egress-denied since birth and were read for the very first time.
  // Expiry deleted nothing (141 → 141; the 8/9 events had already gone in the
  // salvage run). +4: maison-jar-refill-happy-hour (standing monthly bulk
  // refill offer — recurring + verified-through, per the no-stated-end-date
  // rule, NOT a hold), selformer-summer-fling-0815 (endsAt taken from the
  // source's own "available through Aug 15"), clay-space-fall-2026-semester
  // (term enrolment, so the AUDIENCE lens and never deals_memberships), and
  // library-sensory-garden-0821 (8/21 carried no library card at all).
  // 141 + 4 = 145.
  // 2026-08-11 daily thin refresh. Expiry took the five past 8/10 events
  // (145 → 140). Then −1: `dreams-on-command-there-are-people-here-0808` was
  // DELETED as unsubstantiated, not expired. Its sourceQuote read "July
  // 11–August 8, 2026" and its whole premise was "closes today"; the gallery's
  // snapshot — byte-identical to the last-ingested baseline, so this was never
  // a source change — states "July 11 – September 8, 2026". A quote that is
  // not in the source cannot hold a card up, and the show was still running.
  // Re-authoring it as an on-view-through-September card is HELD (no dated
  // exhibition-span precedent in the deck). +5: film-noir-film-club-0813,
  // troost-lumens-0825 (the 8/25 back-of-window night the coverage script had
  // flagged as troost's only gap), and three Moon Bunny circus camps
  // (8/13–14, 8/17–21, 8/24–25) — kids programming, so `family_kids` per the
  // kids rule and the bcc-kids-sewing-camp precedent. Two further Moon Bunny
  // sessions were NOT carded: their first day precedes the API window, so
  // their span would have been inferred. 140 − 1 + 5 = 144.
  // 2026-08-12 daily thin refresh. Expiry took the seven past 8/11 items
  // (144 → 137). Then −1: `bk-youth-ballet-trial-class` was DELETED, not
  // expired. Expiry FLAGGED it as a recurring deal past its 8/9
  // verified-through, and the source cannot be re-verified — bkyouthballet.com
  // answers a 169-byte JS shell to plain fetch (browser UA, redirects
  // followed) and the browser path is down with the known chromium
  // CONNECT-reset fault. A deal with no current source does not stay live; it
  // is in `watchItems` to be re-authored the day the source is readable.
  // +3: library-saturday-storytime-0822 (8/22 had no library card at all),
  // troost-louis-prince-0826 (the back-of-window night that was the coverage
  // script's one unexplained gap) and star-deli-viral-boost. The 8/21 library
  // card was MERGED rather than duplicated — `library-sensory-garden-0821`
  // keeps its id and becomes the grouped Friday day-card now that the branch
  // added two afternoon programs to the same day. 137 − 1 + 3 = 139.
  // 2026-08-12 rulings (Batu, PRs #29/#30): +2 held cards released by the new
  // rules — `cibone-hozubag-0813` (lens-less by the markets rule, now shippable)
  // and `flowercat-love-unfolded-0823` (arts_culture by the mixer rule). The
  // Dreams On Command show did NOT become a card: under the exhibition ruling
  // an ongoing run belongs to the venue card, so `dreams-on-command` was updated
  // in place instead. 139 + 2 = 141.
  // +1 (2026-08-12, Batu): the Bios Apothecary herbalist consult, released once
  // Batu allowlisted the host, confirmed the consult is in-store, and kept Bios
  // through the locally-owned gate. 141 + 1 = 142.
  // +8 (2026-08-12, Wednesday Greenpointers pull of the 8/13-19 roundup):
  // reading-series-61-franklin-0813, zumba-under-the-k-0813,
  // neptune-artists-makers-market-0816, anthost-designer-pillow-0816,
  // sotte-paint-your-greca-0816, edys-anniversary-party-0816,
  // gather-sound-bath-0818, idle-mind-vinyl-vibes-0819. Expiry took nothing
  // this run (it had already run for 2026-08-12 on the daily pass). 142 + 8 = 150.
  // +1 (2026-08-12, Batu): `threes-flea-market-0815`, released by the
  // attributability ruling on the locally-owned gate — the listing names
  // "Threes Brewing Greenpoint, 113 Franklin St." outright, so the claim is
  // tied to the Greenpoint address and the second location is irrelevant.
  // 150 + 1 = 151.
  // +1 (2026-08-12, Batu): `buffalo-firefly-soundbath-0813`, released once Batu
  // allowlisted `buffalofirefly.com` — the routine's egress denies the host
  // (CONNECT 403) and Nominatim has no result for the venue name, so the
  // address that clears the geography gate could only be read from an
  // interactive session. Same attributability ruling applies: two locations
  // (Brooklyn + Richmond VA), and the site lists this session under its own
  // "Brooklyn Events" heading at the Nassau Ave address. 151 + 1 = 152.
  // +1 (2026-08-12): `macha-summer-fridays-after-hours`, the first card ever
  // authored from a `detailsInImages` source. macha-studio had been STANDING
  // DARK with zero cards because its Atom feed bodies carry no dates — every
  // schedule fact is inside the event poster. Reading the three posters found
  // exactly one live item; the other two (listening party 8/7, poetry open-mic
  // 7/31) had already passed. 152 + 1 = 153.
  // 2026-08-13 daily refresh: expiry deleted `library-wednesday-programs-0812`
  // (ended 8/12), then 8 adds. 153 - 1 + 8 = 160. Six of the eight fill the
  // BACK of the 14-day window off sources the run had already fetched: the
  // Greenpoint Library's own Solr calendar carried five uncarded days inside
  // the window (8/15, 8/18, 8/19, 8/25, 8/26) while the deck only held
  // Thu/Fri/Sat cards, and Troost's calendar carried 8/27 — the exact
  // "the source published it and we did not card it" shape the coverage gate
  // exists to surface (it had flagged troost 8/27). The other two are new
  // supply from this run's diffs: NYC Parks' It's My Park volunteer shift at
  // McGolrick (8/23) and the library's Sips & Scholars lecture at McCarren
  // Parkhouse (8/25).
  // ...and one delete: `selformer-summer-fling-0815`. The offer's own terms
  // were "available through Aug 15 or until we're full, whichever comes
  // first", and the string "Summer Fling" no longer appears anywhere on
  // /plans-pricing — the page now lists a different membership set. A deal
  // whose source has stopped stating it does not get to coast to its printed
  // end date. 153 - 1 + 8 - 1 = 159.
  // 2026-08-13 (second run, scoped to moon-bunny-aerial): +1, the Two-Day
  // Circus Camp for 4–7s on 8/27–28. The source had carried it all along —
  // it surfaced while fixing the 9am-camp bug, from the same feed that was
  // already snapshotted. 159 + 1 = 160.
  // 2026-08-14 daily refresh: expiry deleted 8 fully-past events (Troost 8/13,
  // the library's 8/13 day-card, the BCC tote workshop, Film Noir's film club,
  // the CIBONE Hozubag pop-up, the 61 Franklin reading, Zumba Under the K and
  // the Buffalo Firefly sound bath), then 6 adds. 160 - 8 + 6 = 158. Three of
  // the six are Longevity Stick at Transmitter Park — 38 lines of it sat in
  // `.ingest-cache/go-green-bk.txt` uncarded, the "the source published it and
  // we did not card it" shape again. Its schedule is irregular (Thursday
  // mornings weekly, Friday evenings on 8/14 and 8/28 but NOT 8/21), so the
  // Thursdays are one recurring card and each Friday is its own — a
  // `recurrence.days: ["fri"]` card would have invented an 8/21 sitting. The
  // other three: the library's 8/27 Thursday programs and Film Noir's ARREBATO,
  // both new in this run's diff, and Good Room's 8/28 bill, which is the date
  // the coverage check flagged as a GAP.
  // Also 2026-08-14: the Cycle Alliance Period Pantry adds NO card. It is a
  // standing amenity of the branch, so the 2026-08-12 exhibition ruling puts it
  // on `greenpoint-library` — count unaffected, and that is the point.
  // 2026-08-14 (coverage-gate close): +2. The comedy club's GAP for 8/26-8/28
  // was two separate things wearing one flag. The three weekly showcases were
  // verified-through 8/22 while their own quotes already named later dates, so
  // the recurrence expansion stopped short — those are verified-through bumps,
  // not new cards. The genuine uncarded supply was two ONE-OFFS the date-based
  // check could not surface on its own: Isa Medina (8/22 6pm) sits on a date
  // the Saturday showcase already covers, so it never flagged at all.
  // 158 + 2 = 160.
  // 2026-08-15 daily refresh: expiry deleted 8 fully-past events (the library's
  // 8/14 garden day-card, SummerStarz Project Hail Mary, WORD's open mic,
  // Troost 8/14, Good Room 8/14, the Moon Bunny 4-7 camp, Film Noir's ARREBATO
  // and the 8/14 Longevity Stick), then 9 adds. 160 - 8 + 9 = 161. Four of the
  // nine are Film Noir Cinema — DENCHU-KOZO (8/16), CULT CINEMA (8/19), FILM
  // CLUB (8/20) and FILM NOIR MONDAY (8/24) — all dated off the ISO startDate,
  // never the fullUrl slug, which for three of them points at a reused 2019/2020
  // programme page. FILM NOIR MONDAY sits on the same night as PHEDRE and is a
  // separate card because it is a different BILL, not a later sitting: the
  // cinema's own detail page lists "Earlier Event: August 24 / PHEDRE" beside
  // it. The other five: Troost 8/29 and Good Room 8/29 (both the far end of the
  // 14-day window), the library's 8/28 Sensory Garden Hour, and the Matches
  // signage story. 160 - 8 + 8 = 160.
  // A NINTH card was authored and HELD, not dropped: NBCB's free 8/22 canoe
  // paddles. Its whole evidence base is the BPL North Brooklyn community
  // calendar, and `ingest:quotes` cannot reach that snapshot — greenpoint-library
  // declares `citeHost: bklynlibrary.org` and sits earlier in the roster, so it
  // claims the shared host key and bpl-north-brooklyn-calendar is never
  // registered in the verifier's host map. The card is real and sourced; the
  // roster is the defect — fixed in this branch by making the verifier's host
  // map hold a LIST per host instead of first-wins, so the card ships. 160 + 1 = 161.
  // Also 2026-08-15: the 8/27 library day-card gained Teen Tech Time and Sunset
  // Storytime, so its end clock moved 16:00 → 18:30 — an edit, not an add.
  // +1 (2026-08-15, closing the coverage gate's last comedy-club line):
  // `comedy-goo-goo-0829`. Bumping the Saturday showcase's verified-through to
  // 8/29 satisfied the DATE the gate checks, which is exactly why this card had
  // to be authored anyway — the gate reconciles dates, not bills, so a named
  // one-off at 6pm went invisible the moment the 8pm showcase covered its day.
  // A different bill is a different card (Batu, RULING-SITTINGS-VS-BILLS). 161.
  // +1 (PR #39): the NBCB canoe card, unblocked by the verify-quotes host-map
  // fix. 161 + 1 = 162.
  // +1 (PR #40): Tend Greenpoint's 20%-off plant sale. Held since 8/14 on a
  // missing address, and the block was never what the hold said it was — the
  // bare host was already allowlisted and CONNECTed fine; the 403 was on the
  // redirect target, www.tendgreenpoint.com. With that opened the shop's own
  // page states the address outright. 162 + 1 = 163.
  // 2026-08-17 Monday full refresh: expiry took 16 (163 → 147), then −1 delete
  // and +4 adds. The delete is the Marianella anniversary sale: the shop's own
  // 8/16 email said "The anniversary sale ends at midnight tonight.", so the
  // expiry FLAG resolved to drop, not to a bumped verified-through date. The
  // adds are two Troost nights that rolled into the 14-day window (8/30, 8/31),
  // It's My Park at Transmitter Park on 8/30, and Tend Greenpoint's
  // stack-on-sale markdown through 9/7. 147 − 1 + 4 = 150.
  // +3 (2026-08-17, Action City Comics onboarding): three ticketed TCG
  // tournament nights (Flesh & Blood Armory 8/18, One Piece 8/19, One Piece
  // OP-17 prerelease 8/26) sourced from the shop's own homepage events widget.
  // 150 + 3 = 153.
  // +1 (2026-08-17, sidewalk-signage catch): Charlotte Patisserie's backyard
  // Thursday movie series, sourced off their own Instagram/Facebook posts
  // (lineup through 8/27) after Batu photographed the sandwich-board sign
  // outside 596 Manhattan Ave. 153 + 1 = 154.
  // 2026-08-18 daily refresh: expiry deleted 3 cards that ended 8/17
  // (flowercat-cozy-reading-0817, word-journal-club-0817,
  // bcc-knitting-101-0817), then 7 adds. 154 − 3 + 7 = 158. Two are NYC Parks
  // Movies Under the Stars screenings that rolled into the 14-day window
  // (McCarren 8/26, McGolrick 8/29); one is a Troost night on 9/1 that the
  // coverage gate had flagged as an uncarded date; one is the library's Chair
  // Yoga on Monday 8/24, the branch's only program that day; and three come
  // off Moon Bunny Aerial — the 13–16 weekend camp (8/29–30) and the 8–12
  // two-day camp (9/1–2), both of which had been deferred as past-horizon and
  // are now inside it, plus the back-to-school kids' pack discount that its
  // newly persisted /discounts detail page states runs until Sept 4.
  // 2026-08-19 daily refresh: expiry deleted 4 cards that ended 8/18
  // (troost-julia-kwamya-0818, gather-sound-bath-0818,
  // library-tuesday-programs-0818, action-city-fnb-armory-0818), then 9 adds
  // and 1 correction-deletion. 158 − 4 + 9 − 1 = 162. Six adds come off the
  // Greenpointers 8/20-26 roundup — the 61 Franklin St. Garden plant-biology
  // talk (8/20), Good Baklava's guest schmear at Acme's Fish Friday (8/21),
  // the LOMA Collective pop-up at Giggles & Wiggles (8/22), Le Studio
  // Anthost's pillow workshop (8/23), Madeline's comedy show (8/25) and LIVE
  // ISLAND at Loft Story (8/26); two are Hana Makgeolli (the Dusky Kitchen
  // dessert pop-up 8/23 and the 8/27 tour and tasting); one is DJ FRANTZ at
  // Troost on 8/21, which REPLACES troost-danny-ramos-0821 — the venue
  // calendar's 8/21 instance is titled DJ FRANTZ and Danny Ramos has moved to
  // 9/18, so the old card was misdated and its quote no longer existed in the
  // snapshot.
  // 2026-08-19 Wednesday Greenpointers pull: expiry took nothing (the morning
  // run had already cleared today) and 1 add. 162 + 1 = 163. The add is the
  // Peter Luger takeover at Threes Brewing on 8/24, one of the 12 roundup items
  // the morning run held for want of an address. Its Partiful listing answered
  // this run and settles both blockers at once: it names "Threes Brewing
  // Greenpoint" outright, which is attribution under the 2026-08-12 rule, and
  // it states the 5–8pm window the roundup never did.
  // 2026-08-20 daily thin: expiry took 6 passed 8/19 events (163 → 157) and the
  // run added 8. Two close coverage gaps the reconciler had flagged as owed
  // cards — Cult Cinema on 8/25 and DJ Barba Yiorgi on 9/3. Two are Golden
  // Drum's first cards ever: the Yara Yaworâ drum workshop (8/24) and the
  // Sacred Roses workshop (8/25), both $40 and 7–9:30pm, the second resolved by
  // reading a detail page the roster's `detail.limit: 8` had crowded out. The
  // rest fill the back of the window: Haze at Film Noir tonight, the 9/1 and
  // 9/2 library day-cards, and Moon Bunny's 9/3–4 camp for 4–7s. 157 + 8 = 165.
  // 2026-08-21 daily thin: expiry took 10 passed 8/20 events (165 → 155) and
  // the run added 10. Eavesdrop's own calendar came back to life carrying dated
  // listings with clock times — its first cards since the venue card was
  // deleted — and four of them ship (the 6pm sets on 8/22, 8/23, 8/29 and
  // 8/30); the eight midnight sets are HELD, because a 00:00 start is the
  // all-day sentinel in eventWindow.js and the card model has no way to say
  // "starts at midnight". One is Greenpointers' story on the rally asking the
  // MTA to move December's G shutdown. The rest fill the far edge of the
  // window, which is 9/4: Terror Terroir at Film Noir, First Vinyl Fridays at
  // Troost, Lloyd's Bday at Good Room, and the Sensory Garden Hour's last
  // stated Friday. Plus Babies & Books on 9/3. 155 + 10 = 165.
  // 2026-08-24 Monday full: expiry took 24 passed 8/21–8/23 items (165 → 141)
  // — the biggest single clear-out since launch, because a Friday-to-Sunday
  // weekend drains three days of nightlife at once — and the run added 10 and
  // deleted 1. 141 + 10 − 1 = 150. Four adds close coverage dates the
  // reconciler had flagged as owed cards: Troost 9/5 and 9/7, Good Room 9/5 and
  // 9/6. One closes Film Noir's 8/27 gap (Film Club). Three come from
  // Greenpointers: Ashbox Cafe closing after 18 years, its 8/25–8/28 farewell
  // inventory sale, and Kimchee Market's search for a new space. The last two
  // are Town Square's standing youth programmes — Scouts BSA Troop 26 and Cub
  // Scouts Lucky Pack 7 — which resolve the reconciler's UNMARKED STANDING?
  // flag by supplying the missing cards rather than by editing the roster.
  // The delete is bcc-kids-sewing-camp: Brooklyn Craft Company's page no longer
  // states the camp anywhere and the source shrank 108 lines, so a recurring
  // card past its verified-through could not be re-verified and does not get
  // renewed on faith.
  // 2026-08-25: +5 Eavesdrop midnight sets (8/27–8/31), released by the
  // `allDay` ruling — the venue's own "12midnight" slot became expressible.
  // 2026-08-25 daily thin: expiry took the 6 passed 8/24 items (155 → 149) and
  // the run added 6, so the total lands back on 155 and every count below is
  // unchanged except live_music, which the Flower Cat karaoke night moves.
  // The adds: DENCHU-KOZO at Film Noir on 8/25 (its own bill, not the Cult
  // Cinema night that follows it — the venue lists them as separate programme
  // entries an hour apart); three Brooklyn Craft Company workshops off the
  // 8/06 and 8/14 newsletters, Knitting 103 on 8/25, Crochet 102 on 8/29 and
  // Beginner Patchwork on 9/6; Flower Cat's Live Band Karaoke on 8/28, free
  // entry; and the last Leaves summer writing group on 9/3, which the 8/11 run
  // deferred on horizon alone and which is now inside the window.
  // 2026-08-26, PR #49 review (Batu): +4 Bedford Slip cards. The held volunteer
  // cleanup ships at 11am-1pm — the organiser's own Partiful page for that same
  // weekend puts the block's Sunday programme at 10AM-8PM, so the listing's
  // 8:00 am header cannot be the cleanup's start and the body's stated shift is
  // the only credible reading. The same page surfaced the weekend it sits
  // inside, previously uncarded: an opening Friday evening, the Saturday-Sunday
  // daytime run, and TreesNY's tree care session. The weekend is TWO cards, not
  // one, because Friday runs 5-8PM and the other two days 10AM-8PM, and a
  // dated card's window states one sitting repeated daily — one card cannot
  // carry both patterns without lying about one of them.
  // 2026-08-26 daily thin: expiry took the 9 passed 8/25 items (159 → 150) and
  // the run added 7 — four Film Noir screenings (Kriminal and Body Melt tonight,
  // Whirlpool Thursday, the secret-title Film Noir Monday on 8/31), the Sunday
  // Longevity Stick sitting in Transmitter Park, a Greenpoint Library Tuesday
  // day-card for 9/8, and Community Board 1's Environmental Protection
  // Committee meeting on 9/3, and The Academy Blues Project at Troost on 9/9 —
  // the last date inside the 14-day horizon, surfaced by the coverage gate.
  // One deletion beyond expiry: the Tuesday morning
  // Transmitter Park yoga card. It was FLAGGED as past its verified-through
  // date, and Go Green's own series page lists no Tuesday after August 25, so
  // there was nothing to re-verify it against. live_music is unchanged at 28
  // because the Flower Cat karaoke card's own count line already moved it.
  // 2026-08-26 Wednesday Greenpointers pull: +7, all dated events off the
  // 8/27-9/2 roundup — Daniel Lee's guest night at Di An Di, Zumba at Under
  // the K Bridge Park, Culture House's poetry night, Big Night's fifth
  // birthday, The Better Club's portrait night, the Bedford Slip hot dog
  // fundraiser and Madeline's 9/1 comedy show.
  // 2026-08-27 daily thin: expiry took the 7 passed 8/26 items (164 → 157) and
  // the run added 4. Three fill the back of the window, and two of those close
  // dates the coverage reconciler had flagged as owed: Cult Cinema at Film Noir
  // on 9/1 and DJ Barba Yiorgi at Troost on 9/10, plus a Greenpoint Library
  // Wednesday day-card for 9/9. The fourth is Greenpointers' story on Simi &
  // Sol Collective opening in the old La Merced storefront at 1008 Manhattan
  // Ave. One deletion beyond expiry: comedy-wednesday-cysk, the Wednesday
  // "Comedians You Should Know" residency. It was FLAGGED as past its
  // verified-through date and its source is browser-only, so with the browser
  // path down there was nothing to re-verify it against — the same call the
  // 8/26 run made on the Tuesday yoga card. leaves-august-book-club goes the
  // same way and for the same reason — Leaves' events page is browser-only too,
  // and its August club is past both its verified-through date and its month.
  // A third deletion is a different shape: moon-bunny-two-day-camp-4-7-0903.
  // The studio's own feed reaches 9/10 and no longer lists any camp on 9/3 or
  // 9/4 — the sittings the card quotes are simply gone from the source, which
  // the post-promotion quotes check caught. 157 + 4 - 3 = 158.
  assert.equal(seed.cards.length, 158);
  const count = (pred) => seed.cards.filter(pred).length;
  assert.equal(count((c) => c.filters.includes("new")), 0, "new retired — folded into news");
  assert.equal(count((c) => c.filters.includes("news")), 29, "28 + Simi & Sol Collective's opening (2026-08-27)");
  assert.equal(count((c) => c.category === "event"), 81, "88 − the 7 events that ran 8/26 − three cards their sources no longer support, + Cult Cinema 9/1, the 9/9 library day-card and Troost 9/10 (2026-08-27)");
  assert.equal(count((c) => c.category === "discount"), 6, "7 − the Tend plant sale, which ran out 8/21");
  assert.equal(count((c) => c.category === "news"), 18, "16 + Ashbox Cafe's closure and Kimchee Market's move (2026-08-24)");
  assert.equal(count((c) => c.filters.includes("live_music")), 29, "unchanged 2026-08-27: Troost's 8/26 Louis Prince night expired out and DJ Barba Yiorgi on 9/10 replaced it");
  assert.equal(count((c) => c.category === "subscription"), 27, "25 + Town Square's two scout programmes (2026-08-24)");
  // 2026-08-08: Newtown Creek CAG deleted — it ran 7/29, is a one-off, and had
  // sat past its own end date ever since (hidden by isExpiredCard, but still
  // in the deck). Expiry now FLAGS stale non-event/deal cards so the next one
  // surfaces for a decision instead of rotting unseen.
  assert.equal(count((c) => ["g_train_support", "civic_action", "support_local"].includes(c.category)), 4, "3 G-train cards + Film Noir support");
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
  // 2026-08-10: +2 from the first non-degraded run — Maison Jar's monthly bulk
  // refill (recurring/verified-through: the page states a monthly cadence but
  // never a date, which the no-stated-end-date rule fills rather than holds)
  // and Selformer's Summer Fling promo, whose endsAt is the source's own
  // "available through Aug 15" rather than an edition-window default.
  // 2026-08-12: −1. bk-youth-ballet-trial-class was FLAGGED past its 8/9
  // verified-through and deleted rather than re-verified — the source is a
  // 169-byte JS shell to plain fetch and the browser path is down, so there is
  // no current source for the price. It is in watchItems, not lost.
  // +1 (2026-08-12): the Bios herbalist consult — a standing offer with no
  // stated end date, so `recurring: true` + verified-through per the
  // no-stated-end-date rule, not a hold.
  // 2026-08-13: −1. The Selformer Summer Fling was DELETED, not expired — the
  // string "Summer Fling" is gone from /plans-pricing entirely, and the offer's
  // own terms were "available through Aug 15 or until we're full, whichever
  // comes first", so the page pulling it is the offer ending. Caught by
  // ingest:quotes, not by the calendar: its printed endsAt was still 2 days out.
  // 2026-08-15: +1 — Tend Greenpoint's plant sale, dated (through 8/21) and so
  // correctly NOT recurring; the email states its own closing date.
  // 2026-08-17: −1 Marianella (the shop's own 8/16 email closed the sale at
  // midnight, so the expiry FLAG resolved to a drop), +1 Tend Greenpoint's
  // additional 20% off already-reduced stock, dated through 9/7 by its own
  // terms line and so correctly NOT recurring.
  // 2026-08-18: +1 — Moon Bunny Aerial's back-to-school discount on the kids'
  // dance ($100 → $90) and aerial/acro ($160 → $144) packs. Dated by its own
  // "until Sept 4th" line and so correctly NOT recurring. This is a fresh card,
  // not the revived `moon-bunny-back-to-school` that expired 8/17 on its own
  // 8/15 deadline — a different offer read off the newly persisted
  // /discounts detail page.
  // 2026-08-24: −1 — the Tend Greenpoint plant sale ran out on its own 8/21
  // end date and expiry removed it. No new deals this run.
  assert.equal(deals.length, 6);
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
  // 2026-08-17: moon-bunny-back-to-school expired out (its 8/15 deadline). The
  // rule it pinned is asserted as a CLASS below instead of on one id, so the
  // next dated deal inherits the check rather than needing a test edit.
  assert.equal(seed.cards.find((c) => c.id === "moon-bunny-back-to-school"), undefined, "expired 2026-08-17 — its own 8/15 deadline passed");
  for (const c of deals.filter((d) => !d.recurring)) {
    assert.ok(c.endsAt, `${c.id} is a dated deal and must state its own endsAt`);
  }
});

test("news cards name their publisher and sit in the news layer", () => {
  const news = seed.cards.filter((c) => c.category === "news");
  // 2026-07-27: +3 civic-issue cards (Monitor Point approval, McGuinness
  // redesign construction, Meeker Plume monitoring) — coverage-gap fix.
  // 2026-08-12: +1 — the Star Deli viral-boost story (Greenpointers 8/11).
  // 2026-08-15: +1 — Matches signage at the old Enid's space (Greenpointers 8/14).
  // 2026-08-21: +1 — the rally asking the MTA to move December's G shutdown
  // (Greenpointers 8/20). It joins the G-train news cluster rather than the
  // campaign cards: `g-advocacy-mta`'s link list is pinned below as the
  // reciprocal pair it has been since 2026-07-03, so the story links to
  // `g-train-closures` and `gtrain-sales-survey` only.
  // 2026-08-24: +2 from Greenpointers — Ashbox Cafe closing after 18 years
  // (1154 Manhattan Ave, the chef citing arthritis) and Kimchee Market looking
  // for a new home ahead of a six-story condo on its Greenpoint Ave site. The
  // Ashbox closure is paired with a dated card for its farewell inventory sale,
  // which is a happening and so is NOT filed here.
  assert.equal(news.length, 18);
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
    // (acme-good-baklava-0821 expired out 2026-08-24)
    // 2026-08-26 roundup: "Hosted by creative mental health community The
    // Better Club. Free, RSVP here."
    "better-club-portrait-night-0829",
    // 2026-08-10: Kindred's Thursday sunset session, same flyer as the
    // Tuesday morning card — "Free Community Yoga".
    "community-yoga-transmitter-thursdays",
    // (community-yoga-transmitter-tuesdays deleted 2026-08-26: FLAGGED past its
    // verified-through date, and Go Green's series page lists no Tuesday after
    // August 25, so nothing could re-verify it.)
    // 2026-08-12 exhibition ruling: the gallery's own Visit block states "Free
    // admission unless stated otherwise" beside the on-view dates, and the show
    // now lives on this venue card rather than a dated event card.
    "dreams-on-command",
    // 2026-08-25: Flower Cat's live band karaoke night — the listing ends
    // "Free entry! 2 drink minimum! Tip your musicians & bartender!", so the
    // entry is stated free even though the bar expects a bar tab.
    "flowercat-live-band-karaoke-0828",
    "greenpoint-trash-club",
    // 2026-08-14: three Longevity Stick sittings at Transmitter Park. The Go
    // Green detail page states the free-ness once for the whole series — "Join
    // us on select Friday evenings as we flow in our free Longevity Stick
    // Classes" — and each card quotes that line, so it covers all three.
    // (longevity-stick-transmitter-0814 expired out 2026-08-15)
    // (library-sensory-garden-0904 dropped off this list 2026-08-26: the 9/4
    // card became a grouped Friday day-card when the 3-4pm garden educator hour
    // was folded in, and only the storytime states "Free" — same grouped-card
    // rule as the other library day-cards below.)
    "longevity-stick-transmitter-0828",
    // 2026-08-26: the Sunday morning sitting, covered by the same series line.
    "longevity-stick-transmitter-0830",
    "longevity-stick-transmitter-thursdays",
    // 2026-08-05 roundup: both state free-ness in the line the card quotes —
    // "teen interns are running a free scavenger hunt" and "You can get free
    // tickets here". The 8/12 library card is NOT here: its garden club line
    // never says free. (library-tuesday-programs-0804 expired 2026-08-06.)
    // (library-tuesday-programs-0811 expired out 2026-08-12)
    // 2026-08-18: two more Movies Under the Stars screenings, same NYC Parks
    // boilerplate as the 8/19 one — "This event is FREE and open to the public."
    // (mccarren-movies-guardians-2-0826 expired out 2026-08-27)
    "mcgolrick-bird-club-0808", // "Free" on the Go Green Brooklyn listing
    // 2026-08-06: NYC Parks states "Movies Under the Stars" is free on the
    // McGolrick events page. The 8/13 and 8/14 library day-cards are NOT here —
    // same grouped-card rule as above.
    "mcgolrick-movies-eternal-sunshine-0829",
    // (nbcb-canoe-newtown-creek-0822 expired out 2026-08-24)
    // (neptune-artists-makers-market-0816 and edys-anniversary-party-0816 both
    // expired out 2026-08-17, as did threes-flea-market-0815.)
    // (paulie-gees-jabberjaw-comedy-0811 expired out 2026-08-12)
    // 2026-08-13: the library's own record for the Sips & Scholars lecture
    // (sips-scholars-parkhouse-0825 expired out 2026-08-26)
    // 2026-08-06: the 8/7 Ford v Ferrari card was DELETED, not rolled forward —
    // Town Square's own page reads "Fri. 8/07 - Ford v Ferrari >> RAINED OUT!".
    // The 8/14 screening is the next live one in the same free series.
    // (summerstarz-project-hail-mary-0814 expired out 2026-08-15)
    // 2026-08-07: the season's closing screening, surfaced by the coverage
    // check. (summerstarz-zootopia-0821 expired out 2026-08-24 — that was the
    // last night of the series, which Town Square's page dates "Fridays, J uly
    // 24th to August 21st", so nothing rolls forward here until next summer.)
    // (transmitter-saltwater-fishing-0809 expired out 2026-08-10)
    // 2026-08-12 roundup: "No rhythm required! Free, RSVP here."
    // 2026-08-26: the same NBK Parks Zumba series, back on the 8/27 roundup
    // with the same line — "No rhythm required! Free, RSVP here."
    "underthek-zumba-0827",
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
  // 2026-08-08 (ChatGPT cross-check, Bandit Running onboarded): weekly
  // Saturday group run, same standing-programming shape as the other two.
  // 2026-08-08 (SSG deals & memberships sweep): Held Space and Selformer join
  // the cluster — members-only yoga/dance/sound baths and reformer Pilates are
  // movement by the same reading as Moon Bunny. Marianella's monthly box was
  // deliberately NOT filed here: it is a bath-and-body product subscription,
  // and this lens is the movement cluster, not a wellness-adjacent shelf.
  // 2026-08-10: Kindred's Thursday sunset session joins its Tuesday morning
  // sibling — same series, second weekly slot (flyer sighting near
  // Transmitter Park).
  assert.deepEqual(wellness, [
    "bandit-running-greenpoint-runners",
    "bk-youth-ballet-adult-term",
    // (buffalo-firefly-soundbath-0813 expired out 2026-08-14)
    "community-yoga-transmitter-thursdays",
    // (community-yoga-transmitter-tuesdays deleted 2026-08-26 — past its
    //  verified-through date with no Tuesday left on Go Green's series page)
    // (gather-sound-bath-0818 — a sound bath and Reiki session, filed here
    //  2026-08-12 as bodywork in the movement cluster — expired out 2026-08-19)
    "held-space-membership",
    // 2026-08-14: Longevity Stick at Transmitter Park, "a mix of Tai Chi and
    // yoga" on Go Green's own detail page — the movement cluster this lens
    // names, and free. Three cards because the series' schedule is irregular:
    // Thursday mornings recur weekly, the Friday evenings are 8/14 and 8/28
    // only, and a recurring Friday card would have invented an 8/21 sitting.
    // (longevity-stick-transmitter-0814 expired out 2026-08-15)
    // (library-chair-yoga-0824, the branch's Monday chair-yoga hour, expired
    // out 2026-08-25)
    "longevity-stick-transmitter-0828",
    // 2026-08-26: the series adds one Sunday morning sitting, 8/30.
    "longevity-stick-transmitter-0830",
    "longevity-stick-transmitter-thursdays",
    "moon-bunny-monthly-plans",
    "selformer-memberships",
    // 2026-08-10: the Summer Fling promo is a DEAL at a Pilates studio, so it
    // double-files wellness + deals_memberships on the same reading that puts
    // a kids' discount in family_kids + deals_memberships (PR #18).
    "sparsa-greenpoint",
    // 2026-08-12: a free outdoor Zumba class — dance-as-movement, the cluster's
    // core reading, so wellness rather than arts_culture. 2026-08-26: the same
    // series returns on the 8/27 roundup, filed the same way.
    "underthek-zumba-0827",
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
    // 2026-08-17: Action City Comics onboarded — three ticketed TCG tournament
    // nights sourced from the shop's own homepage events widget.
    // (action-city-fnb-armory-0818 expired out 2026-08-19)
    // (action-city-one-piece-op17-prerelease-0826 expired out 2026-08-27)
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
    // (carcosa-malifaux-monthly-0808 expired out 2026-08-10;
    //  carcosa-hot-dog-day-0815 expired out 2026-08-17)
    "carcosa-membership-guest-pass",
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

// 2026-08-13 (Batu): `shopping` comes back as a lens, and the lens-less
// allowlist dissolves with it. The 2026-08-12 markets rule was right about the
// CLASS — retail is not arts_culture — and wrong about its destination. "Carries
// no lens" was never a design call; it was the absence of an honest one, and all
// four allowlist entries said so in the same words: "`shopping` is retired and
// there is nothing else honest to reach for". Six cards and a bespoke allowlist
// with its own staleness protocol is not miscellany, it is a lens nobody had
// named. The user-facing cost was the tell: All is 159 cards, so a lens-less
// card was reachable only by scrolling past everything or by finding its pin.
//
// Why the label is `Shopping` and not `Markets`. The deck already carries two
// farmers' markets (mccarren-greenmarket, mcgolrick-farmers-market) filed
// food_drink, and in this neighborhood "market" MEANS the greenmarket — a
// Markets chip would promise McCarren on Saturday and deliver an archival
// fashion sale, while mislabelling the showcase and the after-hours, which are
// not markets at all. Wrong in both directions. `Shopping` is the word the
// ruling itself used ("their events are shopping-related"), and the word the
// schema still uses as a CATEGORY — so it needs no invented synonym, per the
// 2026-08-02 rule that killed "What changed" in favour of News.
//
// Not a reversal of the 2026-07-26 retirement. That fold moved STANDING OFFERS
// into deals_memberships and they stay there — Marianella's sale, the Maison Jar
// refill, the WORD membership are all still deals. What did not exist in July is
// this class: DATED retail happenings. A restocked lens enters at the back of
// the bar, per ORDER IS THE BAR in cardSchema.js.
test("the shopping lens holds retail — the store and its dated run (2026-08-13)", () => {
  const shopping = seed.cards.filter((c) => c.filters.includes("shopping")).map((c) => c.id).sort();
  assert.deepEqual(shopping, [
    // The CIBONE ruling's own three: the store, and the two limited runs it
    // hosts. A shop's pop-up genuinely starts and ends, so it keeps its own
    // dated card rather than collapsing into the venue (2026-08-12).
    // (cibone-hozubag-0813 expired out 2026-08-14)
    // 2026-08-24: a closing cafe clearing its plates, cups, packaged food and
    // kitchen tools over four days. A store's dated limited run is exactly the
    // markets rule's class — a happening with a start and an end, not a
    // standing offer — so it files here and not in deals_memberships.
    "ashbox-farewell-sale-0825",
    // 2026-08-26: a dinner-party shop's fifth-birthday party — cake, champagne,
    // goodie bags and a gift-card raffle, on one afternoon. A dated happening
    // inside a store is the same class as the runs above, so it files here
    // rather than in deals_memberships, which takes standing offers only.
    "big-night-fifth-birthday-0829",
    "cibone-ote",
    "cibone-restation-showcase-0815",
    // A kids' store. It keeps `family_kids` — the audience lens it already
    // earned — and ADDS shopping, which is what makes the rule mechanical:
    // every category:shopping card carries the shopping lens. Before this, the
    // deck's two shop cards were filed by two different logics.
    "giggles-and-wiggles",
    // 2026-08-19: a visiting childrenswear label pops up inside that same kids'
    // store for one morning. A vendor pop-up is a dated retail happening, which
    // is exactly what this lens takes; it keeps `family_kids` alongside,
    // following the venue card's own filing.
    // (giggles-loma-popup-0822 expired out 2026-08-24)
    // "Drinks, try on's and wishlist building" at a jewelry studio — retail at
    // a second store, the ruling's first extension beyond CIBONE.
    "macha-summer-fridays-after-hours",
    // (The markets rule's own class — general goods, not food — was carried by
    // neptune-artists-makers-market-0816 and threes-flea-market-0815 until both
    // expired out 2026-08-17. macha-summer-fridays-after-hours still holds it.)
    // 2026-08-27: an art, design and handmade-goods store opens in the old La
    // Merced juice bar space. A new_business card for a shop takes the venue's
    // own type lens alongside `news`, the same shape as the food openings —
    // and for a retail storefront that type lens is `shopping`.
    "simi-sol-collective",
  ]);

  // VIEW or BUY, and the venue decides (2026-08-12). Both boundaries that
  // defined the rule must still hold now that BUY has somewhere to land.
  const byId = (id) => seed.cards.find((c) => c.id === id);
  // A bookshop is retail, but a book club is a thing you ATTEND, not stock you
  // buy — the case that proves the rule is about the event, not the venue.
  const bookClub = byId("leaves-august-book-club");
  if (bookClub) {
    assert.ok(bookClub.filters.includes("arts_culture"), "the book club is attendance, not retail");
    assert.ok(!bookClub.filters.includes("shopping"), "a bookshop's event is not automatically shopping");
  }
  // The reason `Markets` lost: these are markets, and they are food.
  for (const id of ["mccarren-greenmarket", "mcgolrick-farmers-market"]) {
    const market = byId(id);
    if (!market) continue;
    assert.ok(market.filters.includes("food_drink"), `${id} is a food market`);
    assert.ok(!market.filters.includes("shopping"), `${id} is groceries, not the retail lens`);
  }
});

test("no card is lens-less (2026-08-13: the markets rule got its lens)", () => {
  // Empty filters (All-only) was a placeholder in July — the six 2026-07-25
  // stragglers all resolved into Civic or Arts & Culture same day. Between
  // 2026-08-12 and 2026-08-13 it was also the sanctioned home for retail, which
  // needed a by-name allowlist and a subset assertion to tolerate expiry
  // deleting a sanctioned id mid-run. Now that `shopping` exists, no card has a
  // reason to carry no lens, so this is exact again and there is no list to keep
  // in sync: a card arriving with no lens is a taxonomy leak, full stop.
  const lensless = seed.cards.filter((c) => c.filters.length === 0).map((c) => c.id).sort();
  assert.deepEqual(
    lensless,
    [],
    "a lens-less card means the taxonomy is leaking — file it at ingest, don't re-open an exceptions list",
  );
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
  // 2026-08-13: It's My Park at McGolrick joins as a dated work shift — NYC
  // Parks files it "categories: Volunteer | It's My Park" and the body reads
  // "volunteer with North Brooklyn Parks Alliance to beautify Msgr. McGolrick
  // Park". That is the work-shift rule at its plainest: hands-on participation
  // with neighborhood stakes, no social-tail inference needed.
  // 2026-08-26 (PR #49): two Bedford Slip cards join. The Sunday volunteer
  // clean up is the work-shift rule at its plainest. TreesNY's street tree care
  // session is the harder one and it is deliberate: an info session is not
  // itself a shift, but it teaches the care of the street trees a reader is
  // then expected to give — neighborhood stewardship, which is what this lens
  // is for. The rest of that weekend is NOT here: the Friday and Saturday-
  // Sunday street cards are people eating at tables, which is exactly the
  // "merely social" the 2026-07-30 ruling evicted.
  assert.deepEqual(civic, [
    "adopt-a-business",
    "bedford-slip-cleanup-0830",
    // 2026-08-26: the Sunday hot dog stand at the same Open Street. It is here
    // for what the roundup states outright — "a suggested donation (with all
    // funds going to North Brooklyn Mutual Aid)". Mutual aid is half of what
    // this lens is named for, so the filing is mechanical, not a read of how
    // social the afternoon looks.
    "bedford-slip-hot-dogs-0830",
    "bedford-slip-tree-care-0829",
    // 2026-08-26: Community Board 1's Environmental Protection Committee — a
    // public meeting on the Meeker plume, Newtown Creek and a battery storage
    // proposal. Civic action with neighborhood stakes, not a social gathering.
    "cb1-environmental-committee-0903",
    "film-noir-support",
    "g-advocacy-mta",
    "greenpoint-trash-club",
    // (mcgolrick-its-my-park-0823 expired out 2026-08-24)
    // 2026-08-17: the same series at Transmitter Park on 8/30, with the Friends
    // of WNYC Transmitter Park as the organiser. Carded off NYC Parks' own
    // record ("categories: Volunteer | It's My Park"), which is why the work-
    // shift rule applies mechanically rather than by resemblance to the line
    // above it.
    "transmitter-its-my-park-0830",
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
    // (bk-youth-ballet-trial-class deleted 2026-08-12 — unverifiable source)
    // 2026-08-12: standing offer at no extra cost, in-store at 61 West St.
    "bios-apothecary-herbalist-consultation",
    "carcosa-membership-guest-pass",
    // 2026-08-08 SSG deals & memberships sweep (+6). The sweep asked a
    // different question than the event scan that preceded it: three of these
    // businesses had been REJECTED as event sources days earlier and turned out
    // to sell live, priced memberships. "Publishes dated events" does not
    // predict "sells a club" — see docs/review/2026-08-08-ssg-directory-roster-scan.md.
    "clay-space-membership",
    "driftaway-coffee-subscriptions",
    "falu-tinned-fish-club",
    "flower-cat-subscription",
    "hana-bottomless-makgeolli",
    "hana-sool-club",
    "held-space-membership",
    "kettl-tea-subscriptions",
    // 2026-08-10, first non-degraded run: a standing monthly bulk-refill offer
    // at the zero-waste grocery. The page states the cadence but never a date,
    // which is the recurring + verified-through case, not a hold.
    "maison-jar-refill-happy-hour",
    // (marianella-19th-anniversary-sale dropped 2026-08-17: the shop's own
    //  email closed the sale at midnight on 8/16. moon-bunny-back-to-school
    //  expired the same run.)
    "marianella-subscription-box",
    // 2026-08-18: a kids DEAL double-files family_kids + deals_memberships
    // (2026-08-03, PR #18) — 10% off the kids' dance and aerial/acro packs.
    "moon-bunny-back-to-school-2026",
    "moon-bunny-monthly-plans",
    "poochs-parlor-first-groom",
    "selformer-memberships",
    // 2026-08-15: a DATED sale (through 8/21), so it is not recurring — the
    // email states its own closing date, unlike the Marianella and Pooch's
    // offers above. The shop's second offer (20% off already-reduced stock,
    // through 9/7) is deliberately NOT folded in: two end dates on one card
    // would tell a reader the wrong deadline for one of them.
    // 2026-08-17: the second offer finally lands as its own card, exactly as the
    // note above said it should — its terms line states "Valid through
    // September 7, 2026", a different deadline from the plant sale's 8/21.
    "tend-additional-20-off",
    // (tend-plant-sale-0821 expired out 2026-08-24 on its own stated 8/21
    //  deadline — the second Tend offer above runs to 9/7 and stays.)
    // 2026-08-10: a dated promo, so it sits beside the membership card rather
    // than replacing it — endsAt is the source's own "available through Aug 15".
    "word-membership",
    "yaro-studio-membership",
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
  // 2026-08-10: expiry took the 8/8 Secret Showcase and pruned the link.
  // 2026-08-12: expiry took the 8/11 Raanan Hershberg night and pruned the link.
  // 2026-08-17: expiry took the 8/15 Carmen Lagala and 8/16 Dani Castaneda
  // nights and pruned both links.
  // 2026-08-27: the Wednesday "Comedians You Should Know" residency was dropped
  // — past its verified-through date with the browser path down, so its source
  // could not be read to renew it — and the prune took the link with it.
  assert.deepEqual(byId("greenpoint-comedy-club").relatedCardIds, [
    // 2026-08-07: the standing showcases, carded once each as recurring
    // after the coverage check flagged six uncovered showcase dates.
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

// Recurrence gate (2026-08-08). A recurring EVENT without stated days cannot
// be placed on a calendar day, so the feed shelves it and the lens reads empty
// on the day it actually happens — the Saturday-kids report. A recurring
// DISCOUNT is exempt on purpose: a standing intro offer runs on no particular
// day, and inventing one would break the truth rules.
test("every recurring event states which days it happens", () => {
  const missing = seed.cards
    .filter((c) => c.category === "event" && c.recurring === true)
    .filter((c) => !(c.recurrence?.days?.length > 0))
    .map((c) => c.id);
  assert.deepEqual(
    missing,
    [],
    "a recurring event needs recurrence.days — without it the card can never reach its own day group",
  );
});

test("a stated recurrence day agrees with the card's own first occurrence", () => {
  const wd = (iso) =>
    new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "America/New_York" })
      .format(new Date(iso)).toLowerCase().slice(0, 3);
  const wrong = seed.cards
    .filter((c) => c.recurrence?.days && c.startsAt)
    .filter((c) => !c.recurrence.days.includes(wd(c.startsAt)))
    .map((c) => `${c.id}: startsAt is ${wd(c.startsAt)}, states ${c.recurrence.days}`);
  assert.deepEqual(wrong, [], "recurrence.days must include the weekday startsAt falls on");
});

// Row contract for recurring cards (Batu, 2026-08-08 — variant C, chosen from
// four rendered live against the running app). A card stating recurrence.days
// is placed in its real day group, so three surfaces would otherwise say the
// same word: the group header ("TUE, AUG 11"), the row clock, and the kicker
// ("Tuesdays, 8pm"). The header and clock keep their jobs; the kicker gives up
// the day and keeps the substance, and the row gains a one-word "Weekly".
test("a recurring card's kicker does not restate the day its group header owns", () => {
  const DAYWORD = /\b(sun|mon|tues|tue|wednes|wed|thurs|thu|fri|satur|sat)(day)?s?\b/i;
  const offenders = seed.cards
    .filter((c) => c.recurrence?.days?.length > 0)
    .filter((c) => DAYWORD.test(c.kicker ?? ""))
    .map((c) => `${c.id}: "${c.kicker}"`);
  assert.deepEqual(offenders, [], "the day group header and the row clock already carry this");
});

// Corollary to the row contract: the UI now states the rhythm twice on its own
// ("Weekly" in the row, "Every Tuesday" in the opened detail). A summary that
// also says "a standing weekly quiz… runs every week" is the third and fourth
// statement of one fact — the same restatement the kicker just gave up.
test("a recurring card's summary does not restate the rhythm the UI already gives", () => {
  const RHYTHM = /every week|weekly|each week|week in week out/i;
  const offenders = seed.cards
    .filter((c) => c.recurrence?.days?.length > 0)
    .filter((c) => RHYTHM.test(c.summary ?? ""))
    .map((c) => `${c.id}: "${c.summary}"`);
  assert.deepEqual(offenders, [], "the row marker and the detail's when-line already carry this");
});

// Pulse-ledger invariants (2026-08-08): sourcePulse and coverageExplanations
// live in the ledger and are keyed by roster ids. A source rename that leaves
// orphan keys behind would make its pulse history unreachable — the exact
// silent decay this feature exists to catch.
const roster = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/demand-test/ingest-sources.json", import.meta.url)), "utf8"),
);
const rosterIds = new Set(roster.sources.map((s) => s.id));

test("every sourcePulse key is a roster id", () => {
  const orphans = Object.keys(ledger.sourcePulse ?? {}).filter((id) => !rosterIds.has(id));
  assert.deepEqual(orphans, [], "a renamed source must carry its pulse entry along");
  for (const [id, day] of Object.entries(ledger.sourcePulse ?? {})) {
    assert.match(day, /^20\d{2}-\d{2}-\d{2}$/, `${id}: lastCardedAt must be a YYYY-MM-DD day`);
  }
});

test("every coverageExplanations entry names a roster source, a real gapKey, and parseable dates", async () => {
  const { FLAGGED_STATES } = await import("./coverage.js");
  for (const e of ledger.coverageExplanations ?? []) {
    assert.ok(rosterIds.has(e.sourceId), `${e.sourceId}: not a roster id`);
    assert.ok(FLAGGED_STATES.includes(e.gapKey), `${e.sourceId}: gapKey "${e.gapKey}" is not a flagged state`);
    assert.ok(e.reason?.length, `${e.sourceId}: an explanation without a reason is a rubber stamp`);
    assert.ok(Number.isFinite(Date.parse(e.addedAt)), `${e.sourceId}: addedAt unparseable`);
    assert.ok(Number.isFinite(Date.parse(e.expiresAt)), `${e.sourceId}: expiresAt unparseable`);
  }
});
