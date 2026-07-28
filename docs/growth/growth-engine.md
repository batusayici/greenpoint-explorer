# Greenpoint Life — Growth Engine (2026-07-25 · rev 2026-07-28)

Grounded in Elena Verna's frameworks (growth loops / Racecar, PMF-first sequencing,
low-traffic experimentation rules, owned-and-earned-only channels, opinionated
defaults — sources at bottom), applied to what we actually have: the PMF ops plan
(`docs/launch/2026-07-21-pmf-ops-plan.md`), the launch runbook
(`docs/launch/2026-07-27-launch-plan.md`) and its pre-registered PMF bar,
the 9-event PostHog taxonomy (`src/demand-test/trackEvents.js`), and the Michael /
Laura & Edmond interviews. This doc is the growth strategy of record; decisions it
produces land in `DECISION_LOG.md`. **Everything here gates on launch** (= the
greenpoint.life cutover); the Jul 29 checkpoint was voided 2026-07-26.

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
- **Confirming signal (added 2026-07-27):** PMF in this era is binary — a
  word-of-mouth machine exists or it doesn't, and the benchmark is **organic
  >50% of acquisition**. Instrumentable post-launch: share of new sessions with
  no `?src=` plus search/AI referrers, read monthly. A lens on the WRL bar (it
  sharpens the existing "majority arriving without a fresh invite push" clause),
  not a second bar.
