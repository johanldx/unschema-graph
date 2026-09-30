import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { ImageUrlOrObject } from '../common/image.js';
import { createEntityRef, EntityReferenceSchema } from '../common/reference.js';
import { SpeakableSchema } from '../common/speakable.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

/**
 * Entity reference or embedded entity for Article author.
 */
const AuthorRefOrObject = createEntityRef(z.union([PersonSchema, OrganizationSchema]), 'Person');

/**
 * Entity reference or embedded entity for Article publisher.
 */
const PublisherRefOrObject = createEntityRef(OrganizationSchema, 'Organization');

/**
 * Zod schema for Schema.org `Article` according to Google Search Central guidelines.
 */
export const ArticleSchema = z
  .object({
    headline: z
      .string()
      .min(1, 'Property "headline" is required by Google Search Central for Article'),
    image: z.union([ImageUrlOrObject, z.array(ImageUrlOrObject)], {
      message: 'Property "image" is required by Google Search Central for Article Rich Results',
    }),
    datePublished: IsoDateSchema,
    dateModified: IsoDateSchema.optional(),
    author: z.union([AuthorRefOrObject, z.array(AuthorRefOrObject)], {
      message: 'Property "author" is required by Google Search Central for Article',
    }),
    publisher: PublisherRefOrObject.optional(),
    description: z.string().optional(),
    articleBody: z.string().optional(),
    articleSection: z.union([z.string(), z.array(z.string())]).optional(),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
    inLanguage: z.string().optional(),
    mainEntityOfPage: z.union([z.string(), EntityReferenceSchema]).optional(),
    wordCount: z.number().int().positive().optional(),
    speakable: SpeakableSchema.optional(),
  })
  .strict();

/**
 * Schema.org `Article` entity builder.
 */
export const Article = defineSchema('Article', ArticleSchema);

/**
 * Schema.org `BlogPosting` specialized article builder.
 */
export const BlogPosting = defineSchema('BlogPosting', ArticleSchema);

/**
 * Schema.org `NewsArticle` specialized article builder.
 */
export const NewsArticle = defineSchema('NewsArticle', ArticleSchema);
