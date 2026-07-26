# Greenpoint Life — Growth Engine (2026-07-25)

Grounded in Elena Verna's frameworks (growth loops / Racecar, PMF-first sequencing,
low-traffic experimentation rules, owned-and-earned-only channels, opinionated
defaults — sources at bottom), applied to what we actually have: the PMF ops plan
(`docs/launch/2026-07-21-pmf-ops-plan.md`), the pre-registered checkpoint bar,
the 9-event PostHog taxonomy (`src/demand-test/trackEvents.js`), and the Michael /
Laura & Edmond interviews. This doc is the growth strategy of record; decisions it
produces land in `DECISION_LOG.md`.

**Operating stance (Verna, applied):** pre-PMF, the founder is the growth team.
The engine below is staged — most of it is deliberately *not yet lit*. The job now
is retention evidence, not distribution.

---

## 1. Growth model — the three loops

Funnels spend; loops compound. Greenpoint Life has three candidate loops. Each is
drawn end-to-end with its compounding metric and its **weakest edge** — the edge
is where experiments and Phase 3 ships go. Nothing outside a loop edge deserves
build time.

### Loop A — Weekly content loop (the engine; demand side)

```
Mon ingest (review-gated) → fresh verified cards → residents check the week
→ saves / shares / .ics / signups → return next week + bring neighbors
→ more demand signal → sharper ingest & coverage → (back to top)
```

- **Compounding metric:** weekly returning locals (WRL) — the same number as the
  PMF bar (≥30 at ≥2 visits/week, 3 consecutive weeks, by ~Sep 15).
- **Weakest edges today:** (1) *re-entry* — nothing external reminds a resident
  it's a new week (no digest; habit can't form on memory alone), and (2) *share* —
  no OG tags or crawlable per-card URLs until ops plan 3.1, so word-of-mouth has
  no artifact to travel on.

### Loop B — Supply/claim loop (supply side; future monetization substrate)

```
Coverage puts businesses/orgs on the map (category labels, unclaimed)
→ they see resident traffic & asks → they submit events / ask in
→ richer verified cards → more resident value → more supply attention → (top)
```

- **Compounding metric:** proactive supply actors per month (submissions +
  inbound asks; PMF bar: ≥5, ≥1 recurring).
- **Weakest edge today:** businesses have *no path in* — the submission route is
  ops plan 3.3 and doesn't exist yet. Until then this loop only turns when Batu
  hand-carries it.

### Loop C — Answer-engine distribution loop (owned; zero-CAC)

```
Cards published as static structured HTML (/e/<slug> + JSON-LD, RSS/ICS, llms.txt)
→ search engines & AI assistants cite Greenpoint Life for "what's happening in
Greenpoint" → residents arrive with zero CAC → usage + signals → more/fresher
structured content → stronger citations → (top)
```

- **Compounding metric:** organic sessions (no `?src=`, search/AI referrers).
- **Weakest edge today:** the SPA is invisible to crawlers — the loop is dark
  until ops plan 3.6 ships. This is a build, not a campaign; freshness (weekly
  ingest) + truth rules are the ranking/citation moat competitors can't copy.

**Key read:** the Phase 3 backlog is not a feature list — it is, almost item for
item, the repair kit for the weakest edge of each loop (3.1 share → A, 3.3
submission → B, 3.6 AEO → C). That's the argument for shipping it as scoped and
resisting additions.

### Aha-moment hypothesis

> **"Something is happening near me this week that I didn't know about — and it's
> verified."** — Laura/Edmond and Michael both landed here: utility beats stories;
> the map is the container, the week's truth is the product.

Proxy definition (instrumentable today): first session with **≥2 `card_open` and
≥1 high-intent act** (`action_tap`, `cta_tap`, or `today_toggle`). This is a
hypothesis to check at the checkpoint, not a fact.

---

## 2. Retention first — the foundation

Verna: acquisition poured into a product that doesn't retain is wasted; a growth
motion cannot fix a product problem. Everything below sequences behind retention
evidence.

- **Natural frequency:** weekly. The product's content refreshes Monday; the
  honest habit is "check the week." (Cadence and product are aligned — rare and
  worth protecting.)
- **Retained user (committed definition):** returns in **≥2 of any 4 consecutive
  weeks** after first visit. Stricter than the funnel needs, matches the PMF bar.
- **Evidence for:** wave-1 testers articulated weekly-check intent unprompted;
  Laura/Edmond asked for save/star + time filters (return-visit features);
  Michael's frame implies recurring use.
