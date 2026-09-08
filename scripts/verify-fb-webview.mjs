#!/usr/bin/env node
// Facebook in-app browser verifier (2026-09-08).
//
// Nearly every arrival from a Facebook group post opens inside Facebook's own
// browser, not Safari or Chrome. That is the same shape of environment as the
// 2026-08-13 WebGL bug — a context no reviewer's browser can produce, so its
// failures stay unseen until a reader hits them. docs/environmental-dependencies.md
// listed it as a known gap; this closes the half of it that a machine can close.
//
// Serves the BUILT site and drives it with the two engines Facebook actually
// embeds — WebKit inside the iOS app, Chromium inside the Android app — each
// carrying the in-app browser's user agent, a phone viewport, touch input, and
// the fbclid Facebook staples onto every link it hands out.
//
// WHAT THIS CANNOT SEE, and why the doc's gap stays open: this is the engine,
// not the app. It cannot reproduce how Facebook's wrapper handles a link that
// wants a new tab, whether its data store survives between sessions, or how
// much room its own toolbars leave. Those still need a phone.
//
// Usage: npm run build && npm run verify:fb-webview
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, extname } from "node:path";
import { chromium, webkit } from "playwright";

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

// Same static server shape as verify-agent-browser: real files first, a real
// 404 for an unmatched navigation, and a bare 404 for a missing asset rather
// than an HTML body handed to a <script> tag.
function serve() {
  return new Promise((ready) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, "http://localhost");
      let path = resolve(DIST, `.${decodeURIComponent(url.pathname)}`);
      if (existsSync(path) && statSync(path).isDirectory()) path = join(path, "index.html");
      if (!existsSync(path)) {
        if (extname(url.pathname)) { res.writeHead(404).end(); return; }
        res.writeHead(404, { "content-type": "text/html" });
        res.end(readFileSync(resolve(DIST, "404.html")));
        return;
      }
      res.writeHead(200, { "content-type": MIME[extname(path)] ?? "application/octet-stream" });
      res.end(readFileSync(path));
    });
    server.listen(0, () => ready({ server, port: server.address().port }));
  });
}

// User agents as the Facebook apps send them. FBAN/FBIOS marks the iOS app,
// FB_IAB/FB4A the Android one; both are what a reader's visit will look like
// in analytics on a group-post day.
const ENVIRONMENTS = [
  {
    name: "iOS (WebKit, FBAN/FBIOS)",
    engine: webkit,
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBDV/iPhone16,1;FBMD/iPhone;FBSN/iOS;FBSV/18.5;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]",
    viewport: { width: 390, height: 844 },
  },
  {
    name: "Android (Chromium, FB_IAB/FB4A)",
    engine: chromium,
    ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UQ1A.240205.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/470.0.0.34.109;]",
    viewport: { width: 412, height: 915 },
  },
];

// The tag on an arrival from a group post, plus the fbclid Facebook adds. The
// tag has to survive the whole way to the signup form or the signups cannot be
// told apart from any other channel's (fixed 2026-09-08).
const CHANNEL = "parents-verify";
const failures = [];
const skipped = [];

const { server, port } = await serve();
const origin = `http://127.0.0.1:${port}`;
const sitemap = readFileSync(resolve(DIST, "sitemap.xml"), "utf8");
const firstCard = decodeURIComponent(sitemap.match(/<loc>[^<]*\/e\/([^<]+)<\/loc>/)?.[1] ?? "");

