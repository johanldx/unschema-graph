import { z } from 'zod';

/**
 * Checks if a string looks like an ID reference (fragment, relative URL, or absolute URI).
 */
export function isIdReference(str: string): boolean {
  return (
    str.startsWith('#') ||
    str.startsWith('/') ||
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('urn:')
  );
}

/**
 * Zod schema matching an explicit ID reference object `{ '@id': string }`.
 */
export const IdObjectSchema = z
  .object({
    '@id': z.string().min(1),
  })
  .strict();

/**
 * Generic extension point for an explicitly typed Schema.org entity.
 * Requiring `@type` prevents arbitrary records from bypassing nested validation.
 */
export const TypedEntitySchema = z
  .object({
    '@type': z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
    '@id': z.string().min(1).optional(),
  })
  .passthrough();

export const EntityReferenceSchema = z.union([IdObjectSchema, TypedEntitySchema]);

/**
 * Creates a flexible Zod schema that accepts:
 * 1. A valid entity object matching the supplied schema (e.g. `Person`, `Organization`).
 * 2. An explicit reference object `{ '@id': '#organization' }`.
 * 3. A reference string starting with `#`, `/`, `http://`, `https://`, which transforms to `{ '@id': str }`.
 * 4. A plain name string (e.g. `'John Doe'`, `'Acme Corp'`), which transforms to `{ '@type': fallbackType, name: str }` when fallbackType is provided.
 */
export function createEntityRef<T extends z.ZodTypeAny>(entitySchema: T, fallbackType?: string) {
  const stringSchema = z
    .string()
    .min(1)
    .transform((val) => {
      if (isIdReference(val)) {
        return { '@id': val };
      }
      if (fallbackType) {
        return { '@type': fallbackType, name: val };
      }
      return { '@id': val };
    });

  return z.union([stringSchema, entitySchema, IdObjectSchema]);
}
