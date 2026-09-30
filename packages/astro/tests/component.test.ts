import Schema from '@unschema-graph/astro/Schema.astro';
import {
  Article,
  BreadcrumbList,
  FAQPage,
  Organization,
  withAdditionalTypes,
} from '@unschema-graph/core';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

describe('Schema.astro Component Rendering', () => {
  it('renders a valid <script type="application/ld+json"> tag into HTML', async () => {
    const container = await AstroContainer.create();

    const org = Organization({
      '@id': 'https://example.com/#org',
      name: 'Rootage',
      url: 'https://example.com',
    });

    const html = await container.renderToString(Schema, {
      props: {
        data: org,
      },
    });

    expect(html).toContain('<script type="application/ld+json"');
    expect(html).toContain('"@context":"https://schema.org"');
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"name":"Rootage"');
    expect(html).toContain('</script>');
  });

  it('renders unified @graph when multiple entities are passed via data prop', async () => {
    const container = await AstroContainer.create();

    const article = Article({
      headline: 'Astro Schema Graph Guide',
      image: 'https://example.com/cover.jpg',
      datePublished: '2026-09-28',
      author: 'Johan',
    });

    const breadcrumbs = BreadcrumbList({
      itemListElement: [
        { name: 'Home', item: 'https://example.com' },
        { name: 'Blog', item: 'https://example.com/blog' },
      ],
    });

    const html = await container.renderToString(Schema, {
      props: {
        data: [article, breadcrumbs],
      },
    });

    expect(html).toContain('<script type="application/ld+json"');
    expect(html).toContain('"@graph":[');
    expect(html).toContain('"@type":"Article"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('"position":1');
    expect(html).toContain('"position":2');
  });

  it('renders nothing when data is null, empty, or undefined', async () => {
    const container = await AstroContainer.create();

    const htmlNull = await container.renderToString(Schema, {
      props: {
        data: null,
      },
    });
    expect(htmlNull.trim()).toBe('');

    const htmlEmpty = await container.renderToString(Schema, {
      props: {
        data: [],
      },
    });
    expect(htmlEmpty.trim()).toBe('');
  });

  it('applies baseUrl to resolve relative @ids in component rendering', async () => {
    const container = await AstroContainer.create();

    const faq = FAQPage({
      '@id': '#faq',
      questions: [{ question: 'Est-ce rapide ?', answer: 'Instantané.' }],
    });

    const html = await container.renderToString(Schema, {
      props: {
        data: faq,
        baseUrl: 'https://mon-site.fr',
      },
    });

    expect(html).toContain('"@id":"https://mon-site.fr/#faq"');
  });

  it('applies anti-XSS protection to rendered script tag', async () => {
    const container = await AstroContainer.create();

    const maliciousArticle = Article({
      headline: '</script><script>alert("xss")</script>',
      image: 'https://example.com/img.jpg',
      datePublished: '2026-09-28',
      author: 'Hacker',
    });

    const html = await container.renderToString(Schema, {
      props: {
        data: maliciousArticle,
      },
    });

    // Ensures script tag is NOT closed prematurely
    const openTags = (html.match(/<script/g) || []).length;
    const closeTags = (html.match(/<\/script>/g) || []).length;
    expect(openTags).toBe(1);
    expect(closeTags).toBe(1);
    expect(html).toContain('\\u003c/script\\u003e');
  });

  it('adds locale to a rendered copy without mutating the caller entity', async () => {
    const container = await AstroContainer.create();
    const article = Article({
      headline: 'Localized article',
      image: 'https://example.com/localized.jpg',
      datePublished: '2026-09-29',
      author: 'Alice',
    });

    const html = await container.renderToString(Schema, {
      props: { data: article, inLanguage: 'fr' },
    });

    expect(html).toContain('"inLanguage":"fr"');
    expect(article.inLanguage).toBeUndefined();
  });

  it('recognizes language-aware entities with multiple @types', async () => {
    const container = await AstroContainer.create();
    const article = withAdditionalTypes(
      Article({
        headline: 'Multi-typed article',
        image: 'https://example.com/multi.jpg',
        datePublished: '2026-09-29',
        author: 'Alice',
      }),
      ['CreativeWork']
    );

    const html = await container.renderToString(Schema, {
      props: { data: article, inLanguage: 'en' },
    });

    expect(html).toContain('"inLanguage":"en"');
    expect(article.inLanguage).toBeUndefined();
  });
});
