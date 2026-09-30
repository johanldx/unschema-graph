import { escapeJsonLd, serializeJsonLd } from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('core/serialize', () => {
  describe('escapeJsonLd', () => {
    it('escapes <, >, and & into unicode escape sequences', () => {
      const raw = '{"test":"<script>alert(1)&</script>"}';
      const escaped = escapeJsonLd(raw);

      expect(escaped).toBe('{"test":"\\u003cscript\\u003ealert(1)\\u0026\\u003c/script\\u003e"}');
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).not.toContain('&');
    });

    it('leaves safe strings unmodified', () => {
      const safe = '{"name":"Astro Schema Graph","version":"1.0.0"}';
      expect(escapeJsonLd(safe)).toBe(safe);
    });
  });

  describe('serializeJsonLd', () => {
    it('serializes a basic object into valid JSON-LD', () => {
      const data = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Test Headline',
      };

      const result = serializeJsonLd(data);
      expect(result).toBe(
        '{"@context":"https://schema.org","@type":"Article","headline":"Test Headline"}'
      );
      expect(JSON.parse(result)).toEqual(data);
    });

    it('formats with indentation when pretty is true', () => {
      const data = { '@type': 'Thing', name: 'Item' };
      const result = serializeJsonLd(data, { pretty: true, indent: 2 });

      expect(result).toBe('{\n  "@type": "Thing",\n  "name": "Item"\n}');
      expect(JSON.parse(result)).toEqual(data);
    });

    it('neutralizes malicious XSS payloads while preserving JSON parity', () => {
      const malicious = {
        '@type': 'Comment',
        text: '</script><script>alert("pwned")</script>',
        htmlTag: '<img src=x onerror=alert(1)>',
        entity: 'Tom & Jerry',
      };

      const result = serializeJsonLd(malicious);

      // Verify dangerous HTML characters are sanitized
      expect(result).not.toContain('</script>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('&');

      // Verify unicode escaping is in place
      expect(result).toContain('\\u003c/script\\u003e');
      expect(result).toContain('\\u0026');

      // Crucial: JSON parser parses unicode escapes back to original characters
      const parsed = JSON.parse(result);
      expect(parsed).toEqual(malicious);
    });

    it('handles undefined by returning an empty JSON object string', () => {
      expect(serializeJsonLd(undefined)).toBe('{}');
    });

    it('throws TypeError when given circular references', () => {
      const circular: Record<string, unknown> = { name: 'loop' };
      circular.self = circular;

      expect(() => serializeJsonLd(circular)).toThrowError(TypeError);
    });
  });
});
