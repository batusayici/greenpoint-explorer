import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const fixturePath = "src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10g-corner-frontage-wrap.v0.1.json";
const reportPath = "docs/reports/phase-4m-r10g-franklin-corner-frontage-wrap.md";
const runtimePath = "src/Phase4BRuntimePreview.jsx";
const viteConfigPath = "vite.config.js";
const failures = [];

const fixture = readJson(fixturePath);
const report = readText(reportPath);
const runtime = readText(runtimePath);
const viteConfig = readText(viteConfigPath);

assert(fixture.phase === "4M-R10G", "Readiness must run against the R10G fixture.");
assert(fixture.preservation?.glbAssessmentStatus === "blocked_until_r10g_visual_review", "GLB assessment must remain blocked before visual approval.");
assert(runtime.includes("r10gCaptureRequested"), "Runtime must include browser self-capture trigger.");
assert(runtime.includes("captureR10GReviewScreenshots"), "Runtime must include the R10G capture sequence.");
assert(viteConfig.includes("/__r10g-capture"), "Vite config must expose the dev-only R10G capture endpoint.");
assert(report.includes("Screenshot Tooling Diagnosis"), "R10G report must document the screenshot tooling diagnosis.");

const expected = fixture.requiredScreenshots ?? [];
assert(expected.length === 5, "R10G readiness requires five review screenshots.");

for (const screenshotPath of expected) {
  const absolutePath = path.join(repoRoot, screenshotPath);
  assert(fs.existsSync(absolutePath), `Missing required R10G screenshot: ${screenshotPath}`);
  if (!fs.existsSync(absolutePath)) continue;

  const bytes = fs.readFileSync(absolutePath);
  assert(bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a", `Screenshot is not a PNG: ${screenshotPath}`);
  assert(bytes.length > 48_000, `Screenshot is suspiciously small and may be blank/incomplete: ${screenshotPath}`);
  const dimensions = readPngDimensions(bytes);
  assert(dimensions.width >= 1200 && dimensions.height >= 800, `Screenshot dimensions are too small: ${screenshotPath} (${dimensions.width}x${dimensions.height})`);
}

if (failures.length) {
  throw new Error(`4M-R10G visual approval readiness failed:\n- ${failures.join("\n- ")}\n\nCapture URL:\nhttp://127.0.0.1:5190/?qa=1&qaLayerFocus=franklin_rendered_wrap_truth&r10HeroAsset=0&camera=franklinRenderedWrapTruthTopDown&r10gCapture=1&v=r10g-capture`);
}

console.log("R10G visual approval readiness artifacts are present: five PNG screenshots exist, are valid PNGs, and meet minimum review dimensions. Batu visual approval is still required before GLB assessment.");

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function readPngDimensions(bytes) {
  if (bytes.length < 24) return { width: 0, height: 0 };
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}
