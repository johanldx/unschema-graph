import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { PostalAddressSchema } from '../common/address.js';
import { EntityReferenceSchema, entityRef } from '../common/reference.js';
import { OrganizationSchema } from '../identity/organization.js';

const HiringOrgSchema = entityRef({
  schemas: [OrganizationSchema],
  types: ['Organization'],
  fallbackType: 'Organization',
});

const JobLocationSchema = z.union([
  PostalAddressSchema,
  z.string(),
  z
    .object({
      '@type': z.string().default('Place').optional(),
      address: z.union([PostalAddressSchema, z.string()]),
    })
    .strict(),
  EntityReferenceSchema,
]);

/**
 * Curated Zod schema for Schema.org `JobPosting`.
 */
export const JobPostingSchema = z
  .object({
    title: z.string().min(1, 'Property "title" is required for JobPosting'),
    description: z.string().min(1, 'Property "description" is required for JobPosting'),
    datePosted: IsoDateSchema,
    hiringOrganization: HiringOrgSchema,
    jobLocation: JobLocationSchema.optional(),
    validThrough: IsoDateSchema.optional(),
    employmentType: z.union([z.string(), z.array(z.string())]).optional(),
    jobLocationType: z.string().optional(), // 'TELECOMMUTE' for fully remote
    applicantLocationRequirements: z.union([z.string(), EntityReferenceSchema]).optional(),
    baseSalary: z
      .union([
        z
          .object({
            '@type': z.string().default('MonetaryAmount').optional(),
            currency: z.string().length(3),
            value: z.union([
              z.number(),
              z.string(),
              z
                .object({
                  '@type': z.string().default('QuantitativeValue').optional(),
                  value: z.union([z.number(), z.string()]).optional(),
                  minValue: z.union([z.number(), z.string()]).optional(),
                  maxValue: z.union([z.number(), z.string()]).optional(),
                  unitText: z.string().optional(), // 'HOUR', 'MONTH', 'YEAR'
                })
                .strict(),
            ]),
          })
          .strict(),
        EntityReferenceSchema,
      ])
      .optional(),
  })
  .strict();

export const JobPosting = defineSchema('JobPosting', JobPostingSchema);
