import type { SchemaDiagnostic } from '../types/index.js';

/** Strategy applied when several graph nodes share the same resolved `@id`. */
export type DuplicateStrategy = 'merge' | 'error' | 'first' | 'last';

/** Machine-readable diagnostic emitted while composing a graph. */
export type GraphDiagnostic = SchemaDiagnostic &
  (
    | {
        code: 'duplicate-conflict';
        severity: 'warning';
        id: string;
        path: string;
        existingValue: unknown;
        incomingValue: unknown;
        suggestion: string;
      }
    | {
        code: 'broken-reference';
        severity: 'warning';
        id: string;
        path: string;
        suggestion: string;
      }
  );

/**
 * Configuration options for graph composition.
 */
export interface GraphOptions {
  /**
   * Whether to bundle entities within an `@graph` array under a root `@context`.
   * When set to false and exactly one entity is present, the entity is emitted directly at the root.
   * @default true
   */
  graph?: boolean;

  /**
   * The Schema.org `@context` URI.
   * @default 'https://schema.org'
   */
  context?: string;

  /**
   * Optional base canonical URL used to resolve relative `@id` URIs (e.g. '#org' -> 'https://example.com/#org').
   * @example 'https://example.com'
   */
  baseUrl?: string;

  /**
   * Strategy applied to duplicate resolved `@id` values.
   * `merge` combines properties with the last value winning and reports conflicts.
   * @default 'merge'
   */
  duplicateStrategy?: DuplicateStrategy;

  /** Receives merge conflicts and unresolved local-reference diagnostics. */
  onDiagnostic?: (diagnostic: GraphDiagnostic) => void;
}

/** Error thrown when `duplicateStrategy` is `error` and a duplicate node is found. */
export class DuplicateEntityError extends Error {
  readonly id: string;

  constructor(id: string) {
    super(`Duplicate entity ID: ${id}`);
    this.name = 'DuplicateEntityError';
    this.id = id;
  }
}

/**
 * Resolves a relative `@id` URI into an absolute URI using the provided base URL.
 *
 * @param id - The `@id` string to resolve (e.g. '#org', '/about#webpage', or an absolute URI).
 * @param baseUrl - Canonical base URL (e.g. 'https://example.com').
 * @returns The resolved absolute URI, or original string if already absolute.
 *
 * @example
 * ```ts
 * resolveId('#organization', 'https://mon-site.fr')
 * // 'https://mon-site.fr/#organization'
 * ```
 */
export function resolveId(id: string, baseUrl?: string): string {
  if (!baseUrl || !id || typeof id !== 'string') {
    return id;
  }

  const trimmed = id.trim();

  // If already absolute under any URI scheme, return as-is.
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return trimmed;
  }

  try {
    const base = baseUrl.trim();
    const baseWithScheme = /^https?:\/\//i.test(base) ? base : `https://${base}`;
    // For standalone fragment (#organization), normalize base URL to guarantee consistent trailing slash
    // so baseUrl "https://example.com/docs" and "https://example.com/docs/" yield the same canonical ID.
    const resolvedUrl = trimmed.startsWith('#')
      ? new URL(trimmed, baseWithScheme.endsWith('/') ? baseWithScheme : `${baseWithScheme}/`)
      : new URL(trimmed, baseWithScheme);

    return resolvedUrl.href;
  } catch {
    const cleanBase = baseUrl.trim().replace(/\/+$/, '');
    if (trimmed.startsWith('#')) {
      return `${cleanBase}/${trimmed}`;
    }
    if (trimmed.startsWith('/')) {
      return `${cleanBase}${trimmed}`;
    }
    return `${cleanBase}/${trimmed}`;
  }
}

/**
 * Recursively resolves all `@id` properties within an entity or array using the base URL.
 *
 * @param obj - Entity object, array of entities, or arbitrary structure.
 * @param baseUrl - Canonical base URL.
 * @returns Deeply resolved object copy.
 */
export function resolveEntityIds<T>(obj: T, baseUrl?: string): T {
  const copies = new WeakMap<object, unknown>();

  const copyValue = (value: unknown): unknown => {
    if (!value || typeof value !== 'object') {
      return value;
    }

    const existing = copies.get(value);
    if (existing !== undefined) {
      return existing;
    }

    if (Array.isArray(value)) {
      const copy: unknown[] = [];
      copies.set(value, copy);
      for (const entry of value) {
        copy.push(copyValue(entry));
      }
      return copy;
    }

    const copy: Record<string, unknown> = {};
    copies.set(value, copy);
    for (const [key, child] of Object.entries(value)) {
      copy[key] =
        key === '@id' && typeof child === 'string' && baseUrl
          ? resolveId(child, baseUrl)
          : copyValue(child);
    }
    return copy;
  };

  return copyValue(obj) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasEntityId(value: Record<string, unknown>): value is Record<string, unknown> & {
  '@id': string;
} {
  return typeof value['@id'] === 'string' && value['@id'].trim().length > 0;
}

function hasEntityData(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => key !== '@id' && key !== '@context');
}

function valuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => valuesEqual(value, right[index]))
    );
  }

  if (!isRecord(left) || !isRecord(right)) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every((key) => Object.hasOwn(right, key) && valuesEqual(left[key], right[key]))
  );
}

function deduplicateCollection(items: unknown[]): unknown[] {
  const result: unknown[] = [];
  const seenIds = new Set<string>();
  const seenScalars = new Set<unknown>();

  for (const item of items) {
    if (item === null || item === undefined) {
      continue;
    }
    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
      if (!seenScalars.has(item)) {
        seenScalars.add(item);
        result.push(item);
      }
      continue;
    }
    if (isRecord(item) && hasEntityId(item)) {
      const id = item['@id'];
      if (!seenIds.has(id)) {
        seenIds.add(id);
        result.push(item);
      }
      continue;
    }
    if (!result.some((existing) => valuesEqual(existing, item))) {
      result.push(item);
    }
  }

  return result;
}

function mergeEntities(
  existing: Record<string, unknown>,
  incoming: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...existing };

  for (const [key, incomingValue] of Object.entries(incoming)) {
    if (!Object.hasOwn(merged, key) || merged[key] === undefined) {
      merged[key] = incomingValue;
      continue;
    }

    const existingValue = merged[key];

    if (Array.isArray(existingValue) && Array.isArray(incomingValue)) {
      merged[key] = deduplicateCollection([...existingValue, ...incomingValue]);
    } else if (Array.isArray(existingValue)) {
      merged[key] = deduplicateCollection([...existingValue, incomingValue]);
    } else if (Array.isArray(incomingValue)) {
      merged[key] = deduplicateCollection([existingValue, ...incomingValue]);
    } else if (isRecord(existingValue) && isRecord(incomingValue)) {
      if (
        hasEntityId(existingValue) &&
        hasEntityId(incomingValue) &&
        existingValue['@id'] === incomingValue['@id']
      ) {
        merged[key] = mergeEntities(existingValue, incomingValue);
      } else {
        merged[key] = incomingValue;
      }
    } else {
      merged[key] = incomingValue;
    }
  }

  return merged;
}

function isIdOnlyReference(value: Record<string, unknown>): value is { '@id': string } {
  return hasEntityId(value) && Object.keys(value).every((key) => key === '@id');
}

function isLocalReference(id: string, baseUrl?: string): boolean {
  if (
    id.startsWith('#') ||
    id.startsWith('/') ||
    id.startsWith('./') ||
    id.startsWith('../') ||
    !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(id)
  ) {
    return true;
  }

  if (!baseUrl || !/^https?:/i.test(id)) {
    return false;
  }

  try {
    const normalizedBase = /^https?:\/\//i.test(baseUrl) ? baseUrl : `https://${baseUrl}`;
    return new URL(id).origin === new URL(normalizedBase).origin;
  } catch {
    return false;
  }
}

function entityTypeLabel(entity: Record<string, unknown>): string {
  const type = entity['@type'];
  if (typeof type === 'string') {
    return type;
  }
  if (Array.isArray(type) && typeof type[0] === 'string') {
    return type[0];
  }
  return 'Entity';
}

function isGraphDocument(value: unknown): value is Record<string, unknown> & {
  '@graph': unknown[];
} {
  return isRecord(value) && Array.isArray(value['@graph']);
}

function flattenGraphInput(value: unknown, target: unknown[]): void {
  if (Array.isArray(value)) {
    for (const entry of value) {
      flattenGraphInput(entry, target);
    }
    return;
  }

  if (isGraphDocument(value)) {
    flattenGraphInput(value['@graph'], target);
    return;
  }

  target.push(value);
}

/**
 * Normalizes, deduplicates, and structures Schema.org entities into a unified JSON-LD graph.
 *
 * Capabilities:
 * - Flattens nested or multiple arrays of entities.
 * - Filters out null, undefined, or empty objects (e.g. from failed schema validations).
 * - Strips redundant inner `@context` properties so only the root `@context` is declared.
 * - Resolves relative `@id` references when `baseUrl` is specified.
 * - Promotes nested entities with `@id` to graph nodes and leaves entities without `@id` inline.
 * - Applies an explicit strategy to entities sharing the same `@id`.
 * - Reports conflicting duplicate values and unresolved local references through structured diagnostics.
 *
 * @param items - Single entity, array of entities, or nested entity structures.
 * @param options - Graph wrapping, baseUrl, and context options.
 * @returns A JSON-LD graph object, or null if no valid entities were provided.
 *
 * @example
 * ```ts
 * const graph = buildJsonLdGraph([article, organization], { baseUrl: 'https://example.com' });
 * ```
 */
