# Stoopwise Greenpoint — Growth Engine (2026-07-25 · rev 2026-07-28)

Grounded in Elena Verna's frameworks (growth loops / Racecar, PMF-first sequencing,
low-traffic experimentation rules, owned-and-earned-only channels, opinionated
defaults — sources at bottom), applied to what we actually have: the PMF ops plan
(`docs/launch/2026-07-21-pmf-ops-plan.md`), the launch runbook
(`docs/launch/2026-07-27-launch-plan.md`) and the pre-registered validation
gates (four, business-model.md §4),
the 9-event PostHog taxonomy (`src/demand-test/trackEvents.js`), and the Michael /
Laura & Edmond interviews. This doc is the growth strategy of record; decisions it
produces land in `DECISION_LOG.md`. Its companion is **`business-model.md`** (who
pays, for what, when) — this doc grows the audience, that one converts it, and
§5 is the seam between them. **Everything here gates on launch** (= the
greenpoint.life cutover); the Jul 29 checkpoint was voided 2026-07-26.

**Operating stance (Verna, applied):** pre-PMF, the founder is the growth team.
The engine below is staged — most of it is deliberately *not yet lit*. The job now
is retention evidence, not distribution.

---

## 0. Audience → loop → the one CTA (added 2026-07-28)

Every audience serves exactly one loop. The **one CTA** is therefore not the most
useful thing that audience can do — it is the single action that turns their
visit into fuel for their loop. Everything else they can do is support. This
section is the trace every experiment (§2–§4) and every launch item should route
back to; if a proposed build serves no audience's one CTA, it isn't a loop-edge
repair and doesn't ship.

| Audience | Loop | Why they opened it | Available actions | **The one CTA** |
|---|---|---|---|---|
| **Resident** *(parents = a message, not an audience)* | A | "What's on near me this week?" | Today / near-me / free lenses · open card · directions · add to calendar · share · correction link | **"Follow this"** — a lens or a place |
| **Business / venue owner** | B | "Am I on this? Is my listing right?" | Find themselves · correct a card · submit an event/deal · (later) see their card's engagement | **"Add your event — free, verified, on the map."** |
| **Institutional buyer** (owner, property manager, credit union, broker) | Commercial gate (business-model.md §4) | "Is this real, complete, current?" | Published coverage standards · verified-through date · unique-coverage count | **"Request the corridor brief"** — *off-product* (see rule 3) |
| **Answer engines & crawlers** | C | Answer "what's happening in Greenpoint" | `/e/<slug>` · JSON-LD · sitemap / RSS / ICS / llms.txt | **Cite this page** — a dated, attributable, canonical fact block |

**Rule 1 — the resident ask is a ladder, and only one rung is ever visible.**
The one-egg rule (§3) means the first visit asks for nothing. The ask arrives
after demonstrated value and changes with the relationship:

1. **First visit → no ask.** Success is one high-intent act (the activation
   proxy, §1). `postValue.js` already enforces the gate — 2 `card_open` or 1
   `action_tap` before any prompt fires.
2. **Activated → Follow.** *(Batu, 2026-07-28: the resident CTA of record —
   revised the same day from "the Monday digest," see below.)* One verb, two
   objects: a **lens** ("free + kids," "tonight," "civic") or a **place**
   ("tell me when Dandelion Wine does something"). Nothing is broadcast;
   everything is chosen. It stays one CTA under the one-egg rule because it is
   one mechanism, one transport, one ask — only the object changes with
   context. Re-entry is Loop A's weakest edge and weekly returning locals is
   the compounding metric; Follow is the version of that trigger the index can
   make and a newsletter structurally cannot.
3. **Returning / habitual → share.** The only cohort with the credibility to
   refer, and the organic >50% word-of-mouth signal (§1) reads off it. Third
   rung, never a competing ask.

**The Monday digest — un-retired as the retention spine (D2, ratified
2026-08-17).** It ships weekly to the full list from **Mon Aug 24**, drafted by
the Monday routine, **sent by Batu** (§7 unchanged). Follow remains the CTA and
rung 2 of the ladder; the digest is the *transport*, not a competing ask.
**Density floor:** a thin week is skipped, never sent thin — a thin send teaches
people the product is thin. (Citizen is the cautionary case: 2M pushes/day built
the fastest habit in local media, and staff loosened what counted as
alert-worthy on slow days to protect engagement. The floor is that failure mode
pre-refused.)

Why the 2026-07-28 retirement was overturned: outside research swept Front Porch
Forum, Nextdoor, EveryBlock, Patch, Block Club, 6AM City, Bklyner and Citizen
for a hyperlocal product that sustained weekly habit **without** a scheduled
send. There is none — every success had one (FPF 63% read-every-issue; Block
Club neighborhood lists open at 37–48%, ~2× citywide; EveryBlock's own founder:
"most people get our daily email digest," with the site as the configuration
surface), and every failure lacked one. Strike by strike: the *competes-with-
Greenpointers* strike is weaker than it read — their events roundup was dormant
four years until March 2026 and their calendar is empty (verified 2026-08-17) ·
the *founder-cost* strike is real and bounded at ~15 min/week at this list size,
already budgeted as R1's control arm · the *manufactures-the-metric* strike is
answered by D1, which removed "majority unprompted" from the gate and counts a
tagged email click as a return, both labeled · the *push-moment* strike stands
as written, and is the reason the send carries three picks and points at the
index rather than trying to be the index. Full analysis:
`docs/launch/2026-08-17-launch-strategy-review.md` §2.

