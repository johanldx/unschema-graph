import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { EntityReferenceSchema } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';
import { ListItemSchema } from './breadcrumb.js';

const RawItemElementSchema = z.union([
  ListItemSchema,
  z
    .object({
      name: z.string().optional(),
      url: RelativeOrAbsoluteUrlSchema.optional(),
      item: z.union([RelativeOrAbsoluteUrlSchema, EntityReferenceSchema]).optional(),
      position: z.number().int().positive().optional(),
    })
    .strict(),
  EntityReferenceSchema,
]);

/**
 * Zod schema for Schema.org `ItemList` (Carousels and ranked summaries).
 * Automatically assigns 1-based sequential positions if omitted.
 */
export const ItemListSchema = z
  .object({
    itemListElement: z
      .array(RawItemElementSchema)
      .min(1, 'Property "itemListElement" requires at least one item')
      .transform((elements) =>
        elements.map((elem, idx) => {
          if (typeof elem === 'object' && elem !== null) {
            const cast = elem as Record<string, unknown>;
            return {
              '@type': cast['@type'] ?? 'ListItem',
              position: cast.position ?? idx + 1,
              ...cast,
            };
          }
          return elem;
        })
      ),
    name: z.string().optional(),
    description: z.string().optional(),
    itemListOrder: z.string().optional(), // 'https://schema.org/ItemListOrderAscending'
    numberOfItems: z.number().int().nonnegative().optional(),
  })
  .strict();

export const ItemList = defineSchema('ItemList', ItemListSchema);
