# October Verdict Review — runway, operating changes, three rulings (2026-08-19)

Produced at Batu's direction: *"if i were to give you the goal of proving PMF
for stoopwise with greater autonomy by end oct, how would you approach it and
what would you change in the way we're working currently … ensure there are no
known barriers/obstacles to doing this by the stated date."* Built from the
repo's own state — gtm-state, the cycle-6 readout, growth-engine §7, the 8/17
strategy review — plus this session's observations of how decisions actually
move. No new outside research; the 8/17 review's evidence base stands.

**Reconciled the same hour with the re-entry review** ratified earlier today
in a parallel session (`2026-08-19-reentry-review.md`, DECISION_LOG third
entry) — it landed on `main` while this was being written. Its rulings are
treated as prior decisions here: the signup-ask repair enters the build
sequence below, and D9 was aligned to its click-first caveat before any
ruling.

**Status: ALL RATIFIED (Batu, 2026-08-19).** D9 was ruled first, four days ahead of its window closing; D7 and D8 followed the same day. Promoted to `DECISION_LOG.md` (fourth and fifth entries); carriers updated in the same change — `growth-engine.md` §7 (ladder row + stays-human list), `gtm-state.json` (standing rules, readout line, open decisions cleared). Numbering continues the
8/17 review's D1–D6. Ruled entries get promoted to `DECISION_LOG.md`; rejected
ones stay here as the dated record.

**What this doc does not touch:** the gates, the demand bar, experiment rules,
truth rules. D1 used the last clean pre-data window for the bar; there is no
legitimate window to move it again before the verdict. Everything below is
about how fast the existing plan executes — except D9, which *adds* a
pre-registration while its instruments still have zero data.

---

## 1. The fixed constraint: the verdict is decided by ~Sep 25

The firm verdict (~late Oct) reads two mature 4-week cohorts against the D1
gate: of locals who visit twice, ≥25% return in ≥3 of any 4 consecutive
weeks, floor 12 people.

Work the dates backward from a ~Oct 25 read:

- A person's 4-week window must **end** by ~Oct 25, so their first visit must
  land by **~Sep 27** for them to be countable at all.
- A *cohort* needs enough people to mean something, and "two mature cohorts"
  staggers entries earlier — realistically **now through ~mid-September**,
  hard-closing **~Sep 25**.
- The floor needs ≥12 returners at ≥25%, which means **≥48 twice-visiting
  locals** in the denominator with 4-week histories. Today's denominator: 17.
  It has to roughly **triple in the next five weeks**.

Consequence: after ~Sep 25, no send, channel, or feature improves the October
read — only the data quality of people already in. Every reach and product
action in this plan therefore front-loads into **Aug 19 – Sep 20**. October
itself is for measurement hygiene and the November-cohort setup, nothing else.

The five-week calendar as ratified:

| Date | Event |
|---|---|
| Sun Aug 23 | D9's deadline — medium-pivot pre-registration (before first send data) |
| Mon Aug 24 | First weekly send (D2) |
| Tue Aug 25 | First attribution readout (gate deleted by D3 — reads results only) |
| Tue Sep 8 | Parents-wedge posts, both groups (Q2) |
| ~Sep 15 | Provisional demand readout · paid-reach checkpoint (<300 tagged local sessions reopens the held question) |
| ~Sep 25 | Cohort entry effectively closes for the October verdict |
| ~late Oct | Firm verdict, two mature cohorts |

## 2. What end-October can honestly deliver

P8 (ratified 2026-08-15, pre-data): a pass whose mature cohorts sit wholly in
Sep–Oct is **provisional** until one Nov-or-later cohort clears the same bar —
or Batu accepts it explicitly as a peak-season pass, disclosed in pilot
conversations. That rule exists for a good reason and this doc does not
propose touching it.

So "prove PMF by end Oct" has exactly three honest outcomes:

1. **Provisional pass** — gate cleared on Sep–Oct cohorts, November cohort
   already filling as the confirmation. Best case, and a real one.
