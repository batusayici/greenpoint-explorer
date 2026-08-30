// Track V — GreenpointMapCard validation. Disposable v1 shape (per the 2026-07-02
// spec) with canonical discipline: enums locked, coordinates must be derived and
// inside Greenpoint, every card carries an attributed source. Extensions over the
// seed-doc type, all from the spec + its hidden-engagement addendum: `filters`
// (authored filter-bar membership), `venues` (multi-venue event cluster, e.g. the
// World Cup bars), `subscription` category, `join` action, `startsAt`/`endsAt`
// (ISO window for the Today lens). 2026-07-03 place-graph moat fields (spec
// revision): `trustRisk` (required enum), `relatedCardIds` (optional, cross-card
// linking), `timeline` (optional, dated history entries) — see DECISION_LOG.
// 2026-08-02: `sourceQuote` (verbatim substantiating line) — the gate that
// replaced human content review when ingest went autonomous.
// 2026-08-08: `recurrence.days` — which days a repeating card actually happens
// on. Week order is canonical (see recurrenceLabel in eventWindow.js).
export const RECURRENCE_DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// ── All-day, stated rather than inferred (2026-08-25) ─────────────────────
// A 00:00 NY start used to be the ONLY way to say "no clock time was ever
// sourced" — the all-day sentinel. That made a SOURCED midnight start
// impossible to write down: Eavesdrop's calendar lists two slots a night,
// "6PM" and "12midnight", and carding the stated time told the feed the set
// ran all day and sorted a DJ set to the top of the morning feed. That is the
// 2026-08-13 failure from the other end of the clock.
//
// `allDay` states it instead. ONE definition, exported, because five surfaces
// asked this question by re-reading the clock themselves — eventWindow,
// calendarLink, aeo (three times), cardActions — which is exactly how the
// sitting model drifted per caller on 2026-08-13.
//
//   allDay: true   → no clock was sourced; render a bare date, run to midnight
//   allDay: false  → the clock is real, midnight included
//   absent         → the legacy sentinel reading (00:00 = all day), kept so
//                    the pre-2026-08-25 backlog and its fixtures stay valid
//
// The absent case is closed off at the gate, not here: validateCard requires
// an explicit `allDay` on any card whose start clock is 00:00, so an ingest
// run cannot author an ambiguous midnight and the fallback never fires on the
// live deck.
const NY_START_CLOCK = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/New_York",
});

export const isMidnightStart = (card) => {
  if (card?.startsAt == null) return false;
  const d = new Date(card.startsAt);
  // A malformed startsAt is already an error of its own; asking it for a clock
  // must not throw out of validateCard before that error is collected.
  if (Number.isNaN(d.getTime())) return false;
  return NY_START_CLOCK.format(d) === "00:00";
};

export function isAllDay(card) {
  if (typeof card?.allDay === "boolean") return card.allDay;
  return isMidnightStart(card);
}

export const CATEGORIES = [
  "new_business", "food_drink", "shopping", "service", "event",
  "arts_culture", "family_kids", "job", "shopkeeper_profile",
  "g_train_support", "civic_action", "discount", "support_local",
  "subscription",
  "news",
];

export const AUDIENCES = [
  "resident", "business", "visitor", "creator", "family", "job_seeker", "civic_actor",
];

export const ACTION_TYPES = [
  "visit", "learn_more", "rsvp", "buy_gift_card", "order", "apply",
  "signup", "file_complaint", "share", "submit_update",
  "join",
];

export const EVIDENCE_LEVELS = ["high", "medium_high", "medium", "low"];

export const TRUST_RISKS = ["low", "medium", "high"];

