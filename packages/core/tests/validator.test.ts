import {
  formatZodError,
  Product,
  SchemaValidationError,
  safeValidateSchema,
  validateSchema,
  WebSite,
} from '@unschema-graph/core';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

describe('core/validator', () => {
  const UserSchema = z.object({
    name: z.string(),
    age: z.number().int().positive(),
    tags: z.array(z.string()).optional(),
    author: z
      .object({
        profile: z.object({
          email: z.string().email(),
        }),
      })
      .optional(),
  });

  describe('validateSchema', () => {
    it('returns parsed data when valid', () => {
      const data = { name: 'Alice', age: 30 };
      const result = validateSchema(UserSchema, data);
      expect(result).toEqual(data);
    });

    it('throws SchemaValidationError by default on invalid data', () => {
      const invalidData = { name: 'Alice', age: -5 };

      expect(() => validateSchema(UserSchema, invalidData, { entityType: 'User' })).toThrowError(
        SchemaValidationError
      );

      try {
        validateSchema(UserSchema, invalidData, { entityType: 'User' });
      } catch (err) {
        expect(err).toBeInstanceOf(SchemaValidationError);
        const schemaErr = err as SchemaValidationError;
        expect(schemaErr.entityType).toBe('User');
        expect(schemaErr.issues.length).toBeGreaterThan(0);
        expect(schemaErr.message).toContain('[unschema-graph] Invalid <User> schema:');
        expect(schemaErr.message).toContain('Property "User.age"');
        expect(schemaErr.details[0]).toMatchObject({
          code: 'too_small',
          path: 'User.age',
          received: -5,
        });
      }
    });

    it('logs warning and returns null when onError is "warn"', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const invalidData = { name: 123 };

      const result = validateSchema(UserSchema, invalidData, {
        entityType: 'User',
        onError: 'warn',
      });

      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain('[unschema-graph] Invalid <User> schema:');
      warnSpy.mockRestore();
    });

    it('returns null silently when onError is "silent"', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const invalidData = { name: 123 };

      const result = validateSchema(UserSchema, invalidData, {
        entityType: 'User',
        onError: 'silent',
      });

      expect(result).toBeNull();
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('safeValidateSchema', () => {
    it('returns success: true and data when valid', () => {
      const result = safeValidateSchema(UserSchema, { name: 'Bob', age: 25 });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: 'Bob', age: 25 });
      expect(result.error).toBeUndefined();
    });

    it('returns success: false and error when invalid', () => {
      const result = safeValidateSchema(UserSchema, { name: 'Bob' }, { entityType: 'User' });
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeInstanceOf(SchemaValidationError);
      expect(result.error?.entityType).toBe('User');
    });

    it('returns actionable structured details for invalid entity relationships', () => {
      const result = WebSite.safeParse({
        name: 'Acme',
        url: 'https://example.com',
        publisher: Product({ name: 'Keyboard' }),
      });

      expect(result.success).toBe(false);
      expect(result.error?.details).toEqual([
        {
          code: 'custom',
          path: 'WebSite.publisher',
          message: 'Invalid entity relationship',
          expected: 'Organization | Person | @id reference',
          received: 'Product',
          suggestion:
            "Pass Organization(...), Person(...), '#organization', or { '@id': '#organization' }.",
        },
      ]);
      expect(result.error?.message).toContain('Property "WebSite.publisher"');
      expect(result.error?.message).toContain('Expected: Organization | Person | @id reference');
      expect(result.error?.message).toContain('Received: Product');
    });
  });

  describe('formatZodError', () => {
    it('formats error without entityType properly', () => {
      const res = UserSchema.safeParse({});
      if (!res.success) {
        const formatted = formatZodError(res.error);
        expect(formatted).toContain('[unschema-graph] Invalid schema:');
        expect(formatted).toContain('Property "name"');
        expect(formatted).toContain('Property "age"');
      }
    });

    it('formats nested object and array paths cleanly', () => {
      const ComplexSchema = z.object({
        users: z.array(
          z.object({
            emails: z.array(z.string().email()),
          })
        ),
      });

      const res = ComplexSchema.safeParse({
        users: [{ emails: ['invalid-email'] }],
      });

      if (!res.success) {
        const formatted = formatZodError(res.error, 'Directory');
        expect(formatted).toContain('[unschema-graph] Invalid <Directory> schema:');
        expect(formatted).toContain('Property "Directory.users[0].emails[0]"');
      }
    });
  });
});
