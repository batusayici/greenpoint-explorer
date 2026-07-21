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
- **Instrumentation gap (found 2026-07-21): Vercel Web Analytics was never enabled on the project** (`web_analytics_not_enabled` from the REST API) — no pageviews or custom events were collected Jul 15–21 and that window is unrecoverable. Quantitative sections below can only cover the days after collection starts. Criterion 2 falls back to Tally-response classification alone; criterion 5 ranks from the partial window + Tally + qualitative mentions, flagged as partial. Fix path + transport decision: ops plan 1.1/1.2.
- Custom events additionally require a **Pro** team (Hobby drops `track()` calls entirely); the free alternative is exercising the `trackEvents.js` vendor seam (built for exactly this, 2026-07-03 decision).
- `FEEDBACK_FORM_URL` is empty — feedback taps fall back to the signup Tally (`44daZo`), so *Tally responses conflate signup + feedback* until the dedicated form ships. Classify responses manually: email-only → signup; free-text → feedback. `cta_tap.placement` vs `feedback_tap` still separates *taps* cleanly (once events collect).
- Criterion 4 (`src`-less visits) can include people who stripped the param; treat a spike as signal, a trickle as noise.
- Retention is deliberately NOT scored at this scale (2026-07-15 decision).

**Data pull method (once collecting):** pageviews/visits via REST `GET api.vercel.com/v1/query/web-analytics/visits/…` or `npx vercel@latest metrics vercel.analytics_pageview.count` (CLI ≥ Jun 2026). Custom events: per the transport decision (PostHog query UI/API, or Vercel events REST if Pro). Tally: CSV export from the dashboard. The Vercel MCP has no analytics tools — not part of this path.

## Funnel (all traffic, Jul 15 → Jul 28)

| Stage | Event | Count |
|---|---|---|
| Visits | pageviews | — |
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

| Category | card_open | action_tap | filter_tap | Rank |
|---|---|---|---|---|
| events | — | — | — | — |
| clubs/signups | — | — | — | — |
| deals | — | — | — | — |
| news | — | — | — | — |
| discovery (food/shops/arts) | — | — | — | — |
| g_train | — | — | — | — |

## Qualitative synthesis

- (feedback messages, replies to Batu, in-person comments — quotes with attribution channel)

## Recommendation (Claude — argued strictly from the bar)

- **Verdict options:** widen (Phase 3 opens) · iterate 2 more weeks (what changes) · reframe (bar failed — interviews + wedge proposal).
- —

## Verdict (Batu) → log in `DECISION_LOG.md`

- —
