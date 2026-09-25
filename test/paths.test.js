const test = require("node:test");
const assert = require("node:assert/strict");
const { join } = require("node:path");
const { existsSync } = require("node:fs");
const {
  resolveCodexDir,
  resolveAgentsFile,
  resolveOverrideFile,
  resolveTemplatePath,
} = require("../dist/paths.js");

test("resolveCodexDir usa el home indicado", () => {
  assert.equal(resolveCodexDir("/home/dev"), join("/home/dev", ".codex"));
});

test("resolveAgentsFile apunta a AGENTS.md dentro de .codex", () => {
  assert.equal(resolveAgentsFile("/home/dev"), join("/home/dev", ".codex", "AGENTS.md"));
});

test("resolveOverrideFile apunta a AGENTS.override.md", () => {
  assert.equal(resolveOverrideFile("/home/dev"), join("/home/dev", ".codex", "AGENTS.override.md"));
});

test("resolveTemplatePath encuentra el template del paquete", () => {
  assert.ok(existsSync(resolveTemplatePath()));
});
