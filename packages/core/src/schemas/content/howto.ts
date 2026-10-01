import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDurationSchema } from '../../core/duration.js';
import { ImageUrlOrObject } from '../common/image.js';
import { EntityIdSchema, EntityReferenceSchema } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';

/**
 * Zod schema for Schema.org `HowToStep`.
 */
export const HowToStepSchema = z
  .object({
    '@type': z.literal('HowToStep').default('HowToStep').optional(),
    '@id': EntityIdSchema.optional(),
    name: z.string().optional(),
    text: z.string().min(1, 'Property "text" is required for HowToStep'),
    image: ImageUrlOrObject.optional(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
  })
  .strict();

/**
 * Zod schema for Schema.org `HowToSection`.
 */
export const HowToSectionSchema = z
  .object({
    '@type': z.literal('HowToSection').default('HowToSection').optional(),
    '@id': EntityIdSchema.optional(),
    name: z.string().min(1, 'Property "name" is required for HowToSection'),
    itemListElement: z.array(HowToStepSchema),
  })
  .strict();

const StepOrString = z.union([
  z.string().transform((text) => ({ '@type': 'HowToStep', text })),
  HowToStepSchema,
  HowToSectionSchema,
]);

/**
 * Zod schema for Schema.org `HowTo`.
 */
export const HowToSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for HowTo'),
    step: z.array(StepOrString).min(1, 'Property "step" requires at least one step'),
    description: z.string().optional(),
    image: z.union([ImageUrlOrObject, z.array(ImageUrlOrObject)]).optional(),
    totalTime: IsoDurationSchema.optional(),
    estimatedCost: z.union([z.string(), EntityReferenceSchema]).optional(),
    supply: z.union([z.string(), z.array(z.string()), z.array(EntityReferenceSchema)]).optional(),
    tool: z.union([z.string(), z.array(z.string()), z.array(EntityReferenceSchema)]).optional(),
  })
  .strict();

export const HowToStep = defineSchema('HowToStep', HowToStepSchema);
export const HowToSection = defineSchema('HowToSection', HowToSectionSchema);
export const HowTo = defineSchema('HowTo', HowToSchema);
