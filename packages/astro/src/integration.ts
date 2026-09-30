import { fileURLToPath } from 'node:url';
import { type SchemaGraphOptions, setGlobalConfig } from '@unschema-graph/core';
import type { AstroIntegration } from 'astro';

/**
 * Astro integration for `@unschema-graph/astro`.
 *
 * Configures global settings such as validation error handling (`onError`)
 * and canonical base URL (`baseUrl`) for relative `@id` resolution.
 *
 * @param options - Configuration options for the integration.
 * @returns An AstroIntegration object for `astro.config.mjs`.
 *
 * @example
 * ```js
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config';
 * import schemaGraph from '@unschema-graph/astro/integration';
 *
 * export default defineConfig({
 *   site: 'https://mon-site.fr',
 *   integrations: [
 *     schemaGraph({
 *       onError: process.env.NODE_ENV === 'production' ? 'throw' : 'warn',
 *     }),
 *   ],
 * });
 * ```
 */
export default function schemaGraph(options: SchemaGraphOptions = {}): AstroIntegration {
  const toolbarFile = import.meta.url.endsWith('.ts') ? './toolbar.ts' : './toolbar.js';

  return {
    name: '@unschema-graph/astro',
    hooks: {
      'astro:config:setup': ({ command, config, logger, addDevToolbarApp }) => {
        const siteStr = config.site ? config.site.toString() : undefined;
        const resolvedBaseUrl = options.baseUrl ?? siteStr;
        const resolvedOnError = options.onError ?? (command === 'build' ? 'throw' : 'warn');

        setGlobalConfig({
          baseUrl: resolvedBaseUrl,
          onError: resolvedOnError,
        });

        if (command === 'dev' && addDevToolbarApp) {
          addDevToolbarApp({
            id: 'unschema-graph',
            name: 'Schema Graph',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
            entrypoint: fileURLToPath(new URL(toolbarFile, import.meta.url)),
          });
        }

        logger.info(
          `Initialized (onError: ${resolvedOnError}${resolvedBaseUrl ? `, baseUrl: ${resolvedBaseUrl}` : ''})`
        );
      },
    },
  };
}
