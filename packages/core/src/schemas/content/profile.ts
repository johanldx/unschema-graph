import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

const ProfileEntitySchema = z.union([PersonSchema, OrganizationSchema]);

import { IsoDateSchema } from '../../core/temporal.js';

/**
 * Zod schema for Schema.org `ProfilePage`.
 * Follows Google's Profile Page guidelines (author bio pages, creator profiles).
 */
export const ProfilePageSchema = z
  .object({
    mainEntity: ProfileEntitySchema,
    name: z.string().optional(),
    url: z.string().optional(),
    description: z.string().optional(),
    dateCreated: IsoDateSchema.optional(),
    dateModified: IsoDateSchema.optional(),
    inLanguage: z.string().optional(),
  })
  .strict();

export const ProfilePage = defineSchema('ProfilePage', ProfilePageSchema);
