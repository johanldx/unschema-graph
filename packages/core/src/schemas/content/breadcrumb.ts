import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';

/**
 * Zod schema for individual Breadcrumb `ListItem`.
 */
export const ListItemSchema = z
  .object({
    '@type': z.literal('ListItem').default('ListItem'),
    '@id': z.string().optional(),
    position: z.number().int().positive().optional(),
    name: z.string().min(1, 'Property "name" is required for Breadcrumb item'),
    item: z.string().min(1, 'Property "item" (URL) is required for Breadcrumb item').optional(),
  })
  .strict();

/**
 * Input representation for a breadcrumb element before automatic position indexing.
 */
const BreadcrumbItemInputSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Breadcrumb item'),
    item: z.string().min(1, 'Property "item" (URL) is required for Breadcrumb item').optional(),
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
