#!/usr/bin/env node
// Renders the GTM cockpit page from docs/launch/gtm-state.json.
// The JSON is the source of truth; this file only formats it.
//   node scripts/build-cockpit.mjs [--out docs/launch/cockpit.html]

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outArg = process.argv.indexOf('--out');
const outPath = resolve(root, outArg > -1 ? process.argv[outArg + 1] : 'docs/launch/cockpit.html');
const s = JSON.parse(readFileSync(resolve(root, 'docs/launch/gtm-state.json'), 'utf8'));

const esc = (v) =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Status → semantic token. Everything that carries state routes through here so
// the page can't drift into ad-hoc colouring.
const TONE = {
  done: 'pass', shipped: 'pass', live: 'now', sending: 'now', next: 'now',
  blocked: 'warn', hold: 'warn', pending: 'warn', open: 'warn',
  later: 'idle', parked: 'idle', deferred: 'idle', queued: 'idle',
  'not-started': 'idle', 'not yet read': 'idle', scheduled: 'idle',
  watching: 'idle', standing: 'idle', candidate: 'idle', analysis: 'idle',
};
const tone = (v) => TONE[String(v ?? '').toLowerCase()] ?? 'idle';

// ---- Today (written by cockpit-daily.mjs) --------------------------------

const d = s.daily;
const chip = (txt, t) => `<span class="chip chip--${t}">${esc(txt)}</span>`;
const today = d ? `
  <section class="today">
    <div class="today__head">
      <h2>${esc(d.dayName)}</h2>
      <div class="today__chips">
        ${d.feed?.dated != null ? chip(`feed ${d.feed.dated} dated`, d.feed.fresh ? 'ok' : 'warn') : ''}
        ${d.feed?.stale ? chip('ingest stale', 'warn') : ''}
        ${d.waiting?.length ? chip(`${d.waiting.length} waiting`, 'warn') : ''}
        ${d.unanswered?.length ? chip(`${d.unanswered.length} awaiting reply`, 'idle') : ''}
      </div>
    </div>
    ${d.overdue?.length ? `<ul class="today__list today__list--over">${d.overdue.map((o) => `<li><span class="mono">${esc(o.since)}</span> ${esc(o.label)}</li>`).join('')}</ul>` : ''}
    ${d.dueToday?.length ? `<ul class="today__list">${d.dueToday.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
      : (!d.overdue?.length ? `<p class="today__clear">Nothing dated for today.</p>` : '')}
    ${d.waiting?.length ? `<p class="today__meta">${d.waiting.map((w) => esc(w.what) + (w.age ? ` <span class="mono">${w.age}d</span>` : '')).join(' &nbsp;·&nbsp; ')}</p>` : ''}
  </section>` : '';

// ---- Focus (the one goal) ----------------------------------------------

// Today's items are owned by the strip above; the focus card carries the arc
// after today, so a step is never printed twice on one page.
const ahead = (s.focus?.steps ?? []).filter((st) => !d || !st.date || st.date > d.ranAt);

const focus = s.focus ? `
  <section class="focus">
    <p class="focus__kicker">Right now</p>
    <h2 class="focus__goal">${esc(s.focus.goal)}</h2>
    <p class="focus__why">${esc(s.focus.why)}</p>
    <ol class="steps">
      ${ahead.map((st) => `
      <li class="step step--${tone(st.status)}">
        <span class="step__when mono">${esc(st.when)}</span>
        <span class="step__label">${esc(st.label)}</span>
      </li>`).join('')}
    </ol>
    <p class="focus__done"><span class="lbl">Done when</span> ${esc(s.focus.doneWhen)}</p>
  </section>` : '';

// ---- Needs attention ----------------------------------------------------

const attention = s.openDecisions.map((d) => `
  <li class="att">
    <details>
      <summary><b>${esc(d.title)}</b><span class="att__by mono">${esc(d.needBy)}</span></summary>
      <p>${esc(d.why)}</p>
      ${d.options ? `<ul class="opts">${d.options.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
    </details>
  </li>`).join('');

// ---- Coming up ----------------------------------------------------------

const upcoming = s.phases.filter((p) => ['next', 'later'].includes(p.status)).map((p) => `
  <li class="up up--${tone(p.status)}">
    <span class="up__when mono">${esc(p.window)}</span>
    <div>
      <b>${esc(p.title)}</b>
      <span class="up__line">${esc(p.oneLine)}</span>
    </div>
  </li>`).join('');

// ---- The full picture (collapsed) ---------------------------------------

