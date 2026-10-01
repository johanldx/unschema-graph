import {
  defineSchema,
  FAQPage,
  LocalBusinessSchema,
  SchemaTypeSchema,
  SchemaValidationError,
  withAdditionalProperties,
  withAdditionalTypes,
} from '@unschema-graph/core';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

describe('core/defineSchema', () => {
  const SoftwareApplication = defineSchema(
    'SoftwareApplication',
    z.object({
      name: z.string(),
      operatingSystem: z.string(),
      applicationCategory: z.string().optional(),
    })
  );

  it('exposes entityType and schema properties', () => {
    expect(SoftwareApplication.entityType).toBe('SoftwareApplication');
    expect(SoftwareApplication.schema).toBeDefined();
  });

  it('injects @type automatically into output', () => {
    const app = SoftwareApplication({
      name: 'Astro Studio',
      operatingSystem: 'Linux, macOS',
    });

    expect(app).toEqual({
      '@type': 'SoftwareApplication',
      name: 'Astro Studio',
      operatingSystem: 'Linux, macOS',
    });
  });

  it('preserves @id and supports explicit additional properties after validation', () => {
    const app = withAdditionalProperties(
      SoftwareApplication({
        '@id': 'https://example.com/#app',
        name: 'Astro Studio',
        operatingSystem: 'Linux',
      }),
      { version: '2.0.0' }
    );

    expect(app).toEqual({
      '@type': 'SoftwareApplication',
      '@id': 'https://example.com/#app',
      name: 'Astro Studio',
      operatingSystem: 'Linux',
      version: '2.0.0',
    });
  });

  it('protects builder-owned metadata in the additional-properties escape hatch', () => {
    const app = SoftwareApplication({
      name: 'Astro Studio',
      operatingSystem: 'Linux',
    });

    expect(() => withAdditionalProperties(app, { '@type': 'Product' } as never)).toThrowError(
      'withAdditionalProperties() cannot replace @type or @id'
    );
    expect(() => withAdditionalProperties(app, { '@id': '#replacement' } as never)).toThrowError(
      'withAdditionalProperties() cannot replace @type or @id'
    );
  });

  it('rejects unknown properties and incompatible @type values', () => {
    expect(() =>
      SoftwareApplication({
        name: 'Astro Studio',
        operatingSystem: 'Linux',
        // @ts-expect-error Unknown properties are rejected by TypeScript and at runtime
        opertaingSystem: 'typo',
      })
    ).toThrowError(SchemaValidationError);

    const result = SoftwareApplication.safeParse({
      name: 'Astro Studio',
      operatingSystem: 'Linux',
      opertaingSystem: 'typo',
    });
    expect(result.success).toBe(false);
    expect(result.error?.details[0]).toMatchObject({
      code: 'unrecognized_keys',
      path: 'SoftwareApplication.opertaingSystem',
      received: 'typo',
    });

    expect(() =>
      SoftwareApplication({
        // @ts-expect-error The builder type must be preserved
        '@type': 'Product',
        name: 'Astro Studio',
        operatingSystem: 'Linux',
      })
    ).toThrowError(SchemaValidationError);
  });

  it('normalizes multiple types with the primary type first and no duplicates', () => {
    const app = withAdditionalTypes(
      SoftwareApplication({
        name: 'Mobile Studio',
        operatingSystem: 'iOS, Android',
      }),
      ['MobileApplication', 'SoftwareApplication', 'MobileApplication']
    );

    const expanded = withAdditionalTypes(app, ['DesktopApplication', 'MobileApplication']);

    expect(app).toEqual({
      '@type': ['SoftwareApplication', 'MobileApplication'],
      name: 'Mobile Studio',
      operatingSystem: 'iOS, Android',
    });
    expect(expanded['@type']).toEqual([
      'SoftwareApplication',
      'MobileApplication',
      'DesktopApplication',
    ]);
    expect(SchemaTypeSchema.parse(['Thing', 'Thing', 'Product'])).toEqual(['Thing', 'Product']);
    expect(SchemaTypeSchema.safeParse([]).success).toBe(false);
    expect(() => withAdditionalTypes(app, [''])).toThrow();
  });

  it('rejects unknown properties in exported and nested built-in schemas', () => {
    expect(
      LocalBusinessSchema.safeParse({
        name: 'Acme Paris',
        address: '1 rue de Rivoli',
        unexpected: true,
      }).success
    ).toBe(false);

    expect(() =>
      FAQPage({
        questions: [
          {
            question: 'What is JSON-LD?',
            answer: 'Linked data expressed as JSON.',
            // @ts-expect-error Nested shorthand objects are strict.
            unexpected: true,
          },
        ],
      })
    ).toThrowError(SchemaValidationError);
  });

  it('throws SchemaValidationError on missing required fields by default', () => {
    expect(() =>
      // @ts-expect-error Testing runtime validation
      SoftwareApplication({ name: 'Incomplete' })
    ).toThrowError(SchemaValidationError);

    try {
      // @ts-expect-error Testing runtime validation
      SoftwareApplication({ name: 'Incomplete' });
    } catch (err) {
      expect(err).toBeInstanceOf(SchemaValidationError);
      const schemaErr = err as SchemaValidationError;
      expect(schemaErr.entityType).toBe('SoftwareApplication');
      expect(schemaErr.message).toContain('Invalid <SoftwareApplication> schema:');
      expect(schemaErr.message).toContain('Property "SoftwareApplication.operatingSystem"');
      expect(schemaErr.code).toBe('SCHEMA_VALIDATION_ERROR');
      expect(schemaErr.details[0]?.suggestion).toBeTruthy();
    }
  });

  it('supports onError: "warn" returning null', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // @ts-expect-error Testing runtime validation
    const result = SoftwareApplication({ name: 'Incomplete' }, { onError: 'warn' });

    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('Invalid <SoftwareApplication> schema:');
    warnSpy.mockRestore();
  });

  it('safeParse returns typed result without throwing', () => {
    const valid = SoftwareApplication.safeParse({
      name: 'Safe App',
      operatingSystem: 'Windows',
    });
    expect(valid.success).toBe(true);
    expect(valid.data).toEqual({
      '@type': 'SoftwareApplication',
      name: 'Safe App',
      operatingSystem: 'Windows',
    });

    const invalid = SoftwareApplication.safeParse({
      name: 'Bad App',
    });
    expect(invalid.success).toBe(false);
    expect(invalid.error).toBeInstanceOf(SchemaValidationError);
    expect(invalid.error?.entityType).toBe('SoftwareApplication');
  });

  it('strictly protects reserved JSON-LD keywords against user overrides', () => {
    const validApp = SoftwareApplication({
      name: 'Safe App',
      operatingSystem: 'Linux',
    });

    // Builder level rejection
    expect(() =>
      SoftwareApplication({
        name: 'App',
        operatingSystem: 'Linux',
        // @ts-expect-error Testing reserved @context
        '@context': 'https://schema.org',
      })
    ).toThrowError(SchemaValidationError);

    expect(() =>
      SoftwareApplication({
        name: 'App',
        operatingSystem: 'Linux',
        // @ts-expect-error Testing reserved @graph
        '@graph': [],
      })
    ).toThrowError(SchemaValidationError);

    // withAdditionalProperties rejection
    expect(() =>
      withAdditionalProperties(validApp, {
        // @ts-expect-error Reserved keyword
        '@context': 'https://schema.org',
      })
    ).toThrowError(TypeError);

    expect(() =>
      withAdditionalProperties(validApp, {
        // @ts-expect-error Reserved keyword
        '@graph': [],
      })
    ).toThrowError(TypeError);

    expect(() =>
      withAdditionalProperties(validApp, {
        // @ts-expect-error Reserved keyword
        '@id': '#override',
      })
    ).toThrowError(TypeError);

    expect(() =>
      withAdditionalProperties(validApp, {
        // @ts-expect-error Reserved keyword
        '@type': 'Other',
      })
    ).toThrowError(TypeError);
  });
});
