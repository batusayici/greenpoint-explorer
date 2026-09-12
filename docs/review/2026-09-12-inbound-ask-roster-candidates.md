# Roster candidates from the two inbound asks (2026-09-12)

Batu asked for these to be investigated as roster additions, and ruled that being
slightly outside the geography gate is acceptable "since this proves demand."

**Status: CLOSED, 2026-09-12. ABC Cirque, TALEA (Williamsburg) and McCarren Park
House are all in the roster.** The first pass of this doc said it could not be closed from
a cloud session, because the egress proxy 403s both hosts for `curl` and
WebFetch alike. That was the wrong conclusion: the fetch does not have to happen
in this session's sandbox. Batu pointed at the mechanism built on 2026-09-08 for
exactly this, and `snapshotBundle.js:80` says it outright — "the fix is to
dispatch the workflow again." Both candidates were fetched on GitHub runners by
dispatching `ingest-fetch` with a new `--only` input against a branch carrying
probe entries (runs 34698842810 and 34699029209). Probe mode publishes nothing,
so the shared snapshot bundle was never touched. Results below; the full
measurements live in each roster entry's `notes`, per the seventh test.

## They are not two businesses asking to be listed

| | ABC Cirque | The TALEA ask |
|---|---|---|
| Who asked | Ali Goldberg, who says "I help a small cirque/arts org" | Kathleen Kyllo, a parent hosting one event |
| Asking for | Their org, ongoing | One event, "tomorrow morning" — Sep 12 per TALEA's own calendar |
| Venue | 5th Wall Studio, Williamsburg | "the @taleabeer Taproom in Williamsburg" |
| Is this a roster candidate? | **Yes** — an org with recurring classes | **No, as asked** |

The second ask is a **card submission, not a roster addition**, and the thing
behind it splits in two:

- **The Clixo × TALEA pop-up itself** is a one-off. It is dated **Sep 12**, not
  Sep 13 — this doc first inferred the date from "tomorrow morning" without a
  source, and TALEA's calendar settles it: "BYO Baby with CLIXO! WIlliamsburg"
  sits under September 12. Either way it is over before it could be carded.
- **TALEA's own taproom events calendar** may be a perfectly good venue source —
  but on its own merits, not because somebody asked. It should be evaluated like
  any other venue, and it is worth noting TALEA was already held once as
  out-of-area when a Greenpointers roundup carried it
  (`held-cards-2026-08-12-greenpointers.md`) — held for lack of a read address,
  not because coordinates were checked and failed.

## The bbox question turned out to be moot

Worth keeping, because it is what made the question worth measuring rather than
waving through: the box is not advisory. `cardSchema.js:360` — `validateCard`
raises `coords outside Greenpoint` for any card whose coordinates fall outside
`GREENPOINT_BBOX`, and `:363` does the same per venue, so an out-of-bbox card
fails `npm test`. `scripts/geocode-demand-cards.mjs:58` treats an out-of-bbox
Nominatim hit as a MISS, so such a venue gets no coordinates at all. Relaxing
the gate therefore means either a pinless card or widening the box for every
card and source at once — and the box exists because "Nominatim sometimes lands
in the wrong borough."

**None of that is needed here.** 5th Wall Studio is at **156 North 4th St #7**,
and North 4th Street geocodes to **40.7152, −73.9585**, against a box that
reaches 40.712. ABC Cirque is *inside* the existing envelope. "Williamsburg" was
a neighborhood name doing the work of a coordinate — the same mistake the
2026-08-12 Greenpointers hold made from the other direction.

One practical catch for whoever cards it: Nominatim has no entry for "156 North
4th Street" itself, only a street-level match, so a card may need its coordinates
from a cross-street query or it will land pinless.

## Where they stand against the seven source tests

| # | Test | ABC Cirque | TALEA calendar |
|---|---|---|---|
| 1 | In bbox, or items carry addresses | **PASS** — 40.7152, −73.9585, inside | outside; no Greenpoint location among six taprooms |
| 2 | Locally owned, not a chain, **not asking for placement** | one studio, two founders; **asked** — Batu's call, made | **SIX taprooms — the live question** |
| 3 | Publishes quotable facts | **PASS** — days, times, tuitions, session dates | dates and names only; **no times, no prices** |
| 4 | Does not refuse automated readers | **PASS** — no `Disallow: /`; see note below | **PASS** — Shopify stock, `Allow: /` |
| 5 | Nothing paywalled or truncated | **PASS** — 7,822 bytes, plain fetch | 2,557 bytes, browser only (21+ age gate) |
| 6 | Public surface, no private contact details | **PASS** — business email and phone only | **PASS** |
| 7 | **Fetched, with the measurement in `notes`** | **PASS** — run 34698842810 | **PASS** — run 34699029209 |

