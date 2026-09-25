const test = require("node:test");
const assert = require("node:assert/strict");
const { mkdtempSync, existsSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { parseArgs, run } = require("../dist/install.js");

test("parseArgs con opciones vacias", () => {
  const options = parseArgs([]);
  assert.equal(options.dryRun, false);
  assert.equal(options.help, false);
  assert.equal(options.version, false);
  assert.equal(options.home, undefined);
});

test("parseArgs con flags combinados", () => {
  const options = parseArgs(["--dry-run", "--home=/tmp/x", "--help", "-v"]);
  assert.equal(options.dryRun, true);
  assert.equal(options.home, "/tmp/x");
  assert.equal(options.help, true);
  assert.equal(options.version, true);
});

test("run instala el AGENTS.md en el home indicado", () => {
  const home = mkdtempSync(join(tmpdir(), "guardrail-"));
  const code = run({ home, dryRun: false, help: false, version: false });
  assert.equal(code, 0);
  assert.ok(existsSync(join(home, ".codex", "AGENTS.md")));
});

test("run con dry-run no escribe archivos", () => {
  const home = mkdtempSync(join(tmpdir(), "guardrail-"));
  const code = run({ home, dryRun: true, help: false, version: false });
  assert.equal(code, 0);
  assert.ok(!existsSync(join(home, ".codex", "AGENTS.md")));
});