- **Evidence against / unknown:** no quantitative retention data exists at all —
  Web Analytics was enabled late, PostHog runs cookieless (visitor identity
  rotates), and the `return_visit` sensor is parked in Phase 4. **We currently
  cannot measure our foundation metric.** That is the single biggest hole in the
  engine.

**Retention experiments (ranked):**

| # | Experiment | Smallest test | Metric & decision rule |
|---|---|---|---|
| R0 | **Pull the `return_visit` sensor forward from Phase 4 to now.** localStorage first-seen + visit count, privacy-light, new event through the locked taxonomy. *(Shipped to production 2026-07-26 — `returnVisit.js`.)* | One gated ship, TDD. | Not an experiment — a prerequisite. Unlocks R1/R2 and the PMF bar itself. |
| R1 | **Weekly digest to postvalue signups.** Mon post-ingest, "this week in Greenpoint," II-C, links carry `?src=digest`. AI drafts; Batu sends. | Plain email to existing signups — no automation build. | `src=digest` return sessions vs. signup count, pre/post over 3 weeks. Kill if <30% of recipients ever click by week 3. |
| R2 | **"New this week" marker** — use first-seen to badge cards added since last visit; makes the weekly rhythm visible in-product. | Small UI change over existing data. | Return-visit `card_open` depth pre/post. Kill if no lift after 2 weeks of returners. |
| R3 | **Five warm-user conversations:** "what would make you check this weekly?" | Already the checkpoint fail-branch; run it even on a pass. | Qualitative; feeds Tue proposals. |

---

## 3. Activation

- **Definitions:** *Activated* = the aha proxy above (≥2 `card_open` + 1
  high-intent act, first session). *Leak location:* unknown until the funnel is
  read — the instrumented funnel is `visit → pin_tap/card_open → action_tap/
  cta_tap`, segmented by `?src=`.
- Verna's caveat applies at our scale: activation is a **product** question, not
  a growth-optimization question. No flow micro-optimization; find the one
  structural leak, fix it with a product change.

**Activation experiments (ranked):**

| # | Experiment | Smallest test | Metric & decision rule |
|---|---|---|---|
| A1 | **Read the funnel** (PostHog, segmented by `?src=`, checkpoint week). Where do first sessions stall — before first `card_open`, or between open and act? | Analysis only. | Produces the target for A2. No build until this is read. |
| A2 | **Opinionated default on first visit:** land new visitors in the merchandised "this week" state (promise-first chip order already ships; extend to whatever A1 says is the stall point — e.g. auto-focus Today on weekday evenings). | One default flipped ON, pre/post. | First-session activation rate. Kill if flat after 2 weeks. |
| A3 | **Post-value prompt timing:** `postValue.js` already gates the email ask on demonstrated value; test the threshold (earlier vs. current) once traffic exists. | Config-level change. | Signup rate per activated session, pre/post. Deferred until ≥50 sessions/week. |

---

## 4. Acquisition — channel–model fit, then focus

Channel–model fit filter (Balfour via Verna): revenue per user is $0 → **only
near-zero-CAC channels can ever fit. Paid is dead permanently**, not deferred.
Scoring the four candidates:

| Channel | Type | Fit | Verdict |
|---|---|---|---|
| Community orgs & local groups | Earned | High — Michael-validated ("community-org-first growth"); orgs have the audience and the content | **Pick — now** |
| Parents/camps wedge | Earned | High — sharpest unmet need (Sawyer gap, Laura/Edmond); a wedge, not a channel: it makes every channel message concrete | **Pick — now** |
| Answer-engine / search (AEO) | Owned | High but slow-burn; compounds forever; needs 3.6 | Build in Phase 3, don't "campaign" it |
| Share loop / word-of-mouth | Product | High; blocked on 3.1 share infra | Lights up with Phase 3 |

**Focus = two:** community-org seeding, with the parents/camps wedge as the lead
message. Everything else is a build that rides the existing Phase 3 plan.

**Acquisition experiments (ranked; all post-checkpoint-pass, per kit rules Batu
sends every message):**

| # | Experiment | Smallest test | Metric & decision rule |
|---|---|---|---|
| Q1 | **Org seeding:** 3 orgs whose events are already on the map get a personal "your events are live here" note + per-org `?src=`. | 3 emails. | Sessions and activation rate per src; an org that shares = a Loop B ignition. Kill an org-type after 2 non-responses. |
| Q2 | **Parents-wedge post** in 1–2 parent groups: "every kids/camp thing in Greenpoint this week, verified, on one map," `?src=parents`. | One post. | src=parents sessions + week-2 return (needs R0). Double down only if return beats other srcs. |
| Q3 | **AEO acceptance** (rides 3.6): `curl` of `/e/<slug>` returns event name/date/venue; JSON-LD passes Rich Results. Then watch organic sessions monthly. | Already specced. | Organic sessions trend; no kill — owned infrastructure. |

