import {
  buildJsonLdGraph,
  GeoCoordinates,
  ImageObject,
  LocalBusiness,
  Organization,
  Person,
  PostalAddress,
  Restaurant,
  SchemaValidationError,
  Store,
  serializeJsonLd,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('schemas/identity', () => {
  describe('Person', () => {
    it('creates a valid Person entity', () => {
      const person = Person({
        '@id': 'https://example.com/authors/johan#person',
        name: 'Johan Ledoux',
        url: 'https://example.com/authors/johan',
        jobTitle: 'Software Architect',
        email: 'johan@example.com',
        sameAs: ['https://github.com/johanldx', 'https://twitter.com/johanldx'],
      });

      expect(person).toEqual({
        '@type': 'Person',
        '@id': 'https://example.com/authors/johan#person',
        name: 'Johan Ledoux',
        url: 'https://example.com/authors/johan',
        jobTitle: 'Software Architect',
        email: 'johan@example.com',
        sameAs: ['https://github.com/johanldx', 'https://twitter.com/johanldx'],
      });
    });

    it('throws when required name is missing', () => {
      expect(() =>
        // @ts-expect-error Testing missing required name
        Person({ url: 'https://example.com' })
      ).toThrowError(SchemaValidationError);
    });

    it('throws when email is invalid format', () => {
      expect(() => Person({ name: 'Johan', email: 'not-an-email' })).toThrowError(
        SchemaValidationError
      );
    });
  });

  describe('Organization', () => {
    it('creates a valid Organization entity with logo and address', () => {
      const address = PostalAddress({
        streetAddress: '123 Tech Lane',
        addressLocality: 'Paris',
        postalCode: '75001',
        addressCountry: 'FR',
      });

      const logo = ImageObject({
        url: 'https://example.com/logo.png',
        width: 600,
        height: 60,
      });

      const org = Organization({
        '@id': 'https://example.com/#org',
        name: 'Rootage',
        url: 'https://example.com',
        logo,
        address,
      });

      expect(org).toEqual({
        '@type': 'Organization',
        '@id': 'https://example.com/#org',
        name: 'Rootage',
        url: 'https://example.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.png',
          width: 600,
          height: 60,
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 Tech Lane',
          addressLocality: 'Paris',
          postalCode: '75001',
          addressCountry: 'FR',
        },
      });
    });

    it('throws when Organization name is missing', () => {
      expect(() =>
        // @ts-expect-error Testing missing required name
        Organization({ url: 'https://example.com' })
      ).toThrowError(SchemaValidationError);
    });
  });

  describe('LocalBusiness & Subtypes', () => {
    it('creates a valid LocalBusiness with address and geo coordinates', () => {
      const business = LocalBusiness({
        '@id': 'https://bistrot.fr/#business',
        name: 'Le Bistrot Parisien',
        address: {
          streetAddress: '10 Rue de la Paix',
          addressLocality: 'Paris',
          postalCode: '75002',
          addressCountry: 'FR',
        },
        geo: GeoCoordinates({
          latitude: 48.8698,
          longitude: 2.3315,
        }),
        telephone: '+33 1 23 45 67 89',
        priceRange: '€€',
      });

      expect(business).toEqual({
        '@type': 'LocalBusiness',
        '@id': 'https://bistrot.fr/#business',
        name: 'Le Bistrot Parisien',
        address: {
          streetAddress: '10 Rue de la Paix',
          addressLocality: 'Paris',
          postalCode: '75002',
          addressCountry: 'FR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 48.8698,
          longitude: 2.3315,
        },
        telephone: '+33 1 23 45 67 89',
        priceRange: '€€',
      });
    });

    it('throws when address is missing for LocalBusiness', () => {
      expect(() =>
        // @ts-expect-error Testing missing address
        LocalBusiness({ name: 'Nameless Store' })
      ).toThrowError(SchemaValidationError);
    });

    it('Restaurant and Store inherit validation and set correct @type', () => {
      const bistro = Restaurant({
        name: 'Chez Pierre',
        address: '15 Boulevard Saint-Germain, Paris',
        servesCuisine: ['French', 'Bistro'],
        hasMenu: '/menu',
      });
      expect(bistro).toMatchObject({
        '@type': 'Restaurant',
        servesCuisine: ['French', 'Bistro'],
        hasMenu: '/menu',
      });

      const boutique = Store({
        name: 'Mode & Style',
        address: '25 Rue de Rivoli, Paris',
      });
      expect(boutique['@type']).toBe('Store');
    });

    it('keeps food-establishment properties scoped to Restaurant', () => {
      expect(() =>
        LocalBusiness({
          name: 'Generic business',
          address: '1 Main Street',
          // @ts-expect-error servesCuisine belongs to FoodEstablishment types
          servesCuisine: 'French',
        })
      ).toThrowError(SchemaValidationError);

      expect(() =>
        Store({
          name: 'Generic store',
          address: '2 Main Street',
          // @ts-expect-error hasMenu belongs to FoodEstablishment types
          hasMenu: '/menu',
        })
      ).toThrowError(SchemaValidationError);
    });

    it('rejects the superseded Restaurant.menu property', () => {
      expect(() =>
        Restaurant({
          name: 'Legacy restaurant',
          address: '3 Main Street',
          // @ts-expect-error menu was replaced by Schema.org hasMenu
          menu: '/legacy-menu',
        })
      ).toThrowError(SchemaValidationError);
    });
  });

  describe('Graph Integration', () => {
    it('combines identity entities into a clean JSON-LD graph', () => {
      const org = Organization({
        '@id': 'https://example.com/#org',
        name: 'Company Inc',
        url: 'https://example.com',
      });

      const founder = Person({
        '@id': 'https://example.com/people/founder#person',
        name: 'Alice Smith',
        worksFor: { '@id': 'https://example.com/#org' },
      });

      const graph = buildJsonLdGraph([org, founder]);
      const jsonLd = serializeJsonLd(graph);

      expect(jsonLd).toContain('"@context":"https://schema.org"');
      expect(jsonLd).toContain('"@graph":[');
      expect(jsonLd).toContain('"@type":"Organization"');
      expect(jsonLd).toContain('"@type":"Person"');

      const parsed = JSON.parse(jsonLd);
      expect(parsed['@graph']).toHaveLength(2);
    });
  });
});
