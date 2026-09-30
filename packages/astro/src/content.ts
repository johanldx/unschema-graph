import type { SchemaInput, SchemaOutput } from '@unschema-graph/core';
import { Article, type ArticleSchema, BlogPosting, NewsArticle } from '@unschema-graph/core';

type ContentData = Record<string, unknown>;
type ArticleKind = 'Article' | 'BlogPosting' | 'NewsArticle';
type ArticleInput = SchemaInput<typeof ArticleSchema>;
type ArticleOutput<TKind extends ArticleKind> = SchemaOutput<typeof ArticleSchema, TKind>;

/** Shape shared by Astro content collection entries across supported Astro versions. */
export interface ContentEntryLike<TData extends ContentData = ContentData> {
  id?: string;
  slug?: string;
  body?: string;
  data: TData;
}

/** Options and schema overrides used by the article mapping helpers. */
export type ArticleMappingOptions = Partial<ArticleInput> & {
  /** Alias mapped to `mainEntityOfPage`; it is not emitted as an extra `url` property. */
  url?: string;
};

/** Normalizes image input from Astro frontmatter or `astro:assets`. */
export function extractImage(image: unknown): unknown {
  if (!image) return undefined;
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && 'src' in image && typeof image.src === 'string') {
    return image.src;
  }
  return image;
}

/** Normalizes tags/keywords from an array or comma-separated string. */
export function extractKeywords(tags: unknown): string[] | undefined {
  if (Array.isArray(tags)) {
    return tags.map(String);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return undefined;
}

/** Computes an approximate word count from a Markdown or MDX source body. */
export function extractWordCount(body?: string): number | undefined {
  if (!body) return undefined;
  const words = body.trim().split(/\s+/).filter(Boolean);
  return words.length > 0 ? words.length : undefined;
}

const articleBuilders = {
  Article,
  BlogPosting,
  NewsArticle,
};

function mapArticleEntry<TKind extends ArticleKind, TData extends ContentData>(
  kind: TKind,
  entry: ContentEntryLike<TData>,
  overrides: ArticleMappingOptions = {}
): ArticleOutput<TKind> {
  const data = entry.data;
  const { url, ...schemaOverrides } = overrides;
  const input = {
    headline: data.headline ?? data.title ?? data.name,
    image: extractImage(data.image ?? data.cover ?? data.heroImage),
    datePublished: data.datePublished ?? data.pubDate ?? data.date ?? data.publishDate,
    dateModified: data.dateModified ?? data.updatedDate ?? data.modDate ?? data.lastModified,
    author: data.author ?? data.authors,
    description: data.description ?? data.summary ?? data.excerpt,
    keywords: extractKeywords(data.keywords ?? data.tags ?? data.categories),
    wordCount: data.wordCount ?? extractWordCount(entry.body),
    mainEntityOfPage: url ?? schemaOverrides.mainEntityOfPage ?? data.url,
    ...schemaOverrides,
  } as ArticleInput;

  const builder = articleBuilders[kind] as unknown as (value: ArticleInput) => ArticleOutput<TKind>;
  return builder(input);
}

/** Converts an Astro content entry into a validated Schema.org `Article`. */
export function toArticle<TData extends ContentData>(
  entry: ContentEntryLike<TData>,
  overrides?: ArticleMappingOptions
): ArticleOutput<'Article'> {
  return mapArticleEntry('Article', entry, overrides);
}

/** Converts an Astro content entry into a validated Schema.org `BlogPosting`. */
export function toBlogPosting<TData extends ContentData>(
  entry: ContentEntryLike<TData>,
  overrides?: ArticleMappingOptions
): ArticleOutput<'BlogPosting'> {
  return mapArticleEntry('BlogPosting', entry, overrides);
}

/** Converts an Astro content entry into a validated Schema.org `NewsArticle`. */
export function toNewsArticle<TData extends ContentData>(
  entry: ContentEntryLike<TData>,
  overrides?: ArticleMappingOptions
): ArticleOutput<'NewsArticle'> {
  return mapArticleEntry('NewsArticle', entry, overrides);
}
