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
│   ├── contenido_sitio.md          ✏️  Pantallas 1-16 (editable)
│   └── diagrama_textos.md          ✏️  Pantalla 17 (editable)
│
├── 📂 docs/                        ← DOCUMENTACIÓN
│   ├── README.md                   📖 Guía general
│   ├── QUICK-START.md              📖 Para tu equipo (no-devs)
│   ├── BUILD.md                    📖 Proceso de build
│   ├── ARCHITECTURE.md             📖 Arquitectura técnica
│   ├── CONSOLIDATION.md            📖 Integración AI First
│   └── PROJECT-STATUS.md           📖 Estado del proyecto
│
├── 📂 src/                         ← CÓDIGO FUENTE
│   ├── index.html                  🌐 Aplicación principal (generada)
│   ├── index.template.html         🖼️  Template base
│   └── build-html.js               ⚙️  Script de build
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
content/contenido_sitio.md       # Pantallas 1-16
content/diagrama_textos.md       # Pantalla 17 (diagrama)

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

---

## 🎨 Contenido

### Pantallas Principales (1-16)

| # | Pantalla | Carpeta | Editable |
|---|----------|---------|----------|
| 1-7 | Contexto & Cultura | `content/` | ✏️ Markdown |
| 8-12 | **Visión AI First** | `content/` | ✏️ Markdown |
| 13-16 | Líneas de Conocimiento | `content/` | ✏️ Markdown |
| 17 | Diagrama Interactivo | `content/` | ✏️ Markdown |

### Líneas de Conocimiento

- **13:** BI Generativo
- **14:** Growth  
- **15:** Ingeniería de Datos
- **16:** Ciencia de Datos

### [Contenido Editable](content/)

- [`contenido_sitio.md`](content/contenido_sitio.md) — Texto de todas las pantallas
- [`diagrama_textos.md`](content/diagrama_textos.md) — Detalles del diagrama

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

| Documento | Para Quién | Por Qué |
|-----------|-----------|--------|
| [QUICK-START.md](docs/QUICK-START.md) | Equipo completo | Cómo editar contenido |
| [BUILD.md](docs/BUILD.md) | Developers | Proceso de build |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Tech Lead | Decisiones técnicas |
| [CONSOLIDATION.md](docs/CONSOLIDATION.md) | Context | Cómo se integró AI First |
| [PROJECT-STATUS.md](docs/PROJECT-STATUS.md) | Manager | Estado actual |

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
| Pantallas 1-7 | ✅ Completo |
| Visión AI First (8-12) | ✅ Completo |
| Líneas de Conocimiento (13-16) | ✅ Completo |
| Diagrama (17) | ✅ Interactivo |
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