// Filter-bar ids, in display order. The Today lens is a separate toggle, not a
// filter id. `deals`/`news` added 2026-07-15 (limited-launch content-type test);
// `live_music` added same day (Batu: clubs/music bars are a key category —
// venues + show nights share the layer).
// g_train removed 2026-07-23 (Batu: a campaign as a content category read as
// confusing) — G-related cards live in their real categories; the exclusive
// campaign/civic cards moved to news.
// 2026-07-25 IA re-cut (Batu, N1 groundwork): every lens is a person's actual
// question, not a content-type taxonomy. `events` retired (58 of 88 cards —
// the day-grouped All feed already answers "what's happening"); `services`
// retired (2 cards; services are destination searches, not a browse lens —
// service openings surface via `new`); `deals` + `clubs_signups` merged into
// `deals_memberships` (2+3 cards, both under the fold threshold); `wellness`
// added for the movement cluster (yoga/pilates/dance/run — a real recurring
// neighborhood cluster the events umbrella was hiding). Civic stays inside
// news.
// Same day, second pass (Batu): the six cards left lens-less sorted into two
// real groups instead of staying All-only. `civic` added — civic/mutual-
// aid stewardship (park cleanups, harbor day, dog adoption, a trash-cleanup
// club, an accessibility-advocacy launch; future home for things like stoop
// sales). Astrology and a cannabis-science talk moved into `arts_culture`
// (culture/ideas programming, same shelf as gallery talks and workshops).
// Third pass (Batu): `new` folded into `news` — one letter apart on the chip
// bar, and the data proved it out: every `new` card dated to the 2026-07-02
// launch batch, untouched across five later ingests (never a rotating
// "opened this week" lens, just a frozen one). The taxonomy already treats
// an opening as news (Swaine's fall-opening card was filed `news` from the
// start) — folding removes the duplicate home instead of fixing a second
// pipeline to feed it. `category` (new_business/service/etc.) is untouched,
// so pin colors don't change — only the filter-bar membership moves. Intent
// really does differ (discovery vs. "what changed") — if volume ever
// justifies it, split back out; not worth a lens today at this frequency.
// Chip ORDER is merchandising, not alphabet (2026-07-25, Batu): the ~3 chips
// visible after "All" at 375px are the product's positioning statement, so
// they must restate the promise ("what's happening this week", alive) —
// Live Music leads, Family & Kids is deliberately promoted to slot 2 above
// its raw volume (it's the growth wedge), Arts & Culture third. Then the
// remaining event lenses, then News (the weekly pulse), then the browse/
// static lenses last — a first tap that opens onto a stale shelf teaches
// "this app is dead". Order is static (muscle memory beats optimality);
// revisit ONLY at declared checkpoints against position-corrected
// filter_tap + post-filter engagement in PostHog — see DECISION_LOG.
// Lens order 2026-07-26 (Batu): things to DO lead, informational follows —
// leading with live_music read as "gig tracker", which this isn't. shopping
// folded into deals_memberships (the category axis below keeps "shopping" for
// pin labels — different taxonomy).
// Launch IA re-cut 2026-08-02 (Batu): `games` added, `community` renamed
// "Civic". The trigger was Arts & Culture reading as a junk drawer at 24 cards
// — a Warhammer tournament, a pinball league and a backgammon club sat on the
// same shelf as Film Noir, a gallery opening and a one-day choir. Six of the
// 24 were games, and the intent is genuinely different: arts cards are ATTEND
// ONCE, games cards are JOIN A STANDING SCENE (Tuesday backgammon, Wednesday
// pinball, Tuesday chess, Tuesday trivia — two of them are already filed
// `subscription`, not `event`). Recurring weeknight commitments are the
// retention shape; one-off cultural attendance is not.
// `community` → `civic`: relabelled 2026-08-02 as a chip-label-only change,
// then renamed all the way down the same day (Batu: "it's creating confusion.
// lets keep things simple and consistent"). Carrying a `community` id under a
// "Civic" chip meant the UI, the card data and the ingest rules used two words
// for one lens, and the split cost more than the migration did. **Not renamed:
// the community-ALERT banner** (`communityAlert.js`, `bannerSlot` kind
// `"community"`) — a neighborhood-wide alert is a different feature, correctly
// named, and never surfaces as a lens label.
// `games` is authored-FOLDED (see FOLDED_FILTER_IDS) — it earns a lens, not a
// primary chip slot.
//
// ORDER IS THE BAR (2026-08-02). `partitionFilters` preserves this array, so an
// index is not cosmetic — it decides where a lens LANDS when it crosses the
// fold threshold. `wellness` used to sit at index 3 and `civic` at index 5,
// both invisible only because they were thin; stocking wellness to 5 cards
// would have dropped it into the peek slot ahead of live_music, news and deals.
// So: thick lenses in merchandising order first, fold-prone ones behind them, a
// restocked lens enters at the BACK and earns its way forward.
//
// Measured at 375px: ~3 chips are fully visible (All + food_drink +
// family_kids) with arts_culture cut at 71% as the scroll affordance; the rest
// is one swipe. `news` is deliberately NOT in that first group despite being
// the largest lens — leading with News would position this as a local news
// product, which `docs/context/2026-07-03-greenpointers-differentiation.md`
// rules out. Supply earns tier 2; positioning decides tier 1.
// `shopping` is BACK (Batu, 2026-08-13), at the back of the bar exactly as the
// rule above prescribes. It was retired 2026-07-26 when its only members were
// standing offers, which folded into deals_memberships and STAY there. What
// brought it back is supply that did not exist in July — dated retail
// happenings (a flea, a makers market, an archival showcase, a store's
// after-hours) — plus the 2026-08-12 CIBONE ruling, which correctly said retail
// is not arts_culture and then had nowhere to put it. Six cards accumulated in
// All with a bespoke test allowlist to sanction them; that is a missing lens,
// not a miscellany. Named `shopping` and not `markets` because two farmers'
// markets already live in food_drink and would make that chip lie in both
// directions — see julyCards.test.mjs for the full label reasoning.
export const FILTER_IDS = [
  "food_drink", "family_kids", "arts_culture",
  "live_music", "news", "deals_memberships",
  "civic", "wellness", "shopping",
  "games",
];

