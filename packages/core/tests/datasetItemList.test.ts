import {
  buildJsonLdGraph,
  DataDownload,
  Dataset,
  ItemList,
  Organization,
  SchemaValidationError,
  serializeJsonLd,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('Dataset & ItemList Schemas', () => {
  describe('Dataset & DataDownload', () => {
    it('creates a valid Dataset with download distribution', () => {
      const dataset = Dataset({
        name: 'Open Data Tourisme Paris 2026',
        description: 'Statistiques de fréquentation touristique à Paris.',
        license: 'https://creativecommons.org/licenses/by/4.0/',
        creator: Organization({
          name: 'Mairie de Paris',
          url: 'https://paris.fr',
        }),
        distribution: [
          DataDownload({
            contentUrl: 'https://paris.fr/data/tourisme-2026.csv',
            encodingFormat: 'text/csv',
          }),
        ],
        keywords: ['tourisme', 'paris', 'opendata'],
      });

      expect(dataset['@type']).toBe('Dataset');
      expect(dataset.name).toBe('Open Data Tourisme Paris 2026');
      expect(dataset.distribution).toEqual([
        {
          '@type': 'DataDownload',
          contentUrl: 'https://paris.fr/data/tourisme-2026.csv',
          encodingFormat: 'text/csv',
        },
      ]);
    });

    it('throws when Dataset name or description is missing', () => {
      expect(() =>
        // @ts-expect-error Missing description
        Dataset({ name: 'Incomplete Dataset' })
      ).toThrowError(SchemaValidationError);
    });
  });

  describe('ItemList (Carousels)', () => {
    it('creates a valid ItemList with automatic position indexing', () => {
      const carousel = ItemList({
        name: 'Top 3 Meilleurs Frameworks Web',
        itemListElement: [
          { name: 'Astro', url: 'https://astro.build' },
          { name: 'SvelteKit', url: 'https://kit.svelte.dev' },
          { name: 'Next.js', url: 'https://nextjs.org' },
        ],
      });

      expect(carousel['@type']).toBe('ItemList');
      expect(carousel.name).toBe('Top 3 Meilleurs Frameworks Web');
      expect(carousel.itemListElement).toEqual([
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Astro',
          url: 'https://astro.build',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'SvelteKit',
          url: 'https://kit.svelte.dev',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Next.js',
          url: 'https://nextjs.org',
        },
      ]);
    });

    it('throws when itemListElement is empty', () => {
      expect(() => ItemList({ itemListElement: [] })).toThrowError(SchemaValidationError);
    });
  });

  describe('Graph Integration', () => {
    it('bundles Dataset and ItemList into unified @graph', () => {
      const ds = Dataset({
        name: 'Geo Data',
        description: 'GeoJSON des frontières.',
      });

      const list = ItemList({
        itemListElement: [{ name: 'Step 1' }],
      });

      const graph = buildJsonLdGraph([ds, list]);
      const json = serializeJsonLd(graph);

      expect(json).toContain('"@type":"Dataset"');
      expect(json).toContain('"@type":"ItemList"');
      const parsed = JSON.parse(json);
      expect(parsed['@graph']).toHaveLength(2);
    });
  });
});
