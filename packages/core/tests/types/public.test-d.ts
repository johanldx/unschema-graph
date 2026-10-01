import {
  Article,
  type ArticleSchema,
  buildJsonLdGraph,
  type EntityReference,
  GoogleArticle,
  type GoogleArticleSchema,
  Organization,
  type SchemaDiagnostic,
  type SchemaOutput,
  WebSite,
  withAdditionalProperties,
  withAdditionalTypes,
} from '@unschema-graph/core';

const article = Article({
  headline: 'Typed article',
  image: 'https://example.com/image.jpg',
  datePublished: '2026-09-29',
  author: 'Alice',
});

const articleType: 'Article' = article['@type'];
const output: SchemaOutput<typeof ArticleSchema, 'Article'> = article;
const googleArticle = GoogleArticle({
  headline: 'Google profile article',
  image: 'https://example.com/image.jpg',
  datePublished: '2026-09-29',
  author: 'Alice',
});
const googleOutput: SchemaOutput<typeof GoogleArticleSchema, 'Article'> = googleArticle;
const extended = withAdditionalProperties(article, { experimentalProperty: true as const });
const experimentalProperty: true = extended.experimentalProperty;
const creativeWorkArticle = withAdditionalTypes(article, ['CreativeWork']);
const duplicateArticle = withAdditionalTypes(article, ['Article']);
const multiTypeArticle = withAdditionalTypes(article, ['CreativeWork', 'Thing']);
const creativeWorkTypes: ['Article', ...string[]] = creativeWorkArticle['@type'];
const duplicateTypes: ['Article', ...string[]] = duplicateArticle['@type'];
const multiTypes: ['Article', ...string[]] = multiTypeArticle['@type'];
const primaryArticleType: 'Article' = multiTypeArticle['@type'][0];
type Equal<TLeft, TRight> =
  (<T>() => T extends TLeft ? 1 : 2) extends <T>() => T extends TRight ? 1 : 2 ? true : false;
const duplicateTypeIsExact: Equal<(typeof duplicateArticle)['@type'], ['Article', 'Article']> =
  false;
const organization = Organization({ '@id': '#org', name: 'Acme' });
const organizationReference: EntityReference<typeof organization> = organization;
const organizationIdReference: EntityReference<typeof organization> = '#org';
const explicitOrganizationReference: EntityReference<typeof organization> = { '@id': '#org' };

// Step 20.19 consumer compilation test
const consumerSite = WebSite({
  name: 'Acme Site',
  url: 'https://example.com',
  publisher: organization,
});
const _consumerGraph: Record<string, unknown> | null = buildJsonLdGraph(consumerSite);
const _diagnostic: SchemaDiagnostic = {
  code: 'BROKEN_REFERENCE',
  severity: 'warning',
  message: 'Reference missing',
};

// @ts-expect-error Additional properties cannot replace builder-owned @type
withAdditionalProperties(article, { '@type': 'Product' });

// @ts-expect-error Additional properties cannot define @context
withAdditionalProperties(article, { '@context': 'https://schema.org' });

// @ts-expect-error Additional properties cannot define @graph
withAdditionalProperties(article, { '@graph': [] });

Article({
  headline: 'Typo',
  image: 'https://example.com/image.jpg',
  datePublished: '2026-09-29',
  author: 'Alice',
  // @ts-expect-error Unknown builder properties must be explicit
  datePublised: '2026-09-29',
});

Article({
  // @ts-expect-error A specialized builder cannot become an unrelated entity
  '@type': 'Product',
  headline: 'Wrong type',
  image: 'https://example.com/image.jpg',
  datePublished: '2026-09-29',
  author: 'Alice',
});

void articleType;
void output;
void googleOutput;
void experimentalProperty;
void creativeWorkTypes;
void duplicateTypes;
void multiTypes;
void primaryArticleType;
void duplicateTypeIsExact;
void organizationReference;
void organizationIdReference;
void explicitOrganizationReference;
