import { buildJsonLdGraph } from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('core/graph', () => {
  it('bundles multiple entities under @graph with root @context', () => {
    const org = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://example.com/#org',
      name: 'Acme Corp',
    };

    const article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Astro Graph Launch',
    };

    const graph = buildJsonLdGraph([org, article]);

    expect(graph).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://example.com/#org',
          name: 'Acme Corp',
        },
        {
          '@type': 'Article',
          headline: 'Astro Graph Launch',
        },
      ],
    });
  });

  it('deduplicates and merges entities sharing identical @id', () => {
    const stub = {
      '@id': 'https://example.com/#org',
      '@type': 'Organization',
    };

    const full = {
      '@id': 'https://example.com/#org',
      name: 'Acme Corp',
      url: 'https://example.com',
    };

    const graph = buildJsonLdGraph([stub, full]);

    expect(graph).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@id': 'https://example.com/#org',
          '@type': 'Organization',
          name: 'Acme Corp',
          url: 'https://example.com',
        },
      ],
    });
  });

  it('flattens nested arrays and ignores null or undefined items', () => {
    const valid = { '@type': 'WebSite', name: 'Site' };

    const graph = buildJsonLdGraph([null, [undefined, valid], false, {}]);

    expect(graph).toEqual({
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebSite', name: 'Site' }],
    });
  });

  it('returns null when given empty or null inputs', () => {
    expect(buildJsonLdGraph(null)).toBeNull();
    expect(buildJsonLdGraph([])).toBeNull();
    expect(buildJsonLdGraph([null, undefined, {}])).toBeNull();
  });

  it('supports graph: false to emit a single entity directly at the root', () => {
    const entity = { '@type': 'Article', headline: 'Single Story' };
    const result = buildJsonLdGraph(entity, { graph: false });

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Single Story',
    });
  });
});
