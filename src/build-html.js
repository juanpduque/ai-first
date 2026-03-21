#!/usr/bin/env node

/**
 * Genera src/index.html desde content/*.md + src/index.template.html
 *
 * Marcadores en el template:
 *   <!--MD_PATCH id="clave"-->contenido por defecto<!--/MD_PATCH-->
 *   <!--MD_INSERT id="clave"--><!--/MD_INSERT-->  (bloque generado íntegro)
 */

const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'index.template.html');
const contentMdPath = path.join(__dirname, '../content/contenido_sitio.md');
const diagramaMdPath = path.join(__dirname, '../content/diagrama_textos.md');
const outputPath = path.join(__dirname, 'index.html');
const buildMetadataPath = path.join(__dirname, '../build/build-data.json');

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Convierte **negrita** y *cursiva* a HTML (sin anidar HTML arbitrario). */
function mdInlineToHtml(s) {
  if (!s) return '';
  let t = escapeHtml(s.trim());
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return t;
}

function extractValue(text, key) {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const bullet = new RegExp(`-\\s+\\*\\*${esc}:\\*\\*\\s*(.+?)(?=\\n-\\s+\\*\\*|\\n###|\\n##|$)`, 'is');
  const mb = text.match(bullet);
  if (mb) return mb[1].trim().replace(/\s+/g, ' ');
  const plain = new RegExp(`^\\*\\*${esc}:\\*\\*\\s*(.+?)(?=\\n\\n|\\n[^\\s*]|$)`, 'ims');
  const mp = text.match(plain);
  return mp ? mp[1].trim().replace(/\s+/g, ' ') : '';
}

/** Valor de una sola línea tras `- **clave:**` (evita absorber listas siguientes sin `**`). */
function extractBulletLineValue(text, key) {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = text.match(new RegExp(`^\\s*-\\s*\\*\\*${esc}:\\*\\*\\s*(.+)$`, 'im'));
  return m ? m[1].trim() : '';
}

function extractMultilineValue(text, key) {
  const re = new RegExp(
    `-\\s+\\*\\*${key}:\\*\\*\\s*\\n?([\\s\\S]*?)(?=\\n-\\s+\\*\\*|\\n###|\\n##|$)`,
    'i'
  );
  const m = text.match(re);
  if (!m) return '';
  return m[1].trim().split(/\n/).map((l) => l.trim()).filter(Boolean).join(' ');
}

/** ## Pantalla N · … → { n: body } */
function parsePantallas(markdown) {
  const pantallas = {};
  const regex = /## Pantalla (\d+)[\s·]*[^\n]*\n([\s\S]*?)(?=\n## Pantalla |\Z)/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    pantallas[parseInt(match[1], 10)] = match[2].trim();
  }
  return pantallas;
}

/** Secciones ### al inicio de línea (incl. primera línea del bloque). */
function splitMarkdownH3(block) {
  return block
    .trim()
    .split(/(?:^|\n)### /)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const nl = s.indexOf('\n');
      const title = nl === -1 ? s.trim() : s.slice(0, nl).trim();
      const body = nl === -1 ? '' : s.slice(nl + 1).trim();
      return { title, body };
    });
}

function formatTitleH1(title) {
  const t = title.trim();
  const idx = t.toLowerCase().indexOf('ia first');
  if (idx >= 0) {
    const before = t.slice(0, idx).replace(/\s+$/, '');
    const after = t.slice(idx + 'ia first'.length).replace(/^\s+/, '');
    const ia = t.slice(idx, idx + 'ia first'.length).replace(/ia first/i, (m) =>
      m.replace(/^ia/i, 'IA')
    );
    const line1 =
      (before ? escapeHtml(before) + '&nbsp;' : '') +
      `<span class="text-primary">${escapeHtml(ia).replace(/ /g, '&nbsp;')}</span>`;
    const line2 = after ? `<br>${escapeHtml(after).replace(/ /g, '&nbsp;')}` : '';
    return line1 + line2;
  }
  return escapeHtml(t).replace(/ /g, '&nbsp;');
}

function splitPurposeTitle(t) {
  const words = t.trim().split(/\s+/);
  if (words.length <= 3) return escapeHtml(t);
  const mid = Math.ceil(words.length / 2);
  return `${escapeHtml(words.slice(0, mid).join(' '))}<br>${escapeHtml(words.slice(mid).join(' '))}`;
}

