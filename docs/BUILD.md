# 🔄 Flujo de Trabajo · Build Automático

## Arquitectura

El proyecto usa un **flujo de build-time** donde los Markdown son la fuente de verdad:

```
┌──────────────────────────────────────────────┐
│  content/contenido_sitio.md  ·  content/diagrama_textos.md   │
└───────────────────────┬──────────────────────┘
                        │ npm run build
                        ↓
                ┌───────────────┐
                │ build-html.js │
                └───────┬───────┘
                        │ aplica
         ┌──────────────↓────────────────┐
         │ src/index.template.html       │
         │  · MD_PATCH (textos puntuales) │
         │  · MD_INSERT (bloques HTML)    │
         └──────────────┬────────────────┘
                        ↓
                ┌───────────────┐
                │ src/index.html│
                └───────────────┘
```

## Uso Local

### Requisitos
- Node.js 14+
- npm/yarn

### Marcadores en la plantilla

- `<!--MD_PATCH id="…"-->…<!--/MD_PATCH-->`: fragmento reemplazado por un valor derivado del Markdown (p. ej. título de portada, KPIs).
- `<!--MD_INSERT id="…"-->…<!--/MD_INSERT-->`: todo el bloque (p. ej. rejilla de tarjetas) se sustituye por HTML generado; el interior sirve de referencia si el insert falla.

**Diagrama (`diagrama_textos.md` → parches `diag_*`):** además de `diag_h1`, `diag_subtitle` y `diag_ayuda`, el build rellena `diag_btn_flujo`, `diag_pilar_etiqueta`, `diag_pilar_sub`, `diag_toolbar_1`–`3`, `diag_watermark`, `diag_legend_title` y `diag_legend_rows` (leyenda con emoji + etiqueta por línea).

### Anclas en la URL (deep links)

Cada panel horizontal del scroll tiene un `id` estable (`pantalla-1` … `pantalla-18`). Tras el build, podés enlazar directamente a una sección:

`https://…/index.html#pantalla-12`

- El título que ves en los puntos de navegación lateral es el atributo `data-screen-title` del panel (tabla siguiente).
- **`#diagramPanel`** se resuelve al mismo panel que **`#pantalla-18`** (diagrama interactivo), por compatibilidad con enlaces antiguos.

| Ancla | Título en UI (`data-screen-title`) |
|-------|-------------------------------------|
| `#pantalla-1` | Inicio |
| `#pantalla-2` | Cultura |
| `#pantalla-3` | Depende del Markdown: campo **Título** de `## Pantalla 3` en `content/contenido_sitio.md` (por defecto *Cultura* si falta). |
| `#pantalla-4` | Bienestar |
| `#pantalla-5` | A qué apuntamos |
| `#pantalla-6` | OKR |
| `#pantalla-7` | Objetivos y KPI's |
| `#pantalla-8` | Visión AI First |
| `#pantalla-9` | Marketing Analytic (RUN) |
| `#pantalla-10` | Analytics Hub (CHANGE) |
| `#pantalla-11` | Evolución (GROW) |
| `#pantalla-12` | Resumen 3 Capas |
| `#pantalla-13` | Gobernanza de IA |
| `#pantalla-14` | BI Generativo |
| `#pantalla-15` | Growth |
| `#pantalla-16` | Ingeniería de datos |
| `#pantalla-17` | Ciencia de datos |
| `#pantalla-18` o `#diagramPanel` | Diagrama |

Los bloques HTML de las pantallas **8–13** se generan en `build-html.js` a partir de `## Pantalla 8` … `## Pantalla 13` en `content/contenido_sitio.md`; el resto (salvo variaciones de la 3) está fijado en `src/index.template.html`.

### Editar Contenido

1. **Para editar pantallas (`## Pantalla N` en `content/contenido_sitio.md`):**
   ```bash
   # Editar en tu editor favorito
   # (VS Code, GitHub Web, etc.)
   vim content/contenido_sitio.md
   ```
   - Estructura: `## Pantalla N · Nombre`
   - Edita el texto bajo cada pantalla
   - Salva el archivo

2. **Para editar diagrama (pantalla 18 · `#pantalla-18` / `#diagramPanel`):**
   ```bash
   vim content/diagrama_textos.md
   ```
   - Edita cualquier sección bajo los headers
   - Diagrama: niveles, roles, artefactos, modales

### Generar HTML

```bash
# Generar src/index.html desde Markdown
npm run build

# Validar cambios
git status
git diff src/index.html

# Commit
git add .
git commit -m "Actualizar contenido: [describe cambios]"
git push
```

### Flujo CI/CD (Azure DevOps)

El pipeline automáticamente:

1. **Checkout** del código
2. **Build:** `npm run build` → genera `src/index.html` desde Markdown
3. **Validate:** verifica que archivos HTML requeridos existan
4. **Deploy:** sube a Azure Storage static website

## Estructura de archivos (repo actual)

