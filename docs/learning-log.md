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
  tested (no email list, no saves). Until one exists, every demand read carries
  the label "measured without a way to return." _Evidence: 2026-08-15 strategy
  review P7._

## Current beliefs

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
- **B3 — Parents may be the highest-frequency segment.** "What can we do to
  kill a few hours" is a daily job; camp booking is a deadline-driven,
  money-attached recurring moment served badly (Sawyer). n=1, but volunteered
  with specifics. _Evidence: L2026-07-11._
- **B4 — Search discovery is 100% branded lookup so far.** People find us by
  searching a business they already know; zero generic "what's happening in
  Greenpoint" queries in the first 8 days. Answer-engine primacy is not yet
  happening through Google. _Evidence: L2026-08-17. 8 days of data — thin._
- **B5 — Users pre-emptively fear map flooding; opt-in density is right.**
  Testers ask for curated/opt-in layers before ever seeing a flooded map.
  _Evidence: L2026-07-11 (Edmond), L2026-06 (platform-layers note)._
- **B6 — There is unprompted pull for other neighborhoods.** Two people, on
  first exposure, asked for this where they live: "I would like this for
  Windsor Terrace" (Sagar) and "I want this in my neighborhood" (Josh). The
  Stoopwise parent-brand thesis, volunteered twice — though both are friends
  and neither is a Greenpoint resident, so it may be the reaction of someone
  watching a neighborhood they don't have. _Evidence: L2026-08-14,
  L2026-08-02._
- **B7 — The product converts when someone reaches a card.** Josh added an
  event to his calendar during a first-ever session, unprompted, via `.ics`.
  Small n, but it's the only observed instance of the full intended path
  (browse → find → act) completing on a first-time user. _Evidence:
  L2026-08-02._
- **B8 — Categories below the fold are effectively invisible.** News and civic
  sit past a full scroll; Josh saw deals and memberships and never found news
  at all. _Evidence: L2026-08-02._
- **B9 — Untagged links destroy learning.** Not a user insight — an
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

### L2026-08-15 — Rana: she doesn't open a browser any more (relayed)

Source: relayed by Batu 2026-08-17; recorded in the 2026-08-15 strategy review
as P9. Rana — member of a target group, and the confirmed Q2 seeding messenger.
Date of her original remark not captured; treat the timing as approximate.

Facts: Rana says she no longer opens a browser or goes to websites. The
strategy review pairs this with under-30 local-discovery data pointing the same
way, and ratifies P9: the 4-week Instagram auto-carousel test starts either as
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
