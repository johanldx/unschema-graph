import {
  Article,
  buildJsonLdGraph,
  Event,
  Offer,
  Organization,
  Person,
  Product,
  Review,
  Service,
  serializeJsonLd,
  WebPage,
  WebSite,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('Step 20 — Golden Snapshots of Public Schema.org Graphs', () => {
  const baseUrl = 'https://example.com';

  it('matches golden snapshot for Organization + WebSite + WebPage', () => {
    const org = Organization({
      '@id': '#org',
      name: 'Acme Corp',
      url: 'https://example.com',
      logo: 'https://example.com/logo.png',
    });

    const site = WebSite({
      '@id': '#website',
      name: 'Acme Official',
      url: 'https://example.com',
      publisher: '#org',
    });

    const page = WebPage({
      '@id': '#webpage',
      name: 'About Acme',
      url: 'https://example.com/about',
      isPartOf: '#website',
    });

    const graph = buildJsonLdGraph([org, site, page], { baseUrl });
    const serialized = serializeJsonLd(graph, { pretty: true });

    expect(serialized).toMatchInlineSnapshot(`
      "{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://example.com/#org",
            "name": "Acme Corp",
            "url": "https://example.com",
            "logo": "https://example.com/logo.png"
          },
          {
            "@type": "WebSite",
            "@id": "https://example.com/#website",
            "name": "Acme Official",
            "url": "https://example.com",
            "publisher": {
              "@id": "https://example.com/#org"
            }
          },
          {
            "@type": "WebPage",
            "@id": "https://example.com/#webpage",
            "name": "About Acme",
            "url": "https://example.com/about",
            "isPartOf": {
              "@id": "https://example.com/#website"
            }
          }
        ]
      }"
    `);
  });

  it('matches golden snapshot for Article + author + publisher', () => {
    const author = Person({
      '@id': '#author',
      name: 'Jane Doe',
    });

    const publisher = Organization({
      '@id': '#publisher',
      name: 'Tech Chronicle',
      url: 'https://example.com',
    });

    const article = Article({
      '@id': '#article',
      headline: 'The Future of Web Schemas',
      image: 'https://example.com/images/future.jpg',
      datePublished: '2026-10-01',
      author: '#author',
      publisher: '#publisher',
    });

    const graph = buildJsonLdGraph([author, publisher, article], { baseUrl });
    const serialized = serializeJsonLd(graph, { pretty: true });

    expect(serialized).toMatchInlineSnapshot(`
      "{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": "https://example.com/#author",
            "name": "Jane Doe"
          },
          {
            "@type": "Organization",
            "@id": "https://example.com/#publisher",
            "name": "Tech Chronicle",
            "url": "https://example.com"
          },
          {
            "@type": "Article",
            "@id": "https://example.com/#article",
            "headline": "The Future of Web Schemas",
            "image": "https://example.com/images/future.jpg",
            "datePublished": "2026-10-01",
            "author": {
              "@id": "https://example.com/#author"
            },
            "publisher": {
              "@id": "https://example.com/#publisher"
            }
          }
        ]
      }"
    `);
  });

  it('matches golden snapshot for Product + Offer + seller', () => {
    const seller = Organization({
      '@id': '#store',
      name: 'Flagship Store',
    });

    const offer = Offer({
      '@id': '#offer-1',
      price: 99.99,
      priceCurrency: 'EUR',
      availability: 'InStock',
      seller: '#store',
    });

    const product = Product({
      '@id': '#product',
      name: 'Noise-Cancelling Headphones',
      image: 'https://example.com/headphones.jpg',
      offers: [offer],
    });

    const graph = buildJsonLdGraph([seller, offer, product], { baseUrl });
    const serialized = serializeJsonLd(graph, { pretty: true });

    expect(serialized).toMatchInlineSnapshot(`
      "{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://example.com/#store",
            "name": "Flagship Store"
          },
          {
            "@type": "Offer",
            "@id": "https://example.com/#offer-1",
            "price": 99.99,
            "priceCurrency": "EUR",
            "availability": "InStock",
            "seller": {
              "@id": "https://example.com/#store"
            }
          },
          {
            "@type": "Product",
            "@id": "https://example.com/#product",
            "name": "Noise-Cancelling Headphones",
            "image": "https://example.com/headphones.jpg",
            "offers": [
              {
                "@id": "https://example.com/#offer-1"
              }
            ]
          }
        ]
      }"
    `);
  });

  it('matches golden snapshot for Event + organizer + performers', () => {
    const organizer = Organization({
      '@id': '#org',
      name: 'Tech Events LLC',
    });

    const performer = Person({
      '@id': '#keynote',
      name: 'Grace Hopper',
    });

    const event = Event({
      '@id': '#event',
      name: 'Global Developer Summit 2026',
      startDate: '2026-11-15T09:00:00Z',
      endDate: '2026-11-15T18:00:00Z',
      location: 'Paris Expo, Paris',
      organizer: '#org',
      performer: ['#keynote'],
    });

    const graph = buildJsonLdGraph([organizer, performer, event], { baseUrl });
    const serialized = serializeJsonLd(graph, { pretty: true });

    expect(serialized).toMatchInlineSnapshot(`
      "{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://example.com/#org",
            "name": "Tech Events LLC"
          },
          {
            "@type": "Person",
            "@id": "https://example.com/#keynote",
            "name": "Grace Hopper"
          },
          {
            "@type": "Event",
            "@id": "https://example.com/#event",
            "name": "Global Developer Summit 2026",
            "startDate": "2026-11-15T09:00:00Z",
            "location": "Paris Expo, Paris",
            "endDate": "2026-11-15T18:00:00Z",
            "organizer": {
              "@id": "https://example.com/#org"
            },
            "performer": [
              {
                "@id": "https://example.com/#keynote"
              }
            ]
          }
        ]
      }"
    `);
  });

  it('matches golden snapshot for Service + provider', () => {
    const provider = Organization({
      '@id': '#agency',
      name: 'SEO Pioneers',
      url: 'https://example.com',
    });

    const service = Service({
      '@id': '#service',
      name: 'Technical SEO Audit',
      provider: '#agency',
    });

    const graph = buildJsonLdGraph([provider, service], { baseUrl });
    const serialized = serializeJsonLd(graph, { pretty: true });

    expect(serialized).toMatchInlineSnapshot(`
      "{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://example.com/#agency",
            "name": "SEO Pioneers",
            "url": "https://example.com"
          },
          {
            "@type": "Service",
            "@id": "https://example.com/#service",
            "name": "Technical SEO Audit",
            "provider": {
              "@id": "https://example.com/#agency"
            }
          }
        ]
      }"
    `);
  });

  it('matches golden snapshot for a controlled cyclic graph', () => {
    // Product refers to Review, Review refers to Product
    const product = Product({
      '@id': '#laptop',
      name: 'Ultra Laptop 2026',
      review: Review({
        '@id': '#review-1',
        reviewBody: 'Outstanding engineering.',
        author: 'Tech Reviewer',
        reviewRating: { ratingValue: 5 },
        itemReviewed: '#laptop',
      }),
    });

    const graph = buildJsonLdGraph([product], { baseUrl });
    const serialized = serializeJsonLd(graph, { pretty: true });

    expect(serialized).toMatchInlineSnapshot(`
      "{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Review",
            "@id": "https://example.com/#review-1",
            "author": {
              "@type": "Person",
              "name": "Tech Reviewer"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": 5,
              "bestRating": 5,
              "worstRating": 1
            },
            "reviewBody": "Outstanding engineering.",
            "itemReviewed": {
              "@id": "https://example.com/#laptop"
            }
          },
          {
            "@type": "Product",
            "@id": "https://example.com/#laptop",
            "name": "Ultra Laptop 2026",
            "review": {
              "@id": "https://example.com/#review-1"
            }
          }
        ]
      }"
    `);
  });
});
