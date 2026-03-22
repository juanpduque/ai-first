# 🚀 IA First CDE · Estrategia Presentación Interactiva

Presentación web interactiva de la estrategia **IA First** para el Centro de Excelencia (CDE) de Analítica de Mercadeo.

## 📁 Estructura del Proyecto

```
IA First/
├── 📄 README.md                    ← Este archivo
├── 📄 package.json                 ← Scripts y configuración npm
├── 🔧 azure-pipelines.yml          ← Pipeline CI/CD
├── .gitignore                      ← Archivos a ignorar en Git
│
├── 📂 content/                     ← CONTENIDO EDITABLE (Markdown)
│   ├── contenido_sitio.md          ✏️  Pantallas 1–18 (por sección)
│   └── diagrama_textos.md          ✏️  Textos del diagrama (pantalla 18)
│
├── 📂 docs/                        ← DOCUMENTACIÓN (índice: docs/README.md)
│   ├── README.md                   📖 Índice de guías en /docs
│   ├── QUICK-START.md              📖 Para tu equipo (no-devs)
│   ├── BUILD.md                    📖 Build, Markdown y anclas URL
│   └── ARCHITECTURE.md             📖 Arquitectura técnica
│
├── 📂 src/                         ← CÓDIGO FUENTE
│   ├── index.html                  🌐 Aplicación principal (generada)
│   ├── index.template.html         🖼️  Template base
│   ├── build-html.js               ⚙️  Script de build
│   └── css/                        🎨 Estilos adicionales (si aplica)
│
├── 📂 assets/                      ← RECURSOS (imágenes, CSS, JS)
│   └── (vacío por ahora)
│
├── 📂 build/                       ← ARTEFACTOS BUILD
│   └── build-data.json             📊 Datos generados
│
└── 📂 dist/                        ← PARA PRODUCCIÓN
    └── (vacío por ahora)
```

---

## 🎯 Inicio Rápido

### Para tu Equipo (No-Desarrolladores)

**Edita contenido en Markdown:**

```bash
# 1. Abre cualquier editor (VS Code, GitHub Web, etc.)
content/contenido_sitio.md       # Pantallas 1–18 (estructura por sección)
content/diagrama_textos.md       # Textos del diagrama (UI pantalla 18)

# 2. Edita el texto
# 3. Commit y Push (si usas Git)
# 4. Build automático y deploy ✨
```

👉 Ver: [docs/QUICK-START.md](docs/QUICK-START.md)

### Para Desarrolladores

**Build local:**

```bash
npm install
npm run build        # Genera src/index.html desde Markdown
npm run validate     # Valida el build
```

**Push y deploy:**

```bash
git add .
git commit -m "Update: [describe cambios]"
git push             # Trigger pipeline automático
```

👉 Ver: [docs/BUILD.md](docs/BUILD.md) y [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

### GitHub Pages

Tras configurar **Settings → Pages → Source: GitHub Actions**, cada push a `main` despliega el sitio. Guía paso a paso: [docs/GITHUB-PAGES.md](docs/GITHUB-PAGES.md).

---

## 🎨 Contenido

### Pantallas (visión general)

| Bloque | Tema | Editable |
|--------|------|----------|
| 1–7 | Portada, cultura, bienestar, propósito, OKR, KPIs | `content/contenido_sitio.md` |
| 8–13 | Visión AI First y capas RUN / CHANGE / GROW, resumen, gobernanza | `content/contenido_sitio.md` |
| 14–17 | Líneas de conocimiento (BI Generativo, Growth, datos, ciencia) | `content/contenido_sitio.md` |
| 18 | Diagrama interactivo | `content/diagrama_textos.md` + plantilla |

Enlaces directos por sección: ver tabla **Anclas en la URL** en [docs/BUILD.md](docs/BUILD.md).

### [Contenido Editable](content/)

- [`contenido_sitio.md`](content/contenido_sitio.md) — Textos por sección `## Pantalla 1` … `## Pantalla 18`
- [`diagrama_textos.md`](content/diagrama_textos.md) — Textos de la UI del diagrama (panel 18: toolbar, leyenda, modales, etc.)

---

## 🔄 Flujo de Trabajo

```
Equipo edita Markdown
       ↓
Commit en Git
       ↓
Azure Pipeline dispara
       ↓
npm run build (genera HTML)
       ↓
Valida y deploy
       ↓
Web actualizado ✨ (2-3 min)
```

---

## 📚 Documentación

| Documento | Para quién | Para qué |
|-----------|------------|----------|
| [docs/README.md](docs/README.md) | Todos | Índice de guías dentro de `/docs` |
| [QUICK-START.md](docs/QUICK-START.md) | Equipo | Editar contenido sin tocar código |
| [BUILD.md](docs/BUILD.md) | Developers | Build, Markdown, anclas `#pantalla-N` |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Tech | Arquitectura y decisiones |

---

## 🛠️ Stack Técnico

- **Frontend:** HTML5 + Tailwind CSS + Vanilla JavaScript
- **Build:** Node.js (build script)
- **Contenido:** Markdown (editable)
- **Versionado:** Git
- **CI/CD:** Azure DevOps Pipeline
- **Deploy:** Azure Storage Static Website

---

## 📊 Estado Actual

| Componente | Status |
|-----------|--------|
| Pantallas 1–7 | ✅ Completo |
| Visión AI First y capas (8–13) | ✅ Completo |
| Líneas de conocimiento (14–17) | ✅ Completo |
| Diagrama (18) | ✅ Interactivo |
| Build automático | ✅ Funcional |
| Documentación | ✅ Completa |
| Reorganización | ✅ Completada |

---

## 📞 Contacto & Soporte

- **Preguntas sobre contenido:** Equipo Marketing/Product
- **Preguntas técnicas:** Equipo Development
- **Deploy issues:** DevOps/Cloud Team

---

## 📝 Notas

- Todos los cambios se registran en Git
- El contenido es editable sin tocar código
- Build y deploy son automáticos
- La estructura es fácil de escalar

---

**Última actualización:** 2026-03-20  
**Versión:** 2.0 (Reorganización completada)
