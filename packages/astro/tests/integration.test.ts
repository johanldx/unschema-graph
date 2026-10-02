import integration, { schemaGraph } from '@unschema-graph/astro';
import integrationSubpath from '@unschema-graph/astro/integration';
import {
  buildJsonLdGraph,
  GoogleArticle,
  getGlobalConfig,
  resetGlobalConfig,
  setGlobalConfig,
} from '@unschema-graph/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Astro Integration & @id Resolution', () => {
  beforeEach(() => {
    resetGlobalConfig();
  });

  afterEach(() => {
    resetGlobalConfig();
  });

  describe('buildJsonLdGraph with baseUrl', () => {
    it('applies baseUrl to resolve all entity IDs in the graph', () => {
      setGlobalConfig({ baseUrl: 'https://global.example' });
      const org = {
        '@type': 'Organization',
        '@id': '#organization',
        name: 'Rootage',
      };

      const article = {
        '@type': 'Article',
        '@id': '/blog/my-post#article',
        publisher: { '@id': '#organization' },
        headline: 'Article',
      };

      const graph = buildJsonLdGraph([org, article], {
        baseUrl: 'https://mon-site.fr',
      });

      expect(graph).toEqual({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://mon-site.fr/#organization',
            name: 'Rootage',
          },
          {
            '@type': 'Article',
            '@id': 'https://mon-site.fr/blog/my-post#article',
            publisher: { '@id': 'https://mon-site.fr/#organization' },
            headline: 'Article',
          },
        ],
      });
    });
  });

  describe('schemaGraph Integration', () => {
    it('exposes the same integration from the root and integration subpath', () => {
      expect(typeof integration).toBe('function');
      expect(integration).toBe(schemaGraph);
      expect(integrationSubpath).toBe(schemaGraph);
    });

    it('returns a properly structured Astro integration', () => {
      const integration = schemaGraph({
        baseUrl: 'https://mon-site.fr',
        onError: 'warn',
      });

      expect(integration.name).toBe('@unschema-graph/astro');
      expect(integration.hooks['astro:config:setup']).toBeDefined();
    });

    it('sets global configuration when astro:config:setup hook runs', () => {
      const integration = schemaGraph({
        baseUrl: 'https://mon-site.fr',
        onError: 'throw',
        inLanguage: 'fr-FR',
      });

      const setupHook = integration.hooks['astro:config:setup'] as Function;
      const fakeLogger = {
        info: () => {},
        warn: () => {},
        error: () => {},
        debug: () => {},
      };

      setupHook({
        command: 'build',
        config: { site: 'https://astro-site.example' },
        logger: fakeLogger,
      });

      const config = getGlobalConfig();
      expect(config.baseUrl).toBe('https://mon-site.fr');
      expect(config.onError).toBe('throw');
      expect(config.inLanguage).toBe('fr-FR');
    });

    it('defaults to config.site when baseUrl is omitted in integration options', () => {
      const integration = schemaGraph();
      const setupHook = integration.hooks['astro:config:setup'] as Function;
      const fakeLogger = {
        info: () => {},
        warn: () => {},
        error: () => {},
        debug: () => {},
      };

      setupHook({
        command: 'dev',
        config: { site: 'https://site-par-defaut.fr' },
        logger: fakeLogger,
      });

      const config = getGlobalConfig();
      expect(config.baseUrl).toBe('https://site-par-defaut.fr');
      expect(config.onError).toBe('warn'); // Defaults to 'warn' in dev command
    });

    it('applies the configured onError mode to schema builders', () => {
      const integration = schemaGraph({ onError: 'warn' });
      const setupHook = integration.hooks['astro:config:setup'] as Function;
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      setupHook({
        command: 'dev',
        config: {},
        logger: { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} },
      });

      // @ts-expect-error Intentionally incomplete input.
      expect(GoogleArticle({ headline: 'Incomplete' })).toBeNull();
      expect(warn).toHaveBeenCalledOnce();
      warn.mockRestore();
    });
  });
});
