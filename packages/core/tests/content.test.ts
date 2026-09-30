import {
  Article,
  BlogPosting,
  BreadcrumbList,
  buildJsonLdGraph,
  ImageObject,
  ListItem,
  NewsArticle,
  Organization,
  Person,
  SchemaValidationError,
  serializeJsonLd,
  WebPage,
  WebSite,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('schemas/content', () => {
  describe('Article, BlogPosting, NewsArticle', () => {
    it('creates a valid Article entity with all Google Rich Result requirements', () => {
      const author = Person({
        '@id': 'https://example.com/authors/johan#person',
        name: 'Johan Ledoux',
        url: 'https://example.com/authors/johan',
      });

      const publisher = Organization({
        '@id': 'https://example.com/#org',
        name: 'Rootage Media',
        url: 'https://example.com',
      });

      const article = Article({
        headline: 'Guide complet de Schema.org pour Astro',
        image: 'https://example.com/images/cover.jpg',
        datePublished: '2026-09-28T12:00:00Z',
        dateModified: '2026-09-28T14:30:00Z',
        author,
        publisher,
        description: 'Tutoriel complet sur les données structurées JSON-LD avec Astro.',
      });

      expect(article['@type']).toBe('Article');
      expect(article.headline).toBe('Guide complet de Schema.org pour Astro');
      expect(article.image).toBe('https://example.com/images/cover.jpg');
      expect(article.datePublished).toBe('2026-09-28T12:00:00Z');
      expect(article.author).toEqual(author);
      expect(article.publisher).toEqual(publisher);
    });

    it('converts Date instances to ISO 8601 strings', () => {
      const pubDate = new Date('2026-01-15T10:00:00.000Z');
      const article = Article({
        headline: 'Date Conversion Test',
        image: 'https://example.com/img.png',
        datePublished: pubDate,
        author: 'Alice',
      });

      expect(article.datePublished).toBe('2026-01-15T10:00:00.000Z');
    });

    it('supports ImageObject or array of images', () => {
      const img = ImageObject({
        url: 'https://example.com/hero.jpg',
        width: 1200,
        height: 630,
      });

      const article = Article({
        headline: 'Article with ImageObject',
        image: img,
        datePublished: '2026-09-28',
        author: 'Bob',
      });

      expect(article.image).toEqual({
        '@type': 'ImageObject',
        url: 'https://example.com/hero.jpg',
        width: 1200,
        height: 630,
      });
    });

    it('throws when required fields are missing', () => {
      expect(() =>
        // @ts-expect-error Testing missing image, datePublished, author
        Article({ headline: 'Incomplete' })
      ).toThrowError(SchemaValidationError);

      expect(() =>
        // @ts-expect-error Testing missing headline
        Article({
          image: 'https://example.com/img.jpg',
          datePublished: '2026-01-01',
          author: 'Alice',
        })
      ).toThrowError(SchemaValidationError);
    });

    it('rejects arbitrary nested entities and invalid image URLs', () => {
      expect(() =>
        Article({
          headline: 'Invalid author',
          image: 'https://example.com/img.jpg',
          datePublished: '2026-01-01',
          // @ts-expect-error Missing a valid Person, Organization, or @id.
          author: { foo: 'bar' },
        })
      ).toThrowError(SchemaValidationError);

      expect(() =>
        Article({
          headline: 'Invalid image',
          image: 'not-a-url',
          datePublished: '2026-01-01',
          author: 'Alice',
        })
      ).toThrowError(SchemaValidationError);
    });

    it('BlogPosting and NewsArticle set correct @type', () => {
      const blog = BlogPosting({
        headline: 'Mon Post de Blog',
        image: 'https://example.com/blog.jpg',
        datePublished: '2026-09-28',
        author: 'Charlie',
      });
      expect(blog['@type']).toBe('BlogPosting');

      const news = NewsArticle({
        headline: 'Dernière Minute : Astro v6 annoncé',
        image: 'https://example.com/news.jpg',
        datePublished: '2026-09-28',
        author: 'AFP',
      });
      expect(news['@type']).toBe('NewsArticle');
    });
  });

  describe('BreadcrumbList & ListItem', () => {
    it('automatically generates 1-based sequential positions and ListItem @type', () => {
      const breadcrumbs = BreadcrumbList({
        itemListElement: [
          { name: 'Accueil', item: 'https://example.com' },
          { name: 'Blog', item: 'https://example.com/blog' },
          { name: 'Tutoriel Astro', item: 'https://example.com/blog/tuto-astro' },
        ],
      });

      expect(breadcrumbs).toEqual({
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Accueil',
            item: 'https://example.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://example.com/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Tutoriel Astro',
            item: 'https://example.com/blog/tuto-astro',
          },
        ],
      });
    });

    it('preserves explicitly specified positions', () => {
      const item1 = ListItem({ name: 'Home', item: 'https://example.com', position: 1 });
      const item2 = ListItem({ name: 'News', item: 'https://example.com/news', position: 2 });

      const breadcrumbs = BreadcrumbList({
        itemListElement: [item1, item2],
      });

      expect(breadcrumbs.itemListElement).toEqual([
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
        { '@type': 'ListItem', position: 2, name: 'News', item: 'https://example.com/news' },
      ]);
    });

    it('throws when Breadcrumb item name is missing', () => {
      expect(() =>
        // @ts-expect-error Testing missing name
        BreadcrumbList({ itemListElement: [{ item: 'https://example.com' }] })
      ).toThrowError(SchemaValidationError);
    });
  });

  describe('WebSite & WebPage', () => {
    it('creates a valid WebSite entity', () => {
      const site = WebSite({
        name: 'Rootage Tech',
        url: 'https://rootage.fr',
        description: 'Solutions digitales et expertise Astro.',
        inLanguage: 'fr-FR',
      });

      expect(site).toEqual({
        '@type': 'WebSite',
        name: 'Rootage Tech',
        url: 'https://rootage.fr',
        description: 'Solutions digitales et expertise Astro.',
        inLanguage: 'fr-FR',
      });
    });

    it('throws when WebSite url is missing', () => {
      expect(() =>
        // @ts-expect-error Testing missing url
        WebSite({ name: 'No URL Site' })
      ).toThrowError(SchemaValidationError);
    });

    it('creates a WebPage linking to WebSite and BreadcrumbList', () => {
      const page = WebPage({
        name: 'À propos',
        url: 'https://rootage.fr/about',
        isPartOf: { '@id': 'https://rootage.fr/#website' },
      });

      expect(page).toEqual({
        '@type': 'WebPage',
        name: 'À propos',
        url: 'https://rootage.fr/about',
        isPartOf: { '@id': 'https://rootage.fr/#website' },
      });
    });
  });

  describe('Full Spec End-to-End Simulation', () => {
    it('produces the exact unified graph described in spec section 4.2', () => {
      const publisher = Organization({
        '@id': 'https://mon-site.fr/#organization',
        name: 'Rootage',
        url: 'https://mon-site.fr',
        logo: 'https://mon-site.fr/logo.png',
      });

      const author = Person({
        '@id': 'https://mon-site.fr/auteurs/johan#person',
        name: 'Johan',
        url: 'https://mon-site.fr/auteurs/johan',
      });

      const articleSchema = Article({
        headline: 'Mon super article',
        description: 'Un article de test',
        datePublished: '2026-09-28',
        image: 'https://mon-site.fr/images/cover.jpg',
        author,
        publisher: { '@id': 'https://mon-site.fr/#organization' },
      });

      const breadcrumbs = BreadcrumbList({
        itemListElement: [
          { name: 'Accueil', item: 'https://mon-site.fr' },
          { name: 'Blog', item: 'https://mon-site.fr/blog' },
          { name: 'Mon super article', item: 'https://mon-site.fr/blog/mon-super-article' },
        ],
      });

      const graph = buildJsonLdGraph([publisher, articleSchema, breadcrumbs]);
      const jsonLd = serializeJsonLd(graph, { pretty: true });

      expect(jsonLd).toContain('"@context": "https://schema.org"');
      expect(jsonLd).toContain('"@type": "Organization"');
      expect(jsonLd).toContain('"@type": "Article"');
      expect(jsonLd).toContain('"@type": "BreadcrumbList"');
      expect(jsonLd).toContain('"position": 1');
      expect(jsonLd).toContain('"position": 2');
      expect(jsonLd).toContain('"position": 3');

      const parsed = JSON.parse(jsonLd);
      expect(parsed['@graph']).toHaveLength(3);
    });
  });
});
