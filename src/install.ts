#!/usr/bin/env node
import { readFileSync } from "fs";
import { join } from "path";
import { resolveAgentsFile, resolveCodexDir, resolveOverrideFile, resolveTemplatePath } from "./paths";
import { DeployResult, deployAgentsMd } from "./deploy";
import { hasOverride, verifyAgentsFile } from "./check";

export interface CliOptions {
  home?: string;
  dryRun: boolean;
  help: boolean;
  version: boolean;
}

export function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { dryRun: false, help: false, version: false };
  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--version" || arg === "-v") options.version = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg.startsWith("--home=")) options.home = arg.slice("--home=".length);
  }
  return options;
}

function readVersion(): string {
  const pkgPath = join(__dirname, "..", "package.json");
  return JSON.parse(readFileSync(pkgPath, "utf8")).version as string;
}

function printHelp(): void {
  console.log("Uso: npx @ogsosa/guardrail [opciones]");
  console.log("");
  console.log("Instala el AGENTS.md corporativo en la carpeta de configuracion de Codex CLI");
  console.log("(C:\\Users\\<usuario>\\.codex\\AGENTS.md).");
  console.log("");
  console.log("Opciones:");
  console.log("  --dry-run       Muestra que se haria sin escribir archivos");
  console.log("  --home=RUTA     Instala en otro home (util para pruebas)");
  console.log("  -h, --help      Muestra esta ayuda");
  console.log("  -v, --version   Muestra la version del paquete");
}

function report(result: DeployResult, ok: boolean, override: boolean): void {
  console.log("Guardrail @ogsosa/guardrail");
  console.log(result.created
    ? `AGENTS.md creado en ${result.agentsFile}`
    : `AGENTS.md actualizado en ${result.agentsFile}`);
  if (result.backupPath) console.log(`Backup de la version anterior: ${result.backupPath}`);
  if (override) console.log("ATENCION: existe AGENTS.override.md y anula el AGENTS.md instalado.");
  console.log(ok ? "Verificacion: contenido correcto." : "Verificacion FALLIDA: el archivo no coincide con el template.");
}

export function run(options: CliOptions): number {
  const codexDir = resolveCodexDir(options.home);
  const agentsFile = resolveAgentsFile(options.home);
  const templatePath = resolveTemplatePath();
  if (options.dryRun) {
    console.log(`[dry-run] Se instalaria el AGENTS.md corporativo en ${agentsFile}`);
    return 0;
  }
  const result = deployAgentsMd(codexDir, templatePath);
  const ok = verifyAgentsFile(agentsFile, templatePath);
  report(result, ok, hasOverride(codexDir));
  return ok ? 0 : 1;
}

function main(): number {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) { printHelp(); return 0; }
  if (options.version) { console.log(readVersion()); return 0; }
  return run(options);
}

if (require.main === module) {
  process.exit(main());
}
