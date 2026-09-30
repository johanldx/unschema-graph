import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { PostalAddressSchema } from '../common/address.js';
import { ContactPointSchema } from '../common/contact.js';
import { ImageUrlOrObject } from '../common/image.js';
import { EntityReferenceSchema } from '../common/reference.js';

/**
 * Zod schema for Schema.org `Organization`.
 * Validates properties according to Google Search Central Logo and Organization guidelines.
 */
export const OrganizationSchema = z
  .object({
    '@type': z.union([z.string(), z.array(z.string())]).optional(),
    '@id': z.string().optional(),
    name: z.string().min(1, 'Property "name" is required for Organization'),
    legalName: z.string().optional(),
    url: z.string().optional(),
    logo: ImageUrlOrObject.optional(),
    image: ImageUrlOrObject.optional(),
    description: z.string().optional(),
    sameAs: z.union([z.string(), z.array(z.string())]).optional(),
    address: z.union([z.string(), PostalAddressSchema, EntityReferenceSchema]).optional(),
    contactPoint: z.union([ContactPointSchema, z.array(ContactPointSchema)]).optional(),
    email: z.string().email('Property "email" must be a valid email address').optional(),
    telephone: z.string().optional(),
    foundingDate: IsoDateSchema.optional(),
  })
  .strict();

/**
 * Schema.org `Organization` entity builder.
 */
export const Organization = defineSchema('Organization', OrganizationSchema);
