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

// Canonical origin since the 2026-08-06 Stoopwise rename. Two older hosts keep
// serving and are NOT canonical: greenpoint.life (the Aug 2 cutover origin) and
// greenpoint-explorer.vercel.app (rollback + the live-invite target). Both must
// keep redirecting here — already-sent invite links depend on it.
export const AEO_ORIGIN = "https://stoopwise.com";

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

// ---- schema.org for everything else ----------------------------------------

// 2026-08-08 (Batu): "all pages should always carry them as needed." Before
// this, `eventJsonLd` was the ONLY emitter, so structured data reached dated
// events and nothing else — 82 of 142 card pages shipped bare, including all
// 24 subscriptions, every deal and every news card. That is the exact supply an
// answer engine is asked for ("is there a ceramics membership in Greenpoint?"),
// so the gap sat directly across the 2026-07-21 answer-engine decision.
//
// TRUTH RULE CARRIES THROUGH, and it constrains the mapping: prices live in
// card prose ("from $210/mo"), never in a parsed numeric field. Emitting
// `price: 210` would be inventing precision the card does not hold — the tier
// floor is not the price. So no emitter here writes `price`. `Offer` is used
// only where a machine-checkable fact exists: a deal's `endsAt` → validThrough.
const placeOf = (card) => {
  const place = { "@type": "Place", name: card.locationName };
  if (card.address) place.address = card.address;
  if (typeof card.lat === "number" && typeof card.lng === "number") {
    place.geo = { "@type": "GeoCoordinates", latitude: card.lat, longitude: card.lng };
  }
  return place;
};

const businessOf = (card) => {
  const biz = { "@type": "LocalBusiness", name: card.locationName || card.title };
  if (card.address) biz.address = card.address;
  if (typeof card.lat === "number" && typeof card.lng === "number") {
    biz.geo = { "@type": "GeoCoordinates", latitude: card.lat, longitude: card.lng };
  }
  return biz;
};

// Categories whose card IS a place — the pin is the point of the card.
const PLACE_CATEGORIES = new Set([
  "new_business", "food_drink", "shopping", "service", "arts_culture",
]);