// Authored fold (Batu, 2026-08-02): these lenses ALWAYS live inside "More",
// regardless of how many live cards they carry. Distinct from the thin-layer
// fold in `partitionFilters`, which is a volume symptom that heals itself when
// the ingest stocks a layer — this is a standing merchandising decision, and
// leaving it to the count would let a good week silently promote `games` onto
// the primary bar and undo the call. The ~3 chips visible after "All" at 375px
// are the product's positioning statement; games seasons the neighborhood, it
// does not define it.
export const FOLDED_FILTER_IDS = ["games"];

// Generous Greenpoint envelope (Newtown Creek → McCarren, East River → BQE).
export const GREENPOINT_BBOX = {
  latMin: 40.712, latMax: 40.744,
  lngMin: -73.975, lngMax: -73.93,
};

export const inGreenpoint = ({ lat, lng }) =>
  typeof lat === "number" && typeof lng === "number" &&
  lat >= GREENPOINT_BBOX.latMin && lat <= GREENPOINT_BBOX.latMax &&
  lng >= GREENPOINT_BBOX.lngMin && lng <= GREENPOINT_BBOX.lngMax;

const str = (v) => typeof v === "string" && v.trim().length > 0;

export function validateCard(card) {
  const errors = [];
  const err = (m) => errors.push(`${card?.id ?? "?"}: ${m}`);

  if (!str(card.id)) err("missing id");
  if (!str(card.title)) err("missing title");
  if (!str(card.locationName)) err("missing locationName");
  // Field contract (2026-07-29 punch list, P1 #3 — the "reads text-heavy" root
  // cause): `kicker` is the glanceable hook in the LIST ROW — why you'd tap;
  // `summary` is what the row could NOT say — detail, context, the follow-on
  // fact. They are different jobs, so a summary that restates its kicker is an
  // authoring defect. Enforced at ingest via lintCard() below (warnings, not
  // hard errors — the pre-contract backlog would fail wholesale).
  if (!str(card.summary)) err("missing summary");
  // Glanceability contract (tester feedback 2026-07-08): every card carries a
  // one-phrase kicker so the list scans without opening the detail.
  if (!str(card.kicker)) err("missing kicker");
  else if (card.kicker.length > 44) err(`kicker over 44 chars ("${card.kicker}")`);
  if (card.free != null && typeof card.free !== "boolean") err("free must be a boolean");
  if (!CATEGORIES.includes(card.category)) err(`unknown category "${card.category}"`);

  // Empty filters is legal (2026-07-25): a one-off with no honest lens lives
  // under All only — the array must still be authored, never absent.
  if (!Array.isArray(card.filters)) err("missing filters");
  else for (const f of card.filters) if (!FILTER_IDS.includes(f)) err(`unknown filter "${f}"`);

  if (!Array.isArray(card.audience) || card.audience.length === 0) err("missing audience");
  else for (const a of card.audience) if (!AUDIENCES.includes(a)) err(`unknown audience "${a}"`);

  if (!Array.isArray(card.actions) || card.actions.length === 0) err("needs at least one action");
  else for (const a of card.actions) {
    if (!str(a.label)) err("action missing label");
    if (!ACTION_TYPES.includes(a.type)) err(`unknown action type "${a.type}"`);
    // Internal action (2026-07-03): tapping switches the filter bar instead of
    // leaving the page — campaign cards use it to open their layer.
    if (a.filterId != null && !FILTER_IDS.includes(a.filterId)) err(`unknown action filterId "${a.filterId}"`);
  }

  if (!Array.isArray(card.sourceLinks) || card.sourceLinks.length === 0) {
    err("needs an attributed source (truth rule)");
  } else for (const s of card.sourceLinks) if (!str(s.title)) err("sourceLink missing title");

  // Substantiation (2026-08-02, autonomous-ingest gate): `sourceLinks` proves a
  // card was ATTRIBUTED; `sourceQuote` proves it was SOURCED — the verbatim
  // line from the source that carries the card's claims (what/when/where/
  // price). Attribution alone can't catch a plausible sentence assembled around
  // a real URL, which is the exact failure a human reviewer used to catch.
  // Optional in the schema so the pre-2026-08-02 backlog stays valid; required
  // for new cards by the dated test in julyCards.test.mjs, and a card without
  // one is HELD for review by the ingest ritual rather than shipped or dropped.
  if (card.sourceQuote != null && !str(card.sourceQuote)) err("sourceQuote must be a string");

  // Hidden-engagement addendum: optional event window for the Today lens.
  for (const key of ["startsAt", "endsAt"]) {
    if (card[key] != null && Number.isNaN(Date.parse(card[key]))) err(`${key} is not ISO datetime`);
  }
  if (card.startsAt && card.endsAt && Date.parse(card.startsAt) > Date.parse(card.endsAt)) {
    err("startsAt after endsAt");
  }

  // Limited-launch content types (2026-07-15). A deal (`discount`) must carry
  // an end date so stale offers can never linger on the map — the UI drops
  // expired deals at render time. On a `recurring` deal (standing happy hour,
  // open-ended intro offer) endsAt is the VERIFIED-THROUGH date, not a stated
  // deadline — the UI suppresses the "ends" line and the weekly ingest
  // re-verifies or drops it. A `news` card must name its publisher: news is
  // only as credible as its attribution (truth rule, stricter than title).
  if (card.category === "discount" && card.endsAt == null) {
    err("discount (deal) needs endsAt — offers must expire");
  }
  if (card.recurring != null && typeof card.recurring !== "boolean") {
    err("recurring must be a boolean");
  }
  // All-day is STATED, not inferred (2026-08-25 — see isAllDay above). A card
  // whose start clock is midnight must say which it means, so a sourced
  // "12midnight" set can be carded without being read as an all-day event.
  if (card.allDay != null && typeof card.allDay !== "boolean") {
    err("allDay must be a boolean");
  }
  if (card.allDay == null && isMidnightStart(card)) {
    err("00:00 start needs an explicit allDay (true = no clock sourced, false = a real midnight)");
  }
  if (card.allDay === true && card.startsAt != null && !isMidnightStart(card)) {
    err("allDay: true needs a 00:00 start — a stated clock is not an all-day card");
  }
  // Recurrence (2026-08-08). `recurring` says "this repeats"; `recurrence.days`
  // says WHICH DAYS, which is what lets the feed place a weekly event on its
  // calendar day instead of shelving it. Optional by design: a standing offer
  // (intro groom, anniversary sale) repeats on no particular day and must not
  // be forced to invent one.
  if (card.recurrence != null) {
    const days = card.recurrence?.days;
    if (card.recurring !== true) err("recurrence needs recurring: true");
    if (!Array.isArray(days) || days.length === 0) {
      err("recurrence.days must be a non-empty array");
    } else {
      for (const d of days) {
        if (!RECURRENCE_DAYS.includes(d)) err(`recurrence.days has unknown day "${d}"`);
      }
      if (new Set(days).size !== days.length) err("recurrence.days has duplicates");
    }
    // A stated day is meaningless without a span to bound it: an unbounded
    // "every Saturday" would claim the card runs forever.
    if (card.startsAt == null && card.endsAt == null) {
      err("recurrence needs startsAt or endsAt to bound the repeat");
    }
    // `except` — dates the series skips (2026-08-30). Cancelling one sitting
    // used to mean choosing between showing a ghost row and ending the series
    // early. Each entry is an NY calendar day; it only bites alongside stated
    // days, so requiring them here keeps the field from looking like it can
    // carve holes in a standing offer's span.
    if (card.recurrence.except != null) {
      const except = card.recurrence.except;
      if (!Array.isArray(except) || except.length === 0) {
        err("recurrence.except must be a non-empty array of YYYY-MM-DD days");
      } else {
        for (const d of except) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) err(`recurrence.except has a non-date "${d}"`);
        }
        if (new Set(except).size !== except.length) err("recurrence.except has duplicates");
        if (!(days?.length > 0)) err("recurrence.except needs recurrence.days — a standing offer has no occurrence to skip");
      }
    }
  }
  if (card.category === "news" && !(card.sourceLinks ?? []).some((s) => str(s?.publisher))) {
    err("news needs a sourceLink with a publisher");
  }

  if (!EVIDENCE_LEVELS.includes(card.evidenceStrength)) err("bad evidenceStrength");
  if (!["direct", "indirect", "none"].includes(card.monetizationRelevance)) err("bad monetizationRelevance");
  if (!["high", "medium", "low"].includes(card.partnerRelevance)) err("bad partnerRelevance");
  if (!str(card.createdAt) || !str(card.updatedAt)) err("missing created/updated dates");

  // Place-graph moat fields (2026-07-03 spec revision): cheap to carry now,
  // they make cards durable objects instead of pins. v1 populates sparsely.
  if (!TRUST_RISKS.includes(card.trustRisk)) err("bad trustRisk");
  if (card.relatedCardIds != null) {
    if (!Array.isArray(card.relatedCardIds) || card.relatedCardIds.length === 0) {
      err("relatedCardIds must be a non-empty array when present");
    } else {
      for (const rid of card.relatedCardIds) {
        if (!str(rid)) err("relatedCardIds entries must be card-id strings");
        else if (rid === card.id) err("relatedCardIds must not self-reference");
      }
    }
  }
  if (card.timeline != null) {
    if (!Array.isArray(card.timeline) || card.timeline.length === 0) {
      err("timeline must be a non-empty array when present");
    } else {
      for (const t of card.timeline) {
        if (Number.isNaN(Date.parse(t?.date))) err("timeline entry needs an ISO date");
        if (!str(t?.title)) err("timeline entry needs a title");
        if (t?.summary != null && !str(t.summary)) err("timeline summary must be a string");
        if (t?.sourceUrl != null && !str(t.sourceUrl)) err("timeline sourceUrl must be a string");
      }
    }
  }

  const venues = Array.isArray(card.venues) ? card.venues : [];
  const hasCoords = card.lat != null || card.lng != null;
  if (hasCoords && !inGreenpoint(card)) err(`coords outside Greenpoint (${card.lat}, ${card.lng})`);
  for (const v of venues) {
    if (!str(v.name)) err("venue missing name");
    if (v.lat != null && !inGreenpoint(v)) err(`venue "${v.name}" outside Greenpoint`);
  }
  if (!hasCoords && venues.length === 0) err("needs coords or venues to appear on the map");

  return { ok: errors.length === 0, errors };
}

