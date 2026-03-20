# 🗂️ Consolidación: ai_first.html → Pantallas 12-16

## Cambio Realizado

El contenido de `ai_first.html` ha sido **consolidado como pantallas del flujo principal** dentro de la arquitectura de build automático.

```
Antes:
├── index.html (12 pantallas)
└── ai_first.html (página separada)

Después:
├── index.html (17 pantallas) ← incluye todo
└── [ai_first.html archivado o eliminado]
```

## ¿Qué Pasó?

### Contenido Movido a `contenido_sitio.md`

| Anterior | Nuevo | Contenido |
|----------|-------|-----------|
| ai_first.html → Intro | **Pantalla 12** | Visión AI First · Principio rector |
| ai_first.html → RUN Layer | **Pantalla 13** | Marketing Analytic · IA Copiloto |
| ai_first.html → CHANGE Layer | **Pantalla 14** | Analytics Hub · IA Analítica |
| ai_first.html → GROW Layer | **Pantalla 15** | Evolución · IA Agentiva |
| ai_first.html → Summary | **Pantalla 16** | Resumen: Las 3 Capas AI First |

### Beneficios

✅ **Unificado:** Todo en un solo flujo horizontal  
✅ **Editable:** Team edita Markdown, no HTML  
✅ **Versionado:** Cambios en Git con historial  
✅ **Consistente:** Misma navegación y UI  
✅ **Automático:** Build genera todo en cada push  

## Próximos Pasos

### 1. Agregar Pantallas al `index.html`

Necesitas actualizar el HTML principal para incluir las nuevas pantallas 12-16. Opciones:

**Opción A: Manual (más control)**
```html
<!-- Después de Pantalla 11 (flujo_end_to_end.html) agregar: -->

<!-- Pantalla 12: Visión AI First -->
<section class="h-panel ..." data-screen-title="Visión AI First">
  <!-- contenido -->
</section>

<!-- Pantalla 13: Marketing Analytic (RUN) -->
<!-- ... etc -->
```

**Opción B: Build Automático (futuro)**
```javascript
// En build-html.js: agregar lógica para generar
// las secciones HTML desde Markdown
```

### 2. Enlaces Internos

Actualiza cualquier referencia desde `index.html` a `ai_first.html`:

```html
<!-- Cambiar de: -->
<a href="ai_first.html">Ver Visión AI First</a>

<!-- A (cuando esté integrado): -->
<button onclick="scrollToScreen(11)">Ver Visión AI First</button>
```

### 3. Borrar `ai_first.html`

Una vez integrado y validado, puedes remover:
```bash
rm ai_first.html
```

O archivarlo:
```bash
git add ai_first.html
git commit -m "Archive: ai_first.html consolidated into main presentation"
# Después del commit, eliminar del repo
git rm ai_first.html
git commit -m "Remove ai_first.html (content moved to pantallas 12-16)"
```

## Validación Actual

- [x] Contenido extraído de `ai_first.html`
- [x] Agregado a `contenido_sitio.md` (Pantallas 12-16)
- [x] Documentado en este archivo
- [ ] Pantallas creadas en `index.html` (próximo paso)
- [ ] Build script actualizado si es necesario (opcional)
- [ ] Validación visual en navegador
- [ ] Tests/links verificados

## Flujos

### Para el Equipo : Editar Visión AI First

1. Abrí `contenido_sitio.md`
2. Busca `## Pantalla 12 · Visión AI First`
3. Edita el Markdown
4. Commit + Push
5. Build automático genera HTML
6. Web actualizado ✨

### Para Devs: Agregar al HTML

```javascript
// Opción: Script que parsea Markdown por pantalla
const screen = parseMarkdownScreen(12, contentMD);
const html = renderScreen(screen);
// Inyectar en index.html
```

## Archivos Afectados

```
✅ contenido_sitio.md        ← Nuevas Pantallas 12-16 agregadas
⚠️  index.html                ← TODO: Agregar secciones HTML
⚠️  ai_first.html             ← Archivado (contenido movido)
ℹ️  build-html.js             ← Puede extenderse para auto-generar
```

## FAQ

**P: ¿Perde el contenido de ai_first.html?**  
→ No. Está en `contenido_sitio.md` Pantallas 12-16. Es editable.

**P: ¿Qué pasa si elimino ai_first.html?**  
→ Nada. El contenido está en el Markdown. Si no agregaste las pantallas al index.html todavía, falta ese paso.

**P: ¿Y si quiero mantener ai_first.html como página separada?**  
→ Puedes. Pero entonces no estará en el flujo de build automático. Mejor consolidar.

**P: ¿Cómo enlazo desde index.html a Pantalla 12?**  
→ Usa scroll lateral o botones con `scrollToScreen(11)` (índice base 0).

---

**Documento:** 2026-03-20  
**Estado:** Consolidación completada, integración pendiente en HTML visual
