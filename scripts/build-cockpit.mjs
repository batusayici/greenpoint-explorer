#!/usr/bin/env node
// Renders the GTM cockpit page from docs/launch/gtm-state.json.
// The JSON is the source of truth; this file only formats it.
//   node scripts/build-cockpit.mjs [--out docs/launch/cockpit.html]

import { readFileSync, writeFileSync } from 'node:fs';
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

const why = (label, text) =>
  text ? `<details class="why"><summary>${esc(label)}</summary><p>${esc(text)}</p></details>` : '';

const track = s.phases.map((p) => `
  <li class="phase phase--${tone(p.status)}${p.status === 'live' ? ' phase--here' : ''}">
    <span class="phase__win">${esc(p.window)}</span>
    <span class="phase__title">${esc(p.title)}</span>
    <span class="phase__line">${esc(p.oneLine)}</span>
  </li>`).join('');

const thisWeek = s.milestones
  .filter((m) => ['next', 'blocked'].includes(m.status) || (m.status === 'done' && m.phase === 'wave1'))
  .map((m) => `
  <article class="row row--${tone(m.status)}">
    <div class="row__head">
      <span class="pill pill--${tone(m.status)}">${esc(m.status)}</span>
      <time class="mono">${esc(m.dateLabel || m.date)}</time>
      <h3>${esc(m.title)}</h3>
    </div>
    <p class="row__goal">${esc(m.goal)}</p>
    ${why('Why this way', m.why)}
    ${m.outcome ? `<p class="row__out"><span class="lbl">Outcome</span> ${esc(m.outcome)}</p>` : ''}
    ${m.blockedOn ? `<p class="row__out"><span class="lbl">Blocked on</span> ${esc(m.blockedOn)}</p>` : ''}
    ${m.branch ? `<p class="row__out"><span class="lbl">If it's silent</span> ${esc(m.branch)}</p>` : ''}
    ${m.items ? `<ul class="checks">${m.items.map((i) => `<li class="check check--${tone(i.status)}"><span class="check__mk">${i.status === 'done' ? '✓' : '○'}</span><div><b>${esc(i.label)}</b><span>${esc(i.detail)}</span></div></li>`).join('')}</ul>` : ''}
    ${m.checks ? `<ul class="notes">${m.checks.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
  </article>`).join('');

const slots = s.experiments.filter((e) => e.slot && ['sending', 'scheduled'].includes(e.status)).length;

const experiments = s.experiments.map((e) => `
  <tr class="xr xr--${tone(e.status)}">
    <td class="mono xr__id">${esc(e.id)}</td>
    <td>
      <b>${esc(e.name)}</b>
      <span class="xr__hyp">${esc(e.hypothesis)}</span>
      ${why('Rule, test and detail', [e.smallestTest && `Smallest test: ${e.smallestTest}`, e.rule && `Decision rule: ${e.rule}`, e.trigger && `Trigger: ${e.trigger}`, e.caveat && `Caveat: ${e.caveat}`, e.notes].filter(Boolean).join('  ·  '))}
    </td>
    <td class="mono num">${esc(e.target ?? '—')}</td>
    <td class="mono num">${esc(e.actual ?? '—')}</td>
    <td><span class="pill pill--${tone(e.verdict)}">${esc(e.verdict)}</span></td>
    <td class="xr__imp">${esc(e.implication ?? '')}</td>
  </tr>`).join('');

const gates = s.gates.map((g) => `
  <article class="gate gate--${tone(g.status)}">
    <header>
      <span class="gate__n mono">${g.order}</span>
      <h3>${esc(g.name)}</h3>
      <span class="pill pill--${tone(g.status)}">${esc(g.status)}</span>
    </header>
    <p class="gate__bar"><span class="lbl">Bar</span> ${esc(g.bar)}</p>
    <p class="gate__act"><span class="lbl">Now</span> <span class="mono">${esc(g.actual)}</span></p>
    <p class="gate__unl"><span class="lbl">Unlocks</span> ${esc(g.unlocks)}</p>
    ${why('Why the bar is there', [g.why, g.notes, g.readsOn && `Reads: ${g.readsOn}`, g.killDate && `Kill date: ${g.killDate}`].filter(Boolean).join('  ·  '))}
    ${g.labels ? `<ul class="flags">${g.labels.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
  </article>`).join('');

const ARROW = { up: '↗', down: '↘', flat: '→' };
const metrics = s.metrics.map((m) => `
  <article class="tile">
    <span class="tile__lbl">${esc(m.label)}</span>
    <span class="tile__val mono">${esc(m.value)}</span>
    <span class="tile__meta mono">${esc(ARROW[m.trend] || '')} was ${esc(m.prior)}${m.target ? ` · target ${esc(m.target)}` : ''}</span>
    <span class="tile__role">${esc(m.role)}</span>
    ${m.caveat ? `<span class="tile__cav">${esc(m.caveat)}</span>` : ''}
  </article>`).join('');

const channels = s.channels.map((c) => `
  <tr>
    <td class="mono">${esc(c.src)}</td>
    <td>${esc(c.label)}</td>
    <td class="mono">${esc(c.wave)}</td>
    <td class="mono">${esc(c.sent ?? '—')}</td>
    <td class="mono">${esc(c.firstSession ?? '—')}</td>
    <td>${esc(c.status)}</td>
  </tr>`).join('');

const decisions = s.openDecisions.map((d) => `
  <article class="dec">
    <h3>${esc(d.title)}</h3>
    <p class="dec__why">${esc(d.why)}</p>
    ${d.options ? `<ul class="opts">${d.options.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
    <p class="dec__meta mono">${esc(d.owner)} · ${esc(d.needBy)}</p>
  </article>`).join('');

const risks = s.risks.map((r) => `
  <article class="risk">
    <h3>${esc(r.title)} <span class="pill pill--warn">${esc(r.severity)}</span></h3>
    <p>${esc(r.detail)}</p>
    <p class="risk__resp"><span class="lbl">Response</span> ${esc(r.response)}</p>
  </article>`).join('');

const rules = s.rules.map((r) => `<li>${esc(r.text)}</li>`).join('');

const html = `<title>Stoopwise Launch Cockpit</title>
<style>
:root{
  --paper:#ece3cf; --card:#fff8ea; --ink:#2a241c; --mute:#877d69; --rule:#cabfa7;
  --pass:#4f7d52; --now:#cc9a3b; --warn:#a04432; --idle:#52647a;
  --passbg:#4f7d5218; --nowbg:#cc9a3b20; --warnbg:#a0443216; --idlebg:#52647a14;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#1b1712; --card:#251f18; --ink:#ece3cf; --mute:#9b9079; --rule:#3d342a;
  --pass:#7ba87e; --now:#d8ac57; --warn:#c9705c; --idle:#7d92ab;
  --passbg:#7ba87e1a; --nowbg:#d8ac571f; --warnbg:#c9705c1a; --idlebg:#7d92ab16;
}}
:root[data-theme="dark"]{
  --paper:#1b1712; --card:#251f18; --ink:#ece3cf; --mute:#9b9079; --rule:#3d342a;
  --pass:#7ba87e; --now:#d8ac57; --warn:#c9705c; --idle:#7d92ab;
  --passbg:#7ba87e1a; --nowbg:#d8ac571f; --warnbg:#c9705c1a; --idlebg:#7d92ab16;
}
*{box-sizing:border-box}
body{background:var(--paper);color:var(--ink);font:16px/1.55 var(--sans);margin:0;padding:0 20px 96px;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;display:flex;flex-direction:column;gap:56px}
.mono{font-family:var(--mono);font-variant-numeric:tabular-nums;font-size:.86em}
.lbl{font:600 10px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-right:.6em}
h1,h2,h3{text-wrap:balance;margin:0}
h2{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);font-weight:700;padding-bottom:10px;border-bottom:1px solid var(--rule)}
h3{font-size:16px;font-weight:650}
p{margin:0}
section{display:flex;flex-direction:column;gap:18px}

/* masthead */
.mast{padding:44px 0 0;display:flex;flex-direction:column;gap:8px}
.mast h1{font-size:clamp(30px,5vw,46px);font-weight:680;letter-spacing:-.022em;line-height:1.05}
.mast__sub{color:var(--mute);max-width:62ch}
.mast__meta{font-family:var(--mono);font-size:12px;color:var(--mute);display:flex;flex-wrap:wrap;gap:16px;margin-top:10px}

/* phase track */
.track{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:3px}
.phase{background:var(--card);padding:12px 13px 14px;display:flex;flex-direction:column;gap:5px;border:1px solid var(--rule);border-top:3px solid var(--c);border-radius:3px}
.phase--pass{--c:var(--pass)} .phase--now{--c:var(--now)} .phase--warn{--c:var(--warn)} .phase--idle{--c:var(--rule)}
.phase--here{background:var(--nowbg)}
.phase__win{font:600 10px/1 var(--mono);letter-spacing:.06em;color:var(--mute)}
.phase__title{font-weight:650;font-size:14px;line-height:1.25}
.phase__line{font-size:12px;line-height:1.4;color:var(--mute)}
.phase--here .phase__title::after{content:" \\2190 here";color:var(--now);font-weight:600;font-size:11px;letter-spacing:.04em}

/* pills + shared */
.pill{display:inline-block;font:600 10px/1.7 var(--mono);letter-spacing:.07em;text-transform:uppercase;padding:0 7px;border-radius:2px;white-space:nowrap;color:var(--t);background:var(--b);border:1px solid var(--t)}
.pill--pass{--t:var(--pass);--b:var(--passbg)} .pill--now{--t:var(--now);--b:var(--nowbg)}
.pill--warn{--t:var(--warn);--b:var(--warnbg)} .pill--idle{--t:var(--idle);--b:var(--idlebg)}
.why{margin-top:2px}
.why summary{font:600 11px/1.6 var(--mono);letter-spacing:.05em;color:var(--idle);cursor:pointer;width:fit-content}
.why summary:hover{color:var(--ink)}
.why p{font-size:14px;color:var(--mute);margin-top:6px;padding-left:12px;border-left:2px solid var(--rule);max-width:74ch}
:focus-visible{outline:2px solid var(--now);outline-offset:2px}

/* this week */
.row{background:var(--card);border:1px solid var(--rule);border-left:3px solid var(--c);border-radius:3px;padding:16px 18px;display:flex;flex-direction:column;gap:9px}
.row--pass{--c:var(--pass)} .row--now{--c:var(--now)} .row--warn{--c:var(--warn)} .row--idle{--c:var(--idle)}
.row__head{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.row__head time{color:var(--mute)}
.row__head h3{flex:1 1 100%}
.row__goal{max-width:76ch}
.row__out{font-size:14px;color:var(--mute);max-width:76ch}
.checks{list-style:none;margin:4px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}
.check{display:flex;gap:9px;font-size:13.5px;line-height:1.45}
.check__mk{font-family:var(--mono);color:var(--c2)}
.check--pass{--c2:var(--pass)} .check--warn{--c2:var(--warn)} .check--idle{--c2:var(--idle)}
.check div{display:flex;flex-direction:column}
.check span{color:var(--mute)}
.notes{margin:0;padding-left:18px;font-size:13px;color:var(--mute)}

/* tables */
.scroll{overflow-x:auto;border:1px solid var(--rule);border-radius:3px;background:var(--card)}
table{border-collapse:collapse;width:100%;min-width:760px;font-size:14px}
th{text-align:left;font:700 10px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mute);padding:11px 12px;border-bottom:1px solid var(--rule);white-space:nowrap}
td{padding:12px;border-bottom:1px solid var(--rule);vertical-align:top}
tr:last-child td{border-bottom:0}
.num{white-space:normal;max-width:20ch}
.xr{border-left:3px solid var(--c)}
.xr--pass{--c:var(--pass)} .xr--now{--c:var(--now)} .xr--warn{--c:var(--warn)} .xr--idle{--c:transparent}
.xr__id{font-weight:700;color:var(--mute)}
.xr td:nth-child(2){min-width:250px}
.xr__hyp{display:block;color:var(--mute);font-size:13px;margin-top:3px;max-width:52ch}
.xr__imp{color:var(--mute);font-size:13px;max-width:36ch}
.slotbar{font:600 11px/1 var(--mono);letter-spacing:.06em;color:var(--mute)}

/* gates */
.gates{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
.gate{background:var(--card);border:1px solid var(--rule);border-top:3px solid var(--c);border-radius:3px;padding:15px 17px;display:flex;flex-direction:column;gap:8px}
.gate--pass{--c:var(--pass)} .gate--warn{--c:var(--now)} .gate--idle{--c:var(--idle)}
.gate header{display:flex;align-items:center;gap:9px}
.gate__n{color:var(--mute);font-weight:700}
.gate header h3{flex:1}
.gate p{font-size:14px}
.gate__act{font-size:15px}
.gate__unl,.gate__bar{color:var(--mute)}
.flags{list-style:none;margin:2px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}
.flags li{font:11.5px/1.4 var(--mono);color:var(--warn);padding-left:13px;position:relative}
.flags li::before{content:"\\26A0";position:absolute;left:0}

/* metric tiles */
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(212px,1fr));gap:12px}
.tile{background:var(--card);border:1px solid var(--rule);border-radius:3px;padding:13px 14px;display:flex;flex-direction:column;gap:3px}
.tile__lbl{font:600 10px/1.4 var(--mono);letter-spacing:.09em;text-transform:uppercase;color:var(--mute)}
.tile__val{font-size:19px;font-weight:600;line-height:1.2;margin:1px 0}
.tile__meta{font-size:11.5px;color:var(--mute)}
.tile__role{font-size:12px;color:var(--idle);margin-top:3px}
.tile__cav{font-size:11.5px;line-height:1.4;color:var(--mute);border-top:1px solid var(--rule);margin-top:6px;padding-top:6px}

/* decisions + risks */
.decs{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
.dec{background:var(--card);border:1px solid var(--rule);border-left:3px solid var(--now);border-radius:3px;padding:14px 16px;display:flex;flex-direction:column;gap:7px}
.dec__why{font-size:14px;color:var(--mute)}
.opts{margin:0;padding-left:18px;font-size:13.5px;display:flex;flex-direction:column;gap:3px}
.dec__meta{font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.07em}
.risk{background:var(--card);border:1px solid var(--rule);border-left:3px solid var(--warn);border-radius:3px;padding:14px 16px;display:flex;flex-direction:column;gap:7px}
.risk h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.risk p{font-size:14px;color:var(--mute);max-width:82ch}
.risk__resp{color:var(--ink)}

.rules{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:9px}
.rules li{font-size:13.5px;color:var(--mute);padding-left:15px;position:relative;line-height:1.45}
.rules li::before{content:"\\00B7";position:absolute;left:4px;color:var(--now);font-weight:700}
footer{font:12px/1.6 var(--mono);color:var(--mute);border-top:1px solid var(--rule);padding-top:16px}
footer a{color:var(--idle)}
@media (max-width:640px){body{padding:0 14px 64px}.wrap{gap:40px}}
</style>

<div class="wrap">
  <header class="mast">
    <h1>Where the launch actually is</h1>
    <p class="mast__sub">Stoopwise Greenpoint, soft-launched and not yet shared broadly. Wave 1 seeding starts Monday. Every number here comes from the last analytics pull; every rule was written before the data it judges.</p>
    <div class="mast__meta">
      <span>As of ${esc(s.meta.asOf)}</span>
      <span>Analytics pull ${esc(s.meta.lastDataPull)}</span>
      ${s.meta.lastFeedCheck ? `<span>Feed check ${esc(s.meta.lastFeedCheck)}</span>` : ''}
      <span>Next readout ${esc(s.meta.nextReadout)}</span>
    </div>
  </header>

  <section>
    <h2>The track</h2>
    <ol class="track">${track}</ol>
  </section>

  <section>
    <h2>This week and what's blocked</h2>
    ${thisWeek}
  </section>

  <section>
    <h2>Experiments</h2>
    <p class="slotbar">${slots} of 3 slots spoken for · max 3 live, because attribution dies past that</p>
    <div class="scroll"><table>
      <thead><tr><th></th><th>Experiment</th><th>Target</th><th>Actual</th><th>Verdict</th><th>What it means</th></tr></thead>
      <tbody>${experiments}</tbody>
    </table></div>
  </section>

  <section>
    <h2>The four gates</h2>
    <div class="gates">${gates}</div>
  </section>

  <section>
    <h2>Metrics — analytics ${esc(s.meta.lastDataPull)}${s.meta.lastFeedCheck ? `, feed ${esc(s.meta.lastFeedCheck)}` : ''}</h2>
    <div class="tiles">${metrics}</div>
  </section>

  <section>
    <h2>Send log</h2>
    <div class="scroll"><table>
      <thead><tr><th>src</th><th>Channel</th><th>Wave</th><th>Sent</th><th>First session</th><th>Status</th></tr></thead>
      <tbody>${channels}</tbody>
    </table></div>
  </section>

  <section>
    <h2>Waiting on you</h2>
    <div class="decs">${decisions}</div>
  </section>

  <section>
    <h2>Known risks</h2>
    ${risks}
  </section>

  <section>
    <h2>The rules we're playing by</h2>
    <ul class="rules">${rules}</ul>
  </section>

  <footer>
    Generated from <code>docs/launch/gtm-state.json</code>. The Tuesday growth routine updates it and redeploys this page.<br>
    Sources: ${Object.values(s.meta.sources).map(esc).join(' · ')}
  </footer>
</div>
`;

writeFileSync(outPath, html);
console.log(`[cockpit] ${outPath} — ${(html.length / 1024).toFixed(1)}kb`);
