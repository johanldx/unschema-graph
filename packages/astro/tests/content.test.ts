import { toArticle, toBlogPosting, toNewsArticle } from '@unschema-graph/astro/content';
import { SchemaValidationError } from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('Astro Content Collections Helpers', () => {
  it('converts Astro content entry into BlogPosting entity', () => {
    const mockEntry = {
      id: 'astro-5-guide.md',
      slug: 'astro-5-guide',
      body: 'Astro 5 is amazing for content driven sites with fast speeds.',
      data: {
        title: 'Astro 5 Guide Complet',
        description: 'Découvrez les nouveautés de la version 5.',
        pubDate: new Date('2026-09-28'),
        image: { src: 'https://mon-site.fr/images/hero.webp', width: 1200, height: 630 },
        author: 'Alice Dupont',
        tags: ['astro', 'seo', 'web'],
      },
    };

    const blogPost = toBlogPosting(mockEntry, {
      url: 'https://mon-site.fr/blog/astro-5-guide',
      publisher: '#rootage',
    });

    expect(blogPost['@type']).toBe('BlogPosting');
    expect(blogPost.headline).toBe('Astro 5 Guide Complet');
    expect(blogPost.description).toBe('Découvrez les nouveautés de la version 5.');
    expect(blogPost.image).toBe('https://mon-site.fr/images/hero.webp');
    expect(blogPost.author).toEqual({
      '@type': 'Person',
      name: 'Alice Dupont',
    });
    expect(blogPost.publisher).toEqual({
      '@id': '#rootage',
    });
    expect(blogPost.keywords).toEqual(['astro', 'seo', 'web']);
    expect(blogPost.wordCount).toBe(11);
    expect(blogPost.mainEntityOfPage).toEqual({
      '@id': 'https://mon-site.fr/blog/astro-5-guide',
    });
    expect('url' in blogPost).toBe(false);
  });

  it('converts Astro content entry into Article entity with fallback values', () => {
    const mockEntry = {
      id: 'news.md',
      data: {
        headline: 'Breaking News',
        date: '2026-09-28',
        cover: '/news.jpg',
      },
    };

    const article = toArticle(mockEntry, {
      author: 'Rédaction',
    });

    expect(article['@type']).toBe('Article');
    expect(article.headline).toBe('Breaking News');
    expect(article.image).toBe('/news.jpg');
    expect(article.author).toEqual({
      '@type': 'Person',
      name: 'Rédaction',
    });
  });

  it('does not invent an author when content metadata is incomplete', () => {
    const article = toArticle({
      data: {
        title: 'No author',
        image: 'https://example.com/no-author.jpg',
        pubDate: '2026-09-29',
      },
    });

    expect(article['@type']).toBe('Article');
    expect(article.author).toBeUndefined();
  });

  it('keeps all three helpers aligned with builder reference normalization', () => {
    const entry = Object.freeze({
      data: Object.freeze({ title: 'Shared mapping', author: 'Ada Lovelace' }),
    });
    const overrides = { url: '#page', publisher: '#publisher' } as const;

    const article = toArticle(entry, overrides);
    const blogPosting = toBlogPosting(entry, overrides);
    const newsArticle = toNewsArticle(entry, overrides);

    expect([article['@type'], blogPosting['@type'], newsArticle['@type']]).toEqual([
      'Article',
      'BlogPosting',
      'NewsArticle',
    ]);
    for (const entity of [article, blogPosting, newsArticle]) {
      expect(entity.author).toEqual({ '@type': 'Person', name: 'Ada Lovelace' });
      expect(entity.publisher).toEqual({ '@id': '#publisher' });
      expect(entity.mainEntityOfPage).toEqual({ '@id': '#page' });
    }
    expect(entry.data).toEqual({ title: 'Shared mapping', author: 'Ada Lovelace' });
  });

  it('surfaces the same actionable relationship errors as manual builders', () => {
    expect(() =>
      toNewsArticle(
        { data: { title: 'Invalid publisher' } },
        {
          publisher: { '@type': 'Product', name: 'Keyboard' } as never,
        }
      )
    ).toThrow(SchemaValidationError);

    let caught: unknown;
    try {
      toArticle(
        { data: { title: 'Invalid publisher' } },
        { publisher: { '@type': 'Product', name: 'Keyboard' } as never }
      );
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(SchemaValidationError);
    const result = caught as SchemaValidationError;
    expect(result.details[0]).toMatchObject({
      path: 'Article.publisher',
      expected: 'Organization | Person | @id reference',
      received: 'Product',
    });
  });
});
