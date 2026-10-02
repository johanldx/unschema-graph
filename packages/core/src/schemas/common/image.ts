import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { SchemaTypeSchema } from '../../core/schemaType.js';
import { EntityIdSchema } from './reference.js';
import { RelativeOrAbsoluteUrlSchema } from './url.js';

const ImageUrlSchema = RelativeOrAbsoluteUrlSchema;

/**
 * Zod schema for Schema.org `ImageObject`.
 */
export const ImageObjectSchema = z
  .object({
    '@type': SchemaTypeSchema.optional(),
    '@id': EntityIdSchema.optional(),
    url: ImageUrlSchema,
    contentUrl: ImageUrlSchema.optional(),
    caption: z.string().optional(),
    description: z.string().optional(),
    width: z.union([z.number(), z.string()]).optional(),
    height: z.union([z.number(), z.string()]).optional(),
  })
  .strict();

/**
 * Union schema accepting either a plain string URL or an `ImageObject` representation.
 */
export const ImageUrlOrObject = z.union([ImageUrlSchema, ImageObjectSchema]);

/**
 * Schema.org `ImageObject` entity builder.
 */
export const ImageObject = defineSchema('ImageObject', ImageObjectSchema);
