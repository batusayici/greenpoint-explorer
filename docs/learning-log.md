# Learning Log

What we know about users and product usage, and how we know it. Two sections:
**Current beliefs** (distilled, revised in place, each pointing at its evidence)
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

## Current beliefs

- **B1 — Content is validated; the scan layer is the failure point.** Every
  tester delights on tap ("every single thing is very interesting when I tap
  into it") and stalls at the uniform list. The product's peak is hidden behind
  a tap. _Evidence: L2026-06, L2026-07-11, L2026-08-14 — 3 of 3 sessions._
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
- **B6 — There is unprompted pull for other neighborhoods.** "I would like
  this for Windsor Terrace" — the Stoopwise parent-brand thesis, volunteered.
  n=1, and from a friend. _Evidence: L2026-08-14._
- **B7 — Untagged links destroy learning.** Not a user insight — an
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
