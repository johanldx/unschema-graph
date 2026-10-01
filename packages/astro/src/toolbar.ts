import { defineToolbarApp } from 'astro/toolbar';

interface EntitySummary {
  type: string;
  id?: string;
  name?: string;
  headline?: string;
  description?: string;
  inLanguage?: string;
  author?: string;
  publisher?: string;
  speakable?: boolean;
  searchAction?: boolean;
  price?: string;
  dates?: string;
  rating?: string;
  raw: Record<string, unknown>;
}

interface ToolbarDiagnostic {
  code: string;
  message: string;
  id?: string;
  path?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatRef(ref: unknown): string | undefined {
  if (!ref) return undefined;
  if (typeof ref === 'string') return ref;
  if (typeof ref === 'object') {
    const obj = ref as Record<string, unknown>;
    if (typeof obj['@id'] === 'string') return obj['@id'];
    if (typeof obj.name === 'string') return obj.name;
  }
  return undefined;
}

function decodeMetadata(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default defineToolbarApp({
  init(canvas, app) {
    let isOpen = false;
    let placement = 'bottom-center';

    function render() {
      if (!isOpen) {
        canvas.innerHTML = '';
        return;
      }

      const scripts = Array.from(
        document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')
      );

      const entities: EntitySummary[] = [];
      const diagnostics: ToolbarDiagnostic[] = [];
      let isGraph = false;
      let baseUrl: string | undefined;
      let locale: string | undefined;
      const rawJsonOutputs: string[] = [];

      for (const script of scripts) {
        baseUrl ??= decodeMetadata(script.dataset.unschemaBaseUrl);
        locale ??= decodeMetadata(script.dataset.unschemaLocale);
        if (script.dataset.unschemaDiagnostics) {
          try {
            const parsedDiagnostics = JSON.parse(
              decodeMetadata(script.dataset.unschemaDiagnostics) ?? '[]'
            );
            if (Array.isArray(parsedDiagnostics)) {
              for (const diagnostic of parsedDiagnostics) {
                if (
                  diagnostic &&
                  typeof diagnostic === 'object' &&
                  typeof diagnostic.code === 'string' &&
                  typeof diagnostic.message === 'string'
                ) {
                  diagnostics.push(diagnostic as ToolbarDiagnostic);
                }
              }
            }
          } catch {
            diagnostics.push({
              code: 'invalid-diagnostic-metadata',
              message: 'Unable to parse Schema component diagnostic metadata.',
            });
          }
        }

        const text = script.textContent?.trim() || '';
        if (text) {
          rawJsonOutputs.push(text);
        }
        try {
          const json = JSON.parse(text || '{}');
          if (json['@graph'] && Array.isArray(json['@graph'])) {
            isGraph = true;
            for (const item of json['@graph']) {
              if (item && typeof item === 'object') {
                const rec = item as Record<string, unknown>;
                entities.push(extractEntitySummary(rec));
              }
            }
          } else if (json['@type']) {
            entities.push(extractEntitySummary(json as Record<string, unknown>));
          }
        } catch {
          diagnostics.push({
            code: 'invalid-json',
            message: 'Unable to parse an application/ld+json script on this page.',
          });
        }
      }

      const windowComponent = document.createElement('astro-dev-toolbar-window');
      windowComponent.setAttribute('placement', placement);

      windowComponent.innerHTML = `
        <style>
          .asg-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }
          .asg-header-title {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .asg-logo {
            width: 22px;
            height: 22px;
            color: #a855f7;
            flex-shrink: 0;
          }
          h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.01em;
          }
          .asg-header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          hr {
            border: none;
            border-top: 1px solid rgba(52, 56, 65, 1);
            margin: 16px 0;
          }
          .asg-meta-bar {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 6px;
            border: 1px solid rgba(52, 56, 65, 0.6);
            font-size: 12px;
            color: rgba(191, 193, 201, 1);
            flex-wrap: wrap;
          }
          .asg-meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .asg-meta-label {
            color: rgba(145, 152, 173, 1);
          }
          .asg-meta-value {
            font-weight: 600;
            color: #ffffff;
          }
          .asg-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            overflow-y: auto;
            max-height: 330px;
            padding-right: 4px;
          }
          .asg-list::-webkit-scrollbar {
            width: 6px;
          }
          .asg-list::-webkit-scrollbar-track {
            background: transparent;
          }
          .asg-list::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
          .asg-card-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .asg-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }
          .asg-entity-type {
            font-size: 15px;
            font-weight: 700;
            color: #e0ccfa;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .asg-card-title {
            font-size: 13px;
            font-weight: 600;
            color: #ffffff;
            margin-top: 2px;
          }
          .asg-card-desc {
            font-size: 12px;
            color: rgba(191, 193, 201, 0.85);
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .asg-badges-row {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
            margin-top: 4px;
          }
          .asg-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(224, 204, 250, 0.9);
          }
          .asg-details {
            margin-top: 6px;
            border-top: 1px dashed rgba(52, 56, 65, 0.8);
            padding-top: 6px;
          }
          .asg-summary {
            font-size: 11px;
            color: rgba(145, 152, 173, 1);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            user-select: none;
          }
          .asg-summary:hover {
            color: #e0ccfa;
          }
          .asg-json {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 11px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(52, 56, 65, 0.8);
            border-radius: 6px;
            padding: 8px 10px;
            color: #e2e8f0;
            overflow-x: auto;
            margin-top: 6px;
            max-height: 180px;
          }
          .asg-empty-state {
            padding: 24px;
            text-align: center;
            color: rgba(191, 193, 201, 1);
          }
          .asg-empty-state h3 {
            margin: 0 0 8px 0;
            color: #fff;
            font-size: 16px;
          }
          .asg-empty-state p {
            font-size: 13px;
            margin: 0;
            color: rgba(145, 152, 173, 1);
          }
          .asg-diagnostics {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 12px;
          }
          .asg-diagnostic-code {
            color: #fbbf24;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12px;
            font-weight: 700;
          }
          .asg-diagnostic-message {
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            line-height: 1.45;
            white-space: pre-wrap;
          }
        </style>

        <header class="asg-header">
          <div class="asg-header-title">
            <svg class="asg-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <h2>Schema Graph</h2>
            <astro-dev-toolbar-badge badge-style="purple" size="large">
              ${entities.length} ${entities.length === 1 ? 'entité' : 'entités'}
            </astro-dev-toolbar-badge>
            ${
              entities.length > 0 && diagnostics.length === 0
                ? '<astro-dev-toolbar-badge badge-style="green" size="large">@graph valide</astro-dev-toolbar-badge>'
                : diagnostics.length > 0
                  ? `<astro-dev-toolbar-badge badge-style="yellow" size="large">${diagnostics.length} avertissement${diagnostics.length === 1 ? '' : 's'}</astro-dev-toolbar-badge>`
                  : '<astro-dev-toolbar-badge badge-style="yellow" size="large">Aucun schéma</astro-dev-toolbar-badge>'
            }
          </div>
          <div class="asg-header-actions">
            <astro-dev-toolbar-button id="asg-copy-btn" button-style="purple" size="medium">
              Copier le JSON-LD <astro-dev-toolbar-icon icon="copy"></astro-dev-toolbar-icon>
            </astro-dev-toolbar-button>
          </div>
        </header>

        <hr />

        <div class="asg-meta-bar">
          <div class="asg-meta-item">
            <span class="asg-meta-label">Nodes:</span>
            <span class="asg-meta-value">${entities.length}</span>
          </div>
          <div class="asg-meta-item">
            <span class="asg-meta-label">Structure:</span>
            <span class="asg-meta-value">${isGraph ? '@graph unifié' : 'Racine unique'}</span>
          </div>
          <div class="asg-meta-item">
            <span class="asg-meta-label">Types:</span>
            <span class="asg-meta-value">${[...new Set(entities.map((e) => e.type))].join(', ') || 'aucun'}</span>
          </div>
          <div class="asg-meta-item">
            <span class="asg-meta-label">Base URL:</span>
            <span class="asg-meta-value">${escapeHtml(baseUrl ?? 'aucune')}</span>
          </div>
          <div class="asg-meta-item">
            <span class="asg-meta-label">Locale:</span>
            <span class="asg-meta-value">${escapeHtml(locale ?? 'aucune')}</span>
          </div>
          <div class="asg-meta-item">
            <span class="asg-meta-label">Warnings:</span>
            <span class="asg-meta-value">${diagnostics.length}</span>
          </div>
        </div>

        ${
          diagnostics.length > 0
            ? `<div class="asg-diagnostics">
                ${diagnostics
                  .map(
                    (diagnostic) => `
                  <astro-dev-toolbar-card card-style="yellow">
                    <div class="asg-diagnostic-code">${escapeHtml(diagnostic.code)}</div>
                    <div class="asg-diagnostic-message">${escapeHtml(diagnostic.message)}</div>
                    ${diagnostic.path ? `<span class="asg-pill">${escapeHtml(diagnostic.path)}</span>` : ''}
                    ${diagnostic.id ? `<span class="asg-pill">${escapeHtml(diagnostic.id)}</span>` : ''}
                  </astro-dev-toolbar-card>`
                  )
                  .join('')}
              </div>`
            : ''
        }

        <div class="asg-list">
          ${
            entities.length === 0
              ? `
            <astro-dev-toolbar-card card-style="gray">
              <div class="asg-empty-state">
                <h3>Aucune donnée structurée détectée</h3>
                <p>Aucun bloc &lt;script type="application/ld+json"&gt; trouvé. Ajoutez &lt;Schema data={...} /&gt; dans votre page pour injecter des schémas.</p>
              </div>
            </astro-dev-toolbar-card>
          `
              : entities
                  .map(
                    (entity) => `
            <astro-dev-toolbar-card card-style="purple">
              <div class="asg-card-content">
                <div class="asg-card-top">
                  <div class="asg-entity-type">${escapeHtml(entity.type)}</div>
                  <astro-dev-toolbar-badge badge-style="${entity.id ? 'purple' : 'gray'}" size="small">
                    ${entity.id ? escapeHtml(entity.id) : 'anonyme'}
                  </astro-dev-toolbar-badge>
                </div>

                ${entity.headline || entity.name ? `<div class="asg-card-title">${escapeHtml(entity.headline || entity.name || '')}</div>` : ''}
                ${entity.description ? `<div class="asg-card-desc">${escapeHtml(entity.description)}</div>` : ''}

                <div class="asg-badges-row">
                  ${entity.author ? `<span class="asg-pill">Author: ${escapeHtml(entity.author)}</span>` : ''}
                  ${entity.publisher ? `<span class="asg-pill">Publisher: ${escapeHtml(entity.publisher)}</span>` : ''}
                  ${entity.inLanguage ? `<astro-dev-toolbar-badge badge-style="blue" size="small">${escapeHtml(entity.inLanguage.toUpperCase())}</astro-dev-toolbar-badge>` : ''}
                  ${entity.speakable ? `<astro-dev-toolbar-badge badge-style="yellow" size="small">Speakable</astro-dev-toolbar-badge>` : ''}
                  ${entity.searchAction ? `<astro-dev-toolbar-badge badge-style="purple" size="small">SearchAction</astro-dev-toolbar-badge>` : ''}
                  ${entity.price ? `<astro-dev-toolbar-badge badge-style="green" size="small">${escapeHtml(entity.price)}</astro-dev-toolbar-badge>` : ''}
                  ${entity.dates ? `<astro-dev-toolbar-badge badge-style="gray" size="small">${escapeHtml(entity.dates)}</astro-dev-toolbar-badge>` : ''}
                  ${entity.rating ? `<astro-dev-toolbar-badge badge-style="yellow" size="small">Rating: ${escapeHtml(entity.rating)}</astro-dev-toolbar-badge>` : ''}
                </div>

                <details class="asg-details">
                  <summary class="asg-summary">
                    <span>Aperçu JSON-LD (${Object.keys(entity.raw).length} champs)</span>
                    <span>▼</span>
                  </summary>
                  <pre class="asg-json">${escapeHtml(JSON.stringify(entity.raw, null, 2))}</pre>
                </details>
              </div>
            </astro-dev-toolbar-card>
          `
                  )
                  .join('')
          }
        </div>
      `;

      const copyBtn = windowComponent.querySelector('#asg-copy-btn');
      copyBtn?.addEventListener('click', () => {
        const fullPayload =
          rawJsonOutputs.length === 1
            ? rawJsonOutputs[0]
            : JSON.stringify(
                {
                  '@context': 'https://schema.org',
                  '@graph': entities.map((e) => e.raw),
                },
                null,
                2
              );

        navigator.clipboard.writeText(fullPayload);
        if (copyBtn) {
          copyBtn.innerHTML = `Copié ! <astro-dev-toolbar-icon icon="checkmark"></astro-dev-toolbar-icon>`;
          setTimeout(() => {
            if (copyBtn) {
              copyBtn.innerHTML = `Copier le JSON-LD <astro-dev-toolbar-icon icon="copy"></astro-dev-toolbar-icon>`;
            }
          }, 2500);
        }
      });

      canvas.innerHTML = '';
      canvas.append(windowComponent);
    }

    function extractEntitySummary(item: Record<string, unknown>): EntitySummary {
      const type = String(item['@type'] || 'Entity');
      const id = typeof item['@id'] === 'string' ? item['@id'] : undefined;
      const name = typeof item.name === 'string' ? item.name : undefined;
      const headline = typeof item.headline === 'string' ? item.headline : undefined;
      const description = typeof item.description === 'string' ? item.description : undefined;
      const inLanguage = typeof item.inLanguage === 'string' ? item.inLanguage : undefined;

      const author = formatRef(item.author);
      const publisher = formatRef(item.publisher);
      const speakable = Boolean(item.speakable);
      const searchAction = Array.isArray(item.potentialAction)
        ? item.potentialAction.length > 0
        : Boolean(item.potentialAction);

      let price: string | undefined;
      if (item.offers && typeof item.offers === 'object') {
        const o = item.offers as Record<string, unknown>;
        if (o.price !== undefined) {
          price = `${o.price} ${o.priceCurrency || ''}`.trim();
        }
      }

      let dates: string | undefined;
      if (item.datePublished) {
        dates = String(item.datePublished);
      } else if (item.startDate) {
        dates = String(item.startDate);
      }

      let rating: string | undefined;
      if (item.aggregateRating && typeof item.aggregateRating === 'object') {
        const r = item.aggregateRating as Record<string, unknown>;
        if (r.ratingValue !== undefined) {
          rating = `${r.ratingValue}/5 (${r.reviewCount || 0})`;
        }
      }

      return {
        type,
        id,
        name,
        headline,
        description,
        inLanguage,
        author,
        publisher,
        speakable,
        searchAction,
        price,
        dates,
        rating,
        raw: item,
      };
    }

    app.onToggled(({ state }) => {
      isOpen = state;
      render();
    });

    app.onToolbarPlacementUpdated(({ placement: nextPlacement }) => {
      placement = nextPlacement;
      if (isOpen) {
        render();
      }
    });

    document.addEventListener('astro:page-load', () => {
      if (isOpen) {
        render();
      }
    });

    document.addEventListener('astro:after-swap', () => {
      if (isOpen) {
        render();
      }
    });
  },
});
