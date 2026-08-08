import test from "node:test";
import assert from "node:assert/strict";
import {
  AEO_ORIGIN,
  liveCards,
  eventJsonLd,
  injectCardPage,
  sitemapXml,
  rssXml,
  icsText,
  llmsTxt,
} from "./aeo.js";

const NOW = new Date("2026-07-26T12:00:00-04:00");
const ORIGIN = "https://example.test";

const timed = {
  id: "gig-0730",
  title: "DJ Night & Friends",
  kicker: "Evening selector set",
  summary: 'Records, "deep cuts" & more',
  locationName: "Troost",
  address: "1011 Manhattan Ave, Brooklyn, NY 11222",
  lat: 40.732,
  lng: -73.955,
  free: true,
  startsAt: "2026-07-30T19:00:00-04:00",
  endsAt: "2026-07-30T22:00:00-04:00",
  filters: ["live_music"],
  sourceLinks: [{ title: "Troost calendar", publisher: "Troost", url: "https://troostny.com", date: "2026-07-25" }],
};

const allDay = {
  ...timed,
  id: "fair-0801",
  title: "Street Fair",
  startsAt: "2026-08-01T00:00:00-04:00",
  endsAt: "2026-08-02T23:59:00-04:00",
};

const sentinelEnd = {
  ...timed,
  id: "show-0730",
  startsAt: "2026-07-30T19:00:00-04:00",
  endsAt: "2026-07-30T23:59:00-04:00",
};

const undated = {
  ...timed,
  id: "le-fanfare",
  title: "Le Fanfare",
  startsAt: null,
  endsAt: null,
};

const expired = {
  ...timed,
  id: "gone-0720",
  startsAt: "2026-07-20T19:00:00-04:00",
  endsAt: "2026-07-20T22:00:00-04:00",
};

// ---- liveCards -------------------------------------------------------------

test("liveCards keeps current + undated, drops expired", () => {
  const live = liveCards([timed, undated, expired], NOW);
  assert.deepEqual(live.map((c) => c.id), ["gig-0730", "le-fanfare"]);
});

// ---- eventJsonLd -----------------------------------------------------------

test("timed event: verbatim ISO dates, Place with geo, free flag, url", () => {
  const ld = eventJsonLd(timed, ORIGIN);
  assert.equal(ld["@type"], "Event");
  assert.equal(ld.startDate, "2026-07-30T19:00:00-04:00");
  assert.equal(ld.endDate, "2026-07-30T22:00:00-04:00");
  assert.equal(ld.location.name, "Troost");
  assert.equal(ld.location.address, "1011 Manhattan Ave, Brooklyn, NY 11222");
  assert.equal(ld.location.geo.latitude, 40.732);
  assert.equal(ld.isAccessibleForFree, true);
  assert.equal(ld.url, `${ORIGIN}/e/gig-0730`);
});

test("all-day sentinels become bare dates, never fake clocks", () => {
  const ld = eventJsonLd(allDay, ORIGIN);
  assert.equal(ld.startDate, "2026-08-01");
  assert.equal(ld.endDate, "2026-08-02");
});

test("same-day sentinel end (unknown end time) omits endDate", () => {
  const ld = eventJsonLd(sentinelEnd, ORIGIN);
  assert.equal(ld.startDate, "2026-07-30T19:00:00-04:00");
  assert.equal(ld.endDate, undefined);
});

test("undated and recurring cards get no Event JSON-LD", () => {
  assert.equal(eventJsonLd(undated, ORIGIN), null);
  assert.equal(eventJsonLd({ ...timed, recurring: true }, ORIGIN), null);
});

// ---- injectCardPage --------------------------------------------------------

const TEMPLATE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Stoopwise Greenpoint</title>
    <meta
      name="description"
      content="site description"
    />
    <meta property="og:title" content="Stoopwise Greenpoint" />
    <meta
      property="og:description"
      content="site og description"
    />
    <meta property="og:url" content="https://example.test/" />
    <meta name="twitter:title" content="Stoopwise Greenpoint" />
    <meta
      name="twitter:description"
      content="site tw description"
    />
    <script type="module" src="/assets/index-abc123.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

