// Tally — the signup, feedback and business-submission forms.
//
// The key is user-scoped and inherits every permission of the account that made
// it (Tally had no read-only scopes as of 2026-07), so a leak could delete forms
// and submissions. This module only ever issues GETs, and the key must never
// gain a VITE_ prefix — Vite inlines VITE_ vars into the client bundle.
//
// Verified live 2026-07-26: /analytics/metrics works on the free plan;
// /analytics/dimensions and /analytics/drop-off return 403. Don't re-try those
// without a plan upgrade.

import { requireEnv, request, STATUS } from "../env.mjs";

const API = "https://api.tally.so";

export const FORMS = [
  { id: process.env.TALLY_SIGNUP_FORM_ID ?? "44daZo", role: "signup" },
  { id: process.env.TALLY_FEEDBACK_FORM_ID ?? "LZqEj1", role: "feedback" },
  { id: process.env.TALLY_SUBMIT_FORM_ID ?? "aQXzOB", role: "submit" },
];

export async function pullTally({ upperBound }) {
  const { TALLY_API_KEY } = requireEnv(["TALLY_API_KEY"]);
  const headers = { Authorization: `Bearer ${TALLY_API_KEY}` };

  const get = async (path, what) => {
    const res = await request(`${API}${path}`, { headers }, { what: `Tally ${what}` });
    return res.json();
  };

  const forms = {};
  const failures = [];
  for (const form of FORMS) {
    try {
      const submissions = [];
      for (let page = 1; ; page += 1) {
        const body = await get(
          `/forms/${form.id}/submissions?limit=100&page=${page}`,
          `${form.role} submissions`,
        );
        submissions.push(...(body.submissions ?? []));
        if (!body.hasMore) break;
      }
      forms[form.role] = submissions
        .filter((s) => !upperBound || new Date(s.submittedAt) < new Date(upperBound))
        .map((s) => normalise(s));
    } catch (error) {
      if (error.status === STATUS.ENV || error.status === STATUS.AUTH) throw error;
      failures.push({ query: form.role, message: error.message });
    }
  }

  return { forms, status: failures.length ? STATUS.PARTIAL : STATUS.OK, failures };
}

// The signup form carries an email and a hidden field holding what the reader
// chose to follow. The API returns that hidden field as an OBJECT —
// `{"follow":"lens:family_kids","src":"parents"}` — while the email comes back
// as a plain string, so a reader that only handles strings silently records
// every signup as unsegmented.
export function normalise(submission) {
  const out = { submittedAt: submission.submittedAt, email: null, follow: null, src: null };
  for (const r of submission.responses ?? []) {
    const answer = r.answer ?? r.value;
    if (answer && typeof answer === "object") {
      out.follow = answer.follow ?? out.follow;
      out.src = answer.src ?? out.src;
      continue;
    }
    if (typeof answer !== "string") continue;
    const value = answer.trim();
    if (value.includes("@")) {
      out.email = out.email ?? value.toLowerCase();
    } else if (value.startsWith("{")) {
      try {
        const hidden = JSON.parse(value);
        out.follow = hidden.follow ?? out.follow;
        out.src = hidden.src ?? out.src;
      } catch {
        /* a hidden field that is not JSON is noise, not a signal */
      }
    }
  }
  return out;
}
