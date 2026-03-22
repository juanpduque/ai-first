# Arquitectura de build automático

## Flujo implementado

```
┌────────────────────────────────────────────────────────────────┐
│                     Equipo (contenido)                          │
│                                                                 │
│  Edita en GitHub / editor local:                               │
│  · content/contenido_sitio.md   → Pantallas 1–18 (por sección) │
│  · content/diagrama_textos.md   → Textos UI del diagrama (18)  │
└────────────────────────────┬───────────────────────────────────┘
                             │ Commit y push
                             ↓
        ┌────────────────────────────────┐
        │   Repositorio (GitHub, etc.)   │
        └────────┬───────────────────────┘
                 │ Pipeline (p. ej. Azure DevOps)
                 ↓
        ┌────────────────────────────────┐
        │  1. Checkout                   │
        │  2. npm install (si aplica)    │
        │  3. npm run build              │──► node src/build-html.js
        │     · Lee Markdown             │     · Escribe src/index.html
        │     · Aplica src/index.template.html
        │  4. Validación / deploy       │
        └────────┬───────────────────────┘
                 ↓
        ┌────────────────────────────────┐
        │  Sitio estático (Azure Storage,  │
        │  GitHub Pages, servidor propio)  │
        └────────────────────────────────┘
```

**Salida del build:** `src/index.html` (no editar a mano; regenerar con `npm run build`).

---

## Mapa de pantallas (18 paneles)

Orden en el scroll horizontal = orden en la experiencia. Referencia única de anclas y títulos en UI: [BUILD.md — Anclas en la URL](BUILD.md#anclas-en-la-url-deep-links).

| Paneles | Origen técnico |
|---------|----------------|
| 1–7, 14–17 | `src/index.template.html` + parches / inserts desde Markdown |
| 8–13 | Bloques generados en `src/build-html.js` desde `## Pantalla 8` … `## Pantalla 13` |
| 18 (diagrama) | Estructura en plantilla; copy del diagrama desde `diagrama_textos.md` |

---

## Archivos en el repositorio

### Editables por el equipo (contenido)

| Archivo | Uso |
|---------|-----|
| `content/contenido_sitio.md` | Secciones `## Pantalla N · …` para textos de slides 1–18 |
| `content/diagrama_textos.md` | Textos del diagrama interactivo (pantalla 18) |

### Código y plantilla (desarrollo)

| Archivo | Uso |
|---------|-----|
| `src/index.template.html` | HTML base, marcadores `MD_PATCH` / `MD_INSERT` |
| `src/build-html.js` | Genera `src/index.html` |
| `src/css/styles.css` | Estilos propios (scroll horizontal, nav, diagrama) |
| `package.json` | Scripts `build`, `validate`, `serve` |

### Generado / CI

| Archivo | Uso |
|---------|-----|
| `src/index.html` | **Generado** — commit tras build si el flujo lo requiere |
| `azure-pipelines.yml` | Pipeline de build y deploy (si aplica) |

### No editar como “fuente”

- `src/index.html` sin pasar por el build (se pisa).
- Rutas y nombres de `MD_PATCH` sin coordinación con `build-html.js`.

---

## Ventajas de esta arquitectura

| Aspecto | Beneficio |
|---------|-----------|
| Revisión | Cambios en Git con historial |
| Contenido | Perfiles no dev editan Markdown |
| Build | Un comando reproduce el HTML |
| Deploy | Pipeline puede validar antes de publicar |

---

## Casos de uso

### Caso 1: marketing cambia el OKR

1. Abrir `content/contenido_sitio.md` → sección `## Pantalla 6 · OKR`.
2. Editar el texto, commit y push.
3. El pipeline ejecuta `npm run build` y despliega.

### Caso 2: cambiar textos del diagrama

1. Abrir `content/diagrama_textos.md`.
2. Editar las secciones que alimentan `diag_*` (ver [BUILD.md](BUILD.md)).
3. `npm run build` y commit de `src/index.html` según el flujo del equipo.

### Caso 3: nueva pantalla o cambio estructural

Requiere desarrollo: nueva columna en el scroll implica cambios en `index.template.html` y/o `build-html.js`, IDs `pantalla-N`, navegación y documentación. No basta con añadir un `## Pantalla 19` en Markdown sin soporte en código.

### Caso 4: revisar antes de publicar

Rama + PR: el mismo build local (`npm run build`) valida que el Markdown y la plantilla producen HTML coherente.

---

## Próximas mejoras posibles

- Validación de esquema Markdown (campos obligatorios por pantalla).
- Tests del build (asserts sobre fragmentos de `src/index.html`).
- Preview en PR (entorno estático).

---

## Referencias

- [BUILD.md](BUILD.md) — Marcadores, anclas `#pantalla-1`…`#pantalla-18`, comandos.
- [QUICK-START.md](QUICK-START.md) — Guía corta para editores de contenido.
- [README.md](../README.md) — Vista general del repo.

---

**Última actualización:** 2026-03-20
