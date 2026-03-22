# 📋 Guía Rápida: Editar Contenido

## 🎯 TL;DR

**Tu equipo edita Markdown → Build automático → Web actualizado**

---

## ¿Qué editar?

La presentación tiene **18 paneles horizontales** (orden fijo en la web). Cada uno corresponde a `## Pantalla N · …` en Markdown **salvo que se indique otra fuente**.

### `content/contenido_sitio.md` — Pantallas **1–18** (por sección)

| N | En la web (título del panel) | Notas |
|---|------------------------------|--------|
| 1 | Inicio | Plantilla |
| 2 | Cultura (bloque grande) | Plantilla |
| 3 | Propósito / Cultura (según **Título** en MD) | Parche `p3`; título desde MD |
| 4 | Bienestar | Plantilla |
| 5 | A qué apuntamos | Plantilla |
| 6 | OKR | Plantilla |
| 7 | Objetivos y KPI's | Plantilla |
| 8 | Visión AI First | HTML generado (`build-html.js`) |
| 9 | Marketing Analytic (RUN) | Idem |
| 10 | Analytics Hub (CHANGE) | Idem |
| 11 | Evolución (GROW) | Idem |
| 12 | Resumen 3 Capas | Idem |
| 13 | Gobernanza de IA | Idem |
| 14 | BI Generativo | Plantilla + inserts desde MD |
| 15 | Growth | Idem |
| 16 | Ingeniería de datos | Idem |
| 17 | Ciencia de datos | Idem |
| 18 | Diagrama | Estructura en plantilla; **textos del diagrama** en `diagrama_textos.md` |

### `content/diagrama_textos.md` — **Pantalla 18 (diagrama interactivo)**

Títulos de cabecera, pilar, toolbar, leyenda, marca de agua, ayuda, botón “Flujo cíclico”, etc. (parches `diag_*` en el build). No sustituye la sección `## Pantalla 18` de `contenido_sitio.md` si usás ese bloque para contexto narrativo.

**Anclas para compartir enlaces:** `#pantalla-1` … `#pantalla-18`; el alias `#diagramPanel` equivale a `#pantalla-18`. Tabla ancla ↔ título en [BUILD.md](BUILD.md) (sección *Anclas en la URL*).

---

## ✏️ Cómo Editar (Más Fácil)

### Opción 1: GitHub Web (RECOMENDADO)

1. Abrí GitHub → Tu repo
2. Clickeá el archivo `content/contenido_sitio.md`
3. Clickeá ✏️ (Edit this file)
4. Hacé tus cambios
5. Scroll abajo → "Commit changes"
6. Escribí un mensaje: ej. "Actualizar OKR"
7. Clickeá "Commit changes"
8. ✨ **Listo!** En 2-3 min estará en vivo

### Opción 2: VS Code Local

```bash
# 1. Cloná el repo
git clone <tu-repo>

# 2. Abrí la carpeta en VS Code
code "IA First"

# 3. Edita los .md:
# content/contenido_sitio.md
# content/diagrama_textos.md

# 4. Sync:
git add .
git commit -m "Actualizar: [qué cambió]"
git push
```

---

## 🔍 Estructura Markdown

### Pantalla de contenido:

```markdown
## Pantalla 6 · OKR

- **Título:** OKR
- **Mensaje principal:**
  Texto largooooo...
```

### Lista con bullets:

```markdown
- Punto 1
- Punto 2
- Punto 3
```

### Lista numerada:

```markdown
1. Primer item
2. Segundo item
3. Tercer item
```

### Emphasis:

```markdown
**bold**
*italic*
```

---

## 📅 Estado del Deploy

Después de hacer Commit:

| Minuto | Qué pasa |
|--------|----------|
| 0 | Commiteas en GitHub |
| 0-1 | Pipeline inicia |
| 1-2 | Build (genera HTML) |
| 2-3 | Deploy a Azure |
| 3+ | ✨ Web actualizado |

**Puedes ver el progreso:** GitHub → Actions (tab)

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si me equivoco?**
→ Git guarda historial. Tu admin puede revertir.

**P: ¿Puedo editar el index.html directamente?**
→ NO. Se sobrescribe en cada build.

**P: ¿Cómo veo preview antes de publicar?**
→ Edita en rama nueva (`git checkout -b fix/...`), haz PR, preview sale automático.

**P: ¿Qué pasa si el HTML se "rompe"?**
→ El script valida. Si hay error, pipeline falla → nadie ve cambios rotos.

---

## 🚀 Ejemplo: Cambiar OKR

### Antes:
```
Contribuir activamente a que las estrategias de mercadeo 
y CX impulsen los objetivos de negocio...
```

### Quiero cambiar a:
```
Garantizar que cada decisión de mercadeo esté soportada 
por datos confiables y análisis profundo...
```

### Pasos:

1. Abrí `content/contenido_sitio.md`
2. Busca sección `## Pantalla 6 · OKR`
3. Encuentra línea:
   ```markdown
   - **Mensaje principal:**
   ```
4. Reemplázala con tu nuevo texto
5. Commit → Push
6. ¡Listo!

---

## 📞 Ayuda

Si algo no funciona:
- Revisá las URLs en `BUILD.md`
- Preguntá a tu admin técnico
- Descargá los logs del pipeline en Azure DevOps

---

**Última actualización:** 2026-03-20
