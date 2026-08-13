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

## The finding: absent from THIS index — but Google has it

Three diagnostics against the same engine:

- Search restricted to `stoopwise.com` → **no links found**
- Search restricted to `greenpoint.life` (the previous origin, now 308-redirecting) → **no links found**
- Brand-name search for "Stoopwise Greenpoint" → nothing; the engine replied that it "isn't
  well-indexed online… could be a very recent or niche establishment"

⚠ **My first reading of this was wrong, and Search Console corrected it the same hour.** "Absent from
one retrieval index" is not "not indexed" — those are different indexes, and the second claim was a
generalisation the evidence didn't support.

### What Google Search Console actually shows (checked 2026-08-13)

| Signal | Value |
|---|---|
| Property | `https://stoopwise.com/` — **already verified** |
| Sitemap | Submitted **Aug 8**, last read **Aug 12**, status **Success**, **143 pages discovered** |
| Page indexing report | 1 indexed / 5 not indexed — but **last updated 8/6**, i.e. stale by a week |
| Reason given for the 5 | **"Crawled – currently not indexed"** (Google systems) |
| Live URL Inspection | `/`, `/e/sailor-and-siren`, `/e/artistic-voices-artudio` → **all "URL is on Google"** |
| Events rich results | **4 valid, 0 invalid** (8/11) |
| Search performance | **6 web-search clicks**, 8/7–8/11 |

So: the sitemap was already submitted, Google has crawled and indexed at least the pages spot-checked
live, it is already parsing our `Event` structured data without errors, and the site is drawing real
(tiny) click traffic. **The dashboard's "1 indexed page" is simply stale** — every page I inspected
live came back indexed.

**The real gap is narrower than "indexing":** we are in Google's index and absent from the retrieval
index behind this engine's answers. That is a distribution/authority problem on a seven-day-old
canonical domain, not a technical one — `"Crawled – currently not indexed"` is Google's way of saying
it saw the page and didn't rate it worth surfacing yet, which is the normal state for a new site.

### Actions taken during this check

- **Requested indexing** for `/` (its `ItemList` changed today) and `/e/artistic-voices-artudio`
  (its schema changed today, `Service` → `Event` + `eventSchedule`). Both accepted into the priority
  crawl queue.

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

- **It does not invalidate the AEO work.** Google is already parsing our `Event` data cleanly (4
  valid, 0 invalid) — the schema layer is doing its job. Today's 0/5 says nothing about it either
  way, because retrieval never happened in that engine.
- **It reprioritises, but not toward what I first said.** Sitemap submission was already done a week
  ago. The remaining lever is **authority**: inbound links from sites already indexed, and time.
  Structured data is not the constraint.
- **Do not tune the schema off this result.** The recurring-event change shipped because `Service` is
  structurally wrong for "what's on", not because a check came back empty. One run is an anecdote.

## Bing Webmaster Tools — set up the same day

Verified via **Import from Google Search Console** (no code change, no DNS). Everything came across:

| Signal | Value |
|---|---|
| Sitemap | imported, last crawl 8/13, **Success**, **161 URLs**, 0 errors, 0 warnings |
| Home page | **"Indexed successfully — URL can appear on Bing"** |
| Request indexing | submitted for `/`; quota is **100 URLs/day** (far more generous than Google's) |

Two findings worth carrying forward:

**1. `AI Performance` (BETA) is a real instrument for Layer 3.** Bing reports citations of the site in
AI-generated answers across "Microsoft Copilots and Partners" — continuously, no manual asking.
Current reading: **0 citations, 0 cited pages over 3 months**, matching today's manual result. This
should become the *primary* Layer 3 signal, with the manual question set kept as the qualitative
half (it is the only thing that catches *wrong facts* attributed to us, which a citation counter
cannot see).

**2. ⚠ Bing independently flags `H1 tag missing` on the home page.** That is the zero-prose gap,
caught by an outside tool with no knowledge of this thread: the served HTML has an empty `#root`, so
the `<h1>` React renders is invisible to anything that doesn't run JS. It is the deferred home-page
decision, now with third-party evidence attached — and notably Bing files it under "SEO/**GEO**"
issues, generative-engine optimisation being exactly the goal here.

## Still outstanding

- **The three named engines remain unmeasured.** Today's baseline covers one index only.
- **IndexNow is available and unused.** Bing supports instant push-on-publish, which fits a feed that
  refreshes daily — it would tell Bing about new cards the moment a routine ships instead of waiting
  for a crawl. Needs a key file at the site root, so it costs a deploy.

## Next check

Re-run in ~4 weeks (≈2026-09-10), by which point a 7-day-old domain has had a fair chance and the two
requested recrawls will have landed.

Re-run **question 4** with particular attention: it is the direct test of the 19 cards moved to
`Event` + `eventSchedule` today, and today's answer is its control.

Also re-check the **Page indexing** report — today's was a week stale, so the honest number of
indexed pages is unknown. If it still says 1 of 143 in September, that is a real signal rather than
a reporting lag.
