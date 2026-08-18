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
- Cockpit state: `docs/launch/gtm-state.json` (Batu's single view of the launch;
  this run updates it — see step 4.5) rendered by `node scripts/build-cockpit.mjs`

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
· feed density with per-category cut — cards + dated-in-window by filter, from
cards.json (added 2026-08-15; surfaces a thinning category between sweeps)
· Loop C split (P10, 2026-08-15): citations (monthly check) and AI-referrer
sessions as their own lines, apart from organic — citations up with sessions
flat is Loop C working zero-click, never a fail read

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

### 4.5 Update the cockpit state

`docs/launch/gtm-state.json` is Batu's single view of the launch, and it is only
worth having if it can't drift from the readout. Update it in the **same commit**
as the readout — same rule as a new source domain in `.claude/settings.json`.

Write only what this cycle actually established:

- `meta.asOf`, `meta.lastDataPull`, `meta.nextReadout`
- `metrics[].value` / `.prior` / `.trend` / `.caveat` from this run's pull
- `experiments[].actual` / `.readAt` / `.verdict` / `.implication` — the read you
  computed in step 2, against the rule you copied verbatim, never a softened one
- `gates[].actual` / `.readAt`
- `channels[].sent` / `.firstSession` / `.shared` / `.reply` — the **primary**
  send log (ratified 2026-08-15; the roster's P4 table is the narrative
  mirror). `shared` = the org's own channel carried the link, confirmed from
  the Monday roster snapshots — never inferred from session counts
- `milestones[].status` — done / live / next / blocked, and `.outcome` when one lands
- add to `openDecisions[]` anything this readout hands Batu