**Test 4 on ABC Cirque, because the answer inverted the expectation.** Their
`robots.txt` lists `anthropic-ai`, `ClaudeBot`, `GPTBot` and a dozen more — but
those `User-agent:` lines are grouped with `User-agent: *`, and the only rules
are `/config`, `/search`, `/account`, `/api/`, `/static/` and query-string
patterns. There is no `Disallow: /` in the file, so the class page is not
disallowed for anybody. Batu's consent ruling of the same day therefore carries
no weight on this source; it stands for the next case. `?format=ical` *is*
disallowed, so their iCal export is off-limits.

## ABC Cirque: added

All seven pass, and the ask was Batu's to accept, which he did. It is in the
roster as `abc-cirque` with the full measurement in its `notes`, and
`abcirque.com` is in the tracked `.claude/settings.json`.

The cardable listing is Family Adventure Play — ages 5 and under with an adult,
Sundays 11am–12:30pm on **September 27, October 18 and November 15**, $30 early
bird for one adult/child combo and $10 per extra family member, $40 late. The
weekly trimester classes are mostly sold out and read as enrolment rather than
something to turn up to.

One loose end: the ask came from Ali Goldberg, who described herself as helping
the org rather than owning it. Worth one line of confirmation when Rana replies,
per the decision-log entry.

## TALEA: added on Batu's ruling, over the recommendation

He weighed the chain question and ruled it in — the Williamsburg taproom only,
on the grounds that it is close enough to Greenpoint and it is the event a
reader actually asked for. It is in the roster as `talea-williamsburg`.

Two constraints live in its `notes` because neither is enforced by anything:

- **"Williamsburg only" is an authoring rule, not a filter.** The page is one
  citywide month grid covering six taprooms, `feed: {include: []}` is RSS/Atom
  only (`fetch-sources.mjs` ~line 218), and this is browser-fetched HTML. So
  every fetch brings back Bryant Park and West Village events too, and only an
  item whose own text names Williamsburg may be carded.
- **The grid has no start times and no prices**, so it cannot produce a
  complete card by itself. An item with no sourced start time does not ship.

**The detail pages are still unsolved, and this is how far it got.** Batu says
the start times live on event detail pages. They are not Shopify pages — the
pages sitemap lists 17 and none are events — and not in the readable part of
the products sitemap. A `detail.match` probe built from slug words taken from
real listing titles harvested nothing: the snapshot came back as the bare grid
with no detail text appended, which means the entries are not anchors carrying
those words in their hrefs. That reads as a JavaScript calendar widget opening
a modal or a JS-routed view rather than a crawlable page.

**What unblocks it: one example detail URL**, copied from the address bar after
clicking an event — exactly how `/hello` got solved for McCarren. With one
example the pattern goes straight into `detail.match`.

## McCarren Park House: added

Batu asked for `mccarrenparkhouse.com/events`. **That page does not exist** —
146 characters in a real browser — and their sitemap lists only four pages, so
there was no tidier path to substitute. He then supplied `/hello`, which is the
site's "Upcoming" page and is not guessable from the outside.

It reads clean: **plain fetch, 2,937 bytes, 73 lines, no browser needed**, about
forty dated listings from Sep 10 to Dec 17 — North Brooklyn Chess Club, New York
Philosophy Club, Brooklyn Euchre Club, Songwriter Sundays, Skip the Small Talk,
Hobby Con trivia, and one-off music bills. Each listing carries its day, date
and time inside the title string itself; there is no separate date field and no
detail page, so the title is the whole record.

Geography is not in question: **855 Lorimer Street, in McCarren Park**, and the
park geocodes to 40.7212, −73.9529 — inside the existing bbox. Robots is the
same Squarespace stock file as ABC Cirque, with no `Disallow: /`.

Two authoring warnings are in its `notes`. **No prices appear anywhere on the
page**, so no card off this source may claim free. And **their own listings
carry typos** — "September 19rd", "Pique Community Hangs Tuesday September
Tuesday 22nd", "Thursday September 17" with no suffix. A parser must not
silently resolve those into a date; where a listing is genuinely ambiguous, hold
the card.

## What this round changed about probing

Probe mode was built here and is worth knowing about for the next candidate:
dispatch `ingest-fetch` with an `only` list against a branch, and the roster
hopeful gets fetched on a GitHub runner with byte counts and snapshot heads
printed to the log. It publishes nothing, so the shared bundle is untouched.

One flaw surfaced and was fixed in the same round: with three sources a single
dead URL is 33% and tripped the 15% roster-unreadable ceiling, reporting a
healthy roster as broken. Probe mode now passes `--allow-degraded`, since that
ceiling exists to stop a thin *ingest* shipping and a probe ships nothing.