// Ingest-time copy lint (2026-07-29 punch list, P1 #3). Warnings, not schema
// errors: measured on the live feed, 67 of 95 cards repeated ≥50% of their
// kicker inside their summary and 14 summaries ran past 200 chars — a hard
// error would fail the whole backlog. The ingest ritual runs this on every NEW
// or CHANGED card and rewrites until clean; existing cards tighten as their
// weekly re-verification touches them.
const SUMMARY_MAX = 200;
// 18 chars ≈ 140px rendered, so two authored actions + Share still clear the
// 343px row at 375px. Set from the live deck: every label already at or under
// it fits, and the six above it are the six that overflow.
const ACTION_LABEL_MAX = 18;
const sigWords = (s) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length >= 4);

export function lintCard(card) {
  const warnings = [];
  const warn = (m) => warnings.push(`${card?.id ?? "?"}: ${m}`);

  if (str(card.summary) && card.summary.length > SUMMARY_MAX) {
    warn(`summary ${card.summary.length} chars (ceiling ${SUMMARY_MAX}) — cut to what the row could not say`);
  }
  // Kicker/summary overlap: the two fields have different jobs (see the field
  // contract in validateCard) — a detail view that re-reads the row you just
  // tapped is the "text-heavy" failure mode.
  if (str(card.kicker) && str(card.summary)) {
    const kw = sigWords(card.kicker);
    if (kw.length > 0) {
      const sw = new Set(sigWords(card.summary));
      const repeated = kw.filter((w) => sw.has(w));
      if (repeated.length / kw.length >= 0.5) {
        warn(`summary repeats the kicker (${repeated.join(", ")}) — say what the row could not`);
      }
    }
  }
  // Action labels share ONE row that never wraps (2026-07-30), so a verbose
  // label doesn't cost a second line any more — it pushes the buttons after it
  // out of view. Share is appended to every card and dated cards also get "Add
  // to calendar", so an authored label is competing for ~343px at 375px with
  // two buttons it cannot see. A label is a destination, not a sentence:
  // "Reserve", not "Details & reservations".
  for (const a of card.actions ?? []) {
    if (str(a?.label) && a.label.length > ACTION_LABEL_MAX) {
      warn(`action "${a.label}" is ${a.label.length} chars (ceiling ${ACTION_LABEL_MAX}) — it will push later buttons off the row`);
    }
  }
  return { ok: warnings.length === 0, warnings };
}
