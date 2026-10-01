import schemaGraph from '@unschema-graph/astro/integration';
import {
  buildJsonLdGraph,
  GoogleArticle,
  getGlobalConfig,
  resetGlobalConfig,
  resolveEntityIds,
  resolveId,
} from '@unschema-graph/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Astro Integration & @id Resolution', () => {
  beforeEach(() => {
    resetGlobalConfig();
  });

  describe('resolveId', () => {
    it('resolves hash @ids using baseUrl', () => {
      expect(resolveId('#organization', 'https://example.com')).toBe(
        'https://example.com/#organization'
      );
      expect(resolveId('#organization', 'https://example.com/')).toBe(
        'https://example.com/#organization'
      );
    });

    it('resolves relative path @ids', () => {
      expect(resolveId('/authors/johan#person', 'https://example.com')).toBe(
        'https://example.com/authors/johan#person'
      );
      expect(resolveId('blog/post#article', 'https://example.com')).toBe(
        'https://example.com/blog/post#article'
      );
    });

    it('leaves absolute URIs unmodified', () => {
      expect(resolveId('https://schema.org/Person', 'https://example.com')).toBe(
        'https://schema.org/Person'
      );
      expect(resolveId('urn:isbn:0451450523', 'https://example.com')).toBe('urn:isbn:0451450523');
      expect(resolveId('mailto:info@example.com', 'https://example.com')).toBe(
        'mailto:info@example.com'
      );
      expect(resolveId('did:example:123', 'https://example.com')).toBe('did:example:123');
    });

    it('returns original id if baseUrl is undefined', () => {
      expect(resolveId('#org')).toBe('#org');
    });
  });

  describe('resolveEntityIds (deep)', () => {
    it('recursively resolves nested @id properties', () => {
      const article = {
        '@type': 'Article',
        '@id': '#article',
        publisher: { '@id': '#organization' },
        authors: [{ '@id': '/authors/johan#person', name: 'Johan' }],
      };

      const resolved = resolveEntityIds(article, 'https://mon-site.fr');

      expect(resolved).toEqual({
        '@type': 'Article',
        '@id': 'https://mon-site.fr/#article',
        publisher: { '@id': 'https://mon-site.fr/#organization' },
        authors: [{ '@id': 'https://mon-site.fr/authors/johan#person', name: 'Johan' }],
      });
    });
  });

  describe('buildJsonLdGraph with baseUrl', () => {
    it('applies baseUrl to resolve all entity IDs in the graph', () => {
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
        config: { site: 'https://mon-site.fr' },
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
      resetGlobalConfig();
    });
  });
});
