import {
  Article,
  type ArticleSchema,
  type SchemaOutput,
  withAdditionalProperties,
} from '@unschema-graph/core';

const article = Article({
  headline: 'Typed article',
  image: 'https://example.com/image.jpg',
  datePublished: '2026-09-29',
  author: 'Alice',
});

const articleType: 'Article' = article['@type'];
const output: SchemaOutput<typeof ArticleSchema, 'Article'> = article;
const extended = withAdditionalProperties(article, { experimentalProperty: true as const });
const experimentalProperty: true = extended.experimentalProperty;

// @ts-expect-error Additional properties cannot replace builder-owned metadata
withAdditionalProperties(article, { '@type': 'Product' });

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
void experimentalProperty;
