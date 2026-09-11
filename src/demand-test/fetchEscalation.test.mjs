import test from "node:test";
import assert from "node:assert/strict";
import { hasListingSubstance, plainFetchShortfall, looksUnrendered } from "./fetchEscalation.js";

const MIN = 500;

// The case this exists for, verbatim from .ingest-cache/yaro-studios.txt on
// 2026-09-10 — 516 characters of Squarespace nav, sixteen over the size floor.
const YARO_NAV = [
  "Workshops — yaro", "About", "Team", "Classes", "Membership",
  "Events & Private Classes", "Contact", "Gift Cards", "Back",
  "Adult Semester Classes", "One Time Wheel Classes", "Workshops",
  "Kids After School Program", "Kids Summer Clay Camp", "About Team", "Classes",
  "Adult Semester Classes", "One Time Wheel Classes", "Workshops",
  "Kids After School Program", "Kids Summer Clay Camp",
  "Membership Events & Private Classes Contact Gift Cards", "Subscribe",
  "Sign up to receive news and updates.", "Email Address", "Sign Up",
  "We respect your privacy.", "Thank you!", "Info", "Info",
  "Powered by Squarespace",
].join("\n");

test("a nav-only page over the size floor still escalates", () => {
  assert.ok(YARO_NAV.length > MIN, "the trap: it clears the size floor");
  assert.match(plainFetchShortfall(YARO_NAV, { minChars: MIN }), /no date, time or price/);
});

test("the same page read properly does not escalate", () => {
  // What hisawyer.com/yaro/schedules returns for the same studio.
  const real = YARO_NAV + "\nPlate Pals - Hand Build Your Own Ceramic Plate\nSat\n10:00am - 12:00pm EDT\nSep 26, 2026\n$95";
  assert.equal(plainFetchShortfall(real, { minChars: MIN }), null);
});

test("the size floor still fires on its own", () => {
  assert.match(plainFetchShortfall("Sep 26, 2026 $95", { minChars: MIN }), /only 16 chars/);
});

test("a page that states recurring programming in words is a listing", () => {
  // bin-bin-sake and Black Rabbit are this shape — no calendar, real programming.
  assert.ok(hasListingSubstance("Trivia every Thursday in the back room"));
});

test("a venue page with only hours is a listing, not a shell", () => {
  assert.ok(hasListingSubstance("Tuesday - 5pm-11pm\nWednesday - 5pm-11pm"));
});

test("a free event counts even with no price or clock", () => {
  assert.ok(hasListingSubstance("Community yoga, free, meet at the lawn"));
});

// Verbatim from hisawyer.com/yaro/schedules?widget_tags=kids on 2026-09-11 —
// the entire page, 446 characters, because Yaro runs two kids classes.
const YARO_KIDS = [
  "Yaro", "Log In", "Semesters", "Events", "Appointments", "Online Classes",
  "Gift Cards", "Age/Grade", "Time", "Date", "More Filters", "STARTING SOON",
  "Kids Afternoon Clay & Art Lab", "6 – 12 yrs", "Wed", "3:00pm - 5:00pm EDT",
  "Sep 16, 2026 - Dec 16, 2026", "yaro studios, 76 Kent St, Greenpoint",
  "$825.50 or $68.50/class", "Join Waitlist",
  "Plate Pals - Hand Build Your Own Ceramic Plate", "5 – 18+ yrs", "Sat",
  "10:00am - 12:00pm EDT", "Sep 26, 2026 - Sep 26, 2026",
  "yaro studios, 76 Kent St, Greenpoint", "$95", "More Info",
].join("\n");

test("a short page that is genuinely all there is counts as rendered", () => {
  assert.ok(YARO_KIDS.length < MIN, "the trap: it is under the size floor");
  assert.equal(looksUnrendered(YARO_KIDS, { minChars: MIN }), false);
});

test("a shell that has not loaded yet is still caught", () => {
  // The comedy club's unrendered page, 2026-08-05: chrome, no shows.
  const shell = "Greenpoint Comedy Club\nHome\nShows\nTickets\nAbout\nContact\nLoading…";
  assert.equal(looksUnrendered(shell, { minChars: MIN }), true);
});
