# @ogsosa/guardrail

Instalador del guardrail corporativo para Codex CLI. En esta primera versión, el comando de
instalación coloca el archivo `AGENTS.md` con las directivas corporativas en la carpeta de
configuración de Codex (`C:\Users\<usuario>\.codex\AGENTS.md` en Windows, `~/.codex/AGENTS.md`
en macOS y Linux).

## Cómo funciona la instalación con un solo comando

El paquete se publica en un registry npm (npmjs o el registry interno de la empresa). La magia
del "un solo comando" es el campo `bin` del `package.json`: define qué script se ejecuta cuando
alguien corre `npx @ogsosa/guardrail`. El flujo es:

1. `npx` descarga el paquete desde el registry (no deja nada instalado en la máquina).
2. Node ejecuta el comando `guardrail` declarado en `bin` (es el archivo `dist/install.js`).
3. Ese comando resuelve la carpeta `~/.codex`, crea el backup del `AGENTS.md` anterior si existía,
   escribe el template de directivas y verifica que el contenido quedó correcto.

Cuando en la versión 2 agreguemos el servidor MCP, el mismo comando también va a registrar la
sección `[mcp_servers.guardrail]` en `~/.codex/config.toml`. Ahí Codex pasa a cargar el MCP en
cada sesión automáticamente. Eso es todo lo que significa "instalar un MCP": que la config de
Codex apunte a él y el comando esté disponible.

## Requisitos

- Para `npx`: Node.js 18 o superior.
- Para los scripts de instalación: solo PowerShell (Windows) o bash + curl (macOS/Linux).

## Instalación

### Opción 1: con npx (Windows, macOS y Linux)

El mismo comando sirve en los tres sistemas:

    npx @ogsosa/guardrail

Versión fija (recomendable para despliegues controlados):

    npx @ogsosa/guardrail@0.1.0

### Opción 2: script de instalación por sistema operativo

Windows (PowerShell):

    # 1. Descargar el instalador
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/0GSosa/GuardrailMCP/master/scripts/install.ps1 -OutFile install.ps1

    # 2. (Opcional pero recomendado) Revisar el script
    notepad install.ps1

    # 3. Desbloquear el archivo descargado (quita la restricción Mark-of-the-Web)
    Unblock-File .\install.ps1

    # 4. Ejecutarlo
    .\install.ps1

macOS / Linux (bash):

    # 1. Descargar el instalador
    curl -fsSL https://raw.githubusercontent.com/0GSosa/GuardrailMCP/master/scripts/install.sh -o install.sh

    # 2. (Opcional pero recomendado) Revisar el script
    less install.sh

    # 3. Dar permiso de ejecución
    chmod +x install.sh

    # 4. Ejecutarlo
    ./install.sh

Los scripts no requieren Node.js: descargan el template de directivas y lo colocan en `~/.codex`.

## Qué hace exactamente (versión 0.1.0)

- Resuelve la carpeta `~/.codex` del usuario actual (sin rutas hardcodeadas).
- Crea la carpeta si no existe.
- Si ya hay un `AGENTS.md`, lo respalda como `AGENTS.md.backup-<fecha>` antes de pisarlo.
- Escribe el `AGENTS.md` con las directivas corporativas (contenido de `templates/AGENTS.md`).
- Verifica que el archivo instalado coincida con el template.
- Avisa si existe `AGENTS.override.md`, porque Codex le da prioridad y anula lo instalado.

## Verificación

    npx @ogsosa/guardrail --dry-run

Y tras instalar, confirmar que Codex ve las directivas:

    codex --ask-for-approval never "Summarize the current instructions."

La respuesta debe citar las directivas corporativas del `AGENTS.md`.

## Desarrollo local

    npm install
    npm run build
    npm test
    node dist/install.js --home=/tmp/prueba

## Estructura del proyecto

    package.json        nombre, versión y comando bin
    src/install.ts      CLI que corre npx (orquesta la instalación)
    src/paths.ts        resolución de rutas (~/.codex, AGENTS.md, template)
    src/deploy.ts       escritura del AGENTS.md y backup del anterior
    src/check.ts        verificación post-instalación y detección de override
    templates/AGENTS.md directivas corporativas que se instalan
    scripts/            instaladores alternativos (PowerShell y bash)
    test/               tests unitarios (node --test)

## Publicación

El repo vive en https://github.com/0GSosa/GuardrailMCP (rama `master`) y se puede validar
con `node dist/install.js` o `npm pack` sin publicar. Para publicar:

### npmjs.com (lo que habilita `npx` sin configuración previa)

1. Tener 2FA habilitado en la cuenta npm (Settings → Two-Factor Authentication). npm exige
   segundo factor para publicar.
2. `npm login`
3. `npm publish --access public` (el flag es obligatorio en paquetes con scope en cuentas gratuitas)

El script `prepublishOnly` corre build y tests automáticamente antes de publicar, así que el
tarball siempre incluye `dist/`. Si se quiere saltar esa garantía, compilar antes con `npm run build`.

### Otras opciones:

- GitHub Packages: requiere un `.npmrc` con token hacia `npm.pkg.github.com` y que el scope del
  paquete coincida con el usuario u organización que publica, así que exigiría renombrar el
  paquete. npmjs no tiene esa restricción.
- Registry interno de la empresa (GitHub de la empresa): el pipeline puede publicar el paquete
  en el registry que se defina, adaptando el nombre al scope interno.

## Próximas versiones

- Registrar el MCP corporativo en `~/.codex/config.toml` (sección `[mcp_servers.guardrail]`).
- Instalar y encadenar codebase-memory y caveman desde el mismo comando.
- Comandos de diagnóstico (`guardrail doctor`) y actualización de la política sin pasos manuales.