const experiments = s.experiments.map((e) => `
  <tr class="xr xr--${tone(e.status)}">
    <td class="mono xr__id">${esc(e.id)}</td>
    <td>
      <b>${esc(e.name)}</b>
      <span class="xr__hyp">${esc(e.hypothesis)}</span>
      ${e.rule ? `<span class="xr__rule">${esc(e.rule)}</span>` : ''}
    </td>
    <td class="mono num">${esc(e.actual ?? '—')}</td>
    <td><span class="pill pill--${tone(e.verdict)}">${esc(e.verdict)}</span></td>
    <td class="xr__imp">${esc(e.implication ?? '')}</td>
  </tr>`).join('');

const gates = s.gates.map((g) => `
  <article class="gate">
    <header>
      <h4>${esc(g.name)}</h4>
      <span class="pill pill--${tone(g.status)}">${esc(g.status)}</span>
    </header>
    <p class="gate__bar">${esc(g.bar)}</p>
    <p class="gate__act mono">${esc(g.actual)}</p>
    <p class="gate__unl"><span class="lbl">Unlocks</span> ${esc(g.unlocks)}</p>
  </article>`).join('');

const ARROW = { up: '↗', down: '↘', flat: '→' };
const metrics = s.metrics.map((m) => `
  <article class="tile">
    <span class="tile__lbl">${esc(m.label)}</span>
    <span class="tile__val mono">${esc(m.value)}</span>
    <span class="tile__meta mono">${esc(ARROW[m.trend] || '')} was ${esc(m.prior)}${m.target ? ` · target ${esc(m.target)}` : ''}</span>
    ${m.caveat ? `<span class="tile__cav">${esc(m.caveat)}</span>` : ''}
  </article>`).join('');

// Citation-check freshness is computed, not stored: the check is monthly, manual
// and unscheduled, so a hand-maintained tile would go stale in exactly the weeks
// it matters. Reading the filenames means the cockpit notices the lapse itself.
const CITATION_DUE_DAYS = 31;
const citationTile = (() => {
  let last = null;
  try {
    last = readdirSync(resolve(root, 'docs/aeo'))
      .map((f) => /^(\d{4}-\d{2}-\d{2})-citation-check\.md$/.exec(f)?.[1])
      .filter(Boolean)
      .sort()
      .pop() ?? null;
  } catch { /* no docs/aeo yet — fall through to "never run" */ }
  const days = last
    ? Math.round((Date.now() - Date.parse(last + 'T00:00:00Z')) / 86400000)
    : null;
  const overdue = days === null || days > CITATION_DUE_DAYS;
  return `
  <article class="tile">
    <span class="tile__lbl">Answer-engine citation check</span>
    <span class="tile__val mono">${last ? `${esc(last)} · ${days}d ago` : 'never run'}</span>
    <span class="tile__meta mono">monthly · manual · ~15 min</span>
    <span class="tile__cav">${overdue
      ? 'Due now. Five fixed questions on ChatGPT, Perplexity and Google AI — method and template in docs/aeo/citation-check.md. Nothing else tracks this.'
      : `Next due about ${esc(CITATION_DUE_DAYS - days)} days from now. docs/aeo/citation-check.md.`}</span>
  </article>`;
})();

const channels = s.channels.map((c) => `
  <tr>
    <td class="mono">${esc(c.src)}</td>
    <td>${esc(c.label)}</td>
    <td class="mono">${esc(c.sent ?? '—')}</td>
    <td class="mono">${esc(c.firstSession ?? '—')}</td>
    <td>${esc(c.status)}</td>
  </tr>`).join('');

const risks = s.risks.map((r) => `
  <li><b>${esc(r.title)}.</b> ${esc(r.detail)} <i>${esc(r.response)}</i></li>`).join('');

const rules = s.rules.map((r) => `<li>${esc(r.text)}</li>`).join('');

const donePhases = s.phases.filter((p) => p.status === 'done').map((p) =>
  `<li><span class="mono">${esc(p.window)}</span> <b>${esc(p.title)}</b> — ${esc(p.oneLine)}</li>`).join('');

const fold = (title, body) => `
  <details class="fold">
    <summary>${esc(title)}</summary>
    <div class="fold__body">${body}</div>
  </details>`;

