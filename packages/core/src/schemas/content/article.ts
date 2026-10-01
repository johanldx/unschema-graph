import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { ImageUrlOrObject } from '../common/image.js';
import { entityRef, TypedEntitySchema } from '../common/reference.js';
import { SpeakableSchema } from '../common/speakable.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

/**
 * Entity reference or embedded entity for Article author.
 */
const AuthorRefOrObject = entityRef({
  schemas: [PersonSchema, OrganizationSchema],
  types: ['Person', 'Organization'],
  fallbackType: 'Person',
});

/**
 * Entity reference or embedded entity for Article publisher.
 */
const PublisherRefOrObject = entityRef({
  schemas: [OrganizationSchema, PersonSchema],
  types: ['Organization', 'Person'],
  fallbackType: 'Organization',
});

const MainEntityOfPageSchema = entityRef({ schemas: [TypedEntitySchema] });

const ArticleImageSchema = z.union([ImageUrlOrObject, z.array(ImageUrlOrObject)]);
const ArticleAuthorSchema = z.union([AuthorRefOrObject, z.array(AuthorRefOrObject)]);

/** Zod schema for the implemented Schema.org `Article` model. */
export const ArticleSchema = z
  .object({
    headline: z.string().min(1, 'Property "headline" cannot be empty').optional(),
    image: ArticleImageSchema.optional(),
    datePublished: IsoDateSchema.optional(),
    dateModified: IsoDateSchema.optional(),
    author: ArticleAuthorSchema.optional(),
    publisher: PublisherRefOrObject.optional(),
    description: z.string().optional(),
    articleBody: z.string().optional(),
    articleSection: z.union([z.string(), z.array(z.string())]).optional(),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
    inLanguage: z.string().optional(),
    mainEntityOfPage: MainEntityOfPageSchema.optional(),
    wordCount: z.number().int().positive().optional(),
    speakable: SpeakableSchema.optional(),
  })
  .strict();

/**
 * Google Article rich-result profile implemented by the library.
 * Passing this schema does not guarantee search-engine eligibility or display.
 */
export const GoogleArticleSchema = ArticleSchema.extend({
  headline: z.string().min(1, 'Property "headline" is required by the Google Article profile'),
  image: ArticleImageSchema,
  datePublished: IsoDateSchema,
  author: ArticleAuthorSchema,
});

/**
 * Schema.org `Article` entity builder.
 */
export const Article = defineSchema('Article', ArticleSchema);

/** Schema.org `Article` builder with the implemented Google profile constraints. */
export const GoogleArticle = defineSchema('Article', GoogleArticleSchema);

/**
 * Schema.org `BlogPosting` specialized article builder.
 */
export const BlogPosting = defineSchema('BlogPosting', ArticleSchema);

/**
 * Schema.org `NewsArticle` specialized article builder.
 */
export const NewsArticle = defineSchema('NewsArticle', ArticleSchema);
