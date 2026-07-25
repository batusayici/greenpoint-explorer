# Decision Log

## Current Use Note

This is a historical decision log. Older entries may contain status language that was current on the entry date only; use the source-of-truth order in `AGENTS.md` for current execution authority. Entries dated before 2026-07-22 that frame the 3D isometric explorer as the product describe the parked track — see the 2026-07-22 entry.

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
4. **Business-model sequencing (post-validation, not built now):** never charge individual small businesses first — sponsored campaign maps → partner tooling for SSG/Greenpointers → featured action cards paid only after evidence of clicks/signups/turnout.
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
