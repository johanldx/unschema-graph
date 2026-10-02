import Schema from '@unschema-graph/astro/Schema.astro';
import {
  Article,
  BreadcrumbList,
  FAQPage,
  Organization,
  resetGlobalConfig,
  setGlobalConfig,
  withAdditionalTypes,
} from '@unschema-graph/core';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Schema.astro Component Rendering', () => {
  beforeEach(() => {
    resetGlobalConfig();
  });

  afterEach(() => {
    resetGlobalConfig();
  });

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

  it('gives component props precedence over global integration defaults', async () => {
    const container = await AstroContainer.create();
    setGlobalConfig({ baseUrl: 'https://global.example', inLanguage: 'fr-FR' });
    const article = Article({ '@id': '#article', headline: 'Explicit rendering options' });

    const html = await container.renderToString(Schema, {
      props: {
        item: article,
        baseUrl: 'https://prop.example',
        inLanguage: 'en-GB',
      },
    });

    expect(html).toContain('"@id":"https://prop.example/#article"');
    expect(html).toContain('"inLanguage":"en-GB"');
    expect(html).not.toContain('https://global.example');
    expect(html).not.toContain('fr-FR');
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

  it('renders stable zero-JS output with deterministic global defaults and no mutation', async () => {
    const container = await AstroContainer.create();
    setGlobalConfig({ baseUrl: 'https://configured.example', inLanguage: 'fr-FR' });
    const article = Object.freeze(
      Article({
        '@id': '#article',
        headline: 'Stable article',
        author: 'Ada',
      })
    );

    const first = await container.renderToString(Schema, { props: { item: article } });
    const second = await container.renderToString(Schema, { props: { item: article } });

    expect(second).toBe(first);
    expect(first).toContain('"@id":"https://configured.example/#article"');
    expect(first).toContain('"inLanguage":"fr-FR"');
    expect(first).toContain('data-unschema-base-url="https%3A%2F%2Fconfigured.example"');
    expect(first).toContain('data-unschema-locale="fr-FR"');
    expect(first).not.toMatch(/client:|astro-island|type="module"/);
    expect((first.match(/<script/g) ?? []).length).toBe(1);
    expect(article['@id']).toBe('#article');
    expect(article.inLanguage).toBeUndefined();
  });

  it('exposes merge and broken-reference diagnostics to the dev toolbar safely', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Schema, {
      props: {
        items: [
          { '@type': 'Organization', '@id': '#org', name: 'First' },
          { '@type': 'Organization', '@id': '#org', name: 'Second' },
          { '@type': 'WebSite', publisher: { '@id': '#missing' } },
        ],
      },
    });

    expect(html).toContain('data-unschema-diagnostics=');
    expect(html).toContain('duplicate-conflict');
    expect(html).toContain('broken-reference');
    expect((html.match(/<script/g) ?? []).length).toBe(1);
  });

  it('escapes untrusted debug metadata as well as JSON-LD content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Schema, {
      props: {
        item: Article({ headline: 'Safe' }),
        baseUrl: 'https://example.com/--><script>alert(1)</script>',
        inLanguage: '--><img src=x onerror=alert(1)>',
        debug: true,
      },
    });

    expect((html.match(/<script/g) ?? []).length).toBe(1);
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });
});
