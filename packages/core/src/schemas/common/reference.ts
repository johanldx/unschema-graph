import { z } from 'zod';
import { EntityIdSchema } from '../../core/entityId.js';
import { SchemaTypeSchema } from '../../core/schemaType.js';

export { EntityIdSchema } from '../../core/entityId.js';

/**
 * Checks if a string looks like an ID reference (fragment, relative URL, or absolute URI).
 */
export function isIdReference(str: string): boolean {
  const value = str.trim();
  return (
    value.startsWith('#') ||
    value.startsWith('/') ||
    value.startsWith('./') ||
    value.startsWith('../') ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)
  );
}

/**
 * Zod schema matching an explicit ID reference object `{ '@id': string }`.
 */
export const IdObjectSchema = z
  .object({
    '@id': EntityIdSchema,
  })
  .strict();

/**
 * Generic extension point for an explicitly typed Schema.org entity.
 * Requiring `@type` prevents arbitrary records from bypassing nested validation.
 */
export const TypedEntitySchema = z
  .object({
    '@type': SchemaTypeSchema,
    '@id': EntityIdSchema.optional(),
  })
  // Intentional extension point for custom Schema.org entities used in relationships.
  .passthrough();

type EntitySchemas = readonly [z.ZodTypeAny, ...z.ZodTypeAny[]];

/** Configuration for the shared entity-relationship schema primitive. */
export interface EntityRefOptions<TSchemas extends EntitySchemas> {
  /** Schemas accepted as embedded or directly linked entities. */
  schemas: TSchemas;
  /** Schema.org types allowed when a direct entity carries `@type`. */
  types?: readonly string[];
  /** Schema.org type used to expand a plain-name shorthand. */
  fallbackType?: string;
}

/**
 * Creates the single relationship schema used by built-in entities.
 *
 * It accepts:
 * 1. A valid entity object matching the supplied schema (e.g. `Person`, `Organization`).
 * 2. An explicit reference object `{ '@id': '#organization' }`.
 * 3. A fragment, relative path, or URI string, which transforms to `{ '@id': str }`.
 * 4. A plain name string (e.g. `'John Doe'`, `'Acme Corp'`), which transforms to `{ '@type': fallbackType, name: str }` when fallbackType is provided.
 * A plain name is rejected when no fallback type is configured.
 */
export function entityRef<const TSchemas extends EntitySchemas>({
  schemas,
  types,
  fallbackType,
}: EntityRefOptions<TSchemas>) {
  const stringSchema = z
    .string()
    .min(1)
    .transform((val, ctx) => {
      if (isIdReference(val)) {
        return { '@id': val };
      }
      if (fallbackType) {
        return { '@type': fallbackType, name: val };
      }
      ctx.addIssue({
        code: 'custom',
        message: 'Expected an explicit entity reference',
        params: {
          kind: 'entity_reference',
          suggestion:
            "Pass an entity object, '#id', '/path#id', absolute URI, or { '@id': '#id' }.",
        },
      });
      return z.NEVER;
    });

  const relationSchema = z.union([stringSchema, ...schemas, IdObjectSchema] as unknown as [
    typeof stringSchema,
    ...TSchemas,
    typeof IdObjectSchema,
  ]);

  if (!types) {
    return relationSchema;
  }

  const expected = `${types.join(' | ')} | @id reference`;
  const referenceName = fallbackType?.toLowerCase() ?? types[0]?.toLowerCase() ?? 'entity';
  const suggestion = `Pass ${types
    .map((type) => `${type}(...)`)
    .join(', ')}, '#${referenceName}', or { '@id': '#${referenceName}' }.`;

  const schemaWithRelationDiagnostic = z.unknown().transform((value, ctx) => {
    const result = relationSchema.safeParse(value);
    if (!result.success) {
      const rawType =
        value && typeof value === 'object' && '@type' in value
          ? (value as Record<string, unknown>)['@type']
          : undefined;
      const received = Array.isArray(rawType)
        ? rawType.filter((type): type is string => typeof type === 'string').join(' | ')
        : typeof rawType === 'string'
          ? rawType
          : Array.isArray(value)
            ? 'array'
            : value === null
              ? 'null'
              : typeof value;

      ctx.addIssue({
        code: 'custom',
        message: 'Invalid entity relationship',
        params: {
          kind: 'entity_relation',
          expected,
          received,
          suggestion,
        },
      });
      return z.NEVER;
    }

    const parsed = result.data;
    if (parsed && typeof parsed === 'object' && '@type' in parsed) {
      const rawType = parsed['@type'];
      const entityTypes = Array.isArray(rawType) ? rawType : [rawType];
      if (!entityTypes.some((type) => typeof type === 'string' && types.includes(type))) {
        const received = entityTypes
          .filter((type): type is string => typeof type === 'string')
          .join(' | ');
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid entity relationship',
          params: {
            kind: 'entity_relation',
            expected,
            received,
            suggestion,
          },
        });
        return z.NEVER;
      }
    }

    return parsed;
  });

  // Keep the precise public input/output inferred from the supplied entity schemas.
  return schemaWithRelationDiagnostic as unknown as typeof relationSchema;
}

/** Generic relationship schema retained for value-object unions and custom schemas. */
export const EntityReferenceSchema = entityRef({ schemas: [TypedEntitySchema] });

/**
 * @deprecated Use `entityRef({ schemas: [entitySchema], fallbackType })`.
 */
export function createEntityRef<T extends z.ZodTypeAny>(entitySchema: T, fallbackType?: string) {
  return entityRef({ schemas: [entitySchema], fallbackType });
}
