# Roster candidates from the two inbound asks (2026-09-12)

Batu asked for these to be investigated as roster additions, and ruled that being
slightly outside the geography gate is acceptable "since this proves demand."

**Status: MEASURED AND CLOSED for ABC Cirque, 2026-09-12. TALEA is held on one
question for Batu.** The first pass of this doc said it could not be closed from
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

## TALEA: held on one question

**Batu's condition is met.** The event a commenter asked us to carry is in their
calendar: September 12 reads "BYO Baby with CLIXO! WIlliamsburg", with a second
on September 26 at Cobble Hill. The real path is `/pages/calendar` — the
`/events` URL guessed first returned a 725-byte Shopify 404 — and it needs a
browser fetch because of an "ARE YOU OVER 21" age gate.

Three things were not in hand when that condition was set, and they are why this
is back with him rather than added:

1. **It is not one business.** Six taprooms — Williamsburg, Upper West Side,
   Cobble Hill, West Village, Bryant Park, Penn District — and none in
   Greenpoint. The roster's "locally owned and not a chain" test is the one that
   kept Warsaw off, and this is the same shape. It also touches what the product
   is *for*: Josh read the exclusion of big business as the identity of the thing
   (L2026-08-02), not as a coverage gap.
2. **The calendar cannot support a card as it stands.** The month grid carries
   event names and days but no start times and no prices, so a card off it could
   not say when anything begins. Cardable listings would need the detail pages
   behind each entry — another probe.
3. **A citywide calendar needs a filter.** Almost every listing is at a
   non-Greenpoint taproom, so it would need a feed include-filter to stay
   Williamsburg-only.

**Recommendation: don't add it.** A six-location brewery is not the business the
roster rules were written to protect, the calendar cannot produce a complete card
today, and the event that prompted the ask is already past. If the answer is to
carry it anyway, the honest way in is the detail pages plus a Williamsburg-only
filter, and the chain question should be settled in the decision log rather than
inside a roster note. Worth knowing either way: their Sep 21 listing is "Pilates
& Pints with Greenpoint Pilates Studio" — a Greenpoint business hosting there, so
some Greenpoint supply does pass through this calendar.
