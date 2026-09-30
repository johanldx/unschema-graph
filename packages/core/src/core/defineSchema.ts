import { z } from 'zod';
import type { SchemaOrgEntity, SchemaValidationResult, ValidationOptions } from '../types/index.js';
import { safeValidateSchema, validateSchema } from './validator.js';

/**
 * Accepted input type for a schema builder, combining the inferred Zod schema input
 * with a strictly typed Schema.org identifier. The builder owns `@type`.
 */
export type SchemaInput<TSchema extends z.ZodTypeAny> = Omit<z.input<TSchema>, '@id' | '@type'> & {
  '@id'?: string;
};

/**
 * Inferred output type of a schema entity, guaranteed to contain `@type`.
 */
export type SchemaOutput<TSchema extends z.ZodTypeAny, TType extends string = string> = Omit<
  z.output<TSchema>,
  '@id' | '@type'
> & {
  '@type': TType;
  '@id'?: string;
};

/**
 * Explicitly adds properties that are not yet modeled by a built-in schema.
 * Validation always happens before this escape hatch is applied.
 */
export function withAdditionalProperties<
  TEntity extends SchemaOrgEntity,
  const TAdditional extends Record<string, unknown>,
>(
  entity: TEntity,
  properties: TAdditional & { '@type'?: never; '@id'?: never }
): TEntity & TAdditional {
  return { ...entity, ...properties };
}

/** Adds extra Schema.org types while preserving the builder's primary type. */
export function withAdditionalTypes<
  TType extends string,
  TEntity extends SchemaOrgEntity & { '@type': TType },
  const TAdditionalTypes extends readonly [string, ...string[]],
>(
  entity: TEntity,
  additionalTypes: TAdditionalTypes
): Omit<TEntity, '@type'> & { '@type': [TType, ...TAdditionalTypes] } {
  return {
    ...entity,
    '@type': [entity['@type'], ...additionalTypes],
  };
}

/**
 * Builder function returned by {@link defineSchema}.
 * Allows creating validated Schema.org entities or introspecting the underlying schema.
 */
export interface SchemaBuilder<TSchema extends z.ZodTypeAny, TType extends string = string> {
  /**
   * Instantiates and validates a Schema.org entity.
   * Throws {@link SchemaValidationError} if validation fails.
   *
   * @param input - The properties conforming to the schema.
   * @param options - Validation options where onError is 'throw' (or undefined).
   * @returns The validated entity with guaranteed `@type`.
   * @throws {@link SchemaValidationError} If validation fails.
   */
  (
    input: SchemaInput<TSchema>,
    options?: { entityType?: string; onError?: 'throw' }
  ): SchemaOutput<TSchema, TType>;

  /**
   * Instantiates and validates a Schema.org entity with warning or silent error mode.
   *
   * @param input - The properties conforming to the schema.
   * @param options - Validation options where onError is 'warn' or 'silent'.
   * @returns The validated entity with guaranteed `@type`, or `null` if validation failed.
   */
  (
    input: SchemaInput<TSchema>,
    options: { entityType?: string; onError: 'warn' | 'silent' }
  ): SchemaOutput<TSchema, TType> | null;

  /**
   * Generic fallback call signature.
   */
  (input: SchemaInput<TSchema>, options?: ValidationOptions): SchemaOutput<TSchema, TType> | null;

  /**
   * The underlying Zod validation schema.
   */
  readonly schema: z.ZodTypeAny;

  /**
   * The default Schema.org `@type` name.
   */
  readonly entityType: TType;

  /**
   * Safely validates data without throwing, returning a typed result object.
   *
   * @param input - The input data to validate.
   * @param options - Validation options excluding `onError`.
   * @returns An object with `{ success: true, data }` or `{ success: false, error }`.
   */
  safeParse(
    input: unknown,
    options?: Omit<ValidationOptions, 'onError'>
  ): SchemaValidationResult<SchemaOutput<TSchema, TType>>;
}

