import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { RatingSchema } from '../commerce/review.js';
import { EntityReferenceSchema } from '../common/reference.js';
import { LocalBusinessSchema } from './localBusiness.js';

/**
 * Zod schema for Schema.org `LodgingBusiness` and `VacationRental`.
 */
export const LodgingBusinessSchema = LocalBusinessSchema.extend({
  checkinTime: z.string().optional(),
  checkoutTime: z.string().optional(),
  numberOfRooms: z.number().int().positive().optional(),
  petsAllowed: z.union([z.boolean(), z.string()]).optional(),
  amenityFeature: z
    .union([z.string(), z.array(z.string()), EntityReferenceSchema, z.array(EntityReferenceSchema)])
    .optional(),
  starRating: RatingSchema.optional(),
}).strict();

export const LodgingBusiness = defineSchema('LodgingBusiness', LodgingBusinessSchema);
export const VacationRental = defineSchema('VacationRental', LodgingBusinessSchema);
export const Hotel = defineSchema('Hotel', LodgingBusinessSchema);
