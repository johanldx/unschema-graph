import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { createEntityRef, EntityReferenceSchema } from '../common/reference.js';
import { createSearchAction, SearchActionSchema } from '../common/searchAction.js';
import { SpeakableSchema } from '../common/speakable.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';
import { BreadcrumbListSchema } from './breadcrumb.js';

const PublisherSchema = createEntityRef(
  z.union([OrganizationSchema, PersonSchema]),
  'Organization'
);

/**
 * Zod schema for Schema.org `WebSite`.
 * Follows Google Search Central sitelinks searchbox and site identity standards.
 */
export const WebSiteSchema = z
  .object({
    name: z.string().min(1, 'Property "name" is required for WebSite'),
    url: z.string().min(1, 'Property "url" is required for WebSite'),
    alternateName: z.union([z.string(), z.array(z.string())]).optional(),
    description: z.string().optional(),
    inLanguage: z.string().optional(),
    searchUrl: z.string().optional(),
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

/**
 * Zod schema for Schema.org `WebPage`.
 */
export const WebPageSchema = z
  .object({
    name: z.string().optional(),
    url: z.string().optional(),
    headline: z.string().optional(),
    description: z.string().optional(),
    inLanguage: z.string().optional(),
    speakable: SpeakableSchema.optional(),
    isPartOf: z
      .union([
        z.string().transform((v) => (v.startsWith('#') || v.startsWith('/') ? { '@id': v } : v)),
        WebSiteSchema,
        EntityReferenceSchema,
      ])
      .optional(),
    breadcrumb: z
      .union([
        z.string().transform((v) => (v.startsWith('#') || v.startsWith('/') ? { '@id': v } : v)),
        BreadcrumbListSchema,
        EntityReferenceSchema,
      ])
      .optional(),
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
