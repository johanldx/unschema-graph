import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { createEntityRef } from '../common/reference.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

/**
 * Seller reference or entity schema.
 */
const SellerSchema = createEntityRef(z.union([OrganizationSchema, PersonSchema]), 'Organization');

/**
 * Zod schema for Schema.org `Offer`.
 * Validates price, 3-letter currency code, and availability for Google Rich Results.
 */
export const OfferSchema = z
  .object({
    '@type': z.literal('Offer').default('Offer').optional(),
    '@id': z.string().optional(),
    price: z.union([z.number(), z.string()], {
      message: 'Property "price" is required for Offer',
    }),
    priceCurrency: z
      .string()
      .min(3, 'Property "priceCurrency" must be a 3-letter ISO 4217 code (e.g. EUR, USD)')
      .max(3, 'Property "priceCurrency" must be a 3-letter ISO 4217 code (e.g. EUR, USD)'),
    availability: z.string().optional(),
    url: z.string().optional(),
    priceValidUntil: IsoDateSchema.optional(),
    itemCondition: z.string().optional(),
    seller: SellerSchema.optional(),
  })
  .strict();

/**
 * Zod schema for Schema.org `AggregateOffer`.
 */
export const AggregateOfferSchema = z
  .object({
    '@type': z.literal('AggregateOffer').default('AggregateOffer').optional(),
    '@id': z.string().optional(),
    lowPrice: z.union([z.number(), z.string()], {
      message: 'Property "lowPrice" is required for AggregateOffer',
    }),
    highPrice: z.union([z.number(), z.string()]).optional(),
    priceCurrency: z
      .string()
      .min(3, 'Property "priceCurrency" must be a 3-letter ISO 4217 code (e.g. EUR, USD)')
      .max(3, 'Property "priceCurrency" must be a 3-letter ISO 4217 code (e.g. EUR, USD)'),
    offerCount: z.union([z.number(), z.string()]).optional(),
    offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
  })
  .strict();

/**
 * Schema.org `Offer` entity builder.
 */
export const Offer = defineSchema('Offer', OfferSchema);

/**
 * Schema.org `AggregateOffer` entity builder.
 */
export const AggregateOffer = defineSchema('AggregateOffer', AggregateOfferSchema);
