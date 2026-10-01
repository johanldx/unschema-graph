import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  Article,
  createSearchAction,
  SpeakableSchema,
  WebPage,
  WebSite,
} from '@unschema-graph/core';
import { auditHtmlContent, auditHtmlDirectory } from '@unschema-graph/core/audit';
import { describe, expect, it } from 'vitest';

describe('Advanced Feature 1: Speakable & Voice/AI Optimization', () => {
  it('should transform a single string selector into SpeakableSpecification', () => {
    const res = SpeakableSchema.parse('.article-content');
    expect(res).toEqual({
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-content'],
    });
  });

  it('should transform an array of string selectors into SpeakableSpecification', () => {
    const res = SpeakableSchema.parse(['h1.headline', '.summary-lead']);
    expect(res).toEqual({
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1.headline', '.summary-lead'],
    });
  });

  it('should preserve custom SpeakableSpecification objects with xpath', () => {
    const custom = {
      '@type': 'SpeakableSpecification',
      xpath: ['/html/head/title', '/html/body/main/article/p[1]'],
    };
    const res = SpeakableSchema.parse(custom);
    expect(res).toMatchObject(custom);
  });

  it('should integrate speakable shorthand into Article', () => {
    const article = Article({
      headline: 'Astro 5 and AI Search',
      image: 'https://example.com/banner.jpg',
      datePublished: '2026-09-29',
      author: {
        '@type': 'Person',
        name: 'Johan Ledoux',
      },
      speakable: ['.article-title', '.article-intro'],
    });

    expect(article.speakable).toEqual({
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-title', '.article-intro'],
    });
  });

  it('should integrate speakable shorthand into WebPage', () => {
    const page = WebPage({
      name: 'Documentation',
      speakable: '#summary',
    });

    expect(page.speakable).toEqual({
      '@type': 'SpeakableSpecification',
      cssSelector: ['#summary'],
    });
  });
});

describe('Advanced Feature 2: Sitelinks Searchbox (SearchAction)', () => {
  it('should create SearchAction from simple URL template string', () => {
    const action = createSearchAction('https://example.com/search?q={search_term_string}');
    expect(action).toEqual({
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    });
  });

  it('should extract custom query variable from template placeholder', () => {
    const action = createSearchAction('https://example.com/search?query={query_text}');
    expect(action['query-input']).toBe('required name=query_text');
  });

  it('should auto-generate potentialAction on WebSite via searchUrl shorthand', () => {
    const site = WebSite({
      name: 'My Knowledge Base',
      url: 'https://example.com',
      searchUrl: 'https://example.com/search?q={search_term_string}',
    });

    expect(site.potentialAction).toEqual({
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    });
    // searchUrl should not be exposed on the final object
    expect('searchUrl' in site).toBe(false);
  });

  it('should not overwrite explicit potentialAction on WebSite', () => {
    const customAction = {
      '@type': 'SearchAction',
      target: 'https://custom.com/search',
    };
    const site = WebSite({
      name: 'My Site',
      url: 'https://example.com',
      searchUrl: 'https://example.com/search?q={search_term_string}',
      potentialAction: customAction,
    });

    expect(site.potentialAction).toEqual(customAction);
  });
});

