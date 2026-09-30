import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

/**
 * Zod schema for Schema.org `Rating`.
 */
export const RatingSchema = z
  .object({
    '@type': z.literal('Rating').default('Rating').optional(),
    '@id': z.string().optional(),
    ratingValue: z.union([z.number(), z.string()], {
      message: 'Property "ratingValue" is required for Rating',
    }),
    bestRating: z.union([z.number(), z.string()]).default(5).optional(),
    worstRating: z.union([z.number(), z.string()]).default(1).optional(),
  })
  .strict();

/**
 * Zod schema for Schema.org `AggregateRating`.
 */
export const AggregateRatingSchema = z
  .object({
    '@type': z.literal('AggregateRating').default('AggregateRating').optional(),
    '@id': z.string().optional(),
    ratingValue: z.union([z.number(), z.string()], {
      message: 'Property "ratingValue" is required for AggregateRating',
    }),
    bestRating: z.union([z.number(), z.string()]).default(5).optional(),
    worstRating: z.union([z.number(), z.string()]).default(1).optional(),
    ratingCount: z.number().int().nonnegative().optional(),
    reviewCount: z.number().int().nonnegative().optional(),
  })
  .strict();

import { IsoDateSchema } from '../../core/temporal.js';
import { createEntityRef, TypedEntitySchema } from '../common/reference.js';

const ReviewAuthorSchema = createEntityRef(z.union([PersonSchema, OrganizationSchema]), 'Person');

const ItemReviewedSchema = createEntityRef(TypedEntitySchema);

/**
 * Zod schema for Schema.org `Review`.
 */
export const ReviewSchema = z
  .object({
    '@type': z.literal('Review').default('Review').optional(),
    '@id': z.string().optional(),
    author: ReviewAuthorSchema,
    reviewRating: z.union([
      RatingSchema,
      z
        .object({
          ratingValue: z.union([z.number(), z.string()]),
          bestRating: z.union([z.number(), z.string()]).optional(),
          worstRating: z.union([z.number(), z.string()]).optional(),
        })
        .strict(),
    ]),
    datePublished: IsoDateSchema.optional(),
    reviewBody: z.string().optional(),
    name: z.string().optional(),
    itemReviewed: ItemReviewedSchema.optional(),
  })
  .strict();

/**
 * Schema.org `Rating` entity builder.
 */
export const Rating = defineSchema('Rating', RatingSchema);

/**
 * Schema.org `AggregateRating` entity builder.
 */
export const AggregateRating = defineSchema('AggregateRating', AggregateRatingSchema);

/**
 * Schema.org `Review` entity builder.
 */
export const Review = defineSchema('Review', ReviewSchema);
