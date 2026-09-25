const test = require("node:test");
const assert = require("node:assert/strict");
const { mkdtempSync, readFileSync, existsSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { deployAgentsMd, backupIfExists } = require("../dist/deploy.js");
const { verifyAgentsFile, hasOverride } = require("../dist/check.js");
const { resolveTemplatePath } = require("../dist/paths.js");

function makeHome() {
  return mkdtempSync(join(tmpdir(), "guardrail-"));
}

test("deployAgentsMd crea .codex y escribe el AGENTS.md del template", () => {
  const codexDir = join(makeHome(), ".codex");
  const template = resolveTemplatePath();
  const result = deployAgentsMd(codexDir, template);
  assert.equal(result.created, true);
  assert.ok(existsSync(result.agentsFile));
  assert.equal(readFileSync(result.agentsFile, "utf8"), readFileSync(template, "utf8"));
});

test("deployAgentsMd respalda el AGENTS.md existente antes de pisarlo", () => {
  const codexDir = join(makeHome(), ".codex");
  const template = resolveTemplatePath();
  writeFileSync(join(makeHome(), "placeholder.txt"), "x");
  const first = deployAgentsMd(codexDir, template);
  writeFileSync(first.agentsFile, "contenido viejo");
  const second = deployAgentsMd(codexDir, template);
  assert.equal(second.created, false);
  assert.ok(second.backupPath);
  assert.equal(readFileSync(second.backupPath, "utf8"), "contenido viejo");
});

test("backupIfExists no hace nada si el archivo no existe", () => {
  assert.equal(backupIfExists(join(makeHome(), "no-existe.md")), undefined);
});

test("verifyAgentsFile detecta archivos distintos al template", () => {
  const codexDir = join(makeHome(), ".codex");
  const template = resolveTemplatePath();
  const result = deployAgentsMd(codexDir, template);
  assert.equal(verifyAgentsFile(result.agentsFile, template), true);
  writeFileSync(result.agentsFile, "otra cosa");
  assert.equal(verifyAgentsFile(result.agentsFile, template), false);
});

test("hasOverride detecta AGENTS.override.md", () => {
  const codexDir = join(makeHome(), ".codex");
  deployAgentsMd(codexDir, resolveTemplatePath());
  assert.equal(hasOverride(codexDir), false);
  writeFileSync(join(codexDir, "AGENTS.override.md"), "x");
  assert.equal(hasOverride(codexDir), true);
});