```
IA First/
├── content/
│   ├── contenido_sitio.md   ← Pantallas 1–18 (## Pantalla N)
│   └── diagrama_textos.md   ← Diagrama UI (pantalla 18)
├── docs/
├── src/
│   ├── index.html           ← Generado (build)
│   ├── index.template.html
│   ├── build-html.js
│   └── css/styles.css
├── package.json
├── azure-pipelines.yml
└── build/build-data.json    ← debug opcional
```

## Flujo Recomendado: Team Edits

### Para No-Desarrolladores (Marketing, Product)

✅ **EDITABLE:**
- `content/contenido_sitio.md` — Textos de pantallas 1–18
- `content/diagrama_textos.md` — Textos del diagrama (pantalla 18)

❌ **NO TOCAR (como fuente de verdad):**
- `src/index.html` — Generado automáticamente
- `src/index.template.html` — Plantilla (solo devs, con cuidado)
- `src/build-html.js` — Script de build
- `package.json` - Configuración
- `azure-pipelines.yml` - Pipeline CI/CD

### Paso a Paso: Cambiar Contenido

#### Opción A: GitHub Web (Más fácil)

1. Abrí el repo en GitHub
2. Navegá a `content/contenido_sitio.md`
3. Click en ✏️ (Edit)
4. Edita directamente en el navegador
5. Scroll a abajo: "Commit changes"
6. Mensaje: Ej. "Actualizar OKR en Pantalla 6"
7. Click "Commit changes"
8. El pipeline ejecuta automáticamente
9. En 2-3 minutos, cambios en vivo 🚀

#### Opción B: Git Local (Para devs)

```bash
# 1. Clonar/pullear
git pull origin main

# 2. Editar
vim content/contenido_sitio.md
# ...editar...

# 3. Build local (validar)
npm run build
git diff src/index.html  # Ver cambios

# 4. Commit
git add .
git commit -m "Actualizar contenido: [qué cambió]"
git push

# 5. El pipeline despliega automáticamente
```

## Arquitectura: Cómo Funciona

### build-html.js

El script:

```javascript
1. Lee content/contenido_sitio.md
   → Parsea secciones: ## Pantalla N
   → Extrae contenido Markdown
   
2. Lee content/diagrama_textos.md
   → Parsea secciones de diagrama
   
3. Lee src/index.template.html
   → Usa como base/estructura
   
4. Procesa:
   ✓ Convierte Markdown → HTML
   ✓ Identifica patrones (bold, bullets, etc.)
   ✓ Genera HTML limpio
   
5. Escribe src/index.html
   ✓ Salida final lista para navegador
```

### Parseo de Markdown

El script entiende este formato:

```markdown
## Pantalla 6 · OKR

**Etiqueta:** PROPOSITO {O}

- **Título:** OKR
- **Mensaje principal:**
  Contribuir activamente a que las estrategias...

### Subsección
- Punto 1
- Punto 2

1. Numerado 1
2. Numerado 2
```

Se convierte a:

```html
<div class="pantalla-6">
  <span class="etiqueta">PROPOSITO {O}</span>
  <h1>OKR</h1>
  <p>Contribuir activamente...</p>
  <ul>
    <li>Punto 1</li>
    <li>Punto 2</li>
  </ul>
  <ol>
    <li>Numerado 1</li>
    <li>Numerado 2</li>
  </ol>
</div>
```

## Validación

Antes de pushear:

```bash
# Validar build
npm run validate

# Validar HTML (opcional, si tenés xmllint)
npm run build && xmllint --html --noout src/index.html

# Ver diff
git diff --color src/index.html
```

## Troubleshooting

### "build-html.js: No such file or directory"
```bash
cd /ruta/al/repo
ls -la src/build-html.js
npm run build
```

### Build falla en CI/CD
- Revisa logs en Azure DevOps
- Busca errores en Markdown (sintaxis)
- Valida que `content/contenido_sitio.md` y `content/diagrama_textos.md` existan

### HTML no actualiza en website
- Espera 3-5 minutos (propagación)
- Limpia cache: Ctrl+Shift+R (Hard refresh)
- Revisa que pipeline completó sin errores

## Capturas de pantalla (PNG)

1. Primera vez: `npm run screenshots:setup` (descarga Chromium en `./.playwright-browsers`).
2. `npm run screenshots` — ejecuta `build`, levanta `python3 -m http.server` sobre `src/`, abre Chromium y guarda PNG en `screenshots/`: **17 slides** (`01-…`–`17-…`) más **el diagrama (pantalla 18)** con **`setView(1|2|3)`** (Capacidades, Roles, Artefactos) y, si el área con scroll tiene overflow, capturas extra **scroll-derecha** / **scroll-abajo** por nivel.

Requisitos: Python 3 y red (Tailwind/fonts CDN al cargar la página).

## Próximas Mejoras

- [ ] Auto-sync back: HTML → Markdown (para cambios desde UI)
- [ ] Validación de Markdown schema
- [ ] Generación automática de tabla de contenidos
- [ ] Versionado de contenido (git history)

## Contacto & Soporte

Para preguntas sobre el flujo:
- 📧 Equipo CDE
- 🔗 GitRepo: [link]
- 📖 Docs: Este archivo

---

**Última actualización:** 2026-03-20
**Versión:** 1.0
**Estado:** MVP Funcional ✅
