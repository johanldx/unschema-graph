import { escapeJsonLd, serializeJsonLd } from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('core/serialize', () => {
  describe('escapeJsonLd', () => {
    it('escapes <, >, &, and Unicode line/paragraph separators into unicode escape sequences', () => {
      const raw = '{"test":"<script>alert(1)&</script><!-- comment --> \u2028 \u2029"}';
      const escaped = escapeJsonLd(raw);

      expect(escaped).toBe(
        '{"test":"\\u003cscript\\u003ealert(1)\\u0026\\u003c/script\\u003e\\u003c!-- comment --\\u003e \\u2028 \\u2029"}'
      );
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).not.toContain('&');
      expect(escaped).not.toContain('\u2028');
      expect(escaped).not.toContain('\u2029');
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

    it('explicitly neutralizes all roadmap-targeted injection and Unicode sequences', () => {
      const payload = {
        scriptClosing: '</script>',
        scriptOpening: '<script>',
        commentOpening: '<!--',
        commentClosing: '-->',
        ampersand: '&',
        lessThan: '<',
        greaterThan: '>',
        lineSeparator: '\u2028',
        paragraphSeparator: '\u2029',
        mixed: '<!--</script><script>alert("&")</script>-->\u2028\u2029',
      };

      const result = serializeJsonLd(payload);

      // Raw dangerous sequences must not exist in output string
      expect(result).not.toContain('</script>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<!--');
      expect(result).not.toContain('-->');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('&');
      expect(result).not.toContain('\u2028');
      expect(result).not.toContain('\u2029');

      // Escaped representations must be used
      expect(result).toContain('\\u003c/script\\u003e');
      expect(result).toContain('\\u003cscript\\u003e');
      expect(result).toContain('\\u003c!--');
      expect(result).toContain('--\\u003e');
      expect(result).toContain('\\u0026');
      expect(result).toContain('\\u003c');
      expect(result).toContain('\\u003e');
      expect(result).toContain('\\u2028');
      expect(result).toContain('\\u2029');

      // JSON parsing round-trip restores the exact original values
      expect(JSON.parse(result)).toEqual(payload);
    });

    it('preserves all escaping guarantees when pretty and indent options are used', () => {
      const payload = {
        title: 'Safe <&> Title',
        body: 'Line 1\u2028Line 2\u2029End',
        snippet: '<!-- snippet </script> -->',
      };

      const resultDefaultIndent = serializeJsonLd(payload, { pretty: true });
      const resultCustomIndent = serializeJsonLd(payload, { pretty: true, indent: 4 });

      for (const res of [resultDefaultIndent, resultCustomIndent]) {
        expect(res).not.toContain('<');
        expect(res).not.toContain('>');
        expect(res).not.toContain('&');
        expect(res).not.toContain('\u2028');
        expect(res).not.toContain('\u2029');
        expect(res).not.toContain('</script>');
        expect(res).not.toContain('<!--');
        expect(res).not.toContain('-->');

        expect(res).toContain('\\u003c');
        expect(res).toContain('\\u003e');
        expect(res).toContain('\\u0026');
        expect(res).toContain('\\u2028');
        expect(res).toContain('\\u2029');

        expect(JSON.parse(res)).toEqual(payload);
      }

      expect(resultDefaultIndent).toContain('\n  "title":');
      expect(resultCustomIndent).toContain('\n    "title":');
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
