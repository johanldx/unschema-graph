import {
  defineSchema,
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

  it('allows overriding @type with an array (multi-typing)', () => {
    const app = withAdditionalTypes(
      SoftwareApplication({
        name: 'Mobile Studio',
        operatingSystem: 'iOS, Android',
      }),
      ['MobileApplication']
    );

    expect(app).toEqual({
      '@type': ['SoftwareApplication', 'MobileApplication'],
      name: 'Mobile Studio',
      operatingSystem: 'iOS, Android',
    });
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
});
