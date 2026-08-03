---
name: growth-weekly
description: Growth Operator weekly cycle — pull analytics, compute each live experiment's read against its pre-registered decision rule, draft the Tuesday readout + top-3 proposals + outbound copy, and open a review PR. Drafts and recommends only — never sends, never deploys, never invents numbers. Use when Batu says "run the growth loop", "growth readout", "Tuesday readout", or /growth-weekly.
---

# Growth Operator — Tuesday readout cycle

The weekly growth loop as a semi-autonomous operator (growth-engine §7). The
operator **senses, computes, drafts, and recommends**. The PR is the review
gate: **merging is the only way any of its output becomes real.**

## Authority — read before running (hard rules)

- **Autonomy ladder governs:** `docs/growth/growth-engine.md` §7. Everything
  this skill produces is V1/V2 — a draft or a recommendation. Do not represent
  a recommendation as a decision.
- **Never send anything.** Digest emails, org notes, posts — draft in full,
  ready to paste; Batu sends. No exceptions, regardless of any prior approval.
- **Never deploy, never touch main.** All output lands on a
  `growth/readout-<date>` branch as a PR.
- **Never compose links.** Every URL in every draft is copied from
  `docs/launch/channel-links.md`. A channel not in the table → add the row *in
  the same PR* (kebab-case `src`), flag it as new.
- **Never invent numbers.** Every metric in the readout traces to a script
  output quoted in the run. Missing data → say "no data", never estimate.
- **Max 3 live experiments** (growth-engine §6). A top-3 proposal list may
  include at most one new experiment, and only with pre-written kill criteria.
- **Card/content changes are out of scope** — that's `/ingest-newsletters`.
- **Model tiering:** scheduled runs use the Opus orchestrator (2026-07-25 cost
  decision — never Fable for scheduled runs). Judgment-bearing drafting stays
  in the orchestrator; no subagent fan-out is needed at current scale.

## Files & tools

- Strategy + rules of record: `docs/growth/growth-engine.md` (§2–4 hold each
  experiment's pre-registered decision rule; §6 the system; §7 the ladder)
- Launch runbook: `docs/launch/2026-07-27-launch-plan.md`
- Analytics: `./scripts/posthog-pull.sh` (needs `POSTHOG_READ_KEY` +
  `POSTHOG_PROJECT_ID` from `.env.local` or environment — scoped read key;
  never `VITE_`-prefixed)
- Links: `docs/launch/channel-links.md` (copy, never compose)
- Readouts: `docs/growth/readouts/YYYY-MM-DD.md` (this run's output; the
  previous one is this run's state — it lists what's live)
- Decisions: `docs/DECISION_LOG.md` (read-only for the operator; verdicts Batu
  ratifies land there via the merged PR or a follow-up Batu edit)

## The loop

### 0. Orient (state, no judgment)

1. `git checkout -b growth/readout-<YYYY-MM-DD>` off up-to-date `main`.
2. Read the **latest file in `docs/growth/readouts/`** — it lists the live
   experiments, their start dates, and last week's reads. First run ever:
   bootstrap the live list from the launch plan §4 slate (R1, Q1, Q2 — only
   those actually started; pre-launch, the list may be empty and the readout is
   a baseline report).
3. Read growth-engine §2–4 rows for each live experiment — the decision rule
   and kill criteria are pre-registered there; **never re-derive or soften
   them.**

### 1. Sense (deterministic first)

1. Run `./scripts/posthog-pull.sh` and capture the full output: funnel,
   channels (`?src=`), filter taps, top cards, retention days, repeat visitors.
2. The script filters to production hosts and computes the WRL and activation
   proxies itself (2026-07-28) — read them from its output rather than
   hand-rolling queries, which is how the first cycle's funnel numbers went
   wrong. It also prints a `DROPPED` table of non-production traffic: skim it,
   and if a *production* host ever appears there, fix `GL_PROD_HOSTS` before
   reading anything else. Still computed by hand: per-`src` week-2 return, and
   organic share (sessions with no `?src=` net of known direct — the >50%
   word-of-mouth signal, monthly read).
3. **Cloud fallback:** if the pull fails, do not fabricate — mark every
   quantitative section `⚠ analytics pending: run ./scripts/posthog-pull.sh
   locally and paste`, finish the qualitative half, and flag the PR title with
   `[data pending]`. **Diagnose which failure it is before reporting** — there
   are two, with different fixes (2026-07-28):
   - *Missing secrets:* `POSTHOG_READ_KEY` / `POSTHOG_PROJECT_ID` absent. Fix:
     add them to the routine's environment at claude.ai/code. (The script's
     `. ./.env.local` line fails in cloud regardless — `.env.local` is local
     only; when the vars are already exported, run the queries without it.)
   - *Egress denial:* vars present but `curl` returns `CONNECT tunnel failed,
     response 403`. Confirm with `curl -sS "$HTTPS_PROXY/__agentproxy/status"` →
     `recentRelayFailures` naming `us.posthog.com:443`. This is an org
     network-policy block; **never route around it** — report the blocked host.
     Fix: allowlist `us.posthog.com` in the routine's environment.