function parseKpiColumns(p7) {
  const cols = [];
  const secRe = /###\s*([^\n]+)\n([\s\S]*?)(?=###\s|$)/g;
  let m;
  while ((m = secRe.exec(p7)) !== null) {
    const name = m[1].trim();
    const body = m[2];
    const kpis = [];
    const liRe = /-\s*KPI\s*\d+:\s*(.+)/gi;
    let k;
    while ((k = liRe.exec(body)) !== null) kpis.push(k[1].trim());
    cols.push({ name, kpis });
  }
  return cols;
}

function parsePrincipios(block) {
  const items = [];
  const chunks = block.trim().split(/\n(?=\d+\.\s+\*\*)/);
  for (const ch of chunks) {
    const m = ch.match(/^(\d+)\.\s+\*\*([^*]+)\*\*\s*\n?([\s\S]*)/);
    if (!m) continue;
    const subs = m[3]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('-'))
      .map((l) => l.replace(/^-\s+/, '').trim());
    items.push({ title: m[2].trim(), subs });
  }
  return items;
}

const ICONS_P8 = ['chat', 'bolt', 'psychology', 'hub'];
const SHORT_P8 = [
  'Lenguaje natural como interfaz',
  'Automatización de análisis',
  'Decisión, contexto, criterio',
  'Integración operativa',
];

function buildPantalla8(p) {
  const sections = splitMarkdownH3(p);
  const sobre = sections.find((s) => s.title.includes('Sobre AI First')) || sections[0] || { title: '', body: '' };
  const principiosSection = sections.find((s) => s.title.includes('Principios')) || { title: '', body: '' };
  const sobreBody = sobre.body || '';
  const etiqueta = extractValue(sobreBody, 'Etiqueta') || 'PRINCIPIO RECTOR';
  let introRaw = sobreBody.replace(/\*\*Etiqueta:\*\*\s*.+\n?/i, '').trim();
  introRaw = introRaw.replace(/^#{1,6}\s*\S[^\n]*\n?/gm, '').trim();
  const introHtml = mdInlineToHtml(introRaw.replace(/\s+/g, ' '));

  let items = parsePrincipios(principiosSection.body || '');
  if (items.length === 0) {
    items = SHORT_P8.map((title, i) => ({ title, subs: [] }));
  }

  const cards = items.slice(0, 4).map((it, i) => {
    const sub = it.subs[0] ? `<p class="text-sm text-slate-600">${mdInlineToHtml(it.subs[0])}</p>` : '';
    return `<div class="bg-white/80 rounded-2xl border border-fuchsia-100 p-5 shadow-sm">
                        <div class="flex gap-3 items-start">
                            <span class="material-symbols-outlined text-fuchsia-600 text-[24px] flex-shrink-0">${ICONS_P8[i] || 'star'}</span>
                            <div>
                                <h3 class="font-black text-slate-900 text-sm mb-2">${escapeHtml(it.title)}</h3>
                                ${sub}
                            </div>
                        </div>
                    </div>`;
  });

  return `<section
            id="pantalla-8"
            class="h-panel bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden px-8 md:px-12 lg:px-16"
            data-screen-title="Visión AI First">
            <div class="max-w-4xl mx-auto h-full flex flex-col justify-center py-16 md:py-20">
                <div class="mb-8">
                    <div class="text-[12px] font-black uppercase tracking-widest text-fuchsia-700 mb-3">${escapeHtml(etiqueta)}</div>
                    <h2 class="font-headline font-black text-slate-900 tracking-tight"
                        style="font-size: clamp(2.1rem, 5vw, 4rem);">AI First</h2>
                    <p class="text-slate-600 text-base md:text-lg mt-4 leading-relaxed max-w-3xl">${introHtml}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    ${cards.join('\n')}
                </div>
            </div>
        </section>`;
}

function parseLayerBlocks(body) {
  const etiquetaLine = body.match(/\*\*Etiqueta:\*\*\s*(.+)/);
  const etiqueta = etiquetaLine ? etiquetaLine[1].trim() : '';
  const rest = body.replace(/\*\*Etiqueta:\*\*\s*.+\n?/, '').trim();
  const sections = splitMarkdownH3(rest);
  const lead = { paragraph: '' };
  const cards = [];

  for (let i = 0; i < sections.length; i++) {
    const { title, body: content } = sections[i];
    if (i === 0) {
      lead.paragraph = `${title}. ${content}`.replace(/\s+/g, ' ').replace(/^\. /, '').trim();
    } else {
      const bullets = content
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('-'))
        .map((l) => l.replace(/^-\s+/, '').trim());
      if (title && bullets.length) cards.push({ title, bullets });
    }
  }

  return { etiqueta, lead, cards };
}

