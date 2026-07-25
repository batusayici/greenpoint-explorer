#!/usr/bin/env node
// Track V — snapshot every ingest web source and emit a change report, so the
// weekly/daily ingest only spends model attention on sources that actually
// changed. This is the cost-structure fix (2026-07-25): the old agent-driven
// roster sweep re-read ~40 unchanged sites into a growing context every run.
//
// Usage: node scripts/fetch-sources.mjs [--only id,id] [--include-monthly] [--force]
//
// Roster: src/data/demand-test/ingest-sources.json (policy stays in SKILL.md).
// State:  .ingest-cache/ (gitignored) — state.json, <id>.txt snapshots,
//         <id>.diff.txt (lines added since last snapshot), changes.json.
//
// Fetch strategy per source: "auto" = plain HTTP with a browser UA, falling
// back to headless Chromium (playwright, optional dep) on 403/JS-thin pages;
// "browser" = straight to headless. Sources that fail both are reported as
// status "error" — the ingest run covers those few via the Browser pane.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES_PATH = join(ROOT, "src/data/demand-test/ingest-sources.json");
const CACHE_DIR = join(ROOT, ".ingest-cache");
const STATE_PATH = join(CACHE_DIR, "state.json");
const CHANGES_PATH = join(CACHE_DIR, "changes.json");

const args = process.argv.slice(2);
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx !== -1 ? new Set(args[onlyIdx + 1].split(",")) : null;
const INCLUDE_MONTHLY = args.includes("--include-monthly");
const FORCE = args.includes("--force");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const MIN_TEXT_CHARS = 500; // shorter than this after stripping → page is JS-thin, retry in browser
// Bot-wall pages return 200 with polite refusal text (e.g. WORD's IndieCommerce
// 403 cat page) — snapshotting those as content would mask a dead source.
const BLOCK_RE = /403 Forbidden|Access denied|Verify you are human|Just a moment|Attention Required|unable to access this resource|Pardon Our Interruption/i;

mkdirSync(CACHE_DIR, { recursive: true });
const state = existsSync(STATE_PATH) ? JSON.parse(readFileSync(STATE_PATH, "utf8")) : {};
const { sources } = JSON.parse(readFileSync(SOURCES_PATH, "utf8"));

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–", hellip: "…", times: "×", copy: "©", reg: "®", trade: "™", bull: "•", middot: "·" };
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);

function htmlToText(html) {
  return decode(
    html
      .replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/section|\/article|\/header|\/footer)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

// --- optional headless-browser fallback ------------------------------------
let pw = null;
try { pw = await import("playwright"); } catch { /* not installed — plain fetch only */ }
let browser = null;
async function browserText(url) {
  if (!pw) throw new Error("playwright not installed (npm i -D playwright && npx playwright install chromium)");
  if (!browser) browser = await pw.chromium.launch();
  const page = await browser.newPage({ userAgent: UA });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2500); // let JS-rendered calendars settle
    const text = await page.evaluate(() => document.body?.innerText ?? "");
    return text.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
  } finally {
    await page.close();
  }
}

async function plainText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return htmlToText(await res.text());
}

async function fetchSource(src) {
  const attempts = src.fetch === "browser" ? ["browser"] : ["plain", "browser"];
  let lastErr = null;
  for (const method of attempts) {
    try {
      const text = method === "plain" ? await plainText(src.url) : await browserText(src.url);
      if (BLOCK_RE.test(text.slice(0, 800))) {
        lastErr = new Error(`bot-wall page via ${method} fetch`);
        continue;
      }
      if (method === "plain" && text.length < MIN_TEXT_CHARS && attempts.includes("browser")) {
        lastErr = new Error(`only ${text.length} chars via plain fetch (JS-thin?)`);
        continue;
      }
      return { text, method };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
for (const src of sources) {
  if (ONLY && !ONLY.has(src.id)) continue;
  if (!ONLY && src.cadence === "monthly" && !INCLUDE_MONTHLY) {
    results.push({ id: src.id, url: src.url, status: "skipped_monthly" });
    continue;
  }

  const snapPath = join(CACHE_DIR, `${src.id}.txt`);
  const entry = { id: src.id, name: src.name, url: src.url, group: src.group, notes: src.notes || undefined };
  try {
    const { text, method } = await fetchSource(src);
    const h = hash(text);
    const prev = state[src.id];
    entry.method = method;
    entry.textPath = `.ingest-cache/${src.id}.txt`;

    if (prev?.hash === h && !FORCE) {
      entry.status = "unchanged";
    } else {
      const oldText = prev && existsSync(snapPath) ? readFileSync(snapPath, "utf8") : null;
      entry.status = oldText == null ? "new" : "changed";
      if (oldText != null) {
        const oldSet = new Set(oldText.split("\n"));
        const added = text.split("\n").filter((l) => !oldSet.has(l));
        const diffPath = join(CACHE_DIR, `${src.id}.diff.txt`);
        writeFileSync(diffPath, added.join("\n") + "\n");
        entry.diffPath = `.ingest-cache/${src.id}.diff.txt`;
        entry.addedLines = added.length;
      }
      writeFileSync(snapPath, text + "\n");
      state[src.id] = { hash: h, fetchedAt: new Date().toISOString(), method };
    }
    if (entry.status === "unchanged") state[src.id].fetchedAt = new Date().toISOString();
    console.log(`  ${entry.status.padEnd(9)} ${src.id} (${method}${entry.addedLines != null ? `, +${entry.addedLines} lines` : ""})`);
  } catch (e) {
    entry.status = "error";
    entry.error = String(e.message ?? e);
    console.warn(`  ERROR     ${src.id} — ${entry.error}`);
  }
  results.push(entry);
  await sleep(300);
}

if (browser) await browser.close();

writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
writeFileSync(
  CHANGES_PATH,
  JSON.stringify({ generatedAt: new Date().toISOString(), playwright: !!pw, sources: results }, null, 2) + "\n",
);

const by = (s) => results.filter((r) => r.status === s).length;
console.log(
  `\n${results.length} sources → ${by("changed")} changed, ${by("new")} new, ${by("unchanged")} unchanged, ${by("error")} error, ${by("skipped_monthly")} skipped (monthly)`,
);
console.log(`report: ${CHANGES_PATH}`);
if (!pw) console.log("note: playwright not installed — browser-only sources will error (npm i -D playwright && npx playwright install chromium)");
process.exit(0);