2. **Fail with a named cause** — gate missed with every channel fired, every
   measurement hole closed, and the medium question answered. A *decidable*
   no is a success of the process; it's what the whole pre-registration
   apparatus is for.
3. **Unreadable** — the outcome this doc exists to prevent. Every ruling
   below attacks a specific way October could become unreadable: too little
   traffic (D7 latency, §4 channels), miscounted returns (D8 repairs),
   or the wrong container measured as product failure (D9).

## 3. Where the time actually goes

The bottleneck is not strategy, build capacity, or hours — it's that
decisions and sends wait for a working session to happen. Four instances from
one week, all from the record:

- D5's return mechanisms: built Aug 17, merged Aug 19 — one day before the
  friends-family cohort's return window they were built for.
- Perri replied in 36 minutes on Aug 17; the reply went out Aug 19 as her
  offered window was closing.
- D3 cleared five channels to fire "this week" on Aug 17; the Aug 19 readout
  found zero had fired (`org-film-noir`, `reddit`, `fbgroups`, `nextdoor`,
  `ig`, `market`, `greenline`, `qr` — no events exist).
- PR #42 sat long enough that a reconciliation cycle had to be run to keep it
  from reverting five ratified decisions.

Each gap was one to two days. Against a five-week runway where the denominator
must triple, one-to-two-day gaps on every action are the single largest
recoverable loss. D7 is the fix.

## 4. Already inside existing authority — starting now, no ruling needed

- **Proof-of-value drafts** for Town Square, the Library, and Brooklyn Craft:
  their sends produced same-day sessions and two Library cards sit in the
  all-time top six — nobody has shown them that yet. This is Loop B's entire
  missing mechanism, zero build. Drafts go in the queue; cadence (fold into
  the next natural touch vs. standalone) decided there — a second email two
  days after an unanswered first one is too eager.
- **The signup-ask redesign** (re-entry ruling 2, ratified today) starts on a
  branch this week: 2 conversions out of the 18 people who ever saw the form
  is the number that starves the send, and the send is the retention spine.
  Visual, so it keeps preview review and rides D7 for speed; a repair, not an
  experiment — no slot consumed (§6 rule 6).
- **Evergreen three-picks drafts per lens, refreshed weekly** — so a Facebook
  group answer is paste-ready the day a "what's happening this weekend?"
  thread appears. Honest mechanics: I can't monitor FB (login walls), so
  thread-spotting stays Batu's; the drafting and tagged links are mine, and
  the turnaround happens in the daily window.
- **Carousel generator** built from the `/week` data this week; Batu
  taste-gates the template once, then weekly generation is mechanical.
- **The queue itself** (see D7) — maintained regardless of the ruling; the
  ruling is about whether Batu commits to clearing it daily.
- **Batu one-time action, not a ruling: GSC access.** Search Console is a
  browser instrument on Batu's account, unreadable by every routine — a
  ~10-minute API/service-account setup makes Loop C's citation line readable
  forever. Queue item, needBy ~Aug 31 (the scheduled re-pull date).

---

## D7 — The daily decision window. ✅ **RATIFIED (Batu, 2026-08-19)**

**Recommendation: yes.** One fifteen-minute window a day (time of Batu's
choosing) to clear the queue: sends to approve-and-paste, branches to merge,
rulings due. The queue lives where it already lives — `gtm-state.json`
(`daily`, `needBy`) rendered in the cockpit — and I keep it current across
sessions and routines, chasing items proactively rather than waiting to be
asked.

*Why this is the highest-leverage change:* it converts every 1–2-day gap in
§3 into same-day turnaround, across all channels at once, and it costs no new
autonomy — supervision stays exactly where §7 put it; it just stops being
scattered. ~1.75 h/week, inside the confirmed 12–15 budget, and it largely
*replaces* ad-hoc session time rather than adding to it.

*Instrumented:* the Tuesday readout adds one line — age of the oldest open
queue item, target < 1 day. A skipped week of windows is the same early
warning the founder-hours risk already watches.

*Cost/risk:* a daily obligation on Batu. Mitigation: the window has no
minimum — an empty queue is a ten-second check.

