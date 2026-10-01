import { z } from 'zod';

const SchemaTypeNameSchema = z.string().trim().min(1, 'Schema.org type cannot be empty');

/**
 * Normalizes Schema.org types while preserving first-seen order and the primary type.
 */
export function normalizeSchemaTypes(
  current: string | readonly string[],
  additional: readonly string[] = []
): [string, ...string[]] {
  const normalized: string[] = [];

  for (const rawType of [...(Array.isArray(current) ? current : [current]), ...additional]) {
    const type = SchemaTypeNameSchema.parse(rawType);
    if (!normalized.includes(type)) {
      normalized.push(type);
    }
  }

  if (normalized.length === 0) {
    throw new TypeError('At least one Schema.org type is required');
  }

  return normalized as [string, ...string[]];
}

/** A single non-empty type or a normalized, non-empty array of Schema.org types. */
export const SchemaTypeSchema = z.union([
  SchemaTypeNameSchema,
  z
    .array(SchemaTypeNameSchema)
    .min(1, 'At least one Schema.org type is required')
    .transform((types) => normalizeSchemaTypes(types)),
]);