function buildLayerSection(p, theme) {
  const { grad, border, accent, capLabel, dataTitle, h2, panelId } = theme;
  const { etiqueta, lead, cards } = parseLayerBlocks(p);

  const cardHtml = cards
    .map(
      (c) => `
                    <div class="bg-white rounded-2xl border ${border} p-5 shadow-sm">
                        <h3 class="font-black text-slate-900 mb-3 text-sm uppercase tracking-widest ${accent}">${escapeHtml(c.title)}</h3>
                        <ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">
                            ${c.bullets.map((x) => `<li>${mdInlineToHtml(x)}</li>`).join('')}
                        </ul>
                    </div>`
    )
    .join('');

  return `<section id="${escapeHtml(panelId)}" class="h-panel ${grad} relative overflow-hidden px-8 md:px-12 lg:px-16"
            data-screen-title="${escapeHtml(dataTitle)}">
            <div class="max-w-4xl mx-auto h-full flex flex-col justify-center py-16 md:py-20">
                <div class="mb-8">
                    <div class="text-[12px] font-black uppercase tracking-widest ${accent} mb-3">${escapeHtml(etiqueta || capLabel)}</div>
                    <h2 class="font-headline font-black text-slate-900 tracking-tight"
                        style="font-size: clamp(2.1rem, 5vw, 4rem);">${escapeHtml(h2)}</h2>
                    <p class="text-slate-600 text-base md:text-lg mt-4 leading-relaxed max-w-3xl">${mdInlineToHtml(lead.paragraph)}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    ${cardHtml}
                </div>
            </div>
        </section>`;
}

