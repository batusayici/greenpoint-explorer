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
1.5 De-July design (non-gating; must ship by Aug 1) — **shipped 2026-07-27**: the header frame was already evergreen ("Greenpoint Life" / "Your week in Greenpoint, verified…"); the remaining July was the `<meta name="description">` tag, now evergreen. `july-2026-cards.json` → `cards.json`, with the migration note in `ingest-newsletters/SKILL.md`. Internal identifiers (`JulyApp.jsx`, `july.css` + `.july-*` classes, `julyCards.test.mjs`) deliberately left — invisible to users, and the `july-postvalue-done` localStorage key must NOT be renamed (it would reset the once-per-browser signup gate for existing visitors).

## Phase 2 — ~~Checkpoint (~Jul 29)~~ voided 2026-07-26 → launch-readiness review

*(DECISION_LOG 2026-07-26: the Jul 15 wave was a friends feedback round, not a launch — the gate is voided because the exposure never happened, not because results disappointed. The readout doc keeps its data as the friends-round record. Jul 29 is now a launch-readiness review against the Phase 3 list; the quantitative bar moves to post-launch.)*

## Phase 3 — Public cut + greenpoint.life — THE LAUNCH TRACK (ungated 2026-07-26; target ~Aug 1–8)

Product (each TDD, preview-verified, gated deploy):
- 3.1 Share infra: site-wide OG tags + II-C preview image on the root page; per-card deep links as **real paths** (`/e/<slug>`, `history.replaceState` on open) rather than `?card=` params — same UX, but each event gets a crawlable URL (see 3.6). Per-card OG images deferred (YAGNI).
- ~~3.2 Save/star + day picker~~ **cut 2026-07-26 (Batu): no new features before launch** — share + add-to-calendar actions already prove engagement; the Laura/Edmond star/save + time-filter asks stay on record as post-launch candidates ranked by observed pull, not launch blockers.
- 3.3 Business submission path: "Add your event/offer (free)" Tally + pinned CTA card; submissions join the Monday review queue (ingest-skill section). `submit_tap` event. Supply-side PMF sensor.
- 3.4 Domain cutover: greenpoint.life → Vercel project; root already serves the feed directly (entry swap 2026-07-22 — no rewrite needed); 3D prototype stays unlinked; verify `?src=` + events on the new domain.
- 3.5 De-July ships here if not already.
- 3.6 Answer-engine surface (AEO) — *decision 2026-07-21 (Batu): post-launch north star is that humans **and AIs** asking "what's happening in Greenpoint" get Greenpoint Life as the source, not Greenpointers/Brooklyn Eagle.* **Shipped 2026-07-26:** `npm run build` now runs `scripts/prerender-aeo.mjs` (pure builders in `src/demand-test/aeo.js`, 12 tests) — per-card static pages at `dist/e/<slug>/index.html` (raw facts + schema.org/Event JSON-LD + per-card title/OG text, sentinel-honest dates, SPA boots on top), `sitemap.xml`, `rss.xml`, `events.ics`, `llms.txt`, `robots.txt`. Freshness rides every ingest-PR deploy. **Post-deploy acceptance still open:** `curl` (no JS) of a prod `/e/<slug>` URL returns name/date/venue (extensionless path must resolve the directory index — verified only with trailing slash on local preview), and JSON-LD passes Google's Rich Results test. Origin flips in `aeo.js` (`AEO_ORIGIN`) at the 3.4 cutover.

Marketing (Claude drafts, Batu sends): Reddit + local-group posts · print-ready II-C QR window card, offered first to businesses already on the map. Greenpointers pitch and further SSG amplification deliberately held. **Every outbound link is copied from `docs/launch/channel-links.md` (canonical tagged-link table + pre-send checklist, 2026-07-26) — never composed by hand.**

Launch-readiness status (2026-07-26): **error monitoring shipped** — PostHog exception autocapture (`capture_exceptions` in `posthogTransport.js`), verified end-to-end ($exception events confirmed server-side by name; note they bypass the `trackEvents` seam so they carry `$current_url` but no `src`). Batu action: enable error-tracking alert emails in the PostHog UI (needs account access, not doable via the read key).

## Phase 4 — Weekly PMF loop (Aug → ~mid-Sep)

*(2026-07-25: the weekly loop's experiment content and rules are specified in `docs/growth/growth-engine.md` §6.)*

- Retention sensor: privacy-light `return_visit` event (localStorage first-seen + visit count; no fingerprinting). *(Updated 2026-07-26: pulled forward and shipped as growth-engine R0 — `src/demand-test/returnVisit.js`, `visitCount` + `weekIndex` properties, live in production.)*
- Iterate from observed pull; features ranked by signal.
- **Pre-registered validation gates** *(re-registered 2026-07-28, before launch data existed — the prior two-sided bar conflated demand evidence with commercial permission; four gates in `docs/growth/business-model.md` §4)*:
  - **Demand:** ≥30 unique locals returning in **≥3 of any 4 consecutive weeks**, majority arriving without a fresh invite push *(bar re-formed pre-data 2026-07-28: the prior ≥2-visits/week measure demanded a daily habit from a weekly-refresh product; intensity stays a supporting signal)*. **~Sep 15 is a provisional readout** (an Aug 1–8 launch yields only ~5–6 weeks); the firm verdict follows two mature 4-week cohorts, ~late Oct. No gate is read on raw Dec–Feb numbers (seasonality — business-model.md §4).
  - **Distribution:** ≥2 channels repeatedly producing activated users without founder-intensive outreach.
  - **Supply:** ≥5 businesses/orgs proactively submitted or asked in; ≥1 recurring submitter.
  - **Commercial:** 3 paid pilots or signed LOIs from a defined buyer profile — resident counts never open this gate.
- PMF verdict unlocks the paid surfaces in `docs/growth/business-model.md` (2026-07-28): Founding Partners → self-serve business layer → spatial intelligence. **Selling starts before the verdict; shipping any paid surface waits until after it.** *(Supersedes "sponsored maps first; never charge small businesses first." 2026-07-22: Track R / the 3D explorer is parked indefinitely — reopening it is a separate, explicit decision by Batu, not an automatic unlock.)*
