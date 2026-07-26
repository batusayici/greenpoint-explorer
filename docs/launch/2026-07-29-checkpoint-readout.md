# Friends-Round Readout (formerly the Jul 29 checkpoint — gate voided 2026-07-26)

> **Status (DECISION_LOG 2026-07-26):** the Jul 15 wave was a friends feedback round — a handful of parent friends, some of whom never opened the app — not a launch, so this gate is **voided because the exposure never happened, not because results disappointed**. The data below stands as the qualitative + instrumentation record of that round; the success bar is retired unscored. Jul 29 becomes a launch-readiness review (ops plan Phase 3, the launch track). The pre-registration discipline itself carries forward to the real launch bar.

Pre-registered 2026-07-21 (before looking at results), against the success bar in `2026-07-15-limited-launch-kit.md`. Ops context: `2026-07-21-pmf-ops-plan.md`.

## Success bar (pre-registered — do not move after seeing data)

| # | Criterion | Threshold | How measured | Result | Pass? |
|---|---|---|---|---|---|
| 1 | Weekly-check intent | ≥5 people | Replies to Batu + feedback-form free text saying they'd check a weekly version | — | — |
| 2 | Post-value signups | ≥3 | Tally responses in the postvalue window, cross-checked against `cta_tap {placement: "postvalue"}` count | — | — |
| 3 | Businesses ask in | ≥2 | Feedback form + direct messages from business owners asking to be included | — | — |
| 4 | Unprompted share | ≥1 | `src`-less visit spike, a forwarded link someone tells us about, or an observed repost | — | — |
| 5 | Content-type ranking | clear ranking | `card_open` + `action_tap` by category; `filter_tap` by filter (events / clubs_signups / deals / news) | — | — |
| 6 | Qualitative signal | messages say something | Feedback volume + what it actually says | — | — |

**Measurement caveats (known going in):**
- **Instrumentation gap (found 2026-07-21): Vercel Web Analytics was never enabled on the project** (`web_analytics_not_enabled` from the REST API) — no pageviews or custom events were collected Jul 15–21 and that window is unrecoverable. Quantitative sections below can only cover the days after collection starts — **Batu enabled the toggle 2026-07-21**, so the usable pageview window is ~Jul 21 → Jul 28. Criterion 2 falls back to Tally-response classification alone; criterion 5 ranks from the partial window + Tally + qualitative mentions, flagged as partial. Fix path + transport decision: ops plan 1.1/1.2.
- Custom events additionally require a **Pro** team (Hobby drops `track()` calls entirely); the free alternative is exercising the `trackEvents.js` vendor seam (built for exactly this, 2026-07-03 decision).
- Dedicated feedback form **wired 2026-07-21** (`FEEDBACK_FORM_URL` → tally.so/r/LZqEj1, commit c610f67) — from then on, feedback and signups land in separate Tally forms. Responses **before Jul 21** are conflated in the signup Tally (`44daZo`): classify those manually (email-only → signup; free-text → feedback). `cta_tap.placement` vs `feedback_tap` separates *taps* cleanly (once events collect).
- Criterion 4 (`src`-less visits) can include people who stripped the param; treat a spike as signal, a trickle as noise.
- Retention is deliberately NOT scored at this scale (2026-07-15 decision).

**Data pull method (once collecting):** pageviews/visits via REST `GET api.vercel.com/v1/query/web-analytics/visits/…` or `npx vercel@latest metrics vercel.analytics_pageview.count` (CLI ≥ Jun 2026). Custom events: per the transport decision (PostHog query UI/API, or Vercel events REST if Pro). Tally: CSV export from the dashboard. The Vercel MCP has no analytics tools — not part of this path.

## Dress rehearsal (2026-07-26) — what's ready, what's blocked

Run 2 days early on purpose (the Jul 21 lesson: instrumentation gaps found late are unrecoverable). **The success bar above is untouched.**

