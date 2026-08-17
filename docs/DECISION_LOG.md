# Decision Log

## Current Use Note

This is a historical decision log. Older entries may contain status language that was current on the entry date only; use the source-of-truth order in `AGENTS.md` for current execution authority. Entries dated before 2026-07-22 that frame the 3D isometric explorer as the product describe the parked track — see the 2026-07-22 entry.

## 2026-08-17 (second entry) — Recurring Events state their first sourced occurrence

**Amends the 2026-08-13 Schedule decision's "no top-level startDate" clause; the rest of that
decision stands.** Google Search Console rejects an Event without a top-level `startDate` as a
critical error — no rich result at all — and flagged `/e/artistic-voices-artudio` on Aug 14. The
original omission reasoned that a weekly card has no single occurrence; it missed that the FIRST
occurrence is already a claim the card makes: the card states its days and its window start, so
the earliest stated day in the window is sourced, not invented. `recurringEventJsonLd` now emits
it (verbatim `startsAt` when the window opens on a stated day with a real clock; date-only
otherwise), and `verify-aeo.mjs` checks the derivation — weekday must be a stated `byDay`, date
within a week of the window opening — instead of banning the field.

Same change: free events (`free: true`, a sourced fact) emit `offers` as Google's price-0
convention, answering GSC's "missing offers" warning where it can be answered honestly. The
other GSC wishlist fields (`image`, `performer`, `organizer`, `endDate` on sentinel-ended cards)
stay omitted — nothing sourced to put in them.

Noted, not actioned: GSC's "Page with redirect" flags are three intentional host redirects
(http/www variants) plus four expired card URLs Google crawled only after their event day —
single-day event pages often expire before Googlebot arrives, so they never index. The class fix
would be retaining expired event pages (marked past) instead of deleting them on expiry; that is
a product decision for Batu, not taken here.

## 2026-08-17 — Two rulings off the Monday refresh: markets file under `shopping`; monthly-cadence deal evidence persists in the cache

**Markets and fleas file under `shopping` (Batu).** The Aug 5 hold on BQFlea said an outdoor
market had no honest lens; that reasoning died when `shopping` came back on 2026-08-13 with the
Cibone ruling. Batu confirms the class rule: a market or flea is a shopping event, same as the
Cibone Comme des Garçons showcase (`cibone-restation-showcase-0815`, category `event`, filter
`shopping`). BQFlea stays held on its remaining blocker only — the organiser has never stated
cross-streets, and "@ Meeker Avenue" spans two neighborhoods.

**Deal evidence from monthly-cadence sources persists into the source's `.ingest-cache` file
(Batu-approved recommendation).** The gap: marianella.co is snapshotted only on first-Monday
monthly runs, so between runs there was nowhere honest to keep store-page evidence, and the
anniversary-sale drop had to lean on one-shot emails. The rule extends the existing mechanism —
the same dated `[PERSISTED <date>]` block already used to keep one-shot newsletters checkable
(Brooklyn Craft, 2026-08-15) may carry a dated fetch of a monthly source's page when a live card
rests on it. No new machinery; the quotes gate reads the same file either way.

Same change set: the fetch diff went record-aware (`sourceDiff.js`) after four library cards
advertised a canceled class — a flipped `is_event_canceled` added no line a line-set diff could
see. Field-labelled snapshots (BPL Solr, feather.rsvp, Squarespace JSON) now diff whole records.

## 2026-08-15 (third entry) — Five more rules set before the numbers arrive (P7–P11 ratified)

**Batu's decision, from the 2026-08-15 strategy review** (two independent reviews plus a scan of
what's actually on the map; `docs/launch/2026-08-15-strategy-review.md`). All five were set before
any Wave-1 data existed, which is the only time you can set them honestly.

The five rules answer what happens when things don't start rather than when they go wrong.
**P7:** if R1 hasn't started by Oct 5, the next experiment slot goes to a way of bringing people
back that needs no email list (R4 anonymous save or per-lens `.ics`), and the late-October demand
read is labeled as measured without one — a miss under that label reads as product-plus-missing-
mechanism unresolved, never as product failure alone. **P8:** a demand pass built only on September
and October cohorts is provisional until a November-or-later cohort clears the same bar — the
counterpart to the existing rule against reading raw December–February numbers. **P9:** the
Instagram carousel test starts automatically at the first readout on or after Oct 6 if tagged
sessions across every sent link are still under 50 (it may also enter earlier by normal proposal).
**P10:** citations and AI referrals get their own readout lines, and rising citations with flat
sessions counts as Loop C working, so H5's fail branch can't fire on it; llms.txt stays up with
zero value booked against it. **P11:** when Q1 finishes, the freed slot goes to the arts and
culture wave, Film Noir first.

Also decided: **Q2 posts Tuesday Sep 8**, not Wednesday Sep 2, because Labor Day empties the
earlier date. The **kids roster adds go through the 8/24 ingest** (PS 110/34/31 PTAs, GWYSL, The
Play Lab, GAMA, Artudio, St. Stans Academy, plus a roster entry for NY Society of Play) so their
events are carded before the September sends. **`gtm-state.json` becomes the real send log**, with
a `shared?` field in both it and the roster table recording whether the org posted the link itself
— confirmed from Monday roster snapshots, never inferred from sessions.

Rule changes applied the same day: growth-engine §1/§2/§4 and its "Explicitly not doing" list,
business-model §4 (seasonality), and the growth-weekly skill (readout lines + send-log fields).
Owner: Batu.

## 2026-08-15 (second entry) — The launch plan gets a cockpit, and the state file is the source of truth

**Batu:** "I feel like I don't have a cockpit." The launch and GTM plan is spread across five docs and
four readouts — ~1,200 lines of prose — with no view that answers *where are we, what's next, what's
the goal, why does it matter* without re-reading all of it.

**The decision: a machine-readable state file, and a page generated from it.**
`docs/launch/gtm-state.json` holds phases, milestones, experiments (hypothesis · pre-registered rule ·
target · actual · verdict · implication), the four gates, metrics, the send log, open decisions, risks
and the operating rules. Every record carries a `source` pointer back to the doc and date it came from,
so nothing on the page is unattributable — the same rule the cards live under.
`scripts/build-cockpit.mjs` renders it; the page never holds a fact the state file doesn't.

**Why generated rather than written.** A hand-maintained summary drifts, and a drifted cockpit is worse
than no cockpit — it launders stale numbers into confident ones. So the Tuesday growth routine now
writes the state file as **step 4.5, in the same commit as the readout**, the same way a new source
domain has to land in `.claude/settings.json` in the same change. The cadence the readouts already run
is the cadence the cockpit updates on.

**Two constraints written into the skill.** The operator may never write a verdict Batu hasn't
ratified — a computed read is `not yet read` or the rule's own word (`hold` / `continue` / `kill`), and
a decision stays in `openDecisions` until it lands here. And an unknown stays `null`, which the page
renders as `—`; an experiment that hasn't been read shows as unread, never as a zero. No figures from
`docs/private/` enter the file (2026-07-28 sensitivity split).

Published privately as an artifact rather than a route in the product: it is an internal instrument,
and putting it in the app would make an ops view part of the resident-facing deploy. It borrows the
II-C palette but reads as an instrument panel, not the product.

**Backfilled 2026-08-15** from the ops plan, launch runbook, seeding roster, growth engine,
business-model §4, channel-links and the four readouts. 676/676 tests pass.

## 2026-08-15 — Seeding motion adversarially reviewed; pre-registrations P1–P6 ratified; Q2 moves to back-to-school week

**Decision (Batu), after a two-pass adversarial review of the seeding motion** (independent
clean-context critiques: measurement/experiment design · field reality; full findings and ratified
text in `docs/launch/2026-08-15-seeding-roster.md`). The wave splits: **warm re-invites + the three
Q1 org notes (Library, Brooklyn Craft, Town Square) go 8/17–19; Q2 (parents post) moves to the
Sep 1–8 back-to-school window**, where the feed's fall-registration inventory is the story and the
week-2 return read lands on the wedge's strongest week instead of its emptiest (post-8/21 the dated
kids inventory collapses — a kill would have read on a supply artifact).

**Ratified pre-data, before any send** (the legitimacy window pre-registration doctrine requires):
**P1** broadcast-seed contamination label — the organic->50% lens and the demand gate's "majority
unprompted" clause are unreadable for 4 weeks after any broadcast seed, and the ~Sep 15 provisional
readout carries this label (untagged echo + cookieless identity rotation + FB-webview localStorage
fragmentation read seeding as organic; the same mechanism asymmetrically deflates Q2's return
metric) · **P2** rule 2a carve-out — 2a governs pre/post reads; contemporaneous-control designs
(R1, Q2) are exempt, and "a Sep read" means the data window, not the readout date · **P3** Wave-2
gate defined — "attribution confirms" = every sent `src` shows ≥1 session within 7 days; channel
performance explicitly does not gate Wave 2 · **P4** whole-wave-silence branch + org-type taxonomy;
org-type kill clock suspended for August · **P5** slot/clock hygiene — Wave-2 channels extend
Q1/Q2's slots; Q3 sits outside the max-3 cap; Q experiments get completion conditions; R1's trigger
ratified (first Monday after ≥10 signups with ≥1 segmented, supersedes "first Monday post-launch")
· **P6** the 8/18 mid-wave readout carries a no-read instruction. Rule amendments applied to
growth-engine §1/§2/§4/§6 same day.

**Also:** Q2 messenger Rana confirmed by Batu (member of a target group, personally willing; own
words, exact tagged link, one group; Laura is the fallback). Two code items approved and shipped
TDD: the `cards` target kind in `sendPreflight.js` (card-level outbound claims get machine
preflight; fixes the class for every multi-venue org) and the `?lens=` deep-link (a channel link
that promises a view lands on it). Open before Q2: FB in-app webview verification on real devices.

## 2026-08-14 (third entry) — A different time is not a different card; a different bill is

**Batu, asked for the rule rather than the instance.** Greenpoint Comedy Club runs an 8pm and a 10pm
showcase on Fridays and Saturdays. The deck carried the 8pm sittings and not the 10pm ones, and the
question was whether the late show is a second card.

**The ruling: one card per BILL, naming every sitting. A second card only when the second item has
its own name and lineup.** The test is the reader's decision — *sittings differ by when you turn up,
bills differ by what you see.* So the Friday 8pm and "(Later)" 10pm showcases are one card, while
`comedy-cartoon-strips-0827` stays separate from the Thursday showcase that runs the same night.

**This was already the deck's grammar; it just had not been written down.**
`library-thursday-programs-0820` is one card covering five programs from 10:30am to 6pm, and across
160 cards exactly ONE venue-day carries two dated cards — Transmitter Park on 8/14, a fitness class
and a movie by different organisers. One-card-per-venue-per-day was the de facto rule and two cards
was the anomaly, arising when the *things* differ rather than the *times*.

**The deciding argument was the scan layer, not tidiness.** The 2026-08-14 tester read the feed as
uniform rows with no standout signal, and the comedy club is the densest venue in the deck (10 of
160 cards). Splitting by sitting would put "The Friday Showcase 8pm" directly above "The Later
Friday Showcase 10pm" every Friday — the exact failure that tester named, applied where it already
hurts most. The accepted cost is calendar precision: one card exports one `.ics` at the first
sitting, so a reader attending the 10pm show gets an 8pm entry. That is recoverable at the ticket
page; an unscannable feed is not.

**And the rule exposed a live bug it had to fix to be honest.** `occurrenceEndMinutes` retires a
card **60 minutes after start** when `endsAt` is the `23:59` unsourced-end sentinel. So a grouped
card sitting on that sentinel vanishes before most of what it advertises: `library-friday-garden-0814`
(starts 10:30, summary names 3pm) was invisible from **11:30am**, and `comedy-friday-showcase` died
at 9pm while its own kicker advertised a 10pm show. Only 2 of the 10 library day-cards were on the
sentinel — the other 8 already carry real end times (16:45, 19:30, 17:30…), so this was two
stragglers against an established pattern, not a design gap. Both corrected to sourced clocks.

Also corrected in passing: `comedy-saturday-showcase` billed the late show as the "Secret Showcase",
a name appearing **zero times** in the source, which calls it "The Late Saturday Showcase".

## 2026-08-14 (second entry) — A rule that lives only in prose is not a gate

Two defects, found by chasing one failing check. Both are the same shape: **a mechanism that was
built correctly and then wired into only one of the places that needed it.**

**1. The truth gate was never on the gate list.** `npm run ingest:quotes` was created by the
2026-08-12 ruling because a fabricated quote had reached production. It was written into SKILL.md's
truth section as a rule — *"a card whose quote does not match fails into the hold pile"* — and it was
**never added to "Run-level gates — all must pass before ANY push"**, which had six entries and is
the list a run actually executes. So on 2026-08-14 an auto-shipping run pushed
`marianella-19th-anniversary-sale` to production while that check was failing. Nothing malfunctioned;
the checklist simply never asked. It is now gate 7, and **exit 1 HOLDS the card** rather than merely
disqualifying auto-ship the way the coverage gate does — an unverifiable quote is the one failure
that must not reach a reader.

The card itself was **honest**, which is the part worth remembering. Its lines *"50% off sitewide.
Free shipping on every order."* and *"Closing this week. Once it's gone, it's gone until next year."*
are verbatim from a Marianella email of 2026-08-13 (sender in `senderRegistry`, locally-owned gate
cleared) — confirmed by reading the message, not the ledger's paraphrase. What was missing was the
**evidence**: the email was never written to disk, so the verifier mapped the card to `marianella.co`
by host and checked email text against a store-page snapshot. **A card may legitimately assemble a
quote from two evidence bases while the verifier maps it to one source.** Persisting the email as
`## [NEWSLETTER PERSISTED …]` resolves it. The first instinct — that the card overstated a local
business's discount — was wrong, and acting on it would have deleted true claims about a real shop.
*Read the source before believing the alarm.*

The same source had **no `.ingested.txt` at all**, and only `*.ingested.txt` is tracked, so its
evidence base existed nowhere in git and a cloud run from a fresh checkout had no snapshot for it.
Now promoted and committed.

**2. Gate 5 punished doing the right thing.** The content-only file set omitted
`.ingest-cache/*.ingested.txt` — which **step 4.4 mandates every run write**, and which the evidence
rule requires whenever a newsletter or flyer is read. As written, a run that correctly persisted
evidence produced an "outside the set" file and disqualified its own auto-ship. That is a live
incentive to skip persisting, which is exactly what happened. Added to the set.

**3. The carry-forward fix had a sibling caller, and it re-shipped the bug.** 2026-08-13 made
`--mark-ingested` non-destructive. But the FETCH path still did `writeFileSync(snapPath, text)`,
overwriting `<id>.txt` wholesale — so a block persisted into a **working** snapshot was destroyed by
that source's next fetch, in the window before the run ever promoted a baseline. A newsletter read
has no URL to re-fetch, so that window is precisely where it lives. `writeSnapshotPreservingBlocks`
now covers it, proven on real data: a forced re-fetch of marianella that changed the page by 20
lines carried the email block forward and printed what it rescued.

This is the **third** instance of the 2026-08-13 lesson (*fix the class, not the caller*), and this
time the re-shipped bug was in the fix for the previous instance. The audit that catches it is
mechanical: **when wiring a general mechanism, enumerate every caller that writes the same artifact
and cover them in the same change.** Both snapshot writers are now covered; there are only two.

## 2026-08-14 — The exhibition rule was never about art: a standing amenity belongs to its place

**Batu, ruling on the one card PR #37 held.** The Cycle Alliance's period pantry at Greenpoint
Library was held on two questions — *which lens?* and *is it even a dated event?* — and the second
one dissolved the first.

**The ruling: extend the 2026-08-12 exhibition rule past galleries.** A standing amenity of a place
belongs on that place's card. The pantry folded into `greenpoint-library`; **no event card was
authored**, so the deck stays at 160 and the `no card is lens-less` assertion stays exactly `[]`.

**Why the lens question never needed answering.** It was genuinely unanswerable as posed: free-supply
mutual aid reads like `civic`, but `civic` is hands-on *participation* with neighborhood stakes and
taking from a pantry is not that; the source's own tags say "health and wellness", but `wellness`
here is the movement cluster (yoga/pilates/dance/run). The run filed it lens-less and flagged it
PROVISIONAL. **That a card cannot be filed under any lens is evidence it is not that kind of card** —
a venue card is filed by what the venue *is*, and a standing amenity inherits that. The lens question
was a symptom of the category error, not a separate problem.

**The mechanical tell, so the next one never reaches a human: the source contradicting its own date
field.** The BPL calendar carries the pantry as a Saturday record with `ds_event_start_date` and a
10–5 span, while `ts_body` says *"Located in the Teen Zone (Eco Lab 3) on the second floor,
**Monday-Sunday** during branch open hours"*. When a listing's body describes availability wider
than its own record's window, **the record is a listing convention and the body is the fact** —
file it on the venue. Written into SKILL.md under the exhibition rule.

**Bounded deliberately.** This is not licence to fold recurring events into venue cards: a weekly
storytime is still a happening you attend at a time and stays a dated card. The line is
*happening-at-a-time* vs *state-of-a-place*, which is the same line the gallery rule drew — the
2026-08-12 entry just drew it on galleries because galleries were the instance in front of it. Same
error shape as the 2026-08-13 "fix the class, not the caller" finding.

**The pantry recurs weekly** (8/22 was in the same snapshot), so a card-by-card answer would have
re-asked this every Friday. It is answered once.

Also in the same PR, and the more consequential half: **promotion may add evidence, never remove
it** (`persistedBlocks.js`). `--mark-ingested` had been copying the fresh snapshot over
`<id>.ingested.txt`, deleting any `## [DETAIL]` / `## [R1 PERSISTED]` / `## [IMAGE READ]` block the
run's fetch had not returned — a failed detail page, or a flyer that has no URL to fetch at all.
It fired in production on 2026-08-13 **after every gate had gone green**: `ingest:quotes` read
verified=35/mismatch=0 immediately before the command and verified=30/mismatch=13 immediately after,
with nothing re-fetched in between, and `--all` put the real number at 20. The gated count
understated the damage by more than half because clobbered evidence does not respect the gate's
`createdAt` cutoff. Recovery was manual, out of `git HEAD`. **The roster note that was supposed to
prevent this — *"CARRY THE [R1 PERSISTED] BLOCKS FORWARD when re-marking this baseline"* — was a
warning, not a mechanism.** Now it is code, and the run prints what it rescued. SKILL.md step 4.4
additionally requires `ingest:quotes -- --all` **after** promotion, not only before: the verifier
reads the baseline, so a pre-promotion check verifies the previous file and learns nothing about what
the run is shipping.

## 2026-08-13 (ninth entry) — First outbound send: friends & family, WhatsApp

Batu sent the friends-family re-invite tonight, **~6:30pm, to a small group over WhatsApp** —
the first outbound send since launch readiness closed (L1–L11, 2026-08-02/06) and the first to break
the "Wave 1 deferred" streak recorded on 2026-08-06, 2026-08-11, and 2026-08-12. Link carried
`?src=friends-family` (row added to `channel-links.md` same day, split out from `wave2` and from the
three individually-tracked testers — `michael`, `laura-edmond`, `perri` — who keep their own rows).

Not the full Wave 1 as specified in the launch plan (Q1 org notes, Q2 parents post): a narrower,
lower-stakes first move — the sneak-peek group, not cold outreach. Q1/Q2 remain unsent.

**Next:** spot-check `src=friends-family` lands in PostHog within a day (channel-links.md pre-send
checklist), or let Tuesday's Growth Operator readout (2026-08-18) pick it up from the pull.

## 2026-08-13 (eighth entry) — A fix wired into one branch is not a fix

Batu on stoopwise.com at 6:13pm: **the feed opened with a 9am event** — a Two-Day Circus Camp at
Moon Bunny Aerial, nine hours finished, leading the Today group. This is the *same report* as the
2026-08-08 7:37pm one (the Today group led with a greenmarket, a bird club and a run that had all
finished that morning), and the machinery built to fix it was present, correct, and not running.

**Root cause — the occurrence clock was gated to weekly cards.** The 2026-08-08 fix added
`nextOccurrence`/`occurrenceEndMinutes`, whose model is general and right: *a sitting's real window
is the TIME OF DAY of `startsAt`…`endsAt`, applied to the day it lands on.* But `groupByDay` called
it behind `card.recurring && card.recurrence.days.length > 0` — because the three cards that
prompted it happened to be weekly. Every **multi-day one-off** fell through to `isActiveOn`, which
compares calendar days and never asks the clock, so it sat in Today **at its span-start time on
every day of its span**. The gate is now `!standing` (a recurring card with no stated day still
belongs on its shelf); placement only ever moves a card *forward* to a day it genuinely occurs on,
so nothing can be hidden by it.

**It was not one bad card.** The same deck carried six more in the identical shape, two of them
scheduled to repeat the bug for five consecutive days: the Aug 17–21 weekday camp, the Aug 24–25
camp, two Film Noir multi-night runs, and the month-long CIBONE showcase. A three-night film run led
Today at 7pm all day on nights two and three.

**The durable lesson is about the shape of the 08-08 fix, not about dates.** The instance was fixed
and the class was left open: the general mechanism was built, then wired to the one branch where the
bug had been *observed*. **When a fix introduces a general mechanism, the reviewable question is
which callers do NOT get it, and why** — an exemption is a claim that needs a reason, and here there
was none, only the accident of which three cards Batu happened to look at. Both reports are one bug,
reported twice, five days apart.

**Second cause, in the data: the source stated real end times and the card discarded them.** The
Moon Bunny feed gave two discrete sittings — `start_at: 2026-08-13T13:00:00Z / end_at:
2026-08-13T19:00:00Z` and the same pair for 08-14, i.e. **9am–3pm each day** — and the card
flattened them into one span, `startsAt` from day one and `endsAt` from day two, asserting a
continuous 30-hour event running overnight. Batu: *"the events have end times on their website."*
The flattening is what fed a 9:00am clock into the sort. Rule now in `ingest-newsletters/SKILL.md`:
**a multi-day event with per-day sittings keeps the per-day clock; never take `startsAt` from the
first day and `endsAt` from the last.** The card's window survived unchanged here only because both
days share one 9am–3pm sitting, which the generalized clock now reads correctly — a coincidence, not
a design.

Regression guards: three tests in `filterCards.test.mjs` pinning the 6:13pm report, the still-live
half of the contract (the clock must not evict a card mid-sitting), and the nightly film run.

## 2026-08-13 (seventh entry) — Search Console opened, and the count rule gets a command

Two instruments, both from the 2026-08-11 readout's proposals.

**Google Search Console is verified for `stoopwise.com` (Domain property, auto-verified via the
domain name provider — no DNS TXT needed).** It is now the instrument of record for Loop C, which
until today was inferred from PostHog referrers alone. Baseline recorded in the readout's second
addendum: 161 sitemap urls discovered, **9 known pages, 2 indexed**, 6 clicks / 136 impressions at
average position 16, 21 queries, **4 valid Event rich results and 0 invalid**.

**Two findings matter beyond the numbers.** First, every one of the 21 queries is an *entity*
query — `chi ba bakery`, `transmitter park marina`, `le fanfare greenpoint`, `meeker avenue plume
superfund site` — and none is a brand term. That is the "they curate the week, we index the
neighborhood" position (2026-07-28) earning traffic on its own terms, evidenced from outside our
own analytics for the first time. Second, **L3's last open item is closed**: the manual Rich
Results spot-check carried since 2026-07-27 is superseded by the Events enhancement report, which
answers it continuously and currently reads 0 invalid.

**Indexing is the bottleneck, and its clock starts today.** 161 discovered, 2 indexed. Proposal 3's
pre-registered rule — fewer than half the live card pages indexed after four weeks makes the H5
hardening backlog a real proposal — runs from **2026-08-13**, first read **~2026-09-10**. No action
before then; the property is hours old and Google's backfill only reaches 8/7.

**The outbound-count rule becomes executable.** The standing instruction ratified 2026-08-06 —
never put a card count in outbound copy without regenerating it the morning it is sent — was a
discipline with a hand-rolled grep behind it. It is now `npm run preflight:send`
(`scripts/send-preflight.mjs`; logic + tests in `src/demand-test/sendPreflight.js`), which
regenerates every count, verifies each `src` has a canonical `channel-links.md` row whose link
resolves with its query intact, confirms prod serves the deck the counts describe, prints what
expires tonight, and **exits non-zero if any of it is untrue**.

**It justified itself on first run.** Against the 8/11 drafts: Greenpoint Library 7 → **11**, Film
Noir Cinema 8 → **6**, `family_kids` 7 → **12** dated in-window. The Film Noir move is the one that
matters — a count that falls turns a friendly note into a false claim, which is a truth-rule breach
committed in outbound copy where no reviewer would ever see it.

**Two design rules, both learned from existing entries.** Venues match on **exact `locationName`,
never a regex over ids** — a fuzzy match inflates a count in the org's own favour, the one
direction an org note must never be wrong in. And the window rule is **imported from
`freshness.js`, not redefined** (`upcomingWithin7Days` is now exported), so an outbound note can
never claim a week the product does not show — the same single-source-of-truth lesson as the
`GL_PROD_HOSTS` correction on 2026-08-06. Adding an org to a wave means adding its `SEND_TARGETS`
row in the same change.

Owner: Batu (GSC verification, on his account). Verified: 658/658 unit, build clean; pre-flight run
end to end against prod — all four links 200 with `src` intact, sitemap 161 vs deck 159.

## 2026-08-13 (sixth entry) — `shopping` returns as a lens; "no lens" was never a design call

Batu, walking the feed: the CIBONE cards are "effectively unfindable for users. lost among a sea of
cards on ALL feed."

**What was actually wrong.** Yesterday's ruling (2026-08-12, fifth entry) got the CLASS right —
retail is not `arts_culture` — and then conflated two different claims about where it goes. "No
*existing* lens is honest for this" (true: `arts_culture` would lie, `shopping` was retired) became
"this class carries no lens," which nobody had decided on UX grounds. The tell is that all four
entries in the resulting `LENS_LESS_BY_DESIGN` allowlist justified themselves in the same words —
"`shopping` is retired and there is nothing else honest to reach for." Six cards, a bespoke
allowlist, and its own staleness protocol to survive expiry mid-ingest: that is not miscellany, it
is **a lens nobody had named**. The user-facing cost was the complaint above — All is 159 cards, so
lens-less meant reachable only by scrolling past everything or finding the pin, for a class that is
weekly summer supply and strong go-out intent ("what markets are on this weekend").

**The label is `Shopping`, and the alternative it beat is `Markets`.** Greenpoint already has two
farmers' markets on the map (`mccarren-greenmarket`, `mcgolrick-farmers-market`), correctly filed
`food_drink`. Here "market" *means* the greenmarket, so a Markets chip would promise McCarren on
Saturday and deliver an archival fashion sale — while mislabelling the two members that are not
markets at all (an in-store showcase, a studio after-hours). Wrong in both directions. `Shopping` is
the word the ruling itself used ("their events are shopping-related") **and** the word the schema
already uses as a `category`, so it invents no synonym — the standing rule from 2026-08-02, when
"What changed" was cut in favour of News. Rejected alongside Markets: *Pop-ups* (lifestyle register,
and a flea is not a pop-up), *Markets & Pop-ups* (longest chip in the row, still incomplete),
*Retail* (the seller's word), *Shops* (promises a store directory; the lens is mostly events).

**Not a reversal of the 2026-07-26 retirement.** That fold moved STANDING OFFERS into
`deals_memberships` and they stay there. What did not exist in July is this class — *dated* retail
happenings. Per ORDER IS THE BAR (2026-08-02), a restocked lens enters at the **back** of the bar
rather than resuming a July slot, so `shopping` sits after `wellness`. At 7 cards it clears
FOLD_THRESHOLD and shows on the primary bar; it is deliberately **not** authored-folded like
`games`, because burying it in "More" would not fix the findability problem that opened this entry.

**Rule of record.** VIEW or BUY, and the venue decides — unchanged; BUY now has a destination.
`shopping` holds dated retail happenings (flea, makers market, vendor pop-up, a store's limited run
or after-hours) **plus every `category: shopping` venue card**, which makes it mechanical: a shop
card carries the shopping lens on top of any audience lens it earned (`giggles-and-wiggles` is
`family_kids` + `shopping`; previously the deck's two shop cards were filed by two different
logics). Boundaries that still hold: `leaves-august-book-club` stays `arts_culture` (a book club is
attendance, not stock), and food markets stay `food_drink`. `LENS_LESS_BY_DESIGN` is deleted and
`no card is lens-less` asserts `[]` exactly again — no exceptions list to keep in sync, and a
lens-less card is once more an unambiguous taxonomy leak.

Owner: Batu (label + rule). Verified: 651/651 unit, DOM suite, build clean, AEO + agent-browser
gates green. Staged to a branch for preview review per the 2026-08-08 design-batch rule.

**Chip ORDER was re-examined in the same session and deliberately NOT changed.** Batu asked whether
the bar is right for launch from a supply/demand standpoint. With no usage data pre-launch, demand
was modelled from `growth-engine.md` (the resident opens it asking "What's on near me this week?";
first-session success is one high-intent act), which makes the supply metric *this-week dated cards*
rather than raw count. That surfaced a real shift: **Arts & Culture is now the deck's largest lens at
40 cards / 20 actionable this week** — up from the 11 it carried when the order was set — while
sitting in the truncated slot (71% visible at 375px, **24% at 320px**). Variants were rendered
against the running app (Arts·Family·[Food] and Arts·Food·[Family]) per the render-don't-mock method.

**The proposal was withdrawn on the evidence, and the withdrawal is the durable part.** Reading the
full `cardSchema.js` header showed the order already encodes this reasoning and outranks the model:
(1) 2026-07-25 — "Family & Kids is deliberately promoted to slot 2 **above its raw volume** (it's the
growth wedge)", so position and volume were decoupled on purpose and a supply shift is not by itself
drift; (2) same entry — "**Order is static (muscle memory beats optimality); revisit ONLY at declared
checkpoints against position-corrected `filter_tap` + post-filter engagement**", and a model that
infers demand from supply is exactly the uncorrected inference that rule forbids, since chip 1 earns
taps for being chip 1; (3) 2026-07-26 — "leading with `live_music` read as 'gig tracker', which this
isn't", the same failure mode that leading with Arts & Culture would invite. Rendering confirmed it:
variant B reads as an arts listing, and variant C pushes Family & Kids out of the visible set,
undoing the wedge promotion outright.

**Registered as a checkpoint hypothesis, not a change (the one keepable output).** At the first
post-launch checkpoint, test against position-corrected `filter_tap` + post-filter engagement:
*does Arts & Culture underperform its 20-actionable-card supply because it is the truncated chip?*
If yes, that is the declared-checkpoint evidence the 2026-07-25 rule requires, and the swap becomes
legitimate. Until then the bar ships as-is. **Separately unresolved and independent of order:** at
320px the Arts & Culture peek falls to 24%, so the scroll affordance nearly disappears on small
phones — a peek-width craft question, open for Batu.

Method note, third confirmation: rendering against the running app (not mockups) is what made the
"reads as an arts listing" failure legible. Standing lesson reinforced — **cross-examine the docs of
record before proposing, not after**; the header comment contained the counter-argument to a
recommendation that had already been made out loud.

## 2026-08-13 (fifth entry) — The strategy survives a skeptical outside pass: four adoptions, three rejections

Batu ran the strategy through an outside model (ChatGPT, "App critique from skeptics") and asked
for a reconciliation against the docs of record. Two findings frame everything adopted below.

**First, the review converged on the strategy we already have.** Its opening recommendation — a
curated-media play (three editorial picks, a Thursday newsletter, a named editor) — is the
direction our own docs litigated and retired (digest retired as the default re-entry mechanism
2026-07-28, four strikes; index-not-newsletter positioning, business-model §1). Batu killed it
mid-conversation with the docs' own argument. The corrected final strategy — "the action and
relationship layer for neighborhood life," report-not-dashboard merchant proof, no social network,
no personalization, no payments, no expansion, distribution over destination — restates the
existing strategy at ~85% overlap. Independent convergence by a skeptical pass is evidence the
strategy is sound, and it cost one conversation to obtain.

**Second, the review's opening P0 — "a map failure must not destroy the app" — was reported from
that very session's browser and had already shipped** (the first two 2026-08-13 entries below).
Its app audit is otherwise partly stale: it missed the shipped submission path (L5), the
correction links (L10), and the per-category JSON-LD in `aeo.js`. Its embedded "Claude Code
prompt" was not run.

**Adopted (four):**