- **Weakest edge:** *re-entry* — nothing external reminds a resident it's a new
  week (no digest; habit can't form on memory alone). R1 aims here. The *share*
  edge was repaired 2026-07-26 (3.1: OG tags + crawlable `/e/<slug>`); whether
  word-of-mouth actually travels is unread until post-launch traffic.

### Loop B — Supply/claim loop (supply side; future monetization substrate)

```
Coverage puts businesses/orgs on the map (category labels, unclaimed)
→ they see resident traffic & asks → they submit events / ask in
→ richer verified cards → more resident value → more supply attention → (top)
```

- **Compounding metric:** proactive supply actors per month (submissions +
  inbound asks; PMF bar: ≥5, ≥1 recurring).
- **Weakest edge — and the only one still unrepaired:** businesses have *no path
  in*. The submission route (3.3 = launch item **L5**) is unbuilt, so this loop
  turns only when Batu hand-carries it. L5 is the last build before cutover.

### Loop C — Answer-engine distribution loop (owned; zero-CAC)

```
Cards published as static structured HTML (/e/<slug> + JSON-LD, RSS/ICS, llms.txt)
→ search engines & AI assistants cite Greenpoint Life for "what's happening in
Greenpoint" → residents arrive with zero CAC → usage + signals → more/fresher
structured content → stronger citations → (top)
```

- **Compounding metric:** organic sessions (no `?src=`, search/AI referrers).
- **Edge repaired** (3.6 prerender), **prod acceptance passed 2026-07-28**:
  extensionless `/e/<slug>` resolves, no-JS `curl` returns name/venue/address,
  dated cards carry valid `schema.org/Event` JSON-LD. **Seeded, not yet
  turning** — citations accrue on crawler time. Open: Rich Results spot-check
  (manual), and re-verify after the origin flip at cutover. Freshness + truth
  rules are the citation moat competitors can't copy.

**Key read:** the Phase 3 backlog is not a feature list — it is, almost item for
item, the repair kit for the weakest edge of each loop: 3.1 share → A ✅ · 3.6
AEO → C ✅ · 3.3 submission → B ⬜. That's the argument for shipping it as scoped
and resisting additions.

### Aha-moment hypothesis

> **"Something is happening near me this week that I didn't know about — and it's
> verified."** — Laura/Edmond and Michael both landed here: utility beats stories;
> the map is the container, the week's truth is the product.

Proxy definition (instrumentable today): first session with **≥2 `card_open` and
≥1 high-intent act** (`action_tap`, `cta_tap`, or `today_toggle`). This is a
hypothesis to check in the first post-launch readouts (A1), not a fact.

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
- **Evidence against / unknown:** the sensor hole is closed (R0 `return_visit`
  live since 2026-07-26), but the baseline is *young* — the ≥2-of-4-weeks
  definition needs weeks of accumulation before it says anything, which is why
  R0 shipped ahead of launch. Nothing before 2026-07-26 is recoverable
  (Web Analytics enabled late; PostHog cookieless, so visitor identity rotates).

**Retention experiments (ranked):**

| # | Experiment | Smallest test | Metric & decision rule |
|---|---|---|---|
| R0 | **`return_visit` sensor** — localStorage first-seen + visit count, privacy-light. ✅ **live since 2026-07-26** (`returnVisit.js`). | — | Not an experiment — the prerequisite. Unlocks R1/R2 and the PMF bar itself. |
| R1 | **Weekly digest to postvalue signups.** Mon post-ingest, "this week in Greenpoint," II-C, links carry `?src=digest`. AI drafts; Batu sends. | Plain email to existing signups — no automation build. | `src=digest` return sessions vs. signup count, pre/post over 3 weeks. Kill if <30% of recipients ever click by week 3. |
| R2 | **"New this week" marker** — use first-seen to badge cards added since last visit; makes the weekly rhythm visible in-product. | Small UI change over existing data. | Return-visit `card_open` depth pre/post. Kill if no lift after 2 weeks of returners. |
| R3 | **Five warm-user conversations:** "what would make you check this weekly?" | Was the voided checkpoint's fail-branch; survives as a standing instrument — run post-launch regardless of the numbers. | Qualitative; feeds Tue proposals. |

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
| A1 | **Read the funnel** (PostHog, segmented by `?src=`, inside the first post-launch readouts — launch runbook §4). Where do first sessions stall — before first `card_open`, or between open and act? | Analysis only. | Produces the target for A2. No build until this is read. |
| A2 | **Opinionated default on first visit:** land new visitors in the merchandised "this week" state (promise-first chip order already ships; extend to whatever A1 says is the stall point — e.g. auto-focus Today on weekday evenings). | One default flipped ON, pre/post. | First-session activation rate. Kill if flat after 2 weeks. |
| A3 | **Post-value prompt timing:** `postValue.js` already gates the email ask on demonstrated value; test the threshold (earlier vs. current) once traffic exists. | Config-level change. | Signup rate per activated session, pre/post. Deferred until ≥50 sessions/week. |

**One-egg rule (added 2026-07-27):** users are selfish, vain, and lazy — the
first 30 seconds must deliver exactly one magical thing: *"what's happening near
me this week, verified."* A2 sharpens that one egg; it never adds a second.
Onboarding tours, multi-feature intros, and asks before demonstrated value
(`postValue.js` already enforces the last) all violate it.

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

**Echo-chamber targeting (added 2026-07-27):** the unit of seeding is a small
trust network, not reach. Org leaders and parent-group admins are Greenpoint's
micro-influencers — a recommendation from *inside* the network ("parents telling
parents") converts where broadcast can't, and costs nothing. Applied to Q1/Q2:
pick messengers embedded in the network over channels with bigger audiences, and
saturate one network before opening the next. This tightens the existing
experiments' messaging; it adds none (max-3 rule untouched).

**Acquisition experiments (ranked; all post-launch — Q1/Q2 are wave 1 of the
seeding order in the launch runbook §3; kit rules: Batu sends every message):**

| # | Experiment | Smallest test | Metric & decision rule |
|---|---|---|---|
| Q1 | **Org seeding:** 3 orgs whose events are already on the map get a personal "your events are live here" note + per-org `?src=`. | 3 emails. | Sessions and activation rate per src; an org that shares = a Loop B ignition. Kill an org-type after 2 non-responses. |
| Q2 | **Parents-wedge post** in 1–2 parent groups: "every kids/camp thing in Greenpoint this week, verified, on one map," `?src=parents`. | One post. | src=parents sessions + week-2 return (needs R0). Double down only if return beats other srcs. |
| Q3 | **AEO acceptance** (rides 3.6): `curl` acceptance **passed on prod 2026-07-28** (extensionless `/e/<slug>`, no-JS facts, Event JSON-LD); Rich Results manual spot-check open; re-verify on greenpoint.life at cutover. Then watch organic sessions monthly. | Shipped; watch-only. | Organic sessions trend; no kill — owned infrastructure. |

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
  submission verbatim (they're supply-side PMF evidence *and* future pricing
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

**Ownership split:** governed by the operator model and autonomy ladder in §7.
Anything recurring that can't be automated into the Mon/Tue rhythm doesn't ship.

---

## 7. Operator model — semi-autonomous growth under supervision

*(Added 2026-07-27; the agency-control and sensor–policy–tool–learning
frameworks are from the AI-era syntheses in Sources.)* The weekly loop runs as a
**Growth Operator**: a Tuesday cloud routine (`/growth-weekly`, skill at
`.claude/skills/growth-weekly/SKILL.md`) that senses, computes, drafts, and
recommends — mirroring the proven ingest pattern, where **the PR is the review
gate**. Autonomy is earned *per task* through calibration, never granted
wholesale.

**The operator's loop (sensor → policy → tool → learning):**

- **Sensor:** PostHog pull (`./scripts/posthog-pull.sh`), Vercel Web Analytics,
  the R0 `return_visit` baseline, the submission/ask log.
  - **Launch prerequisite (2026-07-28):** the operator is a *cloud* routine, and
    its only sensor host is `us.posthog.com`. The cloud environment's
    network-access list is currently **Custom** with the *ingest* roster only
    (roster hosts + nominatim + cdn.playwright.dev — DECISION_LOG 2026-07-28).
    Add `us.posthog.com` before enabling the Tuesday routine, or it fails the
    same silent way the 7/27–7/28 ingest runs did: no data, no per-host error.
- **Policy:** the autonomy ladder below + kit rules — every link copied from
  `docs/launch/channel-links.md`, truth rules, max 3 live experiments.
- **Tool:** deterministic scripts first; model judgment only where a read or a
  draft needs it (same cost architecture as ingest, 2026-07-25).
- **Learning:** every Batu edit to a draft becomes a standing instruction in the
  operator skill — the growth version of "every complaint becomes a test case."
  The Tue readout doc is the weekly calibration record.

**Autonomy ladder** (V1 = suggests options · V2 = drafts complete work for
review · V3 = executes autonomously):

| Task | Level now | Ceiling |
|---|---|---|
| Analytics pull + metric computation | V3 (deterministic scripts) | V3 |
| Experiment reads vs. pre-registered decision rules | V2 — reads land as recommendations | V3 — rules are mechanical once calibrated |
| Tue readout + top-3 proposal drafting | V2 | V3 (drafting only) |
| Outbound copy — digest, org notes, posts | V2 — draft only | V2 — **sending is Batu's, permanently** |
| Instrumentation / growth-edge ships | V2 — PR-gated, TDD | V2 — merge = deploy stays Batu's |
| Kill / graduate verdicts | V1 — recommend only | Batu, permanently |
| New experiments, scope changes, monetization | V1 | Batu, permanently |

**Promotion rule:** a task moves up one level only when (a) three consecutive
cycles shipped without material edit, (b) the action is reversible, and (c) it
stays inside kit + truth rules. Promotion is proposed in a Tue readout and
ratified by Batu — never self-granted. **Demotion is immediate and automatic**
on any truth-rule breach, untagged link, or misread — one strike, one rung down.

**What stays human regardless of calibration:** sends, deploys/merges, taste
gates, kill/graduate/PMF verdicts, and spending money. These aren't
trust-gated — they're the definition of supervision.

---

## Staging — when each part of the engine lights up

| Stage | Window | What's lit | What stays dark |
|---|---|---|---|
| 0 — Readiness *(was "Evidence"; checkpoint voided 2026-07-26)* | now → cutover (~Aug 1–8) | R0 baseline collecting · loop-edge repairs (3.1 ✅ · 3.6 ✅ · 3.3 = L5, the last build) | All acquisition, all monetization |
| 1 — Loops | launch → ~Sep 15 | Seeding waves (runbook §3) · A1 funnel read in first readouts · R1 · Q1/Q2 · weekly experiment cadence | Monetization, new content layers; R2 waits for a returner population |
| 2 — Compound | post-PMF verdict | Monetization sequencing discussable · adjacent audiences · new loops | — |

**The one thing to do first: L5** — the business submission path. It is the last
unrepaired loop edge (B), the last build before cutover, and the only PMF bar
we currently have no instrument for: the supply side (≥5 proactive actors) can't
be measured while the only way in is Batu's inbox. *(R0, the previous "one
thing," shipped 2026-07-26. A1's funnel read follows in the first post-launch
readouts.)*

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
- **Autonomy theater** — token-maxing for its own sake, autonomous outbound
  sends, self-modifying nightly agents. Automation expands one rung at a time
  down §7's ladder, never around the gates; the review gate and the measured
  cost discipline (DECISION_LOG 2026-07-25) outrank velocity.

## Sources

- Elena Verna, [My 9 Favorite Growth Frameworks](https://www.elenaverna.com/p/my-9-favorite-growth-frameworks) · [Five Laws of Growth](https://www.elenaverna.com/p/five-laws-of-growth)
- Lenny's Podcast: [10 growth tactics that never work](https://www.lennysnewsletter.com/p/10-growth-tactics-that-never-work-elena-verna) · [The new AI growth playbook for 2026](https://www.lennysnewsletter.com/p/the-new-ai-growth-playbook-for-2026-elena-verna) (Lovable)
- NotebookLM syntheses (Batu, read 2026-07-27): *The Evolution of Product,
  Growth, and Work in the AI Era* (agency-control ladder, WoM/organic >50%
  benchmark, one-egg TTV, echo-chamber seeding) · *Operational Blueprint for
  Hyperlocal Content Webapp Launch* (sensor–policy–tool–learning loop,
  eval rigor / complaints-as-test-cases; its 20X token-maxing ethos was
  reviewed and **rejected** — see "Explicitly not doing").