export function buildJsonLdGraph(
  items: unknown,
  options: GraphOptions = {}
): Record<string, unknown> | null {
  const { graph = true, baseUrl, duplicateStrategy = 'merge', onDiagnostic } = options;
  const inputContext =
    isGraphDocument(items) && typeof items['@context'] === 'string' ? items['@context'] : undefined;
  const context = options.context ?? inputContext ?? 'https://schema.org';

  if (items === null || items === undefined) {
    return null;
  }

  const rawList: unknown[] = [];
  flattenGraphInput(items, rawList);
  const validEntities: Record<string, unknown>[] = [];
  const idIndexMap = new Map<string, number>();
  const activeObjects = new WeakSet<object>();

  const registerNode = (entity: Record<string, unknown>): void => {
    const id = entity['@id'];
    if (typeof id === 'string' && id.trim().length > 0) {
      const existingIndex = idIndexMap.get(id);

      if (existingIndex !== undefined) {
        const existing = validEntities[existingIndex];

        if (duplicateStrategy === 'error') {
          throw new DuplicateEntityError(id);
        }

        for (const [key, incomingValue] of Object.entries(entity)) {
          if (
            key !== '@id' &&
            Object.hasOwn(existing, key) &&
            !valuesEqual(existing[key], incomingValue)
          ) {
            onDiagnostic?.({
              code: 'duplicate-conflict',
              severity: 'warning',
              message: `Conflicting values for ${id}.${key}`,
              id,
              entityId: id,
              path: `${id}.${key}`,
              existingValue: existing[key],
              incomingValue,
              suggestion:
                'Align conflicting properties or use duplicateStrategy: "last" or "first"',
            });
          }
        }

        if (duplicateStrategy === 'last') {
          validEntities[existingIndex] = entity;
        } else if (duplicateStrategy === 'merge') {
          validEntities[existingIndex] = mergeEntities(existing, entity);
        }
        return;
      }

      idIndexMap.set(id, validEntities.length);
    }

    validEntities.push(entity);
  };

  const normalizeValue = (value: unknown, key?: string): unknown => {
    if (typeof value === 'string' && baseUrl && key === '@id') {
      return resolveId(value, baseUrl);
    }

    if (Array.isArray(value)) {
      return value.map((entry) => normalizeValue(entry));
    }

    if (!isRecord(value)) {
      return value;
    }

    if (activeObjects.has(value)) {
      if (hasEntityId(value)) {
        return { '@id': baseUrl ? resolveId(value['@id'], baseUrl) : value['@id'] };
      }
      return null;
    }

    activeObjects.add(value);
    const normalized: Record<string, unknown> = {};

    for (const [childKey, childValue] of Object.entries(value)) {
      if (childKey === '@context') {
        continue;
      }
      normalized[childKey] = normalizeValue(childValue, childKey);
    }

    activeObjects.delete(value);

    if (hasEntityId(normalized) && hasEntityData(normalized)) {
      registerNode(normalized);
      return { '@id': normalized['@id'] };
    }

    return normalized;
  };

  for (const item of rawList) {
    if (!isRecord(item)) {
      continue;
    }

    activeObjects.add(item);
    const entity: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      if (key === '@context') {
        continue;
      }
      entity[key] = normalizeValue(value, key);
    }
    activeObjects.delete(item);

    // Only process objects with at least one property
    if (Object.keys(entity).length === 0) {
      continue;
    }

    registerNode(entity);
  }

  const registeredIds = new Set(idIndexMap.keys());
  const inspectReferences = (value: unknown, path: string, visited: WeakSet<object>): void => {
    if (Array.isArray(value)) {
      for (const [index, entry] of value.entries()) {
        inspectReferences(entry, `${path}[${index}]`, visited);
      }
      return;
    }

    if (!isRecord(value) || visited.has(value)) {
      return;
    }

    if (isIdOnlyReference(value)) {
      const id = value['@id'];
      if (isLocalReference(id, baseUrl) && !registeredIds.has(id)) {
        onDiagnostic?.({
          code: 'broken-reference',
          severity: 'warning',
          message: `Broken reference: ${id}\nReferenced from: ${path}`,
          id,
          entityId: id,
          path,
          suggestion: `Ensure an entity with @id "${id}" exists in the graph, or pass an external absolute URI`,
        });
      }
      return;
    }

    visited.add(value);
    for (const [key, child] of Object.entries(value)) {
      if (key !== '@id') {
        inspectReferences(child, `${path}.${key}`, visited);
      }
    }
  };

  for (const entity of validEntities) {
    const label = entityTypeLabel(entity);
    const visited = new WeakSet<object>();
    for (const [key, value] of Object.entries(entity)) {
      if (key !== '@id') {
        inspectReferences(value, `${label}.${key}`, visited);
      }
    }
  }

  if (validEntities.length === 0) {
    return null;
  }

  if (!graph && validEntities.length === 1) {
    return {
      '@context': context,
      ...validEntities[0],
    };
  }

  return {
    '@context': context,
    '@graph': validEntities,
  };
}
