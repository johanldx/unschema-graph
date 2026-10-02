import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { SchemaTypeSchema } from '../../core/schemaType.js';
import { EntityIdSchema } from './reference.js';
import { RelativeOrAbsoluteUrlSchema } from './url.js';

/**
 * Zod schema for Schema.org `ContactPoint`.
 */
export const ContactPointSchema = z
  .object({
    '@type': SchemaTypeSchema.optional(),
    '@id': EntityIdSchema.optional(),
    telephone: z.string().optional(),
    contactType: z.string().optional(),
    email: z.string().email().optional(),
    areaServed: z.union([z.string(), z.array(z.string())]).optional(),
    availableLanguage: z.union([z.string(), z.array(z.string())]).optional(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
  })
  .strict();

/**
 * Schema.org `ContactPoint` entity builder.
 */
export const ContactPoint = defineSchema('ContactPoint', ContactPointSchema);
