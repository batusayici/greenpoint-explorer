#!/usr/bin/env node

import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const GENERATOR_PATH = "scripts/ingest-source-evidence-fixture.mjs";
const RAW_INPUT_PATHS = [
  "src/data/source-evidence/raw/grillpoint.phase-2e.raw.json",
  "src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json",
  "src/data/source-evidence/raw/official-locations.phase-2k.raw.json",
];
const MANIFEST_PATH = "src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json";
const COMMITTED_FIXTURE_PATH = "src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json";
const REVIEWED_REFERENCE_FIXTURE_PATH = "src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json";

async function main() {
  const tempDir = await mkdtemp(resolve(tmpdir(), "greenpoint-source-evidence-determinism-"));
  const firstOutputPath = resolve(tempDir, "generated-first.json");
  const secondOutputPath = resolve(tempDir, "generated-second.json");
  let shouldCleanup = false;

  try {
    const firstRun = await runGeneration(firstOutputPath);
    const secondRun = await runGeneration(secondOutputPath);
    const firstOutput = await readFile(firstOutputPath, "utf8");
    const secondOutput = await readFile(secondOutputPath, "utf8");
    const committedOutput = await readFile(resolve(repoRoot, COMMITTED_FIXTURE_PATH), "utf8");
    const failures = [];

    if (firstOutput !== secondOutput) {
      failures.push(formatMismatch({
        label: "repeated generation output mismatch",
        expectedLabel: "first generated output",
        actualLabel: "second generated output",
        expected: firstOutput,
        actual: secondOutput,
      }));
    }

    if (firstOutput !== committedOutput) {
      failures.push(formatMismatch({
        label: "committed fixture drift",
        expectedLabel: COMMITTED_FIXTURE_PATH,
        actualLabel: firstOutputPath,
        expected: committedOutput,
        actual: firstOutput,
      }));
    }

    if (failures.length) {
      console.error(`FAIL source evidence determinism verification: ${failures.length} issue(s).`);
      for (const failure of failures) console.error(`- ${failure}`);
      console.error(`Retained generated outputs for inspection: ${firstOutputPath}, ${secondOutputPath}`);
      process.exitCode = 1;
      return;
    }

    shouldCleanup = true;
    const fixture = JSON.parse(firstOutput);
    console.log([
      "PASS source evidence determinism:",
      `${fixture.records.length} record(s) regenerated twice with byte-identical output;`,
      `committed fixture ${COMMITTED_FIXTURE_PATH} matches regenerated output;`,
      `generator=${GENERATOR_PATH};`,
      `rawInputs=${RAW_INPUT_PATHS.join(",")};`,
      `manifest=${MANIFEST_PATH}.`,
    ].join(" "));
    const generatorSummary = summarizeGeneratorStdout(firstRun.stdout);
    if (generatorSummary) console.log(`INFO generator check: ${generatorSummary}`);
  } finally {
    if (shouldCleanup) await rm(tempDir, { recursive: true, force: true });
  }
}

async function runGeneration(outputPath) {
  const args = [
    GENERATOR_PATH,
    ...RAW_INPUT_PATHS.flatMap((inputPath) => ["--input", inputPath]),
    "--manifest",
    MANIFEST_PATH,
    "--output",
    outputPath,
    "--compare-to",
    REVIEWED_REFERENCE_FIXTURE_PATH,
    "--require-all-expected",
    "true",
    "--allow-additional-generated",
    "true",
  ];

  try {
    return await execFileAsync(process.execPath, args, {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024,
    });
  } catch (error) {
    const stdout = error.stdout ? `\nstdout:\n${error.stdout}` : "";
    const stderr = error.stderr ? `\nstderr:\n${error.stderr}` : "";
    throw new Error(`Generator command failed for ${outputPath}.${stdout}${stderr}`);
  }
}

function formatMismatch({ label, expectedLabel, actualLabel, expected, actual }) {
  const mismatch = findFirstDifference(expected, actual);
  return [
    label,
    `${expectedLabel} bytes=${expected.length}`,
    `${actualLabel} bytes=${actual.length}`,
    `first difference at line ${mismatch.line}, column ${mismatch.column}`,
    `expected: ${mismatch.expectedLine}`,
    `actual: ${mismatch.actualLine}`,
  ].join("; ");
}

function findFirstDifference(expected, actual) {
  const limit = Math.min(expected.length, actual.length);
  let index = 0;
  while (index < limit && expected[index] === actual[index]) index += 1;
  const expectedLines = expected.slice(0, index).split("\n");
  const line = expectedLines.length;
  const column = expectedLines.at(-1).length + 1;
  return {
    line,
    column,
    expectedLine: lineAt(expected, line),
    actualLine: lineAt(actual, line),
  };
}

function lineAt(value, lineNumber) {
  return value.split("\n")[lineNumber - 1] ?? "<end of file>";
}

function summarizeGeneratorStdout(value) {
  return value
    .trim()
    .split(/\s*\n\s*/)
    .filter((line) => line && !line.startsWith("Wrote "))
    .join(" | ");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