## D8 — Default-merge for pre-ratified non-visual builds; ratify the venue/category pages. ✅ **RATIFIED (Batu, 2026-08-19)** — including the named §7 exception.

**Recommendation: yes, narrowly.** Two parts.

**(a) The default-merge class.** For build items that a DECISION_LOG entry has
already ratified and that have **no visual surface**, the flow becomes:
branch + tests + preview as today → notification lands in the daily queue →
**if not vetoed within 24 hours, I merge**. Today's class, exhaustively:

1. ~~Server-set cookie mirror of `gl_first_seen` (D5 item 7)~~ — **dropped
   the same day (Batu), before it was built.** `privacy.html` promises no
   cookies in three places, so shipping it would have falsified a published
   page — outside this class by construction, and the first item tested
   proved the boundary works. The Safari bias is measured instead
   (return-rate-by-browser line, labeled October read); it can only produce a
   false fail, never a false pass. DECISION_LOG 2026-08-19 sixth entry.
2. FB webview check instrumentation + its dependencies row (D5 item 8) — Q2's
   open precondition, due before Sep 8.
3. The routine-clobber fix in growth-weekly step 4.5 (cycle-6 proposal 3).
4. GSC plumbing, once the one-time auth above is done.

Anything with a visual surface stays preview-reviewed per the 2026-08-08
design-batch rule and rides D7 for speed instead: the install nudge (D5.3),
the `/e/` email ask (D5.5), the carousel template, and the pages in (b).

*Flag, stated plainly:* §7 lists code merges under "what stays human
regardless of calibration." This ruling carves a narrow exception —
pre-ratified, non-visual, test-covered, 24-hour veto preserved — so it is a
real contract change and exactly the kind §7 says Batu ratifies in a readout.
A revert stays one commit away; demotion stays immediate on any miss.

**(b) Ratify the venue/category page build.** Named as the follow-through on
the open search flank since the 8/17 review (§5), H5's own contingency, and
parked since July. Loop C is the only channel producing non-founder users and
it converts best; crawl latency is ~4 days, so pages built in the next two
weeks harvest exactly inside the cohort-entry window. Proposed as **owned
infrastructure outside the max-3 experiment cap** (same standing as Q3 — no
kill rule, no slot consumed), built on branches with normal preview review
(they are user-visible pages), sequenced behind the measurement repairs and
the signup-ask redesign (re-entry ruling 2).

*Cost/risk:* (a) a wrong merge reaching prod for up to one veto cycle —
bounded by the class definition (non-visual, tested, pre-ratified). (b) build
time against launch-week attention — bounded by sequencing it second.

## D9 — Pre-register the medium-pivot rule before the first send. ✅ **RATIFIED (Batu, 2026-08-19, pre-data — thresholds as proposed)**

**Recommendation: yes, this week.** The medium question (learning-log Q1:
never tested that a *website* is the right container; Rana doesn't open
browsers) is the one open question that can invalidate the product's form.
Its two instruments are about to produce first data — the Monday send
(Aug 24) and the carousel (cleared by D3). Pre-registration doctrine says the
interpretation rule must be written **before** the data exists. This is the
same last-clean-window logic D1 used on 8/17; the window closes Sunday.
Today's re-entry review (ruling 5) already made these instruments the
pre-registered Q1 read and refused to crown any long-term mechanism before
they report; D9 completes that by writing down, pre-data, what the report
will mean.

Proposed rule — thresholds are defaults for Batu to edit at ratification:

- **Instrument:** tagged digest clicks (`?src=digest`) and the carousel's
  registered read (P9-ig: in-feed engagement vs. tagged sessions). **Never
  opens** — re-entry ruling 1's caveat is binding: Apple Mail Privacy
  Protection inflates reported opens 15–35%, so opens are a supporting line
  only. (This also protects the trigger itself — inflated opens would make
  dead subscribers look like list-readers and could fire a false container
  alarm.)
- **Trigger:** three consecutive sends (≈ Sep 7–14) with tagged clicks
  < 10% of list size, while the carousel's in-feed engagement is healthy and
  `src=ig` sessions stay flat → **the container ruling opens** with
  pre-named options: (a) email-first product, site as archive + AEO surface;
  (b) status quo with the send as spine. The trigger opens the decision; it
  never executes a pivot on its own.
