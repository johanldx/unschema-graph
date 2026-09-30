import {
  AggregateOffer,
  AggregateRating,
  Answer,
  buildJsonLdGraph,
  Event,
  FAQPage,
  Offer,
  PostalAddress,
  Product,
  Question,
  Review,
  SchemaValidationError,
  serializeJsonLd,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('schemas/commerce & interaction', () => {
  describe('Offer & AggregateOffer', () => {
    it('creates a valid Offer with required price and 3-letter currency', () => {
      const offer = Offer({
        price: 49.99,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2027-12-31',
      });

      expect(offer).toEqual({
        '@type': 'Offer',
        price: 49.99,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2027-12-31',
      });
    });

    it('throws when priceCurrency is not 3 letters', () => {
      expect(() => Offer({ price: 10, priceCurrency: 'EURO' })).toThrowError(SchemaValidationError);

      expect(() => Offer({ price: 10, priceCurrency: 'E' })).toThrowError(SchemaValidationError);
    });

    it('creates a valid AggregateOffer', () => {
      const aggOffer = AggregateOffer({
        lowPrice: 29.99,
        highPrice: 89.99,
        priceCurrency: 'USD',
        offerCount: 5,
      });

      expect(aggOffer).toEqual({
        '@type': 'AggregateOffer',
        lowPrice: 29.99,
        highPrice: 89.99,
        priceCurrency: 'USD',
        offerCount: 5,
      });
    });
  });

  describe('Review & AggregateRating', () => {
    it('creates a valid Review with rating and author', () => {
      const review = Review({
        author: 'Marie Curie',
        reviewRating: {
          ratingValue: 5,
          bestRating: 5,
        },
        reviewBody: 'Produit exceptionnel et ergonomique.',
        datePublished: '2026-09-20',
      });

      expect(review['@type']).toBe('Review');
      expect(review.author).toEqual({
        '@type': 'Person',
        name: 'Marie Curie',
      });
      expect(review.reviewRating).toEqual({
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
      });
    });

    it('creates a valid AggregateRating', () => {
      const rating = AggregateRating({
        ratingValue: 4.8,
        ratingCount: 124,
      });

      expect(rating).toEqual({
        '@type': 'AggregateRating',
        ratingValue: 4.8,
        ratingCount: 124,
        bestRating: 5,
        worstRating: 1,
      });
    });
  });

  describe('Product', () => {
    it('creates a complete Product entity with offers and ratings', () => {
      const product = Product({
        '@id': 'https://example.com/products/pro-keyboard#product',
        name: 'Clavier Mécanique Pro',
        description: 'Clavier silencieux pour développeurs.',
        image: 'https://example.com/keyboard.jpg',
        sku: 'KB-PRO-01',
        gtin13: '1234567890123',
        brand: 'TechBrand',
        offers: Offer({
          price: 129.99,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        }),
        aggregateRating: AggregateRating({
          ratingValue: 4.9,
          reviewCount: 38,
        }),
      });

      expect(product['@type']).toBe('Product');
      expect(product.name).toBe('Clavier Mécanique Pro');
      expect(product.sku).toBe('KB-PRO-01');
      expect(product.offers).toEqual({
        '@type': 'Offer',
        price: 129.99,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      });
      expect(product.aggregateRating).toEqual({
        '@type': 'AggregateRating',
        ratingValue: 4.9,
        reviewCount: 38,
        bestRating: 5,
        worstRating: 1,
      });
    });

    it('throws when product name is missing', () => {
      expect(() =>
        // @ts-expect-error Testing missing name
        Product({ sku: 'NO-NAME' })
      ).toThrowError(SchemaValidationError);
    });
  });

  describe('FAQPage', () => {
    it('creates a FAQPage via simplified questions shorthand', () => {
      const faq = FAQPage({
        questions: [
          {
            question: 'Comment installer la lib ?',
            answer: 'npm install @unschema-graph/core zod',
          },
          { question: 'Est-ce compatible avec Astro 5 ?', answer: 'Oui, parfaitement compatible.' },
        ],
      });

      expect(faq).toEqual({
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Comment installer la lib ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'npm install @unschema-graph/core zod',
            },
          },
          {
            '@type': 'Question',
            name: 'Est-ce compatible avec Astro 5 ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Oui, parfaitement compatible.',
            },
          },
        ],
      });
    });

    it('creates a FAQPage via explicit Question and Answer entities', () => {
      const faq = FAQPage({
        mainEntity: [
          Question({
            name: 'Livraison gratuite ?',
            acceptedAnswer: Answer({ text: 'Oui à partir de 50€.' }),
          }),
        ],
      });

      expect(faq['@type']).toBe('FAQPage');
      expect(faq.mainEntity).toBeDefined();
      expect(faq.mainEntity![0]['@type']).toBe('Question');
      expect(faq.mainEntity![0].name).toBe('Livraison gratuite ?');
    });

    it('throws when FAQPage has no questions', () => {
      expect(() => FAQPage({ questions: [] })).toThrowError(SchemaValidationError);
    });
  });

  describe('Event', () => {
    it('creates a valid Event entity with date and location', () => {
      const event = Event({
        name: 'Astro Conference 2026',
        startDate: new Date('2026-11-15T09:00:00.000Z'),
        endDate: '2026-11-16T18:00:00.000Z',
        location: {
          '@type': 'Place',
          name: 'Palais des Congrès',
          address: PostalAddress({
            addressLocality: 'Paris',
            postalCode: '75017',
            addressCountry: 'FR',
          }),
        },
        offers: Offer({
          price: 150,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        }),
      });

      expect(event['@type']).toBe('Event');
      expect(event.name).toBe('Astro Conference 2026');
      expect(event.startDate).toBe('2026-11-15T09:00:00.000Z');
      expect(event.location).toEqual({
        '@type': 'Place',
        name: 'Palais des Congrès',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Paris',
          postalCode: '75017',
          addressCountry: 'FR',
        },
      });
    });

    it('throws when Event location or startDate is missing', () => {
      expect(() =>
        // @ts-expect-error Testing missing location
        Event({ name: 'Meetup', startDate: '2026-10-01' })
      ).toThrowError(SchemaValidationError);

      expect(() =>
        // @ts-expect-error Testing missing startDate
        Event({ name: 'Meetup', location: 'Online' })
      ).toThrowError(SchemaValidationError);
    });
  });

  describe('Commerce Graph Integration', () => {
    it('bundles product and FAQ into a single unified JSON-LD graph', () => {
      const product = Product({
        '@id': 'https://shop.fr/#item',
        name: 'Laptop Ultra',
        offers: Offer({ price: 999, priceCurrency: 'EUR' }),
      });

      const faq = FAQPage({
        questions: [{ question: 'Garantie ?', answer: '2 ans constructeur.' }],
      });

      const graph = buildJsonLdGraph([product, faq]);
      const jsonLd = serializeJsonLd(graph);

      expect(jsonLd).toContain('"@context":"https://schema.org"');
      expect(jsonLd).toContain('"@type":"Product"');
      expect(jsonLd).toContain('"@type":"FAQPage"');
      expect(jsonLd).toContain('"price":999');

      const parsed = JSON.parse(jsonLd);
      expect(parsed['@graph']).toHaveLength(2);
    });
  });
});
