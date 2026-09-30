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

  // If already absolute protocol or URI scheme, return as-is
  if (/^(https?:|urn:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  try {
    const base = baseUrl.trim();
    const baseWithScheme = /^https?:\/\//i.test(base) ? base : `https://${base}`;
    return new URL(trimmed, baseWithScheme).href;
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
  if (!baseUrl || !obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveEntityIds(item, baseUrl)) as unknown as T;
  }

  const copy: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    if ((key === '@id' || key === 'item' || key === 'url') && typeof val === 'string') {
      copy[key] = resolveId(val, baseUrl);
    } else if (val && typeof val === 'object') {
      copy[key] = resolveEntityIds(val, baseUrl);
    } else {
      copy[key] = val;
    }
  }

  return copy as T;
}

/**
 * Normalizes, deduplicates, and structures Schema.org entities into a unified JSON-LD graph.
 *
 * Capabilities:
 * - Flattens nested or multiple arrays of entities.
 * - Filters out null, undefined, or empty objects (e.g. from failed schema validations).
 * - Strips redundant inner `@context` properties so only the root `@context` is declared.
 * - Resolves relative `@id` references when `baseUrl` is specified.
 * - Deduplicates and merges entities that share the same `@id`.
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
  const { graph = true, context = 'https://schema.org', baseUrl } = options;

  if (items === null || items === undefined) {
    return null;
  }

  const rawList = Array.isArray(items) ? items.flat(Infinity) : [items];
  const validEntities: Record<string, unknown>[] = [];
  const idIndexMap = new Map<string, number>();

  for (const item of rawList) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      continue;
    }

    // Resolve relative @ids if baseUrl is configured
    const processedItem = baseUrl ? resolveEntityIds(item, baseUrl) : item;
    const entity = { ...(processedItem as Record<string, unknown>) };

    // Strip redundant inner @context
    delete entity['@context'];

    // Only process objects with at least one property
    if (Object.keys(entity).length === 0) {
      continue;
    }

    const id = entity['@id'];
    if (typeof id === 'string' && id.trim().length > 0) {
      const existingIndex = idIndexMap.get(id);

      if (existingIndex !== undefined) {
        // Merge into the already registered entity
        validEntities[existingIndex] = {
          ...validEntities[existingIndex],
          ...entity,
        };
        continue;
      }

      idIndexMap.set(id, validEntities.length);
    }

    validEntities.push(entity);
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