function parseResumenTresCapas(block) {
  const chunks = block
    .trim()
    .split(/(?:^|\n)### /)
    .map((s) => s.trim())
    .filter(Boolean);
  const cols = [];
  for (const ch of chunks) {
    const nl = ch.indexOf('\n');
    const titleLine = nl === -1 ? ch : ch.slice(0, nl);
    const rest = nl === -1 ? '' : ch.slice(nl + 1);
    const strong = rest.match(/\*\*([^*]+)\*\*/);
    const subtitle = strong ? strong[1].trim() : '';
    const after = rest.replace(/\*\*[^*]+\*\*/, '').trim();
    cols.push({ head: titleLine.trim(), subtitle, body: after });
  }
  return cols;
}

function buildPantalla12(block) {
  const cols = parseResumenTresCapas(block);
  const themes = [
    {
      border: 'border-blue-200',
      grad: 'from-blue-50 to-blue-100',
      icon: 'directions_run',
      h: 'text-blue-900',
      sub: 'text-blue-700',
    },
    {
      border: 'border-teal-200',
      grad: 'from-teal-50 to-teal-100',
      icon: 'construction',
      h: 'text-teal-900',
      sub: 'text-teal-700',
    },
    {
      border: 'border-orange-200',
      grad: 'from-orange-50 to-orange-100',
      icon: 'trending_up',
      h: 'text-orange-900',
      sub: 'text-orange-700',
    },
  ];
  const defaultCols = [
    {
      head: 'Marketing Analytic',
      tag: 'RUN',
      subtitle: 'Copiloto operativo',
      body: 'BI Generativo, diagnóstico automático, experimentación asistida y CX signals.',
    },
    {
      head: 'Analytics Hub',
      tag: 'CHANGE',
      subtitle: 'Motor analítico',
      body: 'Ciencia de Datos, Feature Store, Ingeniería Analítica y BI gobernado.',
    },
    {
      head: 'Evolución',
      tag: 'GROW',
      subtitle: 'Sistema autónomo',
      body: 'IA / MLOps, Agentes de IA, Martech inteligente y estándares.',
    },
  ];

  const use = cols.length >= 3 ? cols : defaultCols.map((d, i) => ({ head: `${d.head} (${d.tag})`, subtitle: d.subtitle, body: d.body }));

  const cards = use.slice(0, 3).map((col, i) => {
    const th = themes[i];
    const headParts = col.head.replace(/\s*\((Run|CHANGE|Grow)\)\s*$/i, '').trim();
    const tagMatch = col.head.match(/\((Run|CHANGE|Grow)\)/i);
    const tag = tagMatch ? tagMatch[1].toUpperCase() : ['RUN', 'CHANGE', 'GROW'][i];
    return `<div class="rounded-2xl border-2 ${th.border} bg-gradient-to-br ${th.grad} p-8 shadow-md">
                        <div class="flex items-start gap-3 mb-4">
                            <span class="material-symbols-outlined ${th.sub.replace('text-', 'text-')} text-[32px]">${th.icon}</span>
                            <div>
                                <h3 class="font-headline font-black ${th.h} text-xl tracking-tight">${escapeHtml(headParts)}</h3>
                                <p class="text-[11px] font-black uppercase tracking-widest ${th.sub} mt-1">${tag}</p>
                            </div>
                        </div>
                        <p class="text-sm text-slate-700 leading-relaxed">
                            <strong>${escapeHtml(col.subtitle)}</strong><br />
                            ${mdInlineToHtml(col.body)}
                        </p>
                    </div>`;
  });

  return `<section id="pantalla-12" class="h-panel bg-white relative overflow-hidden px-8 md:px-12 lg:px-16"
            data-screen-title="Resumen 3 Capas">
            <div class="max-w-6xl mx-auto h-full flex flex-col justify-center py-16 md:py-20">
                <div class="mb-12 text-center">
                    <h2 class="font-headline font-black text-slate-900 tracking-tight"
                        style="font-size: clamp(2.1rem, 5vw, 4rem);">Las 3 Capas de AI First</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${cards.join('\n')}
                </div>
            </div>
        </section>`;
}

function parseH3SectionsAsCards(block) {
  const secs = splitMarkdownH3(block);
  const cards = [];
  for (const { title, body } of secs) {
    const bullets = body
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('-') && !l.startsWith('---'))
      .map((l) => l.replace(/^-\s+/, ''));
    const subsections = body.split(/\n#### /);
    let html = '';
    if (subsections.length > 1) {
      html = subsections
        .map((ss, j) => {
          if (j === 0) {
            const bs = ss
              .split('\n')
              .filter((l) => l.trim().startsWith('-'))
              .map((l) => `<li>${mdInlineToHtml(l.replace(/^-\s+/, ''))}</li>`)
              .join('');
            return bs ? `<ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">${bs}</ul>` : '';
          }
          const n = ss.indexOf('\n');
          const st = n === -1 ? ss : ss.slice(0, n);
          const sb = n === -1 ? '' : ss.slice(n + 1);
          const lis = sb
            .split('\n')
            .filter((l) => l.trim().startsWith('-'))
            .map((l) => `<li>${mdInlineToHtml(l.replace(/^-\s+/, ''))}</li>`)
            .join('');
          return `<p class="text-sm font-bold text-slate-800 mt-2">${escapeHtml(st.trim())}</p><ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">${lis}</ul>`;
        })
        .join('');
    } else {
      html = `<ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">${bullets
        .map((b) => `<li>${mdInlineToHtml(b)}</li>`)
        .join('')}</ul>`;
    }
    cards.push({ title, html });
  }
  return cards;
}

function buildPantalla13(block) {
  const h3m = block.match(/(?:^|\n)### /);
  const cut = h3m ? block.indexOf(h3m[0]) : -1;
  const intro = (cut >= 0 ? block.slice(0, cut) : block)
    .trim()
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .join(' ')
    .trim();
  const rest = cut >= 0 ? block.slice(cut) : '';
  const cards = parseH3SectionsAsCards(rest);

  const cardChunks = cards.map(
    (c) => `<div class="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm">
                        <h3 class="font-black text-slate-900 mb-3 text-sm uppercase tracking-widest text-indigo-700">${escapeHtml(c.title)}</h3>
                        ${c.html}
                    </div>`
  );

  return `<section
            id="pantalla-13"
            class="h-panel bg-gradient-to-br from-indigo-50 to-violet-100 relative overflow-hidden px-8 md:px-12 lg:px-16"
            data-screen-title="Gobernanza de IA">
            <div class="max-w-6xl mx-auto h-full flex flex-col justify-center py-16 md:py-20">
                <div class="mb-8 md:mb-10">
                    <div class="text-[12px] font-black uppercase tracking-widest text-indigo-700 mb-3">CAPÍTULO TRANSVERSAL</div>
                    <h2 class="font-headline font-black text-slate-900 tracking-tight"
                        style="font-size: clamp(2.1rem, 5vw, 4rem);">Gobernanza de IA</h2>
                    <p class="text-slate-600 text-base md:text-lg mt-4 leading-relaxed max-w-4xl">${mdInlineToHtml(intro)}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    ${cardChunks.join('\n')}
                </div>
            </div>
        </section>`;
}

/** 1. **Título** … párrafo opcional (soporta líneas en blanco entre ítems). */
function parseNumberedSimple(block) {
  const items = [];
  const chunks = block.trim().split(/\n(?=\d+\.\s+\*\*)/);
  for (const ch of chunks) {
    const m = ch.match(/^(\d+)\.\s+\*\*([\s\S]+?)\*\*\s*\n?([\s\S]*)/);
    if (!m) continue;
    const rest = m[3].trim();
    const body =
      rest
        .split('\n')
        .map((l) => l.trim())
        .find((l) => l && !l.match(/^\d+\.\s+\*\*/)) || '';
    items.push({ n: m[1], title: m[2].replace(/\s+/g, ' ').trim(), body });
  }
  return items;
}

function buildOportunidadesGrid(items, cardClass) {
  return items
    .map(
      (it) => `<div class="${cardClass}">
                        <h3 class="font-black text-slate-900 mb-2">${it.n}. ${escapeHtml(it.title)}</h3>
                        <p class="text-sm text-slate-600">${mdInlineToHtml(it.body)}</p>
                    </div>`
    )
    .join('\n');
}

function parseIngenieriaItems(block) {
  const items = [];
  const chunks = block.trim().split(/\n(?=\d+\.\s+\*\*)/);
  for (const ch of chunks) {
    const m = ch.match(/^(\d+)\.\s+\*\*([\s\S]+?)\*\*\s*\n([\s\S]*)/);
    if (!m) continue;
    const lines = m[3].split('\n').map((l) => l.trim());
    const bullets = lines.filter((l) => l.startsWith('-') && !/^-\s+\*\*Impacto:/i.test(l)).map((l) => l.replace(/^-\s+/, ''));
    const impactLine = lines.find((l) => /^-\s+\*\*Impacto:/i.test(l));
    const impact = impactLine ? impactLine.replace(/^-\s+\*\*Impacto:\*\*\s*/i, '').trim() : '';
    items.push({
      n: m[1],
      title: m[2].replace(/\s+/g, ' ').trim(),
      bullets,
      impact,
    });
  }
  return items;
}

function buildIngenieriaGrid(items) {
  return items
    .map((it) => {
      const ul =
        it.bullets.length > 0
          ? `<ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">${it.bullets
              .map((b) => `<li>${mdInlineToHtml(b)}</li>`)
              .join('')}</ul>`
          : '';
      const imp = it.impact
        ? `<p class="text-xs font-bold text-cyan-800 mt-3">${mdInlineToHtml('Impacto: ' + it.impact)}</p>`
        : '';
      return `<div class="bg-white rounded-2xl border border-cyan-200 p-5 shadow-sm">
                        <h3 class="font-black text-slate-900 mb-2">${it.n}. ${escapeHtml(it.title)}</h3>
                        ${ul}
                        ${imp}
                    </div>`;
    })
    .join('\n');
}

const DEFAULT_P17_CARDS = [
  ['Modelos de propensión y abandono', 'Scoring continuo para priorizar acciones de adquisición, cross-sell y retención.'],
  ['Medición incremental y causal', 'Framework de atribución y experimentación para separar correlación de impacto real.'],
  ['Recomendador de decisiones', 'Sugerencias de palancas de negocio con explicación del porqué y escenario esperado.'],
  ['MLOps operativo', 'Versionado, monitoreo de drift y retraining con criterios de calidad para producción.'],
];

function buildPantalla17(block) {
  const simple = parseNumberedSimple(block);
  const cards =
    simple.length > 0
      ? simple.map((it) => [it.title, it.body])
      : DEFAULT_P17_CARDS;
  return cards
    .map(
      ([t, b]) => `<div class="bg-slate-50 rounded-2xl border border-rose-200 p-5 shadow-sm">
                        <h3 class="font-black text-slate-900 mb-2">${escapeHtml(t)}</h3>
                        <p class="text-sm text-slate-600">${mdInlineToHtml(b)}</p>
                    </div>`
    )
    .join('\n');
}

function buildBlockP8P13(pantallas) {
  const parts = [
    buildPantalla8(pantallas[8] || ''),
    buildLayerSection(pantallas[9] || '', {
      grad: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
      accent: 'text-blue-700',
      capLabel: 'CAPA RUN',
      dataTitle: 'Marketing Analytic (RUN)',
      h2: 'Marketing Analytic',
      panelId: 'pantalla-9',
    }),
    buildLayerSection(pantallas[10] || '', {
      grad: 'bg-gradient-to-br from-teal-50 to-teal-100',
      border: 'border-teal-200',
      accent: 'text-teal-700',
      capLabel: 'CAPA CHANGE',
      dataTitle: 'Analytics Hub (CHANGE)',
      h2: 'Analytics Hub',
      panelId: 'pantalla-10',
    }),
    buildLayerSection(pantallas[11] || '', {
      grad: 'bg-gradient-to-br from-orange-50 to-orange-100',
      border: 'border-orange-200',
      accent: 'text-orange-700',
      capLabel: 'CAPA GROW',
      dataTitle: 'Evolución (GROW)',
      h2: 'Evolución',
      panelId: 'pantalla-11',
    }),
    buildPantalla12(pantallas[12] || ''),
    buildPantalla13(pantallas[13] || ''),
  ];
  return parts.join('\n\n');
}

function applyMdPatches(html, patches) {
  return html.replace(/<!--MD_PATCH id="([^"]+)"-->([\s\S]*?)<!--\/MD_PATCH-->/g, (full, id, inner) => {
    if (Object.prototype.hasOwnProperty.call(patches, id) && patches[id] != null && patches[id] !== '') {
      return String(patches[id]);
    }
    return inner;
  });
}

