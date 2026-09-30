import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sveltePackage from '@unschema-graph/svelte';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';

describe('@unschema-graph/svelte', () => {
  const sveltePath = fileURLToPath(new URL('../src/Schema.svelte', import.meta.url));
  const cacheDir = fileURLToPath(
    new URL('../../../node_modules/.cache/unschema-test', import.meta.url)
  );

  it('re-exports core builders and utilities', () => {
    expect(typeof sveltePackage.Article).toBe('function');
    expect(typeof sveltePackage.Organization).toBe('function');
    expect(typeof sveltePackage.buildJsonLdGraph).toBe('function');
    expect(typeof sveltePackage.serializeJsonLd).toBe('function');
    expect(typeof sveltePackage.setGlobalConfig).toBe('function');
  });

  it('compiles Schema.svelte and renders to SSR head', async () => {
    const source = fs.readFileSync(sveltePath, 'utf-8');

    const compiled = compile(source, {
      generate: 'server',
      filename: 'Schema.svelte',
    });

    // Write compiled SSR component to cache
    fs.mkdirSync(cacheDir, { recursive: true });
    const compiledPath = path.join(cacheDir, 'Schema.js');
    fs.writeFileSync(compiledPath, compiled.js.code);

    const { default: SchemaComponent } = await import(compiledPath);

    const org = sveltePackage.Organization({
      '@id': 'https://example.com/#org',
      name: 'Rootage',
      url: 'https://example.com',
    });

    const rendered = render(SchemaComponent, {
      props: {
        item: org,
        inLanguage: 'fr',
      },
    });

    expect(rendered.head).toContain('<script type="application/ld+json">');
    expect(rendered.head).toContain('"@type":"Organization"');
    expect(rendered.head).toContain('"name":"Rootage"');
    expect(rendered.head).toContain('</script>');
  });

  it('supports multiple items and language injection', async () => {
    const compiledPath = path.join(cacheDir, 'Schema.js');
    const { default: SchemaComponent } = await import(compiledPath);

    const article = sveltePackage.Article({
      headline: 'Svelte 5 & JSON-LD',
      image: 'https://example.com/cover.jpg',
      datePublished: '2026-09-29T12:00:00Z',
      author: 'Johan',
    });

    const rendered = render(SchemaComponent, {
      props: {
        items: [article],
        inLanguage: 'en-US',
      },
    });

    expect(rendered.head).toContain('"inLanguage":"en-US"');
    expect(rendered.head).toContain('"headline":"Svelte 5 \\u0026 JSON-LD"');
  });
});
