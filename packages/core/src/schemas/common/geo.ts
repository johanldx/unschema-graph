import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { SchemaTypeSchema } from '../../core/schemaType.js';
import { EntityIdSchema } from './reference.js';

/**
 * Zod schema for Schema.org `GeoCoordinates`.
 */
export const GeoCoordinatesSchema = z
  .object({
    '@type': SchemaTypeSchema.optional(),
    '@id': EntityIdSchema.optional(),
    latitude: z.union([z.number(), z.string()]),
    longitude: z.union([z.number(), z.string()]),
    elevation: z.union([z.number(), z.string()]).optional(),
  })
  .strict();

/**
 * Schema.org `GeoCoordinates` entity builder.
 */
export const GeoCoordinates = defineSchema('GeoCoordinates', GeoCoordinatesSchema);