try {
  for (const env of ENVIRONMENTS) {
    let browser;
    try {
      browser = await env.engine.launch();
    } catch (e) {
      // A machine that has not downloaded this engine's binary must say so
      // loudly and move on, rather than failing a run for a missing download.
      skipped.push(`${env.name} — engine unavailable (${e.message.split("\n")[0]}). Run: npx playwright install`);
      continue;
    }
    const fail = (ok, msg) => { if (!ok) failures.push(`${env.name}: ${msg}`); };
    try {
      const context = await browser.newContext({
        userAgent: env.ua,
        viewport: env.viewport,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      const pageErrors = [];
      page.on("pageerror", (e) => pageErrors.push(e.message));

      // ---- the home page, arriving from a group post ----------------------
      await page.goto(`${origin}/?src=${CHANNEL}&fbclid=IwAR3xVERIFY`, { waitUntil: "networkidle" });

      fail((await page.locator(".july-main").count()) > 0, "app did not mount (blank page)");
      fail((await page.locator(".july-crash").count()) === 0, "the whole-app crash screen appeared");

      const cards = await page.locator(".july-card").count();
      fail(cards > 0, `feed rendered ${cards} cards`);

      // The map is the dependency that took the whole page down in August.
      // Either it draws, or it leaves the layout and says so — never a hole.
      const canvas = await page.locator(".july-mapzone canvas").count();
      const notice = await page.locator(".july-notice--quiet").count();
      fail(canvas > 0 || notice === 1, "no map and no notice — the reader gets a hole where it was");

      // Return visits are counted from storage, so a store that throws or
      // silently drops writes would under-count the retention gate itself.
      const storage = await page.evaluate(() => {
        try {
          localStorage.setItem("__fbcheck", "1");
          const back = localStorage.getItem("__fbcheck");
          localStorage.removeItem("__fbcheck");
          return back === "1" ? "ok" : "wrote but read back wrong";
        } catch (e) { return `throws ${e.name}`; }
      });
      fail(storage === "ok", `localStorage ${storage} — return visits will not be counted`);

      // Sharing must never dead-end: either the OS sheet or a clipboard copy.
      const canShare = await page.evaluate(() => ({
        share: typeof navigator.share === "function",
        clipboard: !!navigator.clipboard?.writeText,
      }));
      fail(canShare.share || canShare.clipboard, "neither the share sheet nor the clipboard is available");

      // Filtering under a real tap, not a synthetic click.
      const chips = page.locator(".july-chip");
      if ((await chips.count()) > 1 && cards > 0) {
        const before = await page.locator(".july-card").count();
        await chips.nth(1).tap({ timeout: 5000 });
        await page.waitForTimeout(200);
        const after = await page.locator(".july-card").count();
        fail(after > 0 && after !== before, `tapping a filter chip did nothing (${before} to ${after} cards)`);
      } else {
        failures.push(`${env.name}: no filter chips to tap`);
      }

      // ---- the signup ask keeps its channel -------------------------------
      // Both placements: the in-feed row, and the footer that replaces it once
      // the row is dismissed. Untagged in either one and the Facebook signups
      // become indistinguishable from every other channel's.
      const inline = page.locator(".july-fbanner-cta").first();
      if (await inline.count()) {
        const href = await inline.getAttribute("href");
        fail(href?.includes(`src=${CHANNEL}`), `the in-feed signup link dropped the channel tag: ${href}`);
        await page.locator(".july-fbanner-dismiss").first().click();
        await page.waitForTimeout(200);
      }
      const footer = page.locator(".july-cta--primary").first();
      if (await footer.count()) {
        const href = await footer.getAttribute("href");
        fail(href?.includes(`src=${CHANNEL}`), `the feed-end signup link dropped the channel tag: ${href}`);
      } else {
        failures.push(`${env.name}: neither signup ask rendered — nothing to tag`);
      }

      // ---- a shared card link, as Facebook hands it over -------------------
      if (firstCard) {
        await page.goto(`${origin}/e/${firstCard}?src=${CHANNEL}&fbclid=IwAR3xVERIFY`, { waitUntil: "networkidle" });
        await page.waitForTimeout(600);
        fail((await page.locator(".july-crash").count()) === 0, `/e/${firstCard} showed the crash screen`);
        const words = (await page.locator("body").innerText()).split(/\s+/).filter(Boolean).length;
        fail(words > 20, `/e/${firstCard} rendered only ${words} words`);
      }

      // Vercel's analytics script does not exist off Vercel, so its 404 here is
      // this server's, not the product's — page errors are the real signal.
      fail(pageErrors.length === 0, `page errors: ${pageErrors.join(" | ")}`);
    } finally {
      await browser.close();
    }
  }
} finally {
  server.close();
}

for (const s of skipped) console.warn(`⚠ skipped ${s}`);

if (failures.length > 0) {
  console.error(`\n✖ Facebook in-app browser: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error("");
  process.exit(1);
}

if (skipped.length === ENVIRONMENTS.length) {
  console.error("✖ Facebook in-app browser: no engine could be launched — nothing was checked.");
  process.exit(1);
}

console.log(
  "✓ Facebook in-app browser: feed, map, storage, tap filtering and shared card links all hold, " +
    "and the channel tag reaches both signup asks. App-level behaviour still needs a phone.",
);
