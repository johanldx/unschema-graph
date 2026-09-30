import type { ZodError, ZodIssue, ZodType } from 'zod';
import { getGlobalConfig } from '../config.js';
import {
  SchemaValidationError,
  type SchemaValidationIssue,
  type SchemaValidationResult,
  type Severity,
  type ValidationOptions,
} from '../types/index.js';

/**
 * Formats an array path into a standard property access string.
 *
 * @example
 * formatPath(['author', 0, 'name']) // 'author[0].name'
 * formatPath(['image']) // 'image'
 * formatPath([]) // '(root)'
 */
function formatPath(path: readonly (string | number | symbol)[]): string {
  if (path.length === 0) {
    return '(root)';
  }

  return path.reduce<string>((acc, segment) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`;
    }
    const key = String(segment);
    return acc.length > 0 ? `${acc}.${key}` : key;
  }, '');
}

function getValueAtPath(data: unknown, path: readonly PropertyKey[]): unknown {
  let current = data;
  for (const segment of path) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<PropertyKey, unknown>)[segment];
  }
  return current;
}

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) return String(value);
    return serialized.length > 160 ? `${serialized.slice(0, 157)}...` : serialized;
  } catch {
    return String(value);
  }
}

function suggestionForIssue(issue: ZodIssue, path: string): string {
  switch (issue.code) {
    case 'invalid_type':
      return `Provide ${path} using the expected type.`;
    case 'invalid_format':
      return `Replace ${path} with a value matching the expected format.`;
    case 'too_small':
      return `Increase ${path} to satisfy the minimum constraint.`;
    case 'too_big':
      return `Reduce ${path} to satisfy the maximum constraint.`;
    case 'invalid_union':
      return `Use one of the supported representations for ${path}.`;
    case 'unrecognized_keys':
      return `Remove this property or add it explicitly with withAdditionalProperties() after validation.`;
    default:
      return `Correct ${path} according to the schema constraint.`;
  }
}

/** Converts Zod issues into stable details for terminals, CI, and editor tooling. */
export function normalizeZodIssues(
  error: ZodError,
  entityType?: string,
  data?: unknown
): SchemaValidationIssue[] {
  return error.issues.flatMap<SchemaValidationIssue>((issue): SchemaValidationIssue[] => {
    if (issue.code === 'unrecognized_keys') {
      return issue.keys.map((key) => {
        const issuePath = [...issue.path, key];
        const propertyPath = formatPath(issuePath);
        const path = entityType ? `${entityType}.${propertyPath}` : propertyPath;
        return {
          code: issue.code,
          path,
          message: `Unknown property "${key}"`,
          expected: 'a declared schema property',
          received: getValueAtPath(data, issuePath),
          suggestion: suggestionForIssue(issue, path),
        };
      });
    }

    const propertyPath = formatPath(issue.path);
    const path = entityType
      ? propertyPath === '(root)'
        ? entityType
        : `${entityType}.${propertyPath}`
      : propertyPath;
    const expected = (issue as ZodIssue & { expected?: unknown }).expected;

    return [
      {
        code: issue.code,
        path,
        message: issue.message,
        ...(expected === undefined ? {} : { expected }),
        received: getValueAtPath(data, issue.path),
        suggestion: suggestionForIssue(issue, path),
      },
    ];
  });
}

/**
 * Formats a Zod validation error into a readable and actionable message
 * suitable for CLI logs, terminal output, and CI runners without decorative emojis.
 *
 * @param error - The raw Zod error containing one or more issues.
 * @param entityType - Optional Schema.org entity name (e.g. 'Article').
 * @returns Formatted multi-line error string.
 *
 * @example
 * ```ts
 * const message = formatZodError(zodError, 'Article');
 * console.error(message);
 * ```
 */
export function formatZodError(error: ZodError, entityType?: string, data?: unknown): string {
  const target = entityType ? ` <${entityType}>` : '';
  const lines: string[] = [`[unschema-graph] Invalid${target} schema:`];

  for (const detail of normalizeZodIssues(error, entityType, data)) {
    lines.push(`  - Property "${detail.path}" [${detail.code}]: ${detail.message}`);
    if (detail.expected !== undefined) {
      lines.push(`      Expected: ${formatValue(detail.expected)}`);
    }
    lines.push(`      Received: ${formatValue(detail.received)}`);
    lines.push(`      Suggestion: ${detail.suggestion}`);
  }

  return lines.join('\n');
}

/**
 * Validates arbitrary data against a Zod schema using configurable severity behavior.
 *
 * @typeParam T - The validated output type inferred from the schema.
 * @param schema - The Zod schema against which input is validated.
 * @param data - The input data to validate.
 * @param options - Optional validation options specifying severity ('throw' | 'warn' | 'silent') and entity name.
 * @returns The parsed and typed data if valid; `null` if invalid and `onError` is `'warn'` or `'silent'`.
 * @throws {@link SchemaValidationError} When validation fails and `onError` is `'throw'` (the default).
 *
 * @example
 * ```ts
 * import { z } from 'zod';
 * import { validateSchema } from '@unschema-graph/core';
 *
 * const PostSchema = z.object({ title: z.string() });
 * const post = validateSchema(PostSchema, { title: 'Hello World' }, { entityType: 'Article' });
 * ```
 */
export function validateSchema<T>(
  schema: ZodType<T>,
  data: unknown,
  options?: ValidationOptions
): T | null {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  const severity: Severity = options?.onError ?? getGlobalConfig().onError ?? 'throw';
  const details = normalizeZodIssues(result.error, options?.entityType, data);
  const formattedMessage = formatZodError(result.error, options?.entityType, data);

  if (severity === 'throw') {
    throw new SchemaValidationError(
      formattedMessage,
      result.error.issues,
      options?.entityType,
      details
    );
  }

  if (severity === 'warn') {
    console.warn(formattedMessage);
    return null;
  }

  // 'silent'
  return null;
}

/**
 * Validates data against a Zod schema without throwing, returning a discriminated union.
 *
 * @typeParam T - The validated output type inferred from the schema.
 * @param schema - The Zod schema against which input is validated.
 * @param data - The input data to validate.
 * @param options - Validation options excluding `onError`.
 * @returns An object with `{ success: true, data }` or `{ success: false, error }`.
 *
 * @example
 * ```ts
 * const result = safeValidateSchema(MySchema, input);
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error.formattedMessage);
 * }
 * ```
 */
export function safeValidateSchema<T>(
  schema: ZodType<T>,
  data: unknown,
  options?: Omit<ValidationOptions, 'onError'>
): SchemaValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const details = normalizeZodIssues(result.error, options?.entityType, data);
  const formattedMessage = formatZodError(result.error, options?.entityType, data);
  const error = new SchemaValidationError(
    formattedMessage,
    result.error.issues,
    options?.entityType,
    details
  );

  return {
    success: false,
    error,
  };
}
