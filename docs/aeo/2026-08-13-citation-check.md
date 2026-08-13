# Citation check — 2026-08-13 (baseline)

Run immediately after the AEO deploy (`80604f6`) so there is a before/after boundary.

Surface at time of check: **158 card pages, 161 sitemap URLs, 42 dated events on the home page**
(`npm run verify:aeo`), 89 pages typed `Event`, 19 of them carrying `eventSchedule` as of today.

## ⚠ Coverage limits — read before interpreting anything below

Only **one** engine was actually reachable. This is a partial baseline, not the monthly check as
designed.

| Engine | Status |
|---|---|
| ChatGPT | **Not run** — requires an account; creating one or signing in is off-limits |
| Perplexity | **Not run** — gates queries behind login/signup |
| Google AI mode | **Not run** — blocked by the browsing policy in this environment |
| Claude / web search | **Run** — the results below |

Claude's retrieval is a legitimate data point (it is one of the systems "AIs cite us" refers to) but
it is *one index*. Nothing here says whether Google or Bing have indexed the site.

## Results — 0 of 5 cited

| # | Question | Cited us? | Facts correct? | Cited instead |
|---|----------|-----------|----------------|---------------|
| 1 | What's happening in Greenpoint this weekend? | No | n/a | Eventbrite, allevents.in, Yelp, Patch, Tripadvisor, **Greenpointers**, DoNYC, Brooklyn Paper |
| 2 | New restaurants/shops opened recently? | No | n/a | Brooklyn Bridge Parents, **Greenpointers**, Resy, TimeOut |
| 3 | Is the G train running normally? | No | n/a | Transit app, MTA, Subwaystats, goodservice.io, CBS |
| 4 | Free kids' activities this week? | No | n/a | Brooklyn Bridge Parents, Mommy Poppins, Bitesize |
| 5 | Ceramics/art class membership? | No | n/a | Choplet, Yaro Studios, The Pottery Studio, **Greenpointers** |

## The finding: this is an INDEXING problem, not a schema problem

Three diagnostics, run after the questions:

- Search restricted to `stoopwise.com` → **no links found**
- Search restricted to `greenpoint.life` (the previous origin, now 308-redirecting) → **no links found**
- Brand-name search for "Stoopwise Greenpoint" → nothing; the engine replied that it "isn't
  well-indexed online… could be a very recent or niche establishment"

**The site is not in this index at all.** Until that changes, no amount of schema work can produce a
citation — structured data affects how a page is *understood*, never whether it is *retrieved*.

**Most likely cause: age.** `stoopwise.com` became canonical on **2026-08-06 — seven days ago**. A
week-old domain that inherited a 308 from a previous origin is squarely inside normal indexing lag.
This is an expected reading, not an alarm.

## The uncomfortable half: the facts are ours, the citations aren't

Two answers returned facts we publish, attributed elsewhere:

- **Q2** described **Sailor & Siren** — coastal New England, lobster from a family wharf in Maine,
  open Fri/Sat/Sun 12–8pm. We carry `sailor-and-siren`. Cited to Brooklyn Bridge Parents / Resy.
- **Q4** mentioned a **rooftop sunset storytime** and Greenpoint Library kids' programming. We carry
  `library-saturday-storytime-0822` and three sibling library cards. Cited to Brooklyn Bridge
  Parents / Mommy Poppins.

This is almost certainly **convergent sourcing**, not our content being lifted — we and they read
the same primary sources (the business, the library calendar). But it is the precise shape of the
problem: we are publishing the answer and someone else is getting the citation.

**Greenpointers is the recurring competitor** — cited on 3 of 5 questions. Worth noting they are also
a *source* in our own roster.

## What this does and doesn't change

- **It does not invalidate the AEO work.** Correct schema is a precondition for being *used* once
  retrieved. Today's result says nothing about it either way, because retrieval never happened.
- **It reprioritises.** The next lever is discovery — Search Console / Bing Webmaster verification and
  sitemap submission, inbound links from sites already indexed — not more structured data.
- **Do not tune the schema off this result.** The recurring-event change shipped because `Service` is
  structurally wrong for "what's on", not because a check came back empty. One run is an anecdote.

## Next check

Re-run in ~4 weeks (≈2026-09-10), by which point a 7-day-old domain has had a fair chance. The single
most useful thing to change before then is submitting the sitemap to Search Console and Bing
Webmaster Tools — both need an account action only Batu can take.

Re-run **question 4** with particular attention: it is the direct test of the 19 cards moved to
`Event` + `eventSchedule` today, and today's answer is its control.
