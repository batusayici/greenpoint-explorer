# Citation check — the only layer that measures whether any of this works

**Cadence:** monthly, and after any change to the AEO surface.
**Time:** ~15 minutes. **Automatable:** no, deliberately.

## Why this is manual

`npm run verify:aeo` proves the machine surface is **correct**. `npm run verify:agent-browser` proves
an agent that executes JS gets a **usable product**. Neither proves an answer engine actually **cites
us** — that depends on indexing, ranking and model behaviour we don't control and can't stub.

Scripting it would also be self-deceiving: answer engines personalise, cache, and vary run to run, so
an automated "did we appear" check would produce a green tick with no information in it. A human
reading the actual answer is the measurement.

## The question set

Fixed on purpose — changing the questions each month destroys the trend. Ask each one **in a fresh
session with no prior context**, on ChatGPT (search on), Perplexity, and Google AI mode.

| # | Question | What we're testing |
|---|---|---|
| 1 | What's happening in Greenpoint, Brooklyn this weekend? | The core claim. Event/Schedule data doing its job |
| 2 | Any new restaurants or shops that opened in Greenpoint recently? | LocalBusiness + new_business cards |
| 3 | Is the G train running normally in Brooklyn right now? | Civic/news timeliness — the freshest thing we publish |
| 4 | Are there free kids' activities in Greenpoint this week? | Recurring programming — the 19 cards moved to `Event` + `eventSchedule` on 2026-08-13 |
| 5 | Where can I find a ceramics or art class membership in Greenpoint? | `Service` cards, the type answer engines match least well |

Question 4 is the one to watch: it is the direct test of the recurring-event schema change, and the
control is that it was previously answerable only by cards typed as `Service`.

## What to record

Create `docs/aeo/YYYY-MM-DD-citation-check.md` from this template:

```markdown
# Citation check — YYYY-MM-DD

Surface at time of check: <N> card pages, <N> sitemap URLs, <N> dated home events
(from `npm run verify:aeo`)

| # | Engine | Cited us? | Facts correct? | Notes |
|---|--------|-----------|----------------|-------|
| 1 | ChatGPT | | | |
| 1 | Perplexity | | | |
| 1 | Google AI | | | |
| … | | | | |

## Wrong facts found
<!-- Anything an engine stated about Greenpoint that we publish differently.
     A WRONG fact attributed to us is more urgent than a missing citation. -->

## Competitors cited instead
<!-- Who is being cited for our questions. This is the useful signal in a month
     where we're not cited at all. -->
```

## Reading the result

- **One month is an anecdote.** Attribution is noisy and indexing lags; treat a single run as a data
  point, never as a verdict on a change.
- **A wrong fact attributed to us outranks a missing citation.** Being cited incorrectly damages the
  thing the whole product is built on — "verified and sourced" — while being uncited is just
  invisibility. Chase wrong facts the same week.
- **Who gets cited instead is the most useful line in a bad month.** It tells you what shape of
  source the engine prefers for these questions, which is actionable in a way "we didn't appear" is
  not.
- **Don't tune the schema off one bad month.** The 2026-08-13 recurring-event change was made
  because `Service` is structurally wrong for "what's on", not because a check came back empty.

## Related

- `npm run verify:aeo` — machine surface (Layer 1)
- `npm run verify:agent-browser` — JS-executing agents (Layer 2)
- `docs/environmental-dependencies.md` — why the agent layer exists at all
- `docs/DECISION_LOG.md` 2026-08-13 — the three entries that produced this