**Ready / already pulled:**
- **Pageviews: 69 total** via `vercel metrics vercel.analytics_pageview.count`. A 14-day pull returns the *same* 69 as the 7-day pull — empirical confirmation that nothing was collected before ~Jul 21 and the usable window is **Jul 21 → Jul 28**. Peak 11 in a 4h bucket on Jul 23.
- **Event transport verified live in production 2026-07-26**: PostHog initialized on the deployed site (server-side config round-trip present) and two event POSTs to `us.i.posthog.com/i/v0/e/` completed. R0's keys (`gl_first_seen`, `gl_visit_count`, `gl_session_seen`) are written in prod, and the session mark correctly kept a reload from inflating the count. *Not yet confirmed at name level* — see blockers.

**Resolved during the rehearsal:** PostHog read access now exists — a scoped personal key (`query:read`, Default project only) is in `.env.local` as `POSTHOG_READ_KEY` (+ `POSTHOG_PROJECT_ID`), deliberately *not* `VITE_`-prefixed so it can never be inlined into the client bundle. Pull script: `scripts/posthog-pull.sh`. All quantitative tables below are now filled from live data through **2026-07-26** (partial — rerun on Jul 28/29). `return_visit` is confirmed firing by name with `visitCount` + `weekIndex`.

**Tally pulls automated 2026-07-26** (`scripts/tally-pull.mjs`, `TALLY_API_KEY` in `.env.local` — user-scoped full-permission key, GET-only script, never `VITE_`-prefixed). Live pull, all-time: signup form 18 visits → 2 starts → 2 completions (one dated **Jul 10, pre-launch**; one Jul 16 — so 1 in-window), business free-text answered 0/2; feedback form 2 visits → 0 starts. Referrer check: 100% of real traffic is `$direct` with no referring domain — channel attribution for this window is confirmed unrecoverable (Finding 1 closed).

### 🔴 Finding 1 — channel attribution never worked; criterion 4 is unscoreable as written

**Only 4 people ever carried a `src` property, and all four values are test tags** (`verify`, `test`, `test31`, `posthog-verify` — ours). The other **16 real people fired 573 custom events with no `src` at all.**

The mechanism is fine (the test tags prove tagging works end to end) — the **real invite links went out untagged**. Consequences:
- The Channels table cannot be filled for `wave1` / `michael` / `laura-edmond` / `perri`. Per-channel comparison is gone for this window and is not recoverable.
- **Criterion 4 ("`src`-less visit spike" = unprompted share) has no contrast to measure against** — 100% of real traffic is `src`-less, so a share is indistinguishable from an invite. It must be scored from qualitative evidence only (someone reporting a forward, an observed repost), and that limitation is a measurement failure, not a product failure. Do not read "no spike" as "no sharing."
- **Fix before any Phase 3 outreach:** every link Batu sends carries `?src=`, and the QR card gets `?src=qr`. Worth a pre-send checklist item — this is the second consecutive checkpoint degraded by an instrumentation gap.

### 🟡 Finding 2 — content ranking spans two taxonomies

The 2026-07-25 IA re-cut landed mid-window, so `filter_tap` carries **both** old ids (`events`, `services`, `clubs_signups`, `deals`, `g_train`, `new`) and new lenses. Tables below are split by era; neither era alone has enough taps for a confident ranking, so criterion 5 should be read as a directional signal. (Old ids still appear after Jul 25 — cached JS on returning sessions.) Criterion 5's named filters no longer exist; the threshold ("clear ranking") is untouched.

## Funnel (all traffic, Jul 15 → Jul 28)

Live data through 2026-07-26 (partial). Test traffic (`verify`/`test`/`test31`/`posthog-verify`) excluded. "People" = distinct cookieless ids, so one person on two devices counts twice.

| Stage | Event | Taps | People |
|---|---|---|---|
| Visits | `$pageview` | 77 | **19** |
| Engaged | `card_open` | 156 | **12** |
| Pin interaction | `pin_tap` | 102 | 6 |
| Filtered | `filter_tap` | 268 | 13 |
| Acted | `action_tap` | 17 | 6 |
| Today lens | `today_toggle` | 15 | 5 |
| Committed | `cta_tap` postvalue / footer | 2 / 2 | 2 / 2 |
| Fed back | `feedback_tap` | 1 | 1 |
| Graph traversal | `related_tap` / `source_tap` | 9 / 0 | 2 / 0 |
| Retention sensor | `return_visit` | 3 | 2 |

