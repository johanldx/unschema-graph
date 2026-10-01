import type { ZodIssue } from 'zod';

/**
 * Severity level determining how validation errors should be handled.
 *
 * - `'throw'`: Halts execution and throws a {@link SchemaValidationError}. Recommended for production builds and CI.
 * - `'warn'`: Logs a structured warning to `console.warn` and returns `null` or skips invalid entity. Recommended for local development.
 * - `'silent'`: Suppresses output and returns `null` without throwing or logging.
 */
export type Severity = 'throw' | 'warn' | 'silent';

/**
 * Global configuration options for unschema-graph.
 */
export interface SchemaGraphOptions {
  /**
   * Default severity behavior when a schema fails validation.
   * @default 'throw'
   */
  onError?: Severity;

  /**
   * Base canonical URL used to resolve relative entity identifiers (`@id`).
   * @example 'https://example.com'
   */
  baseUrl?: string;

  /**
   * Default BCP-47 language tag used by framework adapters when no route locale is available.
   * @example 'fr-FR'
   */
  inLanguage?: string;
}

/**
 * Options passed to schema validation execution.
 */
export interface ValidationOptions {
  /**
   * The Schema.org entity name being validated (e.g., 'Article', 'Organization').
   */
  entityType?: string;

  /**
   * Severity behavior for this validation call.
   * Overrides global configuration if provided.
   * @default 'throw'
   */
  onError?: Severity;
}

/**
 * Base representation of a Schema.org entity object.
 */
export interface SchemaOrgEntity {
  /**
   * The Schema.org type name or array of type names (e.g., 'Article', 'PostalAddress').
   */
  '@type': string | string[];

  /**
   * Optional URI identifying the entity node within the graph.
   * Used for cross-referencing between nodes.
   */
  '@id'?: string;

  /**
   * Additional properties compliant with Schema.org specifications.
   */
  [key: string]: unknown;
}

/** Explicit JSON-LD reference to an entity identified elsewhere. */
export interface EntityIdReference {
  '@id': string;
}

/**
 * Accepted input for a relationship to a specific Schema.org entity type.
 *
 * Builders accept the entity itself, an ID shorthand, or an explicit `@id` object.
 * Relationship schemas normalize string shorthands before returning builder output.
 */
export type EntityReference<T> = T | string | EntityIdReference;

/**
 * Framework-neutral props accepted by Schema rendering adapters.
 */
export interface SchemaProps {
  /**
   * Entity or collection of entities to inject.
   * Supports single items, arrays, and nested structures.
   */
  data?: SchemaOrgEntity | (SchemaOrgEntity | null | undefined)[] | null;

  /** Alias for passing a single entity. */
  item?: SchemaOrgEntity | null;

  /** Alias for passing several entities. */
  items?: (SchemaOrgEntity | null | undefined)[] | null;

  /**
   * Whether to format JSON-LD with newlines and spaces for readability.
   * @default false
   */
  pretty?: boolean;

  /**
   * Space indentation width when `pretty` is true.
   * @default 2
   */
  indent?: number;

  /**
   * The Schema.org context URL.
   * @default 'https://schema.org'
   */
  context?: string;

  /**
   * Whether to bundle entities within an `@graph` array under a single root `@context`.
   * @default true
   */
  graph?: boolean;

  /**
   * Canonical base URL used to resolve relative `@id` references (e.g. '#org' -> 'https://example.com/#org').
   * Framework adapters may provide their own fallback when omitted.
   */
  baseUrl?: string;

  /**
   * Default BCP-47 language tag (e.g. 'fr', 'en-US') applied to language-aware entities
   * when `inLanguage` is omitted.
   */
  inLanguage?: string;
}

/** Stable machine-readable validation error code. */
export type SchemaValidationErrorCode = 'SCHEMA_VALIDATION_ERROR';

/**
 * Generic machine-readable diagnostic contract across validation, graph collection, and CLI audit.
 */
export interface SchemaDiagnostic {
  /** Stable diagnostic error or warning code. */
  code: string;
  /** Severity level. */
  severity: 'error' | 'warning' | 'info';
  /** Path to property or reference within the graph. */
  path?: string;
  /** Entity type name if applicable. */
  entityType?: string;
  /** Resolved or relative entity identifier. */
  entityId?: string;
  /** Human-readable explanation of the issue. */
  message: string;
  /** Actionable recommendation to fix the diagnostic. */
  suggestion?: string;
}

/** Actionable representation of one invalid Schema.org property. */
export interface SchemaValidationIssue {
  /** Stable Zod issue code. */
  code: string;
  /** Fully qualified property path, including the entity type when available. */
  path: string;
  /** Human-readable validation message. */
  message: string;
  /** Expected value or constraint when Zod provides it. */
  expected?: unknown;
  /** Actual value found at the property path. */
  received?: unknown;
  /** Short corrective action suitable for terminals and editor integrations. */
  suggestion: string;
}

/**
 * Result returned by safe schema validation.
 */
export type SchemaValidationResult<T> =
  | {
      /** Whether validation passed successfully. */
      success: true;
      /** The parsed and typed data. */
      data: T;
      error?: never;
    }
  | {
      /** Whether validation passed successfully. */
      success: false;
      /** The validation error instance. */
      error: SchemaValidationError;
      data?: never;
    };

/**
 * Custom error thrown when data fails Schema.org validation requirements.
 */
export class SchemaValidationError extends Error {
  /** Stable code for programmatic error handling. */
  readonly code: SchemaValidationErrorCode = 'SCHEMA_VALIDATION_ERROR';

  /**
   * The Schema.org entity type that failed validation (if known).
   */
  readonly entityType?: string;

  /**
   * The raw Zod issues detailing each schema violation.
   */
  readonly issues: ZodIssue[];

  /**
   * The human-readable formatted error message.
   */
  readonly formattedMessage: string;

  /** Normalized, actionable validation details. */
  readonly details: SchemaValidationIssue[];

  constructor(
    message: string,
    issues: ZodIssue[] = [],
    entityType?: string,
    details: SchemaValidationIssue[] = []
  ) {
    super(message);
    this.name = 'SchemaValidationError';
    this.entityType = entityType;
    this.issues = issues;
    this.formattedMessage = message;
    this.details = details;

    // Maintain clean stack trace across environments (V8/Node)
    const err = Error as unknown as {
      captureStackTrace?: (targetObject: object, constructorOpt?: object) => void;
    };
    if (typeof err.captureStackTrace === 'function') {
      err.captureStackTrace(this, SchemaValidationError);
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
