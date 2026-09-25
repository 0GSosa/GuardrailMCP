import { existsSync, readFileSync } from "fs";
import { join } from "path";

export function hasOverride(codexDir: string): boolean {
  return existsSync(join(codexDir, "AGENTS.override.md"));
}

export function verifyAgentsFile(agentsFile: string, templatePath: string): boolean {
  if (!existsSync(agentsFile)) return false;
  const installed = readFileSync(agentsFile, "utf8");
  return installed === readTemplateSafe(templatePath);
}

function readTemplateSafe(templatePath: string): string {
  return existsSync(templatePath) ? readFileSync(templatePath, "utf8") : "";
}
