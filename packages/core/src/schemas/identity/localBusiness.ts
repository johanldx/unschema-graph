import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { SchemaTypeSchema } from '../../core/schemaType.js';
import { PostalAddressSchema } from '../common/address.js';
import { GeoCoordinatesSchema } from '../common/geo.js';
import { ImageUrlOrObject } from '../common/image.js';
import { EntityReferenceSchema } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';

/**
 * Opening hours specification schema.
 */
export const OpeningHoursSpecificationSchema = z
  .object({
    '@type': SchemaTypeSchema.optional(),
    '@id': z.string().optional(),
    dayOfWeek: z.union([z.string(), z.array(z.string())]),
    opens: z.string().optional(),
    closes: z.string().optional(),
    validFrom: z.string().optional(),
    validThrough: z.string().optional(),
  })
  .strict();

/**
 * Zod schema for Schema.org `LocalBusiness`.
 * Follows Google Search Central Local Business rich result guidelines.
 */
export const LocalBusinessSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for LocalBusiness'),
    address: z.union([z.string(), PostalAddressSchema, EntityReferenceSchema], {
      message: 'Property "address" is required for LocalBusiness (PostalAddress or string)',
    }),
    image: ImageUrlOrObject.optional(),
    telephone: z.string().optional(),
    priceRange: z.string().optional(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
    geo: z.union([GeoCoordinatesSchema, EntityReferenceSchema]).optional(),
    openingHoursSpecification: z
      .union([OpeningHoursSpecificationSchema, z.array(OpeningHoursSpecificationSchema)])
      .optional(),
    currenciesAccepted: z.string().optional(),
    paymentAccepted: z.string().optional(),
    sameAs: z.union([RelativeOrAbsoluteUrlSchema, z.array(RelativeOrAbsoluteUrlSchema)]).optional(),
    servesCuisine: z.union([z.string(), z.array(z.string())]).optional(),
    menu: RelativeOrAbsoluteUrlSchema.optional(),
  })
  .strict();

/**
 * Schema.org `LocalBusiness` entity builder.
 */
export const LocalBusiness = defineSchema('LocalBusiness', LocalBusinessSchema);

/**
 * Schema.org `Restaurant` specialized local business builder.
 */
export const Restaurant = defineSchema('Restaurant', LocalBusinessSchema);

/**
 * Schema.org `Store` specialized local business builder.
 */
export const Store = defineSchema('Store', LocalBusinessSchema);
