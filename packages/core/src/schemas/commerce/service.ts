import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { EntityIdSchema, entityRef, IdObjectSchema } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';
import { LocalBusinessSchema } from '../identity/localBusiness.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';
import { AggregateOfferSchema, OfferSchema } from './offer.js';
import { AggregateRatingSchema, ReviewSchema } from './review.js';

const ProviderSchema = entityRef({
  schemas: [OrganizationSchema, PersonSchema, LocalBusinessSchema],
  types: ['Organization', 'Person', 'LocalBusiness', 'Restaurant', 'Store'],
  fallbackType: 'Organization',
});

/** Lightweight Schema.org place value accepted by `Service.areaServed`. */
export const AreaServedPlaceSchema = z
  .object({
    '@type': z.enum(['Country', 'AdministrativeArea', 'Place']),
    '@id': EntityIdSchema.optional(),
    name: z.string().min(1, 'Property "name" cannot be empty for an area served').optional(),
  })
  .strict()
  .refine((area) => area.name !== undefined || area['@id'] !== undefined, {
    message: 'An area served must define "name" or "@id"',
  });

const AreaServedValueSchema = z.union([
  z.string().min(1, 'Property "areaServed" cannot be empty'),
  AreaServedPlaceSchema,
  IdObjectSchema,
]);

/** Schema.org text, place value, or list accepted by `Service.areaServed`. */
export const AreaServedSchema = z.union([
  AreaServedValueSchema,
  z.array(AreaServedValueSchema).min(1, 'Property "areaServed" cannot be empty'),
]);

/**
 * Zod schema for Schema.org `Service`.
 */
export const ServiceSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Service'),
    provider: ProviderSchema.optional(),
    serviceType: z.string().optional(),
    description: z.string().optional(),
    areaServed: AreaServedSchema.optional(),
    offers: z.union([OfferSchema, AggregateOfferSchema, z.array(OfferSchema)]).optional(),
    aggregateRating: AggregateRatingSchema.optional(),
    review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
    termsOfService: RelativeOrAbsoluteUrlSchema.optional(),
  })
  .strict();

export const Service = defineSchema('Service', ServiceSchema);
