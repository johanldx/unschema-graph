import { toArticle, toBlogPosting } from '@unschema-graph/astro/content';
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
    expect(blogPost.mainEntityOfPage).toBe('https://mon-site.fr/blog/astro-5-guide');
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
    expect(() =>
      toArticle({
        data: {
          title: 'No author',
          image: 'https://example.com/no-author.jpg',
          pubDate: '2026-09-29',
        },
      })
    ).toThrow(SchemaValidationError);
  });
});