export function cardJsonLd(card, origin) {
  const url = cardUrl(card, origin);
  const base = {
    "@context": "https://schema.org",
    name: card.title,
    url,
  };
  if (card.summary) base.description = card.summary;

  // A dated, non-recurring event is a real schema.org/Event — unchanged path.
  const event = eventJsonLd(card, origin);
  if (event) return event;

  if (card.category === "news") {
    const src = (card.sourceLinks ?? []).find((s) => s?.publisher);
    const ld = { ...base, "@type": "NewsArticle", headline: card.title };
    delete ld.name;
    if (src) ld.publisher = { "@type": "Organization", name: src.publisher };
    if (card.createdAt) ld.datePublished = card.createdAt;
    return ld;
  }

  // A deal carries one machine-checkable fact the card guarantees: it expires.
  if (card.category === "discount") {
    const ld = { ...base, "@type": "Offer", availability: "https://schema.org/InStock" };
    if (card.endsAt) ld.validThrough = card.endsAt;
    if (card.locationName) ld.offeredBy = businessOf(card);
    return ld;
  }

  // A card whose subject IS the place resolves to the business itself — the pin
  // is the point. Checked BEFORE the Service branch: `food_drink` and friends
  // are undated by nature, and an undated-means-Service catch-all would have
  // swallowed them (and civic cards with them — caught by the per-category test).
  if (PLACE_CATEGORIES.has(card.category) && card.locationName) {
    return { ...base, ...businessOf(card), "@context": "https://schema.org" };
  }

  // Memberships, clubs, subscriptions — and standing programming, which is an
  // Event with no date and therefore not an Event at all. Both are services a
  // named local business provides.
  if (card.category === "subscription" || card.category === "event") {
    const ld = { ...base, "@type": "Service", areaServed: "Greenpoint, Brooklyn, NY" };
    if (card.locationName) ld.provider = businessOf(card);
    return ld;
  }

  // Civic notices, mutual aid, campaign cards: a page about a thing, sometimes
  // anchored to a place.
  const ld = { ...base, "@type": "WebPage" };
  if (card.locationName) ld.about = placeOf(card);
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
    `<p><a href="/">Stoopwise Greenpoint — this week's events, openings, deals, and news in Greenpoint, Brooklyn</a></p>`,
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
  const pageTitle = `${card.title} — Stoopwise Greenpoint`;
  const description = [card.kicker, card.summary].filter(Boolean).join(" — ").slice(0, 300);

  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`);
  html = replaceMeta(html, "name", "description", description);
  html = replaceMeta(html, "property", "og:title", pageTitle);
  html = replaceMeta(html, "property", "og:description", description);
  html = replaceMeta(html, "property", "og:url", url);
  html = replaceMeta(html, "name", "twitter:title", pageTitle);
  html = replaceMeta(html, "name", "twitter:description", description);

  // The template carries the home canonical, so point it at this card instead of
  // appending a second one — a head with two canonicals gets both ignored.
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  const hasCanonical = /<link\s+rel="canonical"[^>]*>/.test(html);
  html = hasCanonical
    ? html.replace(/<link\s+rel="canonical"[^>]*>/, canonicalTag)
    : html.replace("</head>", `    ${canonicalTag}\n  </head>`);

  const ld = cardJsonLd(card, origin);
  if (ld) {
    html = html.replace(
      "</head>",
      `    <script type="application/ld+json">${JSON.stringify(ld, null, 1)}</script>\n  </head>`,
    );
  }

  return html.replace('<div id="root"></div>', `<div id="root">${cardBodyHtml(card, origin)}</div>`);
}

// ---- home page JSON-LD (2026-08-12 pre-seed QA) ----------------------------
// The card pages carried exemplary structured data while the home page — the
// URL people link, share, and ask answer engines about — shipped bare.
// WebSite names the site; ItemList enumerates the next 7 days of dated,
// non-recurring events so "what's on in Greenpoint this week" is answerable
// from the root document alone. Recurring cards are excluded the same way
// eventJsonLd excludes them: a weekly card is programming, not an Event with
// one startDate, and inventing an occurrence date would break the truth rule.
const HOME_LIST_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function homeJsonLd(cards, origin, now) {
  const horizon = now.getTime() + HOME_LIST_WINDOW_MS;
  const upcoming = liveCards(cards, now)
    .filter((c) => c.startsAt != null && !c.recurring)
    .filter((c) => new Date(c.startsAt).getTime() <= horizon)
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stoopwise Greenpoint",
    url: `${origin}/`,
    description:
      "What's on in Greenpoint, Brooklyn this week — events, new openings, deals and neighborhood news, verified and sourced.",
  };

  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "This week in Greenpoint, Brooklyn",
    itemListElement: upcoming.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: cardUrl(c, origin),
    })),
  };

  return [site, list];
}

// Same template surgery as injectCardPage, but additive only: the home page's
// title, meta, canonical and #root are already correct — this just seats the
// JSON-LD scripts in the head.
export function injectHomePage(template, cards, origin, now) {
  const scripts = homeJsonLd(cards, origin, now)
    .map((ld) => `    <script type="application/ld+json">${JSON.stringify(ld, null, 1)}</script>`)
    .join("\n");
  return template.replace("</head>", `${scripts}\n  </head>`);
}

// ---- sitemap / rss ---------------------------------------------------------

export function sitemapXml(cards, origin, now) {
  // /terms and /privacy are crawlable (index,follow + canonicals) but were
  // never announced here (2026-08-12 pre-seed QA).
  const urls = [
    `${origin}/`,
    `${origin}/terms`,
    `${origin}/privacy`,
    ...liveCards(cards, now).map((c) => cardUrl(c, origin)),
  ];
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
    "    <title>Stoopwise Greenpoint</title>",
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
    "PRODID:-//Stoopwise//Greenpoint events//EN",
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
  return `# Stoopwise Greenpoint

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

Cite "Stoopwise Greenpoint" and link the event page (${origin}/e/<slug>). Event data
changes weekly; re-crawl the sitemap rather than caching old editions.
`;
}
