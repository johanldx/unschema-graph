import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { EntityIdSchema, entityRef } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema, WebUrlSchema } from '../common/url.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

/**
 * Zod schema for Schema.org `DataDownload` distribution.
 */
export const DataDownloadSchema = z
  .object({
    '@type': z.literal('DataDownload').default('DataDownload').optional(),
    '@id': EntityIdSchema.optional(),
    contentUrl: WebUrlSchema,
    encodingFormat: z.string().optional(), // e.g. 'text/csv', 'application/json'
    name: z.string().optional(),
    description: z.string().optional(),
  })
  .strict();

const DatasetCreatorSchema = entityRef({
  schemas: [PersonSchema, OrganizationSchema],
  types: ['Person', 'Organization'],
  fallbackType: 'Person',
});
const CreatorSchema = z.union([DatasetCreatorSchema, z.array(DatasetCreatorSchema)]);

/**
 * Curated Zod schema for Schema.org `Dataset`.
 */
export const DatasetSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Dataset'),
    description: z.string().min(1, 'Property "description" is required for Dataset'),
    url: RelativeOrAbsoluteUrlSchema.optional(),
    creator: CreatorSchema.optional(),
    distribution: z.union([DataDownloadSchema, z.array(DataDownloadSchema)]).optional(),
    license: RelativeOrAbsoluteUrlSchema.optional(),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
    temporalCoverage: z.string().optional(),
    spatialCoverage: z.string().optional(),
    version: z.string().optional(),
    isAccessibleForFree: z.boolean().optional(),
  })
  .strict();

export const DataDownload = defineSchema('DataDownload', DataDownloadSchema);
export const Dataset = defineSchema('Dataset', DatasetSchema);
