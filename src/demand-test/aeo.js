// AEO surface (ops plan 3.6, 2026-07-21 answer-engine decision): the SPA is
// invisible to LLM crawlers (GPTBot/ClaudeBot/PerplexityBot don't execute JS),
// so the card data must exist as raw HTML + schema.org JSON-LD. These are the
// pure builders; scripts/prerender-aeo.mjs writes them into dist/ after the
// Vite build. Same cards, made legible to machines — no UI change.
//
// Truth carries through: pages emit only card fields (sourced, review-gated),
// and sentinel times are honored — a 00:00 start or 23:59 end is a DATE, and
// no invented clock time ever reaches a crawler (same contract as
// calendarLink.js, whose helpers these are).
import { isExpiredCard } from "./filterCards.js";
import { isStartSentinel, isEndSentinel, nyDay, utcStamp, dateValue } from "./calendarLink.js";

// Canonical origin since the 2026-08-02 domain cutover (L7). The vercel.app
// host keeps serving as rollback + the live-invite target; it is not canonical.
export const AEO_ORIGIN = "https://greenpoint.life";

export const liveCards = (cards, now) => cards.filter((c) => !isExpiredCard(c, now));

const cardUrl = (card, origin) => `${origin}/e/${encodeURIComponent(card.id)}`;

const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch],
  );

// ---- schema.org/Event ------------------------------------------------------

export function eventJsonLd(card, origin) {
  if (card.startsAt == null || card.recurring) return null;
  const start = new Date(card.startsAt);
  const end = card.endsAt ? new Date(card.endsAt) : null;

  let startDate, endDate;
  if (isStartSentinel(start)) {
    startDate = nyDay(start);
    if (end && isEndSentinel(end)) endDate = nyDay(end);
  } else {
    startDate = card.startsAt;
    // A 23:59 end is the "unknown end time" sentinel on a same-day event —
    // omitting endDate is honest; inventing one is not.
    if (end && !isEndSentinel(end)) endDate = card.endsAt;
    else if (end && nyDay(end) !== nyDay(start)) endDate = nyDay(end);
  }

  const location = { "@type": "Place", name: card.locationName };
  if (card.address) location.address = card.address;
  if (typeof card.lat === "number" && typeof card.lng === "number") {
    location.geo = { "@type": "GeoCoordinates", latitude: card.lat, longitude: card.lng };
  }

  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: card.title,
    description: card.summary,
    startDate,
    eventStatus: "https://schema.org/EventScheduled",
    location,
    url: cardUrl(card, origin),
  };
  if (endDate) ld.endDate = endDate;
  if (typeof card.free === "boolean") ld.isAccessibleForFree = card.free;
  return ld;
}

// ---- per-card page ---------------------------------------------------------

// Human-readable window line for the static body (crawlers read this too).
function windowLine(card) {
  if (card.startsAt == null) return null;
  const start = new Date(card.startsAt);
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York",
  }).format(start);
  if (isStartSentinel(start)) {
    const end = card.endsAt ? new Date(card.endsAt) : null;
    if (end && isEndSentinel(end) && nyDay(end) !== nyDay(start)) {
      const endDay = new Intl.DateTimeFormat("en-US", {
        weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York",
      }).format(end);
      return `${day} – ${endDay}`;
    }
    return day;
  }
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
  }).format(start);
  return `${day} · ${time}`;
}

function cardBodyHtml(card, origin) {
  const when = windowLine(card);
  const where = [card.locationName, card.address].filter(Boolean).join(" · ");
  const sources = (card.sourceLinks ?? [])
    .map((s) =>
      s.url
        ? `<a href="${escapeHtml(s.url)}" rel="nofollow">${escapeHtml(s.title)}</a>`
        : escapeHtml(s.title),
    )
    .join(" · ");
  return [
    "<main>",
    `<h1>${escapeHtml(card.title)}</h1>`,
    card.kicker ? `<p>${escapeHtml(card.kicker)}</p>` : null,
    when ? `<p>${escapeHtml(when)}</p>` : null,
    where ? `<p>${escapeHtml(where)}</p>` : null,
    card.summary ? `<p>${escapeHtml(card.summary)}</p>` : null,
    sources ? `<p>Source: ${sources}</p>` : null,
    `<p><a href="/">Greenpoint Life — this week's events, openings, deals, and news in Greenpoint, Brooklyn</a></p>`,
    "</main>",
  ]
    .filter(Boolean)
    .join("\n");
}

