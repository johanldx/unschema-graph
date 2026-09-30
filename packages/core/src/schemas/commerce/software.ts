import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { ImageUrlOrObject } from '../common/image.js';
import { AggregateOfferSchema, OfferSchema } from './offer.js';
import { AggregateRatingSchema, ReviewSchema } from './review.js';

/**
 * Zod schema for Schema.org `SoftwareApplication`.
 * Follows Google Search Central Software App guidelines.
 */
export const SoftwareApplicationSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for SoftwareApplication'),
    operatingSystem: z.string().optional(),
    applicationCategory: z.string().optional(),
    offers: z.union([OfferSchema, AggregateOfferSchema, z.array(OfferSchema)]).optional(),
    aggregateRating: AggregateRatingSchema.optional(),
    review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
    screenshot: z.union([ImageUrlOrObject, z.array(ImageUrlOrObject)]).optional(),
    softwareVersion: z.string().optional(),
    downloadUrl: z.string().optional(),
    fileSize: z.string().optional(),
    description: z.string().optional(),
  })
  .strict();

export const SoftwareApplication = defineSchema('SoftwareApplication', SoftwareApplicationSchema);
export const WebApplication = defineSchema('WebApplication', SoftwareApplicationSchema);
export const MobileApplication = defineSchema('MobileApplication', SoftwareApplicationSchema);