describe('Advanced Feature 3: Static Build Audit Engine', () => {
  it('should audit valid HTML with @graph successfully', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Organization", "name": "Acme Corp" },
              { "@type": "Person", "name": "Alice" }
            ]
          }
          </script>
        </head>
      </html>
    `;

    const res = auditHtmlContent(html, 'test.html');
    expect(res.blocks).toBe(1);
    expect(res.entities).toBe(2);
    expect(res.errors).toHaveLength(0);
  });

  it('should audit valid HTML with single entity (no @graph)', () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Astro SEO"
          }
          </script>
        </head>
      </html>
    `;

    const res = auditHtmlContent(html, 'single.html');
    expect(res.blocks).toBe(1);
    expect(res.entities).toBe(1);
    expect(res.errors).toHaveLength(0);
  });

  it('should detect JSON-LD regardless of attribute order', () => {
    const html = `<script nonce="abc" data-source="cms" type="application/ld+json">{"@context":"https://schema.org","@type":"Thing"}</script>`;
    const res = auditHtmlContent(html, 'nonce.html');

    expect(res.blocks).toBe(1);
    expect(res.entities).toBe(1);
    expect(res.errors).toHaveLength(0);
  });

  it('should catch empty script block', () => {
    const html = `<html><head><script type="application/ld+json"></script></head></html>`;
    const res = auditHtmlContent(html, 'empty.html');
    expect(res.blocks).toBe(1);
    expect(res.errors[0].message).toMatch(/Empty application\/ld\+json/);
  });

  it('should catch malformed JSON syntax', () => {
    const html = `<html><head><script type="application/ld+json">{ bad json here }</script></head></html>`;
    const res = auditHtmlContent(html, 'syntax.html');
    expect(res.errors[0].message).toMatch(/JSON syntax error/);
  });

  it('should catch missing @context', () => {
    const html = `<html><head><script type="application/ld+json">{"@type": "Thing"}</script></head></html>`;
    const res = auditHtmlContent(html, 'missing-context.html');
    expect(res.errors[0].message).toMatch(/Missing required "@context"/);
  });

  it('should catch missing @type on @graph items', () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@graph": [
              { "name": "Item with no @type" }
            ]
          }
          </script>
        </head>
      </html>
    `;
    const res = auditHtmlContent(html, 'missing-type.html');
    expect(res.errors[0].message).toMatch(/missing "@type"/);
  });

  it('should resolve local graph references and report broken ones with their path', () => {
    const valid = auditHtmlContent(
      `<script type="application/ld+json">{
        "@context":"https://schema.org",
        "@graph":[
          {"@type":"Organization","@id":"#organization","name":"Acme"},
          {"@type":"WebSite","publisher":{"@id":"#organization"}}
        ]
      }</script>`,
      'valid-reference.html'
    );
    expect(valid.resolvedLocalReferences).toBe(1);
    expect(valid.errors).toHaveLength(0);

    const broken = auditHtmlContent(
      `<script type="application/ld+json">{
        "@context":"https://schema.org",
        "@type":"WebSite",
        "publisher":{"@id":"#missing"}
      }</script>`,
      'broken-reference.html'
    );
    expect(broken.errors).toContainEqual({
      code: 'broken-reference',
      severity: 'error',
      file: 'broken-reference.html',
      id: '#missing',
      path: 'WebSite.publisher',
      message: 'Broken @id reference: #missing\nReferenced from: WebSite.publisher',
    });
  });

  it('reports a missing absolute reference to the canonical document', () => {
    const result = auditHtmlContent(
      `<html><head>
        <link href="https://example.com/" rel="canonical">
        <script type="application/ld+json">{
          "@context":"https://schema.org",
          "@graph":[
            {
              "@type":"WebSite",
              "@id":"#website",
              "publisher":{"@id":"https://example.com/#missing"}
            }
          ]
        }</script>
      </head></html>`,
      'canonical-reference.html'
    );

    expect(result.resolvedLocalReferences).toBe(0);
    expect(result.errors).toEqual([
      {
        code: 'broken-reference',
        severity: 'error',
        file: 'canonical-reference.html',
        id: 'https://example.com/#missing',
        path: 'WebSite.publisher',
        message:
          'Broken @id reference: https://example.com/#missing\nReferenced from: WebSite.publisher',
      },
    ]);
  });

  it('does not treat a same-origin different-document reference as locally broken', () => {
    const result = auditHtmlContent(
      `<html><head>
        <link href="https://example.com/" rel="canonical">
        <script type="application/ld+json">{
          "@context":"https://schema.org",
          "@type":"WebSite",
          "@id":"#website",
          "publisher":{"@id":"https://example.com/about#organization"}
        }</script>
      </head></html>`,
      'different-document-reference.html'
    );

    expect(result.resolvedLocalReferences).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('should distinguish duplicate declarations from conflicting @id values', () => {
    const duplicate = auditHtmlContent(
      `<script type="application/ld+json">{
        "@context":"https://schema.org",
        "@graph":[
          {"@type":"Organization","@id":"#organization","name":"Acme"},
          {"@type":"Organization","@id":"#organization","name":"Acme","url":"/about"}
        ]
      }</script>`,
      'duplicate.html'
    );
    expect(duplicate.errors).toHaveLength(0);
    expect(duplicate.warnings[0]).toMatchObject({
      code: 'duplicate-id',
      id: '#organization',
    });

    const conflict = auditHtmlContent(
      `<script type="application/ld+json">{
        "@context":"https://schema.org",
        "@graph":[
          {"@type":"Organization","@id":"#organization","name":"Acme"},
          {"@type":"Organization","@id":"#organization","name":"Other"}
        ]
      }</script>`,
      'conflict.html'
    );
    expect(conflict.errors[0]).toMatchObject({
      code: 'duplicate-conflict',
      id: '#organization',
    });
  });

  it('should audit a directory recursively and pass clean directories', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'asg-audit-test-'));
    const subDir = path.join(tmpDir, 'blog');
    fs.mkdirSync(subDir);

    fs.writeFileSync(
      path.join(tmpDir, 'index.html'),
      `<html><head><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Test"}</script></head></html>`
    );
    fs.writeFileSync(
      path.join(subDir, 'post.html'),
      `<html><head><script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Post"}]}</script></head></html>`
    );

    const report = auditHtmlDirectory(tmpDir);
    expect(report.scannedFiles).toBe(2);
    expect(report.totalBlocks).toBe(2);
    expect(report.totalEntities).toBe(2);
    expect(report.resolvedLocalReferences).toBe(0);
    expect(report.passed).toBe(true);
    expect(report.errors).toHaveLength(0);
    expect(report.warnings).toHaveLength(0);

    // Clean up
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should return error when directory does not exist or has no html files', () => {
    const nonExistent = path.join(os.tmpdir(), `does-not-exist-${Date.now()}`);
    const report = auditHtmlDirectory(nonExistent);
    expect(report.scannedFiles).toBe(0);
    expect(report.passed).toBe(false);
    expect(report.errors.length).toBeGreaterThan(0);
  });
});