test("injectCardPage swaps title/meta, adds canonical + JSON-LD, fills #root", () => {
  const html = injectCardPage(TEMPLATE, timed, ORIGIN);
  assert.match(html, /<title>DJ Night &amp; Friends — Stoopwise Greenpoint<\/title>/);
  assert.ok(!html.includes("site description"), "site meta description replaced");
  assert.match(html, /<meta property="og:title" content="DJ Night &amp; Friends — Stoopwise Greenpoint" \/>/);
  assert.match(html, /<meta property="og:url" content="https:\/\/example\.test\/e\/gig-0730" \/>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/example\.test\/e\/gig-0730" \/>/);
  assert.match(html, /<script type="application\/ld\+json">[\s\S]*"@type": ?"Event"/);
  // Static content lives INSIDE #root so the SPA replaces it on boot.
  assert.match(html, /<div id="root">[\s\S]*DJ Night &amp; Friends[\s\S]*<\/div>/);
  assert.match(html, /1011 Manhattan Ave/);
  assert.match(html, /Troost calendar/, "source attribution is part of the crawlable page");
  // The app still boots: hashed bundle reference untouched.
  assert.match(html, /assets\/index-abc123\.js/);
});

test("undated card page: no JSON-LD, content + canonical still present", () => {
  const html = injectCardPage(TEMPLATE, undated, ORIGIN);
  assert.ok(!html.includes("application/ld+json"));
  assert.match(html, /<link rel="canonical" href="https:\/\/example\.test\/e\/le-fanfare" \/>/);
});

// The template carries the HOME canonical (so `/` isn't a duplicate of the
// rollback origin). A card page must OVERWRITE it, not add a second one —
// two canonicals in one head make search engines ignore both.
test("card page replaces the template's home canonical rather than adding a second", () => {
  const withHomeCanonical = TEMPLATE.replace(
    "<title>",
    '<link rel="canonical" href="https://example.test/" />\n    <title>',
  );
  const html = injectCardPage(withHomeCanonical, timed, ORIGIN);
  const canonicals = html.match(/<link rel="canonical"[^>]*>/g) ?? [];
  assert.equal(canonicals.length, 1, `expected exactly one canonical, got ${canonicals.length}`);
  assert.match(canonicals[0], /href="https:\/\/example\.test\/e\/gig-0730"/);
});

// ---- feeds -----------------------------------------------------------------

test("sitemap lists root + live cards only", () => {
  const xml = sitemapXml([timed, undated, expired], ORIGIN, NOW);
  assert.match(xml, /<loc>https:\/\/example\.test\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example\.test\/e\/gig-0730<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example\.test\/e\/le-fanfare<\/loc>/);
  assert.ok(!xml.includes("gone-0720"));
});

test("rss escapes entities and links each live card", () => {
  const xml = rssXml([timed, expired], ORIGIN, NOW);
  assert.match(xml, /<title>DJ Night &amp; Friends<\/title>/);
  assert.match(xml, /<link>https:\/\/example\.test\/e\/gig-0730<\/link>/);
  assert.match(xml, /&quot;deep cuts&quot;/);
  assert.ok(!xml.includes("gone-0720"));
});

test("ics: CRLF, timed event stamps, all-day exclusive DTEND, escaping", () => {
  const ics = icsText([timed, allDay, sentinelEnd, undated], ORIGIN, NOW);
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
  assert.ok(ics.trimEnd().endsWith("END:VCALENDAR"));
  assert.match(ics, /UID:gig-0730@example\.test/);
  assert.match(ics, /DTSTART:20260730T230000Z/);
  assert.match(ics, /DTEND:20260731T020000Z/);
  assert.match(ics, /DTSTART;VALUE=DATE:20260801/);
  assert.match(ics, /DTEND;VALUE=DATE:20260803/, "all-day DTEND is exclusive");
  // Unknown end time falls back to +2h (mirrors gcalEventUrl).
  assert.match(ics, /UID:show-0730@example\.test[\s\S]*?DTEND:20260731T010000Z/);
  assert.match(ics, /LOCATION:Troost\\, 1011 Manhattan Ave/, "commas escaped per RFC 5545");
  assert.ok(!ics.includes("le-fanfare"), "undated cards are not VEVENTs");
  for (const line of ics.split("\r\n")) {
    assert.ok(line.length <= 75, `ics line over 75 octets: ${line.slice(0, 80)}`);
  }
});

test("llms.txt names the product and points at the machine surfaces", () => {
  const txt = llmsTxt(ORIGIN);
  assert.match(txt, /Stoopwise Greenpoint/);
  assert.match(txt, /sitemap\.xml/);
  assert.match(txt, /rss\.xml/);
  assert.match(txt, /events\.ics/);
});

test("AEO_ORIGIN is the current production origin", () => {
  assert.equal(AEO_ORIGIN, "https://stoopwise.com");
});
