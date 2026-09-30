import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';

const ImageUrlSchema = z
  .string()
  .min(1, 'Image URL cannot be empty')
  .refine(
    (value) => value.startsWith('/') || URL.canParse(value),
    'Image URL must be absolute or root-relative'
  );

/**
 * Zod schema for Schema.org `ImageObject`.
 */
export const ImageObjectSchema = z
  .object({
    '@type': z.union([z.string(), z.array(z.string())]).optional(),
    '@id': z.string().optional(),
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
