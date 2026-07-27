# Greenpoint Life — Launch Plan (2026-07-27)

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
| L5 | Business submission path (ops plan 3.3) | ⬜ not built | Tally form + pinned CTA card + `submit_tap` event; joins Monday review queue |
| L6 | De-July (by Aug 1) | ✅ shipped 2026-07-27 | `cards.json` rename + evergreen meta description + skill migration note. Internal identifiers (`JulyApp.jsx`, `.july-*` CSS, `julyCards.test.mjs`) left as-is; `july-postvalue-done` key must not be renamed |
| L7 | Domain cutover mechanics | ⬜ open | See §2 |
| L8 | Growth Operator live | ⬜ this pass | `/growth-weekly` skill + Tuesday routine (§4) |
| L9 | R0 retention baseline | ✅ collecting since 2026-07-26 | — |

L5 is the only build left before cutover (L6 shipped 2026-07-27). Feature freeze holds (2026-07-26:
no new features before launch; community-alert banner was the one scoped exception).

## 2. Cutover sequence (T-0 — the launch moment)

1. **Pre-flight (T-1):** L1–L6 all green; Monday ingest merged so the feed is
   fresh on launch day; `npm test` + `npm run build` green on main.
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

## 4. Weeks 1–2 — the loop lights up

- **Cadence:** Mon ingest (cloud routines, unchanged) → **Tue Growth Operator
  routine** drafts the readout PR (§5) → Batu merges/edits → Wed–Fri approved
  ships only.
- **Experiments (max 3 live — growth-engine §6):** light **R1 weekly digest**
  (first Monday post-launch, `src=digest`), **Q1**, **Q2**. R2 ("new this week"
  marker) waits for a returner population; A1 funnel read happens inside the
  first readouts (analysis, not an experiment slot).
- **Metrics watched weekly:** WRL via R0 (`return_visit`) · activation proxy
  (≥2 `card_open` + 1 high-intent act, first session) · per-`src` sessions and
  week-2 return · organic share of new sessions (the >50% WoM signal, monthly
  read) · supply-side submissions/asks (L5).
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
