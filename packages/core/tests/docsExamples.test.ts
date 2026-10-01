import {
  Article,
  buildJsonLdGraph,
  diffDuration,
  formatIsoDate,
  formatIsoDuration,
  Offer,
  Organization,
  Product,
  SCHEMA_ORG_BASELINE,
  serializeJsonLd,
  WebPage,
  WebSite,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('Step 21 — Executable Documentation Snippets in CI', () => {
  it('exports valid Schema.org vocabulary baseline version', () => {
    expect(SCHEMA_ORG_BASELINE).toBe('28.1');
  });

  it('runs Core Quick Start example verbatim', () => {
    const article = Article({
      headline: 'My first framework-neutral JSON-LD',
      image: 'https://example.com/cover.jpg',
      datePublished: '2026-09-29',
      author: 'Ada Lovelace',
    });

    const payload = buildJsonLdGraph([article], { graph: false });
    const jsonLd = serializeJsonLd(payload, { pretty: true });

    expect(jsonLd).toContain('"@context": "https://schema.org"');
    expect(jsonLd).toContain('"@type": "Article"');
    expect(jsonLd).toContain('"headline": "My first framework-neutral JSON-LD"');
  });

  it('runs Connected Page Graph documentation example verbatim', () => {
    const organization = Organization({
      '@id': '#organization',
      name: 'Acme',
      url: 'https://example.com',
    });

    const website = WebSite({
      '@id': '#website',
      name: 'Acme Official',
      url: 'https://example.com',
      publisher: organization,
    });

    const page = WebPage({
      '@id': '#webpage',
      name: 'About Acme',
      url: 'https://example.com/about',
      isPartOf: website,
    });

    const graph = buildJsonLdGraph([organization, website, page], {
      baseUrl: 'https://example.com',
    });
    const serialized = serializeJsonLd(graph);

    expect(serialized).toContain('"@graph"');
    expect(serialized).toContain('"https://example.com/#organization"');
    expect(serialized).toContain('"https://example.com/#website"');
    expect(serialized).toContain('"https://example.com/#webpage"');
  });

  it('runs E-commerce Product & Offer documentation example verbatim', () => {
    const seller = Organization({
      '@id': '#seller',
      name: 'Acme Store',
    });

    const offer = Offer({
      '@id': '#offer-1',
      price: 29.99,
      priceCurrency: 'EUR',
      availability: 'InStock',
      seller: '#seller',
    });

    const product = Product({
      name: 'Ergonomic Keyboard',
      image: 'https://example.com/keyboard.jpg',
      offers: [offer],
    });

    const graph = buildJsonLdGraph([seller, product], {
      baseUrl: 'https://example.com',
    });

    expect(graph).toBeDefined();
    const nodes = graph?.['@graph'] as Record<string, unknown>[];
    expect(nodes.length).toBeGreaterThanOrEqual(2);
  });

  it('runs Temporal and Duration helpers documentation examples verbatim', () => {
    expect(formatIsoDuration({ hours: 1, minutes: 30 })).toBe('PT1H30M');
    expect(formatIsoDate('2026-09-30')).toBe('2026-09-30');
    expect(diffDuration('2026-09-30T10:00:00Z', '2026-09-30T12:30:00Z')).toBe('PT2H30M');
  });
});
