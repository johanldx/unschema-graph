import { buildJsonLdGraph, serializeJsonLd } from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('Step 21 — Security Hardening, Prototype Safety & Non-Serializable Types', () => {
  describe('Sensitive keys and prototype safety', () => {
    it('safely handles Object.create(null) entities without prototype collisions', () => {
      const nullProtoObj = Object.create(null);
      nullProtoObj['@type'] = 'Organization';
      nullProtoObj['@id'] = '#org';
      nullProtoObj.name = 'Null Prototype Org';

      const graph = buildJsonLdGraph(nullProtoObj, { baseUrl: 'https://example.com' });
      expect(graph).toBeDefined();

      const serialized = serializeJsonLd(graph);
      expect(serialized).toContain('Null Prototype Org');
    });

    it('does not allow prototype pollution via __proto__, constructor, or prototype properties', () => {
      const untrustedPayload = {
        '@type': 'Organization',
        '@id': '#org',
        name: 'Safe Org',
        __proto__: { polluted: 'true' },
        constructor: { polluted: 'true' },
        prototype: { polluted: 'true' },
      };

      const graph = buildJsonLdGraph(untrustedPayload, { baseUrl: 'https://example.com' });
      expect(graph).toBeDefined();

      // Ensure global Object prototype was not compromised
      const plainObj: Record<string, unknown> = {};
      expect(plainObj.polluted).toBeUndefined();
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });
  });

  describe('Handling non-serializable values', () => {
    it('throws explicit unschema-graph TypeError when encountering BigInt', () => {
      expect(() => serializeJsonLd(100n)).toThrowError(
        /\[unschema-graph\] Cannot serialize BigInt/
      );

      const nested = {
        '@type': 'Product',
        name: 'Headphones',
        inventoryCount: 500n,
      };
      expect(() => serializeJsonLd(nested)).toThrowError(
        /\[unschema-graph\] Cannot serialize BigInt at property "inventoryCount"/
      );
    });

    it('throws explicit unschema-graph TypeError when encountering Symbol', () => {
      expect(() => serializeJsonLd(Symbol('id'))).toThrowError(
        /\[unschema-graph\] Cannot serialize Symbol/
      );

      const nested = {
        '@type': 'Product',
        tag: Symbol('secret'),
      };
      expect(() => serializeJsonLd(nested)).toThrowError(
        /\[unschema-graph\] Cannot serialize Symbol at property "tag"/
      );
    });

    it('throws explicit unschema-graph TypeError when encountering Function', () => {
      expect(() => serializeJsonLd(() => {})).toThrowError(
        /\[unschema-graph\] Cannot serialize Function/
      );

      const nested = {
        '@type': 'Product',
        computePrice: () => 10,
      };
      expect(() => serializeJsonLd(nested)).toThrowError(
        /\[unschema-graph\] Cannot serialize Function at property "computePrice"/
      );
    });

    it('throws explicit unschema-graph TypeError when encountering NaN or Infinity', () => {
      expect(() => serializeJsonLd(NaN)).toThrowError(
        /\[unschema-graph\] Cannot serialize invalid number \(NaN\)/
      );
      expect(() => serializeJsonLd(Infinity)).toThrowError(
        /\[unschema-graph\] Cannot serialize invalid number \(Infinity\)/
      );

      const nested = {
        '@type': 'Offer',
        price: NaN,
      };
      expect(() => serializeJsonLd(nested)).toThrowError(
        /\[unschema-graph\] Cannot serialize invalid number \(NaN\) at property "price"/
      );
    });
  });
});