const html = `<title>Stoopwise Launch Cockpit</title>
<style>
:root{
  --paper:#f6efdd; --card:#fff8ea; --ink:#2a241c; --mute:#877d69; --rule:#d9cfb6;
  --pass:#4f7d52; --now:#a05f10; --warn:#a04432; --idle:#52647a;
  --nowbg:#cc9a3b1c; --warnbg:#a0443212; --passbg:#4f7d5215; --idlebg:#52647a10;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
*{box-sizing:border-box}
body{background:var(--paper);color:var(--ink);font:16px/1.55 var(--sans);margin:0;padding:0 20px 80px;-webkit-font-smoothing:antialiased}
.wrap{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:44px}
.mono{font-family:var(--mono);font-variant-numeric:tabular-nums;font-size:.87em}
.lbl{font:600 10px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-right:.55em}
h1,h2,h3,h4{margin:0;text-wrap:balance}
p{margin:0}
b{font-weight:650}
:focus-visible{outline:2px solid var(--now);outline-offset:2px}

/* masthead — small; the focus block is the hero */
.mast{padding-top:40px;display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
.mast h1{font-size:15px;font-weight:700;letter-spacing:.01em}
.mast span{font-family:var(--mono);font-size:11.5px;color:var(--mute)}

/* focus */
.focus{background:var(--card);border:1px solid var(--rule);border-radius:4px;padding:28px 28px 24px;display:flex;flex-direction:column;gap:14px;box-shadow:0 1px 0 var(--rule)}
.focus__kicker{font:700 11px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--now)}
.focus__goal{font-size:clamp(26px,4.5vw,34px);font-weight:680;letter-spacing:-.018em;line-height:1.1}
.focus__why{color:var(--mute);max-width:58ch}
.steps{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column}
.step{display:flex;gap:16px;align-items:baseline;padding:10px 0;border-top:1px solid var(--rule)}
.step__when{flex:0 0 138px;color:var(--mute);font-weight:600}
.step__label{font-weight:600}
.step--now .step__when{color:var(--now)}
.step--idle .step__label{font-weight:400;color:var(--mute)}
.focus__done{font-size:13.5px;color:var(--mute);border-top:1px solid var(--rule);padding-top:12px}

/* today strip */
.today{border-bottom:1px solid var(--rule);padding-bottom:20px;display:flex;flex-direction:column;gap:12px}
.today__head{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
.today__head h2{font-size:22px;font-weight:680;letter-spacing:-.015em}
.today__chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{font:600 10.5px/1.8 var(--mono);letter-spacing:.04em;padding:0 8px;border-radius:10px;white-space:nowrap;color:var(--t);background:var(--b)}
.chip--ok{--t:var(--pass);--b:var(--passbg)} .chip--warn{--t:var(--warn);--b:var(--warnbg)} .chip--idle{--t:var(--idle);--b:var(--idlebg)}
.today__list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px}
.today__list li{font-size:15px;font-weight:600;padding-left:17px;position:relative;line-height:1.4}
.today__list li::before{content:"";position:absolute;left:0;top:.55em;width:7px;height:7px;border-radius:50%;background:var(--now)}
.today__list--over li{color:var(--warn)}
.today__list--over li::before{background:var(--warn)}
.today__list--over li .mono{font-weight:600;opacity:.75}
.today__clear{font-size:14px;color:var(--mute)}
.today__meta{font-size:12.5px;color:var(--mute)}

/* sections */
h2.sec{font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:var(--mute);font-weight:700}
section{display:flex;flex-direction:column;gap:14px}

/* needs attention */
.atts{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.att details{background:var(--card);border:1px solid var(--rule);border-left:3px solid var(--warn);border-radius:3px;padding:11px 15px}
.att summary{cursor:pointer;display:flex;align-items:baseline;gap:12px;list-style:none}
.att summary::-webkit-details-marker{display:none}
.att summary b{flex:1;font-size:15px}
.att__by{color:var(--mute);font-size:11px;white-space:nowrap}
.att details[open] summary{margin-bottom:8px}
.att p{font-size:14px;color:var(--mute);max-width:62ch}
.opts{margin:6px 0 0;padding-left:18px;font-size:13.5px;color:var(--mute)}

/* coming up */
.ups{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.up{display:flex;gap:16px;padding:11px 2px;border-top:1px solid var(--rule);align-items:baseline}
.up:last-child{border-bottom:1px solid var(--rule)}
.up__when{flex:0 0 138px;color:var(--mute);font-weight:600}
.up--now .up__when{color:var(--now)}
.up div{display:flex;flex-direction:column;gap:1px}
.up__line{font-size:13.5px;color:var(--mute)}

/* folds — the full picture */
.folds{display:flex;flex-direction:column;gap:8px}
.fold{background:var(--card);border:1px solid var(--rule);border-radius:3px}
.fold>summary{cursor:pointer;padding:12px 16px;font:600 12px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase;color:var(--mute);list-style:none}
.fold>summary::-webkit-details-marker{display:none}
.fold>summary::before{content:"+ "}
.fold[open]>summary::before{content:"− "}
.fold[open]>summary{color:var(--ink)}
.fold__body{padding:4px 16px 18px;overflow-x:auto}

/* pills + tables inside folds */
.pill{display:inline-block;font:600 10px/1.7 var(--mono);letter-spacing:.06em;text-transform:uppercase;padding:0 6px;border-radius:2px;white-space:nowrap;color:var(--t);background:var(--b)}
.pill--pass{--t:var(--pass);--b:var(--passbg)} .pill--now{--t:var(--now);--b:var(--nowbg)}
.pill--warn{--t:var(--warn);--b:var(--warnbg)} .pill--idle{--t:var(--idle);--b:var(--idlebg)}
table{border-collapse:collapse;width:100%;min-width:640px;font-size:13.5px}
th{text-align:left;font:700 10px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mute);padding:9px 10px;border-bottom:1px solid var(--rule);white-space:nowrap}
td{padding:10px;border-bottom:1px solid var(--rule);vertical-align:top}
tr:last-child td{border-bottom:0}
.num{max-width:18ch}
.xr__id{font-weight:700;color:var(--mute)}
.xr td:nth-child(2){min-width:230px}
.xr__hyp,.xr__rule{display:block;color:var(--mute);font-size:12.5px;margin-top:3px;max-width:48ch}
.xr__rule{font-family:var(--mono);font-size:11.5px}
.xr__imp{color:var(--mute);font-size:12.5px;max-width:30ch}

.gate{padding:12px 0;border-bottom:1px solid var(--rule);display:flex;flex-direction:column;gap:5px}
.gate:last-child{border-bottom:0}
.gate header{display:flex;align-items:center;gap:10px}
.gate h4{font-size:15px}
.gate p{font-size:13.5px;color:var(--mute);max-width:66ch}
.gate__act{color:var(--ink)}

.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;padding-top:8px}
.tile{border:1px solid var(--rule);border-radius:3px;padding:11px 12px;display:flex;flex-direction:column;gap:2px}
.tile__lbl{font:600 9.5px/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.tile__val{font-size:17px;font-weight:600}
.tile__meta{font-size:11px;color:var(--mute)}
.tile__cav{font-size:11px;line-height:1.4;color:var(--mute);border-top:1px solid var(--rule);margin-top:5px;padding-top:5px}

.plain{margin:0;padding-left:18px;font-size:13.5px;color:var(--mute);display:flex;flex-direction:column;gap:7px}
.plain b{color:var(--ink)}
.plain i{font-style:normal;color:var(--ink)}
.plain .mono{color:var(--mute)}

footer{font:11.5px/1.6 var(--mono);color:var(--mute);border-top:1px solid var(--rule);padding-top:14px}
@media (max-width:560px){
  body{padding:0 14px 64px}
  .focus{padding:20px 18px 16px}
  .step__when,.up__when{flex-basis:96px}
}
</style>

<div class="wrap">
  <header class="mast">
    <h1>Stoopwise launch</h1>
    <span>as of ${esc(s.meta.asOf)}</span>
    <span>analytics ${esc(s.meta.lastDataPull)} · feed ${esc(s.meta.lastFeedCheck || s.meta.lastDataPull)}</span>
  </header>

  ${today}

  ${focus}

  <section>
    <h2 class="sec">Waiting on you</h2>
    <ul class="atts">${attention}</ul>
  </section>

  <section>
    <h2 class="sec">Coming up</h2>
    <ol class="ups">${upcoming}</ol>
  </section>

  <section>
    <h2 class="sec">The full picture</h2>
    <div class="folds">
      ${fold('Experiments — rules and reads', `<table>
        <thead><tr><th></th><th>Experiment</th><th>Actual</th><th>Verdict</th><th>Means</th></tr></thead>
        <tbody>${experiments}</tbody></table>`)}
      ${fold('The four gates', gates)}
      ${fold('Metrics', `<div class="tiles">${metrics}${citationTile}</div>`)}
      ${fold('Send log', `<table>
        <thead><tr><th>src</th><th>Channel</th><th>Sent</th><th>First session</th><th>Status</th></tr></thead>
        <tbody>${channels}</tbody></table>`)}
      ${fold('Known risks', `<ul class="plain">${risks}</ul>`)}
      ${fold('Rules of play', `<ul class="plain">${rules}</ul>`)}
      ${fold('Done so far', `<ul class="plain">${donePhases}</ul>`)}
    </div>
  </section>

  <footer>
    Generated from docs/launch/gtm-state.json · updated by the Tuesday growth routine · every entry cites its source doc
  </footer>
</div>
`;

writeFileSync(outPath, html);
console.log(`[cockpit] ${outPath} — ${(html.length / 1024).toFixed(1)}kb`);
