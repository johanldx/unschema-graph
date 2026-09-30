import { z } from 'zod';

/**
 * Zod schema for Schema.org `SpeakableSpecification`.
 * Defines CSS selectors or XPath expressions identifying text suitable for speech synthesis
 * by Google Assistant, voice search, and AI search engines.
 */
export const SpeakableSchema = z.union([
  z.string().transform((selector) => ({
    '@type': 'SpeakableSpecification',
    cssSelector: [selector],
  })),
  z.array(z.string()).transform((selectors) => ({
    '@type': 'SpeakableSpecification',
    cssSelector: selectors,
  })),
  z
    .object({
      '@type': z.string().default('SpeakableSpecification').optional(),
      cssSelector: z.union([z.string(), z.array(z.string())]).optional(),
      xpath: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .strict(),
]);
