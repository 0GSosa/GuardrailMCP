import { homedir } from "os";
import { join } from "path";

export function resolveCodexDir(home?: string): string {
  return join(home ?? homedir(), ".codex");
}

export function resolveAgentsFile(home?: string): string {
  return join(resolveCodexDir(home), "AGENTS.md");
}

export function resolveOverrideFile(home?: string): string {
  return join(resolveCodexDir(home), "AGENTS.override.md");
}

export function resolveTemplatePath(): string {
  return join(__dirname, "..", "templates", "AGENTS.md");
}
