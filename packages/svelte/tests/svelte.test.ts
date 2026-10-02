import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as sveltePackage from '@unschema-graph/svelte';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import { beforeEach, describe, expect, it } from 'vitest';

describe('@unschema-graph/svelte', () => {
  const sveltePath = fileURLToPath(new URL('../src/Schema.svelte', import.meta.url));

  beforeEach(() => {
    sveltePackage.resetGlobalConfig();
  });

  it('re-exports core builders and utilities', () => {
    expect(typeof sveltePackage.Article).toBe('function');
    expect(typeof sveltePackage.Organization).toBe('function');
    expect(typeof sveltePackage.buildJsonLdGraph).toBe('function');
    expect(typeof sveltePackage.serializeJsonLd).toBe('function');
    expect(typeof sveltePackage.setGlobalConfig).toBe('function');
  });

  it('compiles for Svelte 5 server and client without browser-side effects', () => {
    const source = fs.readFileSync(sveltePath, 'utf-8');
    const server = compile(source, {
      generate: 'server',
      filename: 'Schema.svelte',
    });
    const client = compile(source, {
      generate: 'client',
      filename: 'Schema.svelte',
    });

    expect(server.warnings).toHaveLength(0);
    expect(client.warnings).toHaveLength(0);
    expect(source).toContain('$props()');
    expect(source).toContain('$derived.by');
    expect(source).not.toMatch(/\$effect|onMount|window\.|document\.|addEventListener/);
    expect(client.js.code).not.toMatch(/addEventListener|onMount/);
  });

  it('renders exactly one anti-XSS JSON-LD script in the SvelteKit SSR head', () => {
    const org = sveltePackage.Organization({
      '@id': 'https://example.com/#org',
      name: '</script><script>alert("xss")</script>',
      url: 'https://example.com',
    });

    const rendered = render(sveltePackage.Schema, {
      props: {
        item: org,
        inLanguage: 'fr',
      },
    });

    expect(rendered.head).toContain('<script type="application/ld+json">');
    expect(rendered.head).toContain('"@type":"Organization"');
    expect(rendered.head).toContain('\\u003c/script\\u003e');
    expect(rendered.head).toContain('</script>');
    expect((rendered.head.match(/<script/g) ?? []).length).toBe(1);
    expect(rendered.body.replaceAll(/<!--.*?-->/g, '')).toBe('');
  });

  it('reacts to changed inputs across renders without duplicating the head script', () => {
    const article = sveltePackage.Article({
      '@id': '#article',
      headline: 'Svelte 5 & JSON-LD',
      author: 'Johan',
    });
    const updatedArticle = { ...article, headline: 'Updated Svelte title' };

    const first = render(sveltePackage.Schema, {
      props: {
        items: [article],
        inLanguage: 'en-US',
        baseUrl: 'https://example.com',
      },
    });
    const updated = render(sveltePackage.Schema, {
      props: {
        items: [updatedArticle],
        inLanguage: 'en-US',
        baseUrl: 'https://example.com',
      },
    });

    expect(first.head).toContain('"headline":"Svelte 5 \\u0026 JSON-LD"');
    expect(updated.head).toContain('"headline":"Updated Svelte title"');
    expect(updated.head).toContain('"@id":"https://example.com/#article"');
    expect(updated.head).toContain('"inLanguage":"en-US"');
    expect((first.head.match(/<script/g) ?? []).length).toBe(1);
    expect((updated.head.match(/<script/g) ?? []).length).toBe(1);
    expect(article.headline).toBe('Svelte 5 & JSON-LD');
    expect(article.inLanguage).toBeUndefined();
  });

  it('uses Core global defaults and produces the exact Core graph payload', () => {
    sveltePackage.setGlobalConfig({
      baseUrl: 'https://configured.example',
      inLanguage: 'fr-FR',
    });
    const article = Object.freeze(
      sveltePackage.Article({
        '@id': '#article',
        headline: 'Core parity',
      })
    );

    const rendered = render(sveltePackage.Schema, { props: { item: article } });
    const expectedEntity = { ...article, inLanguage: 'fr-FR' };
    const expected = sveltePackage.serializeJsonLd(
      sveltePackage.buildJsonLdGraph([expectedEntity], {
        baseUrl: 'https://configured.example',
      })
    );

    expect(rendered.head).toContain(expected);
    expect(article['@id']).toBe('#article');
    expect(article.inLanguage).toBeUndefined();
  });
});
