import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { addDuration, IsoDateSchema, IsoDurationSchema } from '../../core/temporal.js';
import { AggregateOfferSchema, OfferSchema } from '../commerce/offer.js';
import { PostalAddressSchema } from '../common/address.js';
import { ImageUrlOrObject } from '../common/image.js';
import { EntityIdSchema, entityRef } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';

const EventPlaceSchema = z
  .object({
    '@type': z.enum(['Place', 'VirtualLocation']).optional(),
    '@id': EntityIdSchema.optional(),
    name: z.string().optional(),
    address: z.union([z.string(), PostalAddressSchema]).optional(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
  })
  .strict();

const EventPlaceReferenceSchema = entityRef({
  schemas: [EventPlaceSchema],
  types: ['Place', 'VirtualLocation'],
});

/** Location value supporting inline addresses/places and identifiable place references. */
const EventLocationSchema = z.union([
  z.string().min(1, 'Location cannot be empty'),
  PostalAddressSchema,
  EventPlaceReferenceSchema,
]);

/**
 * Organizer or performer reference/entity schema.
 */
const PerformerOrOrganizerSchema = entityRef({
  schemas: [PersonSchema, OrganizationSchema],
  types: ['Person', 'Organization'],
  fallbackType: 'Organization',
});

/**
 * Curated Zod schema for Schema.org `Event`.
 */
export const EventSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for Event'),
    startDate: IsoDateSchema,
    location: EventLocationSchema,
    endDate: IsoDateSchema.optional(),
    duration: IsoDurationSchema.optional(),
    description: z.string().optional(),
    image: z.union([ImageUrlOrObject, z.array(ImageUrlOrObject)]).optional(),
    eventStatus: z.string().optional(),
    eventAttendanceMode: z.string().optional(),
    organizer: z
      .union([PerformerOrOrganizerSchema, z.array(PerformerOrOrganizerSchema)])
      .optional(),
    performer: z
      .union([PerformerOrOrganizerSchema, z.array(PerformerOrOrganizerSchema)])
      .optional(),
    offers: z.union([OfferSchema, AggregateOfferSchema, z.array(OfferSchema)]).optional(),
  })
  .strict()
  .transform((data) => {
    if (data.startDate && data.duration && !data.endDate) {
      try {
        data.endDate = addDuration(data.startDate, data.duration);
      } catch {
        // preserve
      }
    }
    return data;
  });

/**
 * Schema.org `Event` entity builder.
 */
export const Event = defineSchema('Event', EventSchema);
