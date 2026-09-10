#!/usr/bin/env node
// Agent-browser verifier (2026-08-13) — Layer 2 of the agent-testing scope.
//
// Checks what a JS-EXECUTING AI AGENT receives. This is the population that
// broke: the map bug was reported from ChatGPT's cloud browser, where GPU
// rendering is disabled in the sandbox, and the whole product collapsed to a
// crash screen. Crawlers never saw it (they don't run JS) and neither did any
// human reviewer (their browsers have GPUs), so nothing in the verification
// portfolio could reach it — see docs/environmental-dependencies.md.
//
// Serves the BUILT site and drives it in a deliberately hostile context, with
// the two failure modes that actually happened in production:
//   · WebGL unavailable    — the reported bug
//   · storage access blocked — found while auditing why the first went uncaught
//
// Playwright is already a devDependency (used by verify:visual), so this adds
// no tooling. It uses addInitScript, which runs BEFORE page scripts — the one
// thing that makes these environments reproducible at all.
//
// Usage: npm run build && npm run verify:agent-browser
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, extname } from "node:path";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");

if (!existsSync(DIST)) {
  console.error("dist/ not found — run `npm run build` first.");
  process.exit(2);
}

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain",
};

// Minimal static server over dist/. Vercel serves real files before rewrites,
// so /e/<slug>/index.html resolves the same way here as in production — and an
// unmatched navigation gets dist/404.html at a real 404, which is what Vercel
// does with a 404.html in the output directory. Modelling that matters: this
// server used to hand back index.html at 200 instead, which is exactly the
// production bug (2026-09-07) it would then have been unable to see.
function serve() {
  return new Promise((ready) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, "http://localhost");
      let path = resolve(DIST, `.${decodeURIComponent(url.pathname)}`);
      if (existsSync(path) && statSync(path).isDirectory()) path = join(path, "index.html");
      if (!existsSync(path)) {
        // SPA fallback for NAVIGATIONS only. Falling back for asset paths too
        // would hand a <script> tag an HTML body — the analytics endpoint
        // (/_vercel/insights/…) doesn't exist outside Vercel, and serving it
        // index.html produced "Unexpected token '<'" page errors that looked
        // like a product bug and were purely this server's fault.
        if (extname(url.pathname)) {
          res.writeHead(404).end();
          return;
        }
        const notFound = resolve(DIST, "404.html");
        res.writeHead(404, { "content-type": "text/html" });
        res.end(readFileSync(notFound));
        return;
      }
      res.writeHead(200, { "content-type": MIME[extname(path)] ?? "application/octet-stream" });
      res.end(readFileSync(path));
    });
    server.listen(0, () => ready({ server, port: server.address().port }));
  });
}

// The hostile environment, installed before any page script runs.
const HOSTILE = `
  const realGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    if (String(type).startsWith('webgl')) return null;   // no GPU in the sandbox
    return realGetContext.call(this, type, ...rest);
  };
  const denied = () => { throw new DOMException('Access is denied.', 'SecurityError'); };
  Object.defineProperty(window, 'localStorage', { get: denied, configurable: true });
  Object.defineProperty(window, 'sessionStorage', { get: denied, configurable: true });
`;

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

const { server, port } = await serve();
const origin = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();

