import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { entityRef, TypedEntitySchema } from '../common/reference.js';
import { createSearchAction, SearchActionSchema } from '../common/searchAction.js';
import { SpeakableSchema } from '../common/speakable.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';
import { BreadcrumbListSchema } from './breadcrumb.js';

const PublisherSchema = entityRef({
  schemas: [OrganizationSchema, PersonSchema],
  types: ['Organization', 'Person'],
  fallbackType: 'Organization',
});

/**
 * Curated Zod schema for Schema.org `WebSite`.
 */
export const WebSiteSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for WebSite'),
    url: RelativeOrAbsoluteUrlSchema,
    alternateName: z.union([z.string(), z.array(z.string())]).optional(),
    description: z.string().optional(),
    inLanguage: z.string().optional(),
    searchUrl: RelativeOrAbsoluteUrlSchema.optional(),
    publisher: PublisherSchema.optional(),
    potentialAction: z.union([SearchActionSchema, z.array(SearchActionSchema)]).optional(),
  })
  .strict()
  .transform((data) => {
    const { searchUrl, ...rest } = data;
    if (searchUrl && !rest.potentialAction) {
      rest.potentialAction = createSearchAction(searchUrl);
    }
    return rest;
  });

const IsPartOfSchema = entityRef({
  schemas: [WebSiteSchema, TypedEntitySchema],
  types: ['WebSite', 'WebPage', 'CreativeWork'],
});
const BreadcrumbReferenceSchema = entityRef({
  schemas: [BreadcrumbListSchema],
  types: ['BreadcrumbList'],
});

/**
 * Zod schema for Schema.org `WebPage`.
 */
export const WebPageSchema = z
  .object({
    name: z.string().optional(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
    headline: z.string().optional(),
    description: z.string().optional(),
    inLanguage: z.string().optional(),
    speakable: SpeakableSchema.optional(),
    isPartOf: IsPartOfSchema.optional(),
    breadcrumb: BreadcrumbReferenceSchema.optional(),
  })
  .strict();

/**
 * Schema.org `WebSite` entity builder.
 */
export const WebSite = defineSchema('WebSite', WebSiteSchema);

/**
 * Schema.org `WebPage` entity builder.
 */
export const WebPage = defineSchema('WebPage', WebPageSchema);
