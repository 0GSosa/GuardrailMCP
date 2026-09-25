import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export interface DeployResult {
  agentsFile: string;
  created: boolean;
  backupPath?: string;
}

export function readTemplate(templatePath: string): string {
  return readFileSync(templatePath, "utf8");
}

export function backupIfExists(agentsFile: string): string | undefined {
  if (!existsSync(agentsFile)) return undefined;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `${agentsFile}.backup-${stamp}`;
  copyFileSync(agentsFile, backupPath);
  return backupPath;
}

export function deployAgentsMd(codexDir: string, templatePath: string): DeployResult {
  const agentsFile = join(codexDir, "AGENTS.md");
  const created = !existsSync(agentsFile);
  const backupPath = backupIfExists(agentsFile);
  mkdirSync(codexDir, { recursive: true });
  writeFileSync(agentsFile, readTemplate(templatePath), "utf8");
  return { agentsFile, created, backupPath };
}
