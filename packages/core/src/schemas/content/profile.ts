import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { entityRef } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

const ProfileEntitySchema = entityRef({
  schemas: [PersonSchema, OrganizationSchema],
  types: ['Person', 'Organization'],
});

/**
 * Curated Zod schema for Schema.org `ProfilePage`.
 */
export const ProfilePageSchema = z
  .object({
    mainEntity: ProfileEntitySchema,
    name: z.string().optional(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
    description: z.string().optional(),
    dateCreated: IsoDateSchema.optional(),
    dateModified: IsoDateSchema.optional(),
    inLanguage: z.string().optional(),
  })
  .strict();

export const ProfilePage = defineSchema('ProfilePage', ProfilePageSchema);