const metaTag = (attr, key, content) => `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
const replaceMeta = (html, attr, key, content) =>
  html.replace(
    new RegExp(`<meta\\s+${attr}="${key}"[\\s\\S]*?/>`),
    metaTag(attr, key, content),
  );

// Template surgery over the BUILT dist/index.html so hashed asset references
// survive: crawlers read the injected head + #root content; a browser boots
// the SPA, whose createRoot().render() replaces the #root children.
export function injectCardPage(template, card, origin) {
  const url = cardUrl(card, origin);
  const pageTitle = `${card.title} — Greenpoint Life`;
  const description = [card.kicker, card.summary].filter(Boolean).join(" — ").slice(0, 300);

  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`);
  html = replaceMeta(html, "name", "description", description);
  html = replaceMeta(html, "property", "og:title", pageTitle);
  html = replaceMeta(html, "property", "og:description", description);
  html = replaceMeta(html, "property", "og:url", url);
  html = replaceMeta(html, "name", "twitter:title", pageTitle);
  html = replaceMeta(html, "name", "twitter:description", description);

  const ld = eventJsonLd(card, origin);
  const headExtras = [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    ld ? `<script type="application/ld+json">${JSON.stringify(ld, null, 1)}</script>` : null,
  ]
    .filter(Boolean)
    .join("\n    ");
  html = html.replace("</head>", `    ${headExtras}\n  </head>`);

  return html.replace('<div id="root"></div>', `<div id="root">${cardBodyHtml(card, origin)}</div>`);
}

// ---- sitemap / rss ---------------------------------------------------------

export function sitemapXml(cards, origin, now) {
  const urls = [`${origin}/`, ...liveCards(cards, now).map((c) => cardUrl(c, origin))];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url><loc>${escapeHtml(u)}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
}

export function rssXml(cards, origin, now) {
  const items = liveCards(cards, now).map((c) =>
    [
      "    <item>",
      `      <title>${escapeHtml(c.title)}</title>`,
      `      <link>${escapeHtml(cardUrl(c, origin))}</link>`,
      `      <guid isPermaLink="true">${escapeHtml(cardUrl(c, origin))}</guid>`,
      `      <description>${escapeHtml([c.kicker, c.summary].filter(Boolean).join(" — "))}</description>`,
      "    </item>",
    ].join("\n"),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>Greenpoint Life</title>",
    `    <link>${origin}/</link>`,
    "    <description>This week in Greenpoint, Brooklyn — events, new openings, deals, and neighborhood news, verified and sourced.</description>",
    `    <lastBuildDate>${now.toUTCString()}</lastBuildDate>`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

// ---- ics -------------------------------------------------------------------

const icsEscape = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");

// RFC 5545 §3.1: content lines fold at 75 octets with CRLF + single space.
function foldIcsLine(line) {
  const out = [];
  let rest = line;
  while (rest.length > 75) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out;
}

export function icsText(cards, origin, now) {
  const host = new URL(origin).host;
  const stampNow = utcStamp(now);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Greenpoint Life//events//EN",
    "CALSCALE:GREGORIAN",
  ];
  for (const c of liveCards(cards, now)) {
    if (c.startsAt == null || c.recurring) continue;
    const start = new Date(c.startsAt);
    const end = c.endsAt ? new Date(c.endsAt) : null;
    lines.push("BEGIN:VEVENT", `UID:${c.id}@${host}`, `DTSTAMP:${stampNow}`);
    if (isStartSentinel(start)) {
      const lastDay = end && isEndSentinel(end) ? end : start;
      lines.push(
        `DTSTART;VALUE=DATE:${dateValue(start)}`,
        `DTEND;VALUE=DATE:${dateValue(new Date(lastDay.getTime() + 86400000))}`,
      );
    } else {
      const realEnd = end && !isEndSentinel(end) ? end : new Date(start.getTime() + 2 * 3600000);
      lines.push(`DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(realEnd)}`);
    }
    lines.push(`SUMMARY:${icsEscape(c.title)}`);
    const loc = [c.locationName, c.address].filter(Boolean).join(", ");
    if (loc) lines.push(`LOCATION:${icsEscape(loc)}`);
    if (c.summary) lines.push(`DESCRIPTION:${icsEscape(c.summary)}`);
    lines.push(`URL:${cardUrl(c, origin)}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.flatMap(foldIcsLine).join("\r\n") + "\r\n";
}

// ---- llms.txt --------------------------------------------------------------

export function llmsTxt(origin) {
  return `# Greenpoint Life

> The week's events, new business openings, deals, memberships, and neighborhood
> news for Greenpoint, Brooklyn — verified, sourced, and mapped. Refreshed weekly
> (Mondays, with daily updates). Nothing invented: every card cites a named
> source, and unverifiable items don't ship.

## Machine-readable surfaces

- Events and places, one page each: ${origin}/sitemap.xml
- Event pages carry schema.org/Event JSON-LD in raw HTML (no JS needed).
- Feed of current cards: ${origin}/rss.xml
- Calendar of current dated events: ${origin}/events.ics

## Citing

Cite "Greenpoint Life" and link the event page (${origin}/e/<slug>). Event data
changes weekly; re-crawl the sitemap rather than caching old editions.
`;
}
