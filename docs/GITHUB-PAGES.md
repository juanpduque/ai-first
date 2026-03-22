# Publicar en GitHub Pages

El repo incluye un workflow que **genera `src/index.html` con `npm run build`** y sube solo los archivos estáticos (`index.html`, `css/`, `flujo_ciclico.html`).

## Una sola vez en GitHub

1. Abrí el repositorio en GitHub.
2. **Settings** → **Pages** (menú izquierdo).
3. En **Build and deployment** → **Source**, elegí **GitHub Actions** (no “Deploy from a branch”).
4. Guardá si hace falta.

## Cada deploy

- Cada **push a `main`** dispara el workflow **Deploy GitHub Pages** (`.github/workflows/github-pages.yml`).
- También podés ejecutarlo a mano: pestaña **Actions** → workflow → **Run workflow**.

Cuando termine correctamente, la URL aparece en:

- **Settings → Pages** (sitio publicado), y  
- En el job, en **deploy → Summary** (`page_url`).

## URL típica

- Repo `https://github.com/USUARIO/REPO` → sitio **`https://USUARIO.github.io/REPO/`**  
- Los enlaces relativos (`css/styles.css`, `flujo_ciclico.html`) funcionan con esa base.

## Si el workflow falla

- Revisá **Actions** → último run → logs.
- Comprobá localmente: `npm run build` sin errores.
- Hace falta permiso **Pages: Write** para el workflow (ya definido en el YAML con `permissions`).

---

**Última actualización:** 2026-03-20
