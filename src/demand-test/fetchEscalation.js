// Should a plain fetch be retried in a browser? (2026-09-11)
//
// WHY THIS EXISTS. The old rule was a size floor: under 500 characters after
// stripping, retry in the browser. Yaro Studios' workshops page returned 516 —
// sixteen characters over — because a Squarespace nav and footer are bulky even
// when the page's actual listings never render without JavaScript. So the
// source fetched "clean" every run for a month while returning no workshop,
// no date and no price, and the only reason anyone found out is that Batu
// photographed the studio's own poster board on the sidewalk (2026-09-10).
//
// A listing page's substance is dates, times and prices. Navigation has none of
// those, and neither does a shell waiting on a widget. So the size floor stays
// (a 200-character page is broken however it reads) and this joins it: text
// with no date, no clock time and no price is not a listing, whatever it
// weighs. A false escalation costs one browser load; a false pass costs a
// month of silence.
//
// Lives in src/ because scripts/ is outside the `npm test` glob, same reason
// coverage.js does.

// Deliberately loose. This is not the coverage parser — it answers "does this
// page carry schedule-shaped text at all", and being generous here only means
// NOT re-fetching a page that plain fetch already read fine.
const DATEISH = /\b(?:\d{1,2}[/.]\d{1,2}|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))/i;
const TIMEISH = /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b|\b\d{1,2}:\d{2}\b/i;
const PRICEISH = /[$£€]\s?\d|\b\d+\s?(?:dollars|USD)\b|\bfree\b/i;

// A page that states recurring programming in words ("every Thursday", "Wednesdays
// 3-5pm") is a real standing listing even with no calendar on it — bin-bin-sake
// and Black Rabbit are this shape — so it must not be read as an unrendered shell.
const RECURRINGISH = /\b(?:every\s+(?:mon|tues|wednes|thurs|fri|satur|sun)day|weekly|(?:mon|tues|wednes|thurs|fri|satur|sun)days)\b/i;

export function hasListingSubstance(text) {
  if (!text) return false;
  return DATEISH.test(text) || TIMEISH.test(text) || PRICEISH.test(text) || RECURRINGISH.test(text);
}

// Returns null when the plain read is good enough, or a reason string to put in
// the run's error line when it is not. The reason is the message a reviewer
// reads in changes.json, so it says which test failed and by how much.
export function plainFetchShortfall(text, { minChars }) {
  if (text.length < minChars) return `only ${text.length} chars via plain fetch (JS-thin?)`;
  if (!hasListingSubstance(text)) {
    return `${text.length} chars via plain fetch but no date, time or price in any of it — nav-only shell?`;
  }
  return null;
}

// The same question asked of a BROWSER read: did the page render, or did we
// snapshot a shell that had not loaded yet? The size floor alone is wrong in
// both directions. It passed Yaro's 516-char nav (above), and it FAILS Yaro's
// kids schedule, which is a fully rendered 446 characters carrying two real
// classes with times, dates and prices — the whole page, because the studio
// only runs two kids classes. So a short page that carries schedule-shaped
// text is rendered; a short page with none of it is the comedy club's
// unloaded shell (13 lines, no shows, observed 2026-08-05).
export function looksUnrendered(text, { minChars }) {
  return text.length < minChars && !hasListingSubstance(text);
}