- **Pre-commitment 1 — no clock reset:** container evidence never resets the
  demand clock. D1 already defined a return container-neutrally (a tagged
  email click counts); the gate keeps reading through a container pivot.
  Without this line pre-registered, a mid-September pivot hands October an
  excuse to be unreadable — the exact P7 failure shape the 8/17 review
  killed.
- **Pre-commitment 2 — the question closes either way:** three sends with
  tagged clicks ≥ 25% of list size closes learning-log Q1 in the site's
  favor and retires "wrong container" as an explanation for any demand miss.
  A pre-registered question that can only resolve against the product isn't
  an instrument, it's an exit.

*Cost/risk:* thresholds set at n=4 list size will read on small numbers for
the first sends; the three-consecutive-sends requirement and the Sep 8–14
earliest-trigger date are the guard. List growth between now and then only
strengthens the read.

---

## Barriers no ruling removes — named so nobody discovers them in October

1. **Conversion arithmetic.** The researched visitor→habit range is 3–6%.
   Reaching a ~50-person denominator by late September is feasible with every
   channel firing, and tight. The escape valve is already written and dated:
   cumulative tagged local sessions < ~300 by Sep 15 reopens the held
   paid-reach-as-instrument question. Nothing new to decide today.
2. **Founder hours.** 12–15/week confirmed realistic (2026-08-19). The slate
   spends nearly all of it; a skipped week stays the earliest failure signal,
   and the cut order sits in reserve (fewer group posts → one market morning
   → Greenline deferred).
3. **The medium risk itself.** If the answer is "email and Instagram, not a
   website," no execution speed fixes that. D9's job is to make it a
   mid-September decision instead of an October excuse.
4. **Seasonality.** P8 stands: the best end-October outcome is a provisional
   pass pending a November cohort — or Batu's explicit, disclosed
   peak-season acceptance. Anyone hearing "PMF by end Oct" should hear it
   with that label attached.
5. **Other people's clocks.** Org reply rates (August vacation noise is
   already suspended from Q1's kill clock), group moderation (a ban kills a
   channel permanently — the rules-read-first discipline stands), and
   crawler cadence (~4 days) are outside any autonomy grant.

---

## Proposed DECISION_LOG entries (promoted per ruling)

> **2026-08-19 — Daily decision window** *(if D7)*
> Decision (Batu). A daily 15-minute queue-clearing window replaces
> session-batched approvals. The queue lives in `gtm-state.json`/cockpit,
> maintained by the operator across sessions; the Tuesday readout reports the
> age of the oldest open item, target < 1 day. Supervision unchanged — the
> same approvals, on a daily clock.

> **2026-08-19 — Default-merge for pre-ratified non-visual builds; venue/category pages ratified** *(if D8)*
> Decision (Batu). Build items already ratified in this log, with no visual
> surface and test coverage, merge by default 24 h after their preview lands
> in the daily queue unless vetoed — initial class: the `gl_first_seen`
> cookie mirror, FB webview instrumentation, the routine-clobber fix, GSC
> plumbing. Narrow exception to §7's "code merges stay human"; demotion
> immediate on any miss. Venue/category pages ratified as owned Loop C
> infrastructure (no experiment slot), normal preview review, sequenced
> after the measurement repairs.

> **2026-08-19 — Medium-pivot rule pre-registered** *(if D9)*
> Decision (Batu, pre-data — instruments first produce data Aug 24). Judged
> on tagged clicks, never opens (re-entry ruling 1's MPP caveat is binding).
> Three consecutive sends with tagged clicks < 10% of list size, carousel
> engaging while `src=ig` sessions stay flat, opens the container ruling
> (email-first vs. status quo); the trigger opens a decision, never executes
> one. Container evidence never resets the demand clock (returns are
> container-neutral per D1). Three sends with tagged clicks ≥ 25% of list
> size closes learning-log Q1 in the site's favor and retires "wrong
> container" as an explanation for a demand miss.
