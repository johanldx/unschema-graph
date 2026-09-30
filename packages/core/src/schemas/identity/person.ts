import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { PostalAddressSchema } from '../common/address.js';
import { ImageUrlOrObject } from '../common/image.js';
import { EntityReferenceSchema } from '../common/reference.js';

/**
 * Zod schema for Schema.org `Person`.
 * Validates properties according to Google Search Central structured data recommendations.
 */
export const PersonSchema = z
  .object({
    '@type': z.union([z.string(), z.array(z.string())]).optional(),
    '@id': z.string().optional(),
    name: z.string().min(1, 'Property "name" is required for Person'),
    givenName: z.string().optional(),
    familyName: z.string().optional(),
    additionalName: z.string().optional(),
    url: z.string().optional(),
    image: ImageUrlOrObject.optional(),
    jobTitle: z.string().optional(),
    worksFor: z.union([z.string(), EntityReferenceSchema]).optional(),
    sameAs: z.union([z.string(), z.array(z.string())]).optional(),
    email: z.string().email('Property "email" must be a valid email address').optional(),
    telephone: z.string().optional(),
    description: z.string().optional(),
    address: z.union([z.string(), PostalAddressSchema, EntityReferenceSchema]).optional(),
  })
  .strict();

/**
 * Schema.org `Person` entity builder.
 */
export const Person = defineSchema('Person', PersonSchema);
