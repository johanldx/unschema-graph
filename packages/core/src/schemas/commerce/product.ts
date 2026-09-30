import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { ImageUrlOrObject } from '../common/image.js';
import { createEntityRef } from '../common/reference.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';
import { AggregateOfferSchema, OfferSchema } from './offer.js';
import { AggregateRatingSchema, ReviewSchema } from './review.js';

/**
 * Brand representation: string, Organization, Person, or Brand object.
 */
const BrandSchema = createEntityRef(
  z.union([
    OrganizationSchema,
    PersonSchema,
    z
      .object({
        '@type': z.literal('Brand').default('Brand').optional(),
        name: z.string(),
      })
      .strict(),
  ]),
  'Brand'
);

/**
 * Zod schema for Schema.org `Product` based on Google Search Central guidelines.
 */
export const ProductSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Product'),
    image: z.union([ImageUrlOrObject, z.array(ImageUrlOrObject)]).optional(),
    description: z.string().optional(),
    brand: BrandSchema.optional(),
    offers: z.union([OfferSchema, AggregateOfferSchema, z.array(OfferSchema)]).optional(),
    aggregateRating: z.union([AggregateRatingSchema]).optional(),
    review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
    sku: z.string().optional(),
    gtin: z.string().optional(),
    gtin8: z.string().optional(),
    gtin13: z.string().optional(),
    gtin14: z.string().optional(),
    mpn: z.string().optional(),
    category: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
    releaseDate: IsoDateSchema.optional(),
  })
  .strict();

/**
 * Schema.org `Product` entity builder.
 */
export const Product = defineSchema('Product', ProductSchema);