---

## 5. Monetization — sequenced, not started

Verna's law is PMF → data → growth; monetizing before retention proof optimizes a
leaky bucket. **Nothing monetizes until the PMF verdict (~Sep 15 bar), full
stop** — this restates the existing gate, now with the growth argument attached.

- The **claim model is already Verna-shaped**: free product as the growth
  strategy (Loop A/C), monetization on the supply side only after demand is
  proven to them (Loop B). Sequencing stands as decided: sponsored campaign maps
  → partner tooling → evidence-gated featured cards; never charge small
  businesses first.
- **Free pre-work that is allowed now:** keep logging every business ask and
  submission verbatim (they're checkpoint currency *and* future pricing
  evidence), and let Q1 note-sends double as claim-demand probes — zero build.

---

## 6. The experiment system

Embedded in the existing weekly loop — no new ceremony:

- **Mon:** ingest + analytics pull refreshes every live experiment's metric.
- **Tue readout:** each live experiment gets one line — *metric, read (pre/post),
  decision per its rule: continue / kill / graduate.* Top-3 proposals may include
  at most one new experiment.
- **Wed–Fri:** approved ships only.

**Rules (Verna's low-traffic discipline):**

1. Every experiment ships with: hypothesis → smallest test → one metric →
   decision rule → **kill criteria written before launch**. No kill criteria, no
   launch.
2. **Pre/post and small-n qualitative only.** Five resident conversations are a
   valid instrument. No A/B infrastructure, no significance theater — at our
   traffic it's noise cosplay.
3. **Max 3 live experiments** at once. Attribution dies past that.
4. Micro-optimizations (copy tweaks, button styling, flow shaving) are not
   experiments and don't make the list.
5. Every result — including kills — gets one line in the Tue readout doc;
   durable decisions go to `DECISION_LOG.md`.

**Ownership split:**

- **AI-autonomous:** ingest, coverage scans, digest drafting, funnel/retention
  analysis, AEO build, experiment readouts, all instrumentation code (gated
  ships).
- **Needs Batu:** every outbound send (kit rule), all deploys, taste gates,
  kill/graduate verdicts, checkpoint and PMF verdicts.

Anything recurring that can't be automated into the Mon/Tue rhythm doesn't ship.

---

## Staging — when each part of the engine lights up

| Stage | Window | What's lit | What stays dark |
|---|---|---|---|
| 0 — Evidence | now → Jul 29 | R0 sensor · A1 funnel read · checkpoint | All acquisition, all monetization |
| 1 — Loops | pass → ~Sep 15 | Phase 3 ships (= loop-edge repairs) · R1/R2 · Q1/Q2 · weekly experiment cadence | Monetization, new content layers |
| 2 — Compound | post-PMF verdict | Monetization sequencing discussable · adjacent audiences · new loops | — |

**The one thing to do first: R0.** Pull the `return_visit` sensor forward from
Phase 4 to this week. Retention is the foundation metric of the entire engine,
the PMF bar is denominated in it, and we currently cannot measure it. It's a
day of gated, testable work and every later experiment reads through it.
*(Done — shipped to production 2026-07-26. Next in line: A1 funnel read at the
checkpoint.)*

## Explicitly not doing

- **Paid acquisition — ever** (channel–model fit: $0 revenue/user).
- A/B testing infrastructure or statistical-significance machinery.
- Social-account grinding, generic SEO/content-marketing blog.
- Referral incentives or growth hacks bolted outside the loops.
- Growth hires, agencies, or tools beyond PostHog free tier.
- Monetization conversations before the PMF verdict.
- New content layers (stories/history/routes) before the utility loop proves.
- Geographic expansion ("Williamsburg North") — adjacent-user moves are a
  post-PMF plateau tool, and the hyperlocal focus *is* the moat.
- Rebranding as a growth lever.

## Sources

- Elena Verna, [My 9 Favorite Growth Frameworks](https://www.elenaverna.com/p/my-9-favorite-growth-frameworks) · [Five Laws of Growth](https://www.elenaverna.com/p/five-laws-of-growth)
- Lenny's Podcast: [10 growth tactics that never work](https://www.lennysnewsletter.com/p/10-growth-tactics-that-never-work-elena-verna) · [The new AI growth playbook for 2026](https://www.lennysnewsletter.com/p/the-new-ai-growth-playbook-for-2026-elena-verna) (Lovable)
