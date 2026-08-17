# Launch Strategy Review — three independent passes + ground truth (2026-08-17)

Produced the evening before Wave 1's first org send, at Batu's direction ("ensure
we considered all angles for the launch strategy"). Method: three clean-context
passes so no single blind spot survives — (1) a first-principles launch design
**blind to our docs**, (2) an adversarial review of the plan of record judged
solely on speed to an honest PMF signal, (3) outside research on how hyperlocal
products actually reached (or failed to reach) habitual use — plus a live
ground-truth sweep of Greenpoint's attention infrastructure
(`2026-08-17-greenpoint-attention-map.md`) and main-thread code verification of
every load-bearing factual claim. Synthesis in the main thread.

**Status: PROPOSED.** Each decision below (D1–D6) awaits Batu's per-item ruling.
Ratified items get the DECISION_LOG entries drafted at the bottom; rejected ones
stay here as the dated record of the road not taken. Nothing in this doc changes
tonight's sends — the Wave-1 org notes and re-invites go out as drafted in the
seeding roster.

---

## What all three passes agreed on

Three passes, three different jobs, same core diagnosis. Convergence from
independent directions is the strongest evidence this method produces.

1. **The reach math is short of the demand bar by roughly 10×.** Both analytical
   passes ran it independently: 30 weekly returners by late October needs
   500–1,000 local visitors by mid-September (at a generous 3–6% conversion to
   3-of-4-week habit). The planned sends produce ~150–400 sessions. The plan's
   own P9 trigger ("under 50 tagged sessions by Oct 6") is pre-registered for an
   outcome 10× below what its own gate needs — the two numbers were never
   checked against each other. As written, the ~late-Oct read is arithmetically
   pre-determined to miss, and P7/P8 have already pre-labeled the miss as
   uninterpretable.
2. **No hyperlocal product has ever sustained a weekly habit on a bare website.**
   The research pass swept Front Porch Forum, Nextdoor, EveryBlock, Patch, Block
   Club, 6AM City, Citizen, Bklyner, Greenpointers, and more, looking for one
   counterexample. Zero found. Every success had a scheduled send (almost always
   email: FPF 63% read-every-issue; Block Club neighborhood lists open at
   37–48%, ~2× citywide; Nextdoor counted a weekly email open as its core
   activity metric). Every failure lacked one (EveryBlock's own founder: "most
   people get our daily email digest" — the site was the configuration surface).
   Citizen is the limit case both ways: 2M pushes/day built the fastest habit in
   local media, and its engagement machine (loosening alert standards on slow
   days) is the integrity failure our truth rules exist to prevent.
3. **The parents wedge is right; the pace and shape around it are wrong.** The
   blind pass independently chose parents as the focus and the Library as the
   first institution — the seeding roster's instincts hold. It added the
   sharpest version of the moment to own: Friday night/Saturday morning, "free,
   outdoors, under 5, today" — the question Instagram can't answer and a map
   can. The adversarial pass showed the one-network-at-a-time rule is a misread
   of echo-chamber doctrine: the principle is density *inside* a network, not
   temporal exclusivity *between* unrelated ones. Per-`src` tagging already buys
   the separation the rule was paying weeks for.
4. **Physical presence is the cheapest unexploited channel.** All three,
   unprompted: the 8/21 screening, the weekend greenmarkets, the library, a
   printed weekly sheet. FPF's cold start was 400 photocopied flyers;
   Greenpointers' original growth was in-person markets.
5. **Search is an open flank the incumbent abandoned.** Greenpointers' events
   calendar is empty (live-verified 8/17: "no upcoming events," page title stuck
   at 2018–2019) and its weekly roundup carries no Event schema — to search and
   answer engines its listings don't exist as events. Ours already do, and the 7
   organic arrivals converted better than any channel we have. The venue/category
   page backlog parked since July is the follow-through.
6. **The medium question should be answered in weeks, not October.** The weekly
   send is itself the cleanest instrument: opens high + clicks low = they want
   the list, not the site. That's a verdict by mid-September instead of never.

## Verified in the code (main thread, 2026-08-17)

- **The Follow/email ask is invisible to ~90% of visitors.** `postValue.js` is
  lens-only by design (2026-07-30): no active filter → no ask. Only 15 people
  have ever tapped a filter chip. R1's trigger (≥10 signups, ≥1 segmented)
  therefore cannot arm — the list it needs is fed by an ask most visitors never
  see. The fallback footer ask sits below a full feed scroll (Josh, L2026-08-02).
- **The retention sensor undercounts the behavior it exists to measure.**
  `returnVisit.js` is localStorage-only. Safari deletes script-writable storage
  (localStorage included) after ~7 days of browser use without a first-party
  visit — a weekly-cadence product sits exactly on the eviction edge. An iPhone
  user returning on day 8 can re-register as brand-new, forever. Not enumerated
  in `environmental-dependencies.md` (grepped: no ITP/eviction row exists) —
  precisely the class that file exists for.
- **No install path.** `site.webmanifest` is linked; there is no service worker,
  no install nudge, no add-to-home-screen moment anywhere in product or docs.
- **September supply cliff.** `cards.json` 8/17: **zero cards start after Aug
  31**; 26 start Aug 23–31; 26 recurring. The feed naturally fills ~2 weeks out,
  but September's parents story (PTAs, youth sports, fall registration) rides
  roster adds ratified for the **8/24** ingest — the Sep 8 parents post promises
  supply that isn't in the pipeline yet.

## Corrections to the plan of record (facts, no ruling needed)

From the attention map (each live-verified 2026-08-17 unless marked):

- **Williamsburg & Greenpoint BK Parents (7.1K) is dormant — 0 posts/month.**
  One of Q2's two candidate groups is dead. Brooklyn Baby Hui: 10.6K, ~300
  posts/mo, alive. Third option not previously on the list: **Greenpoint Moms,
  5.2K, public.** The Q2 group decision now has data; what remains is which
  group Rana is actually a member of.
- **First day of school is Thu Sep 10** (Labor Day Sep 7 pushes it late), not
  ~Sep 3. Q2's Sep 8 post lands in planning week — timing holds. Parent-teacher
  conference evenings Sep 23/24/30. PS 110 PTA's Instagram alone: 2,006.
- **Pole/lamppost flyering is illegal** (Admin Code §10-119: each flyer a
  separate $75–150 fine; the name on the flyer is the presumed violator) and
  **parks postings need a permit** (56 RCNY §1-05(c)). Any physical play is
  venue-permission placements, hand-to-hand at markets (legal), and The
  Greenline (5,000 free print copies via St. Nicks Alliance — the only confirmed
  print distribution in the neighborhood).
- **SummerStarz 8/21 is the season finale**, not one of a continuing series.
- **Greenpoint & Williamsburg Community Group (16K)** posts a standing rule:
  *"free community events are always allowed"* — a within-rules doorway for a
  weekly what's-on post, distinct from the Sunday self-promo slot. **Greenpoint
  Neighbors! NYC** (7K, public, ~500 posts/mo, no posted rules) is the
  highest-velocity room in the neighborhood.
- **The Lot Radio** (17 Nassau Ave): 308K Instagram followers — the largest
  Greenpoint-located account, absent from every doc. **@omgreenpoint** (19.3K)
  carries "DM to collab" in its bio.
- **Halloween is unclaimed.** Four recurring family events (Town Square's
  parade, Friends of McGolrick's party, PS 31 Fall Fest, PS 110 Fall Carnival)
  have zero published 2026 dates as of 8/17. Greenpointers historically
  publishes its guide Oct 20–24. First verified listing owns the neighborhood's
  biggest family moment — and tonight's Town Square note opens exactly that
  relationship.

---

## The decisions — D1–D6, each awaiting a ruling

### D1 — Re-register the demand bar. ✅ **RATIFIED (Batu, 2026-08-17, pre-Wave-1-data)**

Promoted to `DECISION_LOG.md` (2026-08-17, fifth entry); carriers updated the
same change — `growth-engine.md` §1, `business-model.md` §4, `gtm-state.json`
(gate bar, P1 label, WRL metric role). Open follow-up: the rate's denominator
(twice-visiting locals) is not yet derived — Tuesday's readout adds the query.

**Recommendation: yes.** Split the two jobs the number 30 is doing. Keep **30
weekly returning locals** as the business-viability line (it anchors Layer-1/2
pricing — that role is real and stays). Make the **PMF gate a rate with a
floor**: *of locals who visit twice, ≥25% return in ≥3 of any 4 consecutive
weeks, floor 12 people.* Readable at the traffic we can actually produce.
Two amendments ride along:

- **Drop "majority unprompted" from the gate clause** (keep organic share as a
  watched line, per P1's mechanics). Continuous seeding — which the reach math
  requires — makes the clause permanently false; a clause that cannot be true
  while you execute the plan is a lock, not a bar. P1's contamination *label*
  stays for the organic-share line.
- **Define what counts as a return.** If the Monday send ships (D2), a tagged
  email click is a deliberate weekly act of use; site-only counting would
  measure the container, not the habit — the medium question hiding inside the
  metric. Recommended: a `?src=digest`/`follow-*` click counts as a return;
  site-direct returns stay their own line.

*Why now:* pre-registration doctrine forbids amending a bar mid-data. Wave-1 org
data starts existing tonight. The 8/15 reviews used this same window ("while
pre-data ratification was still legitimate"); this is its last hour. Nowhere in
any doc is 30 derived (business-model H8 — derive N from renewal economics — is
still open), so the number being re-formed was itself never derived.

*Cost/risk:* a softer-looking gate. Mitigation: both numbers stay in every
readout — the rate gate for the product verdict, distance-to-30 for the business
line. Moving a pre-registered bar is exactly what pre-registration forbids
mid-data; that is why the ruling has tonight's deadline, and why a "no" tonight
is a real "no" until the next clean window (there isn't one before the verdict).

### D2 — Start the weekly Monday send, first send Mon Aug 24.

**Recommendation: yes.** This is an un-gating, not a full reversal: the digest
already survives in the plan as R1's control arm (`?src=digest`); it is trapped
behind a trigger that D-verified code makes unreachable. Change: send weekly to
the whole list (4 people today; that's fine — FPF started with 25 households),
drafted by the Monday routine, **sent by Batu** (§7 unchanged). Follow stays the
CTA; R1's segment-vs-broadcast comparison begins whenever a segment exists;
R1's 3-week clock still starts per P5.

*Why:* finding 2 above — the entire record, unanimous, successes and failures
both. The 2026-07-28 retirement was reasoned from positioning (push-moment vs.
index; competes with Greenpointers) and from send-cost; the evidence went the
other way, and the competing roundup was dormant for four years until March.
The send-cost strike is real and answered: ~15 founder-minutes/week at this
list size, already budgeted as R1's control in the plan's own design. The
manufactures-the-metric strike is answered by D1's return definition (email
clicks counted, labeled, separable).

*Format (from the blind pass):* three hand-picked things with one line each on
why, then "the other 60 are on the map" + link. High-open, click-preserving.
**Density floor (from the research pass):* if a week is thin, skip it rather
than send it — a thin send teaches people the product is thin (the anti-Citizen
rule).

*Cost/risk:* permanent weekly founder-minutes; an email list to maintain. Both
small at current n; revisit if the list clears ~200.

### D3 — Fire reach in parallel this week; delete the 8/25 gate.

**Recommendation: yes.** Tonight/tomorrow unchanged (Town Square, Library,
Brooklyn Craft, re-invites, Perri). Add, all tagged, all this week:

- **Film Noir note** (draft ready, `src=org-film-noir`) and the arts wave —
  amends P11's "when Q1 closes" trigger. Ten minutes; touches no parent.
- **Nextdoor post** (own `src` row).
- **Facebook groups, as answers not link-drops:** reply to real "anything this
  weekend?" threads with three specific picks and the link as citation; the 16K
  group's free-community-events rule and the public Greenpoint Neighbors group
  are the entry points. 3–4 per week, rules read first — a ban kills the
  channel.
- **The Instagram carousel now, not Oct 6** — amends P9's trigger from
  "consolation prize on failure" to "run the medium test while its answer can
  still shape September." Auto-generated from cards; own `src`.
- **Delete the Aug 25 Wave-2 gate** (amends P3's role): the mechanism check it
  performs was passed by friends-family on 8/13 — the plan's own milestone
  record says so. Different `src` values cannot contaminate each other; that is
  what the attribution kit is for. P3's ≥1-session-per-src check still runs at
  the 8/25 readout as a *readout line*, it just no longer blocks anything.

*Where the founder-hours stay:* parents. The cheap sends above are minutes each;
the concentrated effort (physical, groups, the send's editorial voice) keeps
pointing at the wedge. Echo-chamber density principle retained; temporal
exclusivity clause dropped.

*Cost/risk:* more balls in the air in readout week; P6's mid-wave no-read
instruction already covers it. The real risk is founder time — see D-hours note
at the bottom.

### D4 — Physical presence, legal version.

**Recommendation: yes.** (a) **Be at the SummerStarz finale Thu 8/21** — the
largest gathering of the exact wedge audience this month, run by the org
receiving tonight's note; twenty conversations with strangers beats every email
in Wave 1 for signal. (b) **One market morning this weekend** (McCarren
Greenmarket Sat 8–3 / McGolrick Sun 9–2, both year-round), printed sheets in
hand — hand-to-hand is legal; poles are not. (c) **Printed weekly sheet** =
the `/week` route from D5, offered to venues/library/YMCA as *their* programming
featured — permission-based placement only. (d) **Contact The Greenline**
(greenline@stnicksalliance.org) about the September issue — 5,000 print copies
reach the non-digital residents no channel above touches.

*Cost/risk:* founder hours (the largest single line: ~4–5h/week). R3's five
warm-user conversations — a standing instrument with no date since July — gets
its dates from (a) and (b) for free.

### D5 — Product week: the return mechanisms and the measurement repairs.

**Recommendation: yes.** All small, all backend-free except one flagged item;
each TDD'd; ship on a branch, preview, then merge per the design-batch rule.

Return mechanisms:
1. **Follow ask visible without a lens** — derive the object from what's on
   screen; add the ask to the card-open surface where the 14 people who act
   already are. (Directly un-blocks R1's trigger.)
2. **"New every Monday" in the header** — a no-push product earns return by
   publishing its schedule, like a paper. One line.
3. **Home-screen install nudge, second visit** — dismissible, device-local
   flag, same pattern as `firstVisitOrientation.js`. The app substitute; also
   exempts installed users from Safari's eviction.
4. **`/week` build-time route** — the current week, inked identity, printable
   and screenshottable, QR to the live map. One build serves three channels
   (print, group-chat screenshot, IG story).
5. **Email ask on `/e/<slug>` deep-link landings** — the highest-intent traffic
   (search + shares) currently lands on the worst-converting surface.

Measurement repairs:
6. **Verify the Safari eviction on a real iPhone**, then add the ITP row to
   `environmental-dependencies.md` (same-change rule).
7. **Mirror `gl_first_seen` into a server-set cookie** via Vercel routing
   middleware — server-set cookies aren't subject to the script-storage cap.
   **Flag: this is the one exception to no-backend** (config-level code, no
   storage, no accounts). Explicitly Batu's call within this ruling.
8. **FB webview check on real iOS + Android** (Q2 precondition 3, still open,
   ~1 hour) + its dependencies row.

*Cost/risk:* a few days of build during launch week. Items 1–5 are the "missing
product" all three passes converged on; 6–8 make October's numbers mean
something on iPhones.

### D6 — Pull September supply forward.

**Recommendation: yes.** The roster adds ratified 8/15 for the 8/24 ingest
(PS 110/34/31 PTAs, GWYSL, Play Lab, GAMA, Artudio, St. Stans Academy, NY
Society of Play entry) move to **this week's ingest** — approval already
happened, only the date moves. Add a fall-registration and Halloween hunt to
the next two runs: the four unclaimed Halloween events above are the October
prize, and the Sep 8 post must land on a full feed (zero September cards exist
today). Under-the-K's fall concerts (CBGB Festival Sep 26, Tove Lo, The
Prodigy) and the Open Streets Bedford Ave weekends are in-window supply for the
arts lens the moment D3 opens that channel.

*Cost/risk:* none beyond ingest capacity; the sources were already approved.

---

## Held deliberately (no ruling sought)

- **Paid reach as a measurement instrument.** The adversarial pass argued for a
  capped, one-off, geo-fenced buy to purchase the denominator. Held: the free
  channels above are unexploited; buying reach before exhausting them answers a
  question we haven't earned yet. **Revisit ~Sep 15** if cumulative tagged local
  sessions are under ~300.
- **Greenpointers.** Approach as a *source-tip relationship* (their form takes
  submissions; send the verified weekly list to their tips inbox, no ask), not
  a pitch and not an embed offer. The research pass: becoming a cited source
  beats becoming infrastructure. Existing hold on the embed-swap play stands.

## The founder-hours line, named plainly

The full slate above asks **~12–15 hours/week of Batu through mid-September**
(sends ~2h, groups ~3h, physical ~4–5h, the weekly send ~1h, conversations
~2h). The research pass's most repeated failure pattern was the solo operator
burning out before the curve turned; its earliest warning sign is a skipped
week. If the budget is really 8 hours, the cut order is: fewer group-answer
posts, one market morning instead of two, D4(d) deferred — decided now, not
discovered in week 5.

---

## Proposed DECISION_LOG entries (promoted per ruling)

> **2026-08-17 — Demand gate re-registered as rate + floor; return definition set** *(if D1)*
> Decision (Batu, pre-Wave-1-data). The PMF demand gate becomes: of locals who
> visit twice, ≥25% return in ≥3 of any 4 consecutive weeks, floor 12 people.
> 30 WRL stays as the business-viability line in every readout. "Majority
> unprompted" leaves the gate clause; organic share stays a watched line under
> P1's label. A tagged email click counts as a return; site-direct returns
> reported separately. Rationale: the reach math (this doc §1) made the old bar
> unreadable by its own verdict date, and 30 was never derived (H8 open).

> **2026-08-17 — Weekly Monday send un-gated; digest is the retention spine** *(if D2)*
> Decision (Batu). The Monday digest sends weekly to the full list from Aug 24,
> drafted by the routine, sent by Batu, with a density floor (thin week = skip,
> never send thin). Follow remains the CTA; R1's comparison arms per P5 when a
> segment exists. Amends the 2026-07-28 digest retirement: the positioning
> argument lost to the unanimous empirical record (strategy review §2); the
> metric-manufacture concern is answered by the return definition (D1).

> **2026-08-17 — Wave gates deleted; channels parallelized** *(if D3)*
> Decision (Batu). The 8/25 Wave-2 gate is removed (P3's check becomes a
> readout line — its mechanism was proven 8/13). P11's temporal exclusivity
> ("never two networks at once") is dropped; echo-chamber density inside a
> network stands. P9's carousel trigger moves from Oct 6-on-failure to now.
> Film Noir + arts notes, Nextdoor, FB-group answer posts, and the carousel all
> fire the week of 8/17, each on its own src.

> **2026-08-17 — Physical channel opened, legal-only** *(if D4)*
> Decision (Batu). In-person presence (SummerStarz finale, market mornings,
> permission-based sheet placements, The Greenline) becomes a standing channel.
> No pole/park flyering ever (§10-119; 56 RCNY §1-05(c)) — the attention map
> holds the law. R3's conversations ride these dates.

> **2026-08-17 — Return mechanisms + measurement repairs shipped** *(if D5)*
> Decision (Batu). Follow ask un-gated from lens state; "New every Monday"
> header; home-screen nudge; /week route; deep-link email ask; Safari-eviction
> row + server-set cookie mirror (the sole no-backend exception, config-level);
> FB webview verified. Each TDD, branch-preview-merge.

> **2026-08-17 — September supply pulled forward** *(if D6)*
> Decision (Batu). The 8/15-ratified roster adds enter this week's ingest
> instead of 8/24; fall-registration + Halloween sweeps added to the next two
> runs. First verified Halloween listings are the October family prize.
