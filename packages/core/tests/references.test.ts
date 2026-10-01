import {
  Article,
  BreadcrumbList,
  EntityIdSchema,
  Event,
  entityRef,
  isIdReference,
  Offer,
  Organization,
  OrganizationSchema,
  Person,
  Product,
  RelativeOrAbsoluteUrlSchema,
  Review,
  Service,
  TypedEntitySchema,
  WebPage,
  WebSite,
  WebUrlSchema,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('entity relationships', () => {
  it('distinguishes entity IDs, references, and web URLs through dedicated primitives', () => {
    expect(EntityIdSchema.parse(' #organization ')).toBe('#organization');
    expect(isIdReference('#organization')).toBe(true);
    expect(isIdReference('/about#webpage')).toBe(true);
    expect(isIdReference('did:example:123')).toBe(true);
    expect(isIdReference('mailto:hello@example.com')).toBe(true);
    expect(isIdReference('tel:+33123456789')).toBe(true);
    expect(isIdReference('Acme Corp')).toBe(false);

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

  it('normalizes entity references idempotently', () => {
    const referenceSchema = entityRef({ schemas: [OrganizationSchema] });
    const once = referenceSchema.parse('#organization');
    const twice = referenceSchema.parse(once);

    expect(twice).toEqual(once);
  });
});
