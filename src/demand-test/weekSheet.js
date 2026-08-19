// The printed / screenshotted week (D5, ratified 2026-08-17).
//
// One build-time page, three channels: a sheet handed person-to-person at the
// Saturday and Sunday markets (D4), a screenshot that travels into group chats
// where a link cannot, and the source image for the Instagram carousel (D3).
// It exists because the physical channel is otherwise an hour of layout every
// Monday, and because our single best channel to date was a WhatsApp message —
// a surface where images move and links are ignored.
//
// ATTRIBUTION SHAPES THE DESIGN. A printed URL gets typed, and a typed URL
// loses its `?src=`, which is the only attribution signal we get (messaging
// apps strip referrers — channel-links.md). So the sheet prints a SHORT VANITY
// PATH (`stoopwise.com/market`) that redirects to the tagged link in
// `vercel.json`. Typeable, memorable, and measurable — the three properties a
// QR code would also give us, without shipping a QR encoder.
//
// LEGAL CONSTRAINT baked in (attention map §8): this sheet is handed to people
// or placed with a venue's permission. It is never stapled to a pole or posted
// in a park — Admin Code §10-119 makes each flyer a separate $75–150 offence
// with the name printed on it presumed liable, and 56 RCNY §1-05(c) requires a
// permit in parks. The footer says so, so the constraint travels with the file.
import { groupByDay } from "./filterCards.js";
import { rowTime, editionLabel } from "./eventWindow.js";

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const WINDOW_DAYS = 7;

// This week's dated events, day-grouped, shelf dropped.
//
// A sheet is a SCHEDULE, so it carries only what has a time: undated cards
// (shops, standing memberships, advocacy) are the app's shelf and would pad the
// page without telling a reader when to be anywhere. `groupByDay` already puts
// recurring cards on their next real occurrence and marks the shelf, so the
// filtering here is just "keep the calendar, drop the shelf."
export function weekSheetGroups(cards, now, windowDays = WINDOW_DAYS) {
  const horizon = new Date(now);
  horizon.setDate(horizon.getDate() + windowDays);

  return groupByDay(cards ?? [], now)
    .filter((g) => !g.shelf)
    .map((group) => ({
      ...group,
      cards: group.cards.filter((c) => {
        const start = c.startsAt ? new Date(c.startsAt) : null;
        // Undated never reaches the sheet; a card whose next sitting is past
        // the horizon belongs to a later week's sheet.
        if (!start) return false;
        return start <= horizon;
      }),
    }))
    .filter((g) => g.cards.length > 0);
}

function cardRow(card) {
  // The DAY HEADER carries the date; the row carries the clock — the shared
  // `rowTime` from eventWindow.js, the same one the app's feed uses. Calling
  // formatWindow here instead put "Aug 4, 7:00 AM → Aug 25" on a Tuesday row
  // in the first build of this sheet: a span restated under a day heading,
  // which is the 2026-08-13 drift class exactly. An all-day or shelf-bound
  // card yields null and prints no clock rather than a fabricated one.
  const when = rowTime(card) ?? "";
  const free = card.free ? '<span class="free">FREE</span>' : "";
  return [
    '<li class="row">',
    `<span class="when">${escapeHtml(when)}</span>`,
    '<span class="what">',
    `<span class="title">${escapeHtml(card.title)}</span>`,
    card.locationName ? `<span class="where">${escapeHtml(card.locationName)}</span>` : "",
    "</span>",
    free,
    "</li>",
  ].join("");
}

// The whole sheet as one self-contained document.
//
// No <script> and no external asset host: it must render identically when
// printed, when opened in a hostile in-app webview, and when screenshotted.
// Colours are II-C tokens copied literally rather than imported, because this
// page ships without the app's stylesheet.
export function weekSheetHtml(cards, origin, now, { vanityPath = "/market" } = {}) {
  const groups = weekSheetGroups(cards, now);
  const printedUrl = `${origin.replace(/^https?:\/\//, "")}${vanityPath}`;
  const count = groups.reduce((n, g) => n + g.cards.length, 0);

  const body = groups.length
    ? groups
        .map(
          (g) =>
            `<section class="day"><h2>${escapeHtml(g.label)}</h2><ul>${g.cards
              .map(cardRow)
              .join("")}</ul></section>`,
        )
        .join("\n")
    : // The density floor (D2) made visible rather than papered over: a sheet
      // with headings and nothing under them teaches a reader the product is
      // thin. If this renders, the week should not be printed at all.
      '<p class="thin">No dated events in the next seven days — do not print this week.</p>';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>This week in Greenpoint — Stoopwise</title>
<meta name="robots" content="noindex">
<style>
  :root{--paper:#eae1ce;--paper-lift:#ece3cf;--ink:#2a241c;--ink-soft:rgba(42,36,28,.72);--ink-faint:rgba(42,36,28,.14);--green:#2e3b32;}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--paper);color:var(--ink);font:16px/1.4 ui-sans-serif,system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;padding:32px 28px;max-width:760px;margin:0 auto}
  header{border-bottom:2px solid var(--ink);padding-bottom:10px;margin-bottom:18px}
  .kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft)}
  h1{font-size:30px;line-height:1.05;letter-spacing:-.01em;margin:4px 0 2px}
  .sub{font-size:13px;color:var(--ink-soft)}
  .day{margin:0 0 16px}
  .day h2{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--paper-lift);background:var(--green);display:inline-block;padding:3px 8px;margin-bottom:6px}
  ul{list-style:none}
  .row{display:flex;gap:10px;align-items:baseline;padding:5px 0;border-bottom:1px solid var(--ink-faint)}
  .when{flex:0 0 118px;font-variant-numeric:tabular-nums;font-size:12px;color:var(--ink-soft)}
  .what{flex:1 1 auto}
  .title{font-weight:600;display:block;font-size:15px}
  .where{font-size:12px;color:var(--ink-soft)}
  .free{flex:0 0 auto;font-size:10px;letter-spacing:.1em;border:1px solid var(--ink);padding:1px 5px;align-self:center}
  .thin{padding:24px 0;font-size:15px}
  footer{margin-top:20px;border-top:2px solid var(--ink);padding-top:10px}
  .url{font-size:23px;font-weight:700;letter-spacing:-.01em}
  .foot-note{font-size:11px;color:var(--ink-soft);margin-top:3px}
  @media print{
    @page{margin:12mm}
    body{padding:0;max-width:none;background:#fff}
    .day{break-inside:avoid}
    .row{break-inside:avoid}
    .no-print{display:none}
  }
</style>
</head>
<body>
<header>
  <p class="kicker">${escapeHtml(editionLabel(now))}</p>
  <h1>What's on in Greenpoint this week</h1>
  <p class="sub">${count} event${count === 1 ? "" : "s"} · every one checked against a named source · free, no ads</p>
</header>
${body}
<footer>
  <p class="url">${escapeHtml(printedUrl)}</p>
  <p class="foot-note">The whole week, on a map, updated every Monday. Stoopwise Greenpoint.</p>
  <p class="foot-note no-print">Hand out or place with permission only — never on poles, trees, or in parks.</p>
</footer>
</body>
</html>`;
}
