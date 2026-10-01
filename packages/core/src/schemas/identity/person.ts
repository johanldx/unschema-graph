import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { SchemaTypeSchema } from '../../core/schemaType.js';
import { PostalAddressSchema } from '../common/address.js';
import { ImageUrlOrObject } from '../common/image.js';
import { EntityReferenceSchema, entityRef } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';
import { OrganizationSchema } from './organization.js';

const WorksForSchema = entityRef({
  schemas: [OrganizationSchema],
  types: ['Organization'],
  fallbackType: 'Organization',
});

/**
 * Zod schema for Schema.org `Person`.
 * Validates properties according to Google Search Central structured data recommendations.
 */
export const PersonSchema = z
  .object({
    '@type': SchemaTypeSchema.optional(),
    '@id': z.string().optional(),
    name: z.string().min(1, 'Property "name" is required for Person'),
    givenName: z.string().optional(),
    familyName: z.string().optional(),
    additionalName: z.string().optional(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
    image: ImageUrlOrObject.optional(),
    jobTitle: z.string().optional(),
    worksFor: WorksForSchema.optional(),
    sameAs: z.union([RelativeOrAbsoluteUrlSchema, z.array(RelativeOrAbsoluteUrlSchema)]).optional(),
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
