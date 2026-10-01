import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema, IsoDurationSchema } from '../../core/temporal.js';
import { ImageUrlOrObject } from '../common/image.js';
import { RelativeOrAbsoluteUrlSchema, WebUrlSchema } from '../common/url.js';

/**
 * Zod schema for Schema.org `Clip` (video key moment/chapter).
 */
export const ClipSchema = z
  .object({
    '@type': z.literal('Clip').default('Clip').optional(),
    '@id': z.string().optional(),
    name: z.string().min(1, 'Clip name is required'),
    startOffset: z.number().nonnegative(),
    endOffset: z.number().positive(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
  })
  .strict();

/**
 * Zod schema for Schema.org `VideoObject`.
 * Follows Google Search Central Video structured data specifications.
 */
export const VideoObjectSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for VideoObject'),
    description: z.string().min(1, 'Property "description" is required for VideoObject'),
    thumbnailUrl: z.union(
      [z.string(), z.array(z.string()), ImageUrlOrObject, z.array(ImageUrlOrObject)],
      {
        message: 'Property "thumbnailUrl" is required for VideoObject',
      }
    ),
    uploadDate: IsoDateSchema,
    duration: IsoDurationSchema.optional(),
    contentUrl: WebUrlSchema.optional(),
    embedUrl: WebUrlSchema.optional(),
    hasPart: z.union([ClipSchema, z.array(ClipSchema)]).optional(),
    inLanguage: z.string().optional(),
  })
  .strict();

export const Clip = defineSchema('Clip', ClipSchema);
export const VideoObject = defineSchema('VideoObject', VideoObjectSchema);
