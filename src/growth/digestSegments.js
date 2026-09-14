// Who gets which edition of the weekly digest (DECISION_LOG 2026-09-13).
//
// The signup form records one thing besides the address: what the reader chose
// to follow — a lens (`lens:family_kids`) or the whole neighborhood (`all`).
// That choice is the promise the email keeps. A lens with enough followers gets
// its own edition, sent on its own `src`; everyone else gets the Greenpoint
// edition. The threshold is a rule, not a one-off: below it a lens is folded
// into Greenpoint and reported as folded, so a lens crossing the line is
// visible the week it happens rather than discovered by hand.
//
// Pure: takes the normalised Tally submissions (scripts/growth/sources/tally.mjs)
// and returns editions with their recipient lists. It never reads or writes a
// file — addresses are printed by the caller, to a terminal, and nowhere else.

import { FILTERS } from "../demand-test/filterCards.js";
import { LENS_PAGES } from "../demand-test/deepLink.js";

export const LENS_EDITION_THRESHOLD = 5;

const ORIGIN = "https://stoopwise.com";
const GREENPOINT = { id: "greenpoint", lens: null, label: "Greenpoint", src: "digest" };

const LABELS = new Map(FILTERS.map((f) => [f.id, f.label]));
// `family_kids` → `/kids`: the lens pages are what a person types, so the edition
// link lands on the page whose title and preview name the lens.
const PATH_BY_LENS = new Map(Object.entries(LENS_PAGES).map(([path, lens]) => [lens, `/${path}`]));

const lensSrc = (lens) => `follow-${lens.replace(/_/g, "-")}`;
const editionLink = (path, src) => `${ORIGIN}${path}?src=${src}`;

const parseFollow = (follow) => {
  if (typeof follow !== "string" || !follow.startsWith("lens:")) return null;
  return follow.slice("lens:".length) || null;
};

export function digestSegments(submissions, { unsubscribed = [], threshold = LENS_EDITION_THRESHOLD } = {}) {
  const stop = new Set(unsubscribed.map((e) => String(e).trim().toLowerCase()));

  // One row per person. A lens choice beats `all` whatever the order, because
  // "Follow Family & Kids" is the more specific promise; between two lens
  // choices the later one wins.
  const byEmail = new Map();
  let dropped = 0;
  let duplicates = 0;
  for (const s of [...submissions].sort((a, b) => String(a.submittedAt).localeCompare(String(b.submittedAt)))) {
    const email = typeof s.email === "string" ? s.email.trim().toLowerCase() : "";
    if (!email) {
      dropped += 1;
      continue;
    }
    const lens = parseFollow(s.follow);
    const prev = byEmail.get(email);
    if (prev) {
      duplicates += 1;
      if (lens) byEmail.set(email, lens);
    } else {
      byEmail.set(email, lens);
    }
  }

  let unsubscribedCount = 0;
  for (const email of [...byEmail.keys()]) {
    if (stop.has(email)) {
      byEmail.delete(email);
      unsubscribedCount += 1;
    }
  }

  const byLens = new Map();
  for (const [email, lens] of byEmail) {
    if (!lens) continue;
    if (!byLens.has(lens)) byLens.set(lens, []);
    byLens.get(lens).push(email);
  }

  const editions = [];
  const folded = [];
  const greenpoint = [];
  for (const [email, lens] of byEmail) if (!lens) greenpoint.push(email);
  for (const [lens, emails] of [...byLens].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))) {
    if (emails.length >= threshold && LABELS.has(lens)) {
      const src = lensSrc(lens);
      editions.push({
        id: lens,
        lens,
        label: LABELS.get(lens),
        src,
        link: editionLink(PATH_BY_LENS.get(lens) ?? "/", src),
        recipients: [...emails].sort(),
      });
    } else {
      folded.push({ lens, count: emails.length });
      greenpoint.push(...emails);
    }
  }
  if (greenpoint.length) {
    editions.push({ ...GREENPOINT, link: editionLink("/", GREENPOINT.src), recipients: [...greenpoint].sort() });
  }

  return { editions, folded, duplicates, unsubscribed: unsubscribedCount, dropped };
}
