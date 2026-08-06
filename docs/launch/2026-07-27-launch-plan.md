# Greenpoint Life — Launch Plan (2026-07-27)

> **Naming superseded 2026-08-06:** the product is now **Stoopwise Greenpoint** on
> `stoopwise.com` (DECISION_LOG 2026-08-06). The L7 cutover recorded below shipped
> to `greenpoint.life`, which is now a redirecting legacy origin. Names and URLs
> below are left as written — dated record, not current state.

Runbook of record for the launch. Extends the PMF ops plan
(`2026-07-21-pmf-ops-plan.md`, Phase 3) into an executable sequence and wires in
the Growth Operator (`docs/growth/growth-engine.md` §7). **Launch = the
greenpoint.life domain cutover** (DECISION_LOG 2026-07-26), target ~Aug 1–8.
Every gate below is unchanged: PR merge = review + deploy; Batu sends every
outbound message; truth rules and II-C palette are non-negotiable.

## 1. Readiness gate (status as of 2026-07-27)

| # | Item | Status | Remaining |
|---|---|---|---|
| L1 | Attribution kit — canonical tagged links | ✅ `channel-links.md` (2026-07-26) | Regenerate every row at cutover (origin changes) |
| L2 | OG tags + `/e/<slug>` deep links | ✅ shipped (og.png LFS fix 2026-07-26) | — |
| L3 | AEO surface (prerender, JSON-LD, sitemap/RSS/ICS/llms.txt) | ✅ shipped 2026-07-26; **prod acceptance passed 2026-07-27** — extensionless `/e/<slug>` resolves without a trailing slash, no-JS `curl` returns per-card title + venue + address, and dated cards carry valid `schema.org/Event` JSON-LD (name/startDate/location+geo). 40 of 93 pages carry Event schema — correct by design: undated place/news cards are not Events and must not claim a date | Google Rich Results test is a manual browser step (not scriptable) — still worth one spot-check. Re-verify on the new origin at cutover |
| L4 | Error monitoring (hard gate) | ✅ PostHog exception autocapture verified; alert emails confirmed on (Issue assigned + Error tracking weekly digest, Default project scoped) | — |
| L5 | Business submission path (ops plan 3.3) | ✅ **complete 2026-07-29** | Feed-end supply row + empty-state echo (chrome, not a card), `submit_tap` live, Monday-run "asks" step in the ingest skill. Form live: **"Add your event"** (`aQXzOB`) — name · what's happening · email + hidden `ref`, wired into `SUBMIT_FORM_URL` and `tally-pull.mjs`, capture verified by test submission |
| L6 | De-July (by Aug 1) | ✅ shipped 2026-07-27 | `cards.json` rename + evergreen meta description + skill migration note. Internal identifiers (`JulyApp.jsx`, `.july-*` CSS, `julyCards.test.mjs`) left as-is; `july-postvalue-done` key must not be renamed |
| L7 | Domain cutover mechanics | ✅ shipped 2026-08-02 | `AEO_ORIGIN` flipped to `https://greenpoint.life`; apex made primary in Vercel (`www` 308s to apex, not the reverse); vercel.app kept serving as rollback. Prod-verified: `/e/<slug>` curl, sitemap/RSS/ICS/llms.txt, canonical + JSON-LD on new origin, `?src=` survives the `www`→apex hop. `channel-links.md` rows still need regenerating on the new origin |
| L8 | Growth Operator live | ✅ confirmed 2026-08-02 | `greenpoint-tuesday-growth-readout` routine (`trig_01RWSr6yE5tsPuv5EzpZCjYq`) is enabled, Tuesdays 9:30 ET — proven end to end 2026-07-28 (real PostHog pull, merged readout). SKILL.md's "disabled until Batu enables" line is stale, now corrected. A fresh cycle was triggered manually post-L7-cutover to validate the pipeline on the new origin |
| L9 | R0 retention baseline | ✅ collecting since 2026-07-26 | — |
| L10 | Per-card correction link + SLA (pressure-test fatal #1) | ✅ shipped 2026-07-28, **fixed 2026-07-29** | "Report an error" per card (`correctionHref`) live; SLA in AGENTS.md (ack <24h, unpublish-first). 2026-07-29: the form had **no hidden field**, so the prefilled `?card=` was being dropped — added and verified, so a report now names its card |
| L11 | Feed-freshness alarm + verified-through line (pressure-test fatal #2) | ✅ shipped 2026-07-28 | `check-freshness.mjs` in the build (`--stamp` mode, never blocks a corrective deploy) + banner "verified through <date>" degradation live. Remaining: wire the ops-mode check (exit-1 on stale/thin) into a scheduled runner — rides the growth-weekly Monday pull (L8) |

**All builds are shipped, and L1–L11 are all closed** (L5 landed 2026-07-28; the Follow resident CTA landed 2026-07-29 — DECISION_LOG. Two Tally items ride on Batu: the ultra-light **submission** form (L5) and the **Follow segment question** on the signup form, which is R1's zero-build test — growth-engine §2. L7 cutover shipped 2026-08-02; L8 confirmed live same day). Feature
freeze holds (2026-07-26: no new features before launch; the community-alert banner was the one scoped
exception, and L10/L11 were error-monitoring-class launch-readiness items granted the same class of
exception 2026-07-28 — they protect the "verified" promise, they don't add features).

## 2. Cutover sequence (T-0 — the launch moment)

1. **Pre-flight (T-1):** every L-item green (L1–L11; L5's Tally form swap and
   L7/L8 are the open ones);
   Monday ingest merged so the feed is fresh on launch day — and the
   verified-through banner (L11) confirms it; `npm test` + `npm run build`
   green on main.
2. **Wire the domain:** add greenpoint.life to the Vercel project (apex + www);
   keep greenpoint-explorer.vercel.app serving (it's the rollback and the live
   invite-link target — `/july.html` redirect must keep working).
3. **Origin flip:** `AEO_ORIGIN` in `src/demand-test/aeo.js` → `https://greenpoint.life`
   (ops plan 3.6); regenerate every `channel-links.md` row on the new origin.
4. **Deploy** (Batu-approved, as always).
5. **Verify (evidence before assertions):**
   - `curl` (no JS) of a prod `https://greenpoint.life/e/<slug>` returns
     name/date/venue; sitemap/RSS/ICS/llms.txt resolve on the new origin.
   - JSON-LD passes Google's Rich Results test.
   - Visit with `?src=verify` → event lands in PostHog with `src` intact on the
     new domain; `$exception` pipeline still flowing.
   - Old-domain deep link with query params still redirects and preserves them.
6. **Rollback path:** the cutover is DNS + config, not a rewrite — if broken,
   remove the domain (or repoint), revert the `AEO_ORIGIN` commit, redeploy;
   vercel.app keeps serving throughout. No data at risk.

## 3. Seeding waves (post-verify; all sends by Batu, links copied from `channel-links.md`)

Echo-chamber order — saturate small trust networks before broadcast
(growth-engine §4): a messenger inside the network beats reach.

- **Wave 1 (launch day → +2d) — trust networks:**
  - **Q1 org seeding:** personal "your events are live here" notes to 3 orgs
    already on the map, per-org `?src=` rows added first.
  - **Q2 parents wedge:** one post in 1–2 parent groups — "every kids/camp thing
    in Greenpoint this week, verified, on one map" (`?src=parents` row added).
  - Warm re-invites (Michael, Laura & Edmond, Perri) with their existing `src` rows.
- **Wave 2 (+3–7d, only after Wave 1 attribution confirms in PostHog):**
  Reddit (`src=reddit`) + local FB/WhatsApp groups (`src=fbgroups`) · II-C QR
  window cards (`src=qr`) offered first to businesses already on the map.
- **Held deliberately:** Greenpointers pitch (`src=gpters`) and further Shop
  Small amplification — a later, bigger card to play once retention data exists.
  When played, the Greenpointers offer is the **"on the map this week" embed
  swap** (traffic + content to them, distribution to us — business-model.md §4,
  hypothesis H4): we approach as structurally non-competing (they curate, we
  index), never as a rival pitching coverage.

## 4. Weeks 1–2 — the loop lights up

- **Cadence:** Mon ingest (cloud routines, unchanged) → **Tue Growth Operator
  routine** drafts the readout PR (§5) → Batu merges/edits → Wed–Fri approved
  ships only.
- **Experiments (max 3 live — growth-engine §6):** light **R1 Follow**
  (personalized alert vs. broadcast digest, first Monday post-launch;
  `src=follow-<lens>` treatment against the `src=digest` control — restructured
  2026-07-28, growth-engine §0/§2), **Q1**, **Q2**. R2 ("new this week"
  marker) waits for a returner population; A1 funnel read happens inside the
  first readouts (analysis, not an experiment slot).
- **Metrics watched weekly:** WRL via R0 (`return_visit`) · activation proxy
  (≥2 `card_open` + 1 high-intent act, first session) · per-`src` sessions and
  week-2 return · organic share of new sessions (the >50% WoM signal, monthly
  read) · supply-side submissions/asks (L5) · **feed density** (dated in-window
  items + roster yield share — the supply-side leading indicator, growth-engine
  §1) · **unique-coverage count** (items no other Greenpoint source carried —
  the differentiation proof, growth-engine §1).
- **Kill rules are pre-registered** in growth-engine §2–4; the operator computes
  the reads, Batu owns every verdict.

## 5. Operating model — who runs what

The **Growth Operator** (growth-engine §7) is a Tuesday cloud routine invoking
`/growth-weekly` (`.claude/skills/growth-weekly/SKILL.md`): pulls analytics,
computes each live experiment's read against its pre-registered rule, drafts the
readout + top-3 proposals + any outbound copy, and opens a PR on
`growth/readout-<date>`. **Merging is the only way its output becomes real.**
It starts at V1/V2 autonomy everywhere; sends, deploys, and verdicts are Batu's
permanently. Promotion/demotion per the §7 ladder.

## 6. Proposed DECISION_LOG entry (promoted on approval of this plan)

> **2026-07-27 — Growth Operator adopted; launch plan of record**
> Decision (Batu). (1) The weekly growth loop runs as a semi-autonomous Growth
> Operator — `/growth-weekly` skill + Tuesday cloud routine on the ingest
> pattern, PR = review gate — governed by the autonomy ladder added as
> growth-engine §7 (V1/V2 start; sends/deploys/verdicts stay Batu's permanently;
> promotion only after 3 clean cycles, demotion immediate on any breach).
> (2) `docs/launch/2026-07-27-launch-plan.md` is the launch runbook of record:
> launch = domain cutover, echo-chamber seeding order, R1/Q1/Q2 as the first
> experiment slate. (3) Growth engine gains the organic->50% word-of-mouth
> confirming signal, the one-egg activation rule, and echo-chamber targeting;
> the 20X token-maxing ethos from the same sources is explicitly rejected.
> Owner: Batu.
