# 📋 Guía Rápida: Editar Contenido

## 🎯 TL;DR

**Tu equipo edita Markdown → Build automático → Web actualizado**

---

## ¿Qué Editar?

### 📄 Pantallas (1-17): `contenido_sitio.md`
- Pantallas 1-11: Inicio, Cultura, Propósito, OKR, KPI's, Líneas de IA First
- **Pantalla 12: Visión AI First** (consolidado desde `ai_first.html`)
- **Pantalla 13-15: Marketing Analytic, Analytics Hub, Evolución** (3 capas AI First)
- **Pantalla 16: Resumen de 3 capas**
- Pantalla 17: Diagrama interactivo

### 📊 Diagrama (Pantalla 17): `diagrama_textos.md`
- Capacidades
- Roles
- Artefactos
- Descripciones de modales

---

## ✏️ Cómo Editar (Más Fácil)

### Opción 1: GitHub Web (RECOMENDADO)

1. Abrí GitHub → Tu repo
2. Clickeá el archivo `contenido_sitio.md`
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
# contenido_sitio.md
# diagrama_textos.md

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

1. Abrí `contenido_sitio.md`
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
