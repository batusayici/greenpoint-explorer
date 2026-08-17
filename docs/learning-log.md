# Learning Log

What we know about users and product usage, and how we know it. Three sections:
**Open questions** (what we don't know that would change the product),
**Current beliefs** (distilled, revised in place, each pointing at its evidence),
and the **Log** (append-only entries, newest first).

Rules, same spirit as the card truth rules:

- Every entry is **sourced** — a named session, an analytics pull, an interview.
  No source, no entry.
- **Facts and reads stay separate.** The fact is permanent; the read is an
  interpretation and gets revised. Label them.
- Append same-session: whoever pulls analytics, runs a tester, or hears
  feedback writes the entry before the session ends.
- People appear as **first name + role only**. Anything genuinely sensitive
  follows the numbers into `docs/private/` (DECISION_LOG 2026-07-28).

## Open questions

Things we don't know that would change what we build. A question leaves this
section only when evidence answers it — then it becomes a belief.

- **Q1 — Is a website the right medium at all?** Rana, a member of a target
  group, says she no longer opens a browser or goes to websites; under-30 local
  discovery data agrees. Everything we've built and measured assumes people
  will land on a web page. If that assumption is wrong, weak numbers will read
  as "the product failed" when the truth is "the container was wrong," and we
  cannot tell those apart from a session count. **This outranks every other
  open question — it can invalidate the form, not just a feature.** What would
  answer it: the 4-week Instagram auto-carousel test (business-model §6),
  ratified with a start condition as P9 in the 2026-08-15 strategy review —
  it's the only test that separates medium from messenger, copy, and season.
  Note the shape of the answer we'd get: the carousel tests whether people
  engage in-feed, not whether they'd install anything, so a positive result
  argues "meet them where they are," not specifically "build an app."
  _Evidence: L2026-08-15, and the near-total absence of generic-intent search
  in L2026-08-17 is weakly consistent with it._
- **Q2 — Does the scan-layer failure hold for residents with a real errand?**
  Both testers who hit it (Sagar, and Josh in the opposite direction) are
  non-residents browsing without a task. A resident asking "what's on tonight"
  may not experience uniform rows the same way. _Evidence: L2026-08-14,
  L2026-08-02 — and they contradict each other, see B1._
- **Q3 — Does anything bring people back?** No return path has been built or
  tested (no email list, no saves). Current weekly returning locals: 2 people,
  6 events, against a bar of 30 — but that reads as "never asked" rather than
  "asked and refused." The one encouraging signal is old and small: in the July
  friends round, 7 of 24 ids came back on a second day within a 5-day window.
  Until a return path exists, every demand read carries the label "measured
  without a way to return." _Evidence: L2026-08-17, L2026-07-29, 2026-08-15
  strategy review P7._
- **Q4 — Will businesses ever supply anything themselves?** Zero submissions
  all-time and one submit tap ever. We don't know whether the ask is invisible,
  unwanted, or simply premature at this traffic level, and the answer decides
  whether supply can ever be anything but hand-curated. _Evidence: L2026-08-17._

## Current beliefs

Grouped by what they're about. Numbering is stable — a belief keeps its number
when revised, and retired ones are struck rather than renumbered.

### The product experience

- **B1 — Content is validated. The scan layer is contested.** Content lands
  with everyone who sees it. The full feed does not: Sagar found it uniform and
  unscannable ("everything looks the same when I scan"), while Josh reacted to
  the same unfiltered view with "wow, there's so many cool things happening"
  and preferred it to any filtered one. Both are non-residents browsing without
  an errand, so the split isn't segment — it may be that density reads as
  abundance when you're admiring a neighborhood and as noise when you're
  looking for something. Don't "fix" the feed on Sagar's read alone; see Q2.
  _Evidence: L2026-08-14 (against), L2026-08-02 (for), L2026-06 (content)._
- **B2 — Utility attracts; stories are unproven as a wedge.** All testers
  anchor on events/today-utility; none anchor on stories. Stories may still
  retain (Michael's layer framing), but nothing yet shows them acquiring.
  _Evidence: L2026-06, L2026-07-11, L2026-08-14._
- **B3 — Reaching a card is the bottleneck; acting after it is not.** Josh
  added an event to his calendar during a first-ever session, unprompted, via
  `.ics`. Across windows, roughly half to two-thirds of people who open a card
  go on to act (July: 12 opened → 6 acted; August all-production: 32 opened →
  14 acted). _Evidence: L2026-08-02, L2026-07-29, L2026-08-17._
- **B4 — Categories below the fold are invisible, and news was worse than
  buried.** Josh saw deals and memberships and never found news at all; the
  cause turned out to be structural — no news card carries a date, so none can
  enter a day group, and the calendar is the feed's only axis. Addressed
  2026-08-02 by giving the shelf six named sections (News ranks second), not by
  dating the cards — see L2026-08-02 for why dating them is the wrong fix.
  Unverified since: no analytics confirm readers now reach the shelf.
  _Evidence: L2026-08-02 (both)._
- **B5 — Users pre-emptively fear map flooding; opt-in density is right.**
  Testers ask for curated/opt-in layers before ever seeing a flooded map.
  _Evidence: L2026-07-11 (Edmond), L2026-06 (platform-layers note)._

### Who wants this

- **B6 — Parents may be the highest-frequency segment.** "What can we do to
  kill a few hours" is a daily job; camp booking is a deadline-driven,
  money-attached recurring moment served badly (Sawyer). n=1, but volunteered
  with specifics. _Evidence: L2026-07-11._
- **B7 — There is unprompted pull for other neighborhoods.** Two people, on
  first exposure, asked for this where they live: "I would like this for
  Windsor Terrace" (Sagar) and "I want this in my neighborhood" (Josh). The
  Stoopwise parent-brand thesis, volunteered twice — though both are friends
  and neither is a Greenpoint resident, so it may be the reaction of someone
  watching a neighborhood they don't have. _Evidence: L2026-08-14, L2026-08-02._
- **B8 — What we stock most is not what people want most.** In the only window
  with real filter data, live music had the most cards (28) and among the
  fewest taps, while shopping (5 cards) and community (11) over-indexed on
  interest per card. Directional — tap counts were small. _Evidence: L2026-07-29._

### How people arrive

- **B9 — Search discovery is branded lookup, but it converts.** People find us
  by searching a business they already know; zero generic "what's happening in
  Greenpoint" queries in the first 8 days. Yet those arrivals are our best
  traffic: 6 of 7 Google visitors did something, against 0 of 20 untagged
  direct arrivals. Low volume, high intent — and the first acquisition that
  came from neither a link Batu sent nor the share button.
  _Evidence: L2026-08-17, L2026-08-11._
- **B10 — Personal messages convert; nothing else has yet.** The
  friends-and-family WhatsApp send produced 15 people, 39 card opens and 4
  high-intent actions — the first campaign link in the project's history to
  produce sessions at all. Organic sharing runs at a trickle (a few people via
  the share button). _Evidence: L2026-08-13._
- **B11 — Aggregate visitor counts are heavily inflated by bots.** At the last
  geo split, 62 of 103 recorded "people" were automated: datacenter cities, one
  pageview each, not a single card open. The population has grown to 173 since
  and has not been re-split. Every all-production conversion rate is therefore
  a floor, not a rate — NYC-metro card-open was 41% against 20% all-in.
  _Evidence: L2026-08-11, L2026-08-17._

### Supply and operations

- **B12 — Nobody has ever submitted anything.** Zero business or org
  submissions all-time; the submit form has 4 visits and 0 starts, and the
  in-product submit button has been tapped once, ever. Self-serve supply is not
  a small-sample question yet — the behavior is absent. _Evidence: L2026-08-17._
- **B13 — Untagged links destroy learning.** Not a user insight — an
  operational one, earned the hard way: wave-1 invites went out untagged and
  channel attribution for the July checkpoint was unrecoverable.
  _Evidence: L2026-07-21._

## Log

### L2026-08-17 — Google Search Console, first snapshot (analytics pull)

Source: GSC Performance report for stoopwise.com, pulled 2026-08-17, covering
2026-08-07 → 2026-08-15 (collection started 2026-08-08).

Facts: 316 impressions, 13 clicks, 4.1% CTR, average position 13.9. All 34
queries are business-name searches ("kirbees greenpoint", "chi ba bakery",
"le fanfare greenpoint"); no generic-intent queries. Clicks: home page 3/44,
then single digits on Kirbee's sneak preview, Transmitter Park marina, comedy
club, library cards. High-impression zero-click pages: `rockaway-rocket`
(44/0), `brew-inn-greenpoint-trivia` (40/0), `threes-chi-ba-bakery-0810`
(17/0), `the-lot-radio` (17/0), `artistic-voices-artudio` (12/0).

Read: discovery is people looking up a place they already know, and our card
happens to rank — not people discovering Greenpoint through us. The zero-click
pages are mostly a position problem (page 2), but their titles/snippets are
worth a look since they out-impress pages that do convert. Too thin to act on;
re-pull ~2026-08-31 and compare.

### L2026-08-17 — Funnel and gate state (analytics, gtm-state.json)

Source: `docs/launch/gtm-state.json`, all entries `readAt: 2026-08-17`.

Facts: all-production funnel — "164 visitors → 32 opened a card (20%) → 14
acted"; both numerators roughly doubled since 8/11. Weekly returning locals:
"2 people returning across weeks, 6 events" against a bar of ≥30. Proactive
supply: "0 submissions. Form has 4 visits, 0 starts. submit_tap: 1 tap, 1
person, all-time." Activation stands at "14 of 173 (8%)", prior "9 of 103
(9%)"; the doc notes the NYC-metro split was 19% on 8/11 and card-open
conversion 41% NYC-metro against 20% all-production, neither re-derived at this
read. Filter use is thin: only 15 people have ever tapped a filter chip
(seeding roster, 2026-08-15).

Read: the product converts respectably among people who are actually local and
actually arrive, and barely at all in aggregate — which is mostly a traffic-mix
problem, not a product one (see the bot split in L2026-08-11). Two numbers are
doing real work here: **zero businesses have ever submitted anything**, with a
single submit tap in the product's lifetime, which is a genuine negative read
on self-serve supply rather than a small-sample shrug; and **2 returning people
against a bar of 30**, which is Q3 unanswered rather than answered badly, since
no return path has ever been built.

### L2026-08-15 — Rana: she doesn't open a browser any more (relayed)

Source: relayed by Batu 2026-08-17; recorded in the 2026-08-15 strategy review
as P9. Rana — member of a target group, and the confirmed Q2 seeding messenger.
Date of her original remark not captured; treat the timing as approximate.

Facts: Rana's own words, as recorded in the seeding roster (2026-08-15):
**"people don't open browsers — only Instagram, Facebook, and games."** The
same note calls her "a credibility-honest messenger for a browser product: if
it lands with Rana's groups, that's a strong signal." The strategy review pairs
this with under-30 local-discovery data pointing the same way, and ratifies P9: the 4-week Instagram auto-carousel test starts either as
a normal Tuesday proposal or automatically at the first readout on/after
2026-10-06 if total tagged sessions across every link sent are under 50.

Read: this is the largest unvalidated assumption in the product — we have never
tested whether a website is the right medium, only whether this website is any
good. It also poisons interpretation of everything downstream: a weak fall
demand number can't distinguish a bad product from a wrong container. Batu's
framing (2026-08-17): "it might be that Stoopwise cannot scale as a web app
only. We haven't validated what the right form/medium is." Promoted to Q1.

### L2026-08-14 — Sagar, live tester session (friend)

Source: live feedback session 2026-08-14. Sagar — friend, 34, senior
engineer / product builder with a design eye. Lives near Windsor Terrace, not
Greenpoint; friend-and-builder lens, weight accordingly.

Facts: content praised repeatedly on tap ("every single thing is very
interesting when I tap into it", "this is amazing"); scan layer explicitly
failed ("it's just lists… everything looks the same when I scan, nothing
catches my eye"). Said the map "weirdly calms" him vs. the list. Asked for
visible standout signaling and images (twice — "maybe just images, that
itself would help a lot"). Floated a natural-language prompt box, then when
asked what he'd type, had no query and retreated to "richer feed would help."
Said irrelevant categories cost attention ("I would never click family and
kids"). Liked the expand/collapse animation. Unprompted: "I would like this
for Windsor Terrace."

Read: third straight session confirming content and indicting the scan/
hierarchy layer — delight is hidden behind a tap. The prompt-box retraction is
the useful part: the need is a curated starting point, not chat. The Windsor
Terrace ask is the first unprompted expansion pull.

### L2026-08-13 — Friends-and-family WhatsApp send (outreach result)

Source: `docs/launch/gtm-state.json`, friends-family campaign note.

Fact: "Sent ~6:30pm over WhatsApp on ?src=friends-family. It landed: 15 people,
39 card opens, 4 high-intent actions — the first campaign link in the project's
history to produce sessions, and proof the attribution plumbing works before
the org notes go out." Separately, the product's own share button has produced
3 people in a first session, and `?src=share` was documented 2026-07-28 "after
2 real visitors arrived on it."

Read: a personal message from someone you know converts — 15 people, 39 card
opens, high engagement per head. It is also the smallest possible channel.
Sharing works at a trickle (a handful of people arriving via someone else's
share), which is the only organic person-to-person spread observed so far.

### L2026-08-11 — First organic acquisition, and most "people" are bots

Source: `docs/launch/gtm-state.json` — Q3 AEO experiment and risk register,
both read 2026-08-11.

Facts: "7 people from Google since 8/9, all NYC-local, all landing on /e/<slug>
card pages. 6 interactions from those 7, against 0 from 20 untagged direct
arrivals." The doc calls it the "first acquisition in the project's history that
came from neither a link Batu sent nor the share button," and adds "n=7
graduates nothing." Crawl latency "measured at ~4 days." Separately: "As of
8/11, 62 of 103 recorded 'people' were automated — datacenter cities, one
pageview each, not a single card open. The population has since grown to 173
and has not been re-split by geography."

Read: two things that change how every other number should be read. **Search
arrivals convert dramatically better than untagged direct traffic** — 6 of 7
did something, against 0 of 20 — which says the people finding us through a
card page arrive with intent, and that the aggregate conversion rate is being
dragged down by traffic that was never really a visit. And **more than half of
all recorded "people" were bots** at the last split, so any headline count of
visitors is inflated by an unknown amount today. The 4-day crawl latency is a
content-timing fact: fine for a card dated a week out, useless for one posted
the morning of.

### L2026-08-02 — News was structurally unreachable — and was fixed the same day

Source: `docs/PLAN.md`, item closed 2026-08-02 following the Josh session.

Facts: "the cause was structural (0 of 23 news cards are dated, so none could
ever enter a day group); the undated shelf now renders as six named sections
instead of one 'Ongoing' block." The first-viewport promotion was rendered
three ways and declined — "keep current" — to be reopened "only if analytics
show users still aren't reaching the shelf."

Read: Josh never finding news wasn't only scroll depth — no news card could
appear in a day group at all, because the feed's only axis is the calendar and
news carries no date. **Already addressed:** news now has its own titled "News"
section, ranked second of six on the shelf. Dating the cards was considered and
is the wrong fix — a publication date is not an occurrence date, and asserting
one would put a six-week-old story under "Today" and retype it as a
schema.org/Event for crawlers (both verified 2026-08-17). Treat this entry as
closed history, not an open problem.

### L2026-08-02 — Josh, live walkthrough (researcher friend)

Source: recorded conversation 2026-08-02; full notes
`docs/context/2026-08-02-josh-feedback-place-and-small-business.md`. Josh —
friend, researcher who has written on place and small business (New Haven case
study). First reviewer with a research lens rather than a user lens; not a
Greenpoint resident.

Facts: unprompted within minutes — "there's so much going on in Greenpoint. I
want to move to Greenpoint," then "I want this in my neighborhood." Found the
Korean supper club and **added it to his calendar during the session** via
`.ics`, first-time user, no priming. Said the day-by-day structure gave him "a
sense of, like, every day, all day long, there are interesting things I could
be doing." Preferred the unfiltered feed: "honestly, I liked the non-filtered
just for me, because then it gives me a sense of, wow, there's so many cool
things happening." Read the exclusion of big business as identity, not as a
coverage gap. On aesthetics: "this is pleasing, I want to go back to it,"
contrasted with tools he uses once and abandons. Problems he hit: never found
news at all ("you have to do one full scroll to know that"); a broken link on
the get-involved path; several desktop click-target mismatches; said the
positioning copy "feels like superficial description, not like the identity of
your product." Ran his own competitive scan (Google Maps, Gary's Guide,
Eventbrite, a Time Out-alike) and concluded none are hyperlocal + spatial +
small-business-only + complete. Two lines kept as positioning material: "it has
a map, it isn't a map" and "creating economic opportunity at a hyperlocal
scale."

Read: the only observed completion of the full intended path on a first-time
user, which is why B7 exists. His feed reaction directly contradicts Sagar's —
see B1 and Q2. The invisible-news finding is the cheapest high-cost fix on the
list. Status in its own doc: raw signal, not adopted — nothing here has changed
a rule or a gate.

### L2026-07-29 — July friends round: the first real usage window

Source: `docs/launch/2026-07-29-checkpoint-readout.md`, PostHog + Vercel +
Tally pulls, window Jul 15 → 28. Context from DECISION_LOG: "the Jul 15 wave
was a friends feedback round — a handful of parent friends, some of whom never
opened the app — not a launch."

Facts, by person (PostHog): 19 visits → 12 opened a card → 6 fired `action_tap`
→ 2 tapped a CTA → 1 gave feedback. Engagement per engaged person was high:
156 card opens across 12 people, 268 filter taps across 13. Retention: "of 24
distinct ids, **7 returned on a second day and 1 on a third**" over a 5-day
window. Category interest against supply: "**Live Music has the most cards (28)
but among the fewest taps**, while **Shopping (5 cards) and Community (11)
over-index on interest per card**"; Family & Kids had the widest reach at 13
people. Top cards opened: film-noir-film-club (8), troost-barba-yiorgi (7),
artistic-voices-artudio (6), le-fanfare (5), newtown-creek-cag (5),
library-thursday-programs (5). Signup form all-time: 18 visits → 2 starts → 2
completions, only 1 in-window; feedback form 2 visits → 0 starts. Two
instrumentation failures: Vercel Web Analytics "was never enabled on the
project," losing Jul 15–21 unrecoverably, and "100% of real traffic is `$direct`
with no referring domain." The readout's qualitative section was never filled
in — it still holds only its placeholder, and the verdict lines are blank.

Discrepancy, unresolved: the prose headline reads "19 visitors → 12 opened a
card (63%) → 10 took an action (53%)" while the table four lines above records
`action_tap` at 6 people. Use 6, or neither — the doc never reconciles them.

Read: a small, genuinely engaged group rather than a large bouncing one, which
is what a friends round should look like and proves very little about strangers.
The durable finding is the supply-versus-interest mismatch: the category we
stock most heavily (live music) drew the least interest per card, while
shopping and community drew the most from a fraction of the supply. Worth
re-testing before more sourcing effort goes into music. Also notable as an
absence — a full quantitative record exists and **no qualitative feedback from
that round was ever written down**, which is part of why this log exists.

### L2026-07-21 — July checkpoint: channel attribution lost (ops)

Source: July 2026 launch checkpoint review.

Fact: wave-1 invite links went out without `?src=` tags; channel attribution
for the checkpoint (criterion 4) was unrecoverable.

Read: instrumentation is a precondition for learning, not a nice-to-have.
Standing rule since: every outbound link carries `?src=`.

### L2026-07-11 — Laura & Edmond, Track V testers (parent friends, Greenpoint)

Source: tester session 2026-07-11, two Greenpoint residents, parents.

Facts — Laura: uses Sawyer for all camps/afterschool; resents its $3/txn; it
can't aggregate by day + area. Named "oh shit I need to book a camp" as a
recurring deadline+money moment. Volunteered booking-commission monetization
unprompted. Asked for changing-table / high-chair amenity badges. Named the
daily job as "what can we do to kill a few hours."
Facts — Edmond: named "proximity and taste and time" as the three ranking
pillars (Too Good To Go comparison, made independently by two people). Wants
star/save and a time-window filter beyond Today. Argued against a free-only
hard filter (fear of missing a great paid event). On music calendars: "off by
default, opt in with parameters so it doesn't flood the map."

Read: fragmented-sources thesis confirmed 3-for-3 across testers to date.
Parents look like the highest-frequency wedge (seasonal camps spike + daily
kill-a-few-hours job). Saves and a time filter double as instrumentation.
Flood-fear before any flood validates opt-in layer architecture.

### L2026-07-02 — Perri (The WonderMart): a local crawl doubled her sales

Source: Shop Small Greenpoint inaugural newsletter, "Shop Talk" column,
received 2026-07-01; recorded in `docs/context/2026-07-02-ssg-july-seed.md`.
Perri — owner and curator of The WonderMart, lead organizer of Shop Small
Greenpoint.

Fact: "I participated in my first Shop Small Greenpoint crawl in Spring 2023 —
and my sales doubled that week."

Read: the only evidence we hold that a neighborhood-wide discovery campaign
moves money for a merchant — the demand-side half of the business case. Carry
the caveat with it: a merchant's self-report in her own organization's
promotional newsletter, not a measurement anyone verified. It complicates
rather than confirms Michael's read that owner pride, not ROI, is the hook.

### L2026-06 — Michael, resident interview (Greenpoint)

Source: June 2026 interview; full notes
`docs/context/resident-feedback-michael-2026-06.md`.

Facts: framed the map as container, hyperlocal context as product. "People
become attached to people, not listings" — owner stories and lore over hours
and addresses. Volunteered to record an audio story on-location ("I want it on
the steps"). Named stoop sales as the top recurring-traffic use case. Pointed
at community orgs (Save the Inlet, historians, walking-tour operators,
Greenpointers) as better early partners than businesses.

Read: the original reframe the product now stands on — adopted into PLAN.md
2026-06-17. Owner pride/identity, not ROI, is the hook for businesses.
