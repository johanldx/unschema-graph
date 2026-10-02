import { describe, expect, it } from 'vitest';
import {
  Article,
  buildJsonLdGraph,
  Organization,
  Person,
  Product,
  serializeJsonLd,
  WebPage,
  WebSite,
} from '../src/index.js';

describe('0.x to v1 migration & backwards compatibility', () => {
  it('produces identical JSON-LD for 0.x string shorthand, object reference, and v1 entity-object reference', () => {
    const baseUrl = 'https://example.com';

    // 1. Legacy 0.x syntax: manual array + string shorthand
    const orgA = Organization({
      '@id': '#organization',
      name: 'Acme',
      url: 'https://example.com',
    });
    const webA = WebSite({
      '@id': '#website',
      name: 'Acme',
      url: 'https://example.com',
      publisher: '#organization',
    });
    const graphA = buildJsonLdGraph([orgA, webA], { baseUrl });

    // 2. Explicit @id reference object + manual array
    const orgB = Organization({
      '@id': '#organization',
      name: 'Acme',
      url: 'https://example.com',
    });
    const webB = WebSite({
      '@id': '#website',
      name: 'Acme',
      url: 'https://example.com',
      publisher: { '@id': '#organization' },
    });
    const graphB = buildJsonLdGraph([orgB, webB], { baseUrl });

    // 3. Recommended v1 syntax: entity-object reference + automatic graph discovery
    const orgC = Organization({
      '@id': '#organization',
      name: 'Acme',
      url: 'https://example.com',
    });
    const webC = WebSite({
      '@id': '#website',
      name: 'Acme',
      url: 'https://example.com',
      publisher: orgC,
    });
    const graphC = buildJsonLdGraph(webC, { baseUrl });

    // Both graph structures must match
    expect(graphA).toEqual(graphB);
    expect(graphA).toEqual(graphC);

    // Serialized output must be byte-for-byte identical
    const jsonA = serializeJsonLd(graphA);
    const jsonB = serializeJsonLd(graphB);
    const jsonC = serializeJsonLd(graphC);

    expect(jsonA).toBe(jsonB);
    expect(jsonA).toBe(jsonC);
  });

  it('supports 3-level hierarchy migration identically (WebPage -> WebSite -> Organization)', () => {
    const baseUrl = 'https://example.com';

    // 0.x approach: explicit array of 3 nodes with string identifiers
    const orgOld = Organization({
      '@id': '#organization',
      name: 'Acme',
      url: 'https://example.com',
    });
    const siteOld = WebSite({
      '@id': '#website',
      name: 'Acme',
      url: 'https://example.com',
      publisher: '#organization',
    });
    const pageOld = WebPage({
      '@id': '#webpage',
      name: 'Home',
      isPartOf: '#website',
    });
    const graphOld = buildJsonLdGraph([orgOld, siteOld, pageOld], { baseUrl });

    // v1 recommended approach: object references + automatic graph discovery from root
    const orgNew = Organization({
      '@id': '#organization',
      name: 'Acme',
      url: 'https://example.com',
    });
    const siteNew = WebSite({
      '@id': '#website',
      name: 'Acme',
      url: 'https://example.com',
      publisher: orgNew,
    });
    const pageNew = WebPage({
      '@id': '#webpage',
      name: 'Home',
      isPartOf: siteNew,
    });
    const graphNew = buildJsonLdGraph(pageNew, { baseUrl });

    expect(graphOld).toEqual(graphNew);
    expect(serializeJsonLd(graphOld)).toBe(serializeJsonLd(graphNew));
  });

  it('preserves backwards-compatible fallback strings (e.g. author name, brand name)', () => {
    const articleWithStringAuthor = Article({
      headline: 'Article with plain string author',
      author: 'Ada Lovelace',
    });

    const articleWithPerson = Article({
      headline: 'Article with plain string author',
      author: Person({ name: 'Ada Lovelace' }),
    });

    expect(articleWithStringAuthor.author).toEqual({
      '@type': 'Person',
      name: 'Ada Lovelace',
    });
    expect(articleWithStringAuthor.author).toEqual(articleWithPerson.author);

    const productWithStringBrand = Product({
      name: 'Super Widget',
      brand: 'Acme Corp',
    });

    const productWithBrand = Product({
      name: 'Super Widget',
      brand: { '@type': 'Brand', name: 'Acme Corp' },
    });

    expect(productWithStringBrand.brand).toEqual({
      '@type': 'Brand',
      name: 'Acme Corp',
    });
    expect(productWithStringBrand.brand).toEqual(productWithBrand.brand);
  });
});
