#!/usr/bin/env node
// Checkpoint data pull — Tally forms (see docs/launch/2026-07-29-checkpoint-readout.md).
// Replaces the manual CSV export for criteria 1/2/3/6.
//
// Reads TALLY_API_KEY from .env.local (gitignored). Like POSTHOG_READ_KEY it must
// never gain a VITE_ prefix — Vite inlines VITE_ vars into the client bundle, and
// a Tally key is user-scoped: it inherits ALL permissions of the account that made
// it (no read-only scopes as of 2026-07), so a leaked key could delete forms and
// submissions. This script only ever issues GETs.
//
// Plan note (verified live 2026-07-26): /analytics/metrics works on the free plan;
// /analytics/dimensions and /analytics/drop-off return 403 UNAUTHORIZED_ACTION.
// Don't re-try those without a plan upgrade.
//
// Usage:
//   node scripts/tally-pull.mjs           # metrics + every submission, both forms
//   node scripts/tally-pull.mjs --forms   # list all forms with their ids

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.tally.so";

// Public form URLs are tally.so/r/<id>, and that <id> IS the API form id.
const FORMS = [
  { id: process.env.TALLY_SIGNUP_FORM_ID ?? "44daZo", role: "signup" },
  { id: process.env.TALLY_FEEDBACK_FORM_ID ?? "LZqEj1", role: "feedback" },
  // L5: business submission form ("Add your event"), live 2026-07-29 — the
  // supply-gate sensor. Carries a hidden `ref` (list|empty) for placement.
  { id: process.env.TALLY_SUBMIT_FORM_ID ?? "aQXzOB", role: "submit" },
];

function loadEnvLocal() {
  let text;
  try {
    text = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  } catch {
    return;
  }
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

async function get(path, token) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = body?.message ?? res.statusText;
    throw new Error(`${res.status} ${msg} — ${path}`);
  }
  return body;
}

// Choice answers arrive as option ids; map them back to their labels when the
// question definition carries options. Everything else prints as-is.
export function formatAnswer(question, answer) {
  if (answer == null || answer === "") return "(blank)";
  const options = (question?.fields ?? []).flatMap((f) => f.options ?? []);
  const label = (v) => options.find((o) => o.id === v)?.text ?? String(v);
  if (Array.isArray(answer)) return answer.map(label).join("; ") || "(blank)";
  if (typeof answer === "object") return JSON.stringify(answer);
  return label(answer);
}

async function allSubmissions(formId, token) {
  const out = [];
  let questions = [];
  let counts = null;
  for (let page = 1; ; page += 1) {
    const d = await get(`/forms/${formId}/submissions?limit=100&page=${page}`, token);
    questions = d.questions ?? questions;
    counts = d.totalNumberOfSubmissionsPerFilter ?? counts;
    out.push(...(d.submissions ?? []));
    if (!d.hasMore) break;
  }
  return { submissions: out, questions, counts };
}

// Importable: the CLI only runs when this file is the entry point, so the
// formatting logic above can be exercised without hitting the API.
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  loadEnvLocal();
  const token = process.env.TALLY_API_KEY;
  if (!token) {
    console.error(
      "TALLY_API_KEY missing. Create one at Tally → Settings → API keys (prefix tly-),\n" +
        "then add it to .env.local as TALLY_API_KEY= (no VITE_ prefix).",
    );
    process.exit(1);
  }

  if (process.argv.includes("--forms")) {
    const d = await get("/forms", token);
    for (const f of d.items ?? []) {
      console.log(`  ${f.id}  ${f.status.padEnd(9)}  subs:${String(f.numberOfSubmissions).padStart(4)}  ${f.name ?? "(untitled)"}`);
    }
    process.exit(0);
  }

  for (const { id, role } of FORMS) {
    const [m, { submissions, questions, counts }] = await Promise.all([
      get(`/forms/${id}/analytics/metrics?period=all`, token),
      allSubmissions(id, token),
    ]);
    const qs = new Map(questions.map((q) => [q.id, q]));

    console.log(`\n=== ${role} (${id}) ===`);
    console.log(
      `  visits ${m.visits} · starts ${m.starts} · completions ${m.completions} · ` +
        `completion rate ${m.completionRate}% · unique respondents ${m.uniqueRespondents}`,
    );
    console.log(`  submissions: all ${counts?.all ?? 0} · completed ${counts?.completed ?? 0} · partial ${counts?.partial ?? 0}`);

    if (submissions.length === 0) {
      console.log("  (no submissions)");
      continue;
    }
    const byDate = [...submissions].sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
    for (const s of byDate) {
      console.log(`\n  ${s.submittedAt}${s.isCompleted ? "" : "  [PARTIAL]"}`);
      for (const r of s.responses ?? []) {
        const q = qs.get(r.questionId);
        console.log(`    ${q?.title ?? r.questionId}: ${formatAnswer(q, r.answer)}`);
      }
    }
  }
}
