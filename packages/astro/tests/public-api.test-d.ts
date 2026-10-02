import schemaGraphDefault, {
  Article,
  buildJsonLdGraph,
  Organization,
  Schema,
  type SchemaInput,
  type SchemaOutput,
  schemaGraph,
} from '@unschema-graph/astro';

import {
  type ArticleMappingOptions,
  type ContentEntryLike,
  extractImage,
  extractKeywords,
  extractWordCount,
  toArticle,
  toBlogPosting,
  toNewsArticle,
} from '@unschema-graph/astro/content';

// Verify default and named integration
const _defaultIntegration = schemaGraphDefault();
const _namedIntegration = schemaGraph();
void _defaultIntegration;
void _namedIntegration;

// Verify content helpers
const entry: ContentEntryLike<{ title: string; image?: string }> = {
  data: {
    title: 'Astro Post',
    image: 'https://example.com/cover.jpg',
  },
};

const _art = toArticle(entry);
const _blog = toBlogPosting(entry);
const _news = toNewsArticle(entry);
void _art;
void _blog;
void _news;
