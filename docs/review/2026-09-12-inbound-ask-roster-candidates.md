# Roster candidates from the two inbound asks (2026-09-12)

Batu asked for these to be investigated as roster additions, and ruled that being
slightly outside the geography gate is acceptable "since this proves demand."

**Status: cannot be closed in a cloud session.** Neither candidate's website is
reachable from here — the sandbox egress proxy answers 403 to CONNECT for both
hosts, for `curl` and for WebFetch alike. The roster's seventh test requires the
source to be **fetched in the same session with the measurement written into its
`notes`**, so adding either one from here would be adding it from reputation,
which is the failure this rule exists to prevent (Yaro's JavaScript-rendered
workshops page). What is written below is everything decidable without a fetch,
plus the exact battery to run when one is possible.

## They are not two businesses asking to be listed

| | ABC Cirque | The TALEA ask |
|---|---|---|
| Who asked | Ali Goldberg, who says "I help a small cirque/arts org" | Kathleen Kyllo, a parent hosting one event |
| Asking for | Their org, ongoing | One event, "tomorrow morning" (Sep 13) |
| Venue | 5th Wall Studio, Williamsburg | "the @taleabeer Taproom in Williamsburg" |
| Is this a roster candidate? | **Yes** — an org with recurring classes | **No, as asked** |

The second ask is a **card submission, not a roster addition**, and the thing
behind it splits in two:

- **The Clixo × TALEA pop-up itself** is a one-off, dated for Sep 13, evidenced
  only by an Instagram post. Instagram is not fetchable by this project's
  fetcher, so it cannot clear the verbatim-quote test either. It expires before
  it could be verified.
- **TALEA's own taproom events calendar** may be a perfectly good venue source —
  but on its own merits, not because somebody asked. It should be evaluated like
  any other venue, and it is worth noting TALEA was already held once as
  out-of-area when a Greenpointers roundup carried it
  (`held-cards-2026-08-12-greenpointers.md`) — held for lack of a read address,
  not because coordinates were checked and failed.

## "Slightly outside the bbox" is a schema error, not a soft preference

This matters before the call is made, because the bbox is not advisory:

- `cardSchema.js:360` — `validateCard` raises `coords outside Greenpoint` for any
  card whose coordinates fall outside `GREENPOINT_BBOX`, and `:363` does the same
  per venue. **An out-of-bbox card fails `npm test`.**
- `scripts/geocode-demand-cards.mjs:58` — the geocoder treats an out-of-bbox
  Nominatim hit as a **MISS**, so such a venue gets no coordinates at all.

So a venue outside the box lands in one of three places, each with a cost:

1. **Ships with no coordinates** — in the feed, absent from the map. Allowed
   today only for cards carrying `venues` (`julyCards.test.mjs:2073`).
2. **Widen `GREENPOINT_BBOX`** — one edit, but it changes the gate for *every*
   card and source, and the box exists because "Nominatim sometimes lands in the
   wrong borough." Widening it to admit two venues also admits every bad geocode
   in the new area.
3. **Leave it and the card fails tests.** Not an option.

**The box already reaches lat 40.712, which is well into Williamsburg** ("generous
Greenpoint envelope, Newtown Creek → McCarren, East River → BQE"). It is genuinely
possible one or both venues are already inside it, which would make this whole
question moot — but that cannot be known without their street addresses, and
their addresses are on the sites that cannot be reached from here. Nominatim,
which *is* reachable, returns no result for either venue by name.

## Where they stand against the seven source tests

Provisional: everything marked **unknown** needs the fetch.

| # | Test | ABC Cirque | TALEA calendar |
|---|---|---|---|
| 1 | In bbox, or items carry addresses | unknown — address not read | unknown — address not read |
| 2 | Locally owned, not a chain, **not asking for placement** | locally owned as described; **asked** | not a chain; **did not ask** (a customer did) |
| 3 | Publishes quotable facts (dates, times, prices) | unknown | unknown |
| 4 | Does not refuse automated readers (`robots.txt`, terms) | **unknown — hard NO if it blocks** | unknown |
| 5 | Nothing paywalled or truncated; body measured | unknown | unknown |
| 6 | Public surface, no private individual's contact details | appears so | appears so |
| 7 | **Fetched this session, measurement in `notes`** | **fails here — egress blocked** | **fails here — egress blocked** |

Test 2 is worth stating plainly rather than waving through: the clause that lets a
run add a source on its own judgment explicitly excludes one that is "asking for
it." That is why both of these are Batu's call and not the run's — a call he has
made. The guard still worth keeping is narrower than the rule: coverage granted
after an ask has to clear the same verbatim-source bar as coverage nobody asked
for, or "verified and sourced" stops meaning anything. Test 4 is the one that can
kill ABC Cirque outright regardless of enthusiasm, and it has not been checked.

## To finish this in one pass

Run from an interactive session on Batu's Mac, where egress is unrestricted —
or add both hosts to the sandbox egress allowlist *and* `.claude/settings.json`
(the tracked one; `settings.local.json` is gitignored and never reaches the
cloud routine).

1. `robots.txt` and any stated terms for `abcirque.com` and `taleabeer.com` — AI
   crawler blocks are a NO, not a question.
2. Plain fetch of `abcirque.com/education-main` and TALEA's events page: HTTP
   status, byte count, and whether dated sessions with times survive in the body
   or whether it is navigation chrome (the Threes Brewing shape — 3,061
   characters of pure navigation).
3. If plain fetch is thin, probe for the calendar's own JSON/ICS before reaching
   for a browser fetch.
4. The street address of 5th Wall Studio and of the TALEA taproom, then geocode
   both **unbounded** and compare against lat 40.712–40.744 / lng −73.975 to
   −73.93. This answers the geography question with a number instead of a
   neighborhood name.
5. Record all of it in the `notes` field of any roster entry, per test 7, and add
   the domain to `.claude/settings.json` in the same change.
