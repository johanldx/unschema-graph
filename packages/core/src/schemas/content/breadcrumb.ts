import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { EntityIdSchema } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';

/**
 * Zod schema for individual Breadcrumb `ListItem`.
 */
export const ListItemSchema = z
  .object({
    '@type': z.literal('ListItem').default('ListItem'),
    '@id': EntityIdSchema.optional(),
    position: z.number().int().positive().optional(),
    name: z.string().min(1, 'Property "name" is required for Breadcrumb item'),
    item: RelativeOrAbsoluteUrlSchema.optional(),
  })
  .strict();

/**
 * Input representation for a breadcrumb element before automatic position indexing.
 */
const BreadcrumbItemInputSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Breadcrumb item'),
    item: RelativeOrAbsoluteUrlSchema.optional(),
    position: z.number().int().positive().optional(),
  })
  .strict();

/**
 * Zod schema for Schema.org `BreadcrumbList`.
 * Automatically injects `@type: 'ListItem'` and 1-based sequential `position`
 * if not explicitly provided.
 */
export const BreadcrumbListSchema = z
  .object({
    '@type': z.literal('BreadcrumbList').default('BreadcrumbList').optional(),
    '@id': EntityIdSchema.optional(),
    itemListElement: z
      .array(z.union([ListItemSchema, BreadcrumbItemInputSchema]))
      .transform((elements) =>
        elements.map((elem, idx) => ({
          '@type': 'ListItem',
          position: elem.position ?? idx + 1,
          ...elem,
        }))
      ),
  })
  .strict();

/**
 * Schema.org `ListItem` entity builder.
 */
export const ListItem = defineSchema('ListItem', ListItemSchema);

/**
 * Schema.org `BreadcrumbList` entity builder.
 */
export const BreadcrumbList = defineSchema('BreadcrumbList', BreadcrumbListSchema);
