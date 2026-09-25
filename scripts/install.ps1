# Guardrail @capitanfeeder/guardrail - instalador para Windows (PowerShell)
# Coloca el AGENTS.md corporativo en C:\Users\<usuario>\.codex\AGENTS.md
# No requiere Node.js: descarga el template directamente desde el repositorio.

$ErrorActionPreference = "Stop"

$RepoRawBase = "https://raw.githubusercontent.com/0GSosa/GuardrailMCP/master"
$TemplateUrl = "$RepoRawBase/templates/AGENTS.md"

$CodexDir = Join-Path $HOME ".codex"
$AgentsFile = Join-Path $CodexDir "AGENTS.md"

if (-not (Test-Path $CodexDir)) {
    New-Item -ItemType Directory -Path $CodexDir | Out-Null
    Write-Host "Carpeta creada: $CodexDir"
}

if (Test-Path $AgentsFile) {
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backup = "$AgentsFile.backup-$stamp"
    Copy-Item $AgentsFile $backup
    Write-Host "Backup de la version anterior: $backup"
}

Invoke-WebRequest -Uri $TemplateUrl -OutFile $AgentsFile
Write-Host "AGENTS.md instalado en $AgentsFile"

if (Test-Path (Join-Path $CodexDir "AGENTS.override.md")) {
    Write-Host "ATENCION: existe AGENTS.override.md y anula el AGENTS.md instalado."
}

Write-Host "Listo. Verifica con: codex --ask-for-approval never `"Summarize the current instructions.`""
