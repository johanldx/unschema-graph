import {
  Article,
  ArticleSchema,
  buildJsonLdGraph,
  formatIsoDate,
  type GraphOptions,
  Organization,
  SCHEMA_ORG_BASELINE,
  serializeJsonLd,
  validateSchema,
  withAdditionalProperties,
  withAdditionalTypes,
} from '@unschema-graph/core';
import { auditHtmlContent, getHtmlFiles } from '@unschema-graph/core/audit';

const organization = Organization({
  '@id': '#organization',
  name: 'Published package consumer',
  url: 'https://example.com',
});

const article = Article({
  headline: 'Published core test',
  image: 'https://example.com/cover.jpg',
  datePublished: formatIsoDate('2026-10-02'),
  author: organization,
});

// Validation API: validate standalone data
const validated = validateSchema(ArticleSchema, {
  headline: 'Validated independently',
  image: 'https://example.com/cover.jpg',
  datePublished: formatIsoDate('2026-10-02'),
  author: organization,
});
if (!validated) {
  throw new Error('validateSchema returned null unexpectedly.');
}

// Extension helpers: applied after schema validation
const extended = withAdditionalProperties(article, { customField: 'value' });
const multiTyped = withAdditionalTypes(extended, ['CreativeWork']);

// Graph options & serialization
const options: GraphOptions = { baseUrl: 'https://example.com' };
const graph = buildJsonLdGraph([organization, multiTyped], options);
const output = serializeJsonLd(graph);

if (!output.includes('Published package consumer')) {
  throw new Error('The Core root export did not build a JSON-LD graph.');
}

if (SCHEMA_ORG_BASELINE !== '30.1') {
  throw new Error(`Unexpected Schema.org baseline: ${SCHEMA_ORG_BASELINE}`);
}

if (auditHtmlContent(`<script type="application/ld+json">${output}</script>`).errors.length > 0) {
  throw new Error('The Core audit subpath rejected valid JSON-LD.');
}

if (typeof getHtmlFiles !== 'function') {
  throw new Error('getHtmlFiles is not exported by audit subpath.');
}