function applyMdInserts(html, inserts) {
  return html.replace(/<!--MD_INSERT id="([^"]+)"-->([\s\S]*?)<!--\/MD_INSERT-->/g, (full, id, inner) => {
    if (Object.prototype.hasOwnProperty.call(inserts, id) && inserts[id]) {
      return inserts[id];
    }
    return inner;
  });
}

function extractContextoP16(block) {
  const m = block.match(/\*\*Contexto:\*\*\s*\n?([\s\S]*?)(?=\n\d+\.\s+\*\*)/i);
  return m ? m[1].trim().replace(/\s+/g, ' ') : '';
}

function extractIndentedListAfter(block, key) {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`-\\s*\\*\\*${esc}:\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n-\\s*\\*\\*|\\n##|$)`, 'i');
  const m = block.match(re);
  if (!m) return [];
  return m[1]
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^-\s+/.test(l))
    .map((l) => l.replace(/^-\s+/, '').trim());
}

function splitNivelTab(line) {
  const parts = line.split(/\s*·\s*/).map((s) => s.trim());
  if (parts.length >= 2) {
    return { prefix: parts[0], rest: parts.slice(1).join(' · ') };
  }
  return { prefix: line.trim(), rest: '' };
}

function buildToolbarButtonInner(line, iconName) {
  const { prefix, rest } = splitNivelTab(line);
  return `                                    <span class="material-symbols-outlined text-[14px] sm:text-[16px]">${iconName}</span>
                                    <span class="hidden xs:inline">${escapeHtml(prefix)} &middot;</span>
                                    ${escapeHtml(rest)}`;
}

