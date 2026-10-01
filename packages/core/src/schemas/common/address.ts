import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { SchemaTypeSchema } from '../../core/schemaType.js';
import { EntityIdSchema } from './reference.js';

/**
 * Zod schema for Schema.org `PostalAddress`.
 */
export const PostalAddressSchema = z
  .object({
    '@type': SchemaTypeSchema.optional(),
    '@id': EntityIdSchema.optional(),
    streetAddress: z.string().optional(),
    addressLocality: z.string().optional(),
    addressRegion: z.string().optional(),
    postalCode: z.string().optional(),
    addressCountry: z.string().optional(),
    postOfficeBoxNumber: z.string().optional(),
  })
  .strict();

/**
 * Schema.org `PostalAddress` entity builder.
 */
export const PostalAddress = defineSchema('PostalAddress', PostalAddressSchema);
