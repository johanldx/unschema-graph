import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema, IsoDurationSchema } from '../../core/temporal.js';
import { AggregateRatingSchema } from '../commerce/review.js';
import { ImageUrlOrObject } from '../common/image.js';
import { createEntityRef } from '../common/reference.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

const AuthorSchema = createEntityRef(z.union([PersonSchema, OrganizationSchema]), 'Person');

const InstructionItemSchema = z.union([
  z.string().transform((text) => ({ '@type': 'HowToStep', text })),
  z
    .object({
      '@type': z.string().default('HowToStep').optional(),
      text: z.string().min(1, 'Instruction text cannot be empty'),
      name: z.string().optional(),
      url: z.string().optional(),
      image: ImageUrlOrObject.optional(),
    })
    .strict(),
]);

/**
 * Zod schema for Schema.org `Recipe`.
 * Follows Google Search Central Recipe Rich Results specifications.
 */
export const RecipeSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Recipe'),
    image: z.union([ImageUrlOrObject, z.array(ImageUrlOrObject)], {
      message: 'Property "image" is required by Google Search Central for Recipe Rich Results',
    }),
    recipeIngredient: z
      .array(z.string())
      .min(1, 'Property "recipeIngredient" requires at least one ingredient'),
    recipeInstructions: z.union(
      [
        z.array(InstructionItemSchema),
        z.string().transform((text) => [{ '@type': 'HowToStep', text }]),
      ],
      {
        message: 'Property "recipeInstructions" is required for Recipe',
      }
    ),
    author: AuthorSchema.optional(),
    datePublished: IsoDateSchema.optional(),
    description: z.string().optional(),
    prepTime: IsoDurationSchema.optional(),
    cookTime: IsoDurationSchema.optional(),
    totalTime: IsoDurationSchema.optional(),
    recipeYield: z.union([z.string(), z.number()]).optional(),
    recipeCategory: z.union([z.string(), z.array(z.string())]).optional(),
    recipeCuisine: z.union([z.string(), z.array(z.string())]).optional(),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
    nutrition: z
      .object({
        '@type': z.string().default('NutritionInformation').optional(),
        calories: z.string().optional(),
        fatContent: z.string().optional(),
        carbohydrateContent: z.string().optional(),
        proteinContent: z.string().optional(),
      })
      .strict()
      .optional(),
    aggregateRating: AggregateRatingSchema.optional(),
  })
  .strict();

/**
 * Schema.org `Recipe` entity builder.
 */
export const Recipe = defineSchema('Recipe', RecipeSchema);