function parseLegendRows(block) {
  const rows = [];
  for (const line of block.split('\n')) {
    const t = line.trim();
    if (!/^-\s+/.test(t) || /\*\*Encabezado:\*\*/i.test(t)) continue;
    const content = t.replace(/^-\s+/, '').trim();
    const m = content.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (m) rows.push({ label: m[1].trim(), emoji: m[2].trim() });
  }
  return rows;
}

function buildLegendRowsHtml(rows) {
  return rows
    .map(
      (r) =>
        `            <div class="flex items-center gap-3"><span class="text-lg">${r.emoji}</span> ${escapeHtml(r.label)}</div>`
    )
    .join('\n');
}

function parseDiagrama(md) {
  const encStart = md.indexOf('## Encabezado');
  const pilStart = md.indexOf('## Pilar transversal');
  const capaStart = md.indexOf('## Capa 1');
  const legStart = md.indexOf('## Leyenda');
  const wmStart = md.indexOf('## Marca de agua');
  const modalStart = md.indexOf('## Textos de modales');

  const encBlock = encStart >= 0 && pilStart > encStart ? md.slice(encStart, pilStart) : '';
  const pilBlock = pilStart >= 0 && capaStart > pilStart ? md.slice(pilStart, capaStart) : '';

  const title = extractValue(encBlock, 'Título') || 'Estrategia CDE';
  const subtitle = extractValue(encBlock, 'Subtítulo') || '';
  let ayuda = extractValue(encBlock, 'Ayuda') || '';
  const mAyuda = encBlock.match(/-\s+\*\*Ayuda:\*\*\s*[“"](.+?)[”"]/i);
  if (mAyuda) ayuda = mAyuda[1];

  const botones = extractIndentedListAfter(encBlock, 'Botones');
  const toolbarLines = extractIndentedListAfter(encBlock, 'Toolbar de niveles');

  const pilarEtiqueta = extractValue(pilBlock, 'Etiqueta') || 'Analytics Translator';
  const pilarSub = extractValue(pilBlock, 'Subetiqueta') || '(Transversal)';

  let legBlock = '';
  if (legStart >= 0) {
    const legEnd = [wmStart, modalStart].filter((x) => x > legStart).sort((a, b) => a - b)[0] || md.length;
    legBlock = md.slice(legStart, legEnd);
  }
  const legendTitle = extractBulletLineValue(legBlock, 'Encabezado') || 'Clasificación';
  let legendRows = parseLegendRows(legBlock);
  if (legendRows.length === 0) {
    legendRows = [
      { label: 'Consumidor', emoji: '🧠' },
      { label: 'Híbrido', emoji: '🤖' },
      { label: 'Productor', emoji: '⚙️' },
    ];
  }

  let wmBlock = '';
  if (wmStart >= 0) {
    const wmEnd = modalStart > wmStart ? modalStart : md.length;
    wmBlock = md.slice(wmStart, wmEnd);
  }
  const watermark = extractValue(wmBlock, 'Texto') || 'ECOSISTEMA';

  const iconsToolbar = ['science', 'account_tree', 'bolt'];
  const toolbarPatches = [0, 1, 2].map((i) => {
    const line = toolbarLines[i] || ['Nivel 1 · Capacidades', 'Nivel 2 · Roles', 'Nivel 3 · Artefactos'][i];
    return buildToolbarButtonInner(line, iconsToolbar[i]);
  });

  return {
    title,
    subtitle,
    ayuda,
    botones,
    pilarEtiqueta,
    pilarSub,
    legendTitle,
    legendRowsHtml: buildLegendRowsHtml(legendRows),
    watermark,
    toolbarPatches,
  };
}

