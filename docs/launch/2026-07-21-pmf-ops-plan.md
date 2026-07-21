# Greenpoint Life — PMF Operating Plan (2026-07-21)

Plan of record for the launch → learn → PMF campaign. Decided in the 2026-07-21 interview (see `DECISION_LOG.md` same date); full interview plan: `~/.claude/plans/you-will-act-as-rippling-seal.md`. Supersedes nothing — it extends the 2026-07-15 launch kit with what happens at and after the checkpoint.

**Naming:** the consumer product is **Greenpoint Life** (already the brand on `july.html`), destined for **greenpoint.life** (domain bought, not yet wired). The repo and 3D prototype keep the Greenpoint Explorer name.

## Roles & operating model

- **Batu — head of product:** taste, approvals, verdicts, and *sending every outbound message* (kit rule, unchanged).
- **Claude — PM / Designer / PMM / Analyst:** runs the weekly loop, spawns subagents, drafts everything.
- **Weekly rhythm:** Mon `/ingest-newsletters` (review-gated) + analytics pull → Tue readout + top-3 proposals → Wed–Fri approved ships (TDD, preview-verified, gated deploy).
- **Gates:** no unapproved prod deploys · truth rules (nothing invented; sources required) · II-C palette on anything visual · decisions land in `DECISION_LOG.md`.
- **Model policy (refined 2026-07-21, Batu):** capability first, cost second — complex tasks go to the most capable model for the job; savings come only from work whose output is mechanically verifiable.
  - **Fable (main thread, never delegated below):** product judgment, taste gates, strategy, checkpoint analysis, final synthesis, review of every gated ship.
  - **Fable/Opus subagents:** anything complex or ambiguous when delegated — multi-file features, design-sensitive implementation, voice-critical marketing drafts, open-ended research, ingest calls with judgment (locally-owned gate, dedup, category).
  - **Sonnet subagents:** only work fully constrained by a spec + tests/rubric where a miss is cheap and catchable.
  - **Haiku subagents:** mechanical only — scans, geocoding, transforms, verifier runs (output test-checkable).
  - **Escalation bias:** unsure → one tier up. Complexity is judged per task, not per phase.

## Phase 1 — Checkpoint prep (→ Jul 28)

1.1 Access setup (Batu): **enable Web Analytics on the `greenpoint-explorer` project (dashboard toggle — urgent, see 1.2 finding)** · create the dedicated Tally feedback form and drop its URL into `FEEDBACK_FORM_URL` · Tally CSV exports (signup + feedback) before Jul 28 · forward qualitative replies. Recommended: `npm i -g vercel@latest`. (Vercel MCP auth is *optional* — research 2026-07-21 found it has no analytics tools; the data path is the Web Analytics REST API / new CLI `metrics`.)
1.2 Instrumentation audit — **done 2026-07-21, two findings:** (a) **Web Analytics was never enabled** on the project (`web_analytics_not_enabled`); nothing was collected Jul 15–21, unrecoverable — checkpoint quantitative sections degrade to the partial window after the fix. (b) Custom events require a **Pro** team even after enabling. **Transport decision (Batu):** recommended — exercise the `trackEvents.js` vendor seam (2026-07-03, built for this) → PostHog free tier, cookieless, autocapture off (also gives real retention for Phase 4); alternative — upgrade the team to Pro and stay single-vendor. Event *code* wiring verified correct either way (9 events, `?src=` on every event).
1.3 Scorecard pre-registered: `docs/launch/2026-07-29-checkpoint-readout.md`.
1.4 Mon Jul 27 ingest as usual.
1.5 De-July design (non-gating; must ship by Aug 1): evergreen "Greenpoint Life — this week in Greenpoint" frame; `july-2026-cards.json` → month-agnostic filename with ingest-skill migration note.

## Phase 2 — Checkpoint (~Jul 29) — Batu decides

Readout against the kit's bar (≥5 weekly-check intents · ≥3 postvalue signups · ≥2 business asks · ≥1 unprompted share · content-type ranking · qualitative), segmented by `?src=`, plus visit → card_open → action funnel. Claude writes a widen / iterate / reframe recommendation argued strictly from the pre-registered bar; Batu's verdict goes in `DECISION_LOG.md`. **Fail → no public push:** ~5 qualitative interviews with warmest users, wedge-reframe proposal.

## Phase 3 — Public cut + greenpoint.life (gated on pass; target ~Aug 1–8)

Product (each TDD, preview-verified, gated deploy):
- 3.1 Share infra: site-wide OG tags + II-C preview image on `july.html`; per-card deep links (`?card=<id>`, `history.replaceState` on open). Per-card OG images deferred (YAGNI).
- 3.2 Save/star (localStorage, no login) + Saved filter chip; day-picker chips over `groupByDay()` buckets. New events: `save_tap`, day `filter_tap` variant.
- 3.3 Business submission path: "Add your event/offer (free)" Tally + pinned CTA card; submissions join the Monday review queue (ingest-skill section). `submit_tap` event. Supply-side PMF sensor.
- 3.4 Domain cutover: greenpoint.life → Vercel project; root serves the feed via rewrite (`/` → `/july.html`); 3D prototype stays unlinked; verify `?src=` + events on the new domain.
- 3.5 De-July ships here if not already.

Marketing (Claude drafts, Batu sends): Reddit + local-group posts (per-channel `?src=`) · print-ready II-C QR window card (`?src=qr`), offered first to businesses already on the map. Greenpointers pitch and further SSG amplification deliberately held.

## Phase 4 — Weekly PMF loop (Aug → ~mid-Sep)

- Retention sensor: privacy-light `return_visit` event (localStorage first-seen + visit count; no fingerprinting).
- Iterate from observed pull; features ranked by signal.
- **Pre-registered two-sided PMF bar (numbers to confirm at checkpoint):**
  - Demand: ≥30 unique locals at ≥2 visits/week, 3 consecutive weeks by ~Sep 15, majority arriving without a fresh invite push.
  - Supply: ≥5 businesses/orgs proactively submitted or asked in; ≥1 recurring submitter.
- PMF verdict unlocks the existing gates: Track R resumes; monetization sequencing becomes discussable (sponsored maps first; never charge small businesses first).
