import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema, IsoDurationSchema } from '../../core/temporal.js';
import { AggregateRatingSchema, ReviewSchema } from '../commerce/review.js';
import { ImageUrlOrObject } from '../common/image.js';
import { PersonSchema } from '../identity/person.js';
import { VideoObjectSchema } from './video.js';

const CastMemberSchema = z.union([z.string(), PersonSchema]);
const CastSchema = z.union([CastMemberSchema, z.array(CastMemberSchema)]);

/**
 * Zod schema for Schema.org `Movie`.
 */
export const MovieSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Movie'),
    image: z.union([ImageUrlOrObject, z.array(ImageUrlOrObject)]).optional(),
    director: CastSchema.optional(),
    actor: CastSchema.optional(),
    dateCreated: IsoDateSchema.optional(),
    duration: IsoDurationSchema.optional(),
    trailer: VideoObjectSchema.optional(),
    description: z.string().optional(),
    aggregateRating: AggregateRatingSchema.optional(),
    review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
  })
  .strict();

export const Movie = defineSchema('Movie', MovieSchema);
