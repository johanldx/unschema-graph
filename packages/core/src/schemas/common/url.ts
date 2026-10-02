import { z } from 'zod';

const HTTP_URL_SCHEME = /^https?:\/\//i;
const URI_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

/** Absolute HTTP(S) URL used for public web resources. */
export const WebUrlSchema = z
  .string()
  .min(1, 'URL cannot be empty')
  .refine(
    (value) => HTTP_URL_SCHEME.test(value) && URL.canParse(value),
    'URL must be an absolute HTTP(S) URL'
  );

/** Absolute URI or relative URL/path that can be resolved against a canonical base URL. */
export const RelativeOrAbsoluteUrlSchema = z
  .string()
  .min(1, 'URL cannot be empty')
  .refine(
    (value) =>
      URI_SCHEME.test(value) ||
      value.startsWith('/') ||
      value.startsWith('./') ||
      value.startsWith('../') ||
      value.startsWith('#'),
    'URL must be an absolute URI or a relative URL'
  );
