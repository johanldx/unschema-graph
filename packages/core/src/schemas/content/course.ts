import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { AggregateOfferSchema, OfferSchema } from '../commerce/offer.js';
import { createEntityRef } from '../common/reference.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

const ProviderSchema = createEntityRef(z.union([OrganizationSchema, PersonSchema]), 'Organization');

/**
 * Zod schema for Schema.org `Course`.
 */
export const CourseSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Course'),
    description: z.string().min(1, 'Property "description" is required for Course'),
    provider: ProviderSchema,
    courseCode: z.string().optional(),
    educationalCredentialAwarded: z.string().optional(),
    inLanguage: z.string().optional(),
    offers: z.union([OfferSchema, AggregateOfferSchema, z.array(OfferSchema)]).optional(),
  })
  .strict();

export const Course = defineSchema('Course', CourseSchema);