1. **The moat is four assets, not three** (business-model §1 sharpened): coverage trust · supply
   relationships · **attributable outcome evidence** (sharpened from "structured engagement
   evidence" — attribution is what makes the evidence sellable and uncopiable) · **the resident
   participation graph** (saves, follows — backend-free start). The loop: verified coverage →
   resident action → attributable outcome → business contribution → better coverage.
2. **The causal question as a standing instrument** (growth-engine §2 R3): *"Did Stoopwise cause
   you to do something you would not otherwise have known about or chosen?"* The demand-side twin
   of the unique-coverage count, and the strongest evidence line a pilot renewal can carry. Zero
   build.
3. **Qualified-action rate as a supporting readout metric** (growth-engine §1): share of sessions
   with ≥1 high-intent act — already instrumented, one line in the Tuesday readout. **Never the
   gate**: the WRL demand bar stays as re-registered 2026-07-28. Amending a pre-registered bar
   mid-data is exactly what pre-registration forbids; holding that line against a well-argued
   outside metric is the discipline working, not rigidity.
4. **Anonymous-save registered as experiment candidate R4** (growth-engine §2): localStorage
   star/save, no account — Laura/Edmond's standing ask, and the cheapest first entry into moat
   asset 4. Candidate only; enters under the max-3 rule via a Tue-readout proposal, Batu ratifies.

**Approved small build, scheduled separately — the AEO surface proves facts but not
participation.** Still true after the fourth entry's work landed in parallel: `og:image` stays the
generic site image on every `/e/` page (title/description/url are already per-card), Event JSON-LD
carries no `organizer`/`offers`, and prerendered pages carry the source link but no action CTA. One
prerender-pipeline ship, no URL changes; it strengthens Loop C and the share loop exactly where the
positioning claims "take part."

**Rejected (three), with reasons:**

- **Editorial curation as the product's center** — contradicts index-not-newsletter;
  differentiation here is measured (unique-coverage count), not asserted taste. The review's own
  second half half-killed it; the residue ("editorial judgment as a supporting layer") is
  declined too.
- **PostHog taxonomy rename** (`opportunity_*` events) — breaks longitudinal data for zero
  information gain; every proposed concept maps onto the existing 9-event taxonomy.
- **"Own transactions" as a roadmap phase** (tickets, membership payments) — Layer 3 is spatial
  intelligence; commerce/jobs stay parked behind their existing evidence gate. A fork to revisit
  at the gates, not a phase.

**Deferred-but-named:** the entity / opportunity / occurrence / action / verification-record
vocabulary is recorded in PLAN.md's existing v2 content-model open item as the target shape —
adopted when that reconciliation happens, no restructuring before validation. "Organizer-confirmed"
status folds into the already-deferred second verification tier when that tier is designed.

## 2026-08-13 (fourth entry) — AEO/agent testing: three layers, and recurring events become Events

Scoped after the map bug, because the reporting environment (ChatGPT's cloud browser) was not an
edge case — it is the channel answer-engine primacy depends on. **Measured production first**, and
the finding reframed the work: the machine surface was already good (typed JSON-LD per category,
24 tests, live sitemap/RSS/`llms.txt`/ICS, `robots.txt` open). This was never "make the site legible
to AI"; it was pin what works, close measured gaps, and cover the population with **zero** coverage.

**The distinction the scope hangs on** — two audiences get conflated as "AI traffic" and fail in
completely different ways: **non-JS fetchers** (GPTBot, ClaudeBot, PerplexityBot, Googlebot) read raw
HTML, while **JS-executing agents** (ChatGPT cloud browser, Comet) render the SPA in a GPU-less
sandbox. The second is what broke, and nothing tested it.

1. **`npm run verify:aeo` (Layer 1)** — what a crawler gets, checked against `dist/`, not against the
   builders. Unit tests prove the FUNCTIONS are right; they cannot prove the built artefact is. Card
   prose floor, required JSON-LD fields per type, sitemap parity in both directions plus files
   actually on disk, exactly one canonical, `llms.txt` links resolve. Four mutations verified it
   fails: missing `byDay`, a fabricated `startDate`, a sitemap ghost entry, an `ItemList` item
   stripped of its date.
2. **`npm run verify:agent-browser` (Layer 2)** — what a JS-executing agent gets. Playwright was
   already a devDependency, so no new tooling; it serves `dist/` and drives it with WebGL stubbed off
   and storage throwing. ⚠ Two single-layer mutations **passed** — removing MapView's try/catch alone
   didn't crash the page because `FeatureBoundary` caught it. That is the redundancy working, and it
   is the first evidence the two layers aren't decorative. Removing **both** produced the exact
   pre-fix state, and the verifier named it in six lines.
3. **`docs/aeo/citation-check.md` (Layer 3)** — a fixed 5-question set run monthly by hand against
   ChatGPT/Perplexity/Google AI. **Deliberately not automated**: engines personalise and vary run to
   run, so a scripted "did we appear" check would return a green tick with no information in it.
   Layers 1–2 prove we are legible; only this one measures whether it *works*.

**Recurring programming is now `Event` + `eventSchedule`.** The earlier call — a weekly card is not
an Event with one invented `startDate` — was right, and had one option missing: `schema.org/Schedule`
states "every Tuesday at 5pm, between these dates" **without asserting any occurrence**, which is
exactly what `recurrence.days` plus the card's own window already say. Nothing invented; the truth
rule holds. Event pages went **70 → 89**, Service **44 → 25**.

⚠ Deliberately narrow, and the number shrank twice under scrutiny — 44 → 24 → **19**: only
`category === "event"` converts. A recurring **deal** stays an `Offer` (its machine-checkable fact is
that it expires) and a recurring **subscription** stays a `Service` (you join it) — re-typing either
would be re-deciding the product taxonomy inside the schema layer. Four recurring cards state no day
and stay `Service`: a standing offer is not weekly, and a `Schedule` with no `byDay` would be a claim
we can't source. `eventJsonLd` still refuses recurring cards; its test was reframed rather than
weakened.

**Home `ItemList` entries now carry the event, not just a headline and a link.** Measured before the
change: every crawler including Googlebot got **zero visible words** from the home page, and its one
machine-readable asset listed 42 titles with URLs — so it said "these things exist, now fetch 42 more
pages" and could not answer "what's on Thursday" from the document already in hand. Entries now carry
`startDate`, `endDate` and location, with dates taken **from `eventJsonLd` rather than re-derived** —
a second date implementation is precisely how a fake `00:00` clock reaches a crawler.

**Deferred, with evidence attached:** prerendering visible prose into the home page. It is the
biggest measured gap and it is a product decision — it changes what React hydrates over and collides
with first-screen calls already ruled on twice (2026-08-02 games/IA; first-viewport promotion killed
after being rendered). It gets its own round.

**Noted, not done:** the home `ItemList` still filters out recurring cards, so the 19 newly-typed
Events can't appear in "this week" even though they occur in it. Surfacing them means deciding what a
weekly card means in a dated list — a content question, not a schema one.

## 2026-08-13 (third entry) — Why the map bug went uncaught, and the inventory that answers it

Batu's question after the fix shipped: *why was this uncaught, when one ChatGPT test found it
immediately?* The answer is not "we forgot to test failure states", and the investigation is worth
more than the fix.

**The rule already existed.** `design_crit` says *"every reachable state designed, including the
ugly ones (offline, partial data, race conditions)"*, *"critique [failure] as hard as the happy
path"*, and *"honest state"*. Three separate instructions, all well written, none of which fired.

**The word doing the damage is "reachable".** A design crit is performed by looking at the running
product, so it can only judge states the reviewer's environment can produce. No reviewer's browser
could produce "no WebGL", so that state was never rendered, never seen, never critiqued. The other
half of the portfolio — 626 pure-logic `.test.mjs` files — never renders anything by design. **The
blind spot was the intersection: states that require rendering AND cannot occur in a normal
browser.** Nothing in the portfolio could see into it.

**Why ChatGPT found it in one pass: environment diversity, not analytical depth.** Every prior
reviewer — the June and July resident interviews, Batu's phone reviews, both August external audits,
every design crit, every agent browser check — ran a normal browser with a GPU. Dozens of draws from
one distribution. One draw from a different distribution hit it immediately. **A third external
audit would have found nothing.** For environment-dependent failure, diversity of environment beats
volume of review.

⚠ **The 2026-08-12 top-level error boundary probably reduced urgency.** It was correctly reasoned
and it is still the right last resort — but it solved the symptom class at the outermost level,
converting a blank page into a polished apology screen. That reads as handled, and it never prompted
the follow-on question: *which subsystems should fail independently?* A good total-failure net is
exactly what stops you asking about partial failure.

**Proof the class generalises — a second live instance, found by looking rather than by luck.**
`main.jsx` read `window.localStorage` at module scope. That property read THROWS (`SecurityError`)
when a browser blocks site data, killing the module before `createRoot()` — so React never mounted,
`#root` stayed empty, and the error boundary was structurally unable to help. Verified in a browser:
blank page. The sharpest detail is that `returnVisit.js` and `firstVisitOrientation.js` **both
already had try/catch around their use of storage** — the thinking was present, one layer too deep
to matter. Fixed with `boot.js`: `safeStorage()` guards the *read*, `bootSafely()` isolates each
boot step so a dead analytics vendor cannot also cost the reader their orientation line.

**The durable output is `docs/environmental-dependencies.md`**, now referenced from CLAUDE.md: every
browser capability the product assumes, what the reader sees without it, what contains it, and what
proves it. It converts an unreachable-state problem into an ordinary checklist — states you cannot
reach by looking must be enumerated deliberately. Two corollaries are recorded there because both
were learned the hard way: **guard the access, not just the use**, and **containment has phases**
(an error boundary covers React's render only — boot-time and asynchronous failures are outside it).

Writing the inventory surfaced a fact worth stating plainly: **the home page has no no-JS
fallback.** `dist/index.html` ships a 51-byte body and the AEO injection there is JSON-LD only; just
`/e/<slug>` pages carry prerendered visible text. An earlier claim in this thread — that a
JS-executing agent had been seeing *less* than a plain crawler on the home page — was wrong, because
there was never visible prerendered content there to lose.

## 2026-08-13 (later same day) — The containment rule gets a test, and a second failure shape

The fix below shipped and was **confirmed in the environment that reported it** (ChatGPT's cloud
browser, GPU rendering disabled in the sandbox): initial load and reload both show the notice, the
full feed is usable, filtering works, the whole-app error screen is gone, console records
`[map] unavailable — degrading to the feed`. Two things came out of that confirmation.

1. **There was a SECOND failure shape, and it was found by a pasted console line, not by us.** The
   report quoted `Cannot read properties of undefined (reading 'S')` — not "Failed to initialize
   WebGL". That is a context that **exists but is broken**, where the guard for an ABSENT context
   never fires and MapLibre dies further in. Reproduced locally with a hollow context object
   (`TypeError: t.bindBuffer is not a function`); the try/catch happens to cover it too, because
   MapLibre throws from the constructor in both shapes. **We got lucky, and luck is the reason the
   rule now has a test** — shipping believing one try/catch covered everything was the actual risk.
2. **`map.on("error")` now covers the asynchronous death** the boundary structurally cannot see —
   a style that never parses, a source that never resolves — which would otherwise leave an empty,
   unexplained map and never fire `map_unavailable`, under-reporting the sensor. Fatal is judged
   narrowly, because the cure is easy to make worse than the disease:
   - **Before first load only.** After load the map is demonstrably working; tearing it down over a
     later source error would be the regression.
   - **Not source/tile errors** (they carry `sourceId`). One 404 tile at startup must not condemn
     the map; a style that fails to parse carries no `sourceId` and means nothing will ever render.
   - ⚠ **`webglcontextlost` is deliberately NOT fatal.** MapLibre restores the context itself, and
     mobile browsers lose it routinely just from backgrounding a tab — treating it as fatal would
     kill a working map every time the reader switched apps.

**`npm run test:dom` — the repo's first rendering tests, and a deliberate second runner.** `npm test`
stays 626 pure-logic `.test.mjs` files under `node --test`: fast, dependency-free, right for
everything that doesn't need a DOM. vitest + jsdom runs `.test.jsx` only, so the two globs can never
fight. Eight tests pin the invariant — **the feed survives the map** — across both failure shapes,
the late-throw path, the async error path, both non-fatal cases, and a healthy-map case so the suite
can't pass by always degrading.

**Both guards were mutation-tested, not just watched to go green:** removing the `FeatureBoundary`
wrap fails the late-throw test; removing the `error` listener fails the async test. A test that
cannot fail guards nothing.

⚠ Writing them surfaced a genuine code smell: the first version added a **second** `once("load")`
handler beside the existing one. Real MapLibre keeps both, so it worked — but the test fake stored
one listener per type and silently dropped it. The fake was fixed to keep arrays (a fake that loses
listeners invents bugs), and the product now flips `mapLoaded` inside the single existing load
handler, so one place decides what "loaded" means.

**Still not covered, stated plainly:** map behaviour on a normal local device with working WebGL is
verified only by hand in a browser. And the reporting environment was an **AI agent browser**, which
is not an edge case for this product — `prerender-aeo.mjs` exists precisely because answer engines
matter, and a JS-executing agent was previously seeing *less* than a plain crawler: React replaced
the prerendered static HTML and the boundary then blanked it.

## 2026-08-13 — The feed is the product; the map is a passenger and must fail alone

A reader hit a browser where WebGL could not initialize and **lost the whole product** — not a
broken map, an empty page with a reload button that could never work, because the cause was their
environment and it was still there on the second load.

Root cause, reproduced locally by stubbing `getContext('webgl*')` → null: `new maplibregl.Map()`
throws **synchronously** (`_setupPainter`, "Failed to initialize WebGL") inside `MapView`'s mount
effect; React 19 walks up to the nearest boundary; the **only** boundary was the app-wide
`ErrorBoundary`. One dependency of one surface could therefore delete the feed, the filters, the
banner, the G-train status and the footer.

**The rule this establishes:** a non-essential surface may fail, but it may never take the page.
The feed is the product; everything else is a passenger.

1. **`FeatureBoundary.jsx` — contain and notify, not contain and render.** On failure it calls
   `onFail` and renders nothing, leaving the parent to own the fallback, so there is one source of
   truth for what a down surface looks like instead of a local fallback competing with a layout
   change elsewhere. It re-enters `window.reportError` like `ErrorBoundary` does: **a contained
   failure must stay a visible failure to us** — silent containment is how a surface stays broken
   for months. The app-wide `ErrorBoundary` is unchanged and remains the last resort for the feed.
2. **Two layers, deliberately.** `MapView` catches its own init failure (the common case, and the
   one that produces a *designed* state rather than a caught crash); `FeatureBoundary` covers what
   a try/catch cannot reach — the marker-sync effect, the camera effect, MapLibre's own handlers.
   **Verified separately**: a forced throw *after* a successful init degrades identically, and the
   console names `FeatureBoundary` as the catcher. Layer 1 alone would have left three effects able
   to blank the page — a smaller single point of failure is still a single point of failure.
3. **Honest degradation extends from stale data to missing surfaces** (Batu's call, options put to
   him as say-so / silently-collapse / static-stand-in). The map zone leaves the layout, the feed
   takes the full width, and one quiet line says so: *"Map unavailable in this browser — the full
   list is still here."* Same rule as the L11 stale-feed banner. **No retry control** — the reported
   failure survived a reload, and a control that cannot work is worse than none.
4. **The failure reason rides on the `map_unavailable` event, not through `reportError`.** This is a
   handled state we designed for; filing it as an exception would put designed degradation in the
   crash feed the L4 monitoring gate watches. But "the map didn't run" with no cause is
   undiagnosable, so the message (MapLibre packs the GPU's own `statusMessage` there) comes along as
   event data. The event is also the only sensor for **how many readers ever meet this layout** —
   without it we are guessing whether to design the no-map path harder.
5. **`--peek` is the mobile layout's one lever, and every rule that sets it now excludes the no-map
   case explicitly.** The chip bar sticks at `top: var(--peek)` and `--chrome` (`peek + 53px`)
   places the sticky day headers and every card's `scroll-margin`, so zeroing it re-seats the whole
   stack with no other rule touched. ⚠ The first version relied on **source order** and the later
   `@media (max-height: 700px)` rule silently beat it — at 320×568 the chip bar parked 142px down a
   viewport with no map above it. Caught only by measuring at that breakpoint. `:not(.july-main--nomap)`
   on each `--peek` declaration states the intent instead of implying it by line number.

**Known gap, not silently accepted:** this path has **no automated regression guard**. The suite is
`node --test` over pure `.mjs` logic modules — no DOM, no component rendering — so "the map must
never take the page" is verified by hand today and can regress unnoticed. Adding real coverage means
introducing a browser test runner, which is a larger call than this fix; flagged for Batu rather
than bolted on unasked.

## 2026-08-12 — Two instruments corrected: a gate that cried wolf, and a source that went quiet

Both surfaced by the Wednesday Greenpointers run. Neither is a content decision; both are the
measuring equipment, and a wrong instrument is worse than no instrument.

1. **`check-coverage --gate` now takes `--only` and judges only what the run actually read.** The
   Wednesday routine fetches `--only greenpointers` in a fresh container where `.ingest-cache` is
   gitignored, so **every other roster source has NO SNAPSHOT by construction**. The gate exited 1
   with 49 unexplained lines — **all 66 flagged were NO SNAPSHOT, not one GAP, SILENT or STANDING
   DARK** — and disqualified auto-ship on a run where nothing was wrong. It would have fired on
   every Wednesday pull forever. The rejected fix is worth naming: **writing 49
   `coverageExplanations` to pass it** is the rubber-stamping the skill warns against, and 14-day
   expiries on them would have masked a genuine NO SNAPSHOT on Monday's full run.
   - `inScope(row, only)` lives in `coverage.js`, not the script, so it is covered by `npm test` —
     the same reason the reconciliation logic moved there after six hand-found bugs.
   - **No `--only` still means the full roster gates**, which is the property that must not weaken:
     Monday reads everything, so a missing snapshot there is real.
   - **A `--only` naming an unknown source id is a hard error (exit 2), not a warning.** A typo'd
     scope would match nothing, empty the gating set, and turn the gate into a rubber stamp that
     always passes — this change inverted into the failure it exists to prevent.
   - Out-of-scope rows still **print**, marked `[off-scope]`, and a passing scoped gate says how many
     lines it did not judge. A quieter gate must not become a quieter report.
2. **Greenpointers paywalled its feed, and three separate files still promised the opposite.**
   `content:encoded` is now truncated to a teaser ending "Continue reading — subscribe to unlock the
   full article." The 8/13-19 roundup reached the snapshot with **2 of its 25 items**. The local
   snapshot shows the truncation was already there on **2026-08-10**, so the docs had been wrong for
   two days. **This is the dangerous failure shape: the fetch is a clean 200 and the diff looks
   healthy** — nothing errors, the run just silently stops knowing about 23 events.
   - Corrected in all three places that asserted the full body: `SKILL.md`, the `greenpointers`
     roster `notes` (what the run actually reads), and the `fetch: "feed"` comment in
     `fetch-sources.mjs`. `fetch: "feed"` buys plain-fetch **access**, never **completeness**.
   - **Recovery is the site's own public WP REST API**, `?slug=<slug>` → full `content.rendered`.
     Measured today: **200, 14,801 chars, no paywall marker, all seven day headings**. ⚠ It answers
     **403 to `WebFetch` and 200 to the roster's own User-Agent**, so a WebFetch probe makes a live
     recovery route look dead — fetch it the way the script does, through `npm run`.
   - The general rule already covered this and Greenpointers was the one source exempted from it:
     **snapshot the discovery surface, author from the evidence surface.** The exemption is revoked.

## 2026-08-12 — The locally-owned gate, written as a rule; and where a ruling has to land

Two cards were held on the Wednesday Greenpointers run and **both were released the same day.**
Neither release needed new judgment — one needed a rule to be written down where the routine could
read it, the other needed a host opened.

1. **The gate turns on ATTRIBUTABILITY, not on counting locations.** An independently-owned business
   with more than one location **passes** when the carded claim is unambiguously tied to the
   Greenpoint address, and **fails** when the source cannot attribute it there. This is not a new
   decision — the Bios entry below states it outright ("Multi-location is not itself disqualifying —
   unattributable is") — but it now lives in `SKILL.md` with both sides of the precedent list:
   dropped are PRESS (5 locations, no attribution) and Greek Kitchen ("Specials vary by location");
   kept are Bios, Brooklyn Craft Company (`In Greenpoint:` headings), CIBONE, and now **Threes
   Brewing** (`threes-flea-market-0815` — the listing names "Threes Brewing Greenpoint, 113 Franklin
   St." outright).
2. **The durable failure was a doc, not a judgment.** `SKILL.md`'s gate line read *"PRESS dropped,
   **multi-location**"* — the instance instead of the rule — so an unattended routine applied the
   count and held a fully-sourced, fully-geocoded card that the decision log had already cleared
   hours earlier. **A ruling that changes a gate has to land in `SKILL.md` in the same change as
   `DECISION_LOG.md`.** The log is what humans read; the skill file is what the routine reads, and
   only one of them was updated. Cite the rule, never the count.
3. **`buffalofirefly.com` allowlisted, and the fetch improved the card rather than just unblocking
   it** — the opposite of the Bios case below. The routine's egress denies the host (CONNECT 403)
   and Nominatim has no result for the venue name, so the address was unreadable to the run. From an
   interactive session the site states `55 Nassau Ave, 2E, Brooklyn, NY 11222` in its own CONTACT
   INFO and again on the session page, plus **"Thursday, Aug 13 · 7:00–8:15pm"** and **"In person
   $55"** — so `buffalo-firefly-soundbath-0813` ships with a real end time instead of the roundup's
   open-ended 7pm. Same attributability ruling clears it (Brooklyn + Richmond VA; the session sits
   under the site's own "Brooklyn Events" heading). Evidence persisted under `[R1 PERSISTED
   2026-08-12c]`. **Nominatim needs the unit suffix stripped** — `geocodeQuery` carries the stripped
   form so the card can keep the address the source actually states.
4. **Both cards were hours from being moot.** The events were 8/13 and 8/15; a Monday full run would
   have found nothing to ship. When a hold is time-critical the PR has to say so in the summary, not
   only in the write-up — that is what made these two get read in time.

## 2026-08-12 — Stoopwise LLC: Terms, Privacy, and a legal footer

**Batu confirmed Stoopwise LLC is formed in New York**, which is the condition both legal drafts
gated on, so the pages publish with the LLC named as operator. Decisions taken while finalizing:

1. **One published address: `hello@stoopwise.com`** — privacy requests, legal, and corrections all
   land there. This is the first email address the product exposes anywhere; the 2026-07-15 rule
   that Batu's personal inbox stays private is unchanged, and the Tally forms remain the primary
   correction route (the footer's "Corrections" link points at the same form the per-card "Report
   an error" link uses, so there is one route, not two). **No mailing address is published** — the
   drafts allow "or other contact method", and the alternative is publishing a home address.
2. **The privacy policy states the live stack, not a generic one.** Every bracketed field was
   answered against the running site and put in a fact table on the page: Vercel (hosting +
   pageview analytics), PostHog (named tap events, pageviews, error reports — no autocapture, no
   session recording), OpenFreeMap (tiles + glyphs), Tally (three forms), **no cookies** (localStorage
   only, for the anonymous analytics id and first-visit state), **no advertising pixels**, **no
   precise-location request**, no payments. If any of those change, the page changes in the same PR
   — a privacy page that drifts from the stack is worse than none.
3. **Terms §4 explicitly welcomes answer-engine citation** with attribution and a link, while the
   anti-scraping sentence stays. Answer-engine primacy is the north star (2026-07-21); terms that
   read as a blanket bot ban would work against it. The line draws the boundary where the strategy
   does: cite us, don't republish us.
4. **The pages are static HTML in `public/`, not React routes.** No router exists, and legal pages
   must render with no JS for crawlers and for anyone the bundle fails on. `/terms` and `/privacy`
   are Vercel rewrites onto `/terms.html` and `/privacy.html`; they share `public/legal.css`, which
   mirrors the same II-C tokens as `july.css` rather than importing the app's CSS graph.
5. **The footer lives at the bottom of the card panel, not the shell.** The shell is a 100vh flex
   column, so a shell-level footer would spend viewport height on every screen forever. In the panel
   it is ~89px (10% of the desktop panel) and the last object in the mobile page flow. The drafted
   two-sentence disclaimer was cut to one claim — the sentence that changes behavior ("details
   change — verify anything time-sensitive with the source") — because at 400px the full version ran
   three lines of permanent chrome; the full wording lives on `/terms`.

## 2026-08-12 — the held-card backlog was a rules backlog: thirteen rulings from PRs #29/#30/#31/#32

**Batu, reviewing four open PRs at once.** Three PRs had each independently held Greek Kitchen,
`macha-studio` and a Lockwood item — the same three items, three runs running. That repetition is
the finding: **a card held twice is not a card problem, it is a missing rule.** Every ruling below
is written to file a *class* of card mechanically, so the next flea, gallery show, mixer or
image-first venue never reaches a human.

### Taxonomy and filing

1. **Lens-less cards are legal, and named.** SKILL.md's markets rule ("a general-goods flea, craft
   fair or vendor market **carries no lens and shows in All only** — that absence is the answer, not
   a hold") was unshippable: the test `no card is lens-less` asserted `lensless === []`. The rule
   was right and the test was stale. The test now holds an **explicit id allowlist with a comment
   per id**, the same idiom the free-ness and deals-lens tests already use — a growing list still
   gets caught at review, but the sanctioned filing ships. *Unblocks `cibone-hozubag-0813` and every
   future vendor market.*
2. **An ongoing exhibition belongs to the venue card, not a dated `event`.** A two-month gallery run
   is a standing state of a place; every dated `event` in the deck is a happening you attend at a
   time. A 7/11→9/8 `event` would also sit in the Today lens every day until September. **Applies to
   the whole class** — Dreams On Command, Kingsland, Culture House, Film Noir. Openings and closing
   receptions stay cardable as real dated happenings.
3. **A social event at a venue earns `arts_culture` when the source states a making/doing activity**
   ("we're making fortune tellers"); a purely social gathering with no activity carries no lens.
   Deliberately the same shape as the work-shift rule (Batu, 2026-08-06) where the shift earns
   `civic` and the social tail inherits it: **the activity is what earns the lens.**

### Truth enforcement

4. **`sourceQuote` is now verified, not just present.** The live card
   `dreams-on-command-there-are-people-here-0808` shipped to production quoting *"There Are People
   Here. July 11–August 8, 2026."* — **a string that was never in the source**, which says
   *September 8*. The gallery snapshot was byte-identical to the prior baseline, so this was not a
   source that changed under us; the quote was wrong when written, and it told readers a running
   show had closed. Schema-checking `sourceQuote` for *presence* (2026-08-02) never checked that the
   text exists. It now must appear **verbatim in that source's fetched snapshot**, or the card fails
   into the hold pile. *Presence was never the property that mattered.*
5. **Image-detail sources get a vision read, and its text is written into the snapshot.**
   `macha-studio` publishes ~12 events (Summer Poetry Open-Mic, Sunday Soundscapes, Bread &
   Brooches) with **every date, time and address locked inside the event image** — which is why
   three runs read its bodies as empty and proposed muting it. A text-only ingest cannot see a
   productive source. Flagged sources now have their event images read, and **whatever is read out
   of an image is written into that source's snapshot file** — so ruling 4 applies uniformly with no
   exemption, and the image read becomes auditable and diffable across runs. *Instagram-first venues
   are the same shape.*

### Roster

6. **Greek Kitchen fails the locally-owned gate — dropped.** Two locations across two boroughs. It
   was onboarded 8/8 without the gate ever being applied, because the host was egress-denied and the
   page **had never actually been fetched**. Its `/specials` page also opens "Specials vary by
   location." with separate Brooklyn and Queens ordering links, so the rota was never attributable
   to 912 Manhattan Ave anyway. Held three runs running (#29, #30, #32); the roster entry, not the
   card, was the defect.
7. **`macha-studio` → `standing: true`** with a details-in-images flag, and **events default to 135
   Franklin St unless the event states otherwise** (Batu-supplied venue fact; card-level claims
   still need their own quote per ruling 4). `standing: false` — proposed by #30 — would have muted
   a source publishing a dozen events.
8. **`hello@townsquarebk.org` declined.** Its supply is already fully covered by the `town-square-bk`
   web source (both SummerStarz Fridays carded). Recorded so the discovery pass stops re-proposing
   it; registry additions widen the trusted-sender surface and need a reason beyond redundancy.
9. **`www.biosapothecary.com` allowlisted — and the fetch disproved the card's premise rather than
   unblocking it.** Live instance of the 2026-08-10 R1 blind spot: the host is not a roster entry,
   so it can **never** appear in the run's self-assembling `EGRESS DENIED` block and no allowlist
   round picks it up unless asked by name. Once open, the fetch found the emailed booking URL
   **404s**, `/products/book-a-consultation` 404s, the homepage advertises no consultation, and a
   site search for "herbalist" returns three products and the In-House Formulary page. **The service
   exists nowhere on their own site.** So R1 could not answer in-store vs online; the answer came
   from Batu directly (**in-store**), and the offer's own email footer signs from *61 West Street,
   Brooklyn, NY 11222* — the Greenpoint shop — so the pin is first-party, not inferred. Card ships
   as a standing `discount`, deliberately **linking the site root rather than the booking URL**: a
   card must never send a resident to a dead page. Worth telling Bios their promo link is broken.
   - **Bios KEPT at the locally-owned gate (Batu, 2026-08-12), and this is the line the gate draws.**
     Their contact page states two locations — 61 West Street (Greenpoint) and 67 35th Street,
     Industry City. That is *not* the Greek Kitchen case decided hours earlier, and the difference is
     the point: Greek Kitchen spanned **two boroughs** with a page that **explicitly hedged which
     location its offer applied to** ("Specials vary by location"), so its card could not be
     attributed at all. Bios has a confirmed Greenpoint storefront and an offer emailed under that
     storefront's own address. **Multi-location is not itself disqualifying — unattributable is.**
     PRESS (5 locations, no Greenpoint attribution) and CIBONE (Tokyo + Brooklyn, ruled in on
     2026-08-08 via the 50 Norman tenancy) sit on either side of the same line.

### The CIBONE class, settled the same day

**Batu, 2026-08-12: "Cibone is a store, not a gallery. these are for purchase. their events are
shopping-related."** This closes the one conflict ruling 2 deliberately left open, and it turned out
to be a mis-filing rather than a genuinely hard call.

The deck had CIBONE's two limited runs filed opposite ways — `cibone-restation-showcase-0815`
(100+ archival Comme des Garçons and Yohji Yamamoto pieces) as `arts_culture`, `cibone-hozubag-0813`
as lens-less — on an unwritten judgment about whether archival fashion is an exhibition. **The tell
was the shop card: `cibone-ote` was the only retail venue card in the entire deck filed as
`arts_culture`.** Every other store is filed by what it actually is. That anomaly is what made the
class look ambiguous. All three CIBONE cards are now lens-less.

**The rule is VIEW or BUY, and the venue decides.** The exhibition rule (2) is for **galleries** —
places whose business is showing work. A **store's** limited run is retail however curated it looks,
so it takes the markets rule: **no lens, and a dated event card for its real run window** — a shop's
pop-up genuinely starts and ends, so it does *not* move to the venue card. The boundary case that
proves the rule is `leaves-august-book-club`: a bookshop is retail, but a book club is a thing you
attend, not stock you buy, so it stays `arts_culture`. **The venue's business decides the default;
the event's nature can override it.**

### Disposition

10. **PRs #29 and #30 closed unmerged; their surviving cards re-authored onto current `main`.** #30
    asserted a 148-card baseline against a `main` that now carries 139 — it was stale before it was
    read. The rulings above change several of its cards anyway (the exhibition moves to the venue
    card), so re-authoring is cleaner than rebasing.
11. **`cibone-hozubag-0813` ships** — one day of visibility, but it proves ruling 1 end-to-end on a
    real card.
12. **From #31, one growth rule adopted, one dropped.** Kept: **every outbound draft must name
    "Stoopwise Greenpoint" in the body** — since the 2026-08-06 rename `stoopwise.com` no longer
    tells a recipient what they are opening, and a bare link is now an unlabelled link. Dropped: the
    proposed geo/engagement-split diagnostic rule.
13. **Wave 1 deferred**, notwithstanding the supply gate passing (`datedUpcoming7d` 56 vs a
    pre-registered ≥35 bar). Not a rejection of the read — an outbound send is Batu's alone and was
    kept out of this pass.

## 2026-08-10 — the ingest was never using the proxy: one false comment, three weeks of wrong diagnosis

**Corrects the 2026-08-05 entry below, whose central claim is false.** That entry says headless
Chromium's CONNECT was reset "while plain fetch reached the same hosts **through the same proxy**
without trouble," and the preflight tie-breaker was rewritten to encode it. Plain fetch never went
through the proxy. Node's global `fetch` is undici, which ignores `HTTPS_PROXY` unless the process
is *started* with `NODE_USE_ENV_PROXY=1` (Node 22.21+/24+). Verified: with `HTTPS_PROXY` pointed at
a dead port, bare `fetch` returned 200; with the flag it correctly failed; `curl` failed either way.

The source of the error was one comment in `fetch-sources.mjs` asserting that Chromium "does NOT
inherit HTTPS_PROXY the way node's fetch does." **Neither client inherits it.** Chromium was proxied
only because `launchOptions` passes it explicitly. So every run compared a DIRECT plain fetch against
a PROXIED browser and attributed the difference to the proxy relay.

**Three faults were tangled together, and the fix order matters:**

1. **Code (fixed here).** ~63 of 67 sources egressed direct into a sandbox that *intercepts* direct
   egress — `nycgovparks` answered **405 direct vs 200 proxied**. Failure was not the worst case:
   `brooklyn-craft-company` produced a **phantom diff** that became a correct `unchanged` once
   proxied, i.e. unproxied runs can feed mangled bodies to extraction subagents. `npm run
   ingest:fetch` now sets the flag, and the script **refuses to run** (exit 1, composing with the
   §0.2 roster-unreadable contract) if `HTTPS_PROXY` is set without it, or if the flag is inert on
   an old Node. Silent bypass is what cost three weeks; it is now loud.
2. **Proxy allowlist (Batu, pending).** 12 hosts genuinely 403 at CONNECT — evidence sound, it came
   from the proxy's own status endpoint (`{"kind":"connect_rejected","detail":"gateway answered 403
   to CONNECT (policy denial or upstream failure)"}`), and it survived re-provisioning when the proxy
   port moved 33403 → 45457, so it is policy and not a transient. Recorded here because PR #27 was
   closed unmerged and this is the list's only home in `main`: `maisonjar.nyc`, `greekkitchen.nyc`,
   `happy-medium.co`, `heldspacebk.com`, `www.selformer.com`, `www.clayspacebk.com`,
   `www.otisandfinn.com`, `www.dreamsoncommand.com`, `machastudio.com`, `cibone-us.com`,
   `data.accentapi.com` (lockwood), `edysgrocer.com` — 14 sources. **Re-measure before requesting
   it:** four of those sources (`macha-studio`, `cibone-ote` are `feed`; `lockwood`, `edys-grocer`
   are `json`) have no browser fallback and never touched the proxy, so their presence on the list is
   an artifact of fault 1 rather than a proven denial.
3. **Chromium CONNECT reset (platform, pending).** Also sound: cross-checked with curl-through-proxy
   returning 200.

**Why 1 had to land before 2.** Four of the 14 sources on the pending allowlist ask — `macha-studio`,
`cibone-ote` (`feed`), `lockwood`, `edys-grocer` (`json`) — have **no browser fallback** and so never
touch the proxy at all. Allowlisting their hosts while the script fetched direct would have fixed
nothing, and the run would have read as "allowlist didn't work." The 22-error list was a mixture of
fault 1 and fault 2 that nobody could separate; **it must be re-measured with the flag on before the
allowlist is requested.**

Free side effect: with the flag on, the preflight's `plainReachable` probe really does go through the
same proxy, so its tie-breaker becomes sound without touching its logic.

Diagnostic worth keeping: `CONNECT tunnel failed, response 403` is a **libcurl** string. Node's fetch
cannot emit it (undici says `Proxy response (403) !== 200 when HTTP Tunneling`). If that string
appears attributed to a script fetch, it came from a curl probe, not the script.

Owner: Batu. Open: re-run the fetch to get an honest error list, then request the allowlist against
it; and decide whether the network-bound half of the ingest should move off the cloud sandbox
entirely (5 degraded runs since 2026-07-27, no CI runner).

## 2026-08-08 — recurring row treatment: variant C

Closes the craft item the recurrence entry left open. Four row treatments were rendered as DOM
injections against the running app (the method from 2026-08-02 — mockups hide the flaws) and Batu
chose **C**: `8 PM · Weekly · No cover · 91 Greenpoint Ave`.

The header owns the DAY, the clock owns the TIME, and one word says it comes back. Rejected: **B**
(clock only) drops the fact that makes a card a habit; **D** ("Every Tuesday") restates the day the
header just gave — the duplication being fixed. **A** was the bug: recurring rows started with
"Tuesdays" while every neighbour started with a clock.

- `rowTime()` returned null for ANY recurring card — correct when they all lived on the shelf, where
  a clock under no date says nothing; stale once a card with stated days is placed in a real day
  group. Now gated on `recurrence.days`, so shelf-bound standing offers still get no clock.
- `recurrenceLabel()` is wired into the **detail's** when-line ("Every Tuesday"), which had been null
  for recurring cards *because* "recurring deals carry their schedule in kicker/summary" — and this
  change strips exactly that from the kicker. Without it the schedule would be nowhere on an open card.
- **18 kickers and 9 summaries re-authored** to stop restating the day and the rhythm. Two repo tests
  now fail either regression. Titles were NOT touched: several carry the day as a real name (Wine
  Down Wednesday, Fish Friday, The Saturday Showcase).

**What only rendering caught:** the variant-C mockup had dropped the kicker entirely, so its rows
looked single-line. With kickers restored it was four segments, and the jazz row printed "Manhattan
Ave" twice (kicker vs address). Four kickers were trimmed after seeing it on device.

**"Every week" shelf section stays dead** (Batu: "until we collect evidence otherwise"). Standing
programming is now findable by day; if evidence says the set was worth seeing whole, it comes back.

## 2026-08-08 — membership sweep (+6) and the stale-card hole

**Correction to the entry below:** it claimed stale dated cards "render a stale 'Wed, Jul 29' day
group *above* Today". They do not. `JulyApp` filters through `isExpiredCard` before grouping, so
readers never saw them — that observation came from a raw script that bypassed the render filter.

The real defect was the inverse and worse: **Greenpoint Trash Club was invisible on the map**, and
had been since 7/29. A live weekly civic thing — ~50 volunteers, every Wednesday 7:30 — vanished
because its one-week window lapsed and the render filter correctly hid it. Re-authored as a
recurring Wednesday card off the org's own IG bio ("Every Wednesday night at 7:30!"). Its rotating
meetup bar is only in a login-walled IG post, so the pin stays the indicative one the 2026-07-22
review chose and the card keeps disclosing the rotation. Newtown Creek CAG (7/29, one-off) deleted.

**Expiry now FLAGS stale non-event/deal cards instead of ignoring them.** Auto-delete stays scoped to
past events and dated deals — that authorization (Batu, 2026-07-16) is deliberate and unchanged — but
until now anything else past its end date was neither deleted nor surfaced: hidden from readers,
still counted in the deck size the trend gate reads, and never put in front of anyone for a decision.

**Membership sweep: +6 cards.** Acting on the events-shaped-roster finding below, 15 roster
businesses were checked for standing offers. Six were uncarded and fully sourced: `hana-sool-club`
(quarterly bottle club, registration closes 8/21), `yaro-studio-membership` ($260–300/mo ceramics),
`kettl-tea-subscriptions` (four, from $30/mo), `carcosa-membership-guest-pass` ($15 day pass),
`moon-bunny-monthly-plans` (from $87/mo), `word-romance-book-club` (first Saturday). The
Deals & Memberships lens goes from 2 real memberships to 7.

**Held, not dropped** (the per-card triage rule): Bin Bin Club — its own page states no price;
WORD's Withfriends membership — tiers never rendered. **Film Noir Cinema has no membership**; it has
a GoFundMe titled "Keep Us Alive". A struggling-business fundraiser is an editorial call for Batu,
not a card an ingest should mint.

A repo test caught `word-romance-book-club` shipping `free: true` when the source never says so —
the truth-rule gate doing exactly its job. Removed.

**Limitation found:** `recurrence.days` models WEEKLY patterns only. WORD's club is "every first
Saturday" — monthly — which the model cannot express, so it stays an undated shelf card. If monthly
programming becomes common, `recurrence` needs an ordinal.

## 2026-08-08 — recurrence is modelled, and the roster is events-shaped

Batu, on a Saturday: *"no family and kids or food & drink event on a saturday (top 2 categories) is
concerning and most likely not true."* It wasn't true, and the cause was in the feed, not the supply.

**`recurring` was a bare boolean carrying two meanings** — a weekly event (has a day) and a standing
offer (has none). Nothing on the card said which day, so `groupByDay` shelved *every* recurring card
onto "Every week". On 2026-08-08 that hid the free 9 AM McGolrick bird walk and the 11 AM kids'
sewing camp, and `noTodayNotice` then truthfully reported an emptiness the grouping had
manufactured. The day was stated all along — in `kicker` prose, where no machine could read it.

Decided: **`recurrence: { days: [...] }`**, a stated-day list on the card. A weekly card is placed on
its **next actual occurrence** (only the next one — six weeks of a repeat would bury the one-offs it
sits among); a card with no stated day keeps the old span-containment meaning exactly, so nothing is
silently reinterpreted. Consequences, all decided together:
- **The "Every week" shelf section empties.** Its cards are now reachable by day, which is the axis
  people actually scan. `recurrenceLabel()` exists to name the rhythm on the row ("Every Saturday")
  but is **not yet wired into `CardPanel`** — until it is, a few kickers restate the day the group
  header already gives ("Saturdays 8am–3pm" under "TODAY · SAT, AUG 8"). Open craft item.
- **Recurring events are flagged, not deleted, past their verified-through date** — the same rule
  recurring deals already had. This is the documented cause of venue sources "going dark for a week
  after their cards expired" (roster notes: Black Rabbit, Scrappleland, Hide & Seek, Brew Inn).
- **Two Saturday anchors stopped being undated Places**: McCarren Park Greenmarket (Sat 8am–3pm) and
  Greenpoint Runners at Bandit Running (Sat 9:30am). Both were onboarded 2026-08-08 with high-evidence
  Saturday hours that no Saturday could ever show. Categories and lenses unchanged.
- `DAYKEY` in `eventWindow.js` used `day: "numeric"`, emitting `2026-08-8` — harmless for the `===`
  comparisons it was written for, but it sorts *after* `2026-08-22`. Now zero-padded; the recurrence
  code orders by it.

**Food & Drink on Saturday was partly a real gap**, and that half traces to a second finding: **the
source roster is events-shaped.** All 47 sources point at calendar/events/workshop URLs, so
`subscription` and `discount` cards only ever arrive when a newsletter happens to mention one in a
diff — 7 of 129 cards carry the `deals_memberships` lens and only 2 are true memberships. WORD's
memberships were missed exactly this way: the roster reads `withfriends.co/word/events` under a note
saying it carries "the same events", which was true and silently narrowed the scope from WORD's
offerings to WORD's dated events — while Withfriends *is* a membership platform. A sweep of 15 roster
businesses found standing memberships uncarded at Hana Makgeolli, Yaro Studios, Kettl, Carcosa, Moon
Bunny, WORD and Bin Bin — Carcosa's $15 guest pass was **already written in our own roster notes** and
still produced no card, because nothing converts a standing offer into a card without an events diff.
Deals & Memberships is one of the map's own lenses and has no supply line. Fix pending Batu's review
of the list: a second per-source offers URL on a slow cadence, plus a run-level gate flagging any
roster business with no standing-offer card.

**Still open (pre-existing, found in passing):** `expireCards` only ever deletes `event` and
`discount`, so a dated card of any other category never expires — `newtown-creek-cag-0729`
(`civic_action`) and `greenpoint-trash-club` (`subscription`) render a stale "Wed, Jul 29" day group
*above* Today. The trash club is genuinely a Wednesday recurring card whose rotating meetup location
needs re-verifying before it can be re-authored under the new model.

## 2026-08-08 — external mobile audit: 7 dispositions shipped, and design batches now stage before prod

An outside first-time-user audit of stoopwise.com (390/320/desktop) landed 10 findings. Triaged
against the code and the decision history rather than implemented as written — three of its strongest
points were the July UX eval's own open calls (N1 UI half, F13-adjacent, F20), and two directly
contradicted decided verdicts. Batu approved this exact split:

**Shipped (branch `design/mobile-audit-batch`):**
- **#3 Today-gap notice** — a lens whose feed has no Today group but still has dated days ahead now
  opens with one quiet line ("No Food & Drink today") instead of silently leading with Tomorrow.
  `noTodayNotice` in `filterCards.js`, tested. All-shelf lenses (News) stay silent — their section
  headers already self-describe. Declined from the same finding: chip result counts (noise) and a new
  reset affordance (the All chip and the empty state's "Show all" already are it).
- **#8 primary action** — the first tappable *authored* action on an expanded card renders filled ink
  (`.july-action--primary`); Share/calendar stay quiet. The card's own destination is THE next step.
- **#4 (micro)** — expanding "More +N" scrolls the chip rail to the revealed chips; the tap used to
  read as a no-op at 375px. The rail rework itself stays inside N1.
- **#5 touch targets** — pins already had invisible hit areas (the audit measured only the 14–18px
  visual); topped up to 44px on coarse pointers **at working zooms only** — at far zoom 13 pin pairs
  sit within 14px and a wider ring would steal taps. Map controls 40px on touch.
- **#1 (conservative cut)** — the peek's 170px floor moved INSIDE `--peek` via `max()`, fixing a
  latent bug: below ~680px viewport height the map stood taller than `--peek` and the chip bar stuck
  part-way up the map. Under 700px tall the floor drops to 140px → sticky chrome at 320×568 went
  223px→195px (39%→34%). The audit's bigger ask (List/Map toggle, demote the map) contradicts the
  2026-07-23 live review and was declined — revisit only with mobile `pin_tap` evidence from PostHog.
- **F20 shipped** — the audit's #6/#9 re-confirmed the open colorblind-pins call, so it shipped:
  shape/pattern as second channel. gtrain = rounded square, club = donut (scalable gradient, survives
  the 14px far-zoom size), business/news already carry lightness, event/deal stay filled circles —
  the confusable CVD pairs (amber/green, brick/green) now differ by shape or pattern, palette
  untouched. Mirrored on the feed/chip dots so the key stays one system.

**Declined outright:** #2's plain-enumeration tagline (the exact pattern killed 2026-08-02 after 8
drafts); #7's card-metadata restructure (time/Free/day already extracted — the audit misread it).
**Folded into open calls:** the rail rework (N1) and a new N1 candidate — a map-corner key popover,
zero feed cost, since chip swatches structurally cover only 2 of 6 pin kinds.

**Staging round 1 (same day, Batu's phone):** three fixes — (1) a list tap whose expansion leaves
the card's own title under the sticky chrome now corrects the scroll (the no-yank rule holds for
every tap that keeps the title visible); (2) single-card pins route through reveal — no "1 here ·
Show everything" row, which announced nothing; (3) **titles clamp to ONE line, reversing the
2026-07-29 two-line contract** — on-device the wrapped rows broke the feed rhythm; kicker/summary
carry the headline detail, 22/129 current titles ellipsize, and the ingest should keep new titles
inside ~40 characters.

**Process decision — staging before prod for design batches:** major/batch design updates are no
longer pushed straight to `main`. They go to a feature branch, pushed to origin → Vercel builds a
preview deployment (branch push ≠ production; only `main` is production) → Batu reviews the preview
URL on his phone → merge to `main` ships it. Content-refresh routines are unaffected (they stay
auto-ship per 2026-08-02). This is the standing workflow for design work from now on.

## 2026-08-07 — the coverage checker gets tests, and the blind spot it still had is closed

Batu: *"are all these issues preempted against so they will not repeat?"* Audited honestly, the
answer was **no** — three gaps, two of them cheap. Both closed here.

**1. `check-coverage.mjs` had ZERO tests.** `npm test` runs only `src/**/*.test.mjs`; nothing under
`scripts/` was tested at all. **Six bugs had been fixed in that file by hand in a single afternoon**,
and every one could silently regress. The dangerous one is not a crash: the UTC day-rollover made six
well-carded evenings read as gaps, and *closing* those "gaps" would have shipped **six duplicate
cards**. A checker that quietly demands cards the deck already has is worse than no checker.

The logic moved to **`src/demand-test/coverage.js`** behind **17 tests**, mirroring how `freshness.js`
sits behind `check-freshness.mjs`. Every one of the seven bugs is a named regression case: shared-host
collapse, exclusive `end.date`, UTC rollover, end-only standing cards, the false `standing` flag,
window-horizon off-by-one, and the seventh found *while writing the tests* (below).

**2. `STANDING DARK` only fired for sources already marked `standing: true`** — so a static-schedule
venue added tomorrow would go dark exactly as Black Rabbit did, classified `quiet`. New
**`UNMARKED STANDING?`** state reports any unreviewed source that states recurring programming,
publishes no dated items and has no cards. `standing` is now **three-state** so the signal converges
rather than nags: `true` (must have a card), `false` (reviewed, phrase is incidental — `bin-bin-sake`'s
is a *shipping* line), unset (never reviewed).

**3. Bug seven, found by the new signal on its first run.** It flagged five sources; three were
**correctly represented all along** — by undated `subscription` cards, which is this project's own
model for a standing membership (`last-place-chess-chill` = chess every Tuesday). `coveredDays`
skipped undated cards entirely, so they covered nothing. Fixed: an undated **`subscription`** card
covers the window. Deliberately **not** extended to undated place/venue cards — `black-rabbit` has
one, and it must never mask that venue's weekly trivia going dark. The signal then converged from
5 flagged to 0.

**4. Step-execution: the gate already existed and was disarmed by hand. YAGNI on the rest.**
Asked whether a step-receipts system was necessary, the honest answer was no — and the investigation
found something better. `julyCards.test.mjs` **already** asserts no fully-past event lingers. It
failed to catch the 8/5 run for one reason: `refreshDay` was a **hardcoded literal the run bumps by
hand**, so skipping expiry and skipping the bump were the *same omission*. That commit says it
outright — *"the refresh-discipline date below stays 08-03"* — and 13 dead cards shipped.
**A tripwire you disarm by not touching it is not a tripwire.**

`refreshDay` now derives from `ledger.lastRunAt`. Verified against the 8/5 tree: 5 stale event cards,
`npm test` fails, the run could not have pushed. This beats receipts precisely because it **cannot be
disarmed by omission** — `check-freshness --stamp` writes `lastRunAt` and the client banner reads it,
so a run that leaves it stale breaks something visible. A hand-maintained constant has no such
tension, and four new receipt fields would have been equally forgettable.

The receipts system was **not built**: one occurrence, self-declared in the commit message, no
resident-facing consequence, and a one-line change covers it. Revisit only if a step-skip recurs in a
shape the derived date cannot see — a run skipping coverage or `--record` while expiry ran clean.
That is a signal to wait for, not to guess at.

**Still not preempted, and worth stating plainly.** Whether `--record` and coverage run at all is
still enforced by prose, not by a gate. And the judgment
rules (never source an address from memory; a negative grep is not absence; a size ratio is not
evidence of data loss; never size a guard from a degraded baseline) remain prose. The one honest
mitigation is that **the coverage check catches their *effect* regardless of cause** — it does not
care why a card is missing.

## 2026-08-07 — L12 coverage reconciliation: the check that reads the SOURCES, not the deck

Batu, after four fetch/supply bugs in two days that he spotted before any alarm did: *"how can you
make sure this doesn't happen again?"*

**The honest diagnosis is that every supply guard built to date reads `cards.json`.** `thinFeed`,
`reservoir7-14d`, the trend alarm, the concentration guard — all four measure the deck. **Not one
reads the snapshots.** So the failure *"the source published it and we did not card it"* is invisible
to all of them **by construction**, and that single failure is what all four bugs were:

| Bug | Same underlying failure |
|---|---|
| Empty back-of-window | `troost.txt` held 38 uncarded nights |
| Mis-sized venue cap | suppressed 5 of Troost's 7 nights |
| `unchanged` blind spot | 4 standing-schedule venues dark for a week |
| Brew Inn "no address" | the address was in the snapshot |

Adding a fifth deck-metric would have caught **none** of them. Each was found by a human putting a
venue calendar next to the app — a reconciliation nothing in the pipeline performed.

**`scripts/check-coverage.mjs` (`npm run ingest:coverage`) performs it mechanically.** For each
source: which dates does the snapshot carry that the deck has nothing for. It **reports and never
gates** — a gap is frequently legitimate (a film's five-night run is one card, a recurring showcase
is one recurring card, Williamsburg is skipped on purpose), and a parser that cannot read a format
reports 0 dates, which means *no signal*, never *no supply*. The rule is that **every line is
explained or closed in the run summary; a gap you cannot explain is a card you owe.** `STANDING DARK`
is the sharper variant: a `standing: true` source still stating recurring programming while the deck
carries nothing.

**It earned its place on the first run**, flagging 12 sources — including two genuine misses nothing
else would have caught: Troost 8/21–8/22 uncarded, and **Good Room, where the extraction subagent
returned 2 items from a DoNYC page carrying at least 6.** Under-extraction by a subagent was a
failure mode with no detector at all before this.

**Two bugs in the checker itself, both caught before shipping and both worth recording**, because
each is a trap the next such script will hit. (1) `Map<host, sourceId>` silently kept the *last*
source for a shared host — four NYC Parks pages share `nycgovparks.org`, both Hana pages share
`hanamakgeolli.com` — reporting "deck covers 0" for well-covered sources. Now `Map<host, Set<id>>`,
which over-credits a sibling page and is the right way to be wrong: **a false GAP burns the
reviewer's trust, and this check is worth nothing once it cries wolf.** (2) The date scan read
`end.date:` lines, and a Google Calendar all-day event stores an **exclusive** end date — so Troost's
8/11 gig invented a phantom 8/12 gap. That is the exact trap the extraction prompt warns subagents
about, walked into on the first run. End-keyed lines are now stripped before parsing: **a start date
identifies an event; an end date never does.**

`citeHost` added to the roster for the five sources fetched from one host and cited to another
(Troost → `troostny.com`, the library → `bklynlibrary.org`, Moon Bunny, nyplays, the comedy club).

## 2026-08-07 — the venue cap was mis-sized; `unchanged` was hiding four sources

Two corrections, both prompted by Batu looking at the actual output rather than the metrics.

**1. The per-venue cap is RETIRED, replaced by a concentration guard.** Batu: *"i see events in their
calendar beyond today but not in the app."* Correct — Troost's calendar carried 13 nights to 8/21 and
the app showed 3. **The cap was sized on a number computed against the broken window.** The "one venue
would be 26% of the feed" estimate divided 7 Troost nights into the *27-card* window — the very
baseline the fill rule existed to repair. Against a healthy window Troost is **17%**, and the Library
was already running **14% uncapped**, because grouped day-cards were never subject to the count. So
the cap suppressed 5 of 7 nights to prevent a concentration the Library already exceeded. **Sizing a
guard against a broken baseline bakes the breakage into the guard** — the general lesson, and it is
the second time in two days that a number taken from the degraded state has misled a decision.

Replaced by **L11e `assessConcentration`**: warn when any venue exceeds **25% of the live window**.
A share cannot be mis-sized by a bad baseline — it scales with the window. Reported by
`check-freshness` as `topVenue=<name>:<pct>`; warned, never gates `fresh`, same as the other two.
When it fires the answer is usually *fill the rest of the window*, not thin the venue. Backfilled the
13 suppressed cards (9 Troost nights, 2 comedy-club one-offs, 2 Film Noir programmes); Troost now
sits at 16%.

**2. `unchanged` was being read as "no supply", and four sources went dark.** Batu asked which
sources had lost their event cards and whether it was organic. Nine hosts had; the split was **3
organic** (Bios offer ended, Kingsland festival passed, a one-off drawing workshop passed), **1 not a
loss** (the comedy club migrated to `jumpcomedy.com`), **1 mixed** (`eavesdrop.nyc` — its own payload
stops at Aug 1, so today's loss is organic, but extraction captures 1,745 of 350,986 chars and the
snapshot is frozen on June dates, so it would under-report if the venue resumed), and **4 a genuine
bug**.

Black Rabbit, Brew Inn, Hide & Seek and Scrappleland publish **static standing schedules** — "Every
Tuesday at 8pm Nerd Alert! TRIVIA", "Wednesdays, 7pm start". That page never changes, so it is
`unchanged` forever, so the skill's *"sources with status `unchanged` are DONE"* skipped it forever —
and their recurring cards expired on schedule and were never re-authored. Roughly **8 recurring cards
a week**, lost with every gate green. **The diff engine detects new announcements; standing
programming produces no diff, ever.** Same family as the reservoir bug: the ingest only reacts to
change, and steady-state supply falls through.

Fixed with a `standing: true` roster marker (5 sources) and a skill rule: **a standing source is
re-checked on EXPIRY, not on diff.** Re-authored 5 recurring cards. Brew Inn is **held** — no street
address in the listing or in any prior card across 40 commits.

**3. Eavesdrop is organic after all; nyplays is Cloudflare and stays blocked.** Both were chased down
rather than left as "mixed" and "an error".

- **Eavesdrop** — the earlier read of this as a lossy extraction was **wrong**. `/calendar` is plain
  server-rendered HTML, and the snapshot carries **all 24 day headings the HTML carries**, Jun 27 →
  Aug 1. The venue's own last event is Sat Aug 1; there is nothing after it to fetch. The mistake was
  comparing a 1,745-char snapshot against 350,986 bytes of raw HTML — a meaningless ratio, since that
  HTML is almost entirely Tailwind class attributes. **A size ratio is not evidence of data loss.**
  Roster note records the finding so it is not re-investigated; if Aug 1 is still the last date in
  September, the venue has abandoned the page and the source should be dropped.
- **nyplays** — the 403 is a **Cloudflare bot challenge across the whole `hisawyer.com` host**, not a
  header problem and not our proxy. Probed bare, browser-UA, UA+Accept+Referer, and the public
  schedules page: all 403, all serving "Just a moment...". **Deliberately not routed around.**
  Switching the source to the headless-browser path would very likely work and is exactly why it was
  not done — driving Chromium at a host that has just raised a bot challenge is evading bot
  detection. Supply impact is nil: the source has never produced a dated card and its one undated
  subscription card is unaffected. Honest routes are a direct ask to New York Society of Play or
  dropping the source; Batu's call.

**4. Brew Inn ships; ra.co cannot be fetched and is NOT being routed around.**

- **Brew Inn — 924 Manhattan Ave, Brooklyn, NY 11222**, and it was **in the snapshot the whole time**.
  The NYC Trivia League listing emits structured microdata in DOM order, so the extractor writes the
  street name on the line *before* the number (`Manhattan Avenue` / `924` / `11222`). The hold earlier
  that day grepped for `<number> <street>`, found nothing, and filed it `source-blocked`. **That was a
  rule-miss, not a source limitation** — R1 would have caught it by reading the raw snapshot lines
  around the venue name. Roster note records the shape so the next directory-style source does not
  repeat it. (Separately: `thebrewinn.com` redirects to a *different* Brew Inn Tavern in Oceanside —
  a name collision, not our venue. Worth knowing before anyone cites that domain.)
- **`ra.co/clubs/194009` (Eavesdrop's RA page) CANNOT go in the roster.** Batu asked for it because RA
  carries a fresh calendar where the venue's own site stopped at Aug 1. It is genuinely fresher, and
  it is genuinely unreachable by this pipeline. `ra.co` runs **DataDome** (`x-datadome: protected`,
  `geo.captcha-delivery.com`): plain fetch 403s, and **headless Chromium is blocked outright** —
  Cloudflare returns "Sorry, you have been blocked. You are unable to access ra.co." Note the line
  taken: RA's `robots.txt` *permits* `/clubs/`, so reading it with a real browser engine would have
  been legitimate and was tried; what stops us is that the protection blocks the automated browser
  too, and getting past **that** would mean defeating bot detection (stealth drivers, residential
  proxies, challenge-solving). **That is out of bounds, and the fact that a user asked for the source
  does not change the method.** Same call as `nyplays` the same day.

  The honest routes, none of them a workaround: ask Eavesdrop to keep their own `/calendar` current
  (it is plain-fetchable and works — it is just stale); ask them for a feed; or accept a human-in-the-
  loop read, since an interactive browser session can open RA normally and card what it finds with
  proper sourcing. Batu's call which, if any.

**Process note worth keeping.** Two addresses were drafted from memory during this run — Brew Inn's
and Hide & Seek's — and both were caught before shipping by checking the snapshot. Hide & Seek's
drafted address was **wrong**; the real one (593 Manhattan Ave) was stated in the snapshot all along.
Recall is not a source, and it is confident exactly when it is wrong. Deck 96 → 114.

## 2026-08-06 — supply decline root-caused: the ingest never filled the back of the window

Follow-up investigation to the 2026-08-03 supply analysis, which fixed the **fetch** layer and left
the decline running. Those fixes worked and are not in question: reach is `41/44`, browser-only
sources are down from 22 to 3 documented-unreachable ones, and the deck recovered 75 → 85. **And
`datedUpcoming7d` did not move — 38 → 27, flat.** A growing deck on a healthy fetch layer with a
falling in-window count is the signature of an authoring problem, not a supply problem.

**Root cause: every run authored the days in front of it and stopped.** The 8/5 run drew its 10
cards from Greenpointers' *"What's Happening 8/6-12"* roundup — a source whose own horizon is one
week — so the ingest silently inherited the roundup's window. Expiry drains the front daily; nothing
refilled the back. On 8/6 the feed carried **2 cards dated beyond the 7-day horizon**, 8/13 and 8/14
read **zero**, and the decline was already locked in: projected with no adds, 27 → 9 by 8/10, which
breaches the thin-feed floor. Meanwhile `.ingest-cache/troost.txt` — a Google Calendar feed, already
fetched, sitting on disk — held **40 named events through 9/18, 38 of them uncarded**. Same shape at
`film-noir-cinema` (12 forward dates → 1 card), `moon-bunny-aerial` (10 → 0) and `carcosa-club`
(6 → 0). **The supply was never missing; it was never read past day four.** `SKILL.md` carried
hundreds of lines on categories, lenses and holds and **not one line on how far forward to author.**

**RATIFIED (Batu): card 14 days out, max 2 dated cards per venue inside the live 7-day window.**
Soonest first; uncarded nights stay in `.ingest-cache/` and roll in as the window advances. The cap
is what stops one bar's DJ calendar taking a quarter of the feed; the grouped-day card
(`library-thursday-programs-0806`) is the tool to reach for before the cap bites. Rule lives in
`ingest-newsletters` step 2.

**Three defects let it run silently, all fixed:**

1. **Nothing measured the back of the window.** New **L11d `reservoir7-14d`** in `freshness.js`
   counts cards dated 7–14 days out — *that reservoir IS next week's window*, so it answers to the
   same floor of 10. It fires a week before `thinFeed` can. On 8/6 it read **0** while every other
   gate was green. Reported and warned, **never gates `fresh`** — same call as `decliningFeed`, and
   for the same reason: `JulyApp.jsx` reads `fresh` for the client banner, and a thin reservoir says
   nothing about whether the cards on the map are true.
2. **The trend alarm was blind and structurally fragile.** `trend=no-baseline` on 8/6. `assessTrend`
   matched history at exactly −7d/−14d, so one missed record day blinded a comparison permanently.
   Now falls back to **−7/−14/−21** — all multiples of a week, so the same-weekday property that
   guards against the feed's designed sawtooth is preserved. A ±2-day tolerance would have fixed the
   same blindness by comparing a Monday to a Saturday, which is the false alarm the check exists to
   avoid.
3. **The "scoped mini-ingest" path skipped the measuring steps.** The 8/5 commit says it plainly:
   *"Expiry did not run — this is a scoped mini-ingest."* It also skipped `--record`, which is why
   8/5 is absent from `freshness-history.json` — the path that shipped 10 cards recorded nothing.
   Both are deterministic scripts costing seconds. **"Scoped" now describes which sources you read,
   never which gates you run.**

**Correction to the entry below:** it attributes the flat metric to *"expiry took as many as the
restock added."* Expiry did not run on 8/5 and the deck grew by 10. The metric was flat because all
10 new cards landed inside the window's front while its back stayed empty.

**Known open, deliberately not fixed here:** 13 expired cards are still in `cards.json`, inflating
the deck to 85 when it is really 74. `filterCards.js` hides them from residents, so the map is not
lying — this is a measurement distortion, and it is precisely what made "card count recovered" read
as "supply recovered." Clearing it is `npm run ingest:expire` plus the step-5 contract-count rewrite
in `julyCards.test.mjs`, which is the ingest ritual's job, not a code fix.

## 2026-08-06 — the Aug 3–4 traffic was internal; Wave 1 held; Eventbrite allowlisted

Rulings from the PR #19 readout review (cycle 3, merged unedited).

**The 2026-08-03/04 untagged burst was Batu's own** — confirmed directly. Ten "new visitors" who
landed on `/` and opened almost nothing were cutover verification. This settles the readout's
highest-priority open question and makes Finding 2 a **measurement artifact, not an activation
signal**. The consequence is that three headline rates are understated in every figure published so
far: activation 25% → 18%, card-open conversion 43% → 31%, multi-day return 32% → 24% — **not one
numerator moved.** The pre-burst figures are the true ones. Any comparison against cycle 3's numbers
must say which population it means.

**Wave 1 is held**, per the cycle-3 sequencing rule. `datedUpcoming7d = 27` — the floor of the
27–34 band — and flat *despite* the Wednesday refresh adding 10 cards, because expiry took as many
as the restock added. The last **full** roster run was 2026-08-03, pre-fix; the 08-05 run was a
scoped Greenpointers-only mini-ingest with expiry disabled, so the gate has still not been honestly
read. First real read is the next full run.

**`eventbrite.com` + `www.eventbrite.com` added to the WebFetch allowlist** in `.claude/settings.json`.
**Gotcha recorded:** Batu first added it to `.claude/settings.local.json`, which is gitignored
globally (`~/.config/git/ignore`) and therefore never reaches the repo or the cloud ingest routine —
**source allowlist changes must go in the tracked `.claude/settings.json`.** Note also that this
gates the `WebFetch` tool only, not the raw fetch/browser calls in `scripts/fetch-sources.mjs`, and
`loft-story-whole-sky-0812` was blocked by *both* a 403 to plain fetch and a dead browser path — so
this may not resolve that hold by itself.

**Three follow-on rulings, same day:**

1. **The funnel clock starts at launch communication — do not retro-clean the data.** The option to
   identify the ten internal person IDs and exclude them from `posthog-pull.sh` was offered and
   **declined**. Everything before the first launch send is pre-acquisition noise and is **not** the
   demand-gate denominator; clean funnel tracking begins with Wave 1, when tagged traffic starts
   arriving. Pre-Wave-1 rates are directional only and must never be cited as a gate read. This is
   the cheaper call than a permanent exclusion list that would itself need maintaining.
2. **All six standing instructions are RATIFIED** and now binding rather than provisional:
   `?src=verify` on every production check; verify-checkout-against-`origin/main` before diagnosing;
   `$host` applies to outbound copy and "top card" claims, not just tables; split every metric by
   `$host` before reporting; and never put a card count in outbound copy without regenerating it the
   morning it is sent; and diagnose an analytics-pull failure before declaring `[data pending]`.
   **Two of the six needed correcting before they could be ratified, and both corrections mattered
   more than the ratification did.**
   The pull-diagnosis rule claimed **two** failure modes; there are **three**. Cycles 2–3 recorded a
   PostHog free-tier execution limit that makes *individual* queries return `ERR` while the rest of
   the pull succeeds — neither missing env vars nor blocked egress, transient (cycle 3 saw the same
   two queries return with no fix applied), and the one most likely to be misdiagnosed, because a
   partial pull still looks like a working pull. Declaring `[data pending]` for the whole readout on
   that basis would be wrong. The rule now names all three with their distinguishing signal, their
   fix, and their owner — mode 2 is Batu's and must never be routed around.
   **The `$host` ratification came with a correction.** That instruction hardcoded its own host list
   inline, and the list had gone stale within four days: it named `greenpoint.life` and
   `greenpoint-explorer.vercel.app`, which after the Stoopwise rename **omits `stoopwise.com`, the
   canonical origin.** Ratifying it as written would have dropped production traffic from every
   future readout. It now points at `GL_PROD_HOSTS` in `scripts/posthog-pull.sh` as the single
   source of truth instead of duplicating it — the same lesson as the duplicated-config instruction
   already in that file.
3. **The `check-freshness.mjs` trend check ships (L11c).** Built TDD on `feat/freshness-trend-check`.

**Design notes on L11c, because two of them are non-obvious:**
- **It compares same-weekday to same-weekday, over BOTH a 7- and a 14-day window.** The 20%
  week-over-week bar alone would have **missed the very decline it was built for**: the real slide
  was 38 → 33 → 27, roughly 15–18% per week, never crossing 20% in any single week while the feed
  lost a third of its in-window items. Gradual decay is the failure mode, so the 14-day window
  (38 → 27 = 29%) is what actually fires. Run-to-run was rejected outright — the feed sawtooths by
  design (27 → 38 → 27) and would cry wolf every weekend.
- **`decliningFeed` is reported but never gates `fresh`, and never exits non-zero.** `JulyApp.jsx`
  consumes `assessFreshness` for the **client banner**, so letting a supply trend gate `fresh` would
  change what residents are told about the feed's honesty — a thinning roster is an ops problem, the
  cards on the map are still true. Non-fatal because the kill criteria anticipate false alarms
  (two in four weeks → drop it), and a noisy alarm that halts the ingest is worse than no alarm.
- History accumulates only via `check-freshness.mjs --record`, wired into the ingest ship step;
  ad-hoc local checks stay read-only. `freshness-history.json` was added to the ingest skill's
  content-only file set, or every run would have been forced into a PR.
- Seeded from the readouts of record only. The §1 baseline of 38 is real but carries no exact date
  ("last week of July"), so it is deliberately **not** seeded as a data point.

## 2026-08-06 — three ingest rulings off PR #21: markets, work shifts, and Domino Park

Decisions (Batu), taken on the four cards held from the 2026-08-05 Wednesday Greenpointers pull
(`docs/review/held-cards-2026-08-05.md`, merged as PR #21). All three are written into
`.claude/skills/ingest-newsletters/SKILL.md`; the first two retire a class of hold rather than
resolving one card.

1. **Markets, fleas and vendor fairs file under `food_drink` only when the market *is* food**
   (smorgasbord, night market). A general-goods flea or craft fair **carries no lens and shows in
   All only.** `shopping` is retired and `deals_memberships` is deals/memberships only, so the
   absence of a lens is the answer, not a reason to hold. Geography stays a separate gate — this
   ruling does *not* release `bqflea-meeker-0809`, which is still held because "Meeker Ave under
   the BQE" spans two neighborhoods and needs the organiser's cross-streets before it can be pinned.
2. **A community-garden or park work shift is `civic`, and its social tail inherits the lens** when
   the source states the shift; no stated shift, no inheritance. This is the single sanctioned
   exception to `civic`'s "merely social does not qualify" test — the shift is what earns the lens.
   Resolves `mccarren-demo-garden-potluck-0806`, which had been authored with `filters: []`; that
   would have been the first empty-filters card in the deck, and the rule removes the need for it.
3. **Domino Park is Williamsburg — out of scope.** Skip every Domino Park item. The deck had been
   inconsistent about this since July: `sunday-yoga-domino` was live while the 2026-08-05 run
   skipped two Domino Park items as Williamsburg-proper. **The live card was the error, not the
   precedent, and was removed** (deck 85 → 84; the wellness-lens and deck-count tests were updated
   with the reason). Do not re-author it or cite it as prior art.

The two remaining holds are unaffected and stay held: `uzuki-gluten-free-parfait-0808`
(`uzukinyc.com` does not resolve, so event-vs-menu-item is not derivable) and
`loft-story-whole-sky-0812` (venue unreachable; the only detail page is Eventbrite, which is not on
the WebFetch allowlist). **Open question, not decided here:** whether to allowlist `eventbrite.com`
for detail reads — it is now a repeat blocker, not a one-off.

## 2026-08-06 — renamed to Stoopwise; `stoopwise.com` is canonical, `greenpoint.life` retired after 4 days

Decision (Batu): "stoopwise. domain bought." The consumer product is renamed from **Greenpoint Life** to
**Stoopwise**, with this edition titled **Stoopwise Greenpoint**; future neighborhoods take the same shape
(Stoopwise Astoria). `stoopwise.com` becomes canonical, superseding the `greenpoint.life` cutover shipped
four days earlier (2026-08-02, below).

**Why rename at all:** "Greenpoint Life" cannot leave Greenpoint. Renaming was always going to happen; the
only question was when, and the switching cost is at its floor right now — the domain cutover was 4 days
old, the AEO surface 11 days old, and Reddit/QR seeding had not started, so there is no accumulated
awareness or citation identity to strand. Every week of seeding would have raised the price.

**How the name was chosen.** A full evaluation of an 18-name shortlist returned **no winner** — the three
names the strategy panel converged on each died on a hard real-world conflict (Almanac → *Old Farmer's
Almanac* + a local newspaper of the same name; Gazetteer → **Gazetteer SF**, a funded hyperlocal running
the identical `<city>.gazetteer.co` expansion model; Hereabouts → **Hereabout.app**, a map-based
neighborhood social network one letter away), and every name that survived conflict failed on strategy.
The diagnosis was a generation failure, not a selection failure: all 18 candidates were drawn from two
wells (pedestrian motion, antique print), none named the *answering* function, and none was participatory
despite "Take part" being a brand value. Batu then supplied Stoopwise, which won on the three axes that
killed the whole shortlist: **`stoopwise.com/.app/.nyc/.city` were all unregistered** (not one of the 18
had an available `.com`), **the string has zero search footprint** so page one is ownable from day one
with no paid budget, and **it is a coined compound** — protectable, unlike the bare common nouns that
kept collapsing.

**Known and accepted costs**, recorded so they are not rediscovered as surprises:
1. **"Greenpoint" is no longer inside the brand.** The old name carried the primary keyword for free.
   Every title, meta, and machine surface must now reintroduce "Greenpoint, Brooklyn" explicitly or
   search and answer-engine discoverability drops. This is the single biggest risk in the change and the
   reason the edition is "Stoopwise Greenpoint" rather than bare "Stoopwise".
2. **The stoop root is occupied in-category.** `stoop.house` is a live NYC neighborhood app expanding
   neighborhood-by-neighborhood; `thestoopmedia.com` is a hyperlocal newsletter publishing our content
   mix in another metro; Bed-Stuy Stoop is a Brooklyn hyperlocal Substack. None is prominent enough to
   block, but the compound is ours while the root is not. **Trademark search run by Batu 2026-08-06:
   clean** — this closes the registration question and unblocks print spend. The separate prior-use
   question against those live stoop-root products is unchanged and unresolved by a register search;
   it was accepted as a known cost when the name was chosen, not eliminated.
3. **Stoops are brownstone Brooklyn, not New York.** The name strains at Astoria, which is a plausible
   second market, and Greenpoint itself is Polish frame houses rather than brownstone. Accepted on
   Batu's call that local specificity communicating hyperlocal outweighs geographic neutrality, since
   expansion beyond NYC is far off.

**Three origins now serve** and all must keep working: `stoopwise.com` (canonical), `greenpoint.life`
(canonical 2026-08-02 → 08-06), and `greenpoint-explorer.vercel.app` (rollback + the host for
already-sent invite links). Both legacy origins redirect to the new canonical; neither is retired.
`GL_PROD_HOSTS` in `scripts/posthog-pull.sh` keeps all five hostnames so readouts do not silently
deflate. `og.png` needed no regeneration — it carries no wordmark.

**Out-of-repo work — executed same day, 2026-08-06:**
- **Vercel + DNS done.** `stoopwise.com` added to the `greenpoint-explorer` project → Production, and
  `www.stoopwise.com` → 308 → apex. Vercel's "Redirect apex domains to www (recommended)" checkbox is
  **checked by default and had to be unchecked twice** — left alone it inverts the apex-primary decision
  made 2026-08-02. At the registrar (GoDaddy) the default `A @ → WebsiteBuilder Site` was **edited, not
  duplicated** (two A records on `@` would round-robin), to `216.198.79.1`; the pre-existing
  `CNAME www → stoopwise.com` needed no change. DNS propagated in minutes; SSL issued;
  **`https://stoopwise.com` verified serving the live app** before any code was pushed.
- **PostHog project renamed** "Default project" → "Stoopwise". Cosmetic only — `posthog-pull.sh` keys off
  project ID 522817, not the name.
- **The three Tally forms needed no change** — an audit assumption that turned out false. Their titles are
  "What's missing or wrong?", "Add your event", "Follow Greenpoint" and none of the bodies carries a brand
  string. The claim came from an inaccurate code comment in `CardPanel.jsx`, now corrected against the
  live forms.
- **False alarm worth recording:** PostHog's setup page advertises `api_host: 'https://greenpoint.life'`
  as a managed reverse proxy, which looked like a silent-analytics-breakage risk. It is not — the app
  sets `api_host: "https://us.i.posthog.com"` directly (`posthogTransport.js:12`) and never uses the
  proxy. The stale `greenpoint.life` managed-reverse-proxy entry still exists in PostHog org settings and
  is unused; left in place deliberately rather than touched during a rename.

**Rename deploy shipped and legacy origins flipped, same day.** The push was **not** a fast-forward — a
cloud ingest routine had landed `content(track-v): Wednesday refresh` on `main` mid-session. Caught it in
pre-flight (the diff showed 776 deletions and a change to `julyCards.test.mjs`, a file the rename never
touched); fetched, confirmed **zero file overlap** (ingest = data/content, rename = code/docs/config),
rebased, re-verified on the combined tree (494/494, build green, 71 prerendered card pages vs 62).
Force-pushing would have destroyed 10 freshly-ingested events.

Then `greenpoint.life` and `www.greenpoint.life` were both flipped to 308 → `stoopwise.com`.
**Vercel forbids redirect chains** — flipping the apex failed with *"You have redirected another domain
(www.greenpoint.life) to this domain. In turn, you cannot redirect this one."* The fix is ordering:
**repoint the `www` subdomain at the new canonical FIRST, then the apex.** Note also that Vercel's
redirect-destination field is a combobox — typed text silently fails to save; the option must be picked
from the menu.

Prod-verified after the flip: `stoopwise.com` serves; sitemap/rss/ics/llms.txt/robots all 200; a no-JS
card page returns the new title, canonical, and `schema.org/Event` JSON-LD on the new origin (absence of
JSON-LD on an undated card is correct — `eventJsonLd` returns null for undated/recurring); `?src=`
survives every hop; `/e/<slug>` deep links keep their path through the 308; `greenpoint-explorer.vercel.app`
still serves 200 and its `/july.html?src=` redirect still preserves params, so already-sent invite links
are intact.

**Still open:** the Gmail sender identity. (Trademark search closed clean, 2026-08-06 — QR window cards
and other print are unblocked.)

## 2026-08-05 — the browser path falls back to Firefox, and stops accepting an unrendered page

Decision (Batu): "should we instruct routine to try firefox if chromium fails? add it then merge."

**Firefox as a preflight-level fallback, not a per-source retry.** Chromium is tried first; only if its
preflight fails is Firefox tried, once. Over a CONNECT tunnel the proxy sees only TLS bytes, so an
engine that tunnels at all recovers the WebSocket-delivered sources too — which is why this is worth
having even though only 3 sources still need a browser. **It costs nothing where Firefox is absent:**
the launch throws and Chromium's original diagnosis is reported unchanged, so no environment has to
install anything it does not want. To make it live, the routine's setup must run
`npx playwright install firefox`. `GL_BROWSER_ENGINES` overrides the order and is the test seam.

A fallback that succeeds prints a loud `BROWSER FELL BACK TO FIREFOX` block, because that asymmetry is
**the sharpest evidence available that the failure is Chromium-specific** rather than an egress policy
— precisely what the platform bug report needs, and what a human would otherwise have to derive by hand.

**Verified rather than assumed.** Firefox was installed locally and driven end-to-end: it reads both
WebSocket sources (`word-bookstore`, `greenpoint-comedy-club`) with full content. Fallback engagement,
graceful degradation when an engine is missing, and the untouched `--no-browser` path were each
exercised. Full run 44/44 0 errors; `--no-browser` 41/44, 7%, exit 0.

**A real defect surfaced while verifying, and is fixed here.** Comparing engines showed one Chromium
run capturing the comedy club's *shell* — 13 lines, no shows — where every other run got all 18.
Repeat runs proved both engines are consistent, so it was a flake: 2500ms is sometimes not enough for
a WebSocket-rendered page. **Nothing caught it.** `MIN_TEXT_CHARS` only guards the `plain` path, so an
unrendered page was accepted as a *successful* fetch and would have read downstream as `+0/-90` —
"the source shrank" — sending the next run hunting for cancelled events that never were. The browser
path now re-reads after a further 5s and, if the page is still thin, **fails loudly instead of
snapshotting a page that had not loaded.** A visible error beats a plausible-looking empty week; that
is the same principle as the 2026-08-03 degraded-run gate, applied one level down.

Owner: Batu.

## 2026-08-05 — Batu's corrections: 6 unreachable sources → 3, sparsa removed

Batu reviewed the "provably no plain-fetchable endpoint" list below and **four of the six were wrong —
not about the fetch mechanics, but about which page to point at.** The research had verified the
configured URL thoroughly and never asked whether it was the right URL. Corrections:

- **`dance-space-ny` — the schedule was never gone.** It lives at `/adultdanceclasses`; the configured
  `/studiodates` now 302s to the homepage. It had been written off as "moved to Instagram" on the
  strength of an off-site pointer in stale copy. Podia hydrates from JSON in `data-props` attributes,
  which tag-stripping discards — hence the 18-char snapshot that read as a dead page. New **`embedded`**
  fetch strategy reads the payload: Adult Ballet Mon 6:45–8pm, Beginner Tap Tue 6:30–7:30pm,
  Intermediate Tap Thu 6:30–7:30pm, Beginner Jazz Thu 7:30–8:30pm, Sneaker Jazz Fri 7–8:30pm.
- **`play-kids-greenpoint` — right finding, wrong page.** `/calendar` really is an empty Wix widget;
  the movie nights are at **`/movie-nights`**, plain-fetchable, with real dates (Fri Aug 7, Fri Aug 21,
  drop-off 5:30–8:30pm). Now `auto`, and it reads via **plain** — no browser at all.
- **`greenpoint-comedy-club` — better page, still browser.** The Jump Comedy venue page
  (`jumpcomedy.com/v/greenpoint-comedy-club`) renders the full show list with dates, times and prices
  and avoids the Cloudflare Turnstile on the ticketing subdomain. It stays `browser`: watched live in a
  real browser, the page issues **no XHR at all** — Phoenix LiveView pushes listings over a WebSocket.
- **`word-bookstore` — confirmed correct as configured**, and browser-only for the same reason
  (Withfriends is also WebSocket-delivered). Re-probed: `/api/movement/word/events` and `?format=json`
  both return the same empty SPA shell; `.ics` 500s.
- **`sparsa` — removed from the roster** on Batu's instruction, per the `robots.txt` ClaudeBot opt-out
  flagged below.

**Result: 47 sources, and only 3 can fail when the browser is down** — `word-bookstore`,
`greenpoint-comedy-club`, `greenpoint-trash-club`. The `--no-browser` simulation now reports
**41/44 read, 7% error, exit 0**, against a 15% ceiling — the thin 13% margin noted below is closed.
Normal run 44/44, 0 errors. Tests 491 → 494.

**The lesson worth keeping.** Verifying an endpoint answers "can we fetch this URL?" — it does not
answer "is this the URL the content is on." Four sources were declared unreachable while their
content sat on a sibling page. **When a source looks dead, check the site's own navigation for a
better page before concluding anything**, and treat "they moved it to Instagram" as a claim needing
evidence rather than an explanation. That check is now written into the roster-discovery step.

Owner: Batu.

## 2026-08-05 — the roster stops depending on a browser: 22 browser sources → 6

Follow-on to the entry below, same incident. Having taken Greenpointers off the browser path, the
question was whether the routine survives the cloud CONNECT outage for **every** source. All 13
remaining browser-dependent sources were investigated for a plain-fetchable endpoint, each verified
by live fetch rather than assumed.

**Seven converted.** Six to a new `json` fetch strategy, one back to `auto`:

| source | was | now | what it reads |
|---|---|---|---|
| `greenpoint-library` | browser | `json` | the Solr events index `discover.bklynlibrary.org` itself queries — **187 upcoming events** vs the week the branch page renders |
| `troost` | auto→browser | `json` | the Google Calendar API its own widget calls |
| `film-noir-cinema` | auto→browser | `json` | Squarespace collection JSON — whole programme in one call, not one month |
| `carcosa-club` | auto→browser | `json` | Squarespace JSON, **current + next month every run** |
| `nyplays` | browser | `json` | the Sawyer widget API behind the schedules page |
| `moon-bunny-aerial` | browser | `json` | the feather.rsvp public API the site embeds |
| `bpl-north-brooklyn-calendar` | browser | `auto` | plain fetch re-verified working (the "403s plain fetches" note was stale) |

**Six remain browser-only and provably cannot be otherwise:** `word-bookstore` and
`greenpoint-comedy-club` deliver listings over WebSocket (no HTTP endpoint exists to call);
`greenpoint-trash-club` and `dance-space-ny` publish their schedules only on Instagram;
`play-kids-greenpoint`'s widget needs a signed token and its calendar is empty anyway; `sparsa` sits
behind a Cloudflare challenge. These are now documented as a closed list so no future run re-hunts
them.

**⚠ Batu decision needed — `sparsa`.** Its `robots.txt` explicitly disallows `ClaudeBot` by name
(alongside GPTBot, CCBot and others). We did not build a workaround and should not: the correct
response to an opt-out is to honour it. Recommend **removing sparsa from the roster**. Left in place
pending your call — it currently fails harmlessly behind Cloudflare, so nothing is being retrieved
either way. Roster removals are yours, not the run's.

**The degraded gate was re-derived, not just relaxed.** It exited 1 when errored sources exceeded 15%
**or** every browser fetch failed. That second clause was written when 22 of 48 sources were
browser-only, where it meant losing ~46% of the roster; with 6 it fires at 12.5% and halts a run that
read 39 of 45 sources. Coverage is the real question and the 15% ceiling measures it directly — a
failed browser source counts as an error like any other — so the ceiling is now the single rule and a
dead browser prints a warning instead. `assessFreshness` was changed to match, so the routine cannot
pass the fetch gate and then fail freshness on the same non-issue.

**Verified, not asserted.** With `--no-browser` (which reproduces the cloud failure exactly): **exit 0,
39/45 sources read, 13% error** — where the same simulation before this change gave 14 errors, 31%,
exit 1. Normal run: **45/45, 0 errors, exit 0.** Every new endpoint fetched twice consecutively with
**zero differing lines**, confirming no nonce or export timestamp makes a run look changed — the
defect that disqualified Troost's iCal feed (731 events back to 2023 with a per-export `DTSTAMP`).
Tests 479 → 491.

**Margin note:** 13% against a 15% ceiling is thin. One additional transient error during a browser
outage will halt the run — correctly, but it is a narrow band. Removing the two sources that can never
yield content (`sparsa`, `dance-space-ny`) would widen it to ~9%. Batu's call.

Owner: Batu.

## 2026-08-05 — read the feed, not the page: Greenpointers leaves the browser path

Context: the 2026-08-05 daily thin refresh halted at the roster gate. 14 of 45 sources
unreachable (31%, ceiling 15%) because headless Chromium's HTTPS CONNECT tunnel was reset by
the cloud sandbox's proxy — while plain fetch reached the same hosts through the same proxy
without trouble. The run correctly refused to ingest, reverted expiry's 5 deletions rather
than shrink the deck on a degraded read, and shipped nothing. **The underlying CONNECT bug is
platform-side and not fixable from this repo.**

**Two decisions, neither of which waits on the platform.**

**1. The preflight now distinguishes two failures it used to conflate.** It called every
browser failure `browser-egress-blocked` and told Batu to allowlist the host at claude.ai/code
— useless advice when the host was never blocked. It now cross-checks plain fetch against the
same control URL: plain OK + Chromium refused = **`browser-connect-reset`** (a proxy-relay
issue to report as such); both refused = `browser-egress-blocked` as before. Neither is routed
around. A wrong diagnosis costs more than no diagnosis — it sends the fix in the wrong
direction, and this one would have recurred every week.

**2. Sources move to their RSS feed where one exists — starting with Greenpointers.** New
`fetch: "feed"` strategy in `fetch-sources.mjs`, a third alongside `plain` and `browser`.
Greenpointers is the neighborhood's most-read source and was browser-only (JS-thin +
bot-walled). Its feed is plain-fetchable and **carries strictly more**: `content:encoded`
holds the full post body, so the snapshot is the roundup's actual items — times, venues,
free-ness, RSVP links — instead of a front-page diff that yielded only a URL.

That deletes a whole step: the old skill said "verify items at the post itself (Browser
pane)" *because* the front page gave nothing but a link. The feed removes both the browser
dependency and the second fetch. Verified 2026-08-05: 105 lines / 15KB of article text, 10
posts including the current "What's Happening" roundup, `0 error`. The stale front-page
baseline was retired so the format change reads as `new` (full text as the diff) rather than
a phantom 239-line removal; already-ingested posts are still deduped by URL against
`processedItems`.

**Standing rule:** when proposing any new source, check for a feed before proposing `browser`.
Cheapest strategy, fuller text, immune to the browser path being down.

Not fixed here: the other 13 browser-dependent sources (Wix Events, hiSawyer, withfriends,
feather.rsvp, BPL) each need their own adapter, scoped separately. Plain-fetch sources were
never affected — 31 of 45 read fine throughout.

Owner: Batu.

## 2026-08-03 — the ingest learns: a judgment call gets made once, then becomes a rule

Decision (Batu): make held cards trend toward zero instead of recurring. Reviewing PR #18 card-by-card
(the 2026-08-03 Monday run held nine) showed the holds were **not** nine judgment calls:

| Root cause | Count |
|---|---|
| Didn't follow the listing → detail link | 2 |
| A standing rule already covered it | 2 |
| Genuinely new judgment call | **1** |
| Standing source limitation | 4 |

Four of nine were the run failing to use knowledge it already had; four more would have regenerated
every week forever. Only one was new. So the fix is not more policy — it is applying what exists and
never re-deciding a settled call.

**Authority split.** *Facts* ("this newsletter never states per-date venue", "this booking widget is
unreadable by automation") are written by the run itself into `ingest-sources.json` notes or the
ledger's `watchItems` — no approval, both files are already in the content-only file set. *Rules*
(anything deciding how a **class** of future card is filed) go into `ingest-newsletters/SKILL.md`,
proposed in the review PR. **Batu approves the rule once; every future matching card then ships
mechanically.** This needed no new gate — the existing content-only file set already forces a
`SKILL.md` edit into a PR, so a rule can never self-approve while facts flow freely.

**Mechanism** (all in `SKILL.md`): a **resolve-before-you-hold** gate (R1 follow the detail link when a
required field is missing — a per-item page beats an index; R2 check whether a standing rule already
supplies the field; R3 check for a live card of the same shape) that a hold must fail before it is
legitimate, naming which check it failed. `watchItems` is now **read at step 0** so a known-blocked
item is not re-authored just to be re-held. Every run reports
`holds: <n> new-judgment · <n> rule-miss · <n> source-blocked` in its summary and on its
`processedItems` entry — **`rule-miss` is the number being driven to zero**; `new-judgment` should stay
low but never zero, since that is the loop working.

**Backfilled from this run:** a kids *deal* double-files `family_kids` + `deals_memberships` (the
no-double-file rule bars `arts_culture`/`games` only — `moon-bunny-back-to-school` had settled it in
July); adult movement/dance enrollments are `wellness`, not `arts_culture`; an offer with no stated end
date is `recurring` + verified-through, not a hold. The four Brooklyn Craft Company workshops became
`watchItems`, and five of the nine held cards shipped in `e19860a`.

Owner: Batu.

## 2026-08-02 — L8 confirmed live; the full launch-readiness list (L1–L11) is closed

Decision (Batu): verify and record L8. The claude.ai routine `greenpoint-tuesday-growth-readout`
(`trig_01RWSr6yE5tsPuv5EzpZCjYq`) was already `enabled: true` and had already
proven itself 2026-07-28 (real PostHog pull after Batu fixed a mid-run egress
denial, merged readout at `docs/growth/readouts/2026-07-28.md`) — the "disabled
until Batu enables" line in `growth-weekly/SKILL.md` was stale prose, not the
actual state. Triggered a second cycle manually (`RemoteTrigger run`) right
after the L7 origin flip to validate the pipeline against the new canonical
domain and updated `channel-links.md`; runs as its own PR, never touches `main`
directly (skill's Authority section forbids it).

**With L8 confirmed, every item on the L1–L11 launch-readiness table
(`docs/launch/2026-07-27-launch-plan.md` §1) is closed.** Remaining launch-track
work is the seeding waves (§3) — Batu-gated sends, not builds.

Owner: Batu.

## 2026-08-02 — L7 domain cutover shipped: greenpoint.life is canonical, apex primary

Decision (Batu): execute the L7 launch-readiness item — flip the domain cutover. `AEO_ORIGIN` (`src/demand-test/aeo.js`) moved from `https://greenpoint-explorer.vercel.app` to `https://greenpoint.life`, pushed to `main` (`c43ed04..2091b95`).

**Apex made primary, not `www`.** The domain arrived in Vercel with `greenpoint.life` 308-redirecting to `www.greenpoint.life` (Production). Left as-is, every canonical URL, sitemap `<loc>`, `og:url`, and JSON-LD `url` the build now emits would point at a redirecting URL — survivable (crawlers follow 308s, `?src=` verified intact across the hop) but a needless flag for an AEO-first product whose whole bet is being cited directly, and it costs the seeded links/QR cards an extra hop and a longer URL. Flipped in Vercel dashboard: `greenpoint.life` → Production directly, `www.greenpoint.life` → 308 → `greenpoint.life`. `greenpoint-explorer.vercel.app` untouched — stays the rollback target and the live invite-link host (`/july.html` redirect verified still working, query params preserved).

**Prod-verified before and after the flip** (evidence, not assertion): `npm test` 457/457, `npm run build` green, ops-mode freshness check FRESH. Post-deploy: no-JS curl of `/e/<slug>` returns canonical + title/venue/JSON-LD on the new origin; sitemap/rss/ics/llms.txt all 200 on `greenpoint.life`; `www` 308s to apex with `?src=` intact; old vercel.app origin still serves and its `/july.html?src=` redirect preserves params for live invite links.

**Remaining before seeding waves fire:** regenerate every `channel-links.md` row on the new origin (L1's "regenerate at cutover" note). L8 (Growth Operator routine) is now the only open launch-readiness item.

Owner: Batu.

## 2026-08-02 (latest) — Lens id renamed `community` → `civic`; one word for one lens

Decision (Batu): **"its creating confusion. lets keep things simple and consistent."** The morning's relabel had deliberately stopped at the chip — *"Community → 'Civic' is a label change only. The filter id stays `community`"* — leaving the UI saying **Civic** while the card data, the ingest rules and the analytics said `community`. **That entry is superseded: the id is now `civic` end to end.**

**What forced it:** the split was costing more than the migration. Batu tripped on it himself inside a day, reading `community` in a chip-order summary and reading it as a regression. A translation layer that its own owner has to decode is not a saving.

**Concerns raised before proceeding, and how they landed:**
- **Auto-ship blast radius** — card `filters` are schema-validated against `FILTER_IDS`, so a routine authoring `community` after the rename yields invalid cards → `npm test` fails → that day's content ship blocks. Mitigated in the same change: `SKILL.md`'s lens rule now reads **"author `civic`, never `community`, which now fails schema validation."** No cloud-routine edit is required — per the 2026-08-02 auto-ship entry, none of the three routines embed lens definitions; all read `FILTER_IDS` and defer to `SKILL.md`, so taxonomy changes propagate through the repo alone.
- **PostHog discontinuity** — `filter_tap` records the raw filter id (`CardPanel.jsx`), so history splits `community` before / `civic` after, mid-way through the retention baseline running since 2026-07-26. **Accepted, not solved.** Any breakdown on `filter_tap.filter` spanning 2026-08-02 must union the two values.

**Deliberately NOT renamed: the community-ALERT banner.** `communityAlert.js`, `activeCommunityAlert`, and `bannerSlot`'s `kind: "community"` keep their name. A neighborhood-wide alert is a different feature, it is *correctly* named, and it never surfaces as a lens label — renaming it would trade one confusion for another.

**Scope:** 5 cards' `filters` in `cards.json` (verified filters-only — the word also appears in card prose, e.g. "Community-funded court lights", and none of that moved) · `FILTER_IDS` · the `LABELS` map · `CardPanel.jsx` chip comment · `cardSchema.test.mjs`, `filterCards.test.mjs`, `julyCards.test.mjs` · `SKILL.md` §2. A new assertion locks the old id out: `FILTERS.find(f => f.id === "community")` must be `undefined`. 462/462 green, build clean, chip and section still render "Civic".

Owner: Batu.

## 2026-08-02 — Chip order: `FILTER_IDS` reordered so a restocked lens enters at the back

Decision (Batu): reorder the array; **leave the rendered bar alone.** New order — `food_drink, family_kids, arts_culture, live_music, news, deals_memberships, community, wellness, games`.

**Measured at 375px** (production): the bar is 872px against a 375px viewport — only 497px of overflow, so nothing is more than two swipes away. Three chips render fully (All · Food & Drink · Family & Kids), **Arts & Culture is cut at 71%** and serves as the scroll affordance, and Live Music · News · Deals & Memberships are one swipe out. Live counts: News 23 · Food & Drink 14 · Family & Kids 14 · Arts & Culture 11 · Live Music 10 · Deals & Memberships 6 · Games 6 · Civic 3 · Wellness 2.

**What forced it:** `partitionFilters` preserves array order, so an index is not cosmetic — it decides **where a lens lands when it crosses the fold threshold**. `wellness` sat at index 3 and `community` (now `civic`) at index 5, invisible only because both are thin. Stocking wellness to 5 cards would have dropped it straight into the **peek slot**, displacing live_music, news and deals — three established lenses pushed back by one restocked thin one, with no decision behind it. Fold-prone lenses now trail the thick ones, so crossing the threshold enters the bar at the back and earns its way forward. A test asserts this for both `civic` and `wellness`.

**No visual change today** — the primary bar renders byte-identical (same 8 chips, same widths, same offsets). The one intended side effect is inside "More", which reorders `Wellness, Civic, Games` → **`Civic, Wellness, Games`**: descending by supply, mission lens first.

**News stays out of tier 1, deliberately, despite being the largest lens.** An earlier framing in this session called the order "an accident of insertion order" and implied News being off-screen was indefensible; that was wrong and is corrected here. Leading with News would position the product as a local news site — precisely what `docs/context/2026-07-03-greenpointers-differentiation.md` rules out ("never compete as a news product"; they curate the week, we index the neighborhood), and it would do it against the incumbent's strength. **Supply earns tier 2; positioning decides tier 1.** Tier 1 reads *a neighborhood you live in*: universal daily intent, the validated parents wedge, the cultural spine.

**Civic is flickering across the fold threshold** — 5 cards in the morning, 3 by evening as dated civic cards expire, so the chip appears and disappears through the day. **Deliberately not pinned.** The 2026-08-02 sectioning changed what the chip bar is for: the feed now announces a **Civic** section on scroll whether or not the chip is on the bar, so discovery no longer depends on chip placement. This is a **supply** problem — already an open PLAN.md item (unswept civic/nonprofit orgs) — and pinning a 3-card chip would recreate the thin-shelf promise the fold exists to prevent.

Encoded in `cardSchema.js` (`FILTER_IDS` + the rationale), `cardSchema.test.mjs` (order assertion rewritten around intent, plus a new threshold-crossing test). 462/462 green, build clean, bar geometry verified unchanged against production.

Owner: Batu.

## 2026-08-02 — First-viewport promotion evaluated and declined; the sectioning stands alone

Decision (Batu): **"keep current."** The idea he opened this thread with — surface the different content types in the initial viewport so a user "instantly gets the idea" without swiping the chips — is **closed, not deferred.** The shelf sectioning shipped earlier the same day is the whole fix.

Three directions were rendered as live DOM injections against the running app (real CSS, real cards, 375×812) rather than mocked, and all three were rejected:

- **A — one news card promoted inline into Today (~85px).** Killed on truth grounds. An undated news card inside a header reading "Today · Sun, Aug 2" implicitly claims it happens today. Everywhere else the product refuses to fudge a date; this would be the one place it does, on the most-seen screen.
- **B — a section teaser after Today: real "News" header, one card, "13 more in News ↓" (~160px).** Honest and the only option offering *access* rather than awareness — but the identical **News** header reappears ~1,200px down the same scroll, and a repeated header reads as a bug the second time. Unfixable in a linear feed without moving the News section up and interrupting the calendar.
- **C — a contents line under the chips listing all six sections with counts (~62px).** Rejected for a collision only visible once rendered: the chip bar says **News**, the line said **News 14**, and the News *lens* holds 23 — two different numbers for one word on one screen. A countless variant (C′, "below the calendar") resolved that, and Batu still declined it: it informs without seducing, and the first screen is not spent on wayfinding.

**Why this is the right call and not a punt:** the measured problem was that 69% of the deck sat under one anonymous header. Naming the six sections addressed the cause. Every promotion variant spends the product's most valuable screen — the one that produced Josh's "I want to move to Greenpoint," which came from *temporal density*, not categorical breadth — to advertise structure that now announces itself on scroll. Consistent with the same-day games verdict: **first-screen real estate is defended separately from taxonomy.**

**Reopen only on evidence**, not on intuition: if PostHog shows users are still not reaching the shelf (scroll depth past the last day group, or ~zero card opens in the News/Places sections) after the sectioning has been live long enough to read, revisit — and revisit with **B**, since awareness is already solved by the section headers and only access would still be missing.

Owner: Batu.

## 2026-08-02 — The undated shelf renders as six named sections; "Ongoing" retired

Decision (Batu): **"go straight to the Ongoing sectioning."** The single `Ongoing` group is replaced by the six kinds it was already ranked into, each with its own header: **Civic · News · Every week · Deals · Memberships · Places.**

**What forced it:** Josh's 2026-08-02 walkthrough (`docs/context/2026-08-02-josh-feedback-place-and-small-business.md`) — he noticed deals and memberships and **never found news at all**. Investigating the report produced a worse finding than the report: **0 of 23 news-lens cards carry a date.** `groupByDay` buckets every undated card into `ongoing` at `Number.POSITIVE_INFINITY`, so no news card could *ever* enter a day group. News wasn't below the fold — it was unreachable by the feed's only axis. Measured live at 375×812: **55 of 80 cards (69% of the page, 4.6 screens) under one header that begins 2.1 screens down** and names recency instead of subject. The 2026-07-30 kind ranking was already computing the right partition; none of it was legible.

Josh's own diagnosis — "you have to do one full scroll to know that, oh, there's also neighborhood news in this thing" — understated it. He was on **desktop**, where the chip bar wraps and the News chip was fully visible on screen, and he still missed news. The chip bar reads as a narrowing control, not a content index; the feed body is the surface that teaches what's in here.

**Reading order is unchanged.** Every card sits exactly where the 2026-07-30 ranking already put it — this only names the boundaries that were already there, which is why the "shelf orders every kind, freshest first" test now asserts the same flat sequence across sections. No card moved; no rank changed.

**Labels are the product's own words.** The sections first shipped as "How to help" and "What changed" — chosen because the first answers the question Josh asked out loud and the second is the code's own framing for the news tier. Batu killed both the same day: **"is what changed same as News? If so, call it News."**

They are not the same *set*, but they are not a different *concept*: each section is exactly **the undated cards of a lens's core category**. `News` is 14 of the News lens's 23 (the other 9 are business openings, which sit under Places); `Civic` is 3 of the Civic lens's 5 (the other 2 are dated and sit in day groups). Both are strict subsets — the section never contains anything the lens doesn't. So a second vocabulary bought nothing and cost consistency: the chip bar, `category`, `pinKind` and the AEO surface all already say *news* and *civic*. **This is the same drift the Community→Civic rename fixed hours earlier** — prefer the word the rule uses over the friendlier one, and never invent a synonym for a concept the product already names.

The four remaining labels — **Every week · Deals · Memberships · Places** — shadow no chip, so they invent nothing: `Deals`/`Memberships` split the one "Deals & Memberships" chip along the `discount`/`subscription` categories, and `Every week`/`Places` name tiers that have no lens at all.

**Residual worth watching:** tapping the News chip now yields a **News** section (14) *and* a **Places** section (9), because those 9 openings carry the `news` filter but a place-ish `category`. That reads defensibly — an opening is neighborhood news, but it is not reporting. If it confuses anyone, the thing to re-examine is the `news` filter on opening cards, **not** the section label.

**One structural consequence:** the shelf sections carry small ranks (0–5) that a day offset *would* outrank, so calendar-before-shelf became its own sort key rather than a side effect of `POSITIVE_INFINITY`. A dated card 398 days out is the regression guard.

**Cost:** page height 5455 → 5592px at 375px (+2.5%) for six wayfinding anchors.

**Stated risk, accepted:** thin lenses go header-heavy. Live Music renders 8 headers over 10 cards, several sections holding one card. Day groups already did exactly this (5 single-card days in that same lens), so it is a pre-existing pattern rather than a new class of clutter, and the All view — the case that matters — distributes cleanly at 3 / 14 / 8 / 3 / 8 / 18. **Revisit if a section holds one card in the All view.**

**Deliberately NOT done:**
- **No re-ranking.** `new_business` stays under Places, not "What changed" — that is the 2026-07-30 call and this change is not the place to relitigate it.
- **No promotion into the first viewport.** Batu's original proposal (show content-type variety above the fold) was left as a separate step here, then **evaluated and declined the same day — see the entry above.** The first screen still holds ~419px of feed against 9 lenses, and a category carousel is both the generic answer and a trade of validated temporal density ("every day, all day long, there are interesting things I could be doing") for hypothesised categorical breadth.
- **No chip-order change.** News is the largest lens at 23 cards and still sits at position #7 in `FILTER_IDS`, off the right edge at 375px, behind a Wellness chip that folds out anyway. That is currently an accident of insertion order rather than a decision, and per the same-day games precedent — chip real estate is defended separately from taxonomy — **it is Batu's positioning call, not a bug fix.**

Encoded in `filterCards.js` (`SHELF_SECTIONS`, `shelfSection`, `groupByDay` two-key sort, `byFreshest`), `CardPanel.jsx` (headerless rule now keyed on `group.shelf`), `filterCards.test.mjs` (5 rewritten + 4 new tests, incl. the rank↔section drift guard). 461/461 green, build clean, verified in-browser across all seven visible lenses.

Owner: Batu.

## 2026-08-02 — Launch IA: `games` lens added (folded), Community relabelled Civic

Decision (Batu): **"warhammer night shouldn't be in the same lens as cinema noir or art gallery opening. kids events should be in kids."** Plus two calls on the shape of it: **Games lives under "More"**, and **Community is relabelled "Civic"**.

**What forced it:** Arts & Culture had grown to 24 cards — the fattest lens on the bar — doing three unrelated jobs at once: *make things* (four BCC sewing/craft classes, a kids' art workshop), *watch things* (film festival, Film Noir, comedy, artist talk, a one-day choir), and *play things* (Warhammer 40k RTT, two pinball leagues, a backgammon club, weekly chess, the Scrappleland venue card). Six of 24 were games. Someone tapping Arts & Culture for a gallery talk scrolled past Warhammer; someone after pinball scrolled past "Sew Pietra Shorts."

**Why games is a lens and not just a mis-file:** the intent is different in kind. Arts cards are **attend once**; games cards are **join a standing scene** — Tuesday backgammon, Wednesday pinball, Tuesday chess, Tuesday trivia. Two of them are already filed `subscription`, not `event`. Recurring weeknight commitment is the retention shape the product wants; one-off cultural attendance is not. It also clears the volume floor at 8 cards from 5 venues, above Civic (5) and Deals & Memberships (6), and it self-restocks — leagues and club nights regenerate weekly, unlike the frozen `new` lens that got folded into news in July.

**Games is authored-folded into "More"** — a new `FOLDED_FILTER_IDS` in `cardSchema.js`, honoured by `partitionFilters`. This is deliberately **not** the existing thin-layer fold, which is a volume symptom that heals when the ingest stocks a layer: leaving games to the count would let one good week silently promote it onto the primary bar and undo the call. The ~3 chips visible after "All" at 375px are the positioning statement; games seasons the neighborhood, it doesn't define it. Primary chip order is untouched — no muscle-memory reset at launch.

**Community → "Civic" is a label change only.** ⚠️ **Superseded the same day — the id was renamed to `civic` end to end; see the rename entry at the top of this log.** As written: the filter id stays `community`, so authored card membership, the ingest rules and every test still say `community`. The rename closes a gap between the chip and the rule: the 2026-07-30 rule is civic action and mutual aid *only*, and "Community" is exactly the word that kept inviting the social gatherings that rule had to evict (the 40k tournament and the chess night, twice).

**"Kids events in kids"** was already 11-of-12 true; the one real fix was `artistic-voices-artudio` (an explicitly kids' art workshop) double-filed into arts_culture — now family_kids only. `nyplays-fall-registration` (kids' D&D/Magic clubs) stays single-filed to family_kids and deliberately does **not** double-file into games. Greenpoint Library and Kingsland Wildflowers keep their dual file: all-ages venue and festival, not kids events.

**The 8 games cards:** Scrappleland (+food_drink) · Black Rabbit (+food_drink) · Topperz pinball league · Wednesday Pinball League · Tuesday Backgammon Club · Warhammer 40k RTT · Chess & Chill · Board game speed dating at Threes (+food_drink). Black Rabbit is the pickup that makes the lens answer "where's trivia tonight" instead of reading as a pinball page — Tuesday trivia since 2008 and Sunday bingo were invisible inside food_drink. Venues keep their real-world lens; play is an additional membership, not a replacement.

**Stated risks, accepted:** Scrappleland is 4 of 8 cards (50%) — a lens that reads as one venue's programming looks like paid placement and empties on that venue's slow week. Watch it; if concentration holds above 50% across three ingests, either broaden the roster or fold the lens back into arts_culture.

**Deliberately NOT done:**
- **Wellness kept, not retired.** The proposal was to retire it at 2 cards (SPARŚA, Domino Park yoga) as a stale-shelf risk. That rationale was wrong: at 2 live cards wellness is *already* inside "More" via the thin-layer fold, so it never occupies a primary chip. Retiring it would strand SPARŚA with no honest lens (it's category `service`, which the `deals_memberships` rule and its test both refuse) and force the "no card is lens-less" guard into an allowlist. Keeping it costs nothing visible; the supply gap is in the source roster, not the taxonomy.
- **No "Classes & Workshops" lens.** Once kids' classes sit in family_kids, the adult craft cluster is only 4 cards (BCC sewing, embroidery, tie-dye) — under the floor. **Trigger to revisit: ≥7 adult class cards from ≥3 providers.**

Encoded in `cardSchema.js` (`FILTER_IDS`, new `FOLDED_FILTER_IDS`), `filterCards.js` (labels, `partitionFilters`), `cards.json` (9 cards refiled), `cardSchema.test.mjs`, `filterCards.test.mjs`, `julyCards.test.mjs` (new games-lens test), `.claude/skills/ingest-newsletters/SKILL.md` (§2 lens rules). Arts & Culture 24 → 17; games 8; no `category` values changed, so pin colors are untouched.

Owner: Batu.

## 2026-08-02 — Content ingest ships to prod with no human review gate

Decision (Batu): **"update ingest routines to push updates automatically to prod. no review gate on content."** This retires the regime where merging an `ingest/*` PR was both the review gate and the deploy (2026-07-26), and supersedes the narrow zero-add/expiry-only auto-merge promotions (2026-07-28).

**What forced it:** the review gate was gating exactly the runs that carried value. On Aug 2 the queue held four unmerged ingest PRs — three dailies and a Wednesday Greenpointers pull — so the live feed's content was current only through Jul 29 while the deck sat finished in branches. The 2026-07-28 promotion let *nothing-to-review* runs through and held *every* run with an add, which is backwards. **A wrong card is one `git revert` away; a dead feed is a dead product.** For a product whose entire promise is "verified this week," staleness is the larger failure mode.

**The gate did not disappear — it changed kind, from "a human looked at it" to machine-verifiable:** `npm test` green (schema, bbox geocode, lens rules, unique ids, place-graph, no open-start gigs) · `lintCard` clean · **a verbatim sourced quote per claim, no quote no card** · geocodes inside the bbox · `npm run build` succeeds. Truth rules are untouched; they are what the tests enforce.

**Triage is per CARD, not per run** (Batu's refinement, same day: *"unsourced and uncategorized cards should be reviewed. we shouldn't ship a bad card. regular updates should ship."*). A run with nine clean cards and one doubtful one ships nine and PRs the tenth. The human gate wasn't removed — it was **narrowed to the cards that actually need it**.

- **Ships:** substantiated (a verbatim source line carries every claim) · category and lens follow mechanically from the source · nothing inferred · standing gates clear (bbox, locally-owned, aggregator, no duplicate) · `trustRisk: low`, no adjudicated conflict.
- **Held — authored, PR'd, never dropped:** no quote, or a quote thinner than the card · category was a judgment call between two plausible homes · any inferred field (guessed end time, assumed price) · conflicting sources or `trustRisk` medium/high · uncertain locally-owned or geography call · business submission (L5) or first-time source. **Hold keeps the work**: the card goes in the PR with its reason and what would resolve it. A held card is a queue item, not a loss — dropping it to avoid a review is the failure mode this rule exists to prevent.

**The substantiation gate is code, not prose.** New `sourceQuote` field on the card (`cardSchema.js`) holding the extraction subagent's verbatim quote, plus a dated test: any card with `createdAt >= 2026-08-02` and no `sourceQuote` fails `npm test`. `sourceLinks` only ever proved a card was *attributed*; attribution can't catch a plausible sentence assembled around a real URL — which is precisely what a human reviewer used to catch. The pre-2026-08-02 backlog is grandfathered by `createdAt`: those cards *were* reviewed, so re-quoting them retroactively would be theater.

**Always human-gated regardless of card quality:** roster/sender/allowlist additions (a trust decision about a publisher) · any code change (a run touching files outside `cards.json`, `geocode-cache.json`, `ingest-ledger.json`, `freshness-stamp.json`, and the contract counts in `julyCards.test.mjs` **is not a content run**) · **any run swinging the deck >±40%**, the signature of a broken fetch.

**Backstop:** the L11 freshness alarm (2026-07-28) becomes load-bearing — if runs stop shipping, the banner degrades to "listings verified through &lt;date&gt;" instead of presenting a stale deck as current. Consequence: a run must never mark snapshots ingested without shipping, or the stamp will claim a freshness the deck doesn't have. Rollback is `git revert <sha> && git push`; a bad spot-check reverts first and diagnoses after.

**Residual risk, stated plainly:** a card can still be wrong in a way a quote doesn't catch — the source itself is wrong, or the quote is real but the card overreaches it. Accepted; that failure existed under human review too. What changed is that the *unsourced* case — the one autonomy would otherwise have made much more likely — is now blocked by a test rather than by attention. If a bad card ships, the fix is a new test, not a restored review queue.

Encoded in `cardSchema.js` (`sourceQuote`), `julyCards.test.mjs` (dated substantiation test), `.claude/skills/ingest-newsletters/SKILL.md` (§1a extraction contract, §2 truth rules, §3 triage, §4 ship), `CLAUDE.md`, `AGENTS.md`, `README.md`, `docs/PLAN.md`, `docs/growth/growth-engine.md` (§7 ladder — content ingest at V3). **The three claude.ai cloud routines carry their own copies of the prompt — DONE 2026-08-02.** All three (`greenpoint-monday-full-ingest`, `greenpoint-daily-thin-refresh`, `greenpoint-greenpointers-wednesday-pull`) were rewritten in the claude.ai UI. Their old text declared "the review gate is a GitHub pull request … NEVER commit to main and NEVER push main" as a cloud adaptation that *overrides the skill* — so until this edit they would have kept opening PRs no matter what `SKILL.md` said. Each now carries: the per-card ship/hold triage, the machine gates (`npm test` green → `npm run build` → push), the always-human-gated carve-outs (roster/sender, submissions, first-time source, any code change, >±40% deck swing), held cards to an `ingest/*` PR titled "held cards", and "never mark snapshots ingested without shipping." None of them embedded lens definitions — all three defer to `SKILL.md` and now read the lens set from `FILTER_IDS` rather than recalling it, so taxonomy changes propagate through the repo alone.

Owner: Batu.

## 2026-08-02 — Banner charter: horizon, ramp, dwell, tenure, update discipline

Decision (Batu): the banner slot gets a derived rule set instead of per-incident judgment calls. Trigger: the Aug 2 audit found the single-window G banner would go dark after Aug 10 while two more MTA-confirmed Greenpoint closures (Aug 17–21 overnights, Aug 21–24 weekend) followed — and the "distant" chip would happily advertise a closure a month out ("no need to show G disruptions two weeks ahead").

The charter, generated from what the slot is for — **the one message that changes how you use the neighborhood in a horizon you can act on:**

1. **Occupancy** — one banner, ever (keeps 2026-07-26). Precedence unchanged: live/imminent disruption > community alert > stale-data honesty > this-week FYI chip > empty. Silence is the default state.
2. **Lead time** — nothing surfaces more than **7 days** before its window. Inside the horizon, prominence ramps with proximity (re-cut of UX eval F24-A): compact chip ≤7d, **full banner ≤48h** (when weekend plans get made), alert style while live.
3. **Dwell** — a disruption banner lives exactly as long as its sourced window: drops at `endsAt`, no afterglow, then **rolls to the next window**, re-gated by rule 2. The slot shows only the next window — the card holds the full schedule; the slot is never a schedule dump.
4. **Update discipline** — windows enter the data only from the primary source (MTA), and the weekly ingest re-verifies the next window before it can surface. With a 7-day horizon and weekly ingest, every window gets a fresh source check before going live. MTA 403s scripted fetches, so this check is a manual/browser step in the ingest ritual, not a roster URL.
5. **Community-alert tenure** — an alert holds the slot at most **21 days from `sourcedAt`** (banner blindness), then drops to its feed card even if its re-verify deadline hasn't passed. Only a *new sourced development* (fresh `sourcedAt`), not a mere re-verify, resets the clock. Film Noir: slot until Aug 16, card stays.

Encoded in `gtrainBanner.js` (multi-window `GTRAIN_WINDOWS` + `nextGtrainWindow`, phase thresholds), `communityAlert.js` (tenure cap), `bannerSlot.js` (comment); Aug 17–21 and Aug 21–24 added to the `g-train-closures` card timeline from the MTA G-line 2026 page (updated Jul 23, sourced Aug 2).

Owner: Batu.

## 2026-07-30 — "Connected" is now "Related", and shows exactly one card

Decision (Batu): reword the label and constrain it to the single most relevant card.

The place graph is reciprocal, so venue hubs accumulated every event they had ever hosted — Film Noir carried 7 links, the Library 6, the Comedy Club 4. A row of near-identical pills is a menu, not a pointer. 26 of the 34 linked cards already had exactly one live neighbour, so this only changes the hubs, which are exactly where the shelf was noise.

**"Most relevant" has to be derived, because `relatedCardIds` is insertion ordered, not ranked** — Film Noir's list opened with a Jul 27 show. `pickRelated()` in `filterCards.js`: drop expired → soonest upcoming dated card → else freshest evergreen by `createdAt`. From a venue that yields "what's on there next"; from an undated cluster like the G-train story it yields the latest development.

**This also closed a live bug.** `cardsById` is built from the *unfiltered* deck, so related pills could point at cards that had already expired — Film Noir was showing 5 dead shows out of 7, the Library 4 of 6. Tolerable as one pill among many; fatal as the only pill, so expiry filtering is now part of the selection rather than a separate concern.

Ingest note: authored order of `relatedCardIds` carries no meaning — do not try to rank them by hand.

Owner: Batu.

## 2026-07-30 (latest) — The post-value gate is RETIRED; the Follow row is static feed furniture, dismissed per lens

Decision (Batu, after using the built banner): **"too annoying once you use it. feels like a spammy popup. also once i dismissed, it was dismissed from other categories as well which i didn't have a way to undo."** Three changes:

1. **The post-value gate is retired** (`createPostValueGate` + the `july-postvalue-done` key, live since 2026-07-15). The generalizable lesson: **a behavioural trigger is what makes an element read as a popup, regardless of how quietly it is styled.** Both previous rounds treated this as a styling problem — the box, the border, the button. It was never styling. Anything that materialises in response to what the reader just did is a popup. The row is now simply part of the lens: present from the moment a category is selected, never appearing, never moving.
   **What that costs, stated plainly:** a signup no longer proves the reader got value first, so the number is *category interest* rather than *post-value pull*. Accepted while the ask is a personalization probe — category interest is precisely what we are trying to measure. The gate is recoverable from git at 5412473.
2. **Static slot: after the first day group's cards.** Far enough down that the reader has passed real content, but fixed, and it never lands between two cards of the same day — it sits on a day boundary, which is already a break in the feed's rhythm. On a single-group lens this degenerates to the end of the feed, which is the same "you've read it, here's how to keep getting it" order. The list-end duplicate is **gone** ("no need to also anchor it to the bottom") — one placement, no repeats.
3. **Dismiss is per lens and per visit.** The old single global key meant one × silently killed the ask on every other category, with no way back — the collateral damage Batu hit. Dismissals now live in a `Set` of lens ids in React state: per-lens fixes the collateral damage, and keeping it **in memory rather than storage makes a reload the undo**, so no single tap can cost a category permanently. Tapping through to the form also retires that lens's row, since the reader is already in the form and leaving the ask behind them would re-ask.

The footer's ungated "Follow Greenpoint" keeps its job as the general/unsegmented arm (R1 control, growth-engine §2) and steps back in whenever the lens row is absent — the All lens, or a lens the reader waved off — so the surface is never askless.

Owner: Batu.

## 2026-07-30 (later) — The Follow ask becomes a lens-only banner; place-follow withdrawn; the promise is now weekly

Decision (Batu, after reviewing three specced directions in situ at 375px). Four changes, each with a reason that outlives the pixels:

1. **It is a full-bleed BANNER, a peer of the cards — not a box, and not inside a card.** Three versions failed the same way. v1 and v2 were a bordered box whose fill (`--paper-lift`) is the open card's own background, so only its 1px ink border and small radius were ever visible — a treatment identical to `.july-action`, the app's button. That, not the contents, is why "the whole thing looks like a button" survived a redesign of the contents. It also sat on two left edges (box x=12, text x=27) against the card body's x=16, which padding cannot fix. v3 moved it inside `.july-detail` to resolve the edges and Batu rejected it: **"conflates every card repeatedly"** — the ask becomes part of a card's content, and any card can be the anchor. So it is now its own `<li>` in the feed, directly after the card that earned it, styled as a third member of the `.july-gbanner` / `.july-cbanner` family. Full-bleed + square edges is unambiguously not a button, because every control on this surface is content-sized with a radius.
2. **Lens-only.** The ask takes exactly one object — the category lens the reader chose — and renders nothing when none is selected. Reason: it is now an **interest probe for personalization**, so every impression must carry a category the reader picked; a Greenpoint-wide follow mixed generic-digest intent into the same metric and made the signal unreadable. The footer's ungated "Follow Greenpoint" steps back in to cover the All-lens reader (R1's control arm, growth-engine §2) — so the surface is never askless.
3. **Place-follow is withdrawn, not filtered.** The 2026-07-29 category allowlist was necessary but insufficient: a category-*valid* card can still carry a `locationName` that is not a followable entity, because the field does double duty as map venue display. Four cards reached the live ask — "Follow (eavesdrop)" (literal open-paren), "Follow Rotating bar meetup — announced on Instagram" (44 chars, a sentence), "Follow The Little Dance School (Triskelion Arts)". Rather than pile heuristics onto a field that was never a name, the place object is gone. **Reinstating it needs a real venue-identity field, not a normalizer.**
4. **The promise is weekly, and the channel is deliberately unpromised.** "One email when something new lands" was wrong — Batu: *"sending an email everytime something new lands is spam. it could work as an alert, but not email."* The card now says **"One email a week, just {lens}."** — keepable under manual sends (growth-engine §7), and the *personalization* is the differentiator, not the cadence. The channel question (email / text / notification) moves into the Tally form, because the open question is whether this should be mail at all: a text or push flow is what would differentiate it from every other neighborhood digest. **This ask is measuring demand, not shipping a mechanism.**

Also fixed: the alt link "or follow a place instead" called `followHref(SIGNUP_URL, ref)` with the *same* ref as the primary button — it opened the identical form URL and only the analytics label differed, so it promised a place and passed a lens. Deleted with the rest of the place path. Dismiss stays permanent (same `july-postvalue-done` key as a signup), per the one-egg rule.

Owner: Batu.

## 2026-07-30 — Phone-test feedback: two lens rules made hard, Ongoing ranked by kind, Follow card recomposed

Decision (Batu, five items from testing on his phone). Each fix is a rule, not a one-off edit:

1. **Supply CTA is "submit an event"** (was "add yours, free"). Names the actual thing; "free" was arguing a point nobody asked about.
2. **Ongoing is ranked by KIND, freshest-first inside each kind** — `ongoingRank()` in `filterCards.js`: asks (civic/mutual aid) → what changed (news) → recurring programming → standing offers → memberships/signups → places. The old rule was a single news-first partition that fixed its own 2026-07-25 bug and left the other ~36 undated rows in raw ingest-insertion order (a service card between two food_drink cards, three dance signups adrift from a fourth, standing deals at rows 39/45/47). Ranking is by decay rate + actionability; `createdAt` desc inside a tier makes each refresh's additions surface without a manual reorder.
3. **`community` is civic action and mutual aid ONLY** (Batu: "Community has gaming events that shouldn't be there"). The 40k tournament and the weekly chess night moved to `arts_culture`. A merely *social* gathering never qualifies, however community-flavored. **Consequence, accepted:** the lens now holds 3 live cards and folds behind "More" per the F16-B threshold — thin because 3 dated civic cards expired on Jul 28–29, not because of this change; the next ingest restocks it. Threshold left alone deliberately.
4. **`deals_memberships` is deals and standing memberships ONLY.** `subscription` is the schema category for both a standing membership (Falu tinned-fish club — open-ended) and a term enrollment (fall dance registration — a fixed term bought once), so **the lens cannot be derived from the category** and must be authored. Four enrollments/registrations moved to `family_kids`. Both rules are now enforced by tests on the live deck and written into the ingest skill's lens rules.
5. **The Follow card is recomposed as subject → promise → action** (Batu: "the whole thing looks like a button; there's whitespace and alignment issues"). Measured before: a bordered, shadowed box whose ink button ran 257 of 327 usable px, its label centered while every line below sat left at x=27 — box-in-box with nothing aligned, and the card had no subject of its own because the object lived only inside the button label. Now the object is the headline in the row-title register, the promise sits above the action (it informs the decision), the button is sized to a one-word verb (84px) with `aria-label` carrying "Follow {object}", and all four lines share one left edge. Spacing is authored per pair (13 / 1 / 10 / 5) instead of a uniform grid gap. **This strengthens rather than weakens the 2026-07-28 "object from context" decision** — the object is now typographically the subject instead of being buried in a label. Fixed in passing: the one-line promise shipped hardcoded as "One email when they post," which read wrong on a lens or the all-target; it is now per-kind.

Owner: Batu.

## 2026-07-29 — Round-2 crit fixes: 14px body floor, h2 day headers, resilient map framing, far-zoom pins, today-only peek

Decision (Batu: "fix all so there's no remaining known issue"). A same-day clean-context `design_crit` pass on the executed punch-list build passed Gate 2 and returned 5 pre-existing items; all fixed (details in the punch list's "Round 2" section). Durable pieces:

1. **Map framing is self-healing until the reader takes the camera**: fit-to-pins re-runs on container resize (rotation, window resize, peek→expand) and stops forever after the first user drag/zoom or selection pan (`cameraTakenRef` in `MapView.jsx`).
2. **Pins are zoom-tiered**: `.july-map--far` (zoom < 14.2) renders 14px pins / 8px venue dots — overview shows density, working zooms keep the logged 18px. Sizing is width/height only; the never-transform marker rule holds.
3. **The mobile peek shows today + ongoing pins only** (`mapCards` in `JulyApp.jsx`); expand or desktop shows everything. Related accepted constraint: above the `minZoom 12.8` legibility floor a 375px map cannot contain the full pin extent — the peek centers the mass and crops the fringe by design; the zoom floor is not for sale.
4. `window.__iiMap` debug handle, dev-only — camera diagnosis needed it once already.

Owner: Batu.

## 2026-07-29 — Design punch list executed (all but the font); several standing contracts revised

Decision (Batu: "execute `2026-07-29-design-punch-list.md`, don't change font family yet"). Everything on the list shipped except **#2 (typeface)** — face decision deferred — and the **map-peek structural question**, which stays open and Batu's. Durable contract changes, each reversing or extending an earlier logged decision:

1. **Place-follow allowlist (P0 #1, path a):** `followTarget()` only offers a place object for categories that name a followable business; `news`/`civic_action`/`g_train_support`/`support_local` fall back to "Follow Greenpoint". Curated `followLabel` (path b) remains available later if place-follow conversion justifies it.
2. **Kicker/summary field contract (P1 #3):** kicker = the glanceable hook in the row; summary = what the row could not say. `lintCard()` in `cardSchema.js` (warnings: ≥50% kicker overlap, summary > 200 chars) runs on new/changed cards at ingest — the backlog tightens as re-verification touches it, not wholesale. Detail when-line is now **spans only** (`isSpan()`); same-day cards rely on the day header + row clock.
3. **Two-line title contract (P1 #4)** replaces the 2026-07-15 one-line contract: headlines are content (news), addresses are filler — the clamp inverted that. FREE badge top-aligns.
4. **The community-alert pinned feed row is gone (P2 #13)**, revising the 2026-07-26 "feed elevation" clause: the banner alone carries the campaign; the card rides its natural group. `groupByDay` lost its `pinnedId` param.
5. **Follow-prompt object re-derives from the open card (P2 #15)**, and its body is one quiet line below the button ("One email when they post.", P2 #17).
6. Sweep: vendor map chrome joined the palette (#6), `--line-control: #877d69` for control boundaries (#8), reset-target padding (#7), four missing focus rules (#9), the last unguarded motion (#10), header subtitle → "Every listing verified this week." (#11), focus row → "{name} · {count} here" (#12), "Venue calendar"/"Add to calendar" (#14), eased card expansion via grid-track animation (#16), banner CTA sentence-cased (#18). Chip bar height untouched — `--chrome: peek+53px` holds.

Verified: 447/447 tests; in-browser at 320/375/1440 including the P0 repro. Full execution status is recorded at the top of the punch list itself.

Owner: Batu.

## 2026-07-29 — Tally forms finalized: one visible field where possible; hidden params verified end-to-end

Decision (Batu: "keep things super easy and lightweight, ask no more than what's essential"). Every CTA now terminates in a live form that captures its context. Built in Batu's Tally account via browser; all three published.

1. **`44daZo` → "Follow Greenpoint"** (was "July in Greenpoint — weekly map"). **One visible field: email.** The segment is *not* asked — the hidden `follow` param already carries it from context, so R1's test costs the user zero friction. **This retires the "one extra question on the Tally form" plan in growth-engine §2** — asking would duplicate what the app already knows. Copy matches the app's under-promise ("We'll email you when something new lands. Nothing else."). **The business free-text question was removed from this form**: it asked residents a business question, was 0-for-2 answered, and now has its own form.
2. **`aQXzOB` → "Add your event"** (new). Three required fields — business/org name · what's happening (date, time, place) · email — plus hidden `ref` (list|empty). The ultra-light spec from 2026-07-28, unchanged.
3. **`LZqEj1` → "What's missing or wrong?"** — **had no hidden field at all**, so every `?card=<id>` from the L10 correction link was silently dropped: reports arrived with no way to tell which card was wrong. Hidden `card` added. It also had no visible title (rendered Tally's "Form title" placeholder); now set.
4. **Verified, not assumed:** one test submission per form confirmed capture — `{"follow":"lens:family_kids"}`, `{"card":"film-noir-support"}`, `{"ref":"list"}`. Hidden values live in Tally's JS state rather than DOM inputs, so a submission is the only real proof. **Three test rows remain for Batu to delete** (each marked "delete me"/"TEST").
5. Code: `SUBMIT_FORM_URL` → `aQXzOB`; `tally-pull.mjs` pulls the submit form unconditionally (no env var needed).

Known rough edge: the pull output labels hidden fields by Tally's opaque field id (`4v1x15: {"ref":"list"}`) not the param name. Readable, but the Monday "asks" step reads this — worth a formatter fix if it grates.

Owner: Batu.

## 2026-07-29 — Follow shipped: the ask renders at its trigger, object taken from context; footer becomes "Follow Greenpoint"

Decision (Batu, design reviewed then approved to build). Implements the resident CTA adopted 2026-07-28 (Follow replaced the Monday digest) and closes the parked placement finding from the same day.

1. **The prompt renders beside the card that earned it**, not at the end of the list. `postValue.js` always fired on the right *behaviour* (2 `card_open` / 1 `action_tap`); the prompt just rendered somewhere the reader wasn't — measured **6,714px away from a reader sitting at 180px**, ~8 screens. `JulyApp` now captures the triggering `cardId` off the event stream and `CardPanel` renders the prompt inside that card's row. Measured after: **283px below the trigger card, on screen.**
2. **The object comes from context, so the ask is concrete** — active lens → that lens ("Follow Family & Kids") · all-lens → the trigger card's place ("Follow Greenpoint Library") · neither → all of Greenpoint. `followTarget()` / `followRef()` in `postValue.js`, both pure and tested. A place target drops the "or follow a place instead" line, since it would offer what you already have.
3. **Transport is the existing Tally, zero backend** — `followHref()` carries `?follow=lens:<id>|place:<id>|all` into a hidden field, matching the `correctionHref`/`submitHref` pattern. R1's control arm is structural: anyone who arrives without a segment is the broadcast group (growth-engine §2).
4. **Footer becomes "Follow Greenpoint"** (`follow=all`) — Follow at its widest for readers who scroll past without tripping the gate.
5. **Copy under-promises deliberately (Batu):** "We'll email you when something new lands in X" — not "alerts", not a cadence. Sends are permanently manual (§7), so a quiet lens means silence for weeks; the copy has to survive that. The exciting version would be a promise the backend-free architecture cannot keep.
6. **One rung stays visible** — no Follow affordance on cards, which would ask on the first visit and break the one-egg rule. The ask exists at the post-value moment plus the footer fallback.
7. **Fallback:** if the trigger card leaves the view (lens change, pin focus), the prompt falls back to the end of the list and re-derives its object from the now-active lens rather than disappearing with the card.

Analytics: `cta_tap { cta: "follow", placement: "inline"|"listend"|"footer", object }` — no new event name, so the frozen `EVENTS` contract is untouched.

Owner: Batu.

## 2026-07-28 — UX correction pass: one supply row, correction link separated, touch targets swept

Decision (Batu, after reviewing the shipped L5 UI and calling four usability misses). The L5 build was mechanically correct and compositionally wrong; the review found more than it was pointed at.

1. **One supply row replaces two.** The feed-end zone had stacked three competing asks (feedback row · submit row · digest button). Merged to a single row — "Missing something? **Tell us** or **add yours, free →**" — two links, two audiences, one line, both events (`feedback_tap` / `submit_tap`) kept separable. The "or wrong?" half was retired from this row because the per-card correction link now reports in context; the remaining job here is the *gap*.
2. **The per-card correction link left the source line.** It had lived inside `<p class="july-source">`, sharing that paragraph's `·` separator and micro-caps styling with genuine citations — so "Source: The Carcosa Club · Something wrong?" parsed as a second source. `.july-report` had **zero CSS rules**. Now its own line, sentence case ("Report an error"), 12.5px, 33px target.
3. **Touch-target sweep (unscoped).** 63 of 169 interactive elements failed the 12px-type / 32px-target bar. Fixed in the feed: supply row, correction link, related chips, source links. **Map pins (18–24px) are knowingly left** — a different interaction class with tap tolerance; revisit only if pin mis-taps show up.
4. **Copy tightened.** Submit ask 13 words → 5; the post-value prompt no longer says "Monday" twice.
5. **Above the fold stays empty of asks** — §0's one-egg rule ("first visit asks nothing") is the reason, so this is by design, not a gap. No header CTA.
6. **Process correction (the actual root cause):** the L5 design_crit pass was **scoped to the new element**, so it could not see composition, reachability, or neighbouring surfaces, and only Gate 0 was run. Standing rule going forward: **crit the surface, not the diff** — run the full gate loop unscoped before commit, and verify the behavioural premise a placement argument rests on (here: nobody measured the scroll distance to the thing being placed).

Owner: Batu.

## 2026-07-28 — L5 shipped: feed-end submit row + empty-state echo; ultra-light form first; digest copy states the Monday contract

Decision (Batu, via plan approval). The business submission path (L5, the last build before cutover) ships as **chrome, not a card** — a synthetic card would break the schema coords rule, the card-count contract, the AEO surface, and the truth rules; ops-plan 3.3's "pinned CTA card" wording was stale relative to §0's low-salience rule.

1. **Placement:** a standing quiet row after the feedback row at the feed's end (every lens) — "Run a Greenpoint business or org? **Add your event — free, verified, on the map →**" (§0's canonical phrase verbatim; "or org" per design_crit — the library and Town Square must not read themselves out of the door). One notch below the feedback row (0.78rem, soft-ink qualifier, shared dashed-top block); the digest CTA remains the panel's only button. Empty lenses carry a shortened echo ("Run a business or org here? Add your event →") under the recovery action. Rejected: header/banner (one-banner charter, wrong salience), under the digest button (footer is prompt-conditional; stacked-ask problem), pinned top-of-feed (sells to residents), card-based (above).
2. **Form is ultra-light by intent (Batu):** pre-launch, no business queues up to be featured on an app with no users — the CTA measures lightweight interest (`submit_tap`, `placement: list|empty`; `?ref=` provenance rides into the form). Fields: business/org name · what's happening · email. **Upgrade to review-ready-minimum fields is data-gated, post-launch.** Until the dedicated Tally form exists, the link points at the feedback form (asks land there; nothing is lost) — swap `SUBMIT_FORM_URL` + `TALLY_SUBMIT_FORM_ID` when Batu creates it.
3. **Submissions join the Monday ingest run as "asks"** — supply-gate evidence first, cards second; a card only ships if its claims verify at a named source through the normal gates; submission-derived adds never qualify for the zero-add auto-merge promotion.
4. **Digest contract (§0 consequence, same ship):** the resident signup now states the cadence — "Get the Monday list" (prompt + footer). Copy only.

Owner: Batu.

## 2026-07-28 — Resident CTA revised: Follow (a lens or a place) replaces the Monday digest; digest demoted to R1's control arm

Decision (Batu, same day, superseding item 1 of the entry below). Batu challenged the digest on three grounds — it competes head-on with the established neighborhood newsletters (Greenpointers, OMGreenpoint) in *their* format, it capitalizes on none of our differentiators, and it isn't personalized. A first-principles re-derivation from the digest's underlying purpose (external cue + a reason to come now + a permissioned channel + a countable return) confirmed all three and added two more strikes from our own docs.

**Why the digest was wrong.** `business-model.md` §1 defines a newsletter as "a push moment — value spent at publish time; cannot answer a question asked Tuesday at 6pm" and defines us as its structural opposite: **we had written the case against our own re-entry mechanism.** Two operational strikes compound it: sending is permanently Batu's (growth-engine §7), so the digest is the one growth mechanism whose cost never stops — colliding with H6 and with §6's own rule that anything recurring which can't be automated into the Mon/Tue rhythm doesn't ship; and **it manufactures the metric that reads the gate** — the demand bar requires "majority arriving without a fresh invite push," and a weekly email is that push.

1. **Resident CTA = Follow — one verb, two objects: a lens** ("free + kids," "tonight," "civic") **or a place** ("tell me when Dandelion Wine does something"). Nothing is broadcast; everything is chosen — the structural inverse of a newsletter, and differentiator #1 (query-answering structure) turned into a product. It remains **one** CTA under the one-egg rule: one mechanism, one transport, one ask; only the object changes with context. The ask ladder becomes no-ask → **Follow** → share.
2. **Follow feeds two loops from one tap.** Follow-a-place produces **per-business follower counts** — precisely the demand evidence the proof-of-value email carries (Loop B's missing mechanism) and that H2 tests. The digest generated no supply-side asset at all.
3. **R1 restructured: the digest becomes the control arm, not the treatment.** Segmented Follow alerts (`?src=follow-<lens>`) run against the unsegmented Monday digest (`?src=digest`) for 3 weeks. **The design contains its own control — the answer is empirical, not argued.** Kill: if segmented doesn't beat broadcast by week 3, personalization isn't worth a backend, we fall back to the digest and close the question. Time-boxed either way, since manual segment sends cost more founder-minutes than one digest. Smallest test is zero-build: one extra question on the Tally form Batu is already creating for L5.
4. **Calendar subscription (`events.ics`) stays the ambient layer, not the ask.** It was the other finalist and it wins on habit fit (no new routine, zero founder-labor forever, and a self-installed recurring cue is more gate-honest than anything we push). It loses as the CTA: subscribing is painful on Android, the ask is abstract at the post-value moment, and a calendar-only subscriber never returns to the site — satisfying the user while starving WRL. Per-lens `.ics` feeds are a small post-launch build.
5. **Known cost, deferred not hidden:** automating Follow eventually needs a backend, and the architecture is deliberately backend-free. That decision waits on the R1 result.

**Method note (why this was missed the first time):** §0 was written as a coherence pass over the existing docs, so R1 was inherited as a fixed input and the CTA question was framed as *digest or share* — a selection from a menu nobody had re-derived. Offering a choice between two inherited options can pass for rigor while hiding the absence of exploration. Standing correction: when a doc set is the input, cross-examine the docs against each other, and generate from the underlying purpose before selecting from what's written down.

Owner: Batu.

## 2026-07-28 — Audience → CTA map adopted: one CTA per audience, digest is the resident CTA

Decision (Batu). Derived from the business model and growth engine rather than from what the product currently does: **every audience serves exactly one loop, and its one CTA is the action that turns a visit into fuel for that loop** — not the most useful thing that audience can do. Adopted as **`docs/growth/growth-engine.md` §0**, the trace every experiment and launch item routes back to; a build that serves no audience's one CTA is not a loop-edge repair.

1. **Resident → "Get the week, every Monday" (the digest).** Chosen by Batu over share: re-entry is Loop A's weakest edge and weekly returning locals is the compounding metric — nothing else in the product creates a reason to come back. The ask is a **ladder with one rung visible at a time**: first visit asks nothing (one-egg rule; `postValue.js` already gates on 2 `card_open` / 1 `action_tap`) → activated gets the digest → returning/habitual gets share, which is where the organic >50% word-of-mouth signal reads. Consequence: the existing email signup needs a stated weekly contract ("the Monday list") — copy, not build, and it is what converts the gate into R1's re-entry promise.
2. **Business/venue owner → "Add your event — free, verified, on the map."** Persistent but low-salience: businesses arrive with intent and need to be findable, not sold; the entry also signals completeness to residents. Unbuilt — this is **L5**, the last build before cutover.
3. **Institutional buyer → "Request the corridor brief," off-product.** No buyer CTA on the resident surface, ever — business-model.md §2 rules 4 and 6 make it a non-negotiable, not a preference. The buyer's path is a separate trust surface (published coverage standards, verified-through, unique-coverage count). **The app is the proof, not the pitch** — consistent with the brief-first pilot, whose headline deliverable is audience-independent by design.
4. **Answer engines/crawlers are an audience, not infrastructure.** Their CTA is *cite this page*: a dated, attributable, canonical fact block. Loop C's edge is already repaired (3.6); §0 states what the audience is for.
5. **Org leaders are not a distinct audience (Batu).** Treated as residents handed a tagged link (Q1/Q2 seeding). An org-scoped surface would serve their redistribution role but is not an immediate priority and earns no freeze exception.
6. **Actions deliberately not offered**, recorded so they stop being re-proposed: accounts/login (breaks the one egg and the cookieless stance) · resident payment or tip jar · "claim your listing" (retired; reads as coverage-for-sale) · any paid-placement surface before the demand gate · sponsorship on news or civic cards. The per-card correction link (L10) stays available to everyone — the zero-friction supply entry that works before L5 exists.

Gap surfaced and left open: the **published coverage standards page** (business-model.md §4) does not exist and pays into two loops — buyer trust and answer-engine trust. Not scheduled; post-launch candidate under the freeze.

`business-model.md` needs no amendment — §2 rules 4 and 6 already bind rule 3 above.

Owner: Batu.

## 2026-07-28 — Business model re-evaluated blank-slate: neighborhood economic utility, three revenue layers; claim model retired

Decision (Batu). The claim model — storefront signs default to category labels, businesses pay to attach real branding — belonged to the parked 3D concept and lost its premise once the product became automatically-sourced verified events from verified local businesses. Re-evaluated from a blank slate against Batu's evolving vision (economic opportunity at hyperlocal scale; demand = things to do, supply = events/deals/memberships; testing news + civic; longer-term curiosities in local jobs/gigs and no-storefront services; scale path Greenpoint → Williamsburg → North Brooklyn). Full model of record: **`docs/growth/business-model.md`**.

Structure set by Batu: **bootstrapped indie** (no outside capital, each neighborhood pays for itself), a defined income target within ~12 months of launch, **residents never pay**, time split between a few high-value relationships and self-serve for the long tail.

**Doc split (same-day decision, see the entry below):** the repo carries a **constraints-only** `docs/growth/business-model.md`; all pricing, revenue targets, prospect detail, partner assessments, and market evidence live in the gitignored `docs/private/business-model.md`. This entry follows the same rule — structural decisions here, numbers there.

1. **Model = neighborhood economic utility.** Free, complete, verified coverage for residents; funded by institutions and businesses that benefit from a legible local economy. Governing rule: **payers buy function or presence, never truth.** Non-negotiables: residents never pay · coverage never for sale (comprehensiveness *is* the product; paid = enhancement, never admission) · every paid surface labeled · news and community/civic surfaces never monetize · ≤1 featured slot per lens per week · no payer influences coverage.
2. **Three revenue layers, in order.** **L1 Founding Partners** (year-one spine; a small number of anchors sold by Batu personally). **L2 self-serve business layer** (post-demand-proof; featured slots, business dashboard with demand analytics, campaign promotion). **L3 spatial intelligence** (year 2; recurring neighborhood-vitality report built from the ingest corpus, sold to developers/brokers/BIDs/city programs — **aggregate + public-source only, never individual data or inferred distress**).
3. **PMF gate reinterpreted, not relaxed: sell before, ship after.** Anchor conversations open pre-verdict (they cost nothing and take months); no paid surface goes live before the ~Sep 15 verdict. Breakeven arrives with the first anchor. **Weekly returning locals is the revenue plan's leading indicator** — L1 renewals and all of L2 price off it.
4. **Distribution is priced into the model** — the answer to "we're not where our users are." **No anchor deal without a distribution deliverable** (lobby/window/in-branch placement, partner-channel announcements); the founding discount is explicitly payment-in-distribution. Non-payer partners carry the rest: **Greenpointers = distribution swap, partner not rival**; Chamber = legitimacy + member distribution, not a payer.
5. **Research corrections that changed the plan** (sourced 2026-07-28; figures in the private doc §3): sponsorship-led media was **rejected on evidence** — comparable hyperlocal outlets earn structurally insignificant ad revenue next to reader subscriptions, and subscriptions are ruled out here by non-negotiable 1. The Chamber is too small to anchor. **Greenpoint has no BID**; the institutional money sits in Williamsburg, which is why **expansion is a revenue event, not a cost event**.
6. **Kill criteria, pre-registered:** if by **Dec 1 2026** no anchor has signed at any price after **≥6 real conversations**, the spine is wrong — fall back to L2-first on a slower timeline and re-open the model with the rejection reasons as data. Also: no payer >50% of revenue after month 6; featured-slot format dies on resident complaints or an engagement drop on featured-adjacent cards. *(Superseded same day, twice: resized to ≥12 conversations (external-review entry), then re-timed to **Feb 15 2027, reason-conditional** (pressure-test entry). The current criterion is the pressure-test version — the private doc is authoritative.)*

**Supersedes:** the claim model in all its forms; "sponsored campaign maps → partner tooling → evidence-gated featured cards" (2026-07-26); and "never charge small businesses first," which is sharpened to *never sell coverage; institutions before small businesses in time* (L1 → L2). **Unchanged:** truth rules, banner charter, paid acquisition ruled out permanently, growth-engine loops and metrics, and the pre-PMF ban on geographic expansion. Loop B is renamed **supply loop** (metric and weakest edge unchanged).

Owner: Batu.

## 2026-07-28 — Pressure-test folded in: brief-first pilots, H8, seasonality regime, feed density, two launch-readiness builds

Decision (Batu, same day). Three independent adversarial agent passes (investor / operator / skeptical buyer) plus a main-thread pass pressure-tested the amended model; full findings preserved privately (`docs/private/pressure-test-2026-07-28.md`). Verdict adopted: **the model is a validation plan, not an income forecast — Greenpoint alone is a proof machine; the income target routes through expansion + Layer 3 or is revisited.** Amendments, all pre-launch/pre-data:

1. **Brief-first pilots (Batu):** the Layer-1 pilot's headline deliverable is the **corridor brief** (audience-independent value from the ingest corpus); presence/slots/distribution bundle in. Every buyer conversation otherwise dies on "you have no audience," and free complete coverage means presence-alone cannibalizes itself. Terms: 180 days, or 90 with renewal's leading indicators pre-agreed. Distribution placements become a **priced fee offset**, never an extracted obligation. Buyer requalification: venues/event spaces are Layer 2 customers, not anchors (excluded from the qualified-conversation count); owner-operators before institutional (AP/COI reality); credit union before bank; the §2 non-negotiables lead the institutional pitch.
2. **H8 added — the missing load-bearing hypothesis:** the audience reaches the size the prices require; N derived backwards from the renewal price (arithmetic private). If N is unreachable, Layer 1 is mission money — flat, annually re-bid, no step-up — and the in-neighborhood ceiling is accepted or the model is revisited by Batu.
3. **Seasonality regime (the word previously appeared in zero strategy docs):** no gate read and no renewal priced on raw Dec–Feb numbers; pilot terms avoid Jan–Feb renewal windows; September experiment reads carry a standing autumn-rebound confound label; **feed density** (dated items next-7-days + roster yield share) becomes a weekly readout line, baselined pre-launch at 95 cards · 38 in-window · 48 sources.
4. **Demand bar re-formed pre-data (Batu):** ≥30 locals returning in **≥3 of any 4 consecutive weeks** (weekly-habit bar matched to a weekly-refresh product), majority unprompted; the old ≥2-visits/week measure becomes a supporting intensity signal. Commercial kill re-timed to **Feb 15 2027, reason-conditional** (Q4-set budgets activate in January; a December "no" is a calendar artifact). Sector-concentration criterion added (Layers 1+3 are one correlated bet on North Brooklyn retail leasing; exclusivity enforces it; developer need expires on success).
5. **Two launch-readiness builds approved as error-monitoring-class freeze exceptions (Batu):** **L10** per-card "Something wrong?" correction link (prefilled card id) + correction SLA in AGENTS.md (ack <24h; **unpublish first, verify second** — deletion pre-approved 2026-07-16; ledger-logged); **L11** feed-freshness alarm (`lastRunAt` <48h + dated-card floor) + "verified through" line in the banner slot. The 7/27–28 outage was invisible without L11; "verified" is not a credible promise without L10.
6. **Autonomy: two standing V3 promotions (Batu)** — zero-add ingest runs and expiry-only runs auto-merge with notification (review minutes, not tokens, are the scarce resource); anything with an add/edit/first-time source stays human-gated; daily cadence unchanged. Also: proof-of-value emails send only above a signal floor (below-floor businesses are H2's control group); H6's 8-week window re-runs after the first pilot is signed and must include sales/servicing hours.

Surfaced, not moved: the investor pass argues the dormant resident-support contingency may be the only in-neighborhood path to the income band — it stays dormant; the decision remains Batu's.

Owner: Batu.

## 2026-07-28 — Monetization decisions parked; sole priority is PMF

Decision (Batu, end of the business-model day). All open monetization decisions — standing-vs-episodic partner slots, the LION pipeline-as-product option, H9's timed brief, pilot sequencing — are **parked, not pressing**. The only priority is understanding whether what we're building is valuable: **launch, learn, iterate toward PMF.** The business-model and pressure-test work in the entries below is banked context for the day demand evidence exists; none of it fires before the gates it's already sequenced behind, and none of it should be raised for decision until then. What matters now is the launch list (L5 · L7 · L8) and the learning instruments already live or specced: demand gate cohorts, feed density, unique-coverage count, R0 baseline, qualitative resident evidence.

Owner: Batu.

## 2026-07-28 — Round-2 investor pass: ceiling re-corrected, H9 timed-brief test, contracts and concentration criteria fixed

Decision (Batu-approved re-run after the first investor agent was lost mid-run). A second investor pass attacked the *already-corrected* model. Verdict as given: "no as a bootstrapped income business **at all-human delivery hours**." Synthesis accepted most findings, pushed back on the load-bearing assumption, and made one test decisive:

1. **Ceiling re-corrected downward ~15% (figures in the private doc):** the first ceiling double-counted featured inventory — L1 partners' standing slots consume the same lens-weeks Layer 2 sells. The upside scenario sits *above* the structural ceiling; it closes only via Layer 3 revenue or restructuring partner presence as episodic featured weeks (**open Batu decision: standing vs. episodic slots**). New accounting rule in both docs: partner featured weeks count against sellable inventory, never double-counted.
2. **The synthesis pushback:** the investor priced every delivery hour as founder labor; the repo's architecture exists to falsify exactly that (agent-executed, founder-reviewed). Resolution is empirical, not rhetorical — **H9: produce one corridor brief end-to-end and time founder-minutes, before the first pilot conversation.** Pass ≤2 founder-hours; >4 → reprice pilots or drop brief-first. One afternoon, resolves the margin question in either direction.
3. **Contracts fixed:** pilot terms fixed + non-cancellable (refund window only at the start; the 30-day exit is post-pilot only — otherwise "prepaid" was a 30-day subscription with a deposit); the included brief carries a stated standalone price so bundling never anchors Layer 3 at $0; exclusivity scoped to featured presence, never to who may buy.
4. **Concentration criteria rewritten enforceable** (old ones were arithmetically unsatisfiable — payer #1 is 100% by construction): month-12, trailing-3-month thresholds with trigger actions (diversify-next-deal, pause step-ups, target uncovered sectors).
5. **Expansion scope economy named:** per-neighborhood operating cost is roughly flat, so expansion economics come from **multi-neighborhood package buyers** (credit union, corridor brokerage, multi-asset owner) — first Williamsburg conversation targets one. In-neighborhood L3 ≈ the L1 wallets (repricing, not new revenue); incremental L3 is expansion-era.
6. **Loops read economically** (growth-engine note): Loop A is constant-cost operations, not compounding; the compounders are C (citations/archive — the corpus accrues only where *published*) and B (submissions displace ingest labor); founder-hours drift A→B/C as A stabilizes.
7. **Recorded, not adopted (Batu's open option):** the ingest engine sold as capability to other hyperlocal publishers (LION pool) may outvalue operating neighborhoods; test if ever wanted = five publisher conversations post-launch. Sales-CAC and LTV are now forecast inputs in the private doc (details there).

Owner: Batu.

## 2026-07-28 — Positioning sharpened: index-not-newsletter; structurally non-competing with Greenpointers; community-run events deferred

Decision (Batu). Raised by Batu after the pressure-test: "what's happening and what's worth doing" is near-1:1 with what Greenpointers/OMGreenpoint already claim, and Greenpointers must not come to see us as competition. Resolution — the positioning is structural, not editorial:

1. **They curate the week; we index the neighborhood.** A newsletter is a push moment (someone picked ~10 things, value spent at publish, can't answer a Tuesday-6pm question); the index is a pull utility — complete not selected, structured not prose, current not weekly, compounding not ephemeral. `business-model.md` §1 rewritten accordingly; PLAN.md positioning line extended. Weekly returning behavior is the *proof* of utility-not-publication, which is why WRL was already the right north star.
2. **Differentiators graded (Batu's list, assessed):** query-answering structure first; **deals & memberships strongest** (persistent state — structurally impossible for a newsletter); civic participation truth-rule-clean and the substance of the institutional community-benefit story; "coverage the newsletters miss" now **measured, not asserted** — a weekly **unique-coverage count** added to the growth-engine instruments next to feed density.
3. **Community-run events (stoop/sidewalk sales): deferred post-PMF (Batu).** Real white space, but no named source — requires a designed second verification tier (resident-reported label, corroboration, short expiry, no AEO). The truth-rule asset outranks the differentiator. Recorded in PLAN.md open items. Jobs/gigs stay parked.
4. **Non-compete is architecture, not promise:** we sell structure, never attention (reconfirmed with the brief-first pilot decision) — so we never bid for the newsletters' sponsorship dollar; we cite their reporting, and the offerable swap is a weekly "on the map this week" embed that sends them traffic. Swap remains hypothesis H4, not an assumption. Honest internal caveat: a complete index eventually erodes newsletter discovery regardless of intent; the mitigation is keeping partners measurably better off inside the relationship.

Owner: Batu.

## 2026-07-28 — External review folded in: four validation gates, pilot-first revenue, loop closures, ban recalibration

Decision (Batu, same day as adoption). An external critique of the business model + growth engine was triaged claim-by-claim (~70% accepted; items already handled in the docs or contradicting owner decisions were rejected or re-decided by Batu). Its core correction is adopted as doctrine: **audience retention and business-model validation are different things — resident counts never unlock commercial assumptions.** Amendments, all made **before launch, before any data existed** (amending a pre-registered bar is legitimate only pre-data; this window closes at launch):

1. **Four validation gates replace the single PMF verdict** (`business-model.md` §4): demand (~Sep 15 now a *provisional* readout — an Aug 1–8 launch yields only ~5–6 weeks; firm verdict ~late Oct on two mature 4-week cohorts) · distribution (≥2 self-sustaining channels) · supply (unchanged bar) · **commercial (3 paid pilots or signed LOIs — the only gate that opens paid surfaces' pricing assumptions)**.
2. **Each revenue layer enters through its cheapest validated form:** L1 = 90-day prepaid Founding Pilots with buyer-specific offers and quantified distribution obligations (not open-ended sponsorships); L2 = **manual monthly proof-of-value email before any dashboard** — this also closes Loop B's missing edge (supplier proof-of-value: submission → publication receipt → outcome report → repeat); L3 = bespoke paid briefs before any report product.
3. **Kill criterion resized** — the 6-conversation floor carried a ~26% false-kill risk at healthy conversion (0.8⁶); now ≥12 qualified conversations across ≥3 buyer types by Dec 15 (math in the private doc).
4. **Moat claim retracted:** the ingest corpus is an *emerging proprietary asset*; the moat is coverage trust + direct supply relationships + engagement evidence, none of which exist yet.
5. **Expansion unlock replaced** — repeatability gate (8 weeks in time budget, renewal intent, ≥25% direct supply, error targets, signed target-neighborhood commitment) instead of the cash-cost rule, which priced the servers and not the operator. Founder labor is now tracked as a real cost (economics in the private doc). Northside BID relabeled upside, never base-case.
6. **Ban recalibration (Batu):** resident *paywall* permanent, voluntary support a dormant post-PMF contingency; paid acquisition "never" → absolute pre-PMF then sponsor-funded/geo-targeted/Batu-approved only (the $0-revenue/user premise was changed by the model itself); social ban narrowed to account-grinding — one 4-week auto-generated-carousel test approved as a post-launch experiment candidate.
7. **Sponsorship disclosure hardened per FTC guidance:** labels are "Sponsored"/"Paid placement," never "Featured" alone; governance + contract skeleton in the private doc. Also new: a published coverage-standards commitment, a hypothesis-status table (H1–H7) in `business-model.md`, and the Greenpointers swap reframed as a hypothesis to negotiate, not assumed distribution.

Rejected from the review: renaming the doc (hypothesis table delivers the substance), "Loop A isn't a loop" (pre-PMF founder-driven loops are the growth engine's stated stance), and re-litigating attribution honesty (the 7/28 readout already documented untagged ≠ word-of-mouth). Sources checked: FTC native-advertising guide and Google's structured-data caveats verified; the in-yc substitute claim unverified and immaterial either way.

Owner: Batu.

## 2026-07-28 — Strategy docs split by sensitivity: rules in the repo, numbers in gitignored `docs/private/`

Decision (Batu). Business strategy should not be visible in GitHub. The repo is already private, and `PLAN.md` / `DECISION_LOG.md` / `growth-engine.md` have carried strategy for months — so rather than pull strategy out wholesale (which would break the Tuesday Growth Operator cloud routine, which reads growth-engine §2–4/§7 and this log from a fresh checkout), the split is **by sensitivity, not by topic**:

1. **In the repo — the constraints.** `docs/growth/business-model.md` holds the non-negotiables, the layer names and order, the gates, and the expansion unlock rule. Rationale: what stops a future session from building a resident paywall is the rule "residents never pay," not the price of a Founding Partner slot. Agents and cloud routines need the constraints; they do not need the economics.
2. **Out of the repo — the numbers.** `docs/private/business-model.md` (gitignored) holds all pricing, revenue targets, Batu's income goal, named prospect categories, candid partner assessments, and the sourced market evidence. The same sanitization is applied to the business-model entry above and to `PLAN.md`.
3. **Mechanism:** `docs/private/` added to `.gitignore`. The originating commit was **amended before any push**, so the full version never reached GitHub — deletion after pushing would have left it in history permanently.
4. **Known tradeoff, accepted:** the private file has no version history and no backup. If the machine dies, it dies. Flagged in the file's own header.
5. **Standing rule for future work:** when the model changes, update **both** — rules in the repo copy, numbers in the private copy. Never move a figure into the repo copy to make a doc read better. If a task appears to need the numbers, ask Batu rather than inferring them.

Owner: Batu.

## 2026-07-28 — Two-day ingest outage: root cause is the cloud routine's network egress, not `.claude/settings.json`

The 2026-07-27 and 2026-07-28 daily thin runs both went expiry-only: all 45 web roster sources were unreachable, reproduced with plain `curl` outside the fetch script for every host — including domains already correctly listed in the committed allowlist. That rules out `.claude/settings.json` as the cause: it only gates Claude Code's own `WebFetch` tool inside an interactive session; it has no effect on raw subprocess network calls (`curl`, `node fetch`, Playwright) that `scripts/fetch-sources.mjs` makes when it runs inside the cloud routine's sandbox. The actual block was at that sandbox's network/egress layer — infrastructure outside this repo, not something a repo file could fix.

**RESOLVED same day.** The cloud environment's network-access setting had reverted to its **Trusted** preset (no custom domains) instead of **Custom**. Batu switched it to Custom and pasted in the full roster domain list (roster hosts + `nominatim.openstreetmap.org` for geocoding + `cdn.playwright.dev` for browser self-heal, redirect targets included). This was a claude.ai cloud-environment setting, not a repo file — nothing here would have surfaced or fixed it; the `curl`-outside-the-script repro is what pointed at "environment, not code."

Two real repo bugs found and fixed alongside it (neither was the root cause, but both were masking or would have recurred once egress was restored):

1. **Stale allowlist entry.** `nyplays` moved its fetch target to `https://www.hisawyer.com/...` on 2026-07-27 (see `ingest-sources.json` notes), but `.claude/settings.json` still listed the old `nyplays.org`. Swapped to `www.hisawyer.com`.
2. **Playwright/Chromium version pinned ahead of the cloud sandbox's image (labeled workaround).** `playwright@1.62.0` bundles Chromium build 1234; the cloud routine's sandbox image ships build 1194 and can't self-heal via `npx playwright install` because `cdn.playwright.dev` was itself blocked by the same egress issue. Pinned `playwright` to the exact version whose bundled Chromium matches what the sandbox actually has: **`1.56.0` → Chromium 1194** (verified via each version's `browsers.json`; exact pin, not `^`, so `npm install` can't silently drift it back ahead of the sandbox again). This is debt, not a real fix: it's tied to today's known-stale sandbox image and will need re-pinning (or removing, if the image catches up) whenever Anthropic updates the cloud routine's environment. Also dropped an unneeded `www.` from 3 roster URLs (`wordbookstores.com`, `bkyouthballet.com`, `gogreenbk.org`) that were taking an avoidable redirect hop.

Verified: 424/424 tests; local `chromium.launch()` + `page.goto()` succeeds against the new pin and against the three de-`www.`'d URLs with no redirect.

**Watchout for next time:** if a scheduled run ever goes fully expiry-only again with zero fetch errors reported per-source (i.e. everything just silently unreachable rather than individual site 403s), check the cloud environment's network-access preset (Trusted vs Custom) before re-diagnosing the repo.

**Addendum (same day):** the Custom list was built from the *ingest* roster, so it omitted `us.posthog.com` — the Growth Operator's only sensor host (`scripts/posthog-pull.sh`). That routine is created-disabled and would have failed its first enabled run the same silent way. Batu added the host on 2026-07-28. **General rule: the Custom list is per-host, not per-repo — every cloud routine's outbound hosts must be on it, and a new routine is a reason to re-check the list.**

Owner: Batu.

## 2026-07-27 — De-July shipped (launch item L6); the July-named internals stay

Decision (Batu — "run L6"; the scope calls below were made in execution and are recorded here for ratification). L6 asked for three things: an evergreen frame, a month-agnostic cards filename, and an ingest-skill migration note. All three shipped. What's worth recording is the **boundary**, because "de-July" reads like a global find-and-replace and it must not become one.

1. **`july-2026-cards.json` → `cards.json`** (`src/data/demand-test/`). Seven code references updated (`JulyApp.jsx`, `julyCards.test.mjs`, `communityAlert.test.mjs`, and the four scripts: geocode, card-index, expire, prerender-aeo), plus three stale `node -e` path patterns in `.claude/settings.local.json`. The name is deliberately plain — it is the live deck, not an edition.
2. **The evergreen frame was already 90% done.** The header computes its own edition label (`editionLabel()` in `eventWindow.js` → "Jul 27–Aug 2"), the H1 is "Greenpoint Life", the tagline and both OG/Twitter descriptions were already month-agnostic. The *only* hardcoded July in the entire user-facing surface was the `<meta name="description">` tag, which still described the product as being about "the July G-train closures." Now evergreen, keeping the original's distinct "how to support locally owned businesses" angle that the OG copy lacks.
3. **Deliberately NOT renamed — this is the durable half of the decision:**
   - **`july-postvalue-done` (localStorage key, `postValue.js:11`) must never be renamed.** It gates the post-value email prompt to once per browser. Renaming it re-shows the prompt to every existing visitor — a live-user regression dressed up as cleanup. The key is invisible; the cost is not.
   - `JulyApp.jsx`, `july.css` and its ~dozens of `.july-*` classes, `julyCards.test.mjs` — internal identifiers, invisible to users. Renaming them is a large mechanical diff for zero user value, during a feature freeze, in files a parallel session was editing. Not worth the merge risk.
   - `docs/superpowers/plans/*.md` keep their `july-2026-cards.json` references — they are dated records of what was true then, not live spec.
4. **Migration note** added to `ingest-newsletters/SKILL.md` §Files: future runs that meet the old filename (a stale doc, a cached command, an `ingest/*` branch opened pre-rename) update the reference rather than recreating the file.

Verified: 424/424 tests, `npm run build` (93 AEO pages), `npm run ingest:index`, and a dev-server load — 93 cards render, zero console errors, no "july" left in the built `index.html`.

Owner: Batu.

## 2026-07-27 — Growth Operator adopted; launch plan of record

Decision (Batu, via approved plan this date). Sources: two NotebookLM syntheses Batu supplied (AI-era product/growth meta-summary; hyperlocal ops blueprint), applied with judgment — the useful frameworks adopted, the hype rejected.

1. **The weekly growth loop runs as a semi-autonomous Growth Operator** — `.claude/skills/growth-weekly/SKILL.md` + cloud routine `greenpoint-tuesday-growth-readout` (Tue 9:30 ET, Opus, created **disabled**; Batu enables at launch, after this branch merges so the cloud checkout can read the skill). Same pattern as ingest: the PR is the review gate; merging is the only way operator output becomes real.
2. **Autonomy is laddered, not granted** (growth-engine §7, new): V1 suggest / V2 draft-for-review / V3 autonomous, per task. Start: V1/V2 everywhere. Promotion only after 3 consecutive cycles without material edit, reversible, inside kit rules — proposed in a readout, ratified by Batu. Demotion immediate on any breach. **Sends, deploys/merges, taste gates, kill/graduate/PMF verdicts, and spending stay Batu's permanently** — not trust-gated; the definition of supervision.
3. **`docs/launch/2026-07-27-launch-plan.md` is the launch runbook of record:** launch = greenpoint.life cutover (~Aug 1–8); remaining builds = business submission path + de-July; echo-chamber seeding order (org notes + parents wedge before Reddit/QR; Greenpointers held); first experiment slate R1/Q1/Q2 within the max-3 rule.
4. **Growth engine additions (rev 2026-07-27):** organic >50% of acquisition as the word-of-mouth confirming signal on the PMF read; one-egg first-30-seconds rule on activation; echo-chamber targeting on Q1/Q2. **Explicitly rejected from the same sources:** 20X token-maxing, autonomous outbound, self-modifying nightly agents — automation expands down the ladder, never around the gates.

Owner: Batu.

## 2026-07-27 — Civic-issue coverage is in scope for News; roster gains civic sources

Decision (Batu, via coverage-gap review). A review against the neighborhood's three hottest issues (G-train shutdowns, Monitor Point, McGuinness redesign, plus the Meeker Avenue Plume) found the feed covered only the G train — because the ingest roster was 100% newsletters, venues, and parks calendars, with no civic/government sources. The News lens claims to be "the weekly pulse"; a pulse that misses the Council's biggest land-use approval in a generation is a coverage hole, not an editorial choice.

1. **Three verified news cards added** (all claims checked against primary sources; unverifiable figures — e.g. a "4,000 daily cyclists" count — left out per truth rules): `monitor-point-approved` (Council press 6/25: ~1,324 units, 50% affordable, Quay St), `mcguinness-redesign` (nyc.gov 5/2026: construction Meeker→Pulaski, completion early fall), `meeker-plume-monitoring` (EPA site profile: groundwater + indoor-air sampling, 2026 CAG meetings). `gtrain-sales-survey` sharpened with the verified Greenpointers numbers (36 businesses, 91% reporting declines, 20–24% average) and its real permalink.
2. **Roster fix (the durable half):** `ingest-sources.json` gains `greenpoint-star` (weekly civic coverage), `epa-meeker-plume`, and `nyc-dot-mcguinness` (both monthly, institution group) — diffs there update the standing cards' timelines rather than minting duplicates.
3. **Rule restated:** long-arc civic stories live as durable timeline cards (the g-train-closures pattern), one card per issue, updated in place.

Owner: Batu.

## 2026-07-26 — Banner charter: the slot under the header is the neighborhood status line; community-alert tier ships (Film Noir)

Decision (Batu). The banner slot is the product's one guaranteed-impression surface; its value is that it has never wasted attention. It is chartered as a single-slot **neighborhood status line** with a strict priority queue where silence is the default state:

1. **Priority ladder — ONE banner at a time (Batu, same day):** the slot renders only the single most consequential message (`bannerSlot.js`): active/imminent sourced disruption (it changes your day) → **community alert** (see bar below) → distant-disruption FYI chip → re-entry signal ("new since your last visit," future growth-engine R2) → empty. Banners never stack — stacking spends the slot's credibility twice. A community alert's feed pin is independent of the slot: the campaign keeps its "Neighborhood needs you" feed elevation even while a closure weekend holds the banner.
2. **Community-alert eligibility bar** (all required): existential stakes **publicly self-declared by the business** (their words — we never editorialize someone into crisis); sourced per truth rules; time-bound with one concrete action; **one at a time** (a second qualifying case rides the feed, never a second banner); leaves when the campaign ends. Implementation self-hides at a re-verify deadline (`expiresAt`) unless the weekly ingest renews it from a fresh source check, and self-hides if its card leaves the deck.
3. **Banned uses:** sponsorship/ads (pre-PMF this sells the moat), email capture (postValue.js owns that, gated on demonstrated value), anything unsourced or evergreen.
4. **Revision of 2026-07-23 "plain status, not a control":** a banner with a destination card is tappable (real `<button>`, deep-opens the card, `alert_tap` in the locked taxonomy). The G status banner stays a plain status — it has no destination.
5. **First use + freeze exception:** Film Noir Cinema's "Keep Us Alive" fundraiser (card `film-noir-support`, sourced from filmnoircinema.com). Scoped exception to the pre-launch feature freeze: time-sensitive, tiny (one module + one banner + a feed pin), and mission-core — the header's own promise is "how to support local." While a community alert runs, its card leads the feed in a "Neighborhood needs you" group. Strategically this is the supply-loop proof-of-concept: visible community support the business can feel.

Modules: `communityAlert.js`, `groupByDay(..., pinnedId)`, `EVENTS.ALERT_TAP`. Plan: `docs/superpowers/plans/2026-07-26-community-alert-banner.md`.

Owner: Batu.

## 2026-07-26 — Jul 15 reframed as a friends round; checkpoint gate voided; Phase 3 becomes the launch track

Decision (Batu). The Jul 15 "limited launch" never functioned as a launch: it reached a handful of friends (mostly parents), some never opened it, and its real output was the qualitative feedback that drove the 2026-07-25 IA re-cut. Consequences:

1. **The Jul 29 checkpoint gate is voided — because the exposure never happened, not because results disappointed.** Pre-registration discipline is preserved for the real launch: the readout doc is relabeled a *friends-round readout* and keeps its data as the qualitative record. Live confirmations while voiding: criterion 2 had 1 in-window signup (the other predates Jul 15); criterion 4's channel attribution is unrecoverable (all real traffic `$direct`, no referrers, invite links untagged); the forms produced zero business asks and zero feedback text.
2. **Phase 3 is ungated and becomes the launch track.** Jul 29 becomes a launch-readiness review. Per-ship gates are unchanged (PR merge = review + deploy; nothing user-visible ships unapproved). The quantitative bar moves to post-launch, where it measures a real population; the growth-engine PMF bar (~Sep 15) is untouched.
3. **Lens re-cut (segment logic: visitors come for food & drink, parents for family events, civic residents for community & news; leading with Live Music misread the product as a gig tracker):** order is now *things to do first, informational after* — Food & Drink · Family & Kids · Arts & Culture · Wellness · Live Music · Community · News · Deals & Memberships. `shopping` lens folded into `deals_memberships` and deleted (the `shopping` *category* for pin labels is a different axis and stays).
4. **Live-music rule:** the lens holds dated gigs and documented ongoing programming (Le Fanfare, Lot Radio, Flower Cat), never bare place cards. Four undated venue cards (Troost, Good Room, Eavesdrop, Hide & Seek) deleted as duplication of their own dated gigs (109 → 105 cards). Data fix: 9 gig cards shipped with `endsAt` but no `startsAt`, stacking a week of gigs onto every day's Today lens; all dated, and a regression test now fails on open-start live-music cards. Ingest skill updated with both rules.
5. **Launch-readiness list (the work between now and launch):** attribution kit (canonical tagged links, `?src=qr`); de-July (by Aug 1); OG tags + `/e/<slug>` deep links; business submission path; AEO surface; error monitoring (hard gate); domain cutover as the launch moment. *(Same day, Batu: ops-plan 3.2 save/star + day picker is **cut** — no new features before launch; share + add-to-calendar actions already prove engagement. The Laura/Edmond asks stay recorded as post-launch candidates.)*

Owner: Batu.

## 2026-07-26 — Growth engine adopted as strategy of record; R0 shipped

Decision (Batu). `docs/growth/growth-engine.md` (2026-07-25, grounded in Elena Verna's frameworks) is the growth strategy of record:

1. **Three loops, not funnels** — weekly content loop (compounding metric: weekly returning locals), supply/claim loop (proactive supply actors/month), answer-engine loop (organic sessions). Build effort goes to a loop's weakest edge; the Phase 3 backlog maps onto exactly those edges (3.1 share → content, 3.3 submissions → supply, 3.6 AEO → answer-engine), which is the argument for shipping it as scoped.
2. **Retention-first sequencing** — retained = returns in ≥2 of any 4 consecutive weeks. R0 (`return_visit` sensor) pulled forward from ops-plan Phase 4 and shipped to production 2026-07-26 so the baseline starts before the Jul 29 checkpoint.
3. **Paid acquisition ruled out permanently** on channel–model fit ($0 revenue/user); owned + earned channels only, community orgs + parents/camps wedge first.
4. **Monetization gate restated** — nothing monetizes before the ~Sep 15 PMF verdict; claim-model sequencing unchanged (sponsored maps first, never charge small businesses first). *(Superseded 2026-07-28: the claim model is retired and the sequencing replaced by the three-layer architecture in `docs/growth/business-model.md`; the gate itself survives, reinterpreted as sell-before/ship-after.)*
5. **Experiment rules** — kill criteria written before launch, pre/post + small-n qualitative only, max 3 live at once, micro-optimizations excluded.

Owner: Batu.

## 2026-07-26 — Ingest runs moved to cloud routines; review gate becomes the PR merge

Decision (Batu). The three scheduled ingest runs (Mon full 9:02, Tue–Sat daily thin 9:07, Wed Greenpointers pull 13:08, all ET) moved from local scheduled tasks — which only fire with the laptop open and Claude running — to claude.ai cloud routines (`greenpoint-monday-full-ingest`, `greenpoint-daily-thin-refresh`, `greenpoint-greenpointers-wednesday-pull`; Opus orchestrator, manage at claude.ai/code/routines). Local tasks are disabled, not deleted (fallback if cloud misbehaves).

Mechanics that changed:
1. **Review gate = PR.** Cloud runs never touch main. They commit draft cards + promoted baselines to an `ingest/<type>-<date>` branch and open a PR whose body is the review diff; **merging the PR is the ship + production deploy**. Closing it discards the run (baselines never land, next run re-diffs). Truth rules unchanged.
2. **Diff baselines now tracked in git** (`.ingest-cache/*.ingested.txt`, ~600KB text) so a fresh cloud checkout diffs against the last-ingested state instead of seeing all ~44 sources as new; `fetch-sources.mjs` derives `ingestedHash` from the baseline when `state.json` is absent. Baselines ride in the same PR as the cards, so promotion stays review-gated. Snapshots/diffs/state remain gitignored.
3. **Gmail pass** runs in cloud when the Gmail connector authenticates headlessly; otherwise the PR flags it as pending for an interactive session.
4. Cloud cron is fixed UTC — run times drift 1h earlier ET when DST ends (November); shift the crons then.

Owner: Batu.

## 2026-07-25 — Ingest cost architecture: scripts fetch, subagents extract, orchestrator judges

Decision (Batu). The agent-driven ingest was measured at ~$41/full run (~$60/wk with the Wednesday pull and Thursday scan) — 68% of it cache-read on a single growing context that held every scraped page plus the full cards JSON, re-billed on each of ~290 tool calls. Not viable, and it priced out daily freshness. Restructured so model attention is spent only on judgment:

1. **Deterministic work moved to scripts** — `scripts/fetch-sources.mjs` (snapshot + hash-diff the ~44-source web roster, now machine-readable in `src/data/demand-test/ingest-sources.json`; plain fetch with headless-Chromium fallback via Playwright — covers the 403 sites), `scripts/expire-cards.mjs` (expiry hygiene, already pre-approved as auto-delete; logic + tests in `src/demand-test/ingestExpiry.js`), `scripts/card-index.mjs` (one-line-per-card dedupe index so the 137KB cards JSON never enters context).
2. **Extraction fan-out** — only *changed* sources are parsed, each by a Sonnet subagent reading the snapshot file itself and returning compact JSON facts; page text never enters the orchestrator context.
3. **Orchestrator stays Opus** (never Fable for scheduled runs — measured 40% more expensive for identical output) and keeps all judgment: gates, dedupe, card authoring, the review diff. **The review gate and truth rules are unchanged.**
4. **Cadence**: daily thin runs become affordable (no-change days cost cents); the Thursday coverage scan retires once the daily loop is live — the fetch-diff does its gap-catching continuously.

Projected: ~$8–15/wk for daily freshness vs ~$60/wk for weekly. Skill rewritten accordingly (`.claude/skills/ingest-newsletters/SKILL.md`, "Cost architecture" section).

Owner: Batu.

## 2026-07-25 — Filter IA re-cut: lenses are a person's question, not a content taxonomy

Decision (Batu, N1 groundwork — IA before UI). The filter bar re-cut from 11 content-type layers to 9 intent lenses: **New · Food & Drink · Shopping · Arts & Culture · Family & Kids · Live Music · Wellness · Deals & Memberships · News.**

**Rationale, per retired/changed layer:**
1. **`events` retired** — 58 of 88 cards; a lens keeping two-thirds of everything doesn't narrow, and nobody's intent is "any event whatsoever." The day-grouped All feed already answers "what's happening this week."
2. **`services` retired** — 2 cards; services are destination searches, not a browse lens (nobody browses "Services", they look for *a groomer*). Service openings still surface via `new`. Keeping it would drift toward the directory this product explicitly isn't.
3. **`deals` + `clubs_signups` merged into `deals_memberships`** — 2+3 cards, both permanently under the F16 fold threshold; one honest lens instead of two thin ones.
4. **`wellness` added** — the movement cluster (yoga/pilates/dance/run, 6 cards) was the biggest coherent group the events umbrella hid. Trash Club stays out (Batu: it's civic action, not fitness).
5. **No Civic lens** — 5 civic/campaign cards keep riding inside News; splitting them recreates the thin-layer problem. Revisit if closure-period volume spikes.
6. **Free stays a badge, not a lens** (Batu; testers had asked for free-only filtering — the FREE badge carries it for now).
7. **Empty `filters: []` is now legal** — a one-off with no honest lens lives under All only; forced-fit membership is a truth miss. A guard test pins the known six; a growing list means the taxonomy is leaking and the ingest review must flag the cluster as a candidate lens.

Retired ids (`events`, `services`, `deals`, `clubs_signups`, plus `g_train`) are guarded by test — future ingests must not resurrect them. Ingest skill authoring rules updated. The N1 chip-bar UI (how the vocabulary is shown on mobile) remains a separate open call.

Owner: Batu.

## 2026-07-25 (2nd pass) — Community lens added; all lens-less stragglers resolved

Decision (Batu). Same-day follow-up to the filter IA re-cut: the six cards left with empty `filters` sorted into two real homes instead of staying All-only.

**`community` added (10th lens)** — civic/mutual-aid stewardship: park cleanups, harbor day, dog adoption, a trash-cleanup club, an accessibility-advocacy launch. Explicit future home for things like stoop sales. Distinct from civic *news* (closures, zoning, campaign reporting stays in `news`) — `community` is for hands-on participation.

**Membership:** City of Water Day, It's My Park, Adoption day at Pooch's Parlor, Disabled & Hungry launch party, and **Greenpoint Trash Club** (moved out of `deals_memberships` — a cleanup collective is civic action, not a paid membership; a signup card is one thing at a glance, not two).

**Astrology + cannabis-science talk → `arts_culture`** (culture/ideas programming, same shelf as gallery talks and workshops) — the two cards with no civic angle.

Result: zero lens-less cards remain; the taxonomy is now `new · food_drink · shopping · arts_culture · family_kids · live_music · wellness · community · deals_memberships · news` (10 lenses total, from the original 11 content-type layers). Ingest skill authoring rules updated with the `community` vs `wellness` vs `news` distinction.

Owner: Batu.

## 2026-07-25 (3rd pass) — `new` folded into `news`

Decision (Batu). Third same-day follow-up to the filter IA re-cut: the `new` lens retired and its 8 cards folded into `news`.

**Reasoning:**
1. **Label collision** — "New" vs "News" are one letter apart on the chip bar, distinguished only by a small unfilled-circle glyph; a real misread risk on mobile.
2. **Staleness, confirmed by data** — every `new` card dated to the 2026-07-02 launch batch. Zero additions across five later ingest refreshes (`07-08` through `07-22`). Not a rotating "opened this week" lens — a frozen one.
3. **Precedent already existed** — `swaines-fall-opening` was filed `category: news` from the start (a future opening announced as news). Keeping a parallel `new` tag for openings that already happened duplicated the same real-world event type into two competing, inconsistently-maintained homes.

**Counterpoint weighed and accepted as a future option, not a blocker:** New (discovery: "somewhere to try") and News (informational: "what changed") are genuinely different intents. If opening volume ever grows enough to justify a dedicated lens again, split it back out — not worth a chip at today's frequency (8 cards, unmaintained).

**Mechanics:** only `card.filters` changed (`new` → `news`) on the 8 affected cards; `category` (`new_business`/`service`/`shopping`/`food_drink`/`arts_culture`) is untouched, so pin colors on the map are unaffected — verified live. `CHIP_KIND` in `CardPanel.jsx` cleaned of dead retired-id entries (`new`, `events`, `clubs_signups`, `deals`) in the same pass. Retired id `new` is guard-tested.

Owner: Batu.

## 2026-07-25 (4th pass) — Civic-action cards move to Community; News sorts reporting before openings

Decision (Batu). Fourth same-day follow-up.

**Civic-action cards → `community`.** Newtown Creek Superfund CAG meeting, Adopt a business for shutdown weekends, "Weigh in on how the G closures are run" (MTA advocacy), and Keep Film Noir Cinema alive moved from `news` to `community` — each asks the reader to DO something (attend, adopt, complain, support), matching `community`'s hands-on-participation definition better than `news`'s reporting one. The G-train status hub (`g-train-closures`, dates/shuttle/who's-open reference card) stays in `news` — it's a timeline object, not itself an ask.

**Within News, reporting now sorts before openings.** The 8 folded-in business-opening cards (from the third-pass New→News fold) were reading above real news items — a pure array-order accident, since both are undated and the shared "Ongoing" bucket otherwise keeps insertion order. `groupByDay` (`filterCards.js`) now applies a stable partition inside Ongoing: cards with `category` `news`/`g_train_support` sort first, everything else keeps its relative order after. Self-maintaining for future ingests (no manual JSON reordering); a no-op for every other lens, since none of them mix news-category cards with other categories.

**Card title truncation.** Long titles ("Franca Ceramics Pop-up Seconds Sale") were wrapping to a second line and pushing the FREE badge down with them. `.july-card-title` now truncates to one line with ellipsis; the FREE badge stays pinned on the title's line.

Owner: Batu.

## 2026-07-25 (5th pass) — Fixed duplicate signup CTA at feed end

Decision (Batu, phone test screenshot). The post-value signup prompt ("Finding this useful? Get next week's edition in your inbox" — primary CTA + "Not now") and the persistent footer CTA ("Get next week's map by email") were both always adjacent in the DOM: the footer rendered unconditionally, so any time the post-value prompt showed, it was immediately followed by a second, near-identical ask.

**Fix:** the footer (`july-ctas` in `CardPanel.jsx`) now renders only when the post-value prompt is NOT showing. The prompt is the better-hooked ask ("Finding this useful?") and takes priority; the plain footer remains the fallback CTA for readers who scroll past everything without ever tripping the post-value gate (2nd card open or 1st action tap). Distinct analytics placements (`postvalue` vs `footer`) are preserved — this only changes which one is visible at a time, not the tracking.

Owner: Batu.

## 2026-07-25 (6th pass) — Chip order is merchandising: promise first, wedge promoted, browse last

Decision (Batu). The filter bar's display order had never been decided — it was the July 2 spec's authoring order, and three retirements later Food & Drink (12 of 13 cards undated — effectively a venue directory) had inherited the slot right after "All" by accident of deletion order.

**Framing:** at 375px only ~3 chips are visible after "All" before the scroll cut, so the real decision is "which three lenses define this product," not "rank nine." The visible chips are a positioning statement and must restate the promise ("what's happening near you this week", alive).

**Order shipped:** `live_music · family_kids · arts_culture · wellness · community · news · food_drink · shopping · deals_memberships`.

**Determinants, in priority (the reusable rule for future lens additions):**
1. **The promise** — visible chips restate "the week, alive"; a static directory lens in slot 1 would introduce the product as Yelp.
2. **Observed intent, position-corrected** — `filter_tap` + post-filter engagement (card opens, action taps after filtering) in PostHog, once sample size allows. Too young and position-confounded to use today.
3. **Strategic wedge boost** — Family & Kids holds slot 2 *above its raw volume* (27 live-music vs 12 family cards) because parents are the stated growth wedge; merchandising is how a bet becomes visible.
4. **First tap must reward** — slots 1–2 get the most first taps; a first tap onto a stale shelf teaches "this app is dead," a product-wide trust cost. (Food & Drink fails this at 1 dated event in 13 cards.)
5. **Stability beats optimality** — static order, muscle memory; never dynamically re-sort by live counts.

**Review mechanism (standing):** at the Jul 29 checkpoint (or ~2 weeks of PostHog data, whichever is later), pull per-lens `filter_tap` and post-filter engagement, corrected for chip position. Any visible chip that a tail chip outperforms swaps. Reorders happen ONLY at declared checkpoints — this converts chip order from a recurring taste debate into a mechanism.

Note: card counts / dated-vs-undated ratios are proxies for #4 only, not ranking criteria in themselves.

Owner: Batu.

## 2026-07-22 — Coverage-scan cadence: one weekly Thursday scan (Sunday scan paused)

Decision (Batu). The twice-weekly coverage-scan cadence (2026-07-21) drops to **one weekly scan: Thursday 9am, deliberately after the Wednesday Greenpointers pull** — measuring the residual gap after both newsletters and the roundup have landed. The Thursday scan absorbs both jobs: weekend-urgent gaps flagged first (off-cycle mini-ingest at Batu's call), and the full-week diff becomes the pre-loaded input for Monday's ingest.

**Tradeoff accepted:** early-week (Mon–Wed) events announced Fri–Sun may sit uncovered until Thursday — the low-density, low-stakes window. **Earn-back criterion:** the Sunday scan (paused in the scheduler, not deleted) re-enables if Thursday reports repeatedly flag gaps a Sunday run would have caught; the scan's "learned" section tracks this explicitly. Context: zero scans had run when decided, so the twice-weekly cadence was untested theory. Coverage bar itself (100% of on-concept events + openings) is unchanged; measurement is now weekly.

Owner: Batu.

## 2026-07-22 — 3D isometric explorer parked indefinitely; Greenpoint Life (2D map + feed) is the product

Decision (Batu). The isometric 3D explorable Greenpoint — the repo's original goal — is **parked indefinitely**. The direction remains exciting and may be picked up later, but the sole goal going forward is **real value and PMF**, pursued through the 2D map + feed MVP (Track V, consumer name Greenpoint Life). This converts the 2026-07-02 "Track R paused behind Track V" ordering into an open-ended park: resuming 3D is a separate, explicit future decision, not an automatic unlock at any milestone.

**Locked / executed same day:**
1. **Entry swap:** the 2D app now serves at the root — `index.html` → `src/demand-test/main.jsx`. The parked 3D prototype moved to `explorer.html` (kept runnable). `july.html` deleted; `vercel.json` redirects `/july.html` → `/` (query params preserved, so live `?src=` invite links keep working).
2. **Code parks in place:** 3D runtime (`src/`), scene data, textures (`assets/`), and `verify:*` scripts stay on `main` untouched; `npm run build` still builds both entries.
3. **Docs reorganized:** 3D-only living docs (ART_DIRECTION, COMPONENT_INVENTORY, CURATION_TIERS, SCALING_LOG, reference/, mvp-reference-images/, visual-artifacts/) moved to `docs/parked/3d-explorer/`. `CLAUDE.md`, `AGENTS.md`, and `docs/PLAN.md` rewritten around the 2D product. Root `README.md` added.
4. **II-C carries over:** the II-C palette (in the parked ART_DIRECTION.md) remains the visual source of truth for the 2D map (`iiMapStyle.js`) and all product surfaces.
5. **GitHub identity:** repo keeps the `greenpoint-explorer` name; description updated to lead with Greenpoint Life.
6. Truth rules, launch gates, and the PMF ops plan (`docs/launch/2026-07-21-pmf-ops-plan.md`) are unchanged and remain the operating regime.

Owner: Batu.

## 2026-07-21 — Answer-engine primacy: Greenpoint Life must be the source humans AND AIs cite

Decision (Batu). Once launched, whenever a person **or an AI** asks for relevant events/stories in Greenpoint, the answering source must be **Greenpoint Life** — not Greenpointers, Brooklyn Eagle, or others. This makes machine-readability a product requirement, not an SEO afterthought.

**Grounding:** the current SPA (`july.html`, client-rendered cards JSON) is invisible to the crawlers that feed AI answers (GPTBot/ClaudeBot/PerplexityBot don't execute JS), while Greenpointers wins by default on crawlable HTML + domain authority. The counter-wedge is structure: Greenpoint Life's cards are already schema-valid, verified, and weekly-fresh — no competitor has structured event data.

**Locked:**
1. Phase 3.1 deep links ship as real paths (`/e/<slug>`), not `?card=` params.
2. New ops-plan item **3.6 Answer-engine surface**: build-time prerendered per-event HTML with schema.org/Event JSON-LD, sitemap, RSS + ICS feed, `llms.txt`. Acceptance: no-JS `curl` returns event content; JSON-LD validates.
3. Sequencing unchanged — all of it stays gated behind the Jul 29 checkpoint; rides existing 3.1/3.4 work.
4. Truth rules (verified, sourced) are the citation-trust moat and stay non-negotiable.

Owner: Batu (verdict) / Agent (build at Phase 3). Ops plan: `docs/launch/2026-07-21-pmf-ops-plan.md` §3.6.

## 2026-07-21 — PMF ops regime: checkpoint-gated public launch at greenpoint.life; Claude runs PM/Design/PMM/Analyst loop

Decision (Batu, operating-model interview). The product's consumer name is **Greenpoint Life** (already on `july.html`); the bought-but-unwired **greenpoint.life** domain becomes canonical *only if* the Jul 29 checkpoint passes. Repo/3D prototype keep the Explorer name.

**Locked:**
1. **Sequence:** run the ~Jul 29 checkpoint rigorously against the 2026-07-15 kit bar; widen to public channels + domain cutover only on pass. Fail → no public push; ~5 qualitative interviews and a wedge reframe instead.
2. **PMF bar is two-sided pull** (not the threshold ladder alone): residents return weekly unprompted AND businesses/orgs proactively submit/ask in. Draft numbers (confirm at checkpoint): ≥30 locals at ≥2 visits/week for 3 consecutive weeks by ~Sep 15; ≥5 supply-side actors, ≥1 recurring.
3. **Operating model:** Claude acts as PM/Designer/PMM/Analyst on a weekly cycle (Mon ingest + analytics → Tue readout + proposals → gated ships). Nothing user-visible deploys unapproved; Batu sends every message. Model policy *(refined same day, Batu)*: capability first — complex/ambiguous work runs on Fable (main thread) or Fable/Opus subagents; Sonnet only when a spec + tests fully constrain the task; Haiku for mechanical, test-checkable work; unsure → escalate a tier.
4. **Data access:** self-serve readouts via Vercel MCP (Batu to authorize) + Tally exports; fallback Monday dashboard screenshots. *(Same-day amendment: the Vercel MCP exposes no analytics tools; the real path is the Web Analytics REST API / CLI `metrics` + Tally exports. Audit also found Web Analytics was never enabled on the project — nothing collected Jul 15–21; fix + events-transport decision in ops plan 1.1–1.2.)*
5. **Public launch cut (gates the push):** OG + per-card deep links · save/star + day filter (the validated Laura/Edmond asks) · business submission path. De-July reframe does **not** gate but must ship by Aug 1.
6. **Channels prepared:** Reddit + local groups, physical II-C QR window card. Greenpointers pitch + further SSG amplification deliberately held for later.

Owner: Batu (verdicts, sends) / Agent (build, drafts, readouts). Ops plan: `docs/launch/2026-07-21-pmf-ops-plan.md`; interview plan of record: `~/.claude/plans/you-will-act-as-rippling-seal.md`.

## 2026-07-15 — Track V limited launch: go, free MVP, newsletter ingest, no login

Decision (Batu, launch-scope interview on the original go/no-go date). Track V proceeds to a **limited launch** to validate value & adoption of a free version.

**Locked:**
1. **Scope:** the evolved 2D page only (`/july.html`); 3D container stays out.
2. **Audience:** warm network (~20–50) as wave 1, community orgs (Shop Small Greenpoint / Perri) as wave-2 distributors. Invite links carry `?src=` channel tags; all analytics events segment by channel.
3. **Success signals (2-week checkpoint, ~Jul 29):** content-type pull ranking (events vs memberships vs deals vs news), subscribe/commit actions, qualitative feedback. Retention deliberately not the primary bar at this scale. Bar + measurement runbook: `docs/launch/2026-07-15-limited-launch-kit.md`.
4. **Content types under test:** `discount` (deals — requires `endsAt`; `recurring` marks a verified-through date, not a stated deadline; expired deals vanish at render time) and `news` (requires publisher attribution) join events/memberships. Stories and routes deferred.
5. **Ingestion — Architecture A:** a Claude-run weekly ritual (`.claude/skills/ingest-newsletters/SKILL.md`): Gmail newsletters + Greenpointers roundup → schema-valid draft cards → **Batu-approved review diff** (nothing ships unreviewed) → geocode → tests → commit → deploy. Ledger: `src/data/demand-test/ingest-ledger.json`. No standalone backend for v1; sources are business newsletters + org newsletters + Greenpointers as one-of-many. Prerequisites on Batu: reconnect Gmail connector with read scope; subscribe to the starter newsletter list (in the launch kit).
6. **No accounts/login.** A login wall at this scale measures friction tolerance, not commitment, and no shipping feature needs identity. Instead: a **post-value email prompt** (once per browser, after 2nd card open or 1st action tap → existing Tally form; `cta_tap` `placement=postvalue`) gives both stated jobs — commitment measurement and an owned re-engagement list. Revisit accounts when star/save ships.
7. **Feedback channel:** persistent "Something missing or wrong?" at the end of every feed + quiet footer link (`feedback_tap`); mailto for now, Tally feedback form URL drops into `FEEDBACK_FORM_URL` when created.

Owner: Batu (approvals, sending every invite) / Agent (build, ingest, drafts). Plan of record: `~/.claude/plans/i-want-to-launch-foamy-dongarra.md`; ops kit: `docs/launch/2026-07-15-limited-launch-kit.md`.

## 2026-07-03 — Track V measurement: Vercel custom events + Tally forms

Instrumentation for the demand test go/no-go: six named tap events
(pin_tap / card_open / filter_tap / today_toggle / action_tap / cta_tap)
through a transport seam (`trackEvents.js`) bound to @vercel/analytics —
vendor-swappable if plan gating blocks custom events. CTAs moved to Tally
hosted forms so signup/submission counts are dashboard-countable (form
URLs pending, decision made; CTAs still mailto, tracked). Place-graph fields
(trustRisk required, relatedCardIds/timeline optional) landed in
cardSchema.js; sparse seed links the two G-train action cards.

## 2026-07-03 - Greenpointers positioned; place-graph moat; dossiers named as v2

Decision (Batu-approved review of the ChatGPT "Differentiation vs Greenpointers" context update). The doc is ~70% convergent with the 2026-07-02 Track V pivot; five adoptions and four rejections were made explicit so the build thread doesn't resurrect superseded ideas.

**Adopted:**
1. **Greenpointers is the named third actor** — stronger incumbent in the "what's happening" lane; treat as source / distribution partner / editorial authority / potential **map-embed customer**, never compete as a news product. Differentiation is structural: they answer *"what happened?"*, we answer *"where, how it connects to my block, what changed over time, what can I do."* A generic news map is rejected (too comparable, too copyable).
2. **Moat = structure behind the pins** — place graph, source-backed timelines, action workflows, measurable impact; pins alone are indefensible. Schema consequence: `relatedCardIds?`, `timeline[]?`, `trustRisk` restored to the Track V card shape (populated sparsely in v1; kept neighborhood-agnostic, not brand-locked to Greenpoint).
3. **v2 has a named shape: living place dossiers** ("encapsulate and go deeper" — Greenpointers articles become linked spatial objects with timeline/status/claims/meetings/related places/actions; journalism-respecting).
4. **Business-model sequencing (post-validation, not built now):** never charge individual small businesses first — sponsored campaign maps → partner tooling for SSG/Greenpointers → featured action cards paid only after evidence of clicks/signups/turnout. *(Superseded 2026-07-28 by `docs/growth/business-model.md`; the "don't start with small businesses" instinct survives as Layer 1 → Layer 2 sequencing.)*
5. **Validation sharpened:** Perri/business/resident interview scripts adopted; bar is **action, not interest** — pause if the spatial layer doesn't change behavior.

**Rejected (superseded by the 2026-07-02 interview):** "SSG companion" branding/partner CTA (Q1: SSG is a source layer, we're independent) · Jobs filter in v1 (parked pending demand) · civic cards (Monitor Point/McGuinness) in v1 (Q2: discovery-forward; dossiers are v2) · any schema merge drops the hidden-engagement additions (`subscription`/`join`/Today lens are kept).

Owner: Batu (taste/approvals) / Agent (execution). Source: `docs/context/2026-07-03-greenpointers-differentiation.md`; spec updated in place.

## 2026-07-02 - Pivot: validate spatial demand (Track V) before more container craft

Decision (Batu, alignment interview). Two strategy inputs — the *Greenpoint Unmet Needs & Opportunity Context* and the inaugural *Shop Small Greenpoint* (SSG) July 2026 newsletter — reframe near-term priority. The Unmet Needs doc's mandate is to **prove demand cheaply before polishing the map** (*"a beautiful neighborhood map is not necessarily a useful product"*). The SSG newsletter shows a real, operating volunteer initiative already owning the newsletter/directory/events/profiles/G-train-advocacy space. Conclusion: don't build another newsletter or directory; the differentiated wedge is the **spatial + visual + action layer**, and it must be **demand-tested off the 3D runtime first**.

**Locked (from the interview):**
1. **New Track V — Spatial Demand Test jumps ahead of Track R.** A standalone, independently deployable **2D real-map** page in the II-C inked identity ("July in Greenpoint + G-Train Support"), ~15 static seed cards, own shareable URL, zero Three.js. **Track R (`feat/r2-recognizable-storefronts`) pauses** — backed up to origin (`1f1c210`), resumes only if Track V validates. Work proceeds on `feat/spatial-demand-test` off `main`.
2. **SSG is a content/information source we amplify spatially — not a partner-dependency or a brand we sit under** (win-win, independent). (Interview Q1.)
3. **v1 leads discovery-forward** (new openings + events + support-local, G-train woven through), riding the live July window; change/civic layers are v2. (Q2.)
4. **Substrate = real 2D map in the II-C inked identity** (MapLibre GL lead, Leaflet fallback) — spatial *and* recognizably ours; not a generic list, not the 3D runtime. (Q3.)
5. **Card schema = throwaway JSON now, shaped to graduate later**; reconciliation with `PlaceStory`/`Landmark` is a deferred follow-up, not v1 work. (Q4.)
6. **SSG (Perri / WonderMart) is a named tester** alongside residents/businesses/visitors — tests the win-win directly. Go/no-go = Doc 1's thresholds (≥5 check-weekly, ≥3 subscribe, ≥2 businesses want in, ≥1 unprompted share) **+ does SSG want it.** (Q6.)
7. **Timeline = hook, not hard gate.** MTA G closures hit Greenpoint (Court Sq↔Bedford-Nostrand incl. Greenpoint Av + Nassau Av) **Jul 10–13 weekend + Jul 13–17 overnights**, recurring after. Build with urgency; aim the polished, Perri-ready cut at an early recurring window; refresh seed from the ~Aug 5 SSG issue. (Q5-timeline.)

**Relationship to prior decisions:** supersedes the *near-term ordering* of the 2026-06-23 "spine alive before expanding" decision (Track R/P). Those tracks are not cancelled — they resume behind a validated Track V. The Product Goal and platform thesis in `PLAN.md` are unchanged; this is a sequencing/validation decision.

**Addendum (Batu, same day) — hidden business engagement.** Businesses run events and subscriptions invisible unless you already follow their Instagram/email (exemplars: Dandelion Wine's same-day tasting emails, 153 Franklin St; Falu House's Tinned Fish Club membership, 34 Norman Ave). Track V v1 explicitly amplifies these: an events **Today lens** (date/time on event cards) and a **subscription/signup card type** (`subscription` category, `join` action, one-tap signup). v1 stays hand-curated seed; automated ingestion / business submission pipeline is a post-validation follow-up. This is the concrete shape of "business support flows" and feeds the business-side validation question directly.

Owner: Batu (taste/approvals) / Agent (execution). Source: `docs/superpowers/specs/2026-07-02-spatial-demand-test-design.md`. **Status: design approved, build not started — begins in a fresh thread.**

## 2026-06-23 - Reprioritization: make the spine alive before expanding (interleave perf + recognizability)

Decision (Batu, end-of-cycle review). After the inked-facade craft cycle, the container (Track A) is ~85% built and polished while the product (Track B — stories/events/routes/history/instrumentation) is ~5% built: one `PlaceStory` schema, one unverified seed story, zero stories attached to built landmarks, no events/routes/instrumentation. The map is recognizably-shaped but mute and slow to load. The remaining work is re-sequenced to make the *existing* Franklin spine recognizable and fast — not wider.

**Locked:**
1. **Interleave two parallel tracks now:** Track P (performance/load architecture — instancing/merge, texture pre-bake/cache, async build, TTFP/TTI budget) and Track R (recognizability — Astral bespoke anchor, signature-layer storefronts, corner treatment, then Eberhard Faber / Brouwerij Lane / Oak St). Chosen over perf-first or recognizability-first so the architectural track and the visible-value track advance together.
2. **Recognizable storefronts are the first content lever**, ahead of attaching story/event content — a recognizable map can already be resident-tested for recognition; stories/events/instrumentation (H1/H3) follow on a map that reads as real.
3. **Deferred:** 8.1c street-network paving, further block/neighborhood expansion, Phase-9 scale, roof/pavement detail, business-claim monetization, second neighborhood — all coverage/polish, gated behind a proven-alive loop.

**Why now:** Batu's review notes converge — (#1) spine alive before expanding, (#2) load/render performance creeping in, (#3) recognizability needs real-looking storefronts + corners + anchors, (#4) add Astral / Oak St haunted house / Brouwerij Lane / Eberhard Faber (already curated heroes #7–9 + the Oak landmark, but rendering typological today). Performance is treated as the enabler that gates demoing the rest.

Owner: Batu (taste/approvals) / Agent (execution). Source: `docs/PLAN.md` "Reprioritization — 2026-06-23".

## 2026-06-22 - Phase 8.1c: ground extent driven by the real street network, not a radius

Decision (Batu-approved in session). The ground/paving layer's fixed 130m context-radius circle is replaced by a **per-street real-centerline extent model**: each street is paved along its real LION centerline for its full loaded extent, no circle and no fixed run-length. Chosen over a building-bounding-box or an enlarged-circle alternative because a neighborhood is a street network, not a shape — a box/circle would pave over Newtown Creek, Bushwick Inlet, and the parks, and would need re-tuning as the footprint grows. This makes scaling a data pull, not a geometry-logic change (the H5 repeatability story).

**Why now:** side streets + parts of Franklin render unpaved where buildings already stand. Block extracts bypass the building cull (`sceneFrame.js:132`, no distance check), so the 8.1b Franklin-north block placed 160 buildings out to ~620m — far past the 130m asphalt circle that the ground layer borrowed from the cull. The shared-radius coupling (documented at `SceneView.jsx:227`) predated the real street network and the block-extract expansion.

**Scope decisions locked:** (a) close the long-standing R10E "Franklin has no centerline" gap opportunistically if the corridor LION pull returns Franklin's centerline; (b) **ground-only decouple** this pass — the building cull in `sceneFrame.js` is left untouched (whether its radius should also grow is a separate later call); (c) missing corridor streets (Huron/Freeman/India + Franklin) sourced via a **real LION pull**, not grid-derivation, per the source-backed rule; (d) scope is the currently-loaded three blocks, not neighborhood-wide — the model *enables* scale but this task only paves what's loaded.

Owner: Batu (taste/approvals) / Agent (execution). Source: `docs/superpowers/specs/2026-06-22-street-network-ground-extent-design.md`.

## 2026-06-21 - Phase 8.0 Structural Depth Pass: geometry approved, look gated on two craft follow-ups

Decision (Batu, live pilot review at the Task 6 gate). The Phase 8.0 depth geometry — 3D stoops and front fire escapes, parametric and family/storey-gated — is **built, gated, tested, and verified** on the 4-BIN pilot (commits `905315f..f9ba537`; pure modules `facadeDepthGates.js` / `stoopGeometry.js` / `fireEscapeGeometry.js` + renderer wiring in `decorateInkedWall`; 136 tests + full `npm run verify` green). In-engine confirmed: brownstone (168 Franklin) stoop + fire escape; brick (148 Franklin) stoop, no escape; modern (94 Greenpoint Ave) bare; clapboard (95 Kent) clean stoop path.

**The geometry is approved; the LOOK is gated on two craft follow-ups before fan-out (8.1):**

1. **Regenerate brick + brownstone ground textures (do `task_f39b0155`).** The 3D stoop suppresses the legacy *flat door-stoop PNG* but not the painted *ground band*; families with a ground asset (brick, brownstone) render both, and the brownstone-ground texture already depicts painted stairs → double-stairs. Batu chose to **regenerate the ground textures without painted stairs/door** (over the cheaper "suppress the ground band" or "clapboard-only" options) so the painted ground-floor wall and the 3D stoop coexist cleanly. Until done, brick/brownstone stoops are a known-wrong interim state on the branch; geometry left as-is per Batu (not suppressed).

2. **Open up the fire-escape ironwork before locking a variant.** Both `relief` and `lattice` render rails/balconies as opaque quads that merge into solid dark bands (reads as shelves, not see-through ironwork). Batu chose **"neither yet — open up the ironwork first"** (alpha-textured open railings) rather than locking relief vs lattice now. The `3064541` lattice override stays as a placeholder; the relief/lattice default decision is deferred until the ironwork reads as iron.

**Not merged to main; not fanned out.** 8.1 spine fan-out stays blocked until both craft items land and the look re-gates. Basement/areaway (Phase 8.5) remains its own ref-gated mini-design pending Batu's photos.

Owner: Batu (taste/approvals) / Agent (execution). Source: `docs/superpowers/specs/2026-06-21-structural-depth-pass-design.md`, `docs/superpowers/plans/2026-06-21-structural-depth-pass.md`.

## 2026-06-20 - Asset Kit Process: Recognizable-Silhouette Model + Two-Gate Taste Review + Real-Meter Isolation Proof

Decision (Batu-approved in session, closing the clapboard vertical-slice pilot):

**Recognizable-silhouette model:** the inked component kit uses a typological base layer (tintable-neutral components: wall/cornice/window/door/weathering) plus a define-only **signature layer** for distinctive per-building silhouette features (bay windows, stoops, oriel projections, etc.). The signature layer is defined as a contract today; BUILD into the renderer is Phase 7+/8 work. This keeps each subsequent family cheap: generate the base set from the proven recipe, add signature features as curated overlays.

**Two human taste gates (on top of the mechanical gate):**
1. **Gate A — Contact-sheet board** (`docs/visual-artifacts/asset-kit-boards/<family>-board.png`): all components at scale on one sheet, reviewed for II-C style fidelity.
2. **Gate B — Isolation scene proof** (`docs/visual-artifacts/asset-kit-boards/<family>-scene-proof.jpg`): components composed in the harness (`src/dev/AssetKitProof.js`) into a representative building massing and reviewed for system coherence at render scale.

The mechanical gate (`node scripts/verify-inked-component.mjs`, chained in `npm run verify`) is a prerequisite but not sufficient — both taste gates are required before a family ships.

**Isolation proof must size by real meters:** the harness must use physically accurate dimensions (representative building footprint in metres, real lap/cornice/window/door heights) or the composition reads wrong at render scale regardless of art quality. Clapboard pilot lesson: arbitrary fractions produced a stretched giant lap and undersized openings; real-meter sizing fixed both immediately.

**Clapboard as the consistency anchor:** the clapboard family (5 components: wall/cornice/window/door-stoop/weathering) is the first family through both taste gates and is designated the anchor for style consistency across all subsequent families. The recipe (generation prompt scaffold, alpha-key workflow, real-meter compose harness) is now proven and reusable.

**Vertical-slice method:** generate one full family end-to-end (all components → mechanical gate → Gate A → Gate B) before scaling. De-risks the generation + compose workflow before committing effort to all families.

Owner: Batu (taste/approvals) / Agent (execution). Source: `docs/reference/art/ASSET_KIT_LOG.md` (clapboard entry), `docs/COMPONENT_INVENTORY.md`, `docs/superpowers/plans/2026-06-19-asset-kit-generation.md`.

## 2026-06-18 - Sequenced Roadmap Locked (Phases 6–9): spine-first, container + content together

Decision (Batu-approved in session): the now/next/later ordering across the container (Track A) and content (Track B) is **locked** in `docs/PLAN.md` as Phases 6–9. This closes the OPEN priority re-decision recorded 2026-06-17.

**Governing principle:** don't fill the neighborhood and then add content. Build out the **story-dense spine** (curated density, not coverage) and dress it with both inked craft and editorial content at once — the spine is where the landmarks and stories live, so container and content stop competing.

Locked sequence:
- **Phase 6 — Curation & Visual-System Lock (NOW).** 6.1 one curation pass yielding both the hero visual tier and the landmark story-object tier (Agent drafts, Batu approves before anything scales). 6.2 codify `ART_DIRECTION.md` into a machine-checkable contract — palette token module, component inventory, conformance gate (out-of-token color fails + per-material regression screenshot). This is the explicit answer to the styling-consistency watchout; it ends ad-hoc per-building tuning (the recent cornice churn).
- **Phase 7 — Asset Kit Completion (NEXT).** Add the 3 missing material families (clapboard/wood-frame, brownstone, modern) + a flat typological roof tone (multi-angle-safe). Brick is the only family today.
- **Phase 8 — Spine Expansion + Story Attachment (NEXT, parallel).** Expand procedurally along the curated corridor; hero treatment only on the 6.1 set. Implement `PlaceStory` in code and attach 3–5 real stories to built landmarks to begin testing H1 *during* expansion. Absorbs Track-A 4.3/5.1 and Track-B B1.
- **Phase 9 — Validate & Scale (LATER).** Track-B B3–B8 + Track-A 5.x: landmark completion, routes (H2), events (H3), North-Star instrumentation, business-claim monetization (H4), roof/pavement/sidewalk detail, publish, repeatability (H5).

**Deferred explicitly:** roof *detail*, pavement/sidewalk detail, business-claim monetization, second neighborhood. **Not deferred:** a flat roof *tone* (the 4-angle camera shows rooftops).

Owner: Batu (taste/curation/approvals) / Agent (execution). Source of truth: `docs/PLAN.md` "Sequenced Roadmap — LOCKED 2026-06-18".

## 2026-06-16 - Inked Look Gate + Modular Component Kit (spike: conditional GO)

Decision (Batu-approved in session, after the in-engine feasibility spike on branch `feat/inked-facade-look`):

1. **Look gate:** the whole scene speaks **one II-C inked language** (`docs/ART_DIRECTION.md`). Heroes/landmarks get bespoke renders but *in the inked style* (re-rendered over time); everything else is procedurally rendered in the inked system. Heroes and infill differ in **craft tier, not style**. This ends the drift into the documented fallback (photo-real heroes + flat-color typological infill).

2. **Non-hero facades = a modular inked COMPONENT KIT, not whole-building tiles.** Batu's domain fact: ~80% of Greenpoint is four facade systems (brick, wood-frame/clapboard, brownstone, modern) recolored/recombined. Whole-building tiles are combinatorially explosive and stretch wrong on the next building; a small library of inked components (wall/window/cornice/ground/etc.) recombines infinitely, driven by `buildingTypology.js`, reusing the `facadeAssembly.js` composition idea.

3. **Tintable-neutral components + shader tint.** Components are generated dark-ink on light warm-grey (~#EDE8E0), no saturated color; material color is applied in-engine as a `MeshBasicMaterial.color` multiply. Collapses "4 systems × many colors" from dozens of renders to ~4 material renders + a color parameter.

4. **Technique order: AI inked assets (#3) first; NPR screen-space post-pass (#1) is the fallback.** Modular components are what make #3 worth it (generate once, recombine forever).

**Spike result — conditional GO.** Generated a brick component set (wall/window/cornice/ground), composed two adjacent 1855 rowhouses in-engine via a pure `inkedFacadeCompose.js` + a gated `buildInkedFacadeTest` in `SceneView.jsx`, and recolored to two tints.
- ✅ Components **compose** into a facade. ✅ **Shader-tint recolor works** — same neutral brick texture × two tints, ink stays dark (this validates the mechanism the whole Tier-B color pipeline depends on). ✅ Brick wall + ground-floor stoop **read as hand-inked**; no ugly wall seams.
- ❌ **Window component washes to bright white blocks** at building scale (near-white glass/frame, untinted) — finding #1 for the full kit: re-render the window darker/bolder (and consider a faint tint).
- Engineering notes: GPT returned "transparent" window/cornice as a **baked checkerboard** (no alpha) → keyed to real alpha with `scripts/key_inked_alpha.py` (border-seeded flood, stops at ink). Spike also forced camera-facing edge selection, polygon-offset decal bias, and frustum-cull disable in `buildInkedFacadeTest`.

**Next:** brainstorm the **full inked component kit spec** — the other 3 materials (clapboard/brownstone/modern), more component variants, typology-driven composition across the block, and the hero inked re-render track. Re-render the brick window component (bolder ink) as the first concrete fix. The facade-truth/recognizability pipeline (per-BIN parameter vector grounded by tiered evidence; Mapillary-primary, Street-View-extract-only; spine-first) is the data half that feeds this kit. The throwaway spike wiring is gated by `INKED_FACADE_TEST` and trivially removable; keep for now as a working reference.

Spec/plan: `docs/superpowers/specs/2026-06-16-ai-inked-component-kit-spike-design.md`, `docs/superpowers/plans/2026-06-16-ai-inked-component-kit-spike.md`. Owner: Batu (taste/approval) / Agent (execution).

## 2026-06-15 - Multi-Angle Camera Rig Shipped; Hero Culling Now Follows the Camera (Phase 3.2)

Decision (execution, within the approved 3.2 scope): Scene mode now rotates through **four fixed iso steps** (90°) with an eased snap, retaining pan/zoom; free-cam stays debug-only. Rotation via ↺/↻ buttons + Q/E/`[`/`]`/arrow keys, with an "angle N/4" indicator. Contained to `SceneView.jsx`.

Implementation note worth recording (the plan's "no geometry change" assumption was incomplete): the hero back-face cull was computed once at build time against the single fixed `ISO_AZIMUTH`. With a rotating camera that left **see-through holes** when viewing a building's back. Chosen fix: build every (non-party) wall and **toggle `.visible` per current view** from each wall's outward normal — true back-face culling that tracks the live azimuth, recomputed each snap frame. No geometry/rebuild; the step-0 NE composition is byte-identical to before.

Known limitation, explicitly deferred to **3.3.1**: Premier is a multi-BIN *facade flat* (only its two street faces exist; uncovered edges are interior party walls), so it disappears from the full-rear angle. Single-BIN solid heroes (Sonny's, Sereneco) read correctly from all four angles. Giving Premier party walls/rears is 3.3.1's job.

Owner: Agent (execution). Verified: `npm run build` green, 14/14 node tests, four-angle rotation screenshotted.

## 2026-06-15 - Hero Business Cards Inserted as the Next Phase (feedback vehicle)

Decision (Batu-approved in session): insert a **business-card demo phase (3.15) ahead of the camera rig (3.2)**, so Batu can start collecting feedback and ideas from local businesses while the rest of Phase 3 is built. Objective: clicking a hero corner opens a paper II-C place card with real, sourced business data for the three heroes (Premier/Franklin Organic, Sonny's, Sereneco).

Decisions on shape:
1. **Reference:** build to `docs/reference/art/II-B-place-card-marker-hover-state.png` + ART_DIRECTION §9 (paper card, pin + tether), with a **trimmed IA** — name, category, tag row, address, neutral description, disclaimer. **No Save/Share/Details, no hours/OPEN-NOW** in v0 (avoids implying app features we won't build and dodges the staleness-prone hours field).
2. **Data:** agent does documented public-source research and **proposes** static local records (per `PLACE_SOURCE_POLICY.md`: public facts only, cited sources, `lastVerified`, no scraping/APIs/live data). **Batu approves before any public/demo use** — records carry `approvalStatus: proposed` until then.
3. **Hours/status:** omitted in v0; uncertain status surfaces as `unknown`/under-review, never as a live claim.
4. **Feedback mechanism:** display-only card with an unofficial-prototype disclaimer; Batu demos in person and captures reactions (no in-app submissions, per policy).

Detailed plan: `docs/superpowers/plans/2026-06-15-hero-business-cards.md`. This pulls forward and focuses the place-card half of the old Phase 3.5 onto the three heroes with real data.

Owner: Batu (public representation + data approval). Agent proposes.

## 2026-06-15 - Multi-Angle Viewing Is a Firm Requirement (revises the camera decision)

Decision (Batu-approved in session): the scene must be **viewable from all four orthogonal isometric angles** (90° rotation steps), with pan/zoom. This revises the 2026-06-11 camera decision (item 4), which left rotation as "possibly 2–4 steps" — it is now a requirement, not optional.

Why:
- A single fixed iso angle renders only **two of every building's four sides**. Every street frontage that faces away is permanently invisible — and that is structurally ~half of all frontages once the scene extends past a corner. Those hidden frontages are **businesses that would never be seen**. Four orthogonal rotations make every street frontage visible from at least one angle.
- This is **not** free-cam (which stays debug-only). It is four discrete, composed isometric viewpoints.

Scope implications:
- A building's street frontages must be treated for whichever angle(s) reveal them (hero-exact where notable, typological otherwise). "All visible faces" now means all four angles.
- Scene/corner completeness and the Phase-3 acceptance gate are judged **from all four angles**, not one.
- Existing work is unaffected: b1 ground is symmetric; hero facade textures live on world-space faces (corner fold, kinks, etc. are geometric), so rotation views them correctly rather than breaking them.

Sequencing consequence (PLAN.md): the **multi-angle camera rig (Phase 3.2)** and **all-angle corner completion (Phase 3.3)** come before the Franklin→Milton extension (Phase 4.1 / c) — complete the template corner from all angles before replicating it down the block.

Owner: Batu.

## 2026-06-15 - Street Layer + Franklin Extension Direction (Phase 3.1 / Phase 4.1)

Context: MVP corner (Franklin × Greenpoint heroes — Premier, Sonny's, Sereneco) is complete. Next work is the ground/street layer (b1), corner signals (b2), then a Franklin block-face extension (c). Decisions (Batu-approved in session):

1. **Ground render = procedural inked, in-engine.** Roadbed, sidewalk, curbs, and crosswalks are built as geometry with II-C inked treatment (asphalt/concrete tones, paper grain, slab score-lines, painted-stripe geometry). No AI ground textures in v0; reserve image-to-image upgrade only if the surface reads flat next to the textured facades.
2. **Curb/sidewalk geometry = hybrid (real where present, derived where not).** Project the existing `sidewalkLineRecords` into the R10E frame for real curb edges — these exist for **Greenpoint Ave (×1) and Franklin St (×3)** in `geometry-source/...phase-3b.json`. Greenpoint roadbed from its real centerline + recorded width (50). Franklin has no source centerline (known gap), so reconstruct its curb edges + a derived centerline from its sidewalk-line pair. Anything derived renders under the existing `II_PALETTE.streetDerived` flag. Fallback to frontage-offset-by-width only if projection proves noisy.
3. **Street furniture = typological-standard, signals first.** Standard NYC mast-arm traffic + pedestrian signals at curb-return positions, marked typological (infill truth rule). Hydrant/signs/tree-pits deferred. Exact placement deferred to the pre-publish truth pass.
4. **Franklin extension (c) scope = full block face, Greenpoint Ave → Milton St**, typological massing (correct floors/height/material family, no hero facades). Heroes deferred.
5. **Prerequisite for c:** the Greenpoint→Milton Franklin block face is **not in the current footprint set** (the existing 291 records are a Greenpoint-Ave-axis buffer; `crossAxisOffset` ≈ 0 across all — no up-Franklin coverage). c is gated on a bounded NYC Open Data footprint pull (step c.0) before massing.

Sequencing: b1 → b2 → c. b1 is load-bearing — b2's signals sit on b1's curb returns, and c extends b1's Franklin ground run. b1+b2 complete Phase 3.1; c opens Phase 4.1.

Owner: Batu.

## 2026-06-12 - Premier Corner Fold Fixed at PREMIER_KINK = 0.478

Decision (Batu-approved in session):
- `PREMIER_KINK` stays **0.478**. The Premier facade fold (Franklin↔Greenpoint boundary in the v4 corner texture) is settled; do not move it to ~0.52.

Evidence:
- Resolved against the likeness-truth photos, not the commissioned contour. In `franklin-southwest-zoom.jpeg` the real building corner is the storefront sign break — the vertical seam between green "ORGANIC" (Franklin face) and the right-hand "premier" (Greenpoint face), sitting on the corner post. The bay oriel is a Greenpoint feature set *just past* the corner, not the corner itself.
- That sign break maps to whole-u ≈ 0.48–0.50 in `premier-franklin-organic--corner-v4.png` — i.e. the current 0.478. Content right of ~0.50 ("premier" word → bay → fire escapes) is Greenpoint in both photo and texture.
- Moving to 0.52 would push the fold right of the real storefront corner, dragging the corner storefront onto the receding Greenpoint plane — contradicted by the evidence.

Known minor artifact (accepted): the window column at whole-u ≈ 0.477–0.511 physically straddles the corner, so no kink value renders it cleanly frontal. It is currently assigned to the Greenpoint face at local-x [0, 0.063]. If revisited, fix it *locally* (tighten that one window's assignment/recess) — never by relocating the fold.

Supersedes the git-history oscillation ("true drawn corner at u=0.52" → v4 "proportional corner at 0.478"). The fold is closed; reopen only with new photo evidence.

Owner: Batu.

## 2026-06-11 - Project Reset: Goal, Gates, Production Means, Camera

Decisions (all Batu-approved in direct session):

1. **Product goal restated:** a 3D, isometric, interactive, explorable, browser-based Greenpoint that is lifelike — buildings/businesses located exactly where they are in real life and recognizably themselves. Art-directed (II-C Inked Indie), not hyperreal.
2. **Real-faithful supersedes fictional-safe.** The fictional-safe storefront identity clause of the 2026-05-28 visual approval is retired. Real business names, signage, and likenesses are the goal.
3. **Audience: public community demo.** Real names/likenesses are used freely during development; factual-claims discipline moves to a pre-launch review pass (verify names/placements, fix misattributions, optional business outreach).
4. **Likeness bar: heroes exact, infill typological.** Corners, landmarks, and storefronts get exact treatment; rowhouse infill gets correct massing, floor count, material family, and rhythm.
5. **Production means: agent-built procedural kit + AI asset generation.** The Visual Asset Responsibility Rule (prohibition on code-built primary art) is retired. AI image generation (GPT-5.5 class) and image-to-3D are authorized lanes.
6. **Camera: fixed isometric + pan/zoom** (possibly 2–4 rotation steps). Free-cam becomes debug-only. This is the controlling assumption for asset cost.
7. **Look hierarchy:** II-C Inked Indie Visual System is primary; the GPT-5.5 photo-render benchmark (Premier Organic image) is the fallback, decided at the Phase 2 style-feasibility gate — not by drift.
8. **Governance collapse:** the v1 multi-party batch/gate contract, per-batch briefs, ledger reconciliation, and claim ladders are retired. AGENTS.md v2 (one page), PLAN.md v2, and this log are the living docs.

Rationale:
- Seven sub-batches (R10A–R10G) were needed to place three buildings; process mass exceeded product output.
- The art pillar — the product's core value — had produced only voxel massing studies because every art-production path was gate-blocked.
- Ecosystem evidence (June 2026) shows procedural Three.js city art is now cheap; the project's moat is its truth pipeline plus Batu's taste.

Benchmark provenance: the Premier Organic benchmark image was rendered by GPT-5.5 from a reference photo, establishing the AI image-to-image lane as proven.

Owner: Batu (all eight decisions). Agent executes inside them per AGENTS.md v2.

---

*Pre-reset history (2026-05-26 → 2026-06-04, the MVP era superseded by this reset) is archived in [`archive/DECISION_LOG-pre-reset.md`](archive/DECISION_LOG-pre-reset.md) — provenance only, not authority.*
