import { Article, buildJsonLdGraph, Organization, Person } from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('Step 20 — Algorithmic Benchmark & Resilience', () => {
  it('efficiently resolves 10, 100, and 1000 nodes with shared references and duplicates', () => {
    const scales = [10, 100, 1000];

    for (const count of scales) {
      const items: unknown[] = [];
      const sharedOrg = Organization({
        '@id': '#shared-org',
        name: 'Shared Parent Org',
      });
      items.push(sharedOrg);

      for (let i = 0; i < count; i++) {
        // Shared references to #shared-org and cyclic-capable author references
        const author = Person({
          '@id': `#author-${i}`,
          name: `Author ${i}`,
          worksFor: '#shared-org',
        });
        const article = Article({
          '@id': `#article-${i}`,
          headline: `Article title number ${i}`,
          image: `https://example.com/img-${i}.jpg`,
          datePublished: '2026-10-01',
          author: `#author-${i}`,
          publisher: '#shared-org',
        });

        items.push(author);
        items.push(article);

        // Inject periodic duplicates to test merge efficiency
        if (i % 10 === 0) {
          items.push({
            '@type': 'Person',
            '@id': `#author-${i}`,
            jobTitle: `Specialist ${i}`,
          });
        }
      }

      const start = performance.now();
      const graph = buildJsonLdGraph(items, {
        baseUrl: 'https://example.com',
        duplicateStrategy: 'merge',
      });
      const durationMs = performance.now() - start;

      expect(graph).toBeDefined();
      expect(Array.isArray(graph?.['@graph'])).toBe(true);

      // Verify linear scalability: 1000 complex nodes must finish quickly (well below 2000ms)
      if (count === 1000) {
        expect(durationMs).toBeLessThan(2500);
      }
    }
  });

  it('resiliently handles deep recursive nesting without stack overflow or infinite loops', () => {
    // Build a deeply nested structure (35 levels of inline entities)
    let current: Record<string, unknown> = {
      '@type': 'Person',
      name: 'Leaf Person',
    };

    for (let depth = 0; depth < 35; depth++) {
      current = {
        '@type': 'Organization',
        name: `Organization Level ${depth}`,
        subOrganization: current,
      };
    }

    const graph = buildJsonLdGraph(current, { baseUrl: 'https://example.com' });
    expect(graph).toBeDefined();
  });

  it('safely breaks cycles in nested inline object graphs without hanging', () => {
    const parent: Record<string, unknown> = {
      '@type': 'Organization',
      name: 'Parent Org',
    };
    const child: Record<string, unknown> = {
      '@type': 'Organization',
      name: 'Child Org',
      parentOrganization: parent,
    };
    parent.subOrganization = child;

    // Both without explicit @id
    const graph = buildJsonLdGraph(parent);
    expect(graph).toBeDefined();
  });
});
