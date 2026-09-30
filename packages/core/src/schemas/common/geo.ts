import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';

/**
 * Zod schema for Schema.org `GeoCoordinates`.
 */
export const GeoCoordinatesSchema = z
  .object({
    '@type': z.union([z.string(), z.array(z.string())]).optional(),
    '@id': z.string().optional(),
    latitude: z.union([z.number(), z.string()]),
    longitude: z.union([z.number(), z.string()]),
    elevation: z.union([z.number(), z.string()]).optional(),
  })
  .strict();

/**
 * Schema.org `GeoCoordinates` entity builder.
 */
export const GeoCoordinates = defineSchema('GeoCoordinates', GeoCoordinatesSchema);
