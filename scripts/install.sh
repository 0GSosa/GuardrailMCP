#!/usr/bin/env bash
# Guardrail @ogsosa/guardrail - instalador para macOS / Linux
# Coloca el AGENTS.md corporativo en ~/.codex/AGENTS.md
# No requiere Node.js: descarga el template directamente desde el repositorio.
set -euo pipefail

REPO_RAW_BASE="https://raw.githubusercontent.com/0GSosa/GuardrailMCP/master"
TEMPLATE_URL="$REPO_RAW_BASE/templates/AGENTS.md"

CODEX_DIR="$HOME/.codex"
AGENTS_FILE="$CODEX_DIR/AGENTS.md"

mkdir -p "$CODEX_DIR"

if [ -f "$AGENTS_FILE" ]; then
  STAMP=$(date +%Y%m%d-%H%M%S)
  cp "$AGENTS_FILE" "$AGENTS_FILE.backup-$STAMP"
  echo "Backup de la version anterior: $AGENTS_FILE.backup-$STAMP"
fi

curl -fsSL "$TEMPLATE_URL" -o "$AGENTS_FILE"
echo "AGENTS.md instalado en $AGENTS_FILE"

if [ -f "$CODEX_DIR/AGENTS.override.md" ]; then
  echo "ATENCION: existe AGENTS.override.md y anula el AGENTS.md instalado."
fi

echo 'Listo. Verifica con: codex --ask-for-approval never "Summarize the current instructions."'
