import {
  buildJsonLdGraph,
  DuplicateEntityError,
  type GraphDiagnostic,
  resolveEntityIds,
  resolveId,
  serializeJsonLd,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('core/graph', () => {
  it.each([
    ['#org', 'https://example.com/#org'],
    ['/about', 'https://example.com/about'],
    ['/about#webpage', 'https://example.com/about#webpage'],
    ['https://example.com/#org', 'https://example.com/#org'],
    ['urn:example:foo', 'urn:example:foo'],
    ['mailto:hello@example.com', 'mailto:hello@example.com'],
    ['tel:+33123456789', 'tel:+33123456789'],
  ])('resolves the @id form %s deterministically', (id, expected) => {
    expect(resolveId(id, 'https://example.com')).toBe(expected);
  });

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

  it('reports conflicting values while merging duplicate entity IDs', () => {
    const diagnostics: GraphDiagnostic[] = [];
    const graph = buildJsonLdGraph(
      [
        { '@id': '#org', '@type': 'Organization', name: 'Acme', url: '/about' },
        { '@id': '#org', '@type': 'Organization', name: 'Acme Corp', logo: '/logo.svg' },
      ],
      { onDiagnostic: (diagnostic) => diagnostics.push(diagnostic) }
    );

    expect(graph?.['@graph']).toEqual([
      {
        '@id': '#org',
        '@type': 'Organization',
        name: 'Acme Corp',
        url: '/about',
        logo: '/logo.svg',
      },
    ]);
    expect(diagnostics).toEqual([
      {
        code: 'duplicate-conflict',
        severity: 'warning',
        message: 'Conflicting values for #org.name',
        id: '#org',
        entityId: '#org',
        path: '#org.name',
        existingValue: 'Acme',
        incomingValue: 'Acme Corp',
        suggestion: 'Align conflicting properties or use duplicateStrategy: "last" or "first"',
      },
    ]);
  });

  it('supports first, last, and error duplicate strategies', () => {
    const first = { '@id': '#org', name: 'First' };
    const last = { '@id': '#org', name: 'Last' };

    expect(buildJsonLdGraph([first, last], { duplicateStrategy: 'first' })?.['@graph']).toEqual([
      first,
    ]);
    expect(buildJsonLdGraph([first, last], { duplicateStrategy: 'last' })?.['@graph']).toEqual([
      last,
    ]);
    expect(() => buildJsonLdGraph([first, last], { duplicateStrategy: 'error' })).toThrow(
      DuplicateEntityError
    );
  });

  it('reports broken local references but preserves unresolved external references', () => {
    const diagnostics: GraphDiagnostic[] = [];
    const website = {
      '@type': 'WebSite',
      '@id': '#website',
      publisher: { '@id': '#missing-organization' },
      externalPublisher: { '@id': 'https://external.example/#organization' },
      nonHttpIdentifier: { '@id': 'urn:example:organization' },
    };

    buildJsonLdGraph(website, {
      onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
    });

    expect(diagnostics).toEqual([
      {
        code: 'broken-reference',
        severity: 'warning',
        message: 'Broken reference: #missing-organization\nReferenced from: WebSite.publisher',
        id: '#missing-organization',
        entityId: '#missing-organization',
        path: 'WebSite.publisher',
        suggestion:
          'Ensure an entity with @id "#missing-organization" exists in the graph, or pass an external absolute URI',
      },
    ]);
  });

  it.each([
    ['#missing', 'https://example.com/', true],
    ['/#missing', 'https://example.com/', true],
    ['https://example.com/#missing', 'https://example.com/', true],
    ['https://example.com/about#missing', 'https://example.com/', false],
    ['https://example.com/products/42#missing', 'https://example.com/', false],
    ['https://external.example/#missing', 'https://example.com/', false],
    ['urn:test:missing', 'https://example.com/', false],
    ['https://example.com/docs/page/#missing', 'https://example.com/docs/page/', true],
  ])('classifies %s against document %s as same-document=%s', (reference, baseUrl, isLocal) => {
    const diagnostics: GraphDiagnostic[] = [];

    buildJsonLdGraph(
      {
        '@type': 'WebPage',
        '@id': '#page',
        isPartOf: { '@id': reference },
      },
      {
        baseUrl,
        onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
      }
    );

    expect(diagnostics.filter((diagnostic) => diagnostic.code === 'broken-reference')).toHaveLength(
      isLocal ? 1 : 0
    );
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

  it('promotes a nested entity with @id to a graph node and replaces it with a reference', () => {
    const organization = {
      '@type': 'Organization',
      '@id': '#organization',
      name: 'Acme',
    };
    const website = {
      '@type': 'WebSite',
      '@id': '#website',
      name: 'Acme',
      publisher: organization,
    };

    expect(buildJsonLdGraph(website, { baseUrl: 'https://example.com' })).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://example.com/#organization',
          name: 'Acme',
        },
        {
          '@type': 'WebSite',
          '@id': 'https://example.com/#website',
          name: 'Acme',
          publisher: { '@id': 'https://example.com/#organization' },
        },
      ],
    });
  });

  it('keeps a nested entity without @id inline', () => {
    const website = {
      '@type': 'WebSite',
      name: 'Acme',
      publisher: {
        '@type': 'Organization',
        name: 'Acme',
      },
    };

    expect(buildJsonLdGraph(website)).toEqual({
      '@context': 'https://schema.org',
      '@graph': [website],
    });
  });

  it('does not promote an explicit @id-only reference into an empty node', () => {
    const website = {
      '@type': 'WebSite',
      name: 'Acme',
      publisher: { '@id': '#organization' },
    };

    expect(buildJsonLdGraph(website)).toEqual({
      '@context': 'https://schema.org',
      '@graph': [website],
    });
  });

  it('resolves explicit @id values without inferring semantics from property names', () => {
    const entity = {
      '@type': 'Thing',
      '@id': '#thing',
      name: '#not-an-id',
      serviceType: '/not-an-id',
      description: 'urn:not-an-id',
      url: '/about',
      item: '/catalog/item',
      nested: { '@id': 'did:example:owner' },
    };

    expect(buildJsonLdGraph(entity, { baseUrl: 'https://example.com' })?.['@graph']).toEqual([
      {
        '@type': 'Thing',
        '@id': 'https://example.com/#thing',
        name: '#not-an-id',
        serviceType: '/not-an-id',
        description: 'urn:not-an-id',
        url: '/about',
        item: '/catalog/item',
        nested: { '@id': 'did:example:owner' },
      },
    ]);
  });

  it('discovers a complete dependency chain from one root entity', () => {
    const organization = {
      '@type': 'Organization',
      '@id': '#organization',
      name: 'Acme',
    };
    const website = {
      '@type': 'WebSite',
      '@id': '#website',
      name: 'Acme',
      publisher: organization,
    };
    const webpage = {
      '@type': 'WebPage',
      '@id': '#webpage',
      name: 'Home',
      isPartOf: website,
    };

    const graph = buildJsonLdGraph(webpage);

    expect(graph?.['@graph']).toEqual([
      organization,
      {
        '@type': 'WebSite',
        '@id': '#website',
        name: 'Acme',
        publisher: { '@id': '#organization' },
      },
      {
        '@type': 'WebPage',
        '@id': '#webpage',
        name: 'Home',
        isPartOf: { '@id': '#website' },
      },
    ]);
  });

  it('collects nodes in relation arrays and replaces every entity with an @id reference', () => {
    const alice = { '@type': 'Person', '@id': '#alice', name: 'Alice' };
    const bob = { '@type': 'Person', '@id': '#bob', name: 'Bob' };
    const event = {
      '@type': 'Event',
      '@id': '#event',
      name: 'Concert',
      performer: [alice, bob],
    };

    expect(buildJsonLdGraph(event)?.['@graph']).toEqual([
      alice,
      bob,
      {
        '@type': 'Event',
        '@id': '#event',
        name: 'Concert',
        performer: [{ '@id': '#alice' }, { '@id': '#bob' }],
      },
    ]);
  });

  it('terminates cyclic entity graphs and keeps both directions as references', () => {
    const organization: Record<string, unknown> = {
      '@type': 'Organization',
      '@id': '#organization',
      name: 'Acme',
    };
    const parent: Record<string, unknown> = {
      '@type': 'Organization',
      '@id': '#parent',
      name: 'Acme Group',
      subOrganization: organization,
    };
    organization.parentOrganization = parent;

    expect(buildJsonLdGraph(organization)?.['@graph']).toEqual([
      {
        '@type': 'Organization',
        '@id': '#parent',
        name: 'Acme Group',
        subOrganization: { '@id': '#organization' },
      },
      {
        '@type': 'Organization',
        '@id': '#organization',
        name: 'Acme',
        parentOrganization: { '@id': '#parent' },
      },
    ]);
  });

  it('registers one node when the same object is reused by several entities', () => {
    const organization = {
      '@type': 'Organization',
      '@id': '#organization',
      name: 'Acme',
    };
    const website = { '@type': 'WebSite', '@id': '#website', publisher: organization };
    const service = { '@type': 'Service', '@id': '#service', provider: organization };
    const offer = { '@type': 'Offer', '@id': '#offer', seller: organization };

    const nodes = buildJsonLdGraph([website, service, offer])?.['@graph'] as Record<
      string,
      unknown
    >[];

    expect(nodes.filter((node) => node['@id'] === '#organization')).toHaveLength(1);
    expect(nodes).toHaveLength(4);
    expect(nodes.slice(1)).toEqual([
      { '@type': 'WebSite', '@id': '#website', publisher: { '@id': '#organization' } },
      { '@type': 'Service', '@id': '#service', provider: { '@id': '#organization' } },
      { '@type': 'Offer', '@id': '#offer', seller: { '@id': '#organization' } },
    ]);
  });

  it('merges different discovered objects sharing the same @id into one node', () => {
    const publisher = {
      '@type': 'Organization',
      '@id': '#organization',
      name: 'Acme',
    };
    const provider = {
      '@type': 'Organization',
      '@id': '#organization',
      url: 'https://example.com',
    };
    const website = { '@type': 'WebSite', '@id': '#website', publisher };
    const service = { '@type': 'Service', '@id': '#service', provider };

    const nodes = buildJsonLdGraph([website, service])?.['@graph'] as Record<string, unknown>[];
    const organizations = nodes.filter((node) => node['@id'] === '#organization');

    expect(organizations).toEqual([
      {
        '@type': 'Organization',
        '@id': '#organization',
        name: 'Acme',
        url: 'https://example.com',
      },
    ]);
    expect(nodes.slice(1)).toEqual([
      { '@type': 'WebSite', '@id': '#website', publisher: { '@id': '#organization' } },
      { '@type': 'Service', '@id': '#service', provider: { '@id': '#organization' } },
    ]);
  });

  it('never mutates deeply frozen user input', () => {
    const organization = Object.freeze({
      '@type': 'Organization',
      '@id': '#organization',
      name: 'Acme',
      sameAs: Object.freeze(['https://social.example/acme']),
    });
    const website = Object.freeze({
      '@type': 'WebSite',
      '@id': '#website',
      publisher: organization,
    });

    const graph = buildJsonLdGraph(website, { baseUrl: 'https://example.com' });

    expect(website.publisher).toBe(organization);
    expect(organization['@id']).toBe('#organization');
    expect(graph?.['@graph']).toHaveLength(2);
  });

  it('produces stable node order and serialization for the same input', () => {
    const organization = { '@type': 'Organization', '@id': '#organization', name: 'Acme' };
    const website = {
      '@type': 'WebSite',
      '@id': '#website',
      publisher: organization,
    };
    const page = { '@type': 'WebPage', '@id': '#page', isPartOf: website };

    const outputs = Array.from({ length: 3 }, () =>
      serializeJsonLd(buildJsonLdGraph(page, { baseUrl: 'https://example.com' }))
    );

    const stableGraph = buildJsonLdGraph(page, { baseUrl: 'https://example.com' });
    const stableNodes = stableGraph?.['@graph'];

    expect(new Set(outputs).size).toBe(1);
    expect(Array.isArray(stableNodes)).toBe(true);
    expect((stableNodes as Record<string, unknown>[]).map((node) => node['@id'])).toEqual([
      'https://example.com/#organization',
      'https://example.com/#website',
      'https://example.com/#page',
    ]);
  });

  it('is idempotent for an already normalized graph document', () => {
    const data = {
      '@type': 'WebSite',
      '@id': '#website',
      publisher: {
        '@type': 'Organization',
        '@id': '#organization',
        name: 'Acme',
      },
    };

    const once = buildJsonLdGraph(data, { baseUrl: 'https://example.com' });
    const twice = buildJsonLdGraph(once, { baseUrl: 'https://example.com' });

    expect(twice).toEqual(once);
  });

  it('copies and idempotently resolves entity IDs without mutating frozen values', () => {
    const input = Object.freeze({
      '@id': '#page',
      nested: Object.freeze({ '@id': '#organization' }),
    });

    const once = resolveEntityIds(input, 'https://example.com');
    const twice = resolveEntityIds(once, 'https://example.com');
    const copyWithoutResolution = resolveEntityIds(input);

    expect(once).not.toBe(input);
    expect(once.nested).not.toBe(input.nested);
    expect(twice).toEqual(once);
    expect(copyWithoutResolution).toEqual(input);
    expect(copyWithoutResolution).not.toBe(input);
    expect(input['@id']).toBe('#page');
  });

  describe('Step 20 — API Polish & Robustness', () => {
    it('canonicalizes @id consistently regardless of trailing slash in baseUrl', () => {
      // Standalone fragment with and without trailing slash
      expect(resolveId('#org', 'https://example.com/docs')).toBe('https://example.com/docs/#org');
      expect(resolveId('#org', 'https://example.com/docs/')).toBe('https://example.com/docs/#org');
      expect(resolveId('#org', 'https://example.com')).toBe('https://example.com/#org');
      expect(resolveId('#org', 'https://example.com/')).toBe('https://example.com/#org');

      // Relative path
      expect(resolveId('/about#org', 'https://example.com')).toBe('https://example.com/about#org');
      expect(resolveId('/about#org', 'https://example.com/docs')).toBe(
        'https://example.com/about#org'
      );

      // Already absolute HTTP(S) URL
      expect(resolveId('https://example.com/#org', 'https://other.com')).toBe(
        'https://example.com/#org'
      );

      // Non-HTTP URI schemes
      expect(resolveId('urn:isbn:978-3-16-148410-0', 'https://example.com')).toBe(
        'urn:isbn:978-3-16-148410-0'
      );
      expect(resolveId('mailto:contact@example.com', 'https://example.com')).toBe(
        'mailto:contact@example.com'
      );
    });

    it('merges collections and deduplicates entries stably when duplicateStrategy is merge', () => {
      const orgA = {
        '@type': 'Organization',
        '@id': '#org',
        name: 'Acme International',
        sameAs: ['https://github.com/acme', 'https://x.com/acme'],
      };

      const orgB = {
        '@type': 'Organization',
        '@id': '#org',
        sameAs: ['https://x.com/acme', 'https://linkedin.com/company/acme'],
      };

      const graph = buildJsonLdGraph([orgA, orgB], {
        baseUrl: 'https://example.com',
        duplicateStrategy: 'merge',
      });

      const nodes = graph?.['@graph'] as Record<string, unknown>[];
      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('Acme International');
      // Preserves first-seen order and deduplicates https://x.com/acme
      expect(nodes[0].sameAs).toEqual([
        'https://github.com/acme',
        'https://x.com/acme',
        'https://linkedin.com/company/acme',
      ]);
    });

    it('emits structured diagnostics conforming to SchemaDiagnostic contract', () => {
      const diagnostics: unknown[] = [];
      const item = {
        '@type': 'Article',
        '@id': '#article',
        headline: 'Test',
        publisher: { '@id': '#missing-publisher' },
      };

      buildJsonLdGraph(item, {
        baseUrl: 'https://example.com',
        onDiagnostic: (d) => diagnostics.push(d),
      });

      expect(diagnostics).toHaveLength(1);
      const diag = diagnostics[0] as Record<string, unknown>;
      expect(diag.code).toBe('broken-reference');
      expect(diag.severity).toBe('warning');
      expect(diag.id).toBe('https://example.com/#missing-publisher');
      expect(diag.entityId).toBe('https://example.com/#missing-publisher');
      expect(diag.path).toBe('Article.publisher');
      expect(diag.suggestion).toContain('Ensure an entity with @id');
    });
  });
});
