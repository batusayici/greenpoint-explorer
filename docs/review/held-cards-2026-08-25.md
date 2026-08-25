# Held cards — daily thin run, 2026-08-25

> **RESOLVED 2026-08-26 (Batu, PR #49). Nothing here is still held.** The clean up
> ships at **11:00am-1:00pm** as `bedford-slip-cleanup-0830`, on evidence rather
> than on the rule extension this doc proposed: the organiser's own Partiful page
> for that block that weekend puts the Sunday programme at `10AM-8PM`, so nothing
> is happening there at 8:00 am and the listing header cannot be the clean up's
> start. That page also surfaced the weekend the clean up sits inside, which the
> deck did not carry at all — three more cards shipped with it.
>
> The rule question was answered too, but written on its own terms rather than as
> an extension of the 2026-08-14 pantry ruling: **when one listing states a time
> twice and the two disagree, print the prose, not the header.** Batu also settled
> a second question this weekend forced — **a multi-day run whose daily hours
> differ is one card per hours-pattern.** Both in `docs/DECISION_LOG.md`
> (2026-08-26) and the ingest skill.
>
> Everything below is the run's original reasoning, kept as written.


One card was held this run. Everything else the run authored shipped to `main`
in `bffccc4`.

`holds: 1 new-judgment · 0 rule-miss · 0 source-blocked`

---

## Bedford Slip volunteer cleanup, Sunday 8/30

**Why it's held:** the listing states the time twice and the two statements
disagree, so any card has to pick one. That's a judgment call, not a read off
the source.

**What the source says**, verbatim, from
`.ingest-cache/bpl-north-brooklyn-calendar.txt` (North Brooklyn Environmental
Community Calendar, https://www.bklynlibrary.org/north-brooklyn-community-calendar):

```
Bedford Slip
Sun, Aug 30 8:00 am
1 Bedford Av Brooklyn, NY 11222
Audience: All Ages Type: Workshop/Info Session
Volunteer clean up from 11:00AM to 1:00PM
```

The header says 8:00 am. The body says 11:00 AM to 1:00 PM. Nothing on the page
says which is the start of the thing a reader would turn up for.

**Why the existing rule doesn't settle it.** The library period-pantry ruling
(SKILL.md, Batu 2026-08-14) says to trust the body when the body describes
availability wider than the record's window and the date field is a listing
convention. That's close, but not this: the body here is *narrower* than the
header, not wider, so applying that precedent means extending it rather than
following it. A three-hour error on a volunteer shift is the kind of thing a
reader shows up for and finds nobody there.

**Everything else about it is clean.** A volunteer cleanup is hands-on
participation with neighborhood stakes, so the lens is `civic` mechanically.
1 Bedford Ave is zip 11222. Free-ness is not stated, so `free` stays unset.
No duplicate is on the map.

**What would resolve it:** the organiser's own page, or a second listing, naming
one start time. Then this ships with no further judgment.

**Draft card** (times deliberately left blank — that's the held field):

```json
{
  "id": "bedford-slip-cleanup-0830",
  "category": "event",
  "title": "Volunteer cleanup at Bedford Slip",
  "kicker": "Two hours on the Bedford Slip shoreline",
  "summary": "An all-ages volunteer cleanup on the East River slip, listed by the North Brooklyn Environmental Community Calendar.",
  "filters": ["civic"],
  "locationName": "Bedford Slip",
  "address": "1 Bedford Ave, Brooklyn, NY 11222",
  "geocodeQuery": "1 Bedford Avenue, Brooklyn, NY 11222",
  "startsAt": "2026-08-30T11:00:00-04:00 — HELD, the listing header says 08:00",
  "endsAt": "2026-08-30T13:00:00-04:00",
  "audience": ["resident", "civic_actor"],
  "actions": [{ "label": "Event details", "type": "learn_more", "url": "https://www.bklynlibrary.org/north-brooklyn-community-calendar" }],
  "sourceLinks": [{ "title": "North Brooklyn Environmental Community Calendar", "url": "https://www.bklynlibrary.org/north-brooklyn-community-calendar", "publisher": "Brooklyn Public Library", "date": "2026-08-25" }],
  "sourceQuote": "Bedford Slip\nSun, Aug 30 8:00 am\n1 Bedford Av Brooklyn, NY 11222\nVolunteer clean up from 11:00AM to 1:00PM",
  "evidenceStrength": "medium_high",
  "monetizationRelevance": "none",
  "partnerRelevance": "medium",
  "trustRisk": "medium",
  "createdAt": "2026-08-25",
  "updatedAt": "2026-08-25"
}
```

The card is also recorded in `ingest-ledger.json` under `watchItems`, so it
can't be lost if this PR sits.

---

## A rule question worth settling once

**Recommendation: extend the 2026-08-14 body-over-header rule to cover a body
that narrows the header, not just one that widens it.**

The 8/14 ruling was written against a listing whose body described *wider*
availability than its date field. This is the mirror case, and the reasoning is
the same either way: the header is a calendar-slot convention, the body is the
organiser describing the actual thing. If that reading is right, this card and
every future one of its shape ships mechanically and never comes back here.

If it isn't right, say so and this class stays a hold — but it will recur, and
the alternative is re-arguing it every time the calendar carries a cleanup.
