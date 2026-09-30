import {
  Article,
  BreadcrumbList,
  buildJsonLdGraph,
  formatIsoDuration,
  HowTo,
  JobPosting,
  Product,
  Recipe,
  Service,
  VideoObject,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('DX Pack Features', () => {
  describe('Duration parsing and ISO 8601 formatting', () => {
    it('parses human-readable duration strings', () => {
      expect(formatIsoDuration('45m')).toBe('PT45M');
      expect(formatIsoDuration('1h30')).toBe('PT1H30M');
      expect(formatIsoDuration('1h30m')).toBe('PT1H30M');
      expect(formatIsoDuration('2h')).toBe('PT2H');
      expect(formatIsoDuration('15s')).toBe('PT15S');
      expect(formatIsoDuration('2d')).toBe('P2D');
    });

    it('parses numeric minutes', () => {
      expect(formatIsoDuration(45)).toBe('PT45M');
      expect(formatIsoDuration(120)).toBe('PT120M');
    });

    it('parses duration object representations', () => {
      expect(formatIsoDuration({ hours: 1, minutes: 15 })).toBe('PT1H15M');
      expect(formatIsoDuration({ days: 1, hours: 2, minutes: 30, seconds: 10 })).toBe(
        'P1DT2H30M10S'
      );
      expect(formatIsoDuration({ seconds: 45 })).toBe('PT45S');
    });

    it('preserves existing ISO 8601 durations', () => {
      expect(formatIsoDuration('PT1H30M')).toBe('PT1H30M');
      expect(formatIsoDuration('P1DT4H')).toBe('P1DT4H');
    });

    it('seamlessly formats durations inside Recipe, HowTo, and VideoObject', () => {
      const recipe = Recipe({
        name: 'Tarte aux Pommes',
        image: 'https://site.fr/tarte.jpg',
        recipeIngredient: ['Pommes', 'Pâte feuilletée'],
        recipeInstructions: ['Éplucher les pommes', 'Enfourner à 180°C'],
        prepTime: '20m',
        cookTime: 40, // 40 minutes as number
        totalTime: '1h',
      });

      expect(recipe.prepTime).toBe('PT20M');
      expect(recipe.cookTime).toBe('PT40M');
      expect(recipe.totalTime).toBe('PT1H');

      const howTo = HowTo({
        name: 'Changer une roue',
        totalTime: { hours: 1, minutes: 15 },
        step: ['Desserrer les écrous', 'Lever le cric', 'Remplacer la roue'],
      });
      expect(howTo.totalTime).toBe('PT1H15M');

      const video = VideoObject({
        name: 'Tutoriel Astro',
        description: 'Guide complet Astro 5',
        thumbnailUrl: 'https://site.fr/thumb.jpg',
        uploadDate: '2026-09-28',
        duration: '12m30s',
      });
      expect(video.duration).toBe('PT12M30S');
    });
  });

  describe('Magic @id string reference & entity resolution', () => {
    it('normalizes string ID references into @id objects', () => {
      const article = Article({
        headline: 'Astro 5 SEO Guide',
        image: 'https://site.fr/seo.jpg',
        datePublished: '2026-09-28',
        author: '#author-john',
        publisher: '#organization-rootage',
      });

      expect(article.author).toEqual({ '@id': '#author-john' });
      expect(article.publisher).toEqual({ '@id': '#organization-rootage' });

      const product = Product({
        name: 'Mechanical Keyboard',
        brand: '#keychron',
      });
      expect(product.brand).toEqual({ '@id': '#keychron' });

      const job = JobPosting({
        title: 'Senior Frontend Engineer',
        description: 'Full remote Astro expert wanted',
        datePosted: '2026-09-28',
        hiringOrganization: '#rootage-org',
      });
      expect(job.hiringOrganization).toEqual({ '@id': '#rootage-org' });

      const service = Service({
        name: 'SEO Consulting',
        provider: '#seo-agency',
      });
      expect(service.provider).toEqual({ '@id': '#seo-agency' });
    });

    it('resolves nested relative @id references into canonical URLs in buildJsonLdGraph', () => {
      const article = Article({
        '@id': '#my-post',
        headline: 'Guide',
        image: 'https://site.fr/image.jpg',
        datePublished: '2026-09-28',
        author: '#author',
        publisher: '/about#org',
      });

      const graph = buildJsonLdGraph([article], { baseUrl: 'https://mon-site.fr' });
      const item = (graph as any)['@graph'][0];

      expect(item['@id']).toBe('https://mon-site.fr/#my-post');
      expect(item.author).toEqual({ '@id': 'https://mon-site.fr/#author' });
      expect(item.publisher).toEqual({ '@id': 'https://mon-site.fr/about#org' });
    });

    it('automatically converts plain string author and brand into compliant entities', () => {
      const article = Article({
        headline: 'Guide Astro',
        image: 'https://site.fr/cover.jpg',
        datePublished: '2026-09-28',
        author: 'Marie Curie',
        publisher: 'Académie des Sciences',
      });

      expect(article.author).toEqual({
        '@type': 'Person',
        name: 'Marie Curie',
      });
      expect(article.publisher).toEqual({
        '@type': 'Organization',
        name: 'Académie des Sciences',
      });

      const product = Product({
        name: 'Chaussures de running',
        brand: 'Nike',
      });
      expect(product.brand).toEqual({
        '@type': 'Brand',
        name: 'Nike',
      });
    });
  });

  describe('Breadcrumb relative URL resolution & leaf nodes', () => {
    it('resolves relative URLs in BreadcrumbList', () => {
      const breadcrumb = BreadcrumbList({
        itemListElement: [
          { name: 'Accueil', item: '/' },
          { name: 'Blog', item: '/blog' },
          { name: 'Article' }, // Leaf node without explicit URL
        ],
      });

      const graph = buildJsonLdGraph([breadcrumb], {
        baseUrl: 'https://mon-site.fr/blog/mon-article',
      });
      const item = (graph as any)['@graph'][0];

      expect(item.itemListElement[0].item).toBe('https://mon-site.fr/');
      expect(item.itemListElement[1].item).toBe('https://mon-site.fr/blog');
      // Leaf node without item is valid Schema.org
      expect(item.itemListElement[2].name).toBe('Article');
      expect(item.itemListElement[2].item).toBeUndefined();
    });
  });
});
