#!/usr/bin/env node
// Morning refresh for the GTM cockpit. Mechanical only — dates, feed numbers,
// and what is waiting. It never writes a verdict, never touches an experiment
// read, and never rewrites the state file: it merges named fields into it.
//
//   node scripts/cockpit-daily.mjs        # refresh + regenerate the page
//   node scripts/cockpit-daily.mjs --dry  # print what it would write

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const statePath = resolve(root, 'docs/launch/gtm-state.json');
const dry = process.argv.includes('--dry');

const sh = (cmd, args) => {
  try { return execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return null; }
};

// Local calendar day — never UTC. The feed is a New York product and an
// overnight run must not roll the date forward an extra day.
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const dayName = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric' });

// ---- feed, from the instrument of record ----------------------------------
const freshness = sh('node', ['scripts/check-freshness.mjs']) ?? '';
const num = (k) => { const m = freshness.match(new RegExp(`${k}=(\\d+)`)); return m ? Number(m[1]) : null; };
const feed = {
  dated: num('datedUpcoming7d'),
  reservoir: num('reservoir7-14d'),
  stale: /staleIngest=true/.test(freshness),
  thin: /thinFeed=true/.test(freshness),
  fresh: /→ FRESH/.test(freshness),
};
let cards = null;
try {
  const raw = JSON.parse(readFileSync(resolve(root, 'src/data/demand-test/cards.json'), 'utf8'));
  cards = (Array.isArray(raw) ? raw : raw.cards ?? []).length;
} catch { /* LFS pointer or unreadable — leave null rather than guess */ }
feed.cards = cards;

// ---- what is waiting -------------------------------------------------------
const prs = (sh('gh', ['pr', 'list', '--state', 'open', '--json', 'number,title,createdAt', '--limit', '20']) ?? '[]');
let open = [];
try { open = JSON.parse(prs); } catch { open = []; }
const ageDays = (iso) => Math.floor((Date.now() - Date.parse(iso)) / 86400000);
const waiting = open.map((p) => ({
  what: `PR #${p.number} — ${p.title}`,
  age: ageDays(p.createdAt),
}));

const unpushed = (sh('git', ['log', '--oneline', 'origin/main..main']) ?? '').split('\n').filter(Boolean).length;
if (unpushed) waiting.push({ what: `${unpushed} commit${unpushed > 1 ? 's' : ''} on main not pushed`, age: 0 });

// ---- what landed overnight -------------------------------------------------
const since = sh('git', ['log', '--since', '24 hours ago', '--pretty=%s', 'origin/main']) ?? '';
const overnight = since.split('\n').filter(Boolean).slice(0, 6);

// ---- roll the calendar -----------------------------------------------------
const state = JSON.parse(readFileSync(statePath, 'utf8'));
const steps = state.focus?.steps ?? [];
const dueToday = [], overdue = [];
for (const st of steps) {
  if (!st.date || st.status === 'done') continue;
  if (st.date === today) dueToday.push(st.label);
  else if (st.date < today) overdue.push({ label: st.label, since: st.date });
}

// Unsent channels whose own note says they were due before today.
const unanswered = (state.channels ?? [])
  .filter((c) => c.sent && c.sent !== 'always on' && !c.reply && /no reply/i.test(c.status ?? ''))
  .map((c) => c.src);

const daily = { ranAt: today, dayName, dueToday, overdue, waiting, overnight, unanswered, feed };

if (dry) { console.log(JSON.stringify(daily, null, 2)); process.exit(0); }

// Merge — assign one key. Everything else in the file is left exactly as it was.
state.daily = daily;
state.meta.asOf = today;
state.meta.lastFeedCheck = today;
writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');

execFileSync('node', ['scripts/build-cockpit.mjs'], { cwd: root, stdio: 'inherit' });
console.log(`[daily] ${dayName} — ${dueToday.length} due, ${overdue.length} overdue, ${waiting.length} waiting, feed ${feed.dated ?? '?'} dated`);