4. Qualitative sensors: new business submissions/asks since last readout
   (Tally exports / Batu-forwarded replies noted in the previous readout),
   anything the week's ingest PRs flagged as demand signal.

### 2. Compute each live experiment's read

One line per experiment, mechanical against its pre-registered rule:

> `R1 digest — metric: src=digest return sessions … — read: <numbers, pre vs post> — rule says: <continue | kill | graduate> — recommendation + confidence note`

The rule's verdict is computed; the **recommendation is labeled as a
recommendation**. Kill/graduate is Batu's call at merge (ladder V1).

### 3. Draft the readout — `docs/growth/readouts/YYYY-MM-DD.md`

Template:

```markdown
# Growth readout — YYYY-MM-DD  (operator draft; verdicts pending Batu)

## Metrics this week
WRL proxy · activation rate · organic share · per-src table (quoted from pull)

## Live experiments (max 3)
One line each per §2 above.

## Top-3 proposals (≤1 new experiment, kill criteria pre-written)
1–3, each: hypothesis → smallest test → metric → decision rule → kill criteria.

## Outbound drafts (Batu sends; links copied from channel-links.md)
Full paste-ready copy for anything proposed/live (digest, org notes, posts).

## Calibration log
Edits Batu made to last week's drafts → standing instruction derived from each
(these get appended to SKILL.md "Standing instructions" in the same PR).

## Next-week state
Live list going forward · data Batu needs to provide · promotions proposed
(ladder §7: only after 3 clean cycles).
```

### 4. Calibrate (learning edge)

Diff last week's merged readout against what this skill drafted: every material
Batu edit becomes a one-line **standing instruction** appended to the section
below — the growth version of "every complaint becomes a test case." Propose
ladder promotions only per §7's rule (3 clean cycles + reversible + inside kit
rules), in the readout, never self-granted.

### 5. Open the PR (the gate)

1. `npm test` (sanity — this skill ships no code, but readouts ride the repo).
2. Commit the readout (+ any channel-links rows + standing-instruction edits)
   and open a PR titled `growth: readout YYYY-MM-DD` whose body is the readout
   itself. **Stop there.** Merging = Batu's review; closing discards the cycle.

## Cloud routine (created 2026-07-27, **enabled** — confirmed live 2026-08-02, L8)

`greenpoint-tuesday-growth-readout` (`trig_01RWSr6yE5tsPuv5EzpZCjYq`,
claude.ai/code/routines) mirrors the ingest routines: Tuesdays 9:30 ET (cron
`30 13 * * 2` UTC — shift when DST ends, like the ingest crons), Opus
orchestrator (never Fable for scheduled runs), repo checkout, PR-only output.

Proven end to end 2026-07-28: real PostHog pull, merged readout
(`docs/growth/readouts/2026-07-28.md`). A second cycle was triggered manually
2026-08-02 to validate the pipeline against the L7 domain cutover.

**What made it work:** (1) this skill + the launch plan merged to main (the
cloud checkout reads them from there); (2) `POSTHOG_READ_KEY` +
`POSTHOG_PROJECT_ID` in the routine's environment **and `us.posthog.com`
allowlisted in its network policy** — both are required, and the 2026-07-28
run proved the vars alone are not enough (they were present; the egress proxy
returned 403 on CONNECT). Without both, every run lands `[data pending]`. Local
`/growth-weekly` invocations remain the fallback if cloud misbehaves.

## Standing instructions (calibration output — append-only)

- **(proposed 2026-07-28, cycle 1 — operator-derived, pending Batu; drop this
  line if unwanted)** When the analytics pull fails in cloud, diagnose before
  declaring `[data pending]`: check whether the env vars are present *and*
  whether `$HTTPS_PROXY/__agentproxy/status` shows an egress denial for
  `us.posthog.com`. The two failures have different fixes, and this skill
  previously recorded only one of them.
- **(proposed 2026-07-28, cycle 1 — operator-derived, pending Batu; drop this
  line if unwanted)** Split every metric by `$host` before reporting it.
  `localhost:*` and LAN dev servers land in the same PostHog project as
  production and were 34% of all events on 2026-07-28. Report production only
  (since the 2026-08-02 cutover that means **both** `greenpoint.life` and
  `greenpoint-explorer.vercel.app` — the old host still serves already-sent
  invite links, so filtering to one host drops real traffic), and say so in the
  readout.
