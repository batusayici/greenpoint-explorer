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
import { isAllDay, isEndSentinel, nyDay, utcStamp, dateValue } from "./calendarLink.js";
import { RECURRENCE_DAYS } from "./cardSchema.js";
import { editionLabel, isDailySitting } from "./eventWindow.js";

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

// The first sitting's end: the start's calendar day carrying the end's clock.
// Built from the card's own ISO strings rather than by date arithmetic — the
// two share a calendar day by construction here, so they share a UTC offset,
// and no DST edge can shift the result.
const sameDayEnd = (startsAt, end) =>
  `${startsAt.slice(0, 10)}T${NY_CLOCK.format(end)}:00${startsAt.slice(19)}`;

export function eventJsonLd(card, origin) {
  if (card.startsAt == null || card.recurring) return null;
  const start = new Date(card.startsAt);
  const end = card.endsAt ? new Date(card.endsAt) : null;

  let startDate, endDate;
  if (isAllDay(card)) {
    startDate = nyDay(start);
    if (end && isEndSentinel(end)) endDate = nyDay(end);
  } else {
    startDate = card.startsAt;
    // A 23:59 end is the "unknown end time" sentinel on a same-day event —
    // omitting endDate is honest; inventing one is not.
    //
    // A MULTI-DAY DAILY SITTING needs the same restraint (2026-08-13). Its
    // `endsAt` is the LAST day's end, so emitting it here told every crawler
    // that a camp for 4-to-7-year-olds ran from Thursday 9am to Friday 3pm
    // without stopping — 30 unbroken hours, on the surface this product most
    // wants to be cited from. schema.org can say "9–3 daily" with a Schedule,
    // but only via `byDay`, and byDay is not sourceable here: a month-long
    // daily window (the CIBONE showcase) would need a seven-day byDay
    // asserting opening days nobody stated. So this emits the ONE occurrence
    // it can source — the first sitting, ending on its own day — and leaves
    // the repeat to the description ("run across two consecutive days").
    // Omitting beats inventing, exactly as for the sentinel above.
    if (end && !isEndSentinel(end)) {
      endDate = isDailySitting(card) ? sameDayEnd(card.startsAt, end) : card.endsAt;
    } else if (end && nyDay(end) !== nyDay(start)) endDate = nyDay(end);
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
  if (card.free === true) ld.offers = FREE_OFFER;
  return ld;
}

// GSC flags Events without `offers` (2026-08-17). `free: true` is a sourced
// fact and price 0 is Google's own convention for stating it; paid or unstated
// events emit nothing — the card holds no price, and the truth rules won't
// parse one out of prose (see the cardJsonLd preamble).
const FREE_OFFER = {
  "@type": "Offer",
  price: 0,
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
};

// ---- schema.org/Event for RECURRING programming ----------------------------

// 2026-08-13. Standing programming used to fall through to `Service`, on the
// reasoning that a weekly card is not an Event with one startDate and that
// inventing an occurrence date would break the truth rule. That reasoning was
// right; it just had one option missing. schema.org/Schedule states a rhythm
// WITHOUT asserting any occurrence: "every Tuesday at 5pm, between these
// dates" is exactly what `recurrence.days` + the card's own window already
// say. Nothing is invented, and "what's on this weekend" — the single most
// likely question a neighborhood answer engine is asked — can now match 19
// cards that were previously typed as services.
//
// Deliberately narrow:
//   · `category === "event"` ONLY. A recurring DEAL stays an Offer (its
//     machine-checkable fact is that it expires) and a recurring SUBSCRIPTION
//     stays a Service (you join it; the taxonomy means membership, and
//     re-typing it here would be re-deciding the taxonomy in the wrong file).
//   · `recurrence.days` REQUIRED. Four recurring cards don't state a day —
//     they are standing offers, not weekly events — and a Schedule with no
//     byDay would be a claim we can't source.
//   · Top-level `startDate` is the FIRST SOURCED OCCURRENCE (2026-08-17;
//     originally omitted on the reasoning that the Event has no single
//     occurrence). Google rejects an Event without one as a critical error —
//     no rich result at all — and the first occurrence needs no invention:
//     the card states its days and its window start, so the earliest stated
//     day in the window is already a claim the card makes. The rhythm still
//     lives in the Schedule.
const SCHEMA_DAY = {
  sun: "https://schema.org/Sunday",
  mon: "https://schema.org/Monday",
  tue: "https://schema.org/Tuesday",
  wed: "https://schema.org/Wednesday",
  thu: "https://schema.org/Thursday",
  fri: "https://schema.org/Friday",
  sat: "https://schema.org/Saturday",
};

// NY wall-clock "HH:MM" — the time the card already prints in its row. Only
// used when the start is a real clock time, never for the all-day sentinel.
const NY_CLOCK = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/New_York",
});

const NY_WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "America/New_York" });
const nyWeekdayKey = (d) => NY_WEEKDAY.format(d).toLowerCase();

// The first occurrence a recurring card can SOURCE: the earliest day on/after
// its window start whose NY weekday the card states. When the window opens on
// a stated day and carries a real clock time, that instant is card.startsAt
// verbatim; otherwise the occurrence is date-only — the card's clock belongs
// to its stated days, and welding it onto a derived date would manufacture an
// ISO instant nobody wrote.
function firstOccurrence(card) {
  const start = new Date(card.startsAt);
  for (let i = 0; i < 7; i++) {
    const day = new Date(start.getTime() + i * 86400000);
    if (!card.recurrence.days.includes(nyWeekdayKey(day))) continue;
    return i === 0 && !isAllDay(card) ? card.startsAt : nyDay(day);
  }
  return null;
}

