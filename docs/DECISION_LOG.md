# Decision Log

## Current Use Note

This is a historical decision log. Older entries may contain status language that was current on the entry date only; use the source-of-truth order in `AGENTS.md` for current execution authority. Entries dated before 2026-07-22 that frame the 3D isometric explorer as the product describe the parked track — see the 2026-07-22 entry.

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
