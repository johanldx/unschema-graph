import {
  DataDownload,
  ProfilePage,
  RelativeOrAbsoluteUrlSchema,
  WebUrlSchema,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('URL schemas', () => {
  it('distinguishes absolute web resources from relative or generic URI values', () => {
    expect(WebUrlSchema.safeParse('https://example.com/file.csv').success).toBe(true);
    expect(WebUrlSchema.safeParse('/file.csv').success).toBe(false);

    for (const value of [
      '#fragment',
      '/about',
      './about',
      '../about',
      'https://example.com/about',
      'urn:example:foo',
      'mailto:hello@example.com',
      'tel:+33123456789',
    ]) {
      expect(RelativeOrAbsoluteUrlSchema.safeParse(value).success).toBe(true);
    }
    expect(RelativeOrAbsoluteUrlSchema.safeParse('plain text').success).toBe(false);
  });

  it('uses the dedicated URL contract in public builders', () => {
    expect(() => DataDownload({ contentUrl: '/relative.csv' })).toThrow();
    expect(DataDownload({ contentUrl: 'https://example.com/data.csv' }).contentUrl).toBe(
      'https://example.com/data.csv'
    );

    expect(() =>
      ProfilePage({
        mainEntity: { '@type': 'Person', name: 'Ada' },
        url: 'not a URL',
      })
    ).toThrow();
  });
});