export function recurringEventJsonLd(card, origin) {
  const days = card.recurrence?.days;
  if (!Array.isArray(days) || days.length === 0) return null;
  if (card.category !== "event") return null;

  const schedule = {
    "@type": "Schedule",
    repeatFrequency: "P1W",
    byDay: RECURRENCE_DAYS.filter((d) => days.includes(d)).map((d) => SCHEMA_DAY[d]),
    scheduleTimezone: "America/New_York",
  };

  if (card.startsAt != null) {
    const start = new Date(card.startsAt);
    schedule.startDate = nyDay(start);
    // An all-day card sourced no clock time, so none is emitted (same
    // contract as eventJsonLd and calendarLink).
    if (!isAllDay(card)) schedule.startTime = NY_CLOCK.format(start);
  }
  if (card.endsAt != null) schedule.endDate = nyDay(new Date(card.endsAt));

  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: card.title,
    eventStatus: "https://schema.org/EventScheduled",
    eventSchedule: schedule,
    location: placeOf(card),
    url: cardUrl(card, origin),
  };
  if (card.startsAt != null) {
    const occurrence = firstOccurrence(card);
    if (occurrence) ld.startDate = occurrence;
  }
  if (card.summary) ld.description = card.summary;
  if (typeof card.free === "boolean") ld.isAccessibleForFree = card.free;
  if (card.free === true) ld.offers = FREE_OFFER;
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

  // Recurring programming that states its days is also an Event — one that
  // carries a Schedule instead of an occurrence date (2026-08-13).
  const recurringEvent = recurringEventJsonLd(card, origin);
  if (recurringEvent) return recurringEvent;

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
  if (isAllDay(card)) {
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
    // Each entry carries the EVENT, not just a headline and a link
    // (2026-08-13). Measured before this change: every crawler — Googlebot
    // included — got zero visible words from the home page, and the ItemList
    // was `name` + `url` only. So the one machine-readable thing the home page
    // had said "these 42 things exist, go and fetch 42 more pages" and could
    // not answer "what's on Thursday" from the page it was already holding.
    //
    // Compact on purpose: name, dates, url, and where. No geo, no description
    // — those are on the card page, and 42 full Events would bloat the entry
    // document for facts a follow-up fetch already provides.
    //
    // Dates come from eventJsonLd rather than being re-derived, so the
    // all-day/unknown-end sentinels are honoured by construction; a second
    // date implementation here is exactly how a fake 00:00 clock time would
    // reach a crawler.
    itemListElement: upcoming.map((c, i) => {
      const ev = eventJsonLd(c, origin);
      const item = {
        "@type": "Event",
        name: c.title,
        startDate: ev.startDate,
        url: cardUrl(c, origin),
      };
      if (ev.endDate) item.endDate = ev.endDate;
      if (c.locationName) {
        item.location = { "@type": "Place", name: c.locationName };
        if (c.address) item.location.address = c.address;
      }
      return { "@type": "ListItem", position: i + 1, url: cardUrl(c, origin), item };
    }),
  };

  return [site, list];
}

// Same template surgery as injectCardPage, but additive only: the home page's
// title, meta, canonical and #root are already correct — this just seats the
// JSON-LD scripts in the head.
// The home page's static body (2026-08-13). Until now `#root` shipped empty —
// a 51-byte body — so the home page had structured data and NOT ONE WORD of
// prose for anything that doesn't execute JS. Bing Webmaster Tools flagged it
// independently as an `H1 tag missing` SEO/GEO error, which is how it finally
// got measured rather than assumed.
//
// DELIBERATELY THE HEADER, NOT THE FEED. Prerendering the whole week's listings
// is a separate, still-open product decision — it changes what the first screen
// says and collides with calls already made twice (2026-08-02). This is the
// narrow fix: the page states what it IS to a machine that can't run the app.
//
// Every line is VERBATIM from what the app renders — same edition kicker, same
// h1, and the orientation line the header shows a first-time visitor. Inventing
// a crawler-only headline (say, stuffing the title's "what's on this week"
// phrasing into the h1) would show machines something readers never see, which
// is the one thing the truth rules will not carry.
//
// Costs readers nothing: `createRoot()` replaces `#root` wholesale, exactly as
// it already does on every card page, so this is only ever visible in the
// moment before JS boots — where a styled header beats a blank page anyway.
export function homeBodyHtml(cards, origin, now) {
  return [
    "<main>",
    `<p>${escapeHtml(editionLabel(now))}</p>`,
    "<h1>Stoopwise Greenpoint</h1>",
    "<p>Events, openings, deals and neighborhood news — verified and sourced.</p>",
    "</main>",
  ].join("\n");
}

export function injectHomePage(template, cards, origin, now) {
  const scripts = homeJsonLd(cards, origin, now)
    .map((ld) => `    <script type="application/ld+json">${JSON.stringify(ld, null, 1)}</script>`)
    .join("\n");
  return template
    .replace("</head>", `${scripts}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${homeBodyHtml(cards, origin, now)}</div>`);
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
    if (isAllDay(c)) {
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