try {
  const context = await browser.newContext();
  await context.addInitScript(HOSTILE);
  const page = await context.newPage();

  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));

  // ---- the home page, in the environment that broke it --------------------
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });

  const mounted = await page.locator(".july-main").count();
  check(mounted > 0, "app did not mount at all (blank page)");

  const crashed = await page.locator(".july-crash").count();
  check(crashed === 0, "the whole-app crash screen appeared — the map took the page down");

  const cards = await page.locator(".july-card").count();
  check(cards > 0, `feed rendered no cards (found ${cards})`);

  // The designed degradation, not merely "it didn't crash".
  const notice = await page.locator(".july-notice--quiet").count();
  check(notice === 1, `expected the map-unavailable notice, found ${notice}`);
  const mapZones = await page.locator(".july-mapzone").count();
  check(mapZones === 0, "map zone still occupies the layout with no map in it");

  // ---- the product is USABLE, not just present ----------------------------
  // Gated on the structural checks: when the page has genuinely collapsed
  // there are no chips to click, and driving them anyway turns a clean finding
  // ("the crash screen appeared") into a 30s Playwright timeout and a stack
  // trace. The failure is the same either way; only the report differs, and
  // the report is the whole product of a verifier.
  if (crashed === 0 && cards > 0) {
    const chips = page.locator(".july-chip");
    check((await chips.count()) > 1, "no filter chips to use");
    const before = await page.locator(".july-card").count();
    await chips.nth(1).click({ timeout: 5000 });
    await page.waitForTimeout(150);
    const after = await page.locator(".july-card").count();
    check(after > 0 && after !== before, `filtering did nothing (${before} → ${after} cards)`);
  } else {
    failures.push("skipped the usability checks — the page never rendered a feed to use");
  }

  // ---- a card page still reads in the same environment --------------------
  const sitemap = readFileSync(resolve(DIST, "sitemap.xml"), "utf8");
  const firstCard = decodeURIComponent(sitemap.match(/<loc>[^<]*\/e\/([^<]+)<\/loc>/)?.[1] ?? "");
  if (firstCard) {
    await page.goto(`${origin}/e/${firstCard}`, { waitUntil: "networkidle" });
    check((await page.locator(".july-crash").count()) === 0, `/e/${firstCard} showed the crash screen`);
    const words = (await page.locator("body").innerText()).split(/\s+/).filter(Boolean).length;
    check(words > 20, `/e/${firstCard} rendered only ${words} words`);
  }

  // ---- a dead /e/ link says it is dead, and still gives the reader a feed ---
  // Both halves at once, because either alone is a regression. A 200 here is
  // the 2026-09-07 bug: expired card URLs served the home page, and Google read
  // 312 identical pages as duplicates and stopped indexing them. An empty page
  // here is the other failure — the reader who followed a stale invite link
  // deserves this week's feed and the notice, not a bare error.
  const dead = await page.goto(`${origin}/e/definitely-not-a-live-card`, { waitUntil: "networkidle" });
  check(dead?.status() === 404, `a dead /e/ link answered ${dead?.status()}, not 404`);
  check((await page.locator(".july-crash").count()) === 0, "the dead-link page showed the crash screen");
  check(
    (await page.locator(".july-notice").count()) > 0,
    "the dead-link page never showed the \u201cthat one\u2019s wrapped\u201d notice",
  );
  const deadCards = await page.locator(".july-card").count();
  check(deadCards > 0, `the dead-link page rendered ${deadCards} cards — the reader gets no feed`);

  // ---- the lens landing pages (2026-09-10) ---------------------------------
  // /kids and /civic exist so a group post can carry its own share preview and
  // its own crawlable prose. Three things have to hold, and each has already
  // failed once in development:
  //   1. the path serves a real file, not the 404 shell;
  //   2. the app boots on it with THAT lens active, not "All";
  //   3. the address bar still says /kids afterwards — the history effect runs
  //      on first render with no card selected, and before the base-path fix it
  //      rewrote the URL to / before the reader had touched anything.
  for (const [path, label] of [["kids", "Family & Kids"], ["civic", "Civic"]]) {
    const res = await page.goto(`${origin}/${path}`, { waitUntil: "networkidle" });
    if (res?.status() === 404) continue; // below the floor this build — nothing to check
    check(res?.status() === 200, `/${path} answered ${res?.status()}`);
    check((await page.locator(".july-crash").count()) === 0, `/${path} showed the crash screen`);

    const active = await page.locator(".july-chip.is-active").first().innerText().catch(() => "");
    check(
      active.includes(label),
      `/${path} booted with "${active.trim() || "nothing"}" active, not ${label}`,
    );

    const here = new URL(page.url()).pathname.replace(/(.)\/$/, "$1");
    check(here === `/${path}`, `/${path} rewrote its own address bar to ${here}`);

    const cards = await page.locator(".july-card").count();
    check(cards > 0, `/${path} rendered no cards`);
  }

  // A page error is not automatically fatal — the map's own failure is logged
  // deliberately — but an UNCAUGHT one means something escaped containment.
  const uncaught = pageErrors.filter((m) => !/WebGL|SecurityError|Access is denied/i.test(m));
  check(uncaught.length === 0, `uncaught page errors: ${uncaught.join(" | ")}`);
} finally {
  await browser.close();
  server.close();
}

if (failures.length > 0) {
  console.error(`\n✖ agent browser (no WebGL, storage blocked): ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error("");
  process.exit(1);
}

console.log(
  "✓ agent browser: feed renders, degrades honestly, stays usable without WebGL or storage, " +
    "a dead /e/ link answers 404 with the week's feed, and /kids and /civic boot on their own lens",
);