function main() {
  const template = fs.readFileSync(templatePath, 'utf-8');
  const contentMd = fs.readFileSync(contentMdPath, 'utf-8');
  const diagramaMd = fs.readFileSync(diagramaMdPath, 'utf-8');

  const pantallas = parsePantallas(contentMd);
  const p1 = pantallas[1] || '';
  const p2 = pantallas[2] || '';
  const p3 = pantallas[3] || '';
  const p4 = pantallas[4] || '';
  const p5 = pantallas[5] || '';
  const p6 = pantallas[6] || '';
  const p7 = pantallas[7] || '';
  const p16 = pantallas[16] || '';

  const titulo1 = extractValue(p1, 'Título') || 'Estrategia IA First CDE Analítica de Mercadeo';
  const year1 = extractValue(p1, 'Año') || '2026';
  const msg1 = extractValue(p1, 'Mensaje') || '';

  const p3Title = extractValue(p3, 'Título') || 'Cultura';

  const kult = extractMultilineValue(p3, 'Mensaje principal') || extractValue(p3, 'Mensaje principal');

  const bienMsg = extractMultilineValue(p4, 'Mensaje principal') || extractValue(p4, 'Mensaje principal');

  const okrMsg = extractMultilineValue(p6, 'Mensaje principal') || extractValue(p6, 'Mensaje principal');
  const lema = extractValue(p6, 'Lema') || '';

  const kpiCols = parseKpiColumns(p7);
  const colA = kpiCols[0] || { name: 'Atribución', kpis: ['Atribución', 'ROI'] };
  const colB = kpiCols[1] || { name: 'Última milla', kpis: ['Ultima Milla', 'Índice de la calidad'] };

  const patches = {
    p1_eyebrow: `                    <span class="material-symbols-outlined text-[15px]">auto_awesome</span>
                    IA First · CDE`,
    p1_h1: `                    ${formatTitleH1(titulo1)}`,
    p1_year: year1,
    p1_subtitle: msg1 ? mdInlineToHtml(msg1) : 'IA‑first no es “usar IA”, es rediseñar el trabajo alrededor de ella',

    p2_etiqueta: extractValue(p2, 'Etiqueta') || 'CULTURA',
    p2_titulo: extractValue(p2, 'Título') || 'Qué nos mueve',

    p3_section_start: `<section id="pantalla-3" class="h-panel bg-white relative overflow-hidden" data-screen-title="${escapeHtml(p3Title)}">`,
    p3_titulo: escapeHtml(p3Title),
    p3_mensaje: mdInlineToHtml(kult).replace(
      'rápido',
      '<span class="text-secondary font-black">rápido</span>'
    ),

    p4_titulo: extractValue(p4, 'Título') || 'Bienestar',
    p4_mensaje: mdInlineToHtml(bienMsg).replace(
      'siente bien',
      '<span class="text-secondary font-black italic">siente bien</span>'
    ),

    p5_etiqueta: extractValue(p5, 'Etiqueta') || 'PROPOSITO',
    p5_titulo: splitPurposeTitle(extractValue(p5, 'Título') || 'A qué le apuntamos'),

    p6_etiqueta: extractValue(p6, 'Etiqueta') || 'PROPOSITO {O}',
    p6_mensaje: mdInlineToHtml(okrMsg),
    p6_lema: lema
      ? escapeHtml(lema).replace(/\s*\|\s*/g, ' &nbsp; | &nbsp; ')
      : 'SOMOS BANQUEROS &nbsp; | &nbsp; SOMOS MARQUETEROS &nbsp; | &nbsp; SOMOS ANALÍTICOS',

    p7_left_label: 'OBJETIVOS Y KPI’s {KR}',
    p7_col1_title: colA.name,
    p7_col1_li1: escapeHtml(colA.kpis[0] || '—'),
    p7_col1_li2: escapeHtml(colA.kpis[1] || '—'),
    p7_col2_title: colB.name,
    p7_col2_li1: escapeHtml(colB.kpis[0] || '—'),
    p7_col2_li2: escapeHtml(colB.kpis[1] || '—'),
  };

  const diag = parseDiagrama(diagramaMd);
  patches.diag_h1 = escapeHtml(diag.title);
  patches.diag_subtitle = escapeHtml(diag.subtitle);
  patches.diag_ayuda = escapeHtml((diag.ayuda || '').replace(/\s+/g, ' ').trim());

  const btnFlujo = diag.botones[0] || 'Flujo Cíclico';
  patches.diag_btn_flujo = `                    <span class="material-symbols-outlined text-[18px]">cycle</span>
                    ${escapeHtml(btnFlujo)}`;

  patches.diag_pilar_etiqueta = escapeHtml(diag.pilarEtiqueta);
  patches.diag_pilar_sub = escapeHtml(diag.pilarSub);

  patches.diag_toolbar_1 = diag.toolbarPatches[0];
  patches.diag_toolbar_2 = diag.toolbarPatches[1];
  patches.diag_toolbar_3 = diag.toolbarPatches[2];

  patches.diag_watermark = escapeHtml(diag.watermark);
  patches.diag_legend_title = escapeHtml(diag.legendTitle);
  patches.diag_legend_rows = diag.legendRowsHtml;

  const ctx16 = extractContextoP16(p16);
  patches.p16_context = ctx16
    ? mdInlineToHtml(ctx16)
    : `Si bien ya incorporamos IA, el
                        objetivo es dar el siguiente salto para dejar de ser una "fábrica de ETLs" y convertirnos en un
                        equipo de habilitación de IA.`;

  const inserts = {
    block_p8_p13: buildBlockP8P13(pantallas),
    p14_grid: buildOportunidadesGrid(
      parseNumberedSimple(pantallas[14] || ''),
      'bg-white rounded-2xl border border-purple-200 p-5 shadow-sm'
    ),
    p15_grid: buildOportunidadesGrid(
      parseNumberedSimple(pantallas[15] || ''),
      'bg-slate-50 rounded-2xl border border-amber-200 p-5 shadow-sm'
    ),
    p16_grid: buildIngenieriaGrid(parseIngenieriaItems(p16)),
    p17_grid: buildPantalla17(pantallas[17] || ''),
  };

  let out = template;
  out = applyMdInserts(out, inserts);
  out = applyMdPatches(out, patches);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, out, 'utf-8');
  console.log('✅ Escrito:', outputPath);

  if (process.env.BUILD_DEBUG_DATA === '1') {
    fs.mkdirSync(path.dirname(buildMetadataPath), { recursive: true });
    fs.writeFileSync(
      buildMetadataPath,
      JSON.stringify({ generatedAt: new Date().toISOString(), pantallasKeys: Object.keys(pantallas) }, null, 2)
    );
    console.log('📦 Debug:', buildMetadataPath);
  }
}

main();
