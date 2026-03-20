# 📊 Arquitectura de Build Automático

## Flujo Implementado

```
┌────────────────────────────────────────────────────────────────┐
│                     TEAM (No-Developers)                        │
│                                                                  │
│  Edita en GitHub Web UI:                                        │
│  - contenido_sitio.md  (Pantallas 1-11)                        │
│  - diagrama_textos.md  (Pantalla 12)                           │
└────────────────────┬─────────────────────────────────────────▲──┘
                     │ Commit & Push                           / 
                     ↓                                        /
        ┌────────────────────────────────┐         ✅ Vista previa
        │   GitHub (Your Repository)     │         en tiempo real
        └────────┬───────────────────────┘
                 │ Webhook
                 ↓
        ┌────────────────────────────────┐
        │   Azure DevOps Pipeline        │
        │                                │
        │  1. Checkout code              │
        │  2. npm install                │
        │  3. npm run build              │◄─── build-html.js
        │     ├─ Lee Markdown            │     genera HTML
        │     ├─ Parsea secciones        │     desde Markdown
        │     └─ Crea index.html         │
        │  4. Valida HTML                │
        │  5. Deploy → Azure Storage     │
        └────────┬───────────────────────┘
                 │
                 ↓
        ┌────────────────────────────────┐
        │   Azure Storage Static Web     │
        │   IA First Presentation        │
        │   🌐 live.example.com          │
        └────────────────────────────────┘
```

## Archivos en Repositorio

### 📝 Editable por Team (Commiteados a Git)

```
✅ contenido_sitio.md      - Pantallas 1-11 (Editable)
✅ diagrama_textos.md      - Pantalla 12 (Editable)
✅ index.html              - HTML generado (Generado por build)
✅ azure-pipelines.yml     - Pipeline CI/CD (Configuración)
✅ package.json            - Scripts npm (Configuración)
✅ build-html.js           - Script de build (Código)
✅ BUILD.md                - Documentación técnica
✅ QUICK-START.md          - Guía para equipo
✅ .gitignore              - Qué ignorar
```

### 🚫 No Editable (Sistema)

```
ℹ️  index.template.html     - Template (generado por copia)
⚠️  build-data.json         - Debug data (no commitear normalmente)
```

---

## Ventajas de Esta Arquitectura

| Aspecto | Beneficio |
|---------|-----------|
| **Revisión** | Todos los cambios en Git → historial completo |
| **Auditoria** | Cada commit muestra qué cambió y quién |
| **Rollback** | Si algo falla, revertir con `git revert` |
| **Team** | No-developers editan Markdown sin tocar HTML |
| **CI/CD** | Build automático en cada push |
| **Deploy** | Automático a Azure Storage en 2-3 min |
| **Preview** | GitHub permite PR previews antes de publicar |

---

## Casos de Uso

### Caso 1: Marketing cambia OKR

```
1. Team: Abre contenido_sitio.md en GitHub Web
2. Team: Edita Pantalla 6 · OKR
3. Team: Commit changes
4. ✨ Pipeline ejecuta automáticamente
5. ✨ Web se actualiza en 2-3 minutos
6. ✨ Git muestra historial de cambios
```

### Caso 2: Dev agrega nueva pantalla

```
1. Dev: Crea rama: git checkout -b feature/new-screen
2. Dev: Agrega ## Pantalla 13 a contenido_sitio.md
3. Dev: Edita index.templates.html para agregar la pantalla
4. Dev: npm run build (valida localmente)
5. Dev: Push + crea Pull Request
6. ✨ CI ejecuta build, muestra resultados
7. Team Review + Approve PR
8. Dev: Merge a main
9. ✨ Pipeline despliega automáticamente
```

### Caso 3: Revisar cambios antes de publicar

```
1. Team: Edita contenido_sitio.md
2. Team: Crea rama vez de commitear a main
3. ✨ GitHub crea URL preview automática
4. Team: Comparte URL para review
5. Team: Cuando aprueben → merge + deploy
```

---

## Próxima Fase: Automatizaciones

Mejoras futuras que se pueden agregar:

- [ ] Validación automática de Markdown schema
- [ ] Linter para contenido (ortografía, límite de caracteres)
- [ ] Generación automática de TOC (Table of Contents)
- [ ] Comparación antes/después en PRs
- [ ] Notificaciones en Slack cuando deploya
- [ ] Analytics: qué secciones mira más la gente
- [ ] Versioning: guardar snapshots de contenido

---

## Archivos de Referencia

- [BUILD.md](BUILD.md) - Documentación técnica completa
- [QUICK-START.md](QUICK-START.md) - Guía para el equipo
- [contenido_sitio.md](contenido_sitio.md) - Pantallas editables
- [diagrama_textos.md](diagrama_textos.md) - Diagrama editable
- [package.json](package.json) - Scripts disponibles

---

## Comandos Disponibles Para Devs

```bash
# Build local
npm run build

# Validar build + tamaño de output
npm run validate

# Ver qué cambió
npm run sync

# Instalar dependencias
npm install

# Limpieza local
rm -f build-data.json  # Elimina datos debug
```

---

**Implementado:** 2026-03-20  
**Status:** ✅ MVP Funcional  
**Team Ready:** ✅ Sí
