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

const ESCAPE_REGEX = /[<>&]/g;

/**
 * Escapes sensitive HTML characters within an already-serialized JSON string.
 *
 * Prevents Cross-Site Scripting (XSS) when injecting JSON into `<script>` tags,
 * specifically neutralizing `</script>`, `<script>`, and `<!--` sequences.
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
 * Performs standard JSON serialization followed by Unicode escaping of `<`, `>`, and `&`.
 * The resulting string can be safely placed directly inside a `<script type="application/ld+json">` tag.
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
  const { pretty = false, indent = 2 } = options;
  const space = pretty ? Math.max(0, indent) : undefined;

  const serialized = JSON.stringify(data, null, space);

  if (serialized === undefined) {
    return '{}';
  }

  return escapeJsonLd(serialized);
}
