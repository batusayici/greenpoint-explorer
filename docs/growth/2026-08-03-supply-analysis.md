# Supply analysis — why the feed is shrinking (2026-08-03)

Triggered by the cycle-2 growth readout's Finding 2. The question: the deck fell
95 → 75 cards across two weeks, and kept falling *through* a full Monday ingest.
Is the roster losing sources, or are the sources quiet?

**Answer: neither. The sources are publishing and the roster is fine. The feed
is shrinking because the fetch layer cannot reach roughly half of it, and
because expiry is automated while replacement is not.**

Expiry is working exactly as designed. Replacement is failing for four
independent, individually fixable reasons.

## The shape of the decline

| Date | Cards | Commit note |
|---|---|---|
| 2026-07-27 | 95 | §1 baseline |
| 2026-07-30 | 90 | Greenpointers pull |
| 2026-08-01 | 75 | daily refresh: **+7 / −8**, plus two expiry passes (−16, −17) |
| 2026-08-02 | 80 | PR #14 + #16 merges |
| 2026-08-03 | 75 | Monday full refresh: **+3 / −13** |

`datedUpcoming7d`: **38 (baseline) → 28 (now)**.

The Monday full refresh — the largest scheduled run of the week — added **three
cards**, all three from a single source (the Greenpoint Library branch
calendar). That is the number to explain.

## Root cause 1 — the ingest sandbox has no browser egress (largest)

Monday's run commit (`f2d1f17`) states it plainly:

> all 22 browser-method sources errored (Chromium has no egress in this
> sandbox); 12 were recovered by plain fetch and are NOT marked ingested

`ingest-sources.json` carries **48 sources; 12 are `fetch: "browser"`** and go
straight to headless Chromium. The other ~10 failures are `fetch: "auto"`
sources that fell back to the browser after a JS-thin plain read. So **up to 22
of 48 sources (46%) failed on their working path in a single run**, and the
plain-fetch fallback recovered only some.

This is the same failure class as the `us.posthog.com` denial on 2026-07-28 and
the `greenpoint.life` denial in the cycle-2 readout: **the cloud environment's
egress policy, not our code.** Playwright is a devDependency, is installed, and
the browser path works locally — I fetched five browser-gated sources from this
machine and got real content from all five.

Critically, the run had **no way to distinguish "source published nothing" from
"we couldn't reach it."** It reported FRESH and shipped 3 cards.

## Root cause 2 — four sources are configured onto the one method that cannot work

All four NYC Parks calendars are marked `fetch: "browser"`. Tested today:

| Source | Headless Chromium | Plain fetch (browser UA) |
|---|---|---|
| Msgr. McGolrick Park | **403** CloudFront block | **200**, 1,764 chars |
| McCarren Park | **403** | **200**, 3,388 chars |
| WNYC Transmitter Park | **403** | **200**, 2,192 chars |
| Newtown Barge Playground | **403** | **200**, 1,505 chars |

NYC Parks blocks the headless fingerprint and serves plain requests fine, with
real event text well above the `MIN_TEXT_CHARS = 500` threshold. The `browser`
setting sends them *straight to headless*, skipping the plain attempt that
works — so these four have been failing on every run, in every environment,
regardless of egress.

These are the free, outdoor, family-facing park events: the highest-value and
most reliably recurring civic supply on the roster.

**Fix: change `fetch` to `auto` on the four Parks sources.** One-line-each data
edit. This is the cheapest real supply recovery available.

## Root cause 3 — widget-embedded calendars are structurally unreadable

Some sources render their schedule inside a third-party booking widget. The
page loads; the content isn't in it.

- **PLAY Kids Greenpoint** — 418 chars of body text, all nav chrome. The
  calendar is a nested embed.
- **Brooklyn Craft Company** — PR #18 documented this at length: the
  BookThatApp widget is invisible to `WebFetch` *and* to headless, and Shopify's
  product JSON carries a single `Default Title` variant with no date or
  location. **Four cards have been stuck in hold since 8/1 because of it.**
- **Triskelion Arts** (1,015 chars), **New York Society of Play** (hiSawyer) —
  same pattern.

No fetch method reaches these. The current instruction ("open each booking URL")
provably does not work — PR #18 proved it with a control card. This class needs
either a per-vendor adapter (BookThatApp and hiSawyer both have public JSON
endpoints worth checking) or a standing human step, not another retry.

## Root cause 4 — the triage path leaks, and holds are a one-way door

Two structural gaps, both surfaced by PR #18's review:

- **Sender-evaluation and card-triage are separate paths with no crossover.**
  Gallery ATARAH, Balera and Christina's are locally owned Greenpoint openings
  with Greenpointers articles. All three were evaluated as candidate *senders*
  and **never triaged as cards** — openings file as `news`. Three real cards
  were lost to a routing gap, not a truth rule.
- **Held cards have no re-review cadence.** Four BCC cards are held on a
  blocker that cannot be cleared by automation. Nothing re-examines them; they
  simply age out. The hold rule correctly says "never silently dropped," but
  without a re-review step that is what happens.

## Root cause 5 — the roster is event-heavy, so the deck is structurally short-lived

**45 of 48 sources are `cadence: weekly`**, and the deck is mostly dated events
with lifespans of days. Recurring and ongoing cards survive weeks and cost
nothing to maintain — the 8/3 fix that turned Transmitter Park community yoga
into a `recurring` card (Aug 4/11/18/25) converted a one-day card into a
month of coverage in a single edit. That pattern is under-used. A deck weighted
toward dated events will always decay at this rate; the fix is composition, not
throughput.

## Observability gap (why this wasn't caught earlier)

`ingest-ledger.json` cannot answer "which sources have gone quiet":

- **58 of 175 `processedItems` have no `processedAt`**, and the newest date on
  any of them is **2026-07-27** — six days stale, though runs have shipped since.
- The ledger records *outcomes for items*, not *reachability per source per run*.
  A source that errored and a source that published nothing look identical.
- `check-freshness.mjs` reported **FRESH** on the run that added three cards.
  Its `thinFeed` threshold is 10 against a deck of 75 — it cannot detect a 26%
  decline. It measures the floor, not the trend.

## Recommended fixes, ranked by yield per unit effort

1. **Flip the four NYC Parks sources from `browser` to `auto`** — data edit,
   verified working today, recovers the best free/family supply. Do first.
2. **Get browser egress into the ingest routine's environment** — same fix Batu
   just applied for `greenpoint.life`; unblocks up to 22 sources at once.
3. **Make an unreachable source a loud failure.** A run that cannot reach ≥N
   sources should say so in the PR title and in `check-freshness`, not report
   FRESH. This is the defect that let the decline run silently for two weeks.
4. **Record per-source reachability per run in the ledger** (`sourceId`, `runAt`,
   `method`, `ok`, `chars`). Without it, "is this source quiet or broken?" stays
   unanswerable.
5. **Route openings into card triage.** A candidate sender that is also a
   Greenpoint opening is a `news` card; the two paths need one crossover check.
6. **Give held cards a re-review cadence**, and escalate a hold that has failed
   the same automated check twice to a human ask rather than a third retry.
7. **Add a recurring/ongoing bias to the roster** — prefer sources with standing
   weekly programming over one-off announcements.
8. **Replace `thinFeed`'s absolute floor with a trend check** — flag a
   week-over-week decline in `datedUpcoming7d`, which is what actually moved.

**Sequencing note for growth:** items 1 and 2 are what stand between the feed
and its baseline. Wave 1 should follow them, not precede them.
