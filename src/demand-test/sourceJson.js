// Track V — turn a JSON API response into the same line-oriented text the rest
// of the ingest snapshots and diffs.
//
// Added 2026-08-05. Several roster sources keep their schedule behind an XHR
// rather than in the rendered HTML, which is why they were on the headless
// Chromium path — the one path the cloud sandbox's proxy cannot tunnel. Reading
// the API directly is both cheaper and more reliable, and usually carries more
// than the page does (the library's Solr index answers with 187 upcoming events
// where the branch page renders a week).
//
// Kept pure and separate from fetch-sources.mjs so it is testable: field
// selection, nested paths and epoch coercion are exactly the kind of thing that
// degrades a snapshot silently rather than loudly.
import { htmlToText } from "./sourceText.js";

export function getPath(obj, path) {
  if (!path) return obj;
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

// Squarespace (and others) return dates as epoch milliseconds. Left raw, a
// snapshot line reads `startDate: 1785940808000` — which no extraction pass can
// turn into a card, and which would fail silently rather than error. Convert
// only when the key is date-shaped AND the number sits in a plausible epoch
// range, so ordinary numbers (prices, counts, ids) are never mangled.
const DATE_KEY_RE = /(^|[._])(date|time|at)s?$|^(start|end)/i;
const EPOCH_SECONDS = [1e9, 1e10]; // ~2001-09-09 .. ~2286, in seconds
const EPOCH_MILLIS = [1e12, 1e13]; // the same window, in milliseconds

export function coerceDate(key, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const leaf = key.split(".").pop();
  if (!DATE_KEY_RE.test(leaf)) return null;
  const ms =
    value >= EPOCH_MILLIS[0] && value < EPOCH_MILLIS[1]
      ? value
      : value >= EPOCH_SECONDS[0] && value < EPOCH_SECONDS[1]
        ? value * 1000
        : null;
  if (ms == null) return null;
  return new Date(ms).toISOString();
}

function renderValue(key, raw) {
  const asDate = coerceDate(key, raw);
  if (asDate) return asDate;
  const text = typeof raw === "object" ? JSON.stringify(raw) : String(raw);
  // API values routinely carry HTML. Flatten to a single line so a block stays
  // one field per line and the line-based diff stays readable.
  return htmlToText(text).replace(/\s+/g, " ").trim();
}

function renderItem(item, fields) {
  if (item == null || typeof item !== "object") return String(item ?? "").trim();
  const keys = fields ?? Object.keys(item);
  const lines = [];
  for (const key of keys) {
    const raw = getPath(item, key);
    if (raw == null || raw === "" || (Array.isArray(raw) && raw.length === 0)) continue;
    const rendered = renderValue(key, raw);
    if (rendered) lines.push(`${key}: ${rendered}`);
  }
  return lines.join("\n");
}

/**
 * @param data  parsed JSON response
 * @param path  dot path to the array of items ("" / omitted = the root array)
 * @param fields  dot paths to emit per item, in order (omitted = every own key)
 *
 * An empty array is NOT an error — a calendar with no events this month is a
 * real state, and throwing would report it as an unreachable source. A path
 * that is not an array IS an error: that means the API's shape moved.
 */
export function jsonToText(data, { path = "", fields = null } = {}) {
  const items = getPath(data, path);
  if (!Array.isArray(items)) {
    const got = items === undefined ? "undefined" : Array.isArray(items) ? "array" : typeof items;
    throw new Error(`json path "${path || "(root)"}" is not an array (got ${got}) — API shape changed?`);
  }
  return items
    .map((item) => renderItem(item, fields))
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Expand the small set of runtime values a roster URL may need. Kept
 * deliberately tiny — these exist because two APIs refuse a static URL:
 * the library's Solr index wants a literal epoch (it rejects `NOW`), and
 * Google Calendar wants an ISO `timeMin`. `month` covers the Squarespace
 * one-month-per-request calendars, whose next-month blind spot near month
 * end used to be a written instruction a run had to remember.
 */
export function expandUrlTemplate(url, now = new Date()) {
  return url.replace(/\{\{(\w+):([+-]?\w+)\}\}/g, (match, kind, arg) => {
    if (kind === "now" && arg === "epoch") return String(Math.floor(now.getTime() / 1000));
    if (kind === "now" && arg === "iso") return now.toISOString().replace(/\.\d{3}Z$/, "Z");
    if (kind === "month") {
      const offset = Number.parseInt(arg, 10);
      if (Number.isNaN(offset)) throw new Error(`bad month offset in ${match}`);
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
      return `${String(d.getUTCMonth() + 1).padStart(2, "0")}-${d.getUTCFullYear()}`;
    }
    throw new Error(`unknown URL template ${match}`);
  });
}
