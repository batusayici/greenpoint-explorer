# Greenpoint Life — PMF Operating Plan (2026-07-21)

Plan of record for the launch → learn → PMF campaign. Decided in the 2026-07-21 interview (see `DECISION_LOG.md` same date); full interview plan: `~/.claude/plans/you-will-act-as-rippling-seal.md`. Supersedes nothing — it extends the 2026-07-15 launch kit with what happens at and after the checkpoint.

**Naming:** the consumer product is **Greenpoint Life**, destined for **greenpoint.life** (domain bought, not yet wired). The repo and 3D prototype keep the Greenpoint Explorer name. *(Updated 2026-07-22: the feed now serves at the root `/` — the old `/july.html` URL redirects there, query params preserved; the parked 3D prototype moved to `/explorer.html`.)*

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

## Phase 2 — ~~Checkpoint (~Jul 29)~~ voided 2026-07-26 → launch-readiness review

*(DECISION_LOG 2026-07-26: the Jul 15 wave was a friends feedback round, not a launch — the gate is voided because the exposure never happened, not because results disappointed. The readout doc keeps its data as the friends-round record. Jul 29 is now a launch-readiness review against the Phase 3 list; the quantitative bar moves to post-launch.)*

## Phase 3 — Public cut + greenpoint.life — THE LAUNCH TRACK (ungated 2026-07-26; target ~Aug 1–8)

Product (each TDD, preview-verified, gated deploy):
- 3.1 Share infra: site-wide OG tags + II-C preview image on the root page; per-card deep links as **real paths** (`/e/<slug>`, `history.replaceState` on open) rather than `?card=` params — same UX, but each event gets a crawlable URL (see 3.6). Per-card OG images deferred (YAGNI).
- 3.2 Save/star (localStorage, no login) + Saved filter chip; day-picker chips over `groupByDay()` buckets. New events: `save_tap`, day `filter_tap` variant.
- 3.3 Business submission path: "Add your event/offer (free)" Tally + pinned CTA card; submissions join the Monday review queue (ingest-skill section). `submit_tap` event. Supply-side PMF sensor.
- 3.4 Domain cutover: greenpoint.life → Vercel project; root already serves the feed directly (entry swap 2026-07-22 — no rewrite needed); 3D prototype stays unlinked; verify `?src=` + events on the new domain.
- 3.5 De-July ships here if not already.
- 3.6 Answer-engine surface (AEO) — *decision 2026-07-21 (Batu): post-launch north star is that humans **and AIs** asking "what's happening in Greenpoint" get Greenpoint Life as the source, not Greenpointers/Brooklyn Eagle.* The SPA is invisible to LLM crawlers (GPTBot/ClaudeBot/PerplexityBot don't execute JS), so the structured card data must exist as static HTML: build-time prerender of per-event pages at `/e/<slug>` from the cards JSON (content + schema.org/Event JSON-LD in raw HTML), `sitemap.xml`, RSS + ICS feed of current cards, `llms.txt`. Acceptance: `curl` (no JS) of an event URL returns the event's name/date/venue; JSON-LD passes Google's Rich Results test. Rides the 3.1 deep-link work and the 3.4 cutover; no framework change — a Vite build step over data that is already schema-valid. Truth rules double as the citation-trust moat; freshness (weekly ingest) is the ranking edge event queries reward.

Marketing (Claude drafts, Batu sends): Reddit + local-group posts (per-channel `?src=`) · print-ready II-C QR window card (`?src=qr`), offered first to businesses already on the map. Greenpointers pitch and further SSG amplification deliberately held.

## Phase 4 — Weekly PMF loop (Aug → ~mid-Sep)

*(2026-07-25: the weekly loop's experiment content and rules are specified in `docs/growth/growth-engine.md` §6.)*

- Retention sensor: privacy-light `return_visit` event (localStorage first-seen + visit count; no fingerprinting). *(Updated 2026-07-26: pulled forward and shipped as growth-engine R0 — `src/demand-test/returnVisit.js`, `visitCount` + `weekIndex` properties, live in production.)*
- Iterate from observed pull; features ranked by signal.
- **Pre-registered two-sided PMF bar (numbers to confirm at checkpoint):**
  - Demand: ≥30 unique locals at ≥2 visits/week, 3 consecutive weeks by ~Sep 15, majority arriving without a fresh invite push.
  - Supply: ≥5 businesses/orgs proactively submitted or asked in; ≥1 recurring submitter.
- PMF verdict unlocks the existing gates: monetization sequencing becomes discussable (sponsored maps first; never charge small businesses first). *(2026-07-22: Track R / the 3D explorer is parked indefinitely — reopening it is a separate, explicit decision by Batu, not an automatic unlock.)*