**Never** write a verdict Batu hasn't ratified: a computed read is `verdict:
"not yet read"` or the rule's own word (`hold`, `continue`, `kill`), and a
decision stays in `openDecisions` until it lands in `DECISION_LOG.md`. Leave a
field `null` rather than guessing — the page renders `—` and that is honest.

Then `node scripts/build-cockpit.mjs` and commit the regenerated
`docs/launch/cockpit.html` alongside. Republishing the page is Batu's step (it
publishes to an artifact URL, outside the PR gate).

### 5. Open the PR (the gate)

1. `npm test` (sanity — this skill ships no code, but readouts ride the repo).
2. Commit the readout (+ the cockpit state and regenerated page from 4.5 + any
   channel-links rows + standing-instruction edits)
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

- **(proposed 2026-07-28, cycle 1 — RATIFIED by Batu 2026-08-06, corrected to
  three failure modes.)** When the analytics pull fails, **diagnose before
  declaring `[data pending]`.** The cheap first question is *did the whole pull
  fail, or individual queries?* — it separates mode 3 from modes 1 and 2:
  1. **Env vars absent** — `POSTHOG_*` not set, so nothing can authenticate.
     Whole pull fails. Fix: set them.
  2. **Egress denied** — `$HTTPS_PROXY/__agentproxy/status` shows a denial for
     `us.posthog.com`. Whole pull fails, and it looks identical to mode 1 from
     the output alone, which is why this check is not optional. Fix is
     environmental and **Batu's** (the cloud env's network preset, DECISION_LOG
     2026-07-28) — report it and stop; never route around it.
  3. **PostHog free-tier execution limit** — *some* queries return `ERR` while
     others return normally. Cycle 2 saw `DROPPED` and `FILTER TAPS` do this;
     cycle 3 saw both return with no fix applied, so it is **transient**.
     Neither env nor egress, and `[data pending]` for the whole readout would be
     wrong: report that one metric as unavailable, name the query, and retry or
     narrow its window. Do not "fix" the script for this.
  The three have different fixes and different owners. This line originally
  recorded only two; the third was learned in cycles 2–3 and is the one most
  likely to be misdiagnosed, because a partial pull still looks like a working
  pull.
- **(proposed 2026-07-28, cycle 1 — RATIFIED by Batu 2026-08-06.)**
  Split every metric by `$host` before reporting it. `localhost:*` and LAN dev
  servers land in the same PostHog project as production and were 34% of all
  events on 2026-07-28. Report production only, and say so in the readout.
  **The production host list is `GL_PROD_HOSTS` in `scripts/posthog-pull.sh` —
  read it, never hardcode it here.** This line used to name the hosts inline
  and was already stale within four days: it said "`greenpoint.life` and
  `greenpoint-explorer.vercel.app`", which after the 2026-08-06 Stoopwise
  rename **omits `stoopwise.com`, the canonical origin**. Ratifying it as
  written would have dropped production traffic from every readout. One list,
  one place — the same lesson as the duplicated-config instruction below.
- **(2026-08-03, cycle 2 — derived from Batu's amendment above)** When the
  product's origin changes, a `$host` filter **unions** the old and new hosts
  for as long as the old host still serves live links — never swap one for the
  other. The old origin keeps receiving traffic from every link already sent.
- **(2026-08-03, cycle 2 — derived from Batu's L7 commit `2091b95`)** A config
  value named in a runbook step is not the only copy of it: grep for
  hand-written duplicates before calling the step done. Launch-plan §2 step 3
  named only `AEO_ORIGIN`, but `index.html`'s OG/Twitter URLs are hand-written
  and would have kept advertising the old origin to every scraper.
- **(2026-08-03, cycle 2 — RATIFIED by Batu 2026-08-06.)**
  Never put a card count in outbound copy without regenerating it the morning it
  is sent. Org card counts are true for about a day — two of cycle 1's three Q1
  drafts were falsified by ordinary expiry within a week (7 → 2 cards, 8 → 2).
- **(2026-08-03, cycle 2 — WITHDRAWN 2026-08-04, cycle 3.)** ~~`scripts/posthog-pull.sh`
  line 9 (`. ./.env.local` under `set -euo pipefail`) aborts the script in
  cloud.~~ The guard shipped 2026-07-28 in `2b50f05`, *before* cycle 2 wrote
  this; the run was reading a stale working copy. The committed script runs
  clean unmodified in cloud — do not patch it.
- **(2026-08-04, cycle 3 — RATIFIED by Batu 2026-08-06.)**
  **Verify the checkout is current with `origin/main` before diagnosing any
  script, config, or data defect** — `git fetch origin main && git rev-parse
  HEAD origin/main`. Cycle 2 proposed a fix that had shipped six days earlier
  because it quoted a stale working copy as if it were live.
- **(2026-08-04, cycle 3 — RATIFIED by Batu 2026-08-06.)**
  **The production `$host` filter applies to every number that leaves the
  readout — including numbers inside outbound copy and "top card" claims** — not
  just the metrics tables. Cycle 2 filtered its tables correctly and then
  deleted a true outbound line on the strength of an unfiltered query
  (`moon-bunny-back-to-school`: 15 opens total, 2 in production).
- **(2026-08-04, cycle 3 — RATIFIED by Batu 2026-08-06.)**
  **Every production check opens the `?src=verify` link from
  `channel-links.md`** — cutover verification, spot-checks, demos, incognito
  windows, second devices. An untagged internal visit is indistinguishable from
  a real one and sits in the activation denominator permanently; ten such
  visits moved three headline rates by a quarter on 2026-08-03/04.
  **Batu confirmed on 2026-08-06 that the 08-03/04 burst was his own**, so
  cycle 3's Finding 2 is a measurement artifact, not an activation signal — the
  pre-burst figures are the true ones and no numerator ever moved. Say which
  population you mean whenever you compare against cycle 3's numbers.
- **(2026-08-06, Batu — the funnel clock starts at launch communication.)**
  **Do not retro-clean the historical data**; the option to exclude those ten
  person IDs from the pull was offered and declined. Everything before the
  first launch send is pre-acquisition noise and is **not** the demand-gate
  denominator. Clean funnel tracking begins with Wave 1, when tagged traffic
  starts arriving. Report pre-Wave-1 rates as directional only, and never cite
  them as a gate read.
- **(2026-08-12, Batu — adopted from the cycle 4 readout, PR #31.)** **Every
  outbound draft must name "Stoopwise Greenpoint" in the body.** Before the
  2026-08-06 rename the origin told the recipient what they were about to open;
  `stoopwise.com` does not, and CLAUDE.md requires the neighborhood on every
  title, meta and machine surface because that keyword is what search and answer
  engines match on. **A link alone is now an unlabelled link** — treat a draft
  without the neighborhood in the body as a defect, not a style preference.
  (The same readout proposed a geo/engagement-split diagnostic rule; Batu
  declined it on 2026-08-12. Do not re-add it — reporting the split inside a
  readout is still fine, it just is not a standing rule.)
- **(proposed 2026-08-18, cycle 5 — pending ratification.)** **`$pageview`
  carries no `src`; read every channel off its custom events.** All 339
  production pageviews on 2026-08-18 sat in the untagged row, and every
  campaign row in the pull's channels table read `views 0` — including
  `friends-family`, which demonstrably produced visits (16 people, 39 card
  opens). Attribution rides `card_open` / `filter_tap` / `return_visit` and the
  rest. P3's "≥1 session per sent `src`" is therefore a check on
  **people/events**, never on the `views` column; reading that column as visits
  would report a landed channel as dead.
- **(proposed 2026-08-18, cycle 5 — pending ratification.)** **Split by `src`
  before splitting by geography.** "Non-local" stopped meaning "automated" the
  moment a founder-sent WhatsApp message reached friends abroad: non-local
  *engaged* people went 4 → 16 in one week, and 11 of the newcomers were a
  Turkish cluster firing filter taps, card opens and an `action_tap` — P1's
  untagged echo, not bots. The automated cohort is still there and still
  passive (Paris, Council Bluffs, Eatonton: one card open between 47 people),
  but geography alone can no longer tell the two apart. This does **not**
  reinstate the declined standing geo rule above — it is a constraint on how
  the split is read when a readout chooses to report it.
