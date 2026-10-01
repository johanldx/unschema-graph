/**
 * Options for serializing JSON-LD data.
 */
export interface SerializeOptions {
  /**
   * Whether to format output with newlines and indentation for readability.
   * If true, defaults to 2 spaces indentation unless `indent` is specified.
   * @default false
   */
  pretty?: boolean;

  /**
   * Number of space characters used for indentation when `pretty` is enabled.
   * @default 2
   */
  indent?: number;
}

/**
 * Character mapping table used to sanitize JSON-LD against XSS vectors.
 * Replaces characters that could terminate <script> tags or trigger comment execution.
 */
const ESCAPE_LOOKUP: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

const ESCAPE_REGEX = /[<>&\u2028\u2029]/gu;

/**
 * Escapes sensitive HTML characters within an already-serialized JSON string.
 *
 * Prevents Cross-Site Scripting (XSS) when injecting JSON into `<script>` tags,
 * specifically neutralizing `</script>`, `<script>`, `<!--`, and `-->` sequences,
 * as well as Unicode line/paragraph separators (`\u2028` and `\u2029`).
 *
 * @param jsonString - Raw JSON string to escape.
 * @returns Sanitized JSON string safe for inclusion in HTML `<script>` tags.
 *
 * @example
 * ```ts
 * const raw = JSON.stringify({ bio: '</script><script>alert(1)</script>' });
 * const safe = escapeJsonLd(raw);
 * // safe contains \u003c/script\u003e\u003cscript\u003e...
 * ```
 */
export function escapeJsonLd(jsonString: string): string {
  return jsonString.replace(ESCAPE_REGEX, (char) => ESCAPE_LOOKUP[char] ?? char);
}

/**
 * Safely serializes arbitrary Schema.org data into an XSS-safe JSON-LD string.
 *
 * This function is the recommended and primary way to inject Schema.org JSON-LD structured
 * data into an HTML `<script type="application/ld+json">` tag.
 *
 * Performs standard JSON serialization followed by Unicode escaping of `<`, `>`, `&`,
 * and Unicode line and paragraph separators (`\u2028`, `\u2029`) to prevent `<script>`
 * injection, comment breakout (`<!--`, `-->`), and parsing anomalies.
 * Pretty formatting options (`pretty`, `indent`) strictly preserve all escaping guarantees.
 *
 * @param data - The data structure, Schema.org entity, or graph array to serialize.
 * @param options - Optional formatting configuration (pretty-print, indentation).
 * @returns An XSS-safe JSON-LD string.
 * @throws {TypeError} If the data contains circular references or cannot be serialized.
 *
 * @example
 * ```ts
 * import { serializeJsonLd } from '@unschema-graph/core';
 *
 * const jsonLd = serializeJsonLd(
 *   {
 *     '@context': 'https://schema.org',
 *     '@type': 'Article',
 *     headline: 'Safe & Clean SEO <Guide>',
 *   },
 *   { pretty: true }
 * );
 * ```
 */
export function serializeJsonLd(data: unknown, options: SerializeOptions = {}): string {
  if (typeof data === 'bigint') {
    throw new TypeError(
      '[unschema-graph] Cannot serialize BigInt. Convert it to a string or number.'
    );
  }
  if (typeof data === 'symbol') {
    throw new TypeError('[unschema-graph] Cannot serialize Symbol.');
  }
  if (typeof data === 'function') {
    throw new TypeError('[unschema-graph] Cannot serialize Function.');
  }
  if (typeof data === 'number' && (Number.isNaN(data) || !Number.isFinite(data))) {
    throw new TypeError(`[unschema-graph] Cannot serialize invalid number (${String(data)}).`);
  }

  const { pretty = false, indent = 2 } = options;
  const space = pretty ? Math.max(0, indent) : undefined;

  const replacer = (key: string, value: unknown): unknown => {
    if (typeof value === 'bigint') {
      throw new TypeError(
        `[unschema-graph] Cannot serialize BigInt at property "${key || 'root'}". Convert it to a string or number.`
      );
    }
    if (typeof value === 'symbol') {
      throw new TypeError(
        `[unschema-graph] Cannot serialize Symbol at property "${key || 'root'}".`
      );
    }
    if (typeof value === 'function') {
      throw new TypeError(
        `[unschema-graph] Cannot serialize Function at property "${key || 'root'}".`
      );
    }
    if (typeof value === 'number' && (Number.isNaN(value) || !Number.isFinite(value))) {
      throw new TypeError(
        `[unschema-graph] Cannot serialize invalid number (${String(value)}) at property "${key || 'root'}".`
      );
    }
    return value;
  };

  const serialized = JSON.stringify(data, replacer, space);

  if (serialized === undefined) {
    return '{}';
  }

  return escapeJsonLd(serialized);
}
