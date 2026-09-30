import { z } from 'zod';

export interface SearchActionOptions {
  target: string;
  queryInputName?: string;
}

/**
 * Creates a Google Sitelinks Searchbox compliant `SearchAction` entity.
 *
 * @param options - URL template string (e.g. '/search?q={search_term_string}') or configuration object.
 * @returns Schema.org SearchAction entity.
 *
 * @example
 * ```ts
 * createSearchAction('/search?q={search_term_string}')
 * ```
 */
export function createSearchAction(options: string | SearchActionOptions): Record<string, unknown> {
  const targetStr = typeof options === 'string' ? options : options.target;
  const inputName =
    typeof options === 'object' && options.queryInputName
      ? options.queryInputName
      : targetStr.match(/\{([a-zA-Z0-9_]+)\}/)?.[1] || 'search_term_string';

  return {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: targetStr,
    },
    'query-input': `required name=${inputName}`,
  };
}

/**
 * Zod schema for SearchAction.
 */
export const SearchActionSchema = z.union([
  z.string().transform((url) => createSearchAction(url)),
  z
    .object({
      '@type': z.string().default('SearchAction').optional(),
      target: z.union([
        z.string(),
        z
          .object({
            '@type': z.string().default('EntryPoint').optional(),
            urlTemplate: z.string().min(1),
          })
          .strict(),
      ]),
      'query-input': z.string().optional(),
    })
    .strict(),
]);
