import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { RelativeOrAbsoluteUrlSchema, WebUrlSchema } from '../common/url.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

/**
 * Zod schema for Schema.org `DataDownload` distribution.
 */
export const DataDownloadSchema = z
  .object({
    '@type': z.literal('DataDownload').default('DataDownload').optional(),
    '@id': z.string().optional(),
    contentUrl: WebUrlSchema,
    encodingFormat: z.string().optional(), // e.g. 'text/csv', 'application/json'
    name: z.string().optional(),
    description: z.string().optional(),
  })
  .strict();

const DatasetCreatorSchema = z.union([z.string(), PersonSchema, OrganizationSchema]);
const CreatorSchema = z.union([DatasetCreatorSchema, z.array(DatasetCreatorSchema)]);

/**
 * Zod schema for Schema.org `Dataset`.
 * Conforms to Google Search Central Dataset structured data guidelines.
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
