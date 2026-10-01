import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema, IsoDurationSchema } from '../../core/temporal.js';
import { AggregateRatingSchema } from '../commerce/review.js';
import { ImageUrlOrObject } from '../common/image.js';
import { entityRef } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

const AuthorSchema = entityRef({
  schemas: [PersonSchema, OrganizationSchema],
  types: ['Person', 'Organization'],
  fallbackType: 'Person',
});

const InstructionItemSchema = z.union([
  z.string().transform((text) => ({ '@type': 'HowToStep', text })),
  z
    .object({
      '@type': z.string().default('HowToStep').optional(),
      text: z.string().min(1, 'Instruction text cannot be empty'),
      name: z.string().optional(),
      url: RelativeOrAbsoluteUrlSchema.optional(),
      image: ImageUrlOrObject.optional(),
    })
    .strict(),
]);

const RecipeImageSchema = z.union([ImageUrlOrObject, z.array(ImageUrlOrObject)]);
const RecipeIngredientSchema = z
  .array(z.string())
  .min(1, 'Property "recipeIngredient" requires at least one ingredient');
const RecipeInstructionsSchema = z.union([
  z.array(InstructionItemSchema).min(1, 'Property "recipeInstructions" requires at least one step'),
  z.string().transform((text) => [{ '@type': 'HowToStep', text }]),
]);

/** Zod schema for the implemented Schema.org `Recipe` model. */
export const RecipeSchema = z
  .object({
    name: z.string().min(1, 'Property "name" cannot be empty').optional(),
    image: RecipeImageSchema.optional(),
    recipeIngredient: RecipeIngredientSchema.optional(),
    recipeInstructions: RecipeInstructionsSchema.optional(),
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
 * Google Recipe rich-result profile implemented by the library.
 * Passing this schema does not guarantee search-engine eligibility or display.
 */
export const GoogleRecipeSchema = RecipeSchema.extend({
  name: z.string().min(1, 'Property "name" is required by the Google Recipe profile'),
  image: RecipeImageSchema,
  recipeIngredient: RecipeIngredientSchema,
  recipeInstructions: RecipeInstructionsSchema,
});

/**
 * Schema.org `Recipe` entity builder.
 */
export const Recipe = defineSchema('Recipe', RecipeSchema);

/** Schema.org `Recipe` builder with the implemented Google profile constraints. */
export const GoogleRecipe = defineSchema('Recipe', GoogleRecipeSchema);
