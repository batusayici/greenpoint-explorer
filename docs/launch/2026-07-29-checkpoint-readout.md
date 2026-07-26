# Track V 2-Week Checkpoint Readout — ~2026-07-29

Pre-registered 2026-07-21 (before looking at results), against the success bar in `2026-07-15-limited-launch-kit.md`. Fill the DATA sections on Jul 28–29; Batu's verdict goes in `DECISION_LOG.md`. Ops context: `2026-07-21-pmf-ops-plan.md`.

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

**Blockers to clear before Jul 29:**
1. **PostHog read access (blocks the whole Funnel + Channels + Content-type tables).** The deployed key is the write-only ingest key; querying needs a personal API key (`phx_…`) or a dashboard pull. **Batu:** either check Live Events / export from the PostHog UI, or drop a read key into the environment so the pull is scriptable. This is the single largest gap — without it, criteria 2/4/5 fall back to Tally + qualitative exactly as the caveats describe.
2. **Tally CSVs** (signup `44daZo` + feedback `LZqEj1`) — Batu exports; needed for criteria 1/2/3/6.
3. **Name-level event confirmation** — 30-second check in PostHog Live Events that `return_visit`, `card_open`, `cta_tap` appear by name with `src` attached.

**Taxonomy remap (not a bar change).** Criterion 5 names filters `events / clubs_signups / deals / news`, which no longer exist — the 2026-07-25 IA re-cut replaced them with 9 intent lenses *after* this doc was pre-registered. The ranking will be reported over the live lenses below; the threshold ("clear ranking") is unchanged. Supply denominators as of 2026-07-26 (109 live cards) are pre-filled so pull-per-card is readable, not just raw taps.

## Funnel (all traffic, Jul 15 → Jul 28)

| Stage | Event | Count |
|---|---|---|
| Visits | pageviews | **69** (Jul 21→26 partial, pulled 2026-07-26) |
| Engaged | `card_open` (unique-ish) | — |
| Pin interaction | `pin_tap` | — |
| Acted | `action_tap` | — |
| Committed | `cta_tap` postvalue / footer | — / — |
| Fed back | `feedback_tap` | — |
| Graph traversal | `related_tap` / `source_tap` | — / — |

## Channels (`?src=`)

| Channel | Visits | card_open | action_tap | cta_tap | Notes |
|---|---|---|---|---|---|
| wave1 | — | — | — | — | warm network |
| michael | — | — | — | — | |
| laura-edmond | — | — | — | — | told about star/save + time filter plans |
| perri | — | — | — | — | SSG distribution |
| (none) | — | — | — | — | unprompted-share candidate |

## Content-type pull

Rows are the live lenses (2026-07-25 IA re-cut); "cards" = supply denominator on 2026-07-26 (109 cards total, cards carry multiple lenses).

| Lens | cards | card_open | action_tap | filter_tap | Rank |
|---|---|---|---|---|---|
| Live Music | 28 | — | — | — | — |
| Arts & Culture | 26 | — | — | — | — |
| Food & Drink | 21 | — | — | — | — |
| News | 19 | — | — | — | — |
| Family & Kids | 17 | — | — | — | — |
| Community | 11 | — | — | — | — |
| Deals & Memberships | 10 | — | — | — | — |
| Shopping | 5 | — | — | — | — |
| Wellness | 5 | — | — | — | — |

## Qualitative synthesis

- (feedback messages, replies to Batu, in-person comments — quotes with attribution channel)

## Recommendation (Claude — argued strictly from the bar)

- **Verdict options:** widen (Phase 3 opens) · iterate 2 more weeks (what changes) · reframe (bar failed — interviews + wedge proposal).
- —

## Verdict (Batu) → log in `DECISION_LOG.md`

- —
