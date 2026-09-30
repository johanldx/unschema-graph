import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';

/**
 * Zod schema for Schema.org `ContactPoint`.
 */
export const ContactPointSchema = z
  .object({
    '@type': z.union([z.string(), z.array(z.string())]).optional(),
    '@id': z.string().optional(),
    telephone: z.string().optional(),
    contactType: z.string().optional(),
    email: z.string().email().optional(),
    areaServed: z.union([z.string(), z.array(z.string())]).optional(),
    availableLanguage: z.union([z.string(), z.array(z.string())]).optional(),
    url: z.string().optional(),
  })
  .strict();

/**
 * Schema.org `ContactPoint` entity builder.
 */
export const ContactPoint = defineSchema('ContactPoint', ContactPointSchema);