/**
 * Generic factory to create type-safe and validated Schema.org entity builders.
 *
 * Automatically enhances schemas with:
 * - Default `@type` injection
 * - Optional `@id` support
 * - Strict unknown-property rejection
 * - Configurable validation severity (`throw`, `warn`, `silent`)
 *
 * @typeParam TSchema - Zod schema type defining the entity properties.
 * @typeParam TType - String literal representing the Schema.org `@type`.
 * @param entityType - The Schema.org type name (e.g. `'Article'`, `'Organization'`).
 * @param schema - The Zod schema defining valid fields.
 * @param defaultOptions - Optional default validation configuration.
 * @returns A callable schema builder function with introspection properties.
 *
 * @example
 * ```ts
 * import { z } from 'zod';
 * import { defineSchema } from '@unschema-graph/core';
 *
 * export const SoftwareApplication = defineSchema(
 *   'SoftwareApplication',
 *   z.object({
 *     name: z.string(),
 *     operatingSystem: z.string(),
 *   })
 * );
 *
 * const app = SoftwareApplication({
 *   name: 'My App',
 *   operatingSystem: 'macOS, Linux',
 * });
 * ```
 */
export function defineSchema<TSchema extends z.ZodTypeAny, TType extends string = string>(
  entityType: TType,
  schema: TSchema,
  defaultOptions?: ValidationOptions
): SchemaBuilder<TSchema, TType> {
  const metadataSchema = z
    .object({
      '@id': z.string().min(1).optional(),
      '@type': z
        .never({ error: `Property "@type" is owned by the ${entityType} builder` })
        .optional(),
    })
    .strict();

  const schemaToValidate = schema instanceof z.ZodObject ? schema.strict() : schema;

  const validationSchema = z.unknown().transform((input, ctx) => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      const result = schemaToValidate.safeParse(input);
      if (!result.success) {
        for (const issue of result.error.issues) {
          ctx.addIssue(issue as Parameters<typeof ctx.addIssue>[0]);
        }
        return z.NEVER;
      }
      return result.data;
    }

    const { '@id': id, '@type': type, ...schemaInput } = input as Record<string, unknown>;
    const metadataResult = metadataSchema.safeParse({ '@id': id, '@type': type });
    const schemaResult = schemaToValidate.safeParse(schemaInput);

    if (!metadataResult.success) {
      for (const issue of metadataResult.error.issues) {
        ctx.addIssue(issue as Parameters<typeof ctx.addIssue>[0]);
      }
    }
    if (!schemaResult.success) {
      for (const issue of schemaResult.error.issues) {
        ctx.addIssue(issue as Parameters<typeof ctx.addIssue>[0]);
      }
    }
    if (!metadataResult.success || !schemaResult.success) {
      return z.NEVER;
    }

    return {
      '@type': entityType,
      ...(metadataResult.data['@id'] ? { '@id': metadataResult.data['@id'] } : {}),
      ...(schemaResult.data as Record<string, unknown>),
    };
  });

  const builder = (
    input: SchemaInput<TSchema>,
    options?: ValidationOptions
  ): SchemaOutput<TSchema, TType> | null => {
    const mergedOptions: ValidationOptions = {
      entityType,
      ...defaultOptions,
      ...options,
    };

    const validated = validateSchema(validationSchema, input, mergedOptions) as Record<
      string,
      unknown
    > | null;

    if (!validated) {
      return null;
    }

    return validated as SchemaOutput<TSchema, TType>;
  };

  Object.defineProperty(builder, 'schema', {
    value: validationSchema,
    writable: false,
    enumerable: true,
  });

  Object.defineProperty(builder, 'entityType', {
    value: entityType,
    writable: false,
    enumerable: true,
  });

  builder.safeParse = (
    input: unknown,
    options?: Omit<ValidationOptions, 'onError'>
  ): SchemaValidationResult<SchemaOutput<TSchema, TType>> => {
    const result = safeValidateSchema(validationSchema, input, {
      entityType,
      ...options,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data as SchemaOutput<TSchema, TType>,
    };
  };

  return builder as SchemaBuilder<TSchema, TType>;
}
