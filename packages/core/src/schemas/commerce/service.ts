import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { createEntityRef, EntityReferenceSchema } from '../common/reference.js';
import { LocalBusinessSchema } from '../identity/localBusiness.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';
import { AggregateOfferSchema, OfferSchema } from './offer.js';
import { AggregateRatingSchema, ReviewSchema } from './review.js';

const ProviderSchema = createEntityRef(
  z.union([OrganizationSchema, PersonSchema, LocalBusinessSchema]),
  'Organization'
);

/**
 * Zod schema for Schema.org `Service`.
 */
export const ServiceSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Service'),
    provider: ProviderSchema.optional(),
    serviceType: z.string().optional(),
    description: z.string().optional(),
    areaServed: z.union([z.string(), z.array(z.string()), EntityReferenceSchema]).optional(),
    offers: z.union([OfferSchema, AggregateOfferSchema, z.array(OfferSchema)]).optional(),
    aggregateRating: AggregateRatingSchema.optional(),
    review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
    termsOfService: z.string().optional(),
  })
  .strict();

export const Service = defineSchema('Service', ServiceSchema);