**Activation funnel: 19 visitors → 12 opened a card (63%) → 10 took an action (53%).** Engagement per engaged person is high (156 card opens across 12 people ≈ 13 each; 268 filter taps across 13). Reads as a small, genuinely engaged group rather than a large, bouncing one.

**Cross-check:** Vercel Web Analytics reports 69 pageviews vs PostHog's 77 — expected drift (different windows, ad-blocker behaviour, and PostHog's SPA pageview handling). Neither is wrong; use PostHog for event-level work and treat the ~10% gap as noise.

**Retention (early, do not over-read — window is 5 days and criterion says retention is not scored at this scale):** of 24 distinct ids, **7 returned on a second day and 1 on a third** — roughly a third came back at least once. `return_visit` already recorded a `visitCount: 2`. Encouraging, but the window is far too short to call it a habit.

## Channels (`?src=`)

**Not fillable — see Finding 1.** No real visitor carried a `src` tag.

| Channel | People | Custom events | Notes |
|---|---|---|---|
| wave1 / michael / laura-edmond / perri | **0** | **0** | invite links went out untagged — attribution lost for this window |
| (no `src` property) | **16** | **573** | all real traffic |
| test tags (`verify`/`test`/`test31`/`posthog-verify`) | 4 | 6 | ours; excluded everywhere else |

## Content-type pull

`filter_tap` counts, split by taxonomy era (Finding 2). "cards" = supply denominator on 2026-07-26 (109 cards; cards carry multiple lenses). `all` excluded from ranking.

**New taxonomy (Jul 25 → 26, 9 lenses):**

| Lens | cards | filter_tap | people | Rank |
|---|---|---|---|---|
| News | 19 | 15 | 4 | 1 |
| Arts & Culture | 26 | 13 | 3 | 2= |
| Community | 11 | 13 | 3 | 2= |
| Family & Kids | 17 | 13 | 5 | 2= (widest reach) |
| Food & Drink | 21 | 8 | 3 | 5 |
| Shopping | 5 | 7 | 2 | 6 |
| Live Music | 28 | 6 | 4 | 7 |
| Wellness | 5 | 4 | 1 | 8 |
| Deals & Memberships | 10 | 4 | 2 | 9 |
| *(`all`)* | — | 5 | 4 | — |

**Old taxonomy (Jul 21 → 24):** `all` 36 · events 15 · Food & Drink 15 · Arts & Culture 14 · New 12 · Shopping 12 · Live Music 12 · Family & Kids 11 · News 10 · deals 8 · clubs_signups 7 · services 7 · g_train 6.

**Read (directional only — tap counts are small):** News, Arts & Culture, Community, and Family & Kids lead the new taxonomy, and **Family & Kids reaches the most distinct people (5)** — consistent with the parents/camps wedge from the Laura & Edmond interview. Note the inversions against supply: **Live Music has the most cards (28) but among the fewest taps**, while **Shopping (5 cards) and Community (11) over-index on interest per card**. If that holds on Jul 29, it's an argument for rebalancing ingest effort toward community and shopping, and away from exhaustive live-music coverage.

**Top cards opened:** film-noir-film-club (8) · troost-barba-yiorgi (7) · artistic-voices-artudio (6) · le-fanfare (5) · newtown-creek-cag (5) · library-thursday-programs (5).

## Qualitative synthesis

- (feedback messages, replies to Batu, in-person comments — quotes with attribution channel)

## Recommendation (Claude — argued strictly from the bar)

- **Verdict options:** widen (Phase 3 opens) · iterate 2 more weeks (what changes) · reframe (bar failed — interviews + wedge proposal).
- —

## Verdict (Batu) → log in `DECISION_LOG.md`

- —
