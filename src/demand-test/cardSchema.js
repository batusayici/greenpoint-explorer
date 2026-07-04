// Track V — GreenpointMapCard validation. Disposable v1 shape (per the 2026-07-02
// spec) with canonical discipline: enums locked, coordinates must be derived and
// inside Greenpoint, every card carries an attributed source. Extensions over the
// seed-doc type, all from the spec + its hidden-engagement addendum: `filters`
// (authored filter-bar membership), `venues` (multi-venue event cluster, e.g. the
// World Cup bars), `subscription` category, `join` action, `startsAt`/`endsAt`
// (ISO window for the Today lens). 2026-07-03 place-graph moat fields (spec
// revision): `trustRisk` (required enum), `relatedCardIds` (optional, cross-card
// linking), `timeline` (optional, dated history entries) — see DECISION_LOG.
export const CATEGORIES = [
  "new_business", "food_drink", "shopping", "service", "event",
  "arts_culture", "family_kids", "job", "shopkeeper_profile",
  "g_train_support", "civic_action", "discount", "support_local",
  "subscription",
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

// Filter-bar ids, in display order (spec + addendum: New · Food & Drink ·
// Shopping · Services · Arts/Culture · Family/Kids · Events · Clubs & Signups ·
// G-Train Support). The Today lens is a separate toggle, not a filter id.
export const FILTER_IDS = [
  "new", "food_drink", "shopping", "services",
  "arts_culture", "family_kids", "events", "clubs_signups", "g_train",
];

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
  if (!str(card.summary)) err("missing summary");
  if (!CATEGORIES.includes(card.category)) err(`unknown category "${card.category}"`);

  if (!Array.isArray(card.filters) || card.filters.length === 0) err("missing filters");
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

  // Hidden-engagement addendum: optional event window for the Today lens.
  for (const key of ["startsAt", "endsAt"]) {
    if (card[key] != null && Number.isNaN(Date.parse(card[key]))) err(`${key} is not ISO datetime`);
  }
  if (card.startsAt && card.endsAt && Date.parse(card.startsAt) > Date.parse(card.endsAt)) {
    err("startsAt after endsAt");
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
