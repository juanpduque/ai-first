# 🔄 Flujo de Trabajo · Build Automático

## Arquitectura

El proyecto usa un **flujo de build-time** donde los Markdown son la fuente de verdad:

```
┌─────────────────────────────────────────┐
│  contenido_sitio.md (Pantallas 1-11)   │
│  diagrama_textos.md (Pantalla 12)      │
└────────────────┬────────────────────────┘
                 │ npm run build
                 ↓
         ┌──────────────────┐
         │  build-html.js   │
         └────────┬─────────┘
                  │
         ┌────────↓──────────┐
         │ index.template.html│
         └────────┬──────────┘
                  │
         ┌────────↓──────────┐
         │    index.html      │
         │   (generado)       │
         └────────────────────┘
```

## Uso Local

### Requisitos
- Node.js 14+
- npm/yarn

### Editar Contenido

1. **Para editar pantallas (Pantalla 1-11):**
   ```bash
   # Editar en tu editor favorito
   # (VS Code, GitHub Web, etc.)
   vim contenido_sitio.md
   ```
   - Estructura: `## Pantalla N · Nombre`
   - Edita el texto bajo cada pantalla
   - Salva el archivo

2. **Para editar diagrama (Pantalla 12):**
   ```bash
   vim diagrama_textos.md
   ```
   - Edita cualquier sección bajo los headers
   - Diagrama: niveles, roles, artefactos, modales

### Generar HTML

```bash
# Generar index.html desde Markdown
npm run build

# Validar cambios
git status
git diff index.html

# Commit
git add .
git commit -m "Actualizar contenido: [describe cambios]"
git push
```

### Flujo CI/CD (Azure DevOps)

El pipeline automáticamente:

1. **Checkout** del código
2. **Build:** `npm run build` → genera `index.html` desde Markdown
3. **Validate:** verifica que archivos HTML requeridos existan
4. **Deploy:** sube a Azure Storage static website

## Estructura de Archivos

```
/Users/jupduque/Downloads/IA First/
├── index.html              ← HTML generado (salida de build)
├── index.template.html     ← Template base (no editar)
├── contenido_sitio.md      ← Editable: Pantallas 1-11
├── diagrama_textos.md      ← Editable: Pantalla 12
├── build-html.js          ← Script de build
├── package.json           ← Configuración npm
├── azure-pipelines.yml    ← Pipeline de CI/CD
└── build-data.json        ← Datos generados (debug)
```

## Flujo Recomendado: Team Edits

### Para No-Desarrolladores (Marketing, Product)

✅ **EDITABLE:**
- `contenido_sitio.md` - Edita textos de pantallas
- `diagrama_textos.md` - Edita textos del diagrama

❌ **NO TOCAR:**
- `index.html` - Generado automáticamente
- `index.template.html` - Template base
- `build-html.js` - Script de build
- `package.json` - Configuración
- `azure-pipelines.yml` - Pipeline CI/CD

### Paso a Paso: Cambiar Contenido

#### Opción A: GitHub Web (Más fácil)

1. Abrí el repo en GitHub
2. Navegá a `contenido_sitio.md`
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
vim contenido_sitio.md
# ...editar...

# 3. Build local (validar)
npm run build
git diff index.html  # Ver cambios

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
1. Lee contenido_sitio.md
   → Parsea secciones: ## Pantalla N
   → Extrae contenido Markdown
   
2. Lee diagrama_textos.md
   → Parsea secciones de diagrama
   
3. Lee index.template.html
   → Usa como base/estructura
   
4. Procesa:
   ✓ Convierte Markdown → HTML
   ✓ Identifica patrones (bold, bullets, etc.)
   ✓ Genera HTML limpio
   
5. Crea index.html
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

# Validar HTML
npm run build && xmllint --html --noout index.html

# Ver diff
git diff --color index.html
```

## Troubleshooting

### "build-html.js: No such file or directory"
```bash
cd '/Users/jupduque/Downloads/IA First'
ls -la *.js
```

### Build falla en CI/CD
- Revisa logs en Azure DevOps
- Busca errores en Markdown (sintaxis)
- Valida que contenido_sitio.md y diagrama_textos.md existan

### HTML no actualiza en website
- Espera 3-5 minutos (propagación)
- Limpia cache: Ctrl+Shift+R (Hard refresh)
- Revisa que pipeline completó sin errores

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