*The 2026-07-28 case against it, kept as the dated record:* Four strikes, three
of them from our own docs: it is exactly the
"push moment" `business-model.md` §1 defines us *against* ("value spent at
publish time; cannot answer a question asked Tuesday at 6pm") — we had written
the case against our own re-entry mechanism · it competes head-on with
Greenpointers/OMGreenpoint in their format, where they are established and
better · it uses none of the four differentiators · it is unpersonalized · and
two operational strikes: sending is permanently Batu's (§7), so it is the one
growth mechanism whose cost never stops — colliding with H6 and with §6's rule
that anything recurring which can't be automated into the Mon/Tue rhythm doesn't
ship; and **it manufactures the metric that reads the gate** (the demand bar
requires "majority arriving without a fresh invite push" — a weekly email *is*
that push). It survives as **R1's control arm** (§2), not as the plan.

**Why Follow beats the calendar subscription**, the other finalist. The shipped
`events.ics` is the best *habit* fit — no new routine, it lands in a surface
residents already check daily, it costs zero founder-labor forever, and a
self-installed recurring cue is more gate-honest than anything we push. It loses
as the *ask* on three counts: subscribing is genuinely painful on Android, the
ask is abstract at the post-value moment, and a calendar-only subscriber never
returns to the site — satisfying the user while starving WRL. It stays as the
**zero-labor ambient layer**; per-lens `.ics` feeds are a small, testable
addition to the existing prerender pipeline (post-launch).

**The business kicker — Follow feeds two loops from one tap.** Follow-a-place
produces **per-business follower counts**, which are precisely the demand
evidence the proof-of-value email carries (Loop B's missing mechanism, §1) and
that H2 tests. A digest generates no supply-side asset at all.

**Known cost, deferred by design:** automating Follow eventually needs a
backend, and the architecture is deliberately backend-free. That decision is
deferred until the manual test (§2 R1) says personalization is worth paying
for — not hidden.

**Rule 2 — the supply CTA is persistent but low-salience.** Businesses arrive
with intent; they need to be findable, not sold. A pinned "add your event
(free)" entry also does quiet work on residents — it signals completeness and
recruits word-of-mouth toward the supply side. It must never compete with the
one egg.

**Rule 3 — the buyer gets no CTA on the resident surface.** Business-model.md §2
rules 4 and 6 (editorial never monetizes; no payer influences coverage) mean
commerce never appears in the feed. The buyer's path is a separate trust
surface — published coverage standards, verified-through, unique-coverage
count — with the ask pointing off-product to the brief. **The app is the proof,
not the pitch**, which is consistent with the brief-first pilot: its headline
deliverable is audience-independent by design (business-model.md §3).

**Rule 4 — org leaders are not a distinct audience.** *(Batu, 2026-07-28.)*
They are residents handed a tagged link (Q1/Q2 seeding, §4). Their
redistribution role would justify an org-scoped surface; it is not an immediate
priority and does not earn a freeze exception.

**Available to everyone, always:** the per-card correction link (L10). It is the
zero-friction supply entry that works before a submission form exists, and the
visible form of the trust asset.

**Actions deliberately not offered:** accounts or login (breaks the one egg and
the cookieless stance) · resident payment or tip jar (§2 non-negotiable 1) ·
"claim your listing" (claim model retired; it reads as coverage-for-sale) ·
any paid-placement surface before the demand gate · sponsorship affordance on
news or civic cards, ever.

**Gaps against this map** (status 2026-07-28; Follow status corrected
2026-08-15): business CTA = **L5 shipped**;
only Batu's Tally form creation remains — **the Follow segment question should
ride that same Tally setup**, making the R1 test near-free · the Follow CTA
**shipped 2026-07-29** — the segment is context-derived and rides the
post-value form as a hidden `follow` param (see R1); the earlier "no
in-product surface" text here was stale · the published coverage standards page (business-model.md
§4) does not exist and pays into two loops (buyer trust + answer-engine trust
signal) · per-lens `.ics` feeds (the ambient layer) are unbuilt — small,
testable, post-launch.

---

## 1. Growth model — the three loops

Funnels spend; loops compound. Stoopwise Greenpoint has three candidate loops. Each is
drawn end-to-end with its compounding metric and its **weakest edge** — the edge
is where experiments and Phase 3 ships go. Nothing outside a loop edge deserves
build time.

### Loop A — Weekly content loop (the engine; demand side)

```
Mon ingest (review-gated) → fresh verified cards → residents check the week
→ saves / shares / .ics / signups → return next week + bring neighbors
→ more demand signal → sharper ingest & coverage → (back to top)
```

- **Compounding metric:** weekly returning locals (WRL). **The gate and this
  metric split 2026-08-17 (D1, pre-Wave-1-data).** The **PMF demand gate** is
  now a rate with a floor: *of locals who visit twice, **≥25% return in ≥3 of
  any 4 consecutive weeks, floor 12 people***. **WRL ≥30 stays as the
  business-viability line** (what Layer-1 renewals and Layer 2 price off);
  both appear in every readout, distance-to-30 included, but the product
  verdict reads the rate. **"Majority unprompted" is out of the gate clause** —
  continuous seeding, which the reach math requires, makes it permanently
  false; organic share stays a watched line under P1's contamination label.
  **A tagged email click counts as a return** (`?src=digest` / `follow-*`),
  with site-direct returns reported on their own line: once the weekly send is
  the re-entry mechanism, counting site visits only would measure the container
  instead of the habit. Rationale: the planned reach could not produce 30 by
  its own verdict date, and 30 was never derived (business-model H8 open) —
  `docs/launch/2026-08-17-launch-strategy-review.md` §1. *Prior bar, superseded:
  ≥30 unique locals returning in ≥3 of any 4 consecutive weeks, majority
  unprompted.* *(Re-registered 2026-07-28, pre-launch, twice:
  first the calendar — ~Sep 15 is a provisional readout; with an Aug 1–8 launch
  it holds only ~5–6 weeks of evidence; the firmer verdict follows two mature
  4-week cohorts, ~late Oct. Then the bar itself — the prior ≥2-visits/week
  measure demanded a daily habit from a weekly-refresh product whose own R1
  digest drives one open per week by design; visit intensity stays tracked as a
  supporting signal. Demand is gate 1 of four — distribution, supply, and
  commercial gates are in business-model.md §4; passing demand alone never
  unlocks paid surfaces… the commercial gate (3 paid pilots/LOIs) does. Metric
  roles: retained = 2-of-4-weeks (R0's definition, feeds WRL); the bar above is
  the gate; organic>50% stays a lens, not a second bar. Seasonality rule: no
  gate read and no renewal priced on raw Dec–Feb numbers — business-model.md
  §4.)* **Peak-cohort label (P8, ratified 2026-08-15, pre-data):** a
  demand-gate pass whose mature cohorts sit wholly inside Sep–Oct is
  provisional until one Nov-or-later 4-week cohort clears the same bar — or
  Batu accepts it explicitly as a peak-season pass, disclosed wherever the
  number is quoted in pilot conversations. The counterpart to the Dec–Feb rule.
- **Feed density (added 2026-07-28 — the leading indicator of the leading
  indicator):** verified, dated, still-upcoming items in the next 7 days, plus
  the share of the roster that yielded ≥1 item this week. It moves before WRL
  does, it is the number a pilot renewal actually rests on, it separates January
  from product failure, and it catches silent source decay and ingest outages
  (the 7/27–28 outage would have tripped it in a day). Pulled Monday from
  `cards.json` + `ingest-ledger.json`; one line in every Tuesday readout.
  **Baseline (last week of July 2026): 95 cards · 38 dated in-window · 48
  sources.** **Per-category cut (added 2026-08-15):** the same line breaks out
  cards + dated-in-window **by filter** — a category going thin (the kids
  inventory in September, civic all year) is otherwise invisible between
  one-off sweeps, and the 2026-08-15 strategy review found civic at 5 cards /
  1 dated only by manual scan.
- **Unique-coverage count (added 2026-07-28 — the differentiation proof):**
  items on the map this week that appeared in no other Greenpoint source
  (Greenpointers guide, OMGreenpoint, venue-only calendars). The measurable form
  of "we index what the newsletters miss" (business-model.md §1) — marketing
  asset, coverage-quality instrument, and H3's test in one number. Derivable
  during the Monday ingest (a card whose only roster source is the venue/org
  itself counts); one line in the Tuesday readout next to feed density.
- **Qualified-action rate (added 2026-08-13 — the action lens):** share of
  sessions taking ≥1 high-intent act (the aha-proxy act set: `action_tap`,
  `cta_tap`, `today_toggle`; calendar adds ride `action_tap`). Habit is
  downstream of action, so this moves before WRL does — but it is a supporting
  readout line, **never the gate**: the demand bar stays as re-registered
  2026-07-28, because amending a pre-registered bar mid-data is exactly what
  pre-registration forbids. Already instrumented; pulled Monday, one line in
  the Tuesday readout next to feed density and unique-coverage.
- **Confirming signal (added 2026-07-27):** PMF in this era is binary — a
  word-of-mouth machine exists or it doesn't, and the benchmark is **organic
  >50% of acquisition**. Instrumentable post-launch: share of new sessions with
  no `?src=` plus search/AI referrers, read monthly. A lens on the WRL bar (it
  sharpens the existing "majority arriving without a fresh invite push" clause),
  not a second bar. **Contamination label (ratified 2026-08-15, pre-data):
  this lens and the gate's "majority unprompted" clause are unreadable for 4
  weeks after any broadcast seed** (group post, QR, org newsletter) — untagged
  echo (retyped domain, screenshots, second-hop shares) plus cookieless
  identity rotation and FB-webview localStorage fragmentation read seeding as
  organic. The ~Sep 15 provisional demand readout carries this label alongside
  the September-rebound label; warm re-invitees' 4-week windows containing a
  re-invite count as prompted. The webview mechanism also *deflates* return
  metrics on webview-borne channels relative to email-borne ones —
  cross-channel return comparisons carry that asymmetry caveat.
- **Weakest edge:** *re-entry* — nothing external reminds a resident it's a new
  week (no digest; habit can't form on memory alone). R1 aims here. The *share*
  edge was repaired 2026-07-26 (3.1: OG tags + crawlable `/e/<slug>`); whether
  word-of-mouth actually travels is unread until post-launch traffic.

### Loop B — Supply loop (supply side; the monetization substrate)

*(Renamed from "supply/claim loop" 2026-07-28 — the claim model is retired; see
`business-model.md`. Metric and weakest edge unchanged.)*

```
Coverage puts businesses/orgs on the map (verified, sourced, free)
→ they see resident traffic & asks → they submit events / ask in
→ richer verified cards → more resident value → more supply attention → (top)
```

- **Compounding metric:** proactive supply actors per month (submissions +
  inbound asks; supply gate: ≥5, ≥1 recurring).
- **Weakest edge — and the only one still unrepaired:** businesses have *no path
  in*. The submission route (3.3 = launch item **L5**) is unbuilt, so this loop
  turns only when Batu hand-carries it. L5 is the last build before cutover.
- **Missing mechanism identified 2026-07-28: proof of value back to the
  supplier.** The loop diagram says businesses "see resident traffic & asks" —
  but nothing shows it to them. A submission form alone doesn't close the loop;
  submission → **publication receipt** → **measured outcome report** (manual
  monthly proof-of-value email: saves, calendar adds, direction taps) → repeat
  submission does. Zero build, and it doubles as the Layer 2 pricing probe
  (business-model.md §3). Starts as soon as there is engagement to report.

### Loop C — Answer-engine distribution loop (owned; zero-CAC)

```
Cards published as static structured HTML (/e/<slug> + JSON-LD, RSS/ICS, llms.txt)
→ search engines & AI assistants cite Stoopwise Greenpoint for "what's happening in
Greenpoint" → residents arrive with zero CAC → usage + signals → more/fresher
structured content → stronger citations → (top)
```

- **Compounding metric:** organic sessions (no `?src=`, search/AI referrers).
- **Edge repaired** (3.6 prerender), **prod acceptance passed 2026-07-28**:
  extensionless `/e/<slug>` resolves, no-JS `curl` returns name/venue/address,
  dated cards carry valid `schema.org/Event` JSON-LD. **Seeded, not yet
  turning** — citations accrue on crawler time. Open: Rich Results spot-check
  (manual), and re-verify after the origin flip at cutover. Freshness + truth
  rules are the citation moat competitors can't copy.
- **Sober read (2026-07-28, business-model.md H5):** valid structured data does
  **not** guarantee rich results or citations, and crawl latency of days is
  material against weekly-expiring events. This loop is a *hypothesis* until
  Search Console + referrer data confirm it (~2 months post-launch). Hardening
  backlog if H5 needs help — **stable venue and category pages, archived events,
  current-events sitemap, Search Console monitoring, source-attribution
  backlinks** — post-launch candidates, not pre-launch builds (feature freeze
  holds). **Zero-click accounting (P10, ratified 2026-08-15):** citations
  (monthly check) and AI-referrer sessions are their own readout lines, apart
  from organic sessions. Citations rising while sessions stay flat is
  pre-named as Loop C working zero-click — H5's fail branch (deprioritize AEO)
  must not fire on that pattern; the response is the hardening backlog above.
  llms.txt stays published with zero value booked against it (Google states
  Search/AI Overviews ignore it; Ahrefs 5/2026: 97% of files drew no traffic).
  Loop C pays off over quarters, not inside the gate window.

**Key read:** the Phase 3 backlog is not a feature list — it is, almost item for
item, the repair kit for the weakest edge of each loop: 3.1 share → A ✅ · 3.6
AEO → C ✅ · 3.3 submission → B ⬜. That's the argument for shipping it as scoped
and resisting additions.

**Economic read of the loops (round-2 investor, 2026-07-28):** a loop compounds
when period N lowers the cost or raises the yield of period N+1. By that test,
**Loop A is an operating cycle at constant weekly cost** — cards expire by
design and feed density is refilled at the same price every week; that's fine
pre-PMF (the founder *is* the growth team) but it should never be budgeted as if
it compounds. The genuine compounders are **Loop C** (citations and archive
depth accrue; zero CAC; nothing re-sold per neighborhood) and **Loop B**
(direct submissions displace ingest labor — the only loop that lowers marginal
cost). Consequence: the corpus is only an accruing asset **where it is
published** — venue/category/archive pages, i.e. exactly the H5 hardening
backlog — and founder-hours should drift from A toward B/C as A stabilizes.

### Aha-moment hypothesis

> **"Something is happening near me this week that I didn't know about — and it's
> verified."** — Laura/Edmond and Michael both landed here: utility beats stories;
> the map is the container, the week's truth is the product.

Proxy definition (instrumentable today): first session with **≥2 `card_open` and
≥1 high-intent act** (`action_tap`, `cta_tap`, or `today_toggle`). This is a
hypothesis to check in the first post-launch readouts (A1), not a fact.

---

## 2. Retention first — the foundation

Verna: acquisition poured into a product that doesn't retain is wasted; a growth
motion cannot fix a product problem. Everything below sequences behind retention
evidence.

- **Natural frequency:** weekly. The product's content refreshes Monday; the
  honest habit is "check the week." (Cadence and product are aligned — rare and
  worth protecting.)
- **Retained user (committed definition):** returns in **≥2 of any 4 consecutive
  weeks** after first visit — the R0 sensor definition that feeds WRL. The
  demand gate itself requires the stricter **≥3 of any 4 weeks** (re-registered
  2026-07-28); retained ≠ gate-passing, by design — the sensor casts wider than
  the bar.
- **Evidence for:** wave-1 testers articulated weekly-check intent unprompted;
  Laura/Edmond asked for save/star + time filters (return-visit features);
  Michael's frame implies recurring use.
- **Evidence against / unknown:** the sensor hole is closed (R0 `return_visit`
  live since 2026-07-26), but the baseline is *young* — the ≥2-of-4-weeks
  definition needs weeks of accumulation before it says anything, which is why
  R0 shipped ahead of launch. Nothing before 2026-07-26 is recoverable
  (Web Analytics enabled late; PostHog cookieless, so visitor identity rotates).

**Retention experiments (ranked):**

| # | Experiment | Smallest test | Metric & decision rule |
|---|---|---|---|
| R0 | **`return_visit` sensor** — localStorage first-seen + visit count, privacy-light. ✅ **live since 2026-07-26** (`returnVisit.js`). | — | Not an experiment — the prerequisite. Unlocks R1/R2 and the demand gate itself. |
| R1 | **Follow: personalized alert vs. broadcast digest** *(restructured 2026-07-28 — was "weekly digest to postvalue signups"; the digest is now the control arm, not the treatment)*. **D2 (2026-08-17): the control arm ships weekly from Mon Aug 24 regardless of R1's state** — the digest is the retention spine first and an experiment arm second, so it no longer waits on the trigger. R1's *comparison* still arms per P5 (first Monday after ≥10 signups with ≥1 segmented) and its 3-week clock runs from then. D5 un-gates the Follow ask from lens state, which is what makes the trigger reachable at all: `postValue.js` was lens-only, so ~90% of visitors never saw the ask and the segmented arm was structurally unreachable. The segment is **taken from context, never asked** (2026-07-29): the app derives the object from the active lens or the trigger card and rides it into the form as a hidden `follow` param (`lens:<id>` / `place:<id>` / `all`), so the form stays one field. Operator drafts per-segment; Batu sends **only when something matches**. Unsegmented signups receive the Monday digest unchanged (`?src=digest`); segments carry `?src=follow-<lens>`. | Manual segments — no backend, no automation build. Keep segments coarse (4–5) so a narrow lens doesn't go weeks without a match. | Segment click-through vs. broadcast click-through, 3 weeks. **The design contains its own control — the answer is empirical, not argued.** Kill: if segmented doesn't beat broadcast by week 3, personalization isn't worth a backend → fall back to the digest and close the question. **Time-boxed regardless:** manual segment sends cost more founder-minutes than one digest, so the test ends at 3 weeks either way — continue only as a build decision. **Trigger (ratified 2026-08-15):** R1 starts the first Monday after ≥10 signups with ≥1 segmented; its 3-week clock runs from that Monday. Supersedes the launch plan's "first Monday post-launch". **P7 fallback (ratified 2026-08-15):** if R1 has not armed by the Mon Oct 5 readout, the next free slot goes to a re-entry mechanism that needs no list (R4 or per-lens `.ics`), chosen at that readout — and the ~late-Oct firm demand read carries the label "measured without a re-entry mechanism": a miss under it reads as product-plus-missing-mechanism unresolved, never product failure alone. |
| R2 | **"New this week" marker** — use first-seen to badge cards added since last visit; makes the weekly rhythm visible in-product. | Small UI change over existing data. | Return-visit `card_open` depth pre/post. Kill if no lift after 2 weeks of returners. |
| R3 | **Five warm-user conversations:** "what would make you check this weekly?" — plus the causal question (added 2026-08-13): **"Did Stoopwise cause you to do something you would not otherwise have known about or chosen?"** The demand-side twin of the unique-coverage count, and verbatim the strongest line pilot evidence can carry ("N% wouldn't have known otherwise"). | Was the voided checkpoint's fail-branch; survives as a standing instrument — run post-launch regardless of the numbers. | Qualitative; feeds Tue proposals and the pilot-conversation kit. |
| R4 | **Anonymous save** *(candidate, registered 2026-08-13 — not live; enters via a Tue-readout proposal when a max-3 slot opens, Batu ratifies)*: a star/save on every card, anonymous localStorage, no account. Hypothesis: saving starts the resident participation graph (business-model.md §1, asset 4) and returns readers to their own shortlist — Laura/Edmond's standing ask. A saved-items view is gated on observed save usage; reminders stay behind the R1 backend decision. | Small UI change over localStorage — no backend, no identity. | Proposed rule (final kill criteria set at launch): save rate per activated session, and whether savers return more (R0 sensor). Kill if saves stay rare after 3 weeks or don't correlate with return. |

---

## 3. Activation

- **Definitions:** *Activated* = the aha proxy above (≥2 `card_open` + 1
  high-intent act, first session). *Leak location:* unknown until the funnel is
  read — the instrumented funnel is `visit → pin_tap/card_open → action_tap/
  cta_tap`, segmented by `?src=`.
- Verna's caveat applies at our scale: activation is a **product** question, not
  a growth-optimization question. No flow micro-optimization; find the one
  structural leak, fix it with a product change.

**Activation experiments (ranked):**

| # | Experiment | Smallest test | Metric & decision rule |
|---|---|---|---|
| A1 | **Read the funnel** (PostHog, segmented by `?src=`, inside the first post-launch readouts — launch runbook §4). Where do first sessions stall — before first `card_open`, or between open and act? | Analysis only. | Produces the target for A2. No build until this is read. |
| A2 | **Opinionated default on first visit:** land new visitors in the merchandised "this week" state (promise-first chip order already ships; extend to whatever A1 says is the stall point — e.g. auto-focus Today on weekday evenings). | One default flipped ON, pre/post. | First-session activation rate. Kill if flat after 2 weeks. |
| A3 | **Post-value prompt timing:** `postValue.js` already gates the email ask on demonstrated value; test the threshold (earlier vs. current) once traffic exists. | Config-level change. | Signup rate per activated session, pre/post. Deferred until ≥50 sessions/week. |

**One-egg rule (added 2026-07-27):** users are selfish, vain, and lazy — the
first 30 seconds must deliver exactly one magical thing: *"what's happening near
me this week, verified."* A2 sharpens that one egg; it never adds a second.
Onboarding tours, multi-feature intros, and asks before demonstrated value
(`postValue.js` already enforces the last) all violate it.

---

## 4. Acquisition — channel–model fit, then focus

Channel–model fit filter (Balfour via Verna): revenue per user is $0 → **only
near-zero-CAC channels can ever fit. Paid is dead permanently**, not deferred.
Scoring the four candidates:

| Channel | Type | Fit | Verdict |
|---|---|---|---|
| Community orgs & local groups | Earned | High — Michael-validated ("community-org-first growth"); orgs have the audience and the content | **Pick — now** |
| Parents/camps wedge | Earned | High — sharpest unmet need (Sawyer gap, Laura/Edmond); a wedge, not a channel: it makes every channel message concrete | **Pick — now** |
| Answer-engine / search (AEO) | Owned | High but slow-burn; compounds forever; needs 3.6 | Build in Phase 3, don't "campaign" it |
| Share loop / word-of-mouth | Product | High; blocked on 3.1 share infra | Lights up with Phase 3 |

**Focus = two:** community-org seeding, with the parents/camps wedge as the lead
message. Everything else is a build that rides the existing Phase 3 plan.

**Echo-chamber targeting (added 2026-07-27):** the unit of seeding is a small
trust network, not reach. Org leaders and parent-group admins are Greenpoint's
micro-influencers — a recommendation from *inside* the network ("parents telling
parents") converts where broadcast can't, and costs nothing. Applied to Q1/Q2:
pick messengers embedded in the network over channels with bigger audiences, and
saturate one network before opening the next. This tightens the existing
experiments' messaging; it adds none (max-3 rule untouched).

**Wedge #2 — un-sequenced and running now (D3, ratified 2026-08-17;
supersedes P11's trigger).** The arts/culture wave — Film Noir first (draft and
`org-film-noir` row standing), then WORD and Flower Cat — sends **the week of
8/17, alongside Wave 1**, not when Q1 closes. Org links may carry
`?lens=arts_culture`.

**P11's temporal-exclusivity clause ("never two networks at once") is dropped;
the echo-chamber density principle stands.** Echo-chamber seeding is about
density *inside* a trust network — a recommendation from a member beats
broadcast. It says nothing about running two *unrelated* networks in the same
week: film-noir adults and library parents share no feed, and per-`src` tagging
already buys the separation the exclusivity clause was paying four weeks for.
P11's own reasoning also had a flaw worth naming — it picked the wave on
**supply** density (arts/culture is the deck's densest category) to select a
**demand** channel; card count is not audience size, and Film Noir being our
most-opened card means the content works, not that its network is large. The
wave still goes first among Tier 2, on the founder-cost argument: the draft and
the `src` row already exist, so it costs ten minutes and touches no parent.
Founder *hours* stay pointed at the parents wedge (§4 focus is unchanged) —
what changed is that cheap sends no longer wait on expensive ones.

**Channels added the same day (D3/D4):** Nextdoor (`nextdoor`) · Facebook-group
**answer posts** (`fbgroups`) — replies to real "anything this weekend?" threads
with three specific picks and the link as citation, entering through the 16K
group's standing *"free community events are always allowed"* rule and the
public Greenpoint Neighbors group · the **Instagram carousel** (`ig`), moved off
its Oct-6-on-failure trigger · and the physical channel (`market`, `greenline`)
— hand-to-hand and permission-based placement only, since pole and park
postings are illegal per-flyer offences (§10-119; 56 RCNY §1-05(c)). Group
rules, member counts, and the law are in
`docs/launch/2026-08-17-greenpoint-attention-map.md`.

**Acquisition experiments (ranked; all post-launch — Q1/Q2 are wave 1 of the
seeding order in the launch runbook §3; kit rules: Batu sends every message):**

| # | Experiment | Smallest test | Metric & decision rule |
|---|---|---|---|
| Q1 | **Org seeding:** 3 orgs whose events are already on the map get a personal "your events are live here" note + per-org `?src=`. | 3 emails. | Sessions and activation rate per src; an org that shares = a Loop B ignition. Kill an org-type after 2 non-responses. *(2026-08-15: org-type taxonomy — institution / business / volunteer-org — plus the whole-wave-silence branch and the August clock suspension live in the seeding roster; "attribution confirms" for Wave 2 = ≥1 session per sent src within 7 days, a mechanism check, never a performance read.)* |
| Q2 | **Parents-wedge post** in 1–2 parent groups: "every kids/camp thing in Greenpoint this week, verified, on one map," `?src=parents`. | One post. | src=parents sessions + week-2 return (needs R0). Double down only if return beats other srcs. |
| Q3 | **AEO acceptance** (rides 3.6): `curl` acceptance **passed on prod 2026-07-28** (extensionless `/e/<slug>`, no-JS facts, Event JSON-LD); Rich Results manual spot-check open; re-verify on greenpoint.life at cutover. Then watch organic sessions monthly. | Shipped; watch-only. | Organic sessions trend; no kill — owned infrastructure. |

---

## 5. Monetization — sell before, ship after

Full model of record: **`business-model.md`** (adopted 2026-07-28). This section
holds only the growth-side interface; that doc holds the architecture, pricing,
and kill criteria.

Verna's law is PMF → data → growth; monetizing before retention proof optimizes a
leaky bucket. The gate is **reinterpreted, not relaxed: pilot conversations may
start before the gates read; shipping any paid surface waits for the demand
gate.** Conversations cost nothing and take months; a live paid surface
pre-verdict would be optimizing the leaky bucket.

**Status (Batu, 2026-07-28): all monetization decisions are parked** — sole
priority is launch → learn → PMF. The design below stands; nothing in it is
raised for decision or action until demand evidence exists.

- **The model is Verna-shaped:** free product as the growth strategy (Loops A/C),
  revenue on the supply/institution side only after demand is proven to them
  (Loop B). Layers in order: **Founding Pilots → Founding Partners → self-serve
  business layer → spatial intelligence**, each entering through its cheapest
  validated form — the pilot's headline deliverable is the audience-independent
  corridor brief, not presence. **Residents never pay, and coverage is never for
  sale.**
- **The growth engine is the revenue plan's leading indicator.** Weekly returning
  locals prices Layer 1 renewals and all of Layer 2 — this is the tightest
  coupling between the two docs.
- **Distribution is priced into every deal** — no pilot signs without a
  quantified distribution deliverable, framed as a stated fee offset the buyer
  earns, never an extracted obligation. That is a growth channel the engine gets
  for free, and it belongs in the acquisition picture alongside §4's earned
  channels.
- **Free pre-work that is allowed now:** keep logging every business ask and
  submission verbatim (supply-gate evidence *and* pricing evidence), and let
  Q1 note-sends double as demand probes — zero build.

---

## 6. The experiment system

Embedded in the existing weekly loop — no new ceremony:

- **Mon:** ingest + analytics pull refreshes every live experiment's metric.
- **Tue readout:** each live experiment gets one line — *metric, read (pre/post),
  decision per its rule: continue / kill / graduate.* Top-3 proposals may include
  at most one new experiment.
- **Wed–Fri:** approved ships only.

**Rules (Verna's low-traffic discipline):**

1. Every experiment ships with: hypothesis → smallest test → one metric →
   decision rule → **kill criteria written before launch**. No kill criteria, no
   launch.
2a. **Seasonal confound (standing note, 2026-07-28):** September reads ride the
   citywide autumn rebound and pre/post cannot control for it — early-fall lifts
   are labeled "confounded with season" in readouts, and no experiment
   graduates on a Sep–Oct read alone. **Carve-out (ratified 2026-08-15,
   pre-data):** 2a governs *pre/post* reads, per its own rationale;
   contemporaneous-control designs — both arms riding the same weeks, as in
   R1's segment-vs-broadcast and Q2's return-vs-other-srcs — are exempt, and
   "a Sep read" means the data window, not the readout date. Without this,
   every Wave-1 experiment's terminal decision lands in a month whose reads
   the rule disqualifies.
2. **Pre/post and small-n qualitative only.** Five resident conversations are a
   valid instrument. No A/B infrastructure, no significance theater — at our
   traffic it's noise cosplay.
3. **Max 3 live experiments** at once. Attribution dies past that.
4. Micro-optimizations (copy tweaks, button styling, flow shaving) are not
   experiments and don't make the list.
5. Every result — including kills — gets one line in the Tue readout doc;
   durable decisions go to `DECISION_LOG.md`.
6. **Slot & clock hygiene (ratified 2026-08-15; extended by D3, 2026-08-17):**
   Wave-2 channels (reddit / fbgroups / qr / nextdoor / ig / market / greenline)
   extend Q1/Q2's existing slots with per-channel `src`s — they are not
   experiments 4–6. Watch-only, no-kill items (Q3) sit outside the max-3 cap,
   explicitly. Each Q experiment closes at the readout after its decision rule
   fires, or after 4 weeks, whichever comes first — no experiment squats on a
   slot indefinitely. **A send is not an experiment and consumes no slot**
   (it carries its own `src`, so it costs no attribution capacity); neither is
   a product fix that repairs a broken mechanism rather than testing a
   hypothesis (D5's Follow-ask un-gating, header line, install nudge). The
   max-3 cap governs *hypotheses under test*, and it was throttling builds it
   was never written to govern.
7. **No gate between waves on a mechanism already proven (D3, 2026-08-17).**
   The 8/25 Wave-2 gate is deleted: P3's check ("every sent `src` shows ≥1
   session within 7 days") was a plumbing test, and the plumbing was proven by
   friends-family on 8/13. Different `src` values cannot contaminate each
   other — that is what the attribution kit is for. P3's check survives as a
   **readout line**, not a blocker.

**Ownership split:** governed by the operator model and autonomy ladder in §7.
Anything recurring that can't be automated into the Mon/Tue rhythm doesn't ship.

---

## 7. Operator model — semi-autonomous growth under supervision

*(Added 2026-07-27; the agency-control and sensor–policy–tool–learning
frameworks are from the AI-era syntheses in Sources.)* The weekly loop runs as a
**Growth Operator**: a Tuesday cloud routine (`/growth-weekly`, skill at
`.claude/skills/growth-weekly/SKILL.md`) that senses, computes, drafts, and
recommends — mirroring the proven ingest pattern, where **the PR is the review
gate**. Autonomy is earned *per task* through calibration, never granted
wholesale.

**The operator's loop (sensor → policy → tool → learning):**

- **Sensor:** PostHog pull (`./scripts/posthog-pull.sh`), Vercel Web Analytics,
  the R0 `return_visit` baseline, the submission/ask log.
  - **Cloud egress (2026-07-28):** the operator is a *cloud* routine and its only
    sensor host is `us.posthog.com` — which the cloud network-access list didn't
    cover, since that list was built for the ingest roster (DECISION_LOG
    2026-07-28). **Batu added it the same day.** First enabled run still confirms
    the pull returned real numbers: a blocked host fails silently — no data, no
    per-host error — exactly how the 7/27–7/28 ingest outage presented.
- **Policy:** the autonomy ladder below + kit rules — every link copied from
  `docs/launch/channel-links.md`, truth rules, max 3 live experiments.
- **Tool:** deterministic scripts first; model judgment only where a read or a
  draft needs it (same cost architecture as ingest, 2026-07-25).
- **Learning:** every Batu edit to a draft becomes a standing instruction in the
  operator skill — the growth version of "every complaint becomes a test case."
  The Tue readout doc is the weekly calibration record.

**Autonomy ladder** (V1 = suggests options · V2 = drafts complete work for
review · V3 = executes autonomously):

| Task | Level now | Ceiling |
|---|---|---|
| **Content ingest → prod** | **V3 (2026-08-02) — machine-gated auto-ship** | V3 |
| Analytics pull + metric computation | V3 (deterministic scripts) | V3 |
| Experiment reads vs. pre-registered decision rules | V2 — reads land as recommendations | V3 — rules are mechanical once calibrated |
| Tue readout + top-3 proposal drafting | V2 | V3 (drafting only) |
| Outbound copy — digest, org notes, posts | V2 — draft only | V2 — **sending is Batu's, permanently** |
| Instrumentation / growth-edge ships | V2 — PR-gated, TDD | V2 — merge = deploy stays Batu's |
| Kill / graduate verdicts | V1 — recommend only | Batu, permanently |
| New experiments, scope changes, monetization | V1 | Batu, permanently |

**Promotion rule:** a task moves up one level only when (a) three consecutive
cycles shipped without material edit, (b) the action is reversible, and (c) it
stays inside kit + truth rules. Promotion is proposed in a Tue readout and
ratified by Batu — never self-granted. **Demotion is immediate and automatic**
on any truth-rule breach, untagged link, or misread — one strike, one rung down.

**What stays human regardless of calibration:** sends, **code** deploys/merges,
taste gates, kill/graduate/PMF verdicts, and spending money. These aren't
trust-gated — they're the definition of supervision.

**Routine content ships autonomously (Batu, 2026-08-02 — supersedes the
2026-07-28 zero-add/expiry-only promotions):** an ingest run pushes its clean
cards to `main` = prod, adds included. The 2026-07-28 rule gated exactly the
runs that carried value, and the queue it produced left the live feed a week
stale — a staleness cost that exceeds the risk of a wrong card, because a wrong
card is one revert away and a dead feed is a dead product.

**But the gate narrowed rather than vanished, and it is per card.** A card ships
only if a verbatim `sourceQuote` carries its claims and its category follows
mechanically from the source; anything unsourced, ambiguously categorized,
inferred, or source-conflicted is **held in a review PR — never shipped, never
dropped**. Substantiation is enforced in code (schema field + a dated test), so
an unsourced card cannot reach prod even by mistake. Roster/sender additions,
business submissions, code changes, and runs swinging the deck &gt;±40% remain
fully human-gated — trust and judgment calls, not content. The L11 freshness
alarm is the backstop that makes this legible if runs stop shipping.

---

## Staging — when each part of the engine lights up

| Stage | Window | What's lit | What stays dark |
|---|---|---|---|
| 0 — Readiness *(was "Evidence"; checkpoint voided 2026-07-26)* | now → cutover (~Aug 1–8) | R0 baseline collecting · loop-edge repairs (3.1 ✅ · 3.6 ✅ · 3.3 = L5, the last build) · logging business asks verbatim (free pre-work) | All acquisition; every paid surface; all monetization decisions (parked 2026-07-28) |
| 1 — Loops | launch → ~Sep 15 (provisional readout) → ~late Oct (firm verdict, 2 mature cohorts) | Seeding waves (runbook §3) · A1 funnel read in first readouts · R1 · Q1/Q2 · weekly experiment cadence · proof-of-value emails once engagement clears the signal floor · *pilot conversations permitted by design — timing is Batu's, parked until demand evidence* | Every paid surface, new content layers; R2 waits for a returner population |
| 2 — Compound | gates passing (business-model.md §4: demand → paid surfaces; commercial = 3 paid pilots/LOIs) | **Paid surfaces ship** (§5 sequencing) · adjacent audiences · new loops | Geographic expansion until the repeatability gate (business-model.md §5) is met |

**The one thing to do first: L5** — the business submission path. It is the last
unrepaired loop edge (B), the last build before cutover, and the only validation
gate we currently have no instrument for: supply (≥5 proactive actors) can't
be measured while the only way in is Batu's inbox. *(R0, the previous "one
thing," shipped 2026-07-26. A1's funnel read follows in the first post-launch
readouts.)*

## Explicitly not doing

- **Paid acquisition pre-PMF — absolute.** *(Scoped from "ever" 2026-07-28: the
  $0-revenue/user premise changed with the business model; post-PMF only
  sponsor-funded + geo-targeted + Batu-approved, case by case.)*
- A/B testing infrastructure or statistical-significance machinery.
- Social-account grinding, generic SEO/content-marketing blog. *(Narrowed
  2026-07-28: a low-labor 4-week auto-generated-carousel test is an approved
  post-launch experiment candidate — grinding stays banned. P9, ratified
  2026-08-15, gave it a trigger: normal Tuesday proposal when a slot frees, or
  automatically at the first readout on/after Tue Oct 6 if cumulative tagged
  sessions were under 50.* **D3, 2026-08-17: the carousel starts now** —
  `src=ig`. P9 had scheduled the only test of our biggest open question (is a
  website the right container at all? — learning-log Q1, which we ourselves
  labeled as able to invalidate the form, not just a feature) as a consolation
  prize for failure, on a trigger that a merely-mediocre result would have
  suppressed permanently. Its answer is worth most while it can still shape
  September. Grinding stays banned; this is auto-generated from existing cards.)*
- Referral incentives or growth hacks bolted outside the loops.
- Growth hires, agencies, or tools beyond PostHog free tier.
- Shipping any paid surface before the demand gate passes. *(Revised 2026-07-28:
  monetization **conversations** are now allowed pre-verdict — sell before, ship
  after, per §5 and `business-model.md`. What stays banned is a live paid
  surface.)*
- Resident paywalls, selling coverage, or paid placement in news/community
  surfaces — permanently, at any stage. *(Scoped 2026-07-28, `business-model.md`
  §6: voluntary resident support is a dormant post-PMF contingency, not a
  permanent ban; paid acquisition's "never" became "absolute pre-PMF, then only
  sponsor-funded + geo-targeted + Batu-approved" — the $0-revenue/user premise
  was changed by the business model itself; and the social ban narrowed to
  account-*grinding* — a 4-week auto-generated-carousel test is an approved
  post-launch experiment candidate under the max-3 rule.)*
- New content layers (stories/history/routes) before the utility loop proves.
- Geographic expansion before PMF — adjacent-user moves are a post-PMF plateau
  tool, and the hyperlocal focus *is* the moat. *(Post-PMF, expansion is governed
  by `business-model.md` §7's unlock rule. The editorial ban on "Williamsburg
  North" — diluting Greenpoint's product with adjacent-neighborhood content —
  is permanent and separate: serving Williamsburg means its own scoped surface.)*
- Rebranding as a growth lever.
- **Autonomy theater** — token-maxing for its own sake, autonomous outbound
  sends, self-modifying nightly agents. Automation expands one rung at a time
  down §7's ladder, never around the gates; the gates and the measured cost
  discipline (DECISION_LOG 2026-07-25) outrank velocity. *(2026-08-02: content
  ingest reached V3 by this route — the gate was replaced with a stronger
  machine gate, not removed. Removing a gate to go faster is still the ban.)*

## Sources

- Elena Verna, [My 9 Favorite Growth Frameworks](https://www.elenaverna.com/p/my-9-favorite-growth-frameworks) · [Five Laws of Growth](https://www.elenaverna.com/p/five-laws-of-growth)
- Lenny's Podcast: [10 growth tactics that never work](https://www.lennysnewsletter.com/p/10-growth-tactics-that-never-work-elena-verna) · [The new AI growth playbook for 2026](https://www.lennysnewsletter.com/p/the-new-ai-growth-playbook-for-2026-elena-verna) (Lovable)
- NotebookLM syntheses (Batu, read 2026-07-27): *The Evolution of Product,
  Growth, and Work in the AI Era* (agency-control ladder, WoM/organic >50%
  benchmark, one-egg TTV, echo-chamber seeding) · *Operational Blueprint for
  Hyperlocal Content Webapp Launch* (sensor–policy–tool–learning loop,
  eval rigor / complaints-as-test-cases; its 20X token-maxing ethos was
  reviewed and **rejected** — see "Explicitly not doing").
