import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { SchemaTypeSchema } from '../../core/schemaType.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { PostalAddressSchema } from '../common/address.js';
import { ContactPointSchema } from '../common/contact.js';
import { ImageUrlOrObject } from '../common/image.js';
import { EntityIdSchema, EntityReferenceSchema } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';

/**
 * Curated Zod schema for Schema.org `Organization`.
 */
export const OrganizationSchema = z
  .object({
    '@type': SchemaTypeSchema.optional(),
    '@id': EntityIdSchema.optional(),
    name: z.string().min(1, 'Property "name" is required for Organization'),
    legalName: z.string().optional(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
    logo: ImageUrlOrObject.optional(),
    image: ImageUrlOrObject.optional(),
    description: z.string().optional(),
    sameAs: z.union([RelativeOrAbsoluteUrlSchema, z.array(RelativeOrAbsoluteUrlSchema)]).optional(),
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
