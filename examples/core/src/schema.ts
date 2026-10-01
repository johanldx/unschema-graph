import {
  Article,
  BreadcrumbList,
  buildJsonLdGraph,
  Organization,
  serializeJsonLd,
  WebPage,
  WebSite,
} from '@unschema-graph/core';

export function createPageGraph(baseUrl = 'https://example.com') {
  const organization = Organization({
    '@id': '#organization',
    name: 'Acme Corp',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
  });

  const website = WebSite({
    '@id': '#website',
    name: 'Acme Portal',
    url: 'https://example.com',
    publisher: organization,
    searchUrl: 'https://example.com/search?q={search_term_string}',
  });

  const breadcrumb = BreadcrumbList({
    '@id': '#breadcrumb',
    itemListElement: [
      { name: 'Home', item: 'https://example.com' },
      { name: 'Blog', item: 'https://example.com/blog' },
      {
        name: 'Structured Data with Core',
        item: 'https://example.com/blog/structured-data-core',
      },
    ],
  });

  const webpage = WebPage({
    '@id': '#webpage',
    url: 'https://example.com/blog/structured-data-core',
    name: 'Structured Data with Core',
    isPartOf: website, // Typed entity-object reference to WebSite!
    breadcrumb, // Typed entity-object reference to BreadcrumbList!
    speakable: '.lead-summary',
  });

  const article = Article({
    '@id': '#article',
    headline: 'Building Type-Safe JSON-LD with @unschema-graph/core',
    description:
      'A complete framework-neutral guide to generating Schema.org graphs in pure TypeScript.',
    image: 'https://example.com/images/hero.jpg',
    datePublished: '2026-10-01',
    inLanguage: 'en',
    author: 'Ada Lovelace',
    publisher: organization, // Typed entity-object reference to Organization!
    mainEntityOfPage: webpage, // Typed entity-object reference to WebPage!
    speakable: '.lead-summary',
  });

  // buildJsonLdGraph recursively discovers all connected entities (webpage, website, organization, breadcrumb)
  const graph = buildJsonLdGraph(article, { baseUrl });
  const jsonLd = serializeJsonLd(graph, { pretty: true });

  return { article, webpage, website, organization, breadcrumb, graph, jsonLd };
}
