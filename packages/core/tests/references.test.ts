import {
  Article,
  Book,
  BreadcrumbList,
  buildJsonLdGraph,
  Dataset,
  Event,
  entityRef,
  Movie,
  Offer,
  Organization,
  OrganizationSchema,
  Person,
  Product,
  ProfilePage,
  Review,
  Service,
  WebPage,
  WebSite,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';
import {
  EntityIdSchema,
  isIdReference,
  TypedEntitySchema,
} from '../src/schemas/common/reference.js';
import { RelativeOrAbsoluteUrlSchema, WebUrlSchema } from '../src/schemas/common/url.js';

describe('entity relationships', () => {
  it('distinguishes entity IDs, references, and web URLs through dedicated primitives', () => {
    expect(EntityIdSchema.parse(' #organization ')).toBe('#organization');

    for (const reference of [
      '#organization',
      '/about',
      '/about#section',
      './about',
      '../about',
      'https://example.com/#org',
      'http://example.com/#org',
      'urn:example:org',
      'did:example:123',
      'mailto:hello@example.com',
      'tel:+33123456789',
    ]) {
      expect(isIdReference(reference), reference).toBe(true);
    }

    for (const name of [
      'Acme Corp',
      'AC/DC',
      'Foo/Bar Studio',
      'Research / Development',
      'John Doe',
    ]) {
      expect(isIdReference(name), name).toBe(false);
    }

    expect(WebUrlSchema.parse('https://example.com/about')).toBe('https://example.com/about');
    expect(WebUrlSchema.safeParse('/about').success).toBe(false);
    expect(RelativeOrAbsoluteUrlSchema.parse('/about')).toBe('/about');
    expect(RelativeOrAbsoluteUrlSchema.parse('mailto:hello@example.com')).toBe(
      'mailto:hello@example.com'
    );
    expect(RelativeOrAbsoluteUrlSchema.safeParse('plain text').success).toBe(false);
  });

  it('normalizes every supported reference input through one primitive', () => {
    const organization = Organization({ '@id': '#org', name: 'Acme' });
    const organizationRef = entityRef({
      schemas: [OrganizationSchema],
      types: ['Organization'],
      fallbackType: 'Organization',
    });

    expect(organizationRef.parse(organization)).toEqual(organization);
    expect(organizationRef.parse('#org')).toEqual({ '@id': '#org' });
    expect(organizationRef.parse({ '@id': '#org' })).toEqual({ '@id': '#org' });
    expect(organizationRef.parse('Acme')).toEqual({ '@type': 'Organization', name: 'Acme' });
    expect(() => organizationRef.parse(Product({ name: 'Not an organization' }))).toThrow();
  });

  it('keeps passthrough limited to explicitly typed custom relationship entities', () => {
    expect(
      TypedEntitySchema.parse({
        '@type': ['PodcastEpisode', 'PodcastEpisode', 'CreativeWork'],
        name: 'Episode 42',
        customProperty: true,
      })
    ).toEqual({
      '@type': ['PodcastEpisode', 'CreativeWork'],
      name: 'Episode 42',
      customProperty: true,
    });
  });

  it('accepts direct typed entities in the high-priority relation fields', () => {
    const organization = Organization({ '@id': '#org', name: 'Acme' });
    const person = Person({ '@id': '#person', name: 'Ada', worksFor: organization });
    const website = WebSite({
      '@id': '#website',
      name: 'Acme',
      url: 'https://example.com',
      publisher: organization,
    });
    const breadcrumbs = BreadcrumbList({
      '@id': '#breadcrumbs',
      itemListElement: [{ name: 'Home', item: '/' }],
    });
    const product = Product({ '@id': '#product', name: 'Keyboard', brand: organization });

    const article = Article({
      headline: 'Typed relations',
      image: 'https://example.com/image.jpg',
      datePublished: '2026-09-30',
      author: person,
      publisher: organization,
      mainEntityOfPage: website,
    });
    const page = WebPage({ isPartOf: website, breadcrumb: breadcrumbs });
    const event = Event({
      name: 'Launch',
      startDate: '2026-10-01',
      location: 'Paris',
      organizer: organization,
      performer: person,
    });
    const offer = Offer({ price: 99, priceCurrency: 'EUR', seller: organization });
    const service = Service({ name: 'Consulting', provider: organization });
    const review = Review({
      author: person,
      reviewRating: { ratingValue: 5 },
      itemReviewed: product,
    });

    expect(person.worksFor).toEqual(organization);
    expect(website.publisher).toEqual(organization);
    expect(article.author).toEqual(person);
    expect(article.publisher).toEqual(organization);
    expect(article.mainEntityOfPage).toEqual(website);
    expect(page.isPartOf).toEqual(website);
    expect(page.breadcrumb).toEqual(breadcrumbs);
    expect(event.organizer).toEqual(organization);
    expect(event.performer).toEqual(person);
    expect(offer.seller).toEqual(organization);
    expect(product.brand).toEqual(organization);
    expect(service.provider).toEqual(organization);
    expect(review.itemReviewed).toEqual(product);
  });

  it('normalizes relation strings consistently while preserving URL strings', () => {
    const page = WebPage({ url: '/about', isPartOf: '#website' });

    expect(page.url).toBe('/about');
    expect(page.isPartOf).toEqual({ '@id': '#website' });
  });

  it('keeps slash-containing brand names as inline named entities', () => {
    expect(Product({ name: 'Album', brand: 'AC/DC' }).brand).toEqual({
      '@type': 'Brand',
      name: 'AC/DC',
    });
    expect(Product({ name: 'Camera', brand: 'Foo/Bar Studio' }).brand).toEqual({
      '@type': 'Brand',
      name: 'Foo/Bar Studio',
    });
  });

  it('normalizes entity references idempotently', () => {
    const referenceSchema = entityRef({ schemas: [OrganizationSchema] });
    const once = referenceSchema.parse('#organization');
    const twice = referenceSchema.parse(once);

    expect(twice).toEqual(once);
  });

  it('keeps explicit reference forms valid without a fallback type', () => {
    const referenceSchema = entityRef({ schemas: [OrganizationSchema] });

    for (const reference of [
      '#organization',
      '/about#organization',
      './about#organization',
      '../about#organization',
      'https://example.com/#organization',
      'urn:example:organization',
    ]) {
      expect(referenceSchema.parse(reference)).toEqual({ '@id': reference });
    }

    expect(referenceSchema.parse({ '@id': '#organization' })).toEqual({
      '@id': '#organization',
    });
  });

  it('rejects plain relation strings when no fallback type is defined', () => {
    const referenceSchema = entityRef({ schemas: [OrganizationSchema] });
    const result = referenceSchema.safeParse('Acme');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain('Expected an explicit entity reference');
    }

    expect(() => ProfilePage({ mainEntity: 'Ada Lovelace' })).toThrow(
      /Invalid entity relationship/
    );
  });

  it('rejects ambiguous relation objects containing entity data without @type', () => {
    expect(() =>
      ProfilePage({
        mainEntity: {
          '@id': '#ada',
          name: 'Ada Lovelace',
        },
      })
    ).toThrow(/Invalid entity relationship/);

    expect(() =>
      ProfilePage({
        mainEntity: {
          name: 'Ada Lovelace',
        },
      })
    ).toThrow(/Invalid entity relationship/);

    expect(
      ProfilePage({
        mainEntity: {
          '@id': '#ada',
        },
      }).mainEntity
    ).toEqual({
      '@id': '#ada',
    });

    expect(
      ProfilePage({
        mainEntity: Person({
          '@id': '#ada',
          name: 'Ada Lovelace',
        }),
      }).mainEntity
    ).toEqual({
      '@type': 'Person',
      '@id': '#ada',
      name: 'Ada Lovelace',
    });

    expect(
      ProfilePage({
        mainEntity: {
          '@type': 'Person',
          '@id': '#ada',
          name: 'Ada Lovelace',
        },
      }).mainEntity
    ).toMatchObject({
      '@type': 'Person',
      '@id': '#ada',
      name: 'Ada Lovelace',
    });

    expect(() =>
      ProfilePage({
        mainEntity: {
          '@type': 'Product',
          '@id': '#product',
          name: 'Keyboard',
        },
      })
    ).toThrow(/Invalid entity relationship/);
  });

  it('normalizes ProfilePage.mainEntity entity, string ID, and @id object forms', () => {
    const person = Person({ '@id': '#person', name: 'Ada' });

    expect(ProfilePage({ mainEntity: person }).mainEntity).toEqual(person);
    expect(ProfilePage({ mainEntity: '#person' }).mainEntity).toEqual({ '@id': '#person' });
    expect(ProfilePage({ mainEntity: { '@id': '#person' } }).mainEntity).toEqual({
      '@id': '#person',
    });
  });

  it('normalizes Dataset.creator entity, string ID, @id object, and array forms', () => {
    const person = Person({ '@id': '#person', name: 'Ada' });
    const organization = Organization({ '@id': '#organization', name: 'Acme' });

    const dataset = Dataset({
      name: 'People and organizations',
      description: 'Entity relation fixture',
      creator: [person, organization, '#editor', { '@id': '#reviewer' }],
    });
    expect(dataset.creator).toEqual([
      person,
      organization,
      { '@id': '#editor' },
      { '@id': '#reviewer' },
    ]);
    expect(
      Dataset({ name: 'Named creator', description: 'Fixture', creator: 'Ada Lovelace' }).creator
    ).toEqual({ '@type': 'Person', name: 'Ada Lovelace' });
  });

  it('keeps inline Event locations ergonomic and supports identifiable Place references', () => {
    const baseEvent = { name: 'Launch', startDate: '2026-10-01' } as const;

    expect(Event({ ...baseEvent, location: 'Paris' }).location).toBe('Paris');
    expect(Event({ ...baseEvent, location: { '@id': '#venue' } }).location).toEqual({
      '@id': '#venue',
    });

    const event = Event({
      ...baseEvent,
      location: { '@type': 'Place', '@id': '#venue', name: 'Grand Palais' },
    });
    expect(event.location).toEqual({
      '@type': 'Place',
      '@id': '#venue',
      name: 'Grand Palais',
    });

    expect(buildJsonLdGraph(event)?.['@graph']).toEqual([
      { '@type': 'Place', '@id': '#venue', name: 'Grand Palais' },
      {
        '@type': 'Event',
        name: 'Launch',
        startDate: '2026-10-01',
        location: { '@id': '#venue' },
      },
    ]);
  });

  it('uses shared relation semantics for Book and Movie people fields', () => {
    const person = Person({ '@id': '#person', name: 'Ada' });
    const relationForms = [person, '#person', { '@id': '#person' }] as const;

    expect(
      Book({
        name: 'Relations',
        author: [...relationForms],
        publisher: { '@id': '#publisher' },
      }).author
    ).toEqual([person, { '@id': '#person' }, { '@id': '#person' }]);
    expect(Book({ name: 'Publisher object', author: person, publisher: person }).publisher).toEqual(
      person
    );
    expect(
      Book({ name: 'Publisher string', author: person, publisher: '#publisher' }).publisher
    ).toEqual({ '@id': '#publisher' });

    expect(Movie({ name: 'Cast', actor: [...relationForms] }).actor).toEqual([
      person,
      { '@id': '#person' },
      { '@id': '#person' },
    ]);
    expect(Movie({ name: 'Direction', director: [...relationForms] }).director).toEqual([
      person,
      { '@id': '#person' },
      { '@id': '#person' },
    ]);
  });
});
