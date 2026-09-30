import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { AggregateRatingSchema, ReviewSchema } from '../commerce/review.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

const BookContributorSchema = z.union([z.string(), PersonSchema, OrganizationSchema]);
const AuthorSchema = z.union([BookContributorSchema, z.array(BookContributorSchema)]);

/**
 * Zod schema for Schema.org `Book`.
 */
export const BookSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Book'),
    author: AuthorSchema,
    isbn: z.string().optional(),
    bookFormat: z.string().optional(),
    datePublished: IsoDateSchema.optional(),
    publisher: z.union([z.string(), OrganizationSchema, PersonSchema]).optional(),
    inLanguage: z.string().optional(),
    numberOfPages: z.number().int().positive().optional(),
    description: z.string().optional(),
    aggregateRating: AggregateRatingSchema.optional(),
    review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
  })
  .strict();

export const Book = defineSchema('Book', BookSchema);
